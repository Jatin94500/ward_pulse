from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PredictionRow(BaseModel):
    ward_id: int = Field(..., example=5, description="BBMP Ward ID (1-198)")
    month: str = Field(..., example="2024-06", description="Prediction month in YYYY-MM format")
    category_group: str = Field(..., example="solid_waste", description="Category: electrical, solid_waste, roads, trees, animals_health, other")

class PredictionBatchRequest(BaseModel):
    rows: List[PredictionRow] = Field(..., description="List of rows to predict")

class PredictionOutput(BaseModel):
    ward_id: int
    month: str
    category_group: str
    predicted_count: float
    pred_rate_per_1000: float
    uncertainty_pct: Optional[float] = None
    estimated_cost_inr: Optional[float] = Field(None, description="Estimated monthly complaint resolution cost in INR")
    personnel_required: Optional[int] = Field(None, description="Estimated field workers/crew required for resolution")

class PredictionBatchResponse(BaseModel):
    total_records: int
    latency_ms: float
    predictions: List[PredictionOutput]

class WardInfo(BaseModel):
    ward_id: int
    ward_name: str
    bbmp_zone_name: str
    population_2011: int
    area_sq_km: float
    road_length_kms: Optional[float] = None
    streetlights: Optional[int] = None
    has_history: bool

class MunicipalResourceAllocation(BaseModel):
    total_cost_inr: float
    total_workforce_required: int
    cost_breakdown: Dict[str, float]
    workforce_breakdown: Dict[str, int]

class WardDetailResponse(BaseModel):
    ward: WardInfo
    category_breakdown: Dict[str, float]
    predicted_demand_total: float
    uncertainty_pct: float
    resource_allocation: Optional[MunicipalResourceAllocation] = None

class MetaResponse(BaseModel):
    title: str
    total_wards: int
    categories: List[str]
    zones: List[str]
    available_months: List[str]
    models_loaded: List[str]
    version: str

class CustomWardRequest(BaseModel):
    ward_name: Optional[str] = Field("Hypothetical Unknown Ward", description="Name or identifier of ward")
    zone_name: Optional[str] = Field("Mahadevapura", description="BBMP Zone name")
    category_group: str = Field("solid_waste", description="Category: solid_waste, electrical, roads, trees, animals_health, other")
    population: int = Field(50000, description="Census or estimated population")
    area_sq_km: float = Field(8.0, description="Surface area in square km")
    households: Optional[int] = Field(12000, description="Total households")
    road_length_kms: Optional[float] = Field(120.0, description="Road length in km")
    streetlights: Optional[int] = Field(3200, description="Streetlights count")
    lakes: Optional[int] = Field(2, description="Lakes count")
    parks: Optional[int] = Field(10, description="Parks count")
    bus_stops: Optional[int] = Field(35, description="Bus stops count")
    month: Optional[str] = Field("2024-06", description="Prediction month (YYYY-MM)")

class CustomWardResponse(BaseModel):
    ward_name: str
    zone_name: str
    category_group: str
    month: str
    population: int
    predicted_count: float
    pred_rate_per_1000: float
    uncertainty_pct: float
    estimated_cost_inr: float
    personnel_required: int
    features_used: Dict[str, Any]
    explanation: str

