from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routers import traffic, social, keywords, audience, connectors, audit, settings, summary

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
            "settings": "/api/settings/keys"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
