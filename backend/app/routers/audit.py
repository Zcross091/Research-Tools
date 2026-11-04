from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.models.schemas import SiteAuditResponse
from app.services.site_audit_crawler import audit_domain_site
from app.database import get_site_audit

router = APIRouter(prefix="/api/audit", tags=["site_audit"])

@router.post("/run", response_model=SiteAuditResponse)
async def run_site_audit(
    domain: str = Query(..., description="Target domain name to audit"),
    max_pages: int = Query(20, ge=5, le=50, description="Max pages to crawl")
):
    """
    Triggers an asynchronous site audit scan for canonical tags, status codes, broken links, and SEO health.
    """
    if not domain.strip():
        raise HTTPException(status_code=400, detail="Domain parameter is required.")

    return await audit_domain_site(domain.strip(), max_pages=max_pages)

@router.get("/results", response_model=SiteAuditResponse)
async def get_site_audit_results(
    domain: str = Query(..., description="Target domain name")
):
    """
    Fetches the latest site audit report for a domain, or triggers a scan if none exists.
    """
    domain_clean = domain.strip().lower()
    cached = get_site_audit(domain_clean)
    if cached:
        try:
            return SiteAuditResponse(**cached)
        except Exception:
            pass

    return await audit_domain_site(domain_clean, max_pages=15)
