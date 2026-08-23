import os
import re
import pandas as pd
import numpy as np
from src.data.dataset_loader import load_raw_house_prices

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'processed_data')

def parse_bhk(size_str):
    if pd.isna(size_str):
        return np.nan
    size_str = str(size_str).strip()
    match = re.search(r'(\d+)', size_str)
    if match:
        return float(match.group(1))
    return np.nan

def convert_sqft_to_float(sqft_str):
    if pd.isna(sqft_str):
        return np.nan
    sqft_str = str(sqft_str).strip()
    if '-' in sqft_str:
        tokens = sqft_str.split('-')
        try:
            return (float(tokens[0].strip()) + float(tokens[1].strip())) / 2.0
        except ValueError:
            return np.nan
    try:
        return float(sqft_str)
    except ValueError:
        # Handle units like Sq. Meter, Sq. Yards, Perch, Acres, Guntha
        val_match = re.search(r'([\d\.]+)', sqft_str)
        if not val_match:
            return np.nan
        val = float(val_match.group(1))
        sqft_str_lower = sqft_str.lower()
        if 'sq. meter' in sqft_str_lower or 'sq.m' in sqft_str_lower or 'meter' in sqft_str_lower:
            return val * 10.7639
        elif 'sq. yard' in sqft_str_lower or 'sq.y' in sqft_str_lower or 'yard' in sqft_str_lower:
            return val * 9.0
        elif 'acre' in sqft_str_lower:
            return val * 43560.0
        elif 'ground' in sqft_str_lower:
            return val * 2400.0
        elif 'cent' in sqft_str_lower:
            return val * 435.6
        elif 'guntha' in sqft_str_lower:
            return val * 1089.0
        return np.nan

def preprocess_house_prices():
    df = load_raw_house_prices()
    
    # 1. Clean location
    df = df.dropna(subset=['location'])
    df['location'] = df['location'].apply(lambda x: str(x).strip())
    
    # 2. Parse BHK from size
    df['bhk'] = df['size'].apply(parse_bhk)
    df = df.dropna(subset=['bhk'])
    df['bhk'] = df['bhk'].astype(int)
    
    # 3. Convert total_sqft to numeric float
    df['total_sqft_num'] = df['total_sqft'].apply(convert_sqft_to_float)
    df = df.dropna(subset=['total_sqft_num'])
    
    # 4. Fill missing bath and balcony
    bhk_bath_median = df.groupby('bhk')['bath'].transform('median')
    df['bath'] = df['bath'].fillna(bhk_bath_median).fillna(2.0)
    
    bhk_balcony_median = df.groupby('bhk')['balcony'].transform('median')
    df['balcony'] = df['balcony'].fillna(bhk_balcony_median).fillna(1.0)
    
    # 5. Calculate Price per sqft in INR
    # Price is in Lakhs INR (1 Lakh = 100,000 INR)
    df['price_inr'] = df['price'] * 100000.0
    df['price_per_sqft'] = df['price_inr'] / df['total_sqft_num']
    
    # 6. Remove extreme outliers
    # Minimum sqft per BHK should be reasonable (e.g. > 200 sqft per room)
    df = df[(df['total_sqft_num'] / df['bhk']) >= 200]
    df = df[(df['total_sqft_num'] >= 300) & (df['total_sqft_num'] <= 25000)]
    df = df[(df['price_per_sqft'] >= 1000) & (df['price_per_sqft'] <= 50000)]
    
    # Clean area_type and availability
    df['area_type'] = df['area_type'].fillna('Super built-up Area').astype(str).str.strip()
    df['is_ready'] = df['availability'].apply(lambda x: 1 if str(x).strip() == 'Ready To Move' else 0)
    
    # Save cleaned data
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    parquet_path = os.path.join(PROCESSED_DIR, 'cleaned_bengaluru_house_prices.parquet')
    csv_path = os.path.join(PROCESSED_DIR, 'cleaned_bengaluru_house_prices.csv')
    df.to_parquet(parquet_path, index=False)
    df.to_csv(csv_path, index=False)
    
    print(f"Preprocessed House Prices saved: {len(df)} rows.")
    return df

if __name__ == '__main__':
    preprocess_house_prices()
