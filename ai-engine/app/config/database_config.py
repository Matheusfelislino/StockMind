import logging
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Connection, Engine

load_dotenv()

logger = logging.getLogger(__name__)

_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://stockmind:stockmind@localhost:5432/stockmind",
)


def get_engine() -> Engine:
    # default_transaction_read_only garante que nenhuma escrita acidental ocorra
    engine = create_engine(
        _DATABASE_URL,
        connect_args={"options": "-c default_transaction_read_only=on"},
        pool_pre_ping=True,
    )
    logger.info("Engine SQLAlchemy criada no modo read-only para %s", _DATABASE_URL.split("@")[-1])
    return engine


def get_connection() -> Connection:
    return get_engine().connect()
