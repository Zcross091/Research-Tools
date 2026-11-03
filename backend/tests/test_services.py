import pytest
import asyncio
from app.services.traffic_service import clean_domain, derive_domain_metrics, analyze_domain_traffic
from app.services.keyword_service import analyze_keyword
from app.services.social_service import analyze_creator, extract_video_id
from app.services.audience_service import analyze_audience
from app.database import init_db

@pytest.fixture(autouse=True)
def setup_test_db():
    init_db()

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
    assert res.domain == "github.com"
    assert res.total_visits > 0
    assert len(res.monthly_history) == 6
    assert len(res.top_countries) == 10
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
    assert res.domain == "northexmarketing.com"
    assert res.is_newly_launched is True
    assert res.registration_date is not None
    # Pre-launch months must be 0
    assert res.monthly_history[0].visits == 0
    assert res.monthly_history[1].visits == 0
    assert res.monthly_history[2].visits == 0

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
    assert len(res.keyword_gap.missing_keywords) > 0
    assert len(res.keyword_gap.weak_keywords) > 0
    assert len(res.keyword_gap.shared_keywords) > 0
    assert len(res.keyword_gap.untapped_keywords) > 0
    assert res.confidence.confidence_score >= 80

def test_analyze_social():
    res = asyncio.run(analyze_creator("mkbhd"))
    assert res.subscriber_count > 0
    assert res.grade in ["A++", "A+", "A", "A-", "B+"]
    assert res.monthly_earnings_min >= 0
    assert len(res.daily_growth_history) == 14
    assert len(res.milestone_projections) == 6
    assert len(res.top_videos) > 0
    assert len(res.social_footprint) > 0
    assert len(res.seo_checklist) == 6
    assert len(res.audience_overlap) > 0
    assert res.upload_schedule is not None
    assert res.upload_schedule.best_day != ""

def test_analyze_audience():
    res = asyncio.run(analyze_audience("ecommerce"))
    assert res.query == "ecommerce"
    assert res.sentiment.positive > 0
    assert len(res.platforms) > 0
    assert len(res.top_communities) > 0
    assert len(res.media_consumption.top_websites) > 0
    assert len(res.media_consumption.top_podcasts) > 0
    assert len(res.extended_demographics.education_levels) > 0
    assert len(res.pain_points) > 0
    assert len(res.top_hashtags) > 0
    assert len(res.viral_articles) > 0
