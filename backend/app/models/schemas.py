from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ConfidenceMeta(BaseModel):
    confidence_score: int = Field(..., description="Confidence score from 0 to 100%")
    data_source: str = Field(..., description="Origin of data (e.g. Google Trends, Tranco, Public DNS, ICANN)")
    method: str = Field(..., description="Method used (Direct API, Live Scraper, Benchmark Model)")
    timestamp: str
    panel_sample_size: Optional[str] = "12.8M Active Devices / Telemetry Points"
    data_freshness: Optional[str] = "< 24 Hours Real-Time"

# ----------------- TRAFFIC & AUTHORITY SCHEMAS (Similarweb & Ahrefs Caliber) -----------------

class TrafficSourceBreakdown(BaseModel):
    direct: float
    search: float
    social: float
    referral: float
    mail: float
    display: float

class CountryTraffic(BaseModel):
    country: str
    code: str
    percentage: float
    visits: Optional[int] = None
    bounce_rate: Optional[float] = None

class TechStackItem(BaseModel):
    category: str
    name: str
    details: Optional[str] = None

class MonthlyVisitPoint(BaseModel):
    month: str
    visits: int

class DeviceSplit(BaseModel):
    desktop: float
    mobile: float
    desktop_duration: str
    mobile_duration: str
    desktop_bounce: float
    mobile_bounce: float

class SearchKeywordItem(BaseModel):
    keyword: str
    volume: int
    traffic_share: float
    position: int
    cpc: float

class PaidKeywordItem(BaseModel):
    keyword: str
    volume: int
    traffic_share: float
    cpc: float

class ReferralDomainItem(BaseModel):
    domain: str
    category: str
    share_percentage: float
    monthly_visits: int

class DestinationDomainItem(BaseModel):
    domain: str
    category: str
    share_percentage: float

class SubdomainItem(BaseModel):
    subdomain: str
    traffic_share: float
    monthly_visits: int

class SocialNetworkTraffic(BaseModel):
    platform: str
    share: float
    visits: int

class AudienceDemographics(BaseModel):
    gender: Dict[str, float]  # e.g. {"male": 62.0, "female": 38.0}
    age_distribution: List[Dict[str, Any]]  # [{"bracket": "18-24", "percentage": 18.5}, ...]
    top_interests: List[str]

class CompetitorMatrixItem(BaseModel):
    domain: str
    similarity: int  # 0 to 100%
    global_rank: int
    monthly_visits: int
    shared_keywords: int
    category: str

# Backlinks & Domain Authority (Ahrefs / Moz Caliber)
class AnchorTextItem(BaseModel):
    anchor: str
    percentage: float
    backlinks_count: int

class TopLinkedPageItem(BaseModel):
    path: str
    backlinks: int
    referring_domains: int

class BacklinkProfile(BaseModel):
    domain_rating: int  # 1 to 100
    url_rating: int  # 1 to 100
    total_backlinks: int
    referring_domains: int
    referring_ips: int
    dofollow_ratio: float  # e.g. 84.5%
    tld_distribution: List[Dict[str, Any]]  # [{"tld": ".com", "percentage": 74.0}, ...]
    top_anchors: List[AnchorTextItem] = []
    top_linked_pages: List[TopLinkedPageItem] = []

# Display Ads & Creatives (Similarweb Ads Caliber)
class AdNetworkItem(BaseModel):
    network: str
    share: float

class AdPublisherItem(BaseModel):
    domain: str
    category: str
    impressions_share: float

class SampleAdCopy(BaseModel):
    headline: str
    cta: str
    format: str  # e.g. "300x250 Medium Rectangle"
    display_url: str

class AdCreativeIntelligence(BaseModel):
    ad_networks: List[AdNetworkItem] = []
    top_publishers: List[AdPublisherItem] = []
    sample_ad_copies: List[SampleAdCopy] = []

# Folder / Directory-Level Segmentation (Similarweb Sub-Path Tracking)
class SubPathTrafficItem(BaseModel):
    path: str
    traffic_share: float
    monthly_visits: int
    category: str

