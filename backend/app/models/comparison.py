from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, Text
from backend.app.core.database import Base

class ComparisonModel(Base):
    __tablename__ = "comparisons"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Structured JSON columns
    criteria = Column(JSON, nullable=False)  # User requirements: location, budgetMin, budgetMax, bhk, etc.
    selected_property_ids = Column(JSON, nullable=False)  # List of compared property IDs
    comparison_results = Column(JSON, nullable=False)  # Computed comparison rows and metric comparisons
    
    top_pick = Column(String(255), nullable=False)
    recommendation = Column(String(64), default="BUY", nullable=False)
    reasoning = Column(JSON, nullable=False)  # Array of reason strings
