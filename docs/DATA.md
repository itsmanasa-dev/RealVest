# RealVest — Dataset Documentation

## Overview
RealVest uses curated, verified datasets covering residential property sales, magicbricks rental listings, OpenStreetMap amenity nodes, and NHB Residex historical indices.

---

## Datasets

### 1. Bengaluru House Prices (`Datasets/bengaluru_house_prices.csv`)
- **Source**: Bengaluru Residential Sales Dataset
- **Records**: 13,320 rows
- **Columns**: `area_type`, `availability`, `location`, `size`, `society`, `total_sqft`, `bath`, `balcony`, `price`
- **Cleaning**: Units converted to sqft, BHK parsed from size string, outlier prices (<1k/sqft or >50k/sqft) filtered. Processed file saved as Parquet & CSV in `processed_data/`.

### 2. MagicBricks Rental Prices (`Datasets/cities_magicbricks_rental_prices.csv`)
- **Source**: MagicBricks Rental Housing Records
- **Records**: Filtered for Bangalore city (~4,500 rows)
- **Columns**: `locality`, `area`, `rent`, `beds`, `bathrooms`, `balconies`, `furnishing`
- **Target Leakage Safeguard**: `area_rate` is excluded from training feature vectors.

### 3. OpenStreetMap Bengaluru Restaurants (`Datasets/bengaluru_restaurants.geojson`)
- **Source**: OpenStreetMap amenity nodes
- **Nodes**: 3,512 spatial features
- **Usage**: Used in Business Location Feasibility analyzer for spatial competition density calculation using Haversine formulas.

### 4. NHB Residex & HPI Tables (`Datasets/Bengaluru-City HPI Data Current-Q (Base Year 2013).xls`)
- **Source**: National Housing Bank (NHB) Residex
- **Usage**: Historical Housing Price Index (2013-2018 base year 100) trend monitoring and YoY market risk score calculations.
