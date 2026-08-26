import logging
import functools
import streamlit as st
from src.translations import t

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RealVest")

def handle_user_errors(default_msg=None):
    """
    Decorator to wrap UI functions and prevent tracebacks from leaking to the end user.
    Uses centralized t() for multilingual error messages.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                logger.error(f"Error in {func.__name__}: {str(e)}", exc_info=True)
                lang = st.session_state.get('language', 'English')
                msg = default_msg if default_msg else t('error_generic', lang)
                st.error(f"⚠️ {msg}")
                return None
        return wrapper
    return decorator
