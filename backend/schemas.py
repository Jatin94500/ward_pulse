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

class WardDetailResponse(BaseModel):
    ward: WardInfo
    category_breakdown: Dict[str, float]
    predicted_demand_total: float
    uncertainty_pct: float

class MetaResponse(BaseModel):
    title: str
    total_wards: int
    categories: List[str]
    zones: List[str]
    available_months: List[str]
    models_loaded: List[str]
    version: str
