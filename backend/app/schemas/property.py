from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class PropertyBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    title: str
    location: str
    city: str = "Bengaluru"
    category: str = "Residential"
    subCategory: Optional[str] = None
    bhk: int = 2
    bathrooms: int = 2
    sqft: float
    askingPriceLakhs: float
    fairValueLakhs: float
    monthlyRent: float
    annualYield: float
    investmentScore: int
    recommendation: str
    confidenceScore: int
    dealStatus: str
    dealDiffPct: float
    imageUrl: str
    reasons: List[str] = []
    risks: List[str] = []
    riskRadar: Optional[Dict[str, Any]] = None
    waterfallFactors: Optional[List[Dict[str, Any]]] = None
    explanations: Optional[List[str]] = None

class PropertyFilterParams(BaseModel):
    location: Optional[str] = None
    property_type: Optional[str] = None
    bhk: Optional[int] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    min_area: Optional[float] = None
    max_area: Optional[float] = None

class AnalyzeRequest(BaseModel):
    location: str = "Whitefield"
    sqft: float = 1200.0
    bhk: int = 2
    bathrooms: Optional[float] = None
    asking_price_lakhs: Optional[float] = None
    monthly_rent: Optional[float] = None

class AnalyzeResponse(BaseModel):
    location: str
    sqft: float
    bhk: int
    bathrooms: float
    asking_price_lakhs: float
    fair_value_lakhs: float
    fair_value_range_lower: float
    fair_value_range_upper: float
    price_per_sqft: float
    monthly_rent: float
    rent_per_sqft: float
    annual_yield: float
    deal_status: str
    deal_diff_pct: float
    investment_score: int
    confidence_score: int
    recommendation: str
    risk_radar: Dict[str, int]
    waterfall_factors: List[Dict[str, Any]]
    reasons: List[str]
    risks: List[str]
    forecast: Optional[Dict[str, Any]] = None