class FolderSegmentation(BaseModel):
    has_subpath: bool
    active_path: Optional[str] = None
    folder_traffic_share: float
    folder_visits: int
    top_subpaths: List[SubPathTrafficItem] = []

# E-Commerce Shopper & Marketplace Intelligence
class MarketplaceSearchQuery(BaseModel):
    query: str
    volume: int
    conversion_share: float

class CategoryConversionRate(BaseModel):
    category_name: str
    add_to_cart_rate: float
    purchase_conversion_rate: float

class BrandShareItem(BaseModel):
    brand_name: str
    market_share: float

class ShopperIntelligence(BaseModel):
    is_ecommerce_property: bool
    top_on_site_queries: List[MarketplaceSearchQuery] = []
    category_conversions: List[CategoryConversionRate] = []
    brand_shares: List[BrandShareItem] = []

class TrafficResponse(BaseModel):
    domain: str
    title: Optional[str] = None
    description: Optional[str] = None
    global_rank: int
    country_rank: int
    category: str
    total_visits: int
    unique_visitors: int = 0
    avg_visit_duration: str
    pages_per_visit: float
    bounce_rate: float
    mom_growth: float = 0.0  # Month-over-month growth %
    monthly_history: List[MonthlyVisitPoint]
    sources: TrafficSourceBreakdown
    device_split: DeviceSplit
    top_countries: List[CountryTraffic]
    tech_stack: List[TechStackItem]
    top_organic_keywords: List[SearchKeywordItem] = []
    top_paid_keywords: List[PaidKeywordItem] = []
    referring_domains: List[ReferralDomainItem] = []
    outgoing_domains: List[DestinationDomainItem] = []
    subdomains: List[SubdomainItem] = []
    social_breakdown: List[SocialNetworkTraffic] = []
    audience_demographics: AudienceDemographics
    competitors: List[str]
    competitor_matrix: List[CompetitorMatrixItem] = []
    backlink_profile: Optional[BacklinkProfile] = None
    ad_intelligence: Optional[AdCreativeIntelligence] = None
    folder_segmentation: Optional[FolderSegmentation] = None
    shopper_intelligence: Optional[ShopperIntelligence] = None
    registration_date: Optional[str] = None
    domain_age_days: Optional[int] = None
    is_newly_launched: bool = False
    data_status_note: Optional[str] = None
    confidence: ConfidenceMeta

# ----------------- KEYWORD & OPPORTUNITY GAP SCHEMAS (Semrush Caliber) -----------------

class CountryVolumeItem(BaseModel):
    country: str
    code: str
    volume: int
    share: float

class SerpFeatureItem(BaseModel):
    name: str
    present: bool
    description: str

class SerpRankingItem(BaseModel):
    rank: int
    title: str
    url: str
    domain_authority: int  # 1 to 100
    est_visits: int
    backlinks: int

class KeywordVariationItem(BaseModel):
    keyword: str
    volume: int
    difficulty: int
    cpc: float
    intent: str

class KeywordVariationsGroup(BaseModel):
    broad_match: List[KeywordVariationItem]
    phrase_match: List[KeywordVariationItem]
    related: List[KeywordVariationItem]

class ClickPotential(BaseModel):
    organic_clicks: float
    paid_clicks: float
    zero_clicks: float

class InterestPoint(BaseModel):
    date: str
    value: int

class RisingQuery(BaseModel):
    query: str
    growth: str

class QuestionItem(BaseModel):
    question: str
    category: str  # who, what, where, why, how, can, best, is

# Keyword Gap & Content Opportunity Matrix (Semrush flagship feature)
class KeywordGapItem(BaseModel):
    keyword: str
    volume: int
    kd: int
    cpc: float
    intent: str
    your_rank: Optional[int] = None
    competitor_rank: Optional[int] = None
    gap_type: str  # 'missing' | 'weak' | 'shared' | 'untapped'

