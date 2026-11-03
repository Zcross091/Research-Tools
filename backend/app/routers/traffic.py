from fastapi import APIRouter, Query, HTTPException
from app.models.schemas import TrafficResponse
from app.services.traffic_service import analyze_domain_traffic

router = APIRouter(prefix="/api/traffic", tags=["Website & Competitor Intelligence"])

@router.get("/analyze", response_model=TrafficResponse)
async def analyze_traffic(domain: str = Query(..., description="Website domain e.g. stripe.com or nike.com")):
    try:
        return await analyze_domain_traffic(domain)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze domain: {str(e)}")

