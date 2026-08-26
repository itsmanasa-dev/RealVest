# REALVEST — AI-Powered Real Estate Decision Intelligence Platform

**REALVEST** is a production-grade AI Real Estate & Decision Intelligence platform designed to answer the fundamental buyer/investor question:

> **"Should I buy/invest in this property, why, what are the risks, and what could change the decision?"**

---

## Core Product Features

1. **Property Explorer**: Browse verified market listings across Bengaluru micro-markets with ML fair valuations and rental yields.
2. **Property Analysis & Explainable Valuation**: Quantitative factor contributions (+ Baseline, + Size, + Micro-market demand, + Configuration, + Readiness) explaining how the ML fair value was derived.
3. **Risk Radar**: Multi-category risk breakdown (**Market Risk**, **Price Volatility**, **Rent Stability**, **Micro-Market Liquidity**, **Data Confidence**) showing **LOW / MEDIUM / HIGH** levels with empirical data explanations.
4. **Decision Engine**: Clear, non-black-box recommendation (**BUY / HOLD / AVOID**) with Confidence %, bulleted supporting reasons, and risk signals.
5. **What-If Decision Simulator**: Financial cash-flow modeling (Home Loan EMI, Net Cash Flow, Total ROI %, Projected Property Value) comparing **BASE CASE vs USER SCENARIO**.
6. **Decision Flip Boundary Analysis**: Calculates exact sensitivity thresholds answering *"What would need to change for this recommendation to flip?"* (e.g. price ceiling, minimum rent, interest rate threshold).
7. **Side-by-Side Property Comparison**: Matrix comparison of multiple properties with automated ML "Our Pick" recommendation.
8. **Market Intelligence**: Historical RBI Housing Price Index (HPI) trajectory and QoQ / YoY growth movements.
9. **Data-Grounded AI Advisor**: Natural language Q&A assistant strictly bound to RealVest's backend models and dataset metrics.
10. **Modern Stitch UI & Themes**: Responsive desktop sidebar, mobile floating dock, and seamless switching between Electric Obsidian Dark (`#031427`) and Decision Light (`#f8f9ff`).

---

## Architecture & Technology Stack

```
RealVest/
│
├── frontend/                     # THE SINGLE FRONTEND (React 19 + TypeScript + Vite + Tailwind v4)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # AIConfidenceGauge, MetricCard, RiskBadge
│   │   │   ├── layout/           # Sidebar, Header, MobileNav
│   │   │   └── views/            # DashboardView, ExplorerView, PropertyAnalysisView,
│   │   │                         # CompareView, SimulatorView, MarketIntelligenceView,
│   │   │                         # AIAdvisorView, SettingsView
│   │   ├── data/                 # Real pre-computed Bengaluru property catalog & HPI records
│   │   ├── services/             # Analytics, ML inference wrappers & calculation engines
│   │   ├── styles/               # index.css, App.css
│   │   └── types/                # index.ts
│   └── package.json
│
├── src/                          # BACKEND SERVICES, ANALYTICS, ML & DATA PIPELINE
│   ├── ai/                       # Natural language query parsing & recommendation engine
│   ├── analytics/                # Pure analytical calculation modules (Decision Engine, Simulator, Flip)
│   ├── data/                     # Data loaders & pipeline utilities
│   ├── location/                 # Geographic & competitor feasibility
│   ├── models/                   # ML training, inference & explainability
│   ├── preprocessing/            # Raw CSV to clean dataset transformations
│   ├── translations/             # Multilingual dictionary (en, hi, kn)
│   └── utils/                    # Common utilities, error handling, validation
│
├── models/                       # Trained Scikit-Learn .pkl artifacts
├── Datasets/                     # Raw source datasets
├── processed_data/               # Cleaned parquet datasets
├── tests/                        # Full automated test suite (pytest)
├── docs/                         # Documentation
├── README.md
└── requirements.txt
```

---

## Quick Start & Execution

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run Backend Tests
```bash
pytest
```

### Step 3: Launch Web Application
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

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
