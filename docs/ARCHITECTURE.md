# RealVest — Architecture Documentation

## System Overview
RealVest is an AI-powered real-estate decision intelligence platform designed to evaluate property valuations, financial returns, risk factors, and market trends across Bengaluru micro-markets.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       React 19 + TypeScript SPA Client                       │
│  (Vite + Tailwind CSS Tokens + Lucide Icons + NHB GIS Map + I18n en/hi/kn) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
  ┌─────────────▼─────────────┐                 ┌─────────────▼─────────────┐
  │     Analytics Engine      │                 │       ML Inference        │
  │ (src/analytics/modules)   │                 │   (src/models/predict.py) │
  └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                │                                             │
  ┌─────────────┴─────────────┐                 ┌─────────────┴─────────────┐
  │   Risk Radar & Simulator  │                 │    HistGradientBoosting   │
  │(decision_engine, flip.py) │                 │    & Polynomial Forecast  │
  └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       │
                         ┌─────────────▼─────────────┐
                         │   Data Layer & Loaders    │
                         │  (processed_data/*.parquet│
                         │   & Datasets/*.csv)       │
                         └───────────────────────────┘
```

---

## Directory Structure

- `frontend/`: Modern React 19 + TypeScript single page application:
  - `src/components/views/`: 8 Core decision views (`DashboardView`, `ExplorerView`, `PropertyAnalysisView`, `CompareView`, `SimulatorView`, `MarketIntelligenceView`, `AIAdvisorView`, `SettingsView`).
  - `src/components/common/`: Shared interactive components including `InteractiveMap.tsx` with Bengaluru GIS, property markers, and geolocation.
  - `src/context/`: Context providers including `LanguageContext.tsx` and theme state management.
  - `src/i18n/`: Comprehensive localized dictionary (`translations.ts`) covering English, Hindi, and Kannada.
  - `src/services/`: Decision engine, simulation, and query processing services.
- `src/analytics/`: Python business logic for Decision Engine (`decision_engine.py`), Risk Radar (`risk_radar.py`), What-If Simulator (`decision_simulator.py`), Decision Flip Boundaries (`decision_flip.py`), Rental Yield (`yield_calculator.py`), Deal Classifier (`deal_classifier.py`), Investment Scorer (`investment_scorer.py`), and HPI Analytics (`hpi_analytics.py`).
- `src/models/`: Model training pipelines (`train_models.py`), cached inference wrappers (`predict.py`), and explainability engines (`explain.py`).
- `src/preprocessing/`: Data cleaning & target leakage prevention scripts (`clean_house_prices.py`, `clean_rental_prices.py`).
- `models/`: Joblib serialized pre-trained model files (`price_model.joblib`, `rent_model.joblib`) and forecast metrics (`forecast_metrics.json`).
- `Datasets/`: Read-only raw CSV, GeoJSON, and XLS dataset files (Bengaluru house prices, MagicBricks rental prices, OSM restaurants, NHB Residex).
- `processed_data/`: Cleaned Parquet & CSV files.
- `tests/`: Pytest unit test suite (`test_models.py`, `test_analytics.py`).
