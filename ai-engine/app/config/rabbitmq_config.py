import logging
import os

import pika
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_HOST = os.getenv("RABBITMQ_HOST", "localhost")
_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
_USER = os.getenv("RABBITMQ_USER", "stockmind")
_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "stockmind")


def get_connection() -> pika.BlockingConnection:
    credentials = pika.PlainCredentials(_USER, _PASSWORD)
    parameters = pika.ConnectionParameters(
        host=_HOST,
        port=_PORT,
        credentials=credentials,
        heartbeat=600,
        blocked_connection_timeout=300,
    )
    connection = pika.BlockingConnection(parameters)
    logger.info("Conexão com RabbitMQ estabelecida em %s:%s", _HOST, _PORT)
    return connection


def get_channel() -> pika.adapters.blocking_connection.BlockingChannel:
    connection = get_connection()
    channel = connection.channel()
    # Processa uma mensagem por vez — evita sobrecarga do consumer
    channel.basic_qos(prefetch_count=1)
    return channel
