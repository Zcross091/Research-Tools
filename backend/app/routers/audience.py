from fastapi import APIRouter, Query, HTTPException
from app.models.schemas import AudienceResponse
from app.services.audience_service import analyze_audience

router = APIRouter(prefix="/api/audience", tags=["Audience & Brand Intelligence"])

@router.get("/analyze", response_model=AudienceResponse)
async def analyze_audience_endpoint(topic: str = Query(..., description="Target market, topic, or niche")):
    try:
        return await analyze_audience(topic)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze audience: {str(e)}")

