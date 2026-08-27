from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.property import PropertyBase, AnalyzeRequest, AnalyzeResponse
from backend.app.schemas.comparison import CompareRequest, ComparisonResponse
from backend.app.services.property_service import property_service
from backend.app.services.comparison_service import comparison_service
from backend.app.services.prediction_service import prediction_service

router = APIRouter(prefix="/properties", tags=["Properties"])

@router.get("", response_model=List[PropertyBase])
def get_properties(
    location: Optional[str] = Query(None, description="Filter by location/corridor"),
    property_type: Optional[str] = Query(None, description="Filter by property category"),
    bhk: Optional[int] = Query(None, description="Filter by BHK count"),
    min_budget: Optional[float] = Query(None, description="Minimum asking price in ₹ Lakhs"),
    max_budget: Optional[float] = Query(None, description="Maximum asking price in ₹ Lakhs"),
    min_area: Optional[float] = Query(None, description="Minimum square footage"),
    max_area: Optional[float] = Query(None, description="Maximum square footage"),
    db: Session = Depends(get_db)
):
    """
    Get verified Bengaluru properties with optional filtering.
    """
    return property_service.get_all(
        db,
        location=location,
        property_type=property_type,
        bhk=bhk,
        min_budget=min_budget,
        max_budget=max_budget,
        min_area=min_area,
        max_area=max_area
    )

@router.get("/{property_id}", response_model=PropertyBase)
def get_property(property_id: str, db: Session = Depends(get_db)):
    """
    Get detailed property analysis by ID.
    """
    prop = property_service.get_by_id(db, property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop

@router.post("/compare", response_model=ComparisonResponse)
def compare_properties(req: CompareRequest, db: Session = Depends(get_db)):
    """
    Compute comparative investment metrics and top pick for selected properties.
    """
    return comparison_service.compare_selected(db, req)

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_property(req: AnalyzeRequest):
    """
    Run ML prediction, rental estimate, and risk analysis for custom property attributes.
    """
    return prediction_service.analyze_property(req)
