import pytest
from src.utils.validation import safe_float, safe_int, safe_str
from src.utils.formatting import format_currency_lakhs, format_rent, format_number, format_percentage

def test_safe_float():
    assert safe_float(50.5) == 50.5
    assert safe_float("68.5 L") == 68.5
    assert safe_float("₹62.0") == 62.0
    assert safe_float(None, default=10.0) == 10.0
    assert safe_float("invalid", default=5.0) == 5.0

def test_safe_int():
    assert safe_int(5) == 5
    assert safe_int("10") == 10
    assert safe_int(None, default=2) == 2

def test_safe_formatting():
    # Verify no ValueError: Unknown format code 'f' for object of type 'str'
    assert format_currency_lakhs("68.5") == "₹68.5 L"
    assert format_rent("28000") == "₹28K/month"
    assert format_number("1250", decimals=0) == "1,250"
    assert format_percentage("5.4") == "5.4%"
