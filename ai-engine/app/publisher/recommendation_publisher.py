import json
import logging
import os

import pika
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "stockmind.intelligence.exchange")
_ROUTING_KEY = "purchase.recommendation.created"


def publish(
    recommendations: list,
    channel: pika.adapters.blocking_connection.BlockingChannel,
) -> None:
    try:
        body = json.dumps(recommendations, ensure_ascii=False, default=str)

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
            "Published %d purchase recommendations to exchange '%s' (routing key: '%s')",
            len(recommendations), _EXCHANGE, _ROUTING_KEY,
        )

    except Exception as e:
        logger.error("Failed to publish purchase recommendations: %s", e, exc_info=True)
        raise
