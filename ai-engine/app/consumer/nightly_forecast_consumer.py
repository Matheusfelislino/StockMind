import json
import logging
import os

import pika
from dotenv import load_dotenv

from app.config.rabbitmq_config import get_connection
from app.forecasting import data_prep, prophet_model
from app.publisher import forecast_publisher, recommendation_publisher

load_dotenv()

logger = logging.getLogger(__name__)

_QUEUE = os.getenv("QUEUE_NIGHTLY_FORECAST_TRIGGER", "queue.nightly.forecast.trigger")


def _callback(
    channel: pika.adapters.blocking_connection.BlockingChannel,
    method: pika.spec.Basic.Deliver,
    properties: pika.spec.BasicProperties,
    body: bytes,
) -> None:
    try:
        payload = json.loads(body)
        event = payload.get("event")
        date = payload.get("date")
        logger.info("Received trigger event '%s' for date '%s'", event, date)

        data = data_prep.extract_data(date)
        results = prophet_model.run_forecast(data)

        forecast_publisher.publish(results["forecasts"], channel)
        recommendation_publisher.publish(results["recommendations"], channel)

        # Ack apenas após publicação bem-sucedida de forecasts e recomendações
        channel.basic_ack(delivery_tag=method.delivery_tag)
        logger.info(
            "Nightly forecast trigger processed and acknowledged successfully",
        )

    except Exception as e:
        logger.error(
            "Failed to process nightly forecast trigger: %s", e, exc_info=True
        )
        # nack sem requeue — mensagem vai para a DLQ configurada no Java
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def start_consuming() -> None:
    connection = get_connection()
    channel = connection.channel()
    channel.basic_qos(prefetch_count=1)

    # Garante que a fila exista antes de tentar consumir
    channel.queue_declare(queue=_QUEUE, durable=True)
    channel.basic_consume(queue=_QUEUE, on_message_callback=_callback)

    logger.info(
        "AI Engine consumer started. Waiting for messages on queue '%s'", _QUEUE
    )
    channel.start_consuming()
