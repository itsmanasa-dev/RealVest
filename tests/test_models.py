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

def test_get_hpi_forecast():
    from src.models.predict import get_hpi_forecast
    res = get_hpi_forecast()
    assert 'forecast_series' in res
    assert len(res['forecast_series']) >= 8  # 2025 and 2026 quarters
    for item in res['forecast_series']:
        assert 'quarter' in item
        assert 'forecastHpi' in item
        assert 'confidenceInterval' in item
        assert len(item['confidenceInterval']) == 2
        assert item['confidenceInterval'][0] <= item['confidenceInterval'][1]

