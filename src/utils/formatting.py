from src.utils.validation import safe_float, safe_int

def format_currency_lakhs(val, decimals=1):
    """
    Safely format Lakhs INR currency.
    Example: 68.5 -> "₹68.5 L" or "₹62 L"
    """
    num = safe_float(val, default=0.0)
    if decimals == 0:
        return f"₹{num:,.0f} L"
    return f"₹{num:,.{decimals}f} L"

def format_rent(val):
    """
    Safely format monthly rent.
    Example: 28000 -> "₹28K/month"
    """
    num = safe_float(val, default=0.0)
    if num >= 1000:
        k_val = num / 1000.0
        if k_val.is_integer():
            return f"₹{int(k_val)}K/month"
        return f"₹{k_val:.1f}K/month"
    return f"₹{num:,.0f}/month"

def format_number(val, decimals=1, suffix=""):
    """
    Safely format generic float/int number.
    Prevents ValueError: Unknown format code 'f' for str.
    """
    num = safe_float(val, default=0.0)
    if decimals == 0:
        formatted = f"{safe_int(num):,d}"
    else:
        formatted = f"{num:,.{decimals}f}"
    if suffix:
        return f"{formatted}{suffix}"
    return formatted

def format_percentage(val, decimals=1):
    """
    Safely format percentages.
    Example: 5.4 -> "5.4%"
    """
    num = safe_float(val, default=0.0)
    return f"{num:.{decimals}f}%"
