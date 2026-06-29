package com.stockmind.scheduler;

import com.stockmind.messaging.publisher.NightlyForecastTriggerPublisher;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NightlyDataSyncScheduler {

    private static final Logger log = LoggerFactory.getLogger(NightlyDataSyncScheduler.class);

    private final NightlyForecastTriggerPublisher triggerPublisher;

    @Scheduled(cron = "${stockmind.scheduler.nightly-forecast.cron}")
    public void runNightlySync() {
        log.info("Iniciando sincronização noturna — publicando trigger para o motor de IA");

        try {
            triggerPublisher.publishTrigger();
            log.info("Trigger de sincronização noturna publicado com sucesso");
        } catch (Exception e) {
            // Erro isolado para não derrubar a aplicação — próxima execução será tentada normalmente
            log.error("Falha ao publicar trigger de sincronização noturna", e);
        }
    }
}
