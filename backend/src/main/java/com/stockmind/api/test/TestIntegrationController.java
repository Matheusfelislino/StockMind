package com.stockmind.api.test;

import com.stockmind.messaging.publisher.NightlyForecastTriggerPublisher;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Endpoint exclusivo para testes locais de integração.
 * Permite acionar o fluxo Java → RabbitMQ → Python → RabbitMQ → Java
 * sem esperar o agendador das 01:00h.
 *
 * NÃO expor em produção — proteger com perfil Spring ou remover antes do deploy.
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestIntegrationController {

    private static final Logger log = LoggerFactory.getLogger(TestIntegrationController.class);

    private final NightlyForecastTriggerPublisher forecastTriggerPublisher;

    @Value("${stockmind.rabbitmq.exchange}")
    private String exchange;

    /**
     * Dispara o mesmo evento que o NightlyDataSyncScheduler envia às 01:00h.
     * O Python consome a mensagem, roda o Prophet, e publica forecasts + recomendações
     * de volta nas filas Java.
     *
     * Uso:
     *   POST http://localhost:8080/api/test/trigger-forecast
     */
    @PostMapping("/trigger-forecast")
    public ResponseEntity<TriggerResponse> triggerForecast() {
        String date = LocalDate.now().toString();

        log.info("[TEST] =====================================================");
        log.info("[TEST] Trigger manual de forecast disparado para a data '{}'", date);
        log.info("[TEST] Exchange: '{}' | Routing Key: 'daily.data.sync'", exchange);
        log.info("[TEST] =====================================================");

        forecastTriggerPublisher.publishTrigger();

        TriggerResponse response = TriggerResponse.builder()
                .event("start_nightly_forecast")
                .date(date)
                .exchange(exchange)
                .routingKey("daily.data.sync")
                .triggeredAt(LocalDateTime.now().toString())
                .message("Trigger publicado com sucesso. O motor de IA (Python) deve processar em instantes " +
                         "e publicar os resultados nas filas 'forecast.result.generated' e " +
                         "'purchase.recommendation.created'.")
                .build();

        return ResponseEntity.ok(response);
    }

    @Data
    @Builder
    public static class TriggerResponse {
        private String event;
        private String date;
        private String exchange;
        private String routingKey;
        private String triggeredAt;
        private String message;
    }
}
