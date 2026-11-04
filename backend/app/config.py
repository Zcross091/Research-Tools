import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "cache.db"
DEFAULT_CACHE_TTL_HOURS = 24

# Optional external API keys (defaults to graceful fallback mode)
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
CRUX_API_KEY = os.getenv("CRUX_API_KEY", "")

# Enterprise 3rd-party API credentials
DATAFORSEO_LOGIN = os.getenv("DATAFORSEO_LOGIN", "")
DATAFORSEO_PASSWORD = os.getenv("DATAFORSEO_PASSWORD", "")
AHREFS_API_KEY = os.getenv("AHREFS_API_KEY", "")
