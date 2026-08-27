import os
import sys
import joblib
import pandas as pd
import numpy as np

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

MODELS_DIR = os.path.join(ROOT_DIR, 'models')

_price_model_cache = None
_rent_model_cache = None

def get_price_model():
    global _price_model_cache
    if _price_model_cache is None:
        path = os.path.join(MODELS_DIR, 'price_model.joblib')
        if not os.path.exists(path):
            from src.models.train_models import train_price_model
            _price_model_cache = train_price_model()
        else:
            _price_model_cache = joblib.load(path)
    return _price_model_cache

def get_rent_model():
    global _rent_model_cache
    if _rent_model_cache is None:
        path = os.path.join(MODELS_DIR, 'rent_model.joblib')
        if not os.path.exists(path):
            from src.models.train_models import train_rent_model
            _rent_model_cache = train_rent_model()
        else:
            _rent_model_cache = joblib.load(path)
    return _rent_model_cache

def predict_property_price(location, total_sqft, bhk, bath=None, balcony=None, area_type='Super built-up Area', is_ready=1):
    """
    Predict property price in Lakhs INR.
    Returns dict with estimated_price_lakhs, price_range_lower, price_range_upper, price_inr, metrics.
    """
    m_data = get_price_model()
    preprocessor = m_data['preprocessor']
    model = m_data['model']
    top_locations = m_data['top_locations']
    mae = m_data['metrics']['mae']
    
    # Defaults
    if bath is None or bath <= 0:
        bath = float(bhk)
    if balcony is None or balcony < 0:
        balcony = 1.0
        
    location_clean = location.strip() if location.strip() in top_locations else 'Other'
    
    input_df = pd.DataFrame([{
        'total_sqft_num': float(total_sqft),
        'bhk': int(bhk),
        'bath': float(bath),
        'balcony': float(balcony),
        'is_ready': int(is_ready),
        'location_clean': location_clean,
        'area_type': str(area_type)
    }])
    
    proc_input = preprocessor.transform(input_df)
    pred_log = model.predict(proc_input)[0]
    estimated_lakhs = float(np.expm1(pred_log))
    
    # Ensure non-negative and realistic
    estimated_lakhs = max(5.0, round(estimated_lakhs, 2))
    lower_bound = max(5.0, round(estimated_lakhs - mae * 0.75, 2))
    upper_bound = round(estimated_lakhs + mae * 0.75, 2)
    
    return {
        'estimated_price_lakhs': estimated_lakhs,
        'price_range_lower': lower_bound,
        'price_range_upper': upper_bound,
        'price_inr': estimated_lakhs * 100000.0,
        'price_per_sqft': round((estimated_lakhs * 100000.0) / total_sqft, 2),
        'location_used': location_clean,
        'mae_margin': round(mae, 2)
    }

def predict_rent_price(locality, area_sqft, beds, bathrooms=None, balconies=None, furnishing='Semi-Furnished'):
    """
    Predict monthly rent in INR.
    Returns dict with estimated_rent, rent_range_lower, rent_range_upper, rent_per_sqft.
    """
    m_data = get_rent_model()
    preprocessor = m_data['preprocessor']
    model = m_data['model']
    top_localities = m_data['top_localities']
    mae = m_data['metrics']['mae']
    
    if bathrooms is None or bathrooms <= 0:
        bathrooms = float(beds)
    if balconies is None or balconies < 0:
        balconies = 1.0
        
    locality_clean = locality.strip() if locality.strip() in top_localities else 'Other'
    
    # Exclude area_rate (target leakage rule)
    input_df = pd.DataFrame([{
        'area': float(area_sqft),
        'beds': int(beds),
        'bathrooms': float(bathrooms),
        'balconies': float(balconies),
        'locality_clean': locality_clean,
        'furnishing': str(furnishing)
    }])
    
    proc_input = preprocessor.transform(input_df)
    pred_log = model.predict(proc_input)[0]
    estimated_rent = float(np.expm1(pred_log))
    
    estimated_rent = max(2000.0, round(estimated_rent, 0))
    lower_bound = max(2000.0, round(estimated_rent - mae * 0.6, 0))
    upper_bound = round(estimated_rent + mae * 0.6, 0)
    
    return {
        'estimated_rent_monthly': estimated_rent,
        'rent_range_lower': lower_bound,
        'rent_range_upper': upper_bound,
        'rent_per_sqft': round(estimated_rent / area_sqft, 2),
        'locality_used': locality_clean,
        'mae_margin': round(mae, 0)
    }

def get_hpi_forecast():
    """
    Get 2025-2026 HPI macro forecast with confidence intervals.
    """
    path = os.path.join(MODELS_DIR, 'forecast_metrics.json')
    if not os.path.exists(path):
        from src.models.train_models import train_hpi_forecast_model
        return train_hpi_forecast_model()
    import json
    with open(path, 'r') as f:
        return json.load(f)

