import time
from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from typing import List, Optional

from backend.config import API_KEY, API_KEY_NAME
from backend.auth import verify_api_key
from backend.schemas import (
    PredictionRow,
    PredictionBatchRequest,
    PredictionBatchResponse,
    PredictionOutput,
    WardDetailResponse,
    MetaResponse,
)
from backend.predict import model_service

app = FastAPI(
    title="Ward Pulse API · Bangalore Civic AI",
    description="""
### Ward Pulse Backend API

Estimates civic complaints (solid waste, roads, electrical, trees, water, animal health) for municipal wards in Bengaluru (BBMP) with zero complaint history using LightGBM ensemble models.

#### Authentication:
Protected endpoints (`/api/predict` and `/api/predict/batch`) require an **API Key**.
- Header: `X-API-Key: wardpulse-key-2026`
- Click the **Authorize 🔓** button below and enter: `wardpulse-key-2026`.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for React frontend on Vite port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
def root():
    """Redirect root directly to interactive Swagger docs"""
    return RedirectResponse(url="/docs")

@app.get("/health", tags=["System"])
def health_check():
    """Check API health and loaded model status"""
    return {
        "status": "healthy",
        "models_count": len(model_service.models),
        "wards_count": len(model_service.ward_features) if model_service.ward_features is not None else 0,
        "api_key_configured": bool(API_KEY),
    }

@app.get("/api/meta", response_model=MetaResponse, tags=["Metadata"])
def get_metadata():
    """Returns available categories, BBMP zones, prediction months, and model summary"""
    return model_service.get_meta()

@app.get("/api/geojson", tags=["Geospatial"])
def get_geojson():
    """Returns the 198 Bangalore BBMP ward boundaries GeoJSON"""
    if model_service.geojson is None:
        raise HTTPException(status_code=404, detail="GeoJSON file not found.")
    return model_service.geojson

@app.get("/api/wards", tags=["Wards"])
def list_wards(zone: Optional[str] = Query(None, description="Filter by BBMP Zone")):
    """List all 198 Bangalore wards with demographic and geographic features"""
    if model_service.ward_features is None:
        raise HTTPException(status_code=500, detail="Ward features not loaded.")
    
    df = model_service.ward_features
    if zone and zone != "All":
        df = df[df["bbmp_zone_name"].str.lower() == zone.lower()]

    columns = ["ward_id", "ward_name", "bbmp_zone_name", "population_2011", "area_sq_km", "road_length_kms", "streetlights"]
    available_cols = [c for c in columns if c in df.columns]
    records = df[available_cols].to_dict(orient="records")
    return {"total": len(records), "wards": records}

@app.get("/api/ward/{ward_id}", response_model=WardDetailResponse, tags=["Wards"])
def get_ward_detail(ward_id: int):
    """Get detailed attributes, predicted demand, and category breakdown for a specific ward"""
    detail = model_service.get_ward_detail(ward_id)
    if detail is None:
        raise HTTPException(status_code=404, detail=f"Ward #{ward_id} not found.")
    return detail

@app.get("/api/top", tags=["Analytics"])
def get_top_wards(
    category_group: str = Query("solid_waste", description="Category to rank"),
    month: str = Query("2024-06", description="Prediction month (YYYY-MM)"),
    limit: int = Query(10, ge=1, le=50, description="Top N wards to return"),
):
    """Returns top N wards with the highest predicted complaint demand"""
    top_wards = model_service.get_top_wards(category_group=category_group, month=month, limit=limit)
    return {"category": category_group, "month": month, "top_wards": top_wards}

@app.post(
    "/api/predict",
    response_model=PredictionOutput,
    tags=["Predictions (Secured)"],
    dependencies=[Depends(verify_api_key)]
)
def predict_single_ward(row: PredictionRow):
    """
    **Secured with API Key**: Predict complaint count and rate for a specific ward, category, and month.
    """
    res = model_service.predict_single(row.ward_id, row.month, row.category_group)
    return res

@app.post(
    "/api/predict/batch",
    response_model=PredictionBatchResponse,
    tags=["Predictions (Secured)"],
    dependencies=[Depends(verify_api_key)]
)
def predict_batch_wards(request: PredictionBatchRequest):
    """
    **Secured with API Key**: Batch inference for multiple ward predictions.
    Accepts an array of `{ward_id, month, category_group}` objects.
    """
    start_time = time.time()
    rows = [r.dict() for r in request.rows]
    predictions = model_service.predict_batch(rows)
    latency_ms = (time.time() - start_time) * 1000.0

    return {
        "total_records": len(predictions),
        "latency_ms": round(latency_ms, 2),
        "predictions": predictions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
