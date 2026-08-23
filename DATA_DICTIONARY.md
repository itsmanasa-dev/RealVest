# REALVEST Data Dictionary & Schema Documentation

This document describes all original datasets in `Datasets/` and processed schemas in `processed_data/`.

---

## 1. Property Sale Price Dataset (`Datasets/bengaluru_house_prices.csv`)

| Column Name | Raw Type | Processed Column | Description |
| :--- | :--- | :--- | :--- |
| `area_type` | string | `area_type` | Categorical area classification (Super built-up, Plot, Built-up, Carpet). |
| `availability` | string | `is_ready` | Binary integer (1 for 'Ready To Move', 0 for under construction). |
| `location` | string | `location`, `location_clean` | Bengaluru micro-market locality string. |
| `size` | string | `bhk` | Extracted integer BHK / bedroom count. |
| `society` | string | *Dropped* | Gated society name (high null count ~41%). |
| `total_sqft` | string | `total_sqft_num` | Numeric float built-up area in square feet. |
| `bath` | float | `bath` | Number of bathrooms (imputed missing with BHK median). |
| `balcony` | float | `balcony` | Number of balconies (imputed missing with BHK median). |
| `price` | float | `price` | **Target**: Sale price in Lakhs INR (1 Lakh = ₹100,000). |

---

## 2. Rental Price Dataset (`Datasets/cities_magicbricks_rental_prices.csv`)

| Column Name | Raw Type | Processed Column | Description |
| :--- | :--- | :--- | :--- |
| `house_type` | string | `house_type` | Descriptive property header string. |
| `locality` | string | `locality`, `locality_clean` | Micro-market locality name. |
| `city` | string | `city` | Filtered exclusively to `Bangalore` (1,775 clean rows). |
| `area` | float | `area` | Property built-up footprint in square feet. |
| `beds` | int | `beds` | Bedroom count (1 to 10). |
| `bathrooms` | int | `bathrooms` | Bathroom count. |
| `balconies` | int | `balconies` | Balcony count. |
| `furnishing` | string | `furnishing` | Categorical: Furnished, Semi-Furnished, Unfurnished. |
| `area_rate` | float | *EXCLUDED* | **Target Leakage**: Computed as `rent / area`. Strictly dropped from features. |
| `rent` | float | `rent` | **Target**: Monthly rental price in INR (₹/month). |

---

## 3. BBMP Wards Population Dataset (`Datasets/83390055-d933-420f-82b7-608e139336c2.csv`)

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `Ward Num` | int | Official BBMP Ward Number (1 to 198). |
| `Ward Name` | string | Ward administrative name. |
| `Population` | int | Total Ward census population (Bengaluru total: 8,443,675). |
| `Male`, `Female` | int | Gender demographic distribution. |
| `Assembly constituency` | string | Electoral assembly constituency zone. |

---

## 4. Restaurant Spatial GeoJSON (`Datasets/bengaluru_restaurants.geojson`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `amenity` | string | OpenStreetMap spatial category (3,512 restaurant nodes). |
| `name` | string | Business establishment name. |
| `geometry` | GeoJSON | Point or Polygon spatial coordinates (Latitude & Longitude). |

---

## 5. Housing Price Index (HPI) Tables

| File | Parser | Description |
| :--- | :--- | :--- |
| `Bengaluru-City HPI Data Current-Q (Base Year 2013).xls` | `BeautifulSoup` | Official quarterly NHB Residex HPI series (Jun 2013 to Mar 2018). |
| `Residex_Data.xls` | `BeautifulSoup` | Official NHB Residex latest index snapshot. |
