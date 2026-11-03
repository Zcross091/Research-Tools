import sqlite3
import json
import time
from typing import Optional, Any
from app.config import DB_PATH

def init_db():
    """Initialize SQLite caching database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cache (
            cache_key TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            expires_at REAL NOT NULL,
            created_at REAL NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def get_cache(key: str) -> Optional[Any]:
    """Retrieve unexpired cached data by key."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        now = time.time()
        cursor.execute("SELECT data FROM cache WHERE cache_key = ? AND expires_at > ?", (key, now))
        row = cursor.fetchone()
        conn.close()
        if row:
            return json.loads(row[0])
    except Exception:
        pass
    return None

def set_cache(key: str, data: Any, ttl_seconds: int = 86400):
    """Store data in cache with TTL."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        now = time.time()
        expires_at = now + ttl_seconds
        serialized = json.dumps(data)
        cursor.execute("""
            INSERT OR REPLACE INTO cache (cache_key, data, expires_at, created_at)
            VALUES (?, ?, ?, ?)
        """, (key, serialized, expires_at, now))
        conn.commit()
        conn.close()
    except Exception:
        pass

