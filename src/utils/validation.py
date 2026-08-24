import math
import numpy as np

def safe_float(val, default=0.0):
    """
    Safely converts any input (str, int, float, None, NaN) to float.
    Returns default if conversion fails or if value is NaN/Inf.
    """
    if val is None:
        return float(default)
    try:
        # If input is string with currency symbols or commas, clean it
        if isinstance(val, str):
            cleaned = val.replace('₹', '').replace(',', '').replace('L', '').replace('k', '').replace('K', '').strip()
            if not cleaned:
                return float(default)
            res = float(cleaned)
        else:
            res = float(val)
        
        if math.isnan(res) or math.isinf(res):
            return float(default)
        return res
    except (ValueError, TypeError):
        return float(default)

def safe_int(val, default=0):
    """
    Safely converts input to int.
    """
    f_val = safe_float(val, default=default)
    try:
        return int(round(f_val))
    except (ValueError, TypeError, OverflowError):
        return int(default)

def safe_str(val, default=""):
    """
    Safely converts input to string.
    """
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return str(default)
    return str(val).strip()
