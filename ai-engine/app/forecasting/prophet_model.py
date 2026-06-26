import logging
import os

import pandas as pd
from dotenv import load_dotenv
from prophet import Prophet

load_dotenv()

logger = logging.getLogger(__name__)

_FORECAST_HORIZON_DAYS = int(os.getenv("FORECAST_HORIZON_DAYS", "30"))
_MIN_HISTORY_RECORDS = 30


def run_forecast(data: dict) -> dict:
    df_sales = data["sales"]
    df_inventory = data["inventory"]
    df_products = data["products"]

    # Mapa de custo por product_id para calcular financial_impact nas recomendações
    cost_by_product: dict = (
        df_products.set_index("product_id")["cost_price"]
        .apply(float)
        .to_dict()
    )

    # Estoque atual consolidado por (store_id, product_id)
    df_stock = (
        df_inventory
        .groupby(["store_id", "product_id"])["quantity"]
        .sum()
        .reset_index()
        .rename(columns={"quantity": "current_stock"})
    )

    forecasts: list = []
    recommendations: list = []

    groups = df_sales.groupby(["store_id", "product_id"])

    for (store_id, product_id), group in groups:
        if len(group) < _MIN_HISTORY_RECORDS:
            logger.warning(
                "Skipping store=%s product=%s — only %d historical records (minimum: %d)",
                store_id, product_id, len(group), _MIN_HISTORY_RECORDS,
            )
            continue

        try:
            df_prophet = _prepare_prophet_input(group)

            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
            )
            model.fit(df_prophet)

            future = model.make_future_dataframe(periods=_FORECAST_HORIZON_DAYS)
            forecast_df = model.predict(future)

            # Apenas o horizonte futuro (exclui o histórico da série)
            future_only = forecast_df.tail(_FORECAST_HORIZON_DAYS)

            total_predicted = max(0, int(future_only["yhat"].sum()))
            confidence_score = _calculate_confidence(future_only)
            target_date = future_only["ds"].iloc[-1].strftime("%Y-%m-%d")

            # predicted_quantity representa o total para o último dia do horizonte
            daily_predicted = max(0, int(future_only["yhat"].iloc[-1]))

            forecasts.append({
                "store_id": store_id,
                "product_id": product_id,
                "target_date": target_date,
                "predicted_quantity": daily_predicted,
                "confidence_score": confidence_score,
            })

            # Geração de recomendação de compra se estoque insuficiente
            stock_row = df_stock[
                (df_stock["store_id"] == store_id)
                & (df_stock["product_id"] == product_id)
            ]
            current_stock = (
                int(stock_row["current_stock"].values[0]) if not stock_row.empty else 0
            )

            if current_stock < total_predicted:
                suggested_quantity = total_predicted - current_stock
                cost_price = cost_by_product.get(product_id, 0.0)
                financial_impact = round(suggested_quantity * cost_price, 2)

                daily_avg = total_predicted / _FORECAST_HORIZON_DAYS
                days_covered = int(current_stock / daily_avg) if daily_avg > 0 else 0

                rationale = (
                    f"Demanda prevista de {total_predicted} unidades nos próximos "
                    f"{_FORECAST_HORIZON_DAYS} dias. "
                    f"Estoque atual cobre apenas {days_covered} dias."
                )

                recommendations.append({
                    "store_id": store_id,
                    "product_id": product_id,
                    "suggested_quantity": suggested_quantity,
                    "financial_impact": financial_impact,
                    "rationale": rationale,
                })

        except Exception as e:
            logger.error(
                "Failed to run forecast for store=%s product=%s: %s",
                store_id, product_id, e, exc_info=True,
            )
            continue

    logger.info(
        "Forecast complete — %d forecasts generated, %d purchase recommendations",
        len(forecasts), len(recommendations),
    )

    return {"forecasts": forecasts, "recommendations": recommendations}


def _prepare_prophet_input(group: pd.DataFrame) -> pd.DataFrame:
    df = (
        group[["sale_date", "quantity_sold"]]
        .rename(columns={"sale_date": "ds", "quantity_sold": "y"})
        .copy()
    )
    # Remove timezone para o Prophet, que não aceita tz-aware datetimes
    df["ds"] = pd.to_datetime(df["ds"]).dt.tz_localize(None)
    # Agrega por dia caso haja múltiplas vendas no mesmo dia
    return df.groupby("ds")["y"].sum().reset_index()


def _calculate_confidence(future_df: pd.DataFrame) -> float:
    yhat_mean = future_df["yhat"].mean()
    interval_width = (future_df["yhat_upper"] - future_df["yhat_lower"]).mean()
    # Quanto menor o intervalo relativo à média, maior a confiança
    relative_uncertainty = interval_width / (abs(yhat_mean) + 1e-9)
    score = max(0.0, min(1.0, 1.0 - relative_uncertainty * 0.5))
    return round(score, 4)
