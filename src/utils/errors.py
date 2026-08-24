import logging
import functools
import streamlit as st

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RealVest")

def handle_user_errors(default_msg="Something went wrong while calculating this result. Please try again."):
    """
    Decorator to wrap UI functions and prevent tracebacks from leaking to the end user.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                logger.error(f"Error in {func.__name__}: {str(e)}", exc_info=True)
                st.error(f"⚠️ {default_msg}")
                return None
        return wrapper
    return decorator
