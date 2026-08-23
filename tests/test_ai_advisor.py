import pytest
from src.ai.query_parser import parse_natural_language_query
from src.ai.recommendation_engine import recommend_properties

def test_parse_natural_language_query():
    query = "Find me a 2 BHK property under 60 lakh in Whitefield with good rental yield"
    filters = parse_natural_language_query(query)
    assert filters['max_price'] == 60.0
    assert filters['min_bhk'] == 2
    assert filters['location'] == 'Whitefield'
    assert filters['min_yield'] == 3.5

def test_recommend_properties():
    res = recommend_properties("2 BHK under 80 lakh in Whitefield", top_n=3)
    assert 'parsed_filters' in res
    assert 'recommendations' in res
    assert len(res['recommendations']) > 0
