import os
import json
import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.property import PropertyModel
from backend.app.schemas.property import PropertyBase

logger = logging.getLogger(__name__)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

class PropertyService:
    @staticmethod
    def to_schema(model: PropertyModel) -> PropertyBase:
        return PropertyBase(
            id=model.id,
            code=model.code,
            title=model.title,
            location=model.location,
            city=model.city,
            category=model.category,
            subCategory=model.sub_category,
            bhk=model.bhk,
            bathrooms=model.bathrooms,
            sqft=model.sqft,
            askingPriceLakhs=model.asking_price_lakhs,
            fairValueLakhs=model.fair_value_lakhs,
            monthlyRent=model.monthly_rent,
            annualYield=model.annual_yield,
            investmentScore=model.investment_score,
            recommendation=model.recommendation,
            confidenceScore=model.confidence_score,
            dealStatus=model.deal_status,
            dealDiffPct=model.deal_diff_pct,
            imageUrl=model.image_url,
            reasons=model.reasons or [],
            risks=model.risks or [],
            riskRadar=model.risk_radar or {},
            waterfallFactors=model.waterfall_factors or [],
            explanations=model.explanations or []
        )

    @classmethod
    def get_all(
        cls,
        db: Session,
        location: Optional[str] = None,
        property_type: Optional[str] = None,
        bhk: Optional[int] = None,
        min_budget: Optional[float] = None,
        max_budget: Optional[float] = None,
        min_area: Optional[float] = None,
        max_area: Optional[float] = None
    ) -> List[PropertyBase]:
        cls.ensure_seeded(db)
        query = db.query(PropertyModel)

        if location and location.strip() and location != "Any Bengaluru" and location != "Any":
            loc_term = f"%{location.strip().lower()}%"
            query = query.filter(PropertyModel.location.ilike(loc_term))

        if property_type and property_type.strip() and property_type != "Any":
            query = query.filter(PropertyModel.category.ilike(f"%{property_type.strip()}%"))

        if bhk is not None and bhk > 0:
            query = query.filter(PropertyModel.bhk == bhk)

        if min_budget is not None:
            query = query.filter(PropertyModel.asking_price_lakhs >= min_budget)

        if max_budget is not None:
            query = query.filter(PropertyModel.asking_price_lakhs <= max_budget)

        if min_area is not None:
            query = query.filter(PropertyModel.sqft >= min_area)

        if max_area is not None:
            query = query.filter(PropertyModel.sqft <= max_area)

        results = query.all()
        return [cls.to_schema(p) for p in results]

    @classmethod
    def get_by_id(cls, db: Session, property_id: str) -> Optional[PropertyBase]:
        cls.ensure_seeded(db)
        p = db.query(PropertyModel).filter(PropertyModel.id == property_id).first()
        if p:
            return cls.to_schema(p)
        return None

    @classmethod
    def ensure_seeded(cls, db: Session):
        count = db.query(PropertyModel).count()
        if count > 0:
            return

        json_path = os.path.join(ROOT_DIR, "frontend", "src", "data", "realProperties.json")
        if not os.path.exists(json_path):
            logger.warning("Dataset JSON not found at %s", json_path)
            return

        with open(json_path, "r", encoding="utf-8") as f:
            raw_props = json.load(f)

        for p in raw_props:
            prop_model = PropertyModel(
                id=p.get("id"),
                code=p.get("code"),
                title=p.get("title"),
                location=p.get("location"),
                city=p.get("city", "Bengaluru"),
                category=p.get("category", "Residential"),
                sub_category=p.get("subCategory", ""),
                bhk=p.get("bhk", 2),
                bathrooms=p.get("bathrooms", 2),
                sqft=float(p.get("sqft", 1000)),
                asking_price_lakhs=float(p.get("askingPriceLakhs", 50)),
                fair_value_lakhs=float(p.get("fairValueLakhs", 50)),
                monthly_rent=float(p.get("monthlyRent", 25000)),
                annual_yield=float(p.get("annualYield", 5.0)),
                investment_score=int(p.get("investmentScore", 85)),
                recommendation=p.get("recommendation", "BUY"),
                confidence_score=int(p.get("confidenceScore", 80)),
                deal_status=p.get("dealStatus", "Fair Market Value"),
                deal_diff_pct=float(p.get("dealDiffPct", 0.0)),
                image_url=p.get("imageUrl", ""),
                reasons=p.get("reasons", []),
                risks=p.get("risks", []),
                risk_radar=p.get("riskRadar", {}),
                waterfall_factors=p.get("waterfallFactors", []),
                explanations=p.get("explanations", [])
            )
            db.add(prop_model)

        db.commit()
        logger.info("Successfully seeded %d Bengaluru properties into database", len(raw_props))

property_service = PropertyService()
