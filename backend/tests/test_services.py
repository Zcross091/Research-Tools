import pytest
import sqlite3
import asyncio
from app.config import DB_PATH
from app.services.traffic_service import clean_domain, derive_domain_metrics, analyze_domain_traffic
from app.services.keyword_service import analyze_keyword
from app.services.social_service import analyze_creator, extract_video_id
from app.services.audience_service import analyze_audience
from app.services.connector_service import parse_gsc_csv, parse_ga4_csv, get_first_party_summary
from app.services.site_audit_crawler import audit_domain_site
from app.database import init_db, save_setting, get_all_settings

@pytest.fixture(autouse=True)
def setup_test_db():
    init_db()
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cache")
        cursor.execute("DELETE FROM first_party_data")
        cursor.execute("DELETE FROM site_audits")
        conn.commit()
        conn.close()
    except Exception:
        pass

def test_domain_cleaning():
    assert clean_domain("https://www.stripe.com/pricing") == "stripe.com"
    assert clean_domain("http://github.com/") == "github.com"
    assert clean_domain("openai.com?ref=home") == "openai.com"

def test_derive_domain_metrics():
    metrics = asyncio.run(derive_domain_metrics("stripe.com"))
    assert metrics["global_rank"] > 0
    assert metrics["visits"] > 0
    assert "confidence" in metrics

def test_extract_video_id():
    assert extract_video_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_video_id("https://youtu.be/dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_video_id("dQw4w9WgXcQ") == "dQw4w9WgXcQ"

def test_analyze_domain_traffic():
    res = asyncio.run(analyze_domain_traffic("github.com"))
    assert "github.com" in res.domain
    assert res.total_visits > 0
    assert len(res.monthly_history) == 36
    assert len(res.top_countries) > 0
    assert res.device_split.desktop > 0
    assert res.device_split.mobile > 0
    assert len(res.top_organic_keywords) > 0
    assert len(res.referring_domains) > 0
    assert len(res.outgoing_domains) > 0
    assert len(res.subdomains) > 0
    assert len(res.competitor_matrix) > 0
    assert res.audience_demographics.gender["male"] > 0
    assert res.backlink_profile is not None
    assert res.backlink_profile.domain_rating > 0
    assert len(res.backlink_profile.top_anchors) > 0
    assert len(res.backlink_profile.top_linked_pages) > 0
    assert res.ad_intelligence is not None
    assert len(res.ad_intelligence.ad_networks) > 0
    assert len(res.ad_intelligence.top_publishers) > 0
    assert len(res.ad_intelligence.sample_ad_copies) > 0
    assert res.confidence.confidence_score >= 80

def test_newly_launched_domain():
    res = asyncio.run(analyze_domain_traffic("northexmarketing.com"))
    assert "northexmarketing.com" in res.domain
    assert res.is_newly_launched is True
    assert res.registration_date is not None
    assert res.monthly_history[0].visits == 0
    assert res.shopper_intelligence.is_ecommerce_property is False
    assert res.folder_segmentation.top_subpaths[0].path == "/services"
    assert res.total_visits < 100

def test_analyze_keyword():
    res = asyncio.run(analyze_keyword("artificial intelligence"))
    assert res.query == "artificial intelligence"
    assert res.global_volume > 0
    assert len(res.country_volumes) > 0
    assert len(res.serp_features) == 8
    assert len(res.top_serp_results) == 10
    assert len(res.variations.broad_match) > 0
    assert res.click_potential.organic_clicks > 0
    assert len(res.interest_over_time) == 12
    assert len(res.questions) > 0
    assert res.keyword_gap is not None

def test_analyze_social():
    res = asyncio.run(analyze_creator("mkbhd"))
    assert res.subscriber_count > 0
    assert res.grade in ["A++", "A+", "A", "A-", "B+"]
    assert res.monthly_earnings_min >= 0
    assert res.upload_schedule is not None
    assert res.upload_schedule.best_day != ""

def test_analyze_audience():
    res = asyncio.run(analyze_audience("ecommerce"))
    assert res.query == "ecommerce"
    assert res.sentiment.positive > 0

def test_gsc_and_ga4_csv_parsing():
    sample_gsc_csv = "Top queries,Clicks,Impressions,CTR,Position\nstripe pricing,120,2400,5.0%,1.2\nstripe login,80,1600,5.0%,1.1"
    parsed_gsc = parse_gsc_csv(sample_gsc_csv, "stripe.com")
    assert parsed_gsc["total_clicks"] == 200
    assert parsed_gsc["total_impressions"] == 4000
    assert len(parsed_gsc["queries"]) == 2

    sample_ga4_csv = "Page path,Sessions,Active users\n/,15000,12000\n/pricing,4000,3200"
    parsed_ga4 = parse_ga4_csv(sample_ga4_csv, "stripe.com")
    assert parsed_ga4["monthly_sessions"] == 19000

    summary = get_first_party_summary("stripe.com")
    assert summary.has_gsc_connected is True
    assert summary.has_ga4_connected is True
    assert summary.gsc_total_clicks == 200
    assert summary.ga4_monthly_sessions == 19000

def test_site_audit_crawler():
    res = asyncio.run(audit_domain_site("stripe.com", max_pages=3))
    assert res.domain == "stripe.com"
    assert res.health_score > 0
    assert res.total_pages_crawled > 0

def test_settings_and_keys():
    save_setting("dataforseo_login", "testuser@example.com")
    all_settings = get_all_settings()
    assert all_settings.get("dataforseo_login") == "testuser@example.com"

def test_fastapi_static_and_portal_serving():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    
    # Test root endpoint
    res_root = client.get("/")
    assert res_root.status_code == 200
    data = res_root.json()
    assert data["status"] == "operational"
    assert "download_portal" in data["endpoints"]

    # Test health check
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json() == {"status": "ok"}

    # Test download portal page serving
    res_portal = client.get("/portal")
    assert res_portal.status_code == 200
    assert "OmniResearch PRO" in res_portal.text

    # Test static mounted path
    res_static = client.get("/static/download.html")
    assert res_static.status_code == 200
    assert "OmniResearch PRO" in res_static.text

