package com.stockmind.messaging.consumer;

import com.stockmind.domain.forecast.ForecastService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ForecastResultConsumer {

    private static final Logger log = LoggerFactory.getLogger(ForecastResultConsumer.class);

    private final ForecastService forecastService;

    @RabbitListener(queues = "${stockmind.rabbitmq.queues.forecast-result}")
    public void consume(List<Map<String, Object>> forecasts) {
        log.info("[FORECAST-CONSUMER] Recebidas {} previsões do motor de IA — iniciando persistência.",
                forecasts.size());

        forecasts.forEach(f -> log.info(
                "[FORECAST-CONSUMER] Previsão recebida — produto_id={} | loja_id={} | data={} | qtd_prevista={} | confiança={}",
                f.get("product_id"), f.get("store_id"),
                f.get("target_date"), f.get("predicted_quantity"), f.get("confidence_score")
        ));

        try {
            forecastService.saveBatch(forecasts);
            log.info("[FORECAST-CONSUMER] Lote de {} previsões persistido com sucesso.", forecasts.size());
        } catch (Exception e) {
            log.error("[FORECAST-CONSUMER] Falha ao persistir lote de previsões — mensagem será reprocessada ou encaminhada à DLQ.", e);
            throw e;
        }
    }
}
