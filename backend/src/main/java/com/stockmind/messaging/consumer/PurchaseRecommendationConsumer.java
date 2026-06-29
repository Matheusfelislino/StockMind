package com.stockmind.messaging.consumer;

import com.stockmind.domain.recommendation.PurchaseRecommendationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PurchaseRecommendationConsumer {

    private static final Logger log = LoggerFactory.getLogger(PurchaseRecommendationConsumer.class);

    private final PurchaseRecommendationService purchaseRecommendationService;

    @RabbitListener(queues = "${stockmind.rabbitmq.queues.purchase-recommendation}")
    public void consume(List<Map<String, Object>> recommendations) {
        log.info("[RECOMENDACAO-CONSUMER] Recebidas {} recomendações de compra do motor de IA — iniciando persistência.",
                recommendations.size());

        recommendations.forEach(r -> log.info(
                "[RECOMENDACAO-CONSUMER] Recomendação recebida e salva para o produto ID: {} | loja_id={} | qtd_sugerida={} | impacto_financeiro=R${}",
                r.get("product_id"), r.get("store_id"),
                r.get("suggested_quantity"), r.get("financial_impact")
        ));

        try {
            purchaseRecommendationService.saveBatch(recommendations);
            log.info("[RECOMENDACAO-CONSUMER] Lote de {} recomendações de compra persistido com sucesso.", recommendations.size());
        } catch (Exception e) {
            log.error("[RECOMENDACAO-CONSUMER] Falha ao persistir lote de recomendações — mensagem será reprocessada ou encaminhada à DLQ.", e);
            throw e;
        }
    }
}
