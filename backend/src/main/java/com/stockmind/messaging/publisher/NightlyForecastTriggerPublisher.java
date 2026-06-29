package com.stockmind.messaging.publisher;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class NightlyForecastTriggerPublisher {

    private static final Logger log = LoggerFactory.getLogger(NightlyForecastTriggerPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    @Value("${stockmind.rabbitmq.exchange}")
    private String exchange;

    public void publishTrigger() {
        Map<String, String> payload = Map.of(
                "event", "start_nightly_forecast",
                "date", LocalDate.now().toString()
        );

        rabbitTemplate.convertAndSend(exchange, "daily.data.sync", payload);

        log.info("Trigger de previsão noturna publicado — exchange='{}', data='{}'",
                exchange, payload.get("date"));
    }
}
