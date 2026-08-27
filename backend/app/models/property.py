from sqlalchemy import Column, String, Float, Integer, Text, JSON
from backend.app.core.database import Base

class PropertyModel(Base):
    __tablename__ = "properties"

    id = Column(String(64), primary_key=True, index=True)
    code = Column(String(32), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    location = Column(String(128), index=True, nullable=False)
    city = Column(String(64), default="Bengaluru", nullable=False)
    category = Column(String(64), default="Residential", nullable=False)
    sub_category = Column(String(128), default="2 BHK • Super built-up Area")
    bhk = Column(Integer, default=2, nullable=False)
    bathrooms = Column(Integer, default=2, nullable=False)
    sqft = Column(Float, nullable=False)
    asking_price_lakhs = Column(Float, nullable=False)
    fair_value_lakhs = Column(Float, nullable=False)
    monthly_rent = Column(Float, nullable=False)
    annual_yield = Column(Float, default=5.0, nullable=False)
    investment_score = Column(Integer, default=85, nullable=False)
    recommendation = Column(String(32), default="BUY", nullable=False)
    confidence_score = Column(Integer, default=80, nullable=False)
    deal_status = Column(String(64), default="Fair Market Value")
    deal_diff_pct = Column(Float, default=0.0)
    image_url = Column(String(512), default="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80")
    
    # JSON metadata fields
    reasons = Column(JSON, default=list)
    risks = Column(JSON, default=list)
    risk_radar = Column(JSON, default=dict)
    waterfall_factors = Column(JSON, default=list)
    explanations = Column(JSON, default=list)
