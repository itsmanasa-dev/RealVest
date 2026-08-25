# REALVEST — AI-Powered Real Estate Decision Intelligence Platform

**REALVEST** is a production-grade AI Real Estate & Decision Intelligence platform designed to answer the fundamental buyer/investor question:

> **"Should I buy/invest in this property, why, what are the risks, and what could change the decision?"**

---

## Core Product Features

1. **Property Explorer**: Browse verified market listings across Bengaluru micro-markets with ML fair valuations and rental yields.
2. **Property Analysis & Explainable Valuation**: Quantitative factor contributions (+ Baseline, + Size, + Micro-market demand, + Configuration, + Readiness) explaining how the ML fair value was derived.
3. **Risk Radar**: Multi-category risk breakdown (**Price Risk**, **Rental Risk**, **Market Risk**, **Location Risk**, **Data Confidence**) showing **LOW / MEDIUM / HIGH** levels with empirical data explanations.
4. **Decision Engine**: Clear, non-black-box recommendation (**BUY / HOLD / AVOID**) with Confidence %, bulleted supporting reasons, and risk signals.
5. **What-If Decision Simulator**: Financial cash-flow modeling (Home Loan EMI, Net Cash Flow, Total ROI %, Projected Property Value) comparing **BASE CASE vs USER SCENARIO**.
6. **Decision Flip Boundary Analysis**: Calculates exact sensitivity thresholds answering *"What would need to change for this recommendation to flip?"* (e.g. price ceiling, minimum rent, interest rate threshold).
7. **Side-by-Side Property Comparison**: Matrix comparison of multiple properties with ML "Our Pick" recommendation.
8. **Market Intelligence**: Historical NHB Residex Housing Price Index trajectory and QoQ / YoY growth movements.
9. **Data-Grounded AI Advisor**: Natural language Q&A assistant strictly bound to RealVest's backend models and dataset metrics.
10. **Multilingual UI**: Native language switching across **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.

---

## Architecture & Technology Stack

- **Frontend**: Streamlit with modern Gen-Z custom CSS design system (`app/styles.py`).
- **Backend & Analytics**: Python 3.13 (`src/analytics/`), including Decision Engine, Risk Radar, Decision Simulator, and Decision Flip.
- **Machine Learning**: Scikit-Learn `HistGradientBoostingRegressor` for sales price & rental price estimation with target leakage safeguards.
- **Datasets**: Bengaluru House Prices (13k+ listings), MagicBricks Rentals (~4.5k listings), OpenStreetMap Amenity Nodes (3,512 nodes), and NHB Residex Index tables.

---

## Quick Start & Execution

### Prerequisites
- Python 3.10+

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run Unit Tests
```bash
python -m pytest tests/
```

### Step 3: Launch Web Application
```bash
streamlit run app/main.py
```

---

## Documentation Links

- [Architecture Guide](file:///d:/RealVest/docs/ARCHITECTURE.md)
- [ML Methodology](file:///d:/RealVest/docs/ML.md)
- [Dataset Documentation](file:///d:/RealVest/docs/DATA.md)

---

## Data & Engineering Disclaimers

- **Original Datasets**: Stored untouched inside `Datasets/`. Cleaned artifacts are written to `processed_data/` and trained models to `models/`.
- **Target Leakage Prevention**: `area_rate` (`rent / area`) in the rental dataset is target-derived and has been explicitly removed from feature inputs.
- **Valuation Disclaimer**: ML-estimated fair values are analytical predictions derived from historical transactions and do not constitute certified real estate appraisals.
