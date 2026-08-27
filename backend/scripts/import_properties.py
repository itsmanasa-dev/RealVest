import os
import sys
import json
import logging
import pandas as pd

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.property import PropertyModel
from backend.app.services.prediction_service import prediction_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("import_properties")

def import_bengaluru_properties():
    """
    Import verified Bengaluru properties from processed datasets into MySQL database.
    """
    logger.info("Connecting to database and creating tables if needed...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Load verified properties from realProperties.json
        json_path = os.path.join(ROOT_DIR, "frontend", "src", "data", "realProperties.json")
        if not os.path.exists(json_path):
            logger.error("realProperties.json not found at %s", json_path)
            return

        with open(json_path, "r", encoding="utf-8") as f:
            properties = json.load(f)

        imported = 0
        updated = 0

        for p in properties:
            existing = db.query(PropertyModel).filter(PropertyModel.id == p['id']).first()
            if existing:
                # Update fields
                existing.title = p.get('title', existing.title)
                existing.location = p.get('location', existing.location)
                existing.asking_price_lakhs = float(p.get('askingPriceLakhs', existing.asking_price_lakhs))
                existing.fair_value_lakhs = float(p.get('fairValueLakhs', existing.fair_value_lakhs))
                existing.monthly_rent = float(p.get('monthlyRent', existing.monthly_rent))
                existing.annual_yield = float(p.get('annualYield', existing.annual_yield))
                existing.investment_score = int(p.get('investmentScore', existing.investment_score))
                existing.recommendation = p.get('recommendation', existing.recommendation)
                updated += 1
            else:
                new_prop = PropertyModel(
                    id=p.get('id'),
                    code=p.get('code'),
                    title=p.get('title'),
                    location=p.get('location'),
                    city=p.get('city', 'Bengaluru'),
                    category=p.get('category', 'Residential'),
                    sub_category=p.get('subCategory', ''),
                    bhk=p.get('bhk', 2),
                    bathrooms=p.get('bathrooms', 2),
                    sqft=float(p.get('sqft', 1000)),
                    asking_price_lakhs=float(p.get('askingPriceLakhs', 50)),
                    fair_value_lakhs=float(p.get('fairValueLakhs', 50)),
                    monthly_rent=float(p.get('monthlyRent', 25000)),
                    annual_yield=float(p.get('annualYield', 5.0)),
                    investment_score=int(p.get('investmentScore', 85)),
                    recommendation=p.get('recommendation', 'BUY'),
                    confidence_score=int(p.get('confidenceScore', 80)),
                    deal_status=p.get('dealStatus', 'Fair Market Value'),
                    deal_diff_pct=float(p.get('dealDiffPct', 0.0)),
                    image_url=p.get('imageUrl', ''),
                    reasons=p.get('reasons', []),
                    risks=p.get('risks', []),
                    risk_radar=p.get('riskRadar', {}),
                    waterfall_factors=p.get('waterfallFactors', []),
                    explanations=p.get('explanations', [])
                )
                db.add(new_prop)
                imported += 1

        db.commit()
        total_count = db.query(PropertyModel).count()
        logger.info(
            "Import completed: %d new inserted, %d updated. Total in database: %d",
            imported, updated, total_count
        )
    finally:
        db.close()

if __name__ == "__main__":
    import_bengaluru_properties()
