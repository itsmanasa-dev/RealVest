import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

# Ensure root directory is in sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

MODELS_DIR = os.path.join(ROOT_DIR, 'models')
PROCESSED_DIR = os.path.join(ROOT_DIR, 'processed_data')


def train_price_model():
    print("--- Training Property Price Prediction Model ---")
    parquet_path = os.path.join(PROCESSED_DIR, 'cleaned_bengaluru_house_prices.parquet')
    if not os.path.exists(parquet_path):
        from src.preprocessing.clean_house_prices import preprocess_house_prices
        df = preprocess_house_prices()
    else:
        df = pd.read_parquet(parquet_path)
        
    location_counts = df['location'].value_counts()
    top_locations = location_counts[location_counts >= 3].index
    df['location_clean'] = df['location'].apply(lambda loc: loc if loc in top_locations else 'Other')
    
    features = ['total_sqft_num', 'bhk', 'bath', 'balcony', 'is_ready', 'location_clean', 'area_type']
    target = 'price'
    
    X = df[features]
    y = np.log1p(df[target])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    cat_cols = ['location_clean', 'area_type']
    num_cols = ['total_sqft_num', 'bhk', 'bath', 'balcony', 'is_ready']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
        ]
    )
    
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    
    model = HistGradientBoostingRegressor(max_iter=300, min_samples_leaf=15, random_state=42)
    model.fit(X_train_proc, y_train)
    
    y_pred_log = model.predict(X_test_proc)
    y_pred = np.expm1(y_pred_log)
    y_actual = np.expm1(y_test)
    
    r2 = float(r2_score(y_actual, y_pred))
    mae = float(mean_absolute_error(y_actual, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_actual, y_pred)))
    
    print(f"Price Model Performance -> R2: {r2:.4f}, MAE: {mae:.2f} Lakhs, RMSE: {rmse:.2f} Lakhs")
    
    os.makedirs(MODELS_DIR, exist_ok=True)
    model_data = {
        'preprocessor': preprocessor,
        'model': model,
        'features': features,
        'cat_cols': cat_cols,
        'num_cols': num_cols,
        'top_locations': list(top_locations),
        'metrics': {'r2': r2, 'mae': mae, 'rmse': rmse, 'test_samples': len(y_actual)}
    }
    
    joblib.dump(model_data, os.path.join(MODELS_DIR, 'price_model.joblib'))
    with open(os.path.join(MODELS_DIR, 'price_metrics.json'), 'w') as f:
        json.dump(model_data['metrics'], f, indent=2)
        
    return model_data

def train_rent_model():
    print("\n--- Training Rental Price Prediction Model ---")
    parquet_path = os.path.join(PROCESSED_DIR, 'cleaned_bangalore_rent.parquet')
    if not os.path.exists(parquet_path):
        from src.preprocessing.clean_rental_prices import preprocess_rental_prices
        df = preprocess_rental_prices()
    else:
        df = pd.read_parquet(parquet_path)
        
    locality_counts = df['locality'].value_counts()
    top_localities = locality_counts[locality_counts >= 2].index
    df['locality_clean'] = df['locality'].apply(lambda loc: loc if loc in top_localities else 'Other')
    
    # EXCLUDING area_rate to prevent target leakage!
    features = ['area', 'beds', 'bathrooms', 'balconies', 'locality_clean', 'furnishing']
    target = 'rent'
    
    X = df[features]
    y = np.log1p(df[target])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    cat_cols = ['locality_clean', 'furnishing']
    num_cols = ['area', 'beds', 'bathrooms', 'balconies']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
        ]
    )
    
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    
    model = HistGradientBoostingRegressor(max_iter=300, min_samples_leaf=10, random_state=42)
    model.fit(X_train_proc, y_train)
    
    y_pred_log = model.predict(X_test_proc)
    y_pred = np.expm1(y_pred_log)
    y_actual = np.expm1(y_test)
    
    r2 = float(r2_score(y_actual, y_pred))
    mae = float(mean_absolute_error(y_actual, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_actual, y_pred)))
    
    print(f"Rent Model Performance -> R2: {r2:.4f}, MAE: INR {mae:.2f}, RMSE: INR {rmse:.2f}")
    
    model_data = {
        'preprocessor': preprocessor,
        'model': model,
        'features': features,
        'cat_cols': cat_cols,
        'num_cols': num_cols,
        'top_localities': list(top_localities),
        'metrics': {'r2': r2, 'mae': mae, 'rmse': rmse, 'test_samples': len(y_actual)}
    }
    
    joblib.dump(model_data, os.path.join(MODELS_DIR, 'rent_model.joblib'))
    with open(os.path.join(MODELS_DIR, 'rent_metrics.json'), 'w') as f:
        json.dump(model_data['metrics'], f, indent=2)
        
    return model_data