class KeywordGapMatrix(BaseModel):
    missing_keywords: List[KeywordGapItem] = []
    weak_keywords: List[KeywordGapItem] = []
    shared_keywords: List[KeywordGapItem] = []
    untapped_keywords: List[KeywordGapItem] = []

class KeywordResponse(BaseModel):
    query: str
    search_volume: int
    global_volume: int
    country_volumes: List[CountryVolumeItem] = []
    difficulty: int
    cpc: float
    intent: str  # Informational, Commercial, Transactional, Navigational
    competitive_density: float = 0.50  # 0.00 to 1.00
    click_potential: ClickPotential
    serp_features: List[SerpFeatureItem] = []
    top_serp_results: List[SerpRankingItem] = []
    variations: KeywordVariationsGroup
    keyword_gap: Optional[KeywordGapMatrix] = None
    interest_over_time: List[InterestPoint]
    breakout_queries: List[RisingQuery]
    related_queries: List[str]
    questions: List[QuestionItem]
    confidence: ConfidenceMeta

# ----------------- SOCIAL & CREATOR OVERLAP SCHEMAS (SocialBlade / vidIQ Caliber) -----------------

class VideoSEOAnalysis(BaseModel):
    video_id: Optional[str] = None
    title: str
    seo_score: int
    tags: List[str]
    title_word_count: int
    has_description: bool
    tag_count: int

class DailyGrowthItem(BaseModel):
    date: str
    subs_gained: int
    total_subs: int
    views_gained: int
    total_views: int
    est_earnings_min: float
    est_earnings_max: float

class MilestoneProjectionItem(BaseModel):
    timeframe: str
    projected_subs: int
    projected_views: int

class TopVideoItem(BaseModel):
    video_id: str
    title: str
    published_date: str
    views: int
    likes: int
    comments: int
    est_revenue: float
    vph: int  # Views Per Hour velocity

class SocialFootprintItem(BaseModel):
    platform: str
    handle: str
    followers: int
    verified: bool

class SeoChecklistItem(BaseModel):
    item: str
    passed: bool
    score: int
    tip: str

# Audience Overlap & Optimal Upload Timing (vidIQ Boost Caliber)
class CreatorOverlapItem(BaseModel):
    handle: str
    title: str
    overlap_score: int  # e.g. 72%
    subscriber_count: int
    shared_topics: List[str]

class UploadScheduleItem(BaseModel):
    best_day: str
    best_time: str
    peak_velocity_window: str
    consistency_score: int

class SocialResponse(BaseModel):
    handle: str
    title: str
    avatar_url: Optional[str] = None
    subscriber_count: int
    total_views: int
    video_count: int
    country: Optional[str] = "Global"
    grade: str
    engagement_rate: float
    avg_views_per_video: int
    monthly_earnings_min: float
    monthly_earnings_max: float
    yearly_earnings_min: float
    yearly_earnings_max: float
    daily_growth_history: List[DailyGrowthItem] = []
    milestone_projections: List[MilestoneProjectionItem] = []
    top_videos: List[TopVideoItem] = []
    social_footprint: List[SocialFootprintItem] = []
    seo_checklist: List[SeoChecklistItem] = []
    audience_overlap: List[CreatorOverlapItem] = []
    upload_schedule: Optional[UploadScheduleItem] = None
    sample_tags: List[str]
    video_analysis: Optional[VideoSEOAnalysis] = None
    confidence: ConfidenceMeta

# ----------------- AUDIENCE & VIRAL CONTENT SCHEMAS (SparkToro / BuzzSumo Caliber) -----------------

class PlatformAffinity(BaseModel):
    platform: str
    affinity_score: int  # 0 to 100
    details: str

class SubredditHub(BaseModel):
    name: str
    subscribers: int
    relevance: str
    weekly_posts: Optional[int] = None
    url: Optional[str] = None

class SentimentBreakdown(BaseModel):
    positive: int
    neutral: int
    negative: int
    summary: str

class MediaItem(BaseModel):
    name: str
    category: str
    affinity_score: float  # e.g. 3.4x
    reach: Optional[str] = None
    url: Optional[str] = None

