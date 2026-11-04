from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import init_db
from app.routers import traffic, social, keywords, audience, connectors, audit, settings, summary

# Filesystem paths
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
PUBLIC_DIR = ROOT_DIR / "frontend" / "public"
DOWNLOADS_DIR = ROOT_DIR / "downloads"
LANDING_FILE = ROOT_DIR / "index.html"

# Ensure downloads directory exists
DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
if PUBLIC_DIR.exists():
    (PUBLIC_DIR / "downloads").mkdir(parents=True, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize persistent SQLite database
    init_db()
    yield

app = FastAPI(
    title="Unified Research Tools API",
    description="All-in-one market, competitor, audience, keyword, and site audit intelligence engine.",
    version="1.2.0",
    lifespan=lifespan
)

# Enable CORS for local and web frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(traffic.router)
app.include_router(social.router)
app.include_router(keywords.router)
app.include_router(audience.router)
app.include_router(connectors.router)
app.include_router(audit.router)
app.include_router(settings.router)
app.include_router(summary.router)

@app.get("/")
def read_root():
    return {
        "name": "Unified Research Tools API",
        "version": "1.2.0",
        "status": "operational",
        "endpoints": {
            "traffic": "/api/traffic/analyze?domain={domain}",
            "social": "/api/social/analyze?query={channel_or_video}",
            "keywords": "/api/keywords/analyze?q={keyword}",
            "audience": "/api/audience/analyze?topic={topic}",
            "audit": "/api/audit/run?domain={domain}",
            "summary": "/api/summary/generate",
            "connectors": "/api/connectors/summary?domain={domain}",
            "settings": "/api/settings/keys",
            "download_portal": "/portal",
            "landing_page": "/landing"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Clean direct routes for portals and assets
@app.get("/portal", include_in_schema=False)
@app.get("/download", include_in_schema=False)
def serve_download_portal():
    download_html = PUBLIC_DIR / "download.html"
    if download_html.exists():
        return FileResponse(str(download_html), media_type="text/html")
    raise HTTPException(status_code=404, detail="Download portal page not found")

@app.get("/landing", include_in_schema=False)
def serve_landing_page():
    if LANDING_FILE.exists():
        return FileResponse(str(LANDING_FILE), media_type="text/html")
    raise HTTPException(status_code=404, detail="Landing page not found")

@app.get("/favicon.svg", include_in_schema=False)
def serve_favicon():
    favicon = PUBLIC_DIR / "favicon.svg"
    if favicon.exists():
        return FileResponse(str(favicon), media_type="image/svg+xml")
    raise HTTPException(status_code=404, detail="Favicon not found")

# Mount static file directories for downloads and public assets
if PUBLIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(PUBLIC_DIR), html=True), name="static")

if DOWNLOADS_DIR.exists():
    app.mount("/downloads", StaticFiles(directory=str(DOWNLOADS_DIR)), name="downloads")

