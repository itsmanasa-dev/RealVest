import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.comparison import ComparisonModel
from backend.app.services.property_service import property_service
from backend.app.services.prediction_service import prediction_service
from backend.app.schemas.property import PropertyBase
from backend.app.schemas.comparison import (
    RequirementSearchRequest,
    CompareRequest,
    CompareMetricRow,
    ComparisonResponse,
    SaveComparisonRequest,
    SavedComparisonSummary,
    SavedComparisonDetail
)

class ComparisonService:
    @classmethod
    def search_candidates(cls, db: Session, req: RequirementSearchRequest) -> List[PropertyBase]:
        properties = property_service.get_all(
            db,
            location=req.locality if req.locality != "Any Bengaluru" else None,
            property_type=req.property_type if req.property_type != "Any" else None,
            bhk=req.bhk,
            min_budget=req.min_budget * 0.85 if req.min_budget else None,
            max_budget=req.max_budget * 1.15 if req.max_budget else None,
            min_area=req.min_sqft,
            max_area=req.max_sqft
        )

        if not properties:
            # Fallback to general Bengaluru properties within budget
            properties = property_service.get_all(
                db,
                min_budget=req.min_budget * 0.7 if req.min_budget else None,
                max_budget=req.max_budget * 1.3 if req.max_budget else None
            )

        # Enhance with ML dynamic valuation and score ranking
        scored = []
        for p in properties:
            try:
                ml_val = prediction_service.predict_value(
                    location=p.location,
                    total_sqft=p.sqft,
                    bhk=p.bhk,
                    bath=float(p.bathrooms)
                )
                pred_price_lakhs = ml_val['estimated_price_lakhs']
            except Exception:
                pred_price_lakhs = p.fairValueLakhs

            try:
                ml_rent = prediction_service.predict_rent(
                    locality=p.location,
                    area_sqft=p.sqft,
                    beds=p.bhk,
                    bathrooms=float(p.bathrooms)
                )
                pred_rent_monthly = ml_rent['estimated_rent_monthly']
            except Exception:
                pred_rent_monthly = p.monthlyRent

            # Calculate goal-aligned score
            appreciation = max(6.5, round(12.0 - (p.askingPriceLakhs / max(pred_price_lakhs, 1.0) - 1.0) * 15.0, 1))
            calc_yield = round((pred_rent_monthly * 12.0) / (p.askingPriceLakhs * 100000.0) * 100.0, 2)
            
            if req.goal == "Rental Income":
                score = calc_yield * 7.0 + appreciation * 2.0
            elif req.goal == "Capital Appreciation":
                score = appreciation * 6.0 + calc_yield * 3.0
            else:
                score = appreciation * 4.5 + calc_yield * 4.5

            if req.risk == "Conservative" and p.askingPriceLakhs > pred_price_lakhs:
                score -= 15

            scored.append((score, p))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored]

    @classmethod
    def compare_selected(cls, db: Session, req: CompareRequest) -> ComparisonResponse:
        properties = []
        for pid in req.property_ids:
            p = property_service.get_by_id(db, pid)
            if p:
                properties.append(p)

        if not properties:
            # If invalid IDs passed, return first 2
            properties = property_service.get_all(db)[:2]

        # Construct comparison rows
        rows = [
            CompareMetricRow(
                metric="asking_price",
                label="Asking Price",
                values={p.id: f"₹{p.askingPriceLakhs:.1f} Lakhs" for p in properties}
            ),
            CompareMetricRow(
                metric="fair_value",
                label="ML Fair Value",
                values={p.id: f"₹{p.fairValueLakhs:.1f} Lakhs" for p in properties}
            ),
            CompareMetricRow(
                metric="deal_status",
                label="Valuation Deal Status",
                values={p.id: p.dealStatus for p in properties}
            ),
            CompareMetricRow(
                metric="monthly_rent",
                label="Expected Monthly Rent",
                values={p.id: f"₹{int(p.monthlyRent):,}/mo" for p in properties}
            ),
            CompareMetricRow(
                metric="annual_yield",
                label="Gross Rental Yield",
                values={p.id: f"{p.annualYield:.2f}% p.a." for p in properties}
            ),
            CompareMetricRow(
                metric="investment_score",
                label="Investment Score",
                values={p.id: f"{p.investmentScore}/100" for p in properties}
            ),
            CompareMetricRow(
                metric="confidence",
                label="Data Confidence",
                values={p.id: f"{p.confidenceScore}%" for p in properties}
            ),
            CompareMetricRow(
                metric="recommendation",
                label="Recommendation Verdict",
                values={p.id: p.recommendation for p in properties}
            ),
        ]

        # Top pick selection
        top_pick = max(properties, key=lambda p: (p.investmentScore, p.annualYield))

        reasoning = [
            f"Top pick '{top_pick.title}' in {top_pick.location} delivers the strongest risk-adjusted return score ({top_pick.investmentScore}/100).",
            f"Offers {top_pick.annualYield}% rental yield compared to sub-market baseline.",
            f"Priced at {top_pick.dealStatus.lower()} relative to ML valuation benchmark of ₹{top_pick.fairValueLakhs:.1f} Lakhs.",
            f"High local registry transaction sample volume ({top_pick.confidenceScore}% confidence score)."
        ]

        return ComparisonResponse(
            selected_properties=properties,
            comparison_table=rows,
            top_pick=top_pick,
            recommendation=f"RECOMMENDED: {top_pick.recommendation} — {top_pick.title}",
            reasoning=reasoning
        )

    @classmethod
    def save_comparison(cls, db: Session, req: SaveComparisonRequest) -> SavedComparisonDetail:
        cmp_id = f"cmp-{uuid.uuid4().hex[:8]}"
        title = req.title or f"Comparison: {req.criteria.get('locality', 'Bengaluru')} ({len(req.selected_property_ids)} properties)"

        model = ComparisonModel(
            id=cmp_id,
            title=title,
            created_at=datetime.utcnow(),
            criteria=req.criteria,
            selected_property_ids=req.selected_property_ids,
            comparison_results=req.comparison_results,
            top_pick=req.top_pick,
            recommendation=req.recommendation,
            reasoning=req.reasoning
        )
        db.add(model)
        db.commit()
        db.refresh(model)

        return SavedComparisonDetail.model_validate(model)

    @classmethod
    def list_saved(cls, db: Session) -> List[SavedComparisonSummary]:
        records = db.query(ComparisonModel).order_by(ComparisonModel.created_at.desc()).all()
        summaries = []
        for r in records:
            criteria = r.criteria or {}
            loc = criteria.get('locality', 'Bengaluru')
            min_b = criteria.get('min_budget', 0)
            max_b = criteria.get('max_budget', 0)
            budget_str = f"₹{min_b}L – ₹{max_b}L" if max_b else "Open Budget"
            goal = criteria.get('goal', 'Balanced')
            props_count = len(r.selected_property_ids) if r.selected_property_ids else 0

            summaries.append(
                SavedComparisonSummary(
                    id=r.id,
                    title=r.title,
                    created_at=r.created_at,
                    location=loc,
                    budget_range=budget_str,
                    goal=goal,
                    properties_count=props_count,
                    top_pick=r.top_pick,
                    recommendation=r.recommendation
                )
            )
        return summaries

    @classmethod
    def get_saved_by_id(cls, db: Session, cmp_id: str) -> Optional[SavedComparisonDetail]:
        r = db.query(ComparisonModel).filter(ComparisonModel.id == cmp_id).first()
        if r:
            return SavedComparisonDetail.model_validate(r)
        return None

    @classmethod
    def delete_saved(cls, db: Session, cmp_id: str) -> bool:
        r = db.query(ComparisonModel).filter(ComparisonModel.id == cmp_id).first()
        if r:
            db.delete(r)
            db.commit()
            return True
        return False

comparison_service = ComparisonService()
