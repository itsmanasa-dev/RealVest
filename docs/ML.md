# RealVest — Machine Learning Documentation

## Overview
RealVest uses supervised machine learning models to predict property sales prices and monthly rental rates for Bengaluru real estate listings.

---

## Models & Methodology

### 1. Property Price Model (`price_model.joblib`)
- **Algorithm**: `HistGradientBoostingRegressor` (Scikit-Learn)
- **Target Variable**: `log1p(price)` (Price in Lakhs INR)
- **Features Used**:
  - `total_sqft_num` (Numeric total area in sqft)
  - `bhk` (Bedroom count)
  - `bath` (Bathroom count)
  - `balcony` (Balcony count)
  - `is_ready` (Binary indicator for Ready To Move status)
  - `location_clean` (Categorical top micro-markets vs 'Other')
  - `area_type` (Super built-up vs Built-up vs Plot Area)
- **Evaluation Metrics**:
  - **R² Score**: ~0.84+
  - **MAE**: ~12.5 Lakhs INR
  - **RMSE**: ~22.0 Lakhs INR

---

### 2. Rental Price Model (`rent_model.joblib`)
- **Algorithm**: `HistGradientBoostingRegressor` (Scikit-Learn)
- **Target Variable**: `log1p(rent)` (Monthly rent in INR)
- **Features Used**:
  - `area` (Built-up area in sqft)
  - `beds` (Bedroom count)
  - `bathrooms` (Bathroom count)
  - `balconies` (Balcony count)
  - `locality_clean` (Categorical locality)
  - `furnishing` (Furnished, Semi-Furnished, Unfurnished)
- **Target Leakage Safeguard**:
  - `area_rate` (`rent / area`) is strictly **excluded** from feature inputs to prevent synthetic target leakage.
- **Evaluation Metrics**:
  - **R² Score**: ~0.76+
  - **MAE**: ~INR 6,500
  - **RMSE**: ~INR 11,200

---

## Explainability (SHAP & Factor Waterfall)
- **Waterfall Breakdown**: Base price (1000 sqft benchmark) + Size Factor + Micro-Market Demand Factor + Configuration Factor + Ready-to-move Occupancy Factor.
- **Explainable Metrics**: No arbitrary black-box scores are displayed; every score is accompanied by quantitative feature deltas and data-backed rationale.
