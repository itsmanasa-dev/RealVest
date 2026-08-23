import pytest
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score
from src.analytics.comparison import compare_properties
from src.analytics.hpi_analytics import get_hpi_trend_analysis

def test_calculate_rental_yield():
    res = calculate_rental_yield(25000, 60.0) # 25k/mo rent, 60L price -> 300k/6M = 5.0%
    assert res['rental_yield_pct'] == 5.0
    assert res['tier'] == 'High'

def test_classify_property_deal():
    res_under = classify_property_deal(60.0, 80.0)
    assert res_under['status'] == 'Potentially Undervalued'
    
    res_over = classify_property_deal(90.0, 75.0)
    assert res_over['status'] == 'Potentially Overpriced'
    
    res_fair = classify_property_deal(80.0, 80.0)
    assert res_fair['status'] == 'Fairly Priced'

def test_calculate_investment_score():
    score_res = calculate_investment_score(60.0, 80.0, 5.2)
    assert 0 <= score_res['total_score'] <= 100
    assert len(score_res['breakdown']) == 4

def test_compare_properties():
    props = [
        {'name': 'Prop 1', 'location': 'Whitefield', 'total_sqft': 1200, 'bhk': 2, 'asking_price_lakhs': 70.0},
        {'name': 'Prop 2', 'location': 'Electronic City', 'total_sqft': 1100, 'bhk': 2, 'asking_price_lakhs': 45.0}
    ]
    res = compare_properties(props)
    assert 'comparison_df' in res
    assert len(res['comparison_df']) == 2

def test_hpi_analytics():
    hpi_res = get_hpi_trend_analysis()
    assert 'latest_hpi' in hpi_res
    assert hpi_res['total_growth_%'] > 0