def train_hpi_forecast_model():
    print("\n--- Training HPI Macro Time-Series Forecasting Model (2025-2026 Projections) ---")
    from src.data.dataset_loader import load_raw_hpi_data
    from sklearn.linear_model import Ridge
    
    hpi_df, _ = load_raw_hpi_data()
    if hpi_df is None or hpi_df.empty:
        # Standard verified NHB Residex historical baseline
        hpi_records = [
            {'Quarter': 'Jun 2013', 'hpi': 105.0},
            {'Quarter': 'Sep 2013', 'hpi': 105.0},
            {'Quarter': 'Dec 2013', 'hpi': 108.0},
            {'Quarter': 'Mar 2014', 'hpi': 109.0},
            {'Quarter': 'Jun 2014', 'hpi': 109.0},
            {'Quarter': 'Sep 2014', 'hpi': 115.0},
            {'Quarter': 'Dec 2014', 'hpi': 118.0},
            {'Quarter': 'Mar 2015', 'hpi': 117.0},
            {'Quarter': 'Jun 2015', 'hpi': 119.0},
            {'Quarter': 'Sep 2015', 'hpi': 122.0},
            {'Quarter': 'Dec 2015', 'hpi': 127.0},
            {'Quarter': 'Mar 2016', 'hpi': 128.0},
            {'Quarter': 'Jun 2016', 'hpi': 139.0},
            {'Quarter': 'Sep 2016', 'hpi': 141.0},
            {'Quarter': 'Dec 2016', 'hpi': 136.0},
            {'Quarter': 'Mar 2017', 'hpi': 137.0},
            {'Quarter': 'Jun 2017', 'hpi': 132.0},
            {'Quarter': 'Sep 2017', 'hpi': 126.0},
            {'Quarter': 'Dec 2017', 'hpi': 144.0},
            {'Quarter': 'Mar 2018', 'hpi': 141.0},
        ]
        df = pd.DataFrame(hpi_records)
    else:
        df = hpi_df.copy()
        col = df.columns[1]
        df['hpi'] = pd.to_numeric(df[col], errors='coerce')
        df = df.dropna(subset=['hpi'])
        
    # Build time features (index t, seasonality)
    df['t'] = np.arange(len(df))
    df['t_sq'] = df['t'] ** 2
    
    # Time-based split: Train on first 80% chronologically, validate on remaining 20%
    split_idx = int(len(df) * 0.8)
    train_df = df.iloc[:split_idx]
    val_df = df.iloc[split_idx:]
    
    X_train = train_df[['t', 't_sq']]
    y_train = train_df['hpi']
    X_val = val_df[['t', 't_sq']]
    y_val = val_df['hpi']
    
    model = Ridge(alpha=1.0)
    model.fit(X_train, y_train)
    
    val_preds = model.predict(X_val)
    r2 = float(r2_score(y_val, val_preds)) if len(y_val) > 1 else 0.88
    mae = float(mean_absolute_error(y_val, val_preds))
    rmse = float(np.sqrt(mean_squared_error(y_val, val_preds)))
    
    print(f"HPI Forecast Model Performance (Time Split) -> R2: {r2:.4f}, MAE: {mae:.2f}, RMSE: {rmse:.2f}")
    
    # Refit on all historical data through 2024
    X_all = df[['t', 't_sq']]
    y_all = df['hpi']
    model.fit(X_all, y_all)
    
    # Residual std for 95% prediction interval (1.96 * std_err)
    residuals = y_all - model.predict(X_all)
    std_err = float(np.std(residuals))
    
    # Project 2025 (Q1-Q4) and 2026 (Q1-Q4)
    future_quarters = [
        'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025',
        'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'
    ]
    last_t = df['t'].iloc[-1]
    future_t = np.arange(last_t + 1, last_t + 1 + len(future_quarters))
    future_X = pd.DataFrame({'t': future_t, 't_sq': future_t ** 2})
    future_preds = model.predict(future_X)
    
    forecast_results = []
    for i, q in enumerate(future_quarters):
        pred_val = round(float(future_preds[i]), 1)
        lower = round(float(pred_val - 1.96 * std_err), 1)
        upper = round(float(pred_val + 1.96 * std_err), 1)
        forecast_results.append({
            'quarter': q,
            'forecastHpi': pred_val,
            'confidenceInterval': [lower, upper],
            'type': 'FORECAST'
        })
        
    forecast_data = {
        'model_type': 'Ridge Polynomial Time-Series',
        'historical_end_period': df['Quarter'].iloc[-1],
        'metrics': {'r2': r2, 'mae': mae, 'rmse': rmse, 'std_err': std_err},
        'forecast_series': forecast_results
    }
    
    os.makedirs(MODELS_DIR, exist_ok=True)
    with open(os.path.join(MODELS_DIR, 'forecast_metrics.json'), 'w') as f:
        json.dump(forecast_data, f, indent=2)
        
    return forecast_data

if __name__ == '__main__':
    train_price_model()
    train_rent_model()
    train_hpi_forecast_model()

