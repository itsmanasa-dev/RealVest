import logging
import functools
from src.translations import t

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RealVest")

def handle_user_errors(default_msg=None, lang='English'):
    """
    Decorator to wrap functions and prevent unhandled exceptions from leaking.
    Uses centralized t() for multilingual error messages and robust logging.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                logger.error(f"Error in {func.__name__}: {str(e)}", exc_info=True)
                msg = default_msg if default_msg else t('error_generic', lang)
                logger.warning(f"User message: {msg}")
                return None
        return wrapper
    return decorator
