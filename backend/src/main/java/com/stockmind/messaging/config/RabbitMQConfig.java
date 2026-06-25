package com.stockmind.messaging.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${stockmind.rabbitmq.exchange}")
    private String exchange;

    @Value("${stockmind.rabbitmq.queues.nightly-forecast-trigger}")
    private String nightlyForecastTriggerQueue;

    @Value("${stockmind.rabbitmq.queues.forecast-result}")
    private String forecastResultQueue;

    @Value("${stockmind.rabbitmq.queues.purchase-recommendation}")
    private String purchaseRecommendationQueue;

    @Value("${stockmind.rabbitmq.dead-letter.exchange}")
    private String dlxExchange;

    @Value("${stockmind.rabbitmq.dead-letter.queue}")
    private String dlxQueue;

    // ================================================
    // EXCHANGES
    // ================================================

    @Bean
    public TopicExchange stockmindExchange() {
        return new TopicExchange(exchange, true, false);
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(dlxExchange, true, false);
    }

    // ================================================
    // FILAS PRINCIPAIS
    // ================================================

    @Bean
    public Queue nightlyForecastTriggerQueue() {
        return QueueBuilder.durable(nightlyForecastTriggerQueue)
                .withArgument("x-dead-letter-exchange", dlxExchange)
                .withArgument("x-dead-letter-routing-key", "dead.letter")
                .build();
    }

    @Bean
    public Queue forecastResultQueue() {
        return QueueBuilder.durable(forecastResultQueue)
                .withArgument("x-dead-letter-exchange", dlxExchange)
                .withArgument("x-dead-letter-routing-key", "dead.letter")
                .build();
    }

    @Bean
    public Queue purchaseRecommendationQueue() {
        return QueueBuilder.durable(purchaseRecommendationQueue)
                .withArgument("x-dead-letter-exchange", dlxExchange)
                .withArgument("x-dead-letter-routing-key", "dead.letter")
                .build();
    }

    // ================================================
    // FILA DEAD LETTER
    // ================================================

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(dlxQueue).build();
    }

    // ================================================
    // BINDINGS — Liga filas ao exchange
    // ================================================

    @Bean
    public Binding nightlyForecastTriggerBinding() {
        return BindingBuilder
                .bind(nightlyForecastTriggerQueue())
                .to(stockmindExchange())
                .with("daily.data.sync");
    }

    @Bean
    public Binding forecastResultBinding() {
        return BindingBuilder
                .bind(forecastResultQueue())
                .to(stockmindExchange())
                .with("forecast.result.generated");
    }

    @Bean
    public Binding purchaseRecommendationBinding() {
        return BindingBuilder
                .bind(purchaseRecommendationQueue())
                .to(stockmindExchange())
                .with("purchase.recommendation.created");
    }

    @Bean
    public Binding deadLetterBinding() {
        return BindingBuilder
                .bind(deadLetterQueue())
                .to(deadLetterExchange())
                .with("dead.letter");
    }

    // ================================================
    // SERIALIZAÇÃO — JSON em vez de Java serializado
    // ================================================

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory =
                new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter());
        return factory;
    }

}