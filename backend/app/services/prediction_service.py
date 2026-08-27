import sys
import os
from typing import Dict, Any

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from src.models.predict import predict_property_price, predict_rent_price, get_hpi_forecast
from backend.app.schemas.property import AnalyzeRequest, AnalyzeResponse

class PredictionService:
    @staticmethod
    def predict_value(location: str, total_sqft: float, bhk: int, bath: float = None, is_ready: int = 1):
        """
        Call existing ML HistGradientBoostingRegressor price model.
        """
        return predict_property_price(
            location=location,
            total_sqft=total_sqft,
            bhk=bhk,
            bath=bath,
            is_ready=is_ready
        )

    @staticmethod
    def predict_rent(locality: str, area_sqft: float, beds: int, bathrooms: float = None):
        """
        Call existing ML HistGradientBoostingRegressor rental model.
        """
        return predict_rent_price(
            locality=locality,
            area_sqft=area_sqft,
            beds=beds,
            bathrooms=bathrooms
        )

    @staticmethod
    def get_forecast():
        """
        Call existing HPI polynomial forecast model.
        """
        return get_hpi_forecast()

    @classmethod
    def analyze_property(cls, req: AnalyzeRequest) -> AnalyzeResponse:
        bath = req.bathrooms or float(req.bhk)
        
        # ML Fair Value
        val_pred = cls.predict_value(
            location=req.location,
            total_sqft=req.sqft,
            bhk=req.bhk,
            bath=bath
        )
        fair_value_lakhs = val_pred['estimated_price_lakhs']
        asking_price = req.asking_price_lakhs or fair_value_lakhs
        
        # ML Monthly Rent
        rent_pred = cls.predict_rent(
            locality=req.location,
            area_sqft=req.sqft,
            beds=req.bhk,
            bathrooms=bath
        )
        monthly_rent = req.monthly_rent or rent_pred['estimated_rent_monthly']
        
        # Yield & Metrics
        annual_yield = round((monthly_rent * 12.0) / (asking_price * 100000.0) * 100.0, 2)
        diff_pct = round(((asking_price - fair_value_lakhs) / max(fair_value_lakhs, 1.0)) * 100.0, 1)
        
        if diff_pct <= -5:
            deal_status = "Undervalued Asset"
            rec = "BUY"
            inv_score = min(98, int(85 - diff_pct * 0.8))
        elif diff_pct <= 5:
            deal_status = "Fair Market Value"
            rec = "BUY" if annual_yield >= 5.0 else "HOLD"
            inv_score = int(80 + (annual_yield - 4.5) * 4)
        else:
            deal_status = "Overpriced"
            rec = "AVOID" if diff_pct > 15 else "HOLD"
            inv_score = max(40, int(70 - diff_pct * 1.2))

        risk_radar = {
            "market_liquidity": 85 if req.bhk <= 3 else 70,
            "price_realism": max(30, min(95, int(90 - diff_pct))),
            "rental_demand": min(95, int(annual_yield * 14)),
            "builder_trust": 82,
            "infra_growth": 88 if req.location in ["Whitefield", "Sarjapur Road", "Electronic City", "Bellandur"] else 78
        }

        waterfall_factors = [
            {"factor": "Locality Benchmark", "contribution_lakhs": round(fair_value_lakhs * 0.65, 1)},
            {"factor": "BHK & Square Footage", "contribution_lakhs": round(fair_value_lakhs * 0.25, 1)},
            {"factor": "Rental Yield Premium", "contribution_lakhs": round(fair_value_lakhs * 0.10, 1)},
        ]

        reasons = [
            f"ML fair value benchmark indicates ₹{fair_value_lakhs:.1f} Lakhs (±₹{val_pred['mae_margin']}L MAE).",
            f"Estimated rental yield of {annual_yield}% p.a. generates ~₹{int(monthly_rent):,}/month cash flow.",
            f"Market price variance is {diff_pct:+.1f}% vs trained historical transaction records."
        ]

        risks = [
            "Local municipal infrastructure projects and water table dependencies in micro-market.",
            "Market liquidity horizon requires 3-5 years minimum holding period for optimal capital gains."
        ]

        forecast = cls.get_forecast()

        return AnalyzeResponse(
            location=req.location,
            sqft=req.sqft,
            bhk=req.bhk,
            bathrooms=bath,
            asking_price_lakhs=asking_price,
            fair_value_lakhs=fair_value_lakhs,
            fair_value_range_lower=val_pred['price_range_lower'],
            fair_value_range_upper=val_pred['price_range_upper'],
            price_per_sqft=val_pred['price_per_sqft'],
            monthly_rent=monthly_rent,
            rent_per_sqft=rent_pred['rent_per_sqft'],
            annual_yield=annual_yield,
            deal_status=deal_status,
            deal_diff_pct=diff_pct,
            investment_score=inv_score,
            confidence_score=int(100 - min(40, val_pred['mae_margin'] * 2)),
            recommendation=rec,
            risk_radar=risk_radar,
            waterfall_factors=waterfall_factors,
            reasons=reasons,
            risks=risks,
            forecast=forecast
        )

prediction_service = PredictionService()
