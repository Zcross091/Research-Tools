from fastapi import APIRouter, Body
from typing import Dict, Any, List
from app.services.ai_summary_service import generate_executive_summary

router = APIRouter(prefix="/api/summary", tags=["summary"])

@router.post("/generate")
def get_ai_executive_summary(payload: Dict[str, Any] = Body(...)):
    """
    Generates 3 executive natural language summary bullet points.
    Expected JSON: {"module_type": "traffic", "data": {...}}
    """
    module_type = payload.get("module_type", "traffic")
    data = payload.get("data", {})
    bullets = generate_executive_summary(module_type, data)
    return {
        "module_type": module_type,
        "bullets": bullets
    }
