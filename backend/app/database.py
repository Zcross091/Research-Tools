import sqlite3
import json
import time
from typing import Optional, Any, List, Dict
from app.config import DB_PATH

def init_db():
    """Initialize SQLite database schema."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Primary cache table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cache (
            cache_key TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            expires_at REAL NOT NULL,
            created_at REAL NOT NULL
        )
    """)

    # 2. First-party connector data table (GSC & GA4)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS first_party_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            domain TEXT NOT NULL,
            source TEXT NOT NULL,
            data TEXT NOT NULL,
            updated_at REAL NOT NULL,
            UNIQUE(domain, source)
        )
    """)

    # 3. Site audit reports table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS site_audits (
            domain TEXT PRIMARY KEY,
            audit_data TEXT NOT NULL,
            created_at REAL NOT NULL
        )
    """)

    # 4. Settings table for API keys and adapters
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key_name TEXT PRIMARY KEY,
            key_value TEXT NOT NULL,
            updated_at REAL NOT NULL
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

def save_first_party_data(domain: str, source: str, data: Any):
    """Save or update GSC / GA4 connector data for a domain."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        now = time.time()
        serialized = json.dumps(data)
        cursor.execute("""
            INSERT OR REPLACE INTO first_party_data (domain, source, data, updated_at)
            VALUES (?, ?, ?, ?)
        """, (domain.lower(), source.lower(), serialized, now))
        conn.commit()
        conn.close()
    except Exception:
        pass

def get_first_party_data(domain: str, source: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve first-party datasets for a domain."""
    results = []
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        if source:
            cursor.execute("SELECT domain, source, data, updated_at FROM first_party_data WHERE domain = ? AND source = ?", (domain.lower(), source.lower()))
        else:
            cursor.execute("SELECT domain, source, data, updated_at FROM first_party_data WHERE domain = ?", (domain.lower(),))
        rows = cursor.fetchall()
        conn.close()
        for r in rows:
            results.append({
                "domain": r[0],
                "source": r[1],
                "data": json.loads(r[2]),
                "updated_at": r[3]
            })
    except Exception:
        pass
    return results

def save_site_audit(domain: str, audit_data: Any):
    """Persist site audit crawler scan report."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        now = time.time()
        serialized = json.dumps(audit_data)
        cursor.execute("""
            INSERT OR REPLACE INTO site_audits (domain, audit_data, created_at)
            VALUES (?, ?, ?)
        """, (domain.lower(), serialized, now))
        conn.commit()
        conn.close()
    except Exception:
        pass

def get_site_audit(domain: str) -> Optional[Dict[str, Any]]:
    """Fetch latest site audit report for a domain."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT audit_data FROM site_audits WHERE domain = ?", (domain.lower(),))
        row = cursor.fetchone()
        conn.close()
        if row:
            return json.loads(row[0])
    except Exception:
        pass
    return None

def save_setting(key_name: str, key_value: str):
    """Save an API key or adapter configuration setting."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        now = time.time()
        cursor.execute("""
            INSERT OR REPLACE INTO settings (key_name, key_value, updated_at)
            VALUES (?, ?, ?)
        """, (key_name, key_value, now))
        conn.commit()
        conn.close()
    except Exception:
        pass

def get_all_settings() -> Dict[str, str]:
    """Retrieve all saved settings."""
    settings = {}
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT key_name, key_value FROM settings")
        rows = cursor.fetchall()
        conn.close()
        for r in rows:
            settings[r[0]] = r[1]
    except Exception:
        pass
    return settings
