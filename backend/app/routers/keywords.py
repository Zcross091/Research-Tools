from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.models.schemas import KeywordResponse
from app.services.keyword_service import analyze_keyword, fetch_live_google_suggestions

router = APIRouter(prefix="/api/keywords", tags=["Keyword & Trend Intelligence"])

@router.get("/analyze", response_model=KeywordResponse)
async def analyze_keyword_endpoint(q: str = Query(..., description="Target keyword or search phrase")):
    try:
        return await analyze_keyword(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze keyword: {str(e)}")

@router.get("/suggestions", response_model=List[str])
async def get_suggestions(q: str = Query(..., description="Query prefix")):
    try:
        return await fetch_live_google_suggestions(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch suggestions: {str(e)}")

