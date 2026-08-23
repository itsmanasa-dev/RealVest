# REALVEST Machine Learning Model & Performance Report

This report documents the machine learning models trained for **REALVEST Property Valuation & Rental Price Estimation**.

---

## 1. Property Price Prediction Model (`models/price_model.joblib`)

- **Dataset**: `cleaned_bengaluru_house_prices.parquet` (12,918 clean records).
- **Algorithm**: `HistGradientBoostingRegressor` with categorical One-Hot Encoding and feature standard scaling.
- **Target Transformation**: `np.log1p(price)` to stabilize variance across extreme price distributions.
- **Features Used**:
  - `total_sqft_num` (built-up area)
  - `bhk` (bedroom count)
  - `bath` (bathroom count)
  - `balcony` (balcony count)
  - `is_ready` (binary readiness indicator)
  - `location_clean` (top micro-markets + 'Other')
  - `area_type` (super built-up, plot, built-up, carpet)
- **Train / Test Split**: 80% Train / 20% Test (`random_state=42`).

### Evaluation Metrics
| Metric | Value | Interpretation |
| :--- | :--- | :--- |
| **R² Score** | **0.6167** | Explains 61.7% of price variance across 1,300+ micro-locations. |
| **MAE** | **₹31.14 Lakhs** | Mean absolute valuation error in Lakhs INR. |
| **RMSE** | **₹91.95 Lakhs** | Root mean squared error penalizing extreme luxury outliers. |

---

## 2. Monthly Rent Prediction Model (`models/rent_model.joblib`)

- **Dataset**: `cleaned_bangalore_rent.parquet` (1,775 clean records).
- **Algorithm**: `HistGradientBoostingRegressor` with categorical One-Hot Encoding.
- **Target Transformation**: `np.log1p(rent)`.
- **Target Leakage Safeguard**: `area_rate` (`rent / area`) is **STRICTLY EXCLUDED** from model features.
- **Features Used**:
  - `area` (built-up area)
  - `beds` (bedroom count)
  - `bathrooms` (bathroom count)
  - `balconies` (balcony count)
  - `locality_clean` (top Bangalore rental localities + 'Other')
  - `furnishing` (Furnished, Semi-Furnished, Unfurnished)

### Evaluation Metrics
| Metric | Value | Interpretation |
| :--- | :--- | :--- |
| **R² Score** | **0.4339** | Solid explanatory power for urban rental benchmark modeling. |
| **MAE** | **₹20,997 / mo** | Mean absolute monthly rent error. |
| **RMSE** | **₹42,427 / mo** | Root mean squared monthly rent error. |

---

## 3. Explainability & Confidence Interval Engineering

- **Confidence Ranges**: Formulated as `[Prediction - 0.75 * MAE, Prediction + 0.75 * MAE]`.
- **Feature Attribution Rationale**: Rule-backed SHAP-style attribution breaking down area scale, micro-market tier weight, room configuration, furnishing status, and readiness timeline.
