from fastapi import APIRouter
from app.models.schemas import ApiKeysSettingPayload, ApiKeysStatusResponse
from app.database import save_setting, get_all_settings

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/keys", response_model=ApiKeysStatusResponse)
def get_api_keys_status():
    """
    Returns active API credentials status without exposing full secret keys.
    """
    settings = get_all_settings()
    dfs_login = settings.get("dataforseo_login", "")
    dfs_pass = settings.get("dataforseo_password", "")
    ahrefs = settings.get("ahrefs_api_key", "")
    crux = settings.get("crux_api_key", "")

    return ApiKeysStatusResponse(
        has_dataforseo=bool(dfs_login and dfs_pass),
        has_ahrefs=bool(ahrefs),
        has_crux=bool(crux),
        dataforseo_login_partial=dfs_login[:4] + "***" if len(dfs_login) >= 4 else ("***" if dfs_login else "")
    )

@router.post("/keys")
def save_api_keys(payload: ApiKeysSettingPayload):
    """
    Saves third-party API credentials into backend settings database.
    """
    if payload.dataforseo_login is not None:
        save_setting("dataforseo_login", payload.dataforseo_login.strip())
    if payload.dataforseo_password is not None:
        save_setting("dataforseo_password", payload.dataforseo_password.strip())
    if payload.ahrefs_api_key is not None:
        save_setting("ahrefs_api_key", payload.ahrefs_api_key.strip())
    if payload.crux_api_key is not None:
        save_setting("crux_api_key", payload.crux_api_key.strip())

    return {
        "status": "success",
        "message": "API keys updated successfully."
    }
