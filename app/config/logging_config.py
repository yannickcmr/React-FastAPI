""" Default Logging Config """
import logging

def create_logger() -> logging.Logger:
    """ Generate Default Logging Setup """
    logging.basicConfig(level=logging.INFO)
    return logging.getLogger(__name__)
