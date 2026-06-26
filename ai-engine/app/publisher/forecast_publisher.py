import json
import logging
import os

import pika
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "stockmind.intelligence.exchange")
_ROUTING_KEY = "forecast.result.generated"


def publish(
    forecasts: list,
    channel: pika.adapters.blocking_connection.BlockingChannel,
) -> None:
    try:
        body = json.dumps(forecasts, ensure_ascii=False, default=str)

        channel.basic_publish(
            exchange=_EXCHANGE,
            routing_key=_ROUTING_KEY,
            body=body,
            properties=pika.BasicProperties(
                delivery_mode=2,
                content_type="application/json",
            ),
        )

        logger.info(
            "Published %d forecasts to exchange '%s' (routing key: '%s')",
            len(forecasts), _EXCHANGE, _ROUTING_KEY,
        )

    except Exception as e:
        logger.error("Failed to publish forecasts: %s", e, exc_info=True)
        raise
