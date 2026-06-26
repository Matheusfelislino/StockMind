import logging
import sys

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    stream=sys.stdout,
)

logger = logging.getLogger(__name__)

from app.consumer import nightly_forecast_consumer  # noqa: E402


def main() -> None:
    logger.info("StockMind AI Engine starting up")

    try:
        nightly_forecast_consumer.start_consuming()
    except KeyboardInterrupt:
        logger.info("Shutdown signal received — AI Engine stopping gracefully")
    except Exception as e:
        logger.critical(
            "AI Engine terminated with unexpected error: %s", e, exc_info=True
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
