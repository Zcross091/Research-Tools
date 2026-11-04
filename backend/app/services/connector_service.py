"""
Connector Service Module
========================
Handles parsing, storage, and retrieval of Google Search Console (GSC)
and Google Analytics 4 (GA4) first-party performance exports.
"""

import csv
import io
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.models.schemas import FirstPartySummaryResponse, GscQueryItem
from app.database import save_first_party_data, get_first_party_data

def parse_gsc_csv(csv_content: str, domain: str) -> Dict[str, Any]:
    """
    Parses Google Search Console Performance export CSV.
    Expected headers: Top queries / Query, Clicks, Impressions, CTR, Position
    """
    queries: List[Dict[str, Any]] = []
    total_clicks = 0
    total_impressions = 0
    total_ctr_sum = 0.0
    total_pos_sum = 0.0
    count = 0

    reader = csv.reader(io.StringIO(csv_content))
    headers = None

    for row in reader:
        if not row:
            continue
        if headers is None:
            headers = [h.strip().lower() for h in row]
            continue

        row_dict = {}
        for idx, val in enumerate(row):
            if idx < len(headers):
                row_dict[headers[idx]] = val.strip()

        # Match columns flexibly
        query = row_dict.get("top queries") or row_dict.get("query") or row_dict.get("queries") or (row[0] if len(row) > 0 else "")
        if not query or query.lower() in ["top queries", "query"]:
            continue

        try:
            raw_clicks = row_dict.get("clicks", "0").replace(",", "").replace("%", "")
            raw_impressions = row_dict.get("impressions", "0").replace(",", "").replace("%", "")
            raw_ctr = row_dict.get("ctr", "0").replace(",", "").replace("%", "")
            raw_pos = row_dict.get("position", "0").replace(",", "").replace("%", "")

            clicks = int(float(raw_clicks)) if raw_clicks else 0
            impressions = int(float(raw_impressions)) if raw_impressions else 0
            ctr = float(raw_ctr) if raw_ctr else 0.0
            if ctr < 1.0 and ctr > 0:
                ctr = round(ctr * 100, 2)
            pos = round(float(raw_pos), 1) if raw_pos else 0.0

            total_clicks += clicks
            total_impressions += impressions
            total_ctr_sum += ctr
            total_pos_sum += pos
            count += 1

            queries.append({
                "query": query,
                "clicks": clicks,
                "impressions": impressions,
                "ctr": ctr,
                "position": pos
            })
        except Exception:
            continue

    queries.sort(key=lambda x: x["clicks"], reverse=True)
    avg_ctr = round(total_ctr_sum / count, 2) if count > 0 else 0.0
    avg_pos = round(total_pos_sum / count, 1) if count > 0 else 0.0

    parsed_data = {
        "domain": domain,
        "total_clicks": total_clicks,
        "total_impressions": total_impressions,
        "avg_ctr": avg_ctr,
        "avg_position": avg_pos,
        "queries": queries[:50],
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }

    save_first_party_data(domain, "gsc", parsed_data)
    return parsed_data

def parse_ga4_csv(csv_content: str, domain: str) -> Dict[str, Any]:
    """
    Parses Google Analytics 4 Pages and Screens / Traffic export CSV.
    Expected headers: Page path, Sessions, Active users, Bounce rate
    """
    total_sessions = 0
    total_users = 0
    count = 0

    reader = csv.reader(io.StringIO(csv_content))
    headers = None

    for row in reader:
        if not row:
            continue
        if headers is None:
            headers = [h.strip().lower() for h in row]
            continue

        row_dict = {}
        for idx, val in enumerate(row):
            if idx < len(headers):
                row_dict[headers[idx]] = val.strip()

        try:
            s_val = row_dict.get("sessions") or row_dict.get("views") or (row[1] if len(row) > 1 else "0")
            u_val = row_dict.get("active users") or row_dict.get("users") or (row[2] if len(row) > 2 else "0")

            sessions = int(float(s_val.replace(",", "")))
            users = int(float(u_val.replace(",", "")))

            total_sessions += sessions
            total_users += users
            count += 1
        except Exception:
            continue

    parsed_data = {
        "domain": domain,
        "monthly_sessions": total_sessions,
        "active_users": total_users,
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }

    save_first_party_data(domain, "ga4", parsed_data)
    return parsed_data

def get_first_party_summary(domain: str) -> FirstPartySummaryResponse:
    """Build summary response for first-party data linked to domain."""
    rows = get_first_party_data(domain)
    has_gsc = False
    has_ga4 = False
    gsc_clicks = 0
    gsc_impressions = 0
    gsc_ctr = 0.0
    gsc_pos = 0.0
    top_queries: List[GscQueryItem] = []
    ga4_sessions = 0
    ga4_users = 0
    updated_at = None

    for r in rows:
        src = r.get("source")
        data = r.get("data", {})
        if src == "gsc":
            has_gsc = True
            gsc_clicks = data.get("total_clicks", 0)
            gsc_impressions = data.get("total_impressions", 0)
            gsc_ctr = data.get("avg_ctr", 0.0)
            gsc_pos = data.get("avg_position", 0.0)
            updated_at = data.get("uploaded_at")
            for q in data.get("queries", [])[:10]:
                top_queries.append(GscQueryItem(
                    query=q.get("query", ""),
                    clicks=q.get("clicks", 0),
                    impressions=q.get("impressions", 0),
                    ctr=q.get("ctr", 0.0),
                    position=q.get("position", 0.0)
                ))
        elif src == "ga4":
            has_ga4 = True
            ga4_sessions = data.get("monthly_sessions", 0)
            ga4_users = data.get("active_users", 0)
            if not updated_at:
                updated_at = data.get("uploaded_at")

    return FirstPartySummaryResponse(
        domain=domain,
        has_gsc_connected=has_gsc,
        has_ga4_connected=has_ga4,
        gsc_total_clicks=gsc_clicks,
        gsc_total_impressions=gsc_impressions,
        gsc_avg_ctr=gsc_ctr,
        gsc_avg_position=gsc_pos,
        top_gsc_queries=top_queries,
        ga4_monthly_sessions=ga4_sessions,
        ga4_active_users=ga4_users,
        updated_at=updated_at
    )
