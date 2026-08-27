from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from backend.app.schemas.property import PropertyBase

class RequirementSearchRequest(BaseModel):
    locality: Optional[str] = "Whitefield"
    min_budget: Optional[float] = 20.0
    max_budget: Optional[float] = 100.0
    property_type: Optional[str] = "Residential"
    bhk: Optional[int] = None
    min_sqft: Optional[float] = None
    max_sqft: Optional[float] = None
    goal: Optional[str] = "Capital Appreciation"
    risk: Optional[str] = "Moderate"
    holding_period: Optional[str] = "3–5 years"

class CompareRequest(BaseModel):
    property_ids: List[str]
    criteria: Optional[RequirementSearchRequest] = None

class CompareMetricRow(BaseModel):
    metric: str
    label: str
    values: Dict[str, Any]

class ComparisonResponse(BaseModel):
    selected_properties: List[PropertyBase]
    comparison_table: List[CompareMetricRow]
    top_pick: PropertyBase
    recommendation: str
    reasoning: List[str]

class SaveComparisonRequest(BaseModel):
    title: Optional[str] = None
    criteria: Dict[str, Any]
    selected_property_ids: List[str]
    comparison_results: Dict[str, Any]
    top_pick: str
    recommendation: str
    reasoning: List[str]

class SavedComparisonSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    created_at: datetime
    location: str
    budget_range: str
    goal: str
    properties_count: int
    top_pick: str
    recommendation: str

class SavedComparisonDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    created_at: datetime
    criteria: Dict[str, Any]
    selected_property_ids: List[str]
    comparison_results: Dict[str, Any]
    top_pick: str
    recommendation: str
    reasoning: List[str]
