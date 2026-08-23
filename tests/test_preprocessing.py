import pytest
import os
import pandas as pd
from src.preprocessing.clean_house_prices import convert_sqft_to_float, parse_bhk
from src.preprocessing.clean_rental_prices import preprocess_rental_prices

def test_parse_bhk():
    assert parse_bhk("2 BHK") == 2
    assert parse_bhk("4 Bedroom") == 4
    assert parse_bhk("1 RK") == 1

def test_convert_sqft_to_float():
    assert convert_sqft_to_float("1200") == 1200.0
    assert convert_sqft_to_float("1000 - 1200") == 1100.0
    assert convert_sqft_to_float("10 Sq. Meter") == pytest.approx(107.639, 0.1)

def test_rental_prices_preprocessing():
    df_rent = preprocess_rental_prices()
    assert isinstance(df_rent, pd.DataFrame)
    assert len(df_rent) > 0
    # Verify city filtering
    assert (df_rent['city'].str.lower() == 'bangalore').all()
