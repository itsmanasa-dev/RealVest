import os
import json
import pandas as pd
from bs4 import BeautifulSoup

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'Datasets')

def load_raw_house_prices():
    """Load original Bengaluru House Prices dataset."""
    filepath = os.path.join(DATASETS_DIR, 'bengaluru_house_prices.csv')
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    return pd.read_csv(filepath)

def load_raw_rental_prices():
    """Load original Rental Prices dataset."""
    filepath = os.path.join(DATASETS_DIR, 'cities_magicbricks_rental_prices.csv')
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    return pd.read_csv(filepath)

def load_raw_ward_population():
    """Load original BBMP Ward Population dataset."""
    filepath = os.path.join(DATASETS_DIR, '83390055-d933-420f-82b7-608e139336c2.csv')
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    return pd.read_csv(filepath)

def load_raw_restaurants_geojson():
    """Load original Bengaluru Restaurants GeoJSON."""
    filepath = os.path.join(DATASETS_DIR, 'bengaluru_restaurants.geojson')
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_raw_hpi_data():
    """Load and parse historical HPI and Residex XLS HTML tables."""
    hpi1_path = os.path.join(DATASETS_DIR, 'Bengaluru-City HPI Data Current-Q (Base Year 2013).xls')
    residex_path = os.path.join(DATASETS_DIR, 'Residex_Data.xls')
    
    hpi_history = None
    residex_snap = None
    
    if os.path.exists(hpi1_path):
        with open(hpi1_path, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f, 'html.parser')
            table = soup.find('table')
            if table:
                rows = []
                for tr in table.find_all('tr'):
                    cols = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                    if cols:
                        rows.append(cols)
                if len(rows) > 1:
                    hpi_history = pd.DataFrame(rows[1:], columns=rows[0])
                    
    if os.path.exists(residex_path):
        with open(residex_path, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f, 'html.parser')
            table = soup.find('table')
            if table:
                rows = []
                for tr in table.find_all('tr'):
                    cols = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                    if cols:
                        rows.append(cols)
                if len(rows) > 1:
                    residex_snap = pd.DataFrame(rows[1:], columns=rows[0])
                    
    return hpi_history, residex_snap
