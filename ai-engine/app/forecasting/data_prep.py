import logging
from datetime import datetime, timedelta

import pandas as pd
from dotenv import load_dotenv

from app.config.database_config import get_engine

load_dotenv()

logger = logging.getLogger(__name__)


def extract_data(reference_date: str) -> dict:
    try:
        engine = get_engine()
        ref_dt = datetime.strptime(reference_date, "%Y-%m-%d")
        start_date = (ref_dt - timedelta(days=365)).strftime("%Y-%m-%d")

        df_sales = pd.read_sql(
            """
            SELECT
                store_id::text   AS store_id,
                product_id::text AS product_id,
                sale_date,
                quantity_sold,
                unit_price
            FROM tb_sales_history
            WHERE sale_date >= %(start_date)s
            ORDER BY store_id, product_id, sale_date
            """,
            con=engine,
            params={"start_date": start_date},
        )
        logger.info(
            "Extracted %d records from tb_sales_history (since %s)",
            len(df_sales), start_date,
        )

        df_inventory = pd.read_sql(
            """
            SELECT
                store_id::text   AS store_id,
                product_id::text AS product_id,
                batch_number,
                expiration_date,
                quantity
            FROM tb_inventory_lots
            WHERE quantity > 0
            """,
            con=engine,
        )
        logger.info(
            "Extracted %d records from tb_inventory_lots", len(df_inventory)
        )

        df_products = pd.read_sql(
            """
            SELECT
                id::text   AS product_id,
                ean,
                name,
                curve_category,
                cost_price,
                sale_price
            FROM tb_products
            WHERE active = true
            ORDER BY
                CASE curve_category WHEN 'A' THEN 1 WHEN 'B' THEN 2 ELSE 3 END
            """,
            con=engine,
        )
        logger.info(
            "Extracted %d records from tb_products", len(df_products)
        )

        df_stores = pd.read_sql(
            """
            SELECT
                id::text AS store_id,
                name
            FROM tb_stores
            WHERE active = true
            """,
            con=engine,
        )
        logger.info("Extracted %d records from tb_stores", len(df_stores))

        return {
            "sales": df_sales,
            "inventory": df_inventory,
            "products": df_products,
            "stores": df_stores,
        }

    except Exception as e:
        logger.error("Failed to extract data from database: %s", e, exc_info=True)
        raise
