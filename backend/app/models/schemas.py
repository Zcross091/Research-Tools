from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ConfidenceMeta(BaseModel):
    confidence_score: int = Field(..., description="Confidence score from 0 to 100%")
    data_source: str = Field(..., description="Origin of data (e.g. Google Trends, Tranco, Public DNS, ICANN)")
    method: str = Field(..., description="Method used (Direct API, Live Scraper, Benchmark Model)")
    timestamp: str

# ----------------- TRAFFIC SCHEMAS (Similarweb Caliber) -----------------

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
    registration_date: Optional[str] = None
    domain_age_days: Optional[int] = None
    is_newly_launched: bool = False
    data_status_note: Optional[str] = None
    confidence: ConfidenceMeta

# ----------------- KEYWORD SCHEMAS (Semrush / Ahrefs Caliber) -----------------

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
    interest_over_time: List[InterestPoint]
    breakout_queries: List[RisingQuery]
    related_queries: List[str]
    questions: List[QuestionItem]
    confidence: ConfidenceMeta

# ----------------- SOCIAL SCHEMAS (SocialBlade / vidIQ Caliber) -----------------

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
    sample_tags: List[str]
    video_analysis: Optional[VideoSEOAnalysis] = None
    confidence: ConfidenceMeta

# ----------------- AUDIENCE SCHEMAS (SparkToro / Brandwatch Caliber) -----------------

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
    key_topics: List[str]
    demographic_profile: Dict[str, Any]
    confidence: ConfidenceMeta
