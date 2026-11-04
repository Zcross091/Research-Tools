from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Query
from typing import Optional
from app.models.schemas import FirstPartySummaryResponse
from app.services.connector_service import parse_gsc_csv, parse_ga4_csv, get_first_party_summary

router = APIRouter(prefix="/api/connectors", tags=["connectors"])

@router.post("/gsc/upload")
async def upload_gsc_performance(
    domain: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload Google Search Console Performance CSV export for a target domain.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted for Google Search Console uploads.")

    content = (await file.read()).decode("utf-8", errors="ignore")
    parsed = parse_gsc_csv(content, domain)
    return {
        "status": "success",
        "message": f"Successfully parsed {len(parsed.get('queries', []))} GSC queries for {domain}.",
        "summary": parsed
    }

@router.post("/ga4/upload")
async def upload_ga4_traffic(
    domain: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload Google Analytics 4 Traffic/Pages CSV export for a target domain.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted for GA4 uploads.")

    content = (await file.read()).decode("utf-8", errors="ignore")
    parsed = parse_ga4_csv(content, domain)
    return {
        "status": "success",
        "message": f"Successfully parsed GA4 traffic ({parsed.get('monthly_sessions')} sessions) for {domain}.",
        "summary": parsed
    }

@router.get("/summary", response_model=FirstPartySummaryResponse)
def get_connector_summary(domain: str = Query(..., description="Target domain name")):
    """
    Retrieves connected first-party dataset status (GSC & GA4) for a domain.
    """
    return get_first_party_summary(domain)