class MediaConsumption(BaseModel):
    top_websites: List[MediaItem]
    top_podcasts: List[MediaItem]
    top_youtube_channels: List[MediaItem]
    top_publications: List[MediaItem]

class ExtendedDemographics(BaseModel):
    education_levels: List[Dict[str, Any]]
    household_income: List[Dict[str, Any]]

class PainPointTheme(BaseModel):
    theme: str
    sentiment: str
    summary: str
    frequency: int

class CommunityHashtag(BaseModel):
    tag: str
    frequency: int
    engagement_score: int

# Viral Articles & Social Share Velocity (BuzzSumo Caliber)
class ViralArticleItem(BaseModel):
    title: str
    source_domain: str
    url: str
    published_date: str
    total_shares: int
    twitter_shares: int
    reddit_upvotes: int
    linkedin_shares: int
    facebook_shares: int
    velocity_trend: str  # 'Trending Up' | 'Viral Surge' | 'Evergreen'

class AudienceResponse(BaseModel):
    query: str
    audience_size_estimate: int = 500000
    sentiment: SentimentBreakdown
    platforms: List[PlatformAffinity]
    top_communities: List[SubredditHub]
    media_consumption: MediaConsumption
    extended_demographics: ExtendedDemographics
    pain_points: List[PainPointTheme] = []
    top_hashtags: List[CommunityHashtag] = []
    viral_articles: List[ViralArticleItem] = []
    key_topics: List[str]
    demographic_profile: Dict[str, Any]
    confidence: ConfidenceMeta

# ----------------- SITE AUDIT & CRAWLER SCHEMAS -----------------

class IssueItem(BaseModel):
    issue_type: str  # 'Error' | 'Warning' | 'Notice'
    category: str  # 'Canonical' | 'Broken Link' | 'Title/Meta' | 'SSL/Security' | 'Heading'
    title: str
    description: str
    affected_url: str

class LinkCheckResult(BaseModel):
    url: str
    anchor_text: str
    status_code: int
    is_internal: bool

class CrawledPageItem(BaseModel):
    url: str
    status_code: int
    page_title: Optional[str] = None
    meta_description: Optional[str] = None
    canonical_url: Optional[str] = None
    h1_tag: Optional[str] = None
    internal_links_count: int = 0
    external_links_count: int = 0
    images_missing_alt: int = 0
    issues: List[IssueItem] = []

class SiteAuditResponse(BaseModel):
    domain: str
    health_score: int  # 0 to 100
    health_grade: str  # 'A+' | 'A' | 'B' | 'C' | 'Needs Attention'
    total_pages_crawled: int
    status_summary: Dict[str, int]  # e.g. {"200": 24, "301": 2, "404": 1, "500": 0}
    issue_counts: Dict[str, int]  # e.g. {"errors": 2, "warnings": 5, "notices": 8}
    crawled_pages: List[CrawledPageItem] = []
    top_issues: List[IssueItem] = []
    scan_timestamp: str

# ----------------- CONNECTORS & SETTINGS SCHEMAS -----------------

class GscQueryItem(BaseModel):
    query: str
    clicks: int
    impressions: int
    ctr: float
    position: float

class FirstPartySummaryResponse(BaseModel):
    domain: str
    has_gsc_connected: bool
    has_ga4_connected: bool
    gsc_total_clicks: int = 0
    gsc_total_impressions: int = 0
    gsc_avg_ctr: float = 0.0
    gsc_avg_position: float = 0.0
    top_gsc_queries: List[GscQueryItem] = []
    ga4_monthly_sessions: int = 0
    ga4_active_users: int = 0
    updated_at: Optional[str] = None

class ApiKeysSettingPayload(BaseModel):
    dataforseo_login: Optional[str] = ""
    dataforseo_password: Optional[str] = ""
    ahrefs_api_key: Optional[str] = ""
    crux_api_key: Optional[str] = ""

class ApiKeysStatusResponse(BaseModel):
    has_dataforseo: bool
    has_ahrefs: bool
    has_crux: bool
    dataforseo_login_partial: Optional[str] = ""
