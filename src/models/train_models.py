import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'models')
PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'processed_data')

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

if __name__ == '__main__':
    train_price_model()
    train_rent_model()
