# RealVest — Architecture Documentation

## System Overview
RealVest is an AI-powered real-estate decision intelligence platform designed to evaluate property valuations, financial returns, risk factors, and market trends across Bengaluru micro-markets.

---

## High-Level Architecture

```
                               ┌───────────────────────────┐
                               │   Streamlit Web Interface │
                               │  (app/main.py & views/)   │
                               └─────────────┬─────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
         ┌─────────────▼─────────────┐               ┌─────────────▼─────────────┐
         │     Analytics Engine      │               │       ML Inference        │
         │ (src/analytics/modules)   │               │   (src/models/predict.py) │
         └─────────────┬─────────────┘               └─────────────┬─────────────┘
                       │                                           │
         ┌─────────────┴─────────────┐               ┌─────────────┴─────────────┐
         │   Risk Radar & Simulator  │               │   HistGradientBoosting    │
         │(decision_engine, flip.py) │               │   Price & Rent Models     │
         └─────────────┬─────────────┘               └─────────────┬─────────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │
                               ┌─────────────▼─────────────┐
                               │   Data Layer & Loaders    │
                               │  (processed_data/*.parquet│
                               │   & Datasets/*.csv)       │
                               └───────────────────────────┘
```

---

## Directory Structure

- `app/`: Streamlit web interface, navigation router (`main.py`), CSS tokens (`styles.py`), translations (`translations.py`), and view modules (`views/`).
- `src/analytics/`: Business logic for Decision Engine (`decision_engine.py`), Risk Radar (`risk_radar.py`), What-If Simulator (`decision_simulator.py`), Decision Flip Boundaries (`decision_flip.py`), Rental Yield (`yield_calculator.py`), Deal Classifier (`deal_classifier.py`), Investment Scorer (`investment_scorer.py`), and HPI Analytics (`hpi_analytics.py`).
- `src/models/`: Model training scripts (`train_models.py`), cached inference wrappers (`predict.py`), and explainability engines (`explain.py`).
- `src/data/`: Data loading pipelines (`dataset_loader.py`).
- `src/preprocessing/`: Data cleaning & target leakage prevention scripts (`clean_house_prices.py`, `clean_rental_prices.py`).
- `src/ai/`: Natural language parser (`query_parser.py`) and recommendation ranking engine (`recommendation_engine.py`).
- `models/`: Joblib serialized pre-trained model files (`price_model.joblib`, `rent_model.joblib`) and metrics JSONs.
- `Datasets/`: Read-only raw CSV, GeoJSON, and XLS dataset files.
- `processed_data/`: Cleaned Parquet & CSV files used during runtime.
- `tests/`: Pytest unit test suite.
