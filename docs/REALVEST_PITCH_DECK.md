# REALVEST
## AI-Powered Personalized Property Investment Advisor for Bengaluru
*Pitch & Product Presentation*

---

## SLIDE 1 — THE PROBLEM

### REALVEST
**AI-Powered Personalized Property Investment Advisor**
> *"Helping investors decide where and how to invest their budget in Bengaluru."*

#### The Challenge for Bengaluru Property Investors
A prospective investor has a fixed budget (e.g. ₹50 Lakhs to ₹1.5 Crores) but faces critical decision friction:
- **Corridor Uncertainty**: Which Bengaluru micro-market (Whitefield, Sarjapur, Electronic City, Hebbal) delivers real growth?
- **Budget Mismatch**: Which verified properties genuinely fit the budget with statutory registration factored in?
- **Buy vs. Rent Dilemma**: Does buying outperform renting when current gross rental yields are 3.8%–5.5% vs. loan interest?
- **Price Transparency**: Is the builder's asking price inflated relative to actual registry transactions?
- **Risk Blindspots**: Micro-market infrastructure delays, water dependency, and holding horizon requirements.

> **Key Takeaway:**
> *"Property portals help users **FIND** properties. RealVest helps investors **DECIDE**."*

---

## SLIDE 2 — THE CORE IDEA

### FROM BUDGET TO INVESTMENT DECISION

```
   ┌─────────────────────────────────────────────────────────────┐
   │                    USER INPUT PROFILE                       │
   │  Budget: ₹50L  •  Goal: Capital Growth  •  Risk: Moderate   │
   │  Horizon: 5 Years  •  Location: Bengaluru Corridors         │
   └──────────────────────────────┬──────────────────────────────┘
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                 REALVEST DECISION ENGINE                    │
   │  12,900+ Bengaluru Transactions • ML Fair Valuation Models  │
   │  Gross Rental Yield Engine • Multi-Factor Scoring (/100)    │
   └──────────────────────────────┬──────────────────────────────┘
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │               PERSONALIZED INVESTMENT OUTCOME               │
   │  #1 Top-Pick Match  •  ML Value Discount  •  Projected ROI  │
   │  Decision Reasoning  •  Risk Radar  •  Alternative Option   │
   └─────────────────────────────────────────────────────────────┘
```

#### Illustrative Example:
- **User Profile**: Available Capital: ₹50 Lakhs *(Illustrative example)* • Goal: Rental Income & Capital Growth • Horizon: 5 Years
- **RealVest Output**: Recommends high-liquidity 2 BHK in Whitefield / Electronic City corridor; identifies 8.2% valuation discount relative to ML price benchmark; projects 5.2% rental yield + 8.5% YoY corridor growth.

---

## SLIDE 3 — HOW THE SYSTEM WORKS

### TECHNICAL ARCHITECTURE

```
                  React / Vite Frontend
                  (Dribbble UI + Leaflet GIS)
                             │
                     REST API (/api)
                             │
                      FastAPI Backend
              (Pydantic Validation & CORS)
                             │
             Decision & Comparison Services
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
 MySQL Database       Bengaluru Datasets         ML Models
 (properties,        (12,900+ Cleaned       (HistGradientBoosting
 comparisons)            Records)           Price & Rent Models)
     │                       │                       │
     └───────────────────────┼───────────────────────┘
                             ▼
             AI Investment Recommendation Engine
                             ▼
              Personalized Decision Output
```

#### Technology Stack:
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Leaflet GIS.
- **Backend**: Python 3.11, FastAPI, Pydantic v2, Uvicorn.
- **Database**: MySQL 8.0 with SQLAlchemy ORM + JSON columns.
- **Machine Learning**: scikit-learn (`HistGradientBoostingRegressor`), Pandas, NumPy.
- **Cloud Deployment**: Vercel (Frontend) + Render (FastAPI Backend) + Hosted MySQL.

---

## SLIDE 4 — AI/ML + GEOGRAPHIC MAP

### DATA-DRIVEN PROPERTY INTELLIGENCE

#### Left: Machine Learning Pipeline
1. **Cleaned Housing Dataset**: 12,918 verified Bengaluru property transactions and 1,775 rental listings.
2. **Feature Engineering**: `total_sqft`, `bhk`, `bathrooms`, `location_clean`, `area_type`, `is_ready`.
3. **ML Estimators**: HistGradientBoosting Regressors predicting **Fair Market Value (₹ Lakhs)** and **Monthly Rent (₹/mo)**.
4. **Data-Backed Reasoning**: Automatically computes valuation gap, gross rental yield, and composite Investment Score (0–100).
> *"ML predictions are combined with user requirements and verified property metrics to support sound financial decisions."*

#### Right: Real Bengaluru Geographic Satellite Map
- **Verified Corridors**: High-resolution ESRI satellite imagery covering Whitefield, Indiranagar, HSR Layout, Electronic City, Bellandur, Hebbal, and Yelahanka.
- **Interactive Layers**: Live asking price marker badges, selection states, and toggleable **Opportunity Heatmap Layer**.
> *"The interactive map connects **WHERE** the opportunity is with **WHY** it is recommended."*

---

## SLIDE 5 — PRODUCT FEATURES

### ONE PLATFORM — COMPLETE INVESTMENT WORKFLOW

```
  [1. AI Advisor]        [2. Property Explorer]     [3. Side-by-Side Compare]
  Conversational QA &     2-Column Cards, Filters,   Smart Matching & Dynamic
  Locality Intelligence   Verified ROI Badges        ML Metrics Matrix

  [4. Scenario Simulator][5. Saved Comparisons]     [6. Market Intelligence]
  Interactive Cash Flow   Persistent MySQL Records   Corridor HPI Macro
  & Interest Sensitivity  for Later Inspection       Forecasts (2025-2026)
```

#### Complete Investor Journey:
1. **Explore & Filter**: Filter Bengaluru properties by micro-market, budget range, and BHK.
2. **Personalized Advisory**: Input budget, goal, and risk tolerance for instant ranking.
3. **Deep Comparative Analysis**: Compare asking price vs. ML fair value, yield, and risk.
4. **Simulate & Save**: Test interest rate changes and persist scenario in MySQL database.

---

## SLIDE 6 — DIFFERENTIATOR & FUTURE ROADMAP

### WHY REALVEST?

> *"RealVest moves beyond property search to personalized investment decision support."*

#### Market Differentiator:
- **Traditional Portals Answer**: *"Which properties are listed for sale?"*
- **RealVest Answers**: *"Given **MY** budget, **MY** investment goal, **MY** risk tolerance, and **MY** horizon, which opportunity makes the most financial sense?"*

#### Platform Capabilities:
- [x] Budget-based multi-factor decision engine
- [x] Live Bengaluru micro-market GIS satellite map
- [x] HistGradientBoosting ML valuation & rental models
- [x] Multi-property comparison with persistent MySQL storage
- [x] Real-time conversational AI Advisor chatbot
- [x] Scenario simulator with Karnataka statutory tax breakdown (6.6%)

#### Future Roadmap:
- **Expanded Datasets**: Sub-locality land registry sales volume and builder delivery tracking.
- **Pan-India Expansion**: Mumbai MMR, Pune, and Hyderabad tech corridors.
- **Commercial & Fractional Real Estate**: Grade-A office parks, warehousing, and REIT yield analytics.

---

### REALVEST
**"From property search to investment intelligence."**
