from fastapi import APIRouter, Query, HTTPException
from app.models.schemas import SocialResponse, VideoSEOAnalysis
from app.services.social_service import analyze_creator, scrape_youtube_video_tags

router = APIRouter(prefix="/api/social", tags=["Social & Video Creator Intelligence"])

@router.get("/analyze", response_model=SocialResponse)
async def analyze_social(query: str = Query(..., description="YouTube channel handle, name, or video URL")):
    try:
        return await analyze_creator(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze social creator: {str(e)}")

@router.get("/tags", response_model=VideoSEOAnalysis)
async def get_video_tags(video_id: str = Query(..., description="11-character YouTube video ID or URL")):
    try:
        return await scrape_youtube_video_tags(video_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract video tags: {str(e)}")

