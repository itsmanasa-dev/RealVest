# RealVest — Machine Learning Documentation

## Overview
RealVest uses supervised machine learning models and statistical time-series forecasting to predict property purchase valuations, monthly rental rates, and quarterly macro appreciation indices for Bengaluru real estate.

---

## Models & Methodology

### 1. Property Price Model (`models/price_model.joblib`)
- **Algorithm**: `HistGradientBoostingRegressor` (Scikit-Learn) with monotonic area constraints and native NaN handling.
- **Target Variable**: `log1p(price)` (Price in Lakhs INR)
- **Features Used**:
  - `total_sqft_num` (Numeric total area in sqft)
  - `bhk` (Bedroom count)
  - `bath` (Bathroom count)
  - `balcony` (Balcony count)
  - `is_ready` (Binary indicator for Ready To Move status)
  - `location_clean` (Categorical top micro-markets vs 'Other')
  - `area_type` (Super built-up vs Built-up vs Plot Area)
- **Evaluation Metrics (Verified Test Split)**:
  - **R² Score**: ~0.62 (log1p scale $R^2=0.74$)
  - **MAE**: ~31.14 Lakhs INR
  - **RMSE**: ~91.95 Lakhs INR

---

### 2. Rental Price Model (`models/rent_model.joblib`)
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
- **Evaluation Metrics (Verified Test Split)**:
  - **R² Score**: ~0.43 (log1p scale $R^2=0.61$)
  - **MAE**: ~INR 20,997
  - **RMSE**: ~INR 42,427

---

### 3. Macro Housing Price Index (HPI) Forecasting Model (`models/forecast_metrics.json`)
- **Algorithm**: Ridge Polynomial Time-Series Regression ($L_2$ Regularized Degree-2 Polynomial)
- **Target Variable**: Bengaluru Housing Price Index (NHB Residex 2018–2024 Base)
- **Training Strategy**: Chronological temporal split on quarterly observations.
- **Residual Variance**: $\sigma_{\text{residual}} = 4.74$
- **Forecast Horizon**: Q1 2025 to Q4 2026 (8 quarters) with parametric $95\%$ Confidence Intervals ($\pm 1.96 \cdot \sigma \cdot \sqrt{1 + \frac{h}{N}}$).
- **Projections**:
  - **2024 Q4 (Actual Observed)**: 141.0
  - **2025 Q4 (Forecast)**: 148.5 (95% CI: 139.2 – 157.8)
  - **2026 Q4 (Forecast)**: 155.0 (95% CI: 144.2 – 165.8)

---

## Explainability (SHAP & Factor Waterfall)
- **Waterfall Breakdown**: Base price benchmark + Size Factor + Micro-Market Demand Factor + Configuration Factor + Ready-to-move Occupancy Factor.
- **No Fabricated Data**: Historical data (through 2024) is strictly separated and labeled as "Observed / Actual" while 2025–2026 values are explicitly demarcated as "Forecast / Model Projection".

