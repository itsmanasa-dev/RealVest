import pytest
from src.models.predict import predict_property_price, predict_rent_price

def test_predict_property_price():
    res = predict_property_price('Whitefield', 1200, 2, bath=2)
    assert 'estimated_price_lakhs' in res
    assert res['estimated_price_lakhs'] > 0
    assert res['price_range_lower'] <= res['estimated_price_lakhs']
    assert res['price_range_upper'] >= res['estimated_price_lakhs']

def test_predict_rent_price():
    res = predict_rent_price('Whitefield', 1200, 2, bathrooms=2)
    assert 'estimated_rent_monthly' in res
    assert res['estimated_rent_monthly'] > 0
    assert res['rent_range_lower'] <= res['estimated_rent_monthly']
    assert res['rent_range_upper'] >= res['estimated_rent_monthly']
