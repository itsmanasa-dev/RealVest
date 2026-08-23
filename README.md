
# REALVEST — AI Real Estate & Business Analytics MVP

**REALVEST** is a production-grade AI Real Estate & Business Analytics platform designed to evaluate Bengaluru property valuations, rental yields, investment deal ratings, business location feasibility, and housing price index trends.



## Key Features

1. **Property Price Prediction**: Trained ML regression model predicting fair market property valuations (Lakhs INR), confidence ranges, and feature attribution explanations.
2. **Rent Price Prediction**: Trained ML model predicting monthly rental income (₹/month) while strictly excluding target-derived features (`area_rate`).
3. **Rental Yield Analysis**: Computes annual rental yields with clear interpretation benchmarks (High >5.0%, Moderate 3.5-5.0%, Low <3.5%).
4. **Property Deal Valuation**: Classifies asking prices against ML fair values into *Potentially Undervalued*, *Fairly Priced*, and *Potentially Overpriced* deals.
5. **Transparent Investment Score**: 0–100 multi-metric score combining Valuation Ratio (35%), Rental Yield (35%), Micro-Market Location Tier (15%), and HPI Market Trend (15%).
6. **Multi-Property Comparison**: Compare up to 4 properties side-by-side with matrix tables, best pick badges, and Plotly charts.
7. **Business Location Intelligence**: Spatial competition density (3,512 restaurant nodes) and ward population density analysis (198 BBMP Wards, 8.44M pop) with an interactive Plotly map.
8. **Market HPI Trajectory**: Time-series visualization of official NHB Residex quarterly data (Base 2013=100) with QoQ and YoY growth analytics.
9. **AI Recommendation & Explanation**: Natural language query parser translating prompts into candidate dataset filters and generating SHAP-backed explanations.
10. **Multilingual UI**: Dynamic language switching across **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.

---

## Quick Start & Execution

### Prerequisites
- Python 3.10+
- `pip`

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Preprocess Datasets & Train Models
```bash
python -m src.preprocessing.clean_house_prices
python -m src.preprocessing.clean_rental_prices
python -m src.models.train_models
```

### Step 3: Run Test Suite
```bash
python -m pytest tests/
```

### Step 4: Launch Web Application
```bash
streamlit run app/main.py
```

---

## Data & Engineering Disclaimers

- **Original Datasets**: Stored untouched inside `Datasets/`. Cleaned artifacts are written to `processed_data/` and trained models to `models/`.
- **Target Leakage Prevention**: `area_rate` (`rent / area`) in the rental dataset is target-derived and has been explicitly removed from feature inputs.
- **Geospatial & Footfall Disclaimer**: Business location scores reflect spatial competitor amenity node density and census population benchmarks. They do NOT represent live footfall or sales figures.
- **Valuation Disclaimer**: ML-estimated fair values are analytical predictions derived from historical transactions and do not constitute certified real estate appraisals.
