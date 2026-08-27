from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.property import PropertyBase
from backend.app.schemas.comparison import (
    RequirementSearchRequest,
    SaveComparisonRequest,
    SavedComparisonSummary,
    SavedComparisonDetail
)
from backend.app.services.comparison_service import comparison_service

router = APIRouter(prefix="/comparisons", tags=["Comparisons"])

@router.post("/search", response_model=List[PropertyBase])
def search_matching_properties(
    req: RequirementSearchRequest,
    db: Session = Depends(get_db)
):
    """
    Search and rank candidate properties matching user requirements and investment goals.
    """
    return comparison_service.search_candidates(db, req)

@router.post("", response_model=SavedComparisonDetail)
def save_comparison(
    req: SaveComparisonRequest,
    db: Session = Depends(get_db)
):
    """
    Save property comparison scenario to MySQL database.
    """
    return comparison_service.save_comparison(db, req)

@router.get("", response_model=List[SavedComparisonSummary])
def list_saved_comparisons(db: Session = Depends(get_db)):
    """
    Retrieve all saved comparison scenarios from MySQL database.
    """
    return comparison_service.list_saved(db)

@router.get("/{comparison_id}", response_model=SavedComparisonDetail)
def get_saved_comparison(
    comparison_id: str,
    db: Session = Depends(get_db)
):
    """
    Get full saved comparison scenario by ID.
    """
    cmp = comparison_service.get_saved_by_id(db, comparison_id)
    if not cmp:
        raise HTTPException(status_code=404, detail="Saved comparison not found")
    return cmp

@router.delete("/{comparison_id}")
def delete_saved_comparison(
    comparison_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete saved comparison scenario from database.
    """
    success = comparison_service.delete_saved(db, comparison_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved comparison not found")
    return {"status": "success", "message": f"Comparison {comparison_id} deleted successfully"}
