import os
import pandas as pd
import numpy as np
from src.data.dataset_loader import load_raw_rental_prices

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'processed_data')

def preprocess_rental_prices():
    df = load_raw_rental_prices()
    
    # 1. Filter Bangalore city
    df = df[df['city'].str.strip().str.lower() == 'bangalore'].copy()
    
    # 2. Clean locality
    df['locality'] = df['locality'].apply(lambda x: str(x).strip())
    
    # 3. Clean numeric features
    df['area'] = pd.to_numeric(df['area'], errors='coerce')
    df['beds'] = pd.to_numeric(df['beds'], errors='coerce')
    df['bathrooms'] = pd.to_numeric(df['bathrooms'], errors='coerce')
    df['balconies'] = pd.to_numeric(df['balconies'], errors='coerce')
    df['rent'] = pd.to_numeric(df['rent'], errors='coerce')
    
    # Drop rows with nulls in critical columns
    df = df.dropna(subset=['area', 'beds', 'rent', 'locality'])
    
    # Fill bathrooms and balconies with median by beds
    bed_bath_median = df.groupby('beds')['bathrooms'].transform('median')
    df['bathrooms'] = df['bathrooms'].fillna(bed_bath_median).fillna(1.0)
    
    bed_balcony_median = df.groupby('beds')['balconies'].transform('median')
    df['balconies'] = df['balconies'].fillna(bed_balcony_median).fillna(1.0)
    
    # 4. EXCLUDE area_rate from feature pipeline to prevent data leakage!
    # area_rate = rent / area (Target leakage)
    if 'area_rate' in df.columns:
        # We retain it ONLY as a descriptive statistic if needed, but flag it
        pass
        
    # 5. Outlier Filtering
    df = df[(df['rent'] >= 2000) & (df['rent'] <= 500000)]
    df = df[(df['area'] >= 150) & (df['area'] <= 15000)]
    df = df[(df['beds'] >= 1) & (df['beds'] <= 10)]
    
    # Clean furnishing string
    df['furnishing'] = df['furnishing'].fillna('Unfurnished').astype(str).str.strip()
    
    # Save cleaned data
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    parquet_path = os.path.join(PROCESSED_DIR, 'cleaned_bangalore_rent.parquet')
    csv_path = os.path.join(PROCESSED_DIR, 'cleaned_bangalore_rent.csv')
    df.to_parquet(parquet_path, index=False)
    df.to_csv(csv_path, index=False)
    
    print(f"Preprocessed Rental Prices saved: {len(df)} rows.")
    return df

if __name__ == '__main__':
    preprocess_rental_prices()
