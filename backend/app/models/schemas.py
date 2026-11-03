from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ConfidenceMeta(BaseModel):
    confidence_score: int = Field(..., description="Confidence score from 0 to 100%")
    data_source: str = Field(..., description="Origin of data (e.g. Google Trends, Tranco, Public DNS)")
    method: str = Field(..., description="Method used (Direct API, Live Scraper, Benchmark Model)")
    timestamp: str

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

class TechStackItem(BaseModel):
    category: str
    name: str
    details: Optional[str] = None

class MonthlyVisitPoint(BaseModel):
    month: str
    visits: int

class TrafficResponse(BaseModel):
    domain: str
    title: Optional[str] = None
    description: Optional[str] = None
    global_rank: int
    country_rank: int
    category: str
    total_visits: int
    avg_visit_duration: str
    pages_per_visit: float
    bounce_rate: float
    monthly_history: List[MonthlyVisitPoint]
    sources: TrafficSourceBreakdown
    top_countries: List[CountryTraffic]
    tech_stack: List[TechStackItem]
    competitors: List[str]
    registration_date: Optional[str] = None
    domain_age_days: Optional[int] = None
    is_newly_launched: bool = False
    data_status_note: Optional[str] = None
    confidence: ConfidenceMeta

class VideoSEOAnalysis(BaseModel):
    video_id: Optional[str] = None
    title: str
    seo_score: int
    tags: List[str]
    title_word_count: int
    has_description: bool
    tag_count: int

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
    projected_subs_1y: int
    sample_tags: List[str]
    video_analysis: Optional[VideoSEOAnalysis] = None
    confidence: ConfidenceMeta

class InterestPoint(BaseModel):
    date: str
    value: int

class RisingQuery(BaseModel):
    query: str
    growth: str

class QuestionItem(BaseModel):
    question: str
    category: str  # who, what, where, why, how, can, best

class KeywordResponse(BaseModel):
    query: str
    search_volume: int
    difficulty: int
    cpc: float
    intent: str  # Informational, Commercial, Transactional, Navigational
    interest_over_time: List[InterestPoint]
    breakout_queries: List[RisingQuery]
    related_queries: List[str]
    questions: List[QuestionItem]
    confidence: ConfidenceMeta

class PlatformAffinity(BaseModel):
    platform: str
    affinity_score: int  # 0 to 100
    details: str

class SubredditHub(BaseModel):
    name: str
    subscribers: int
    relevance: str

class SentimentBreakdown(BaseModel):
    positive: int
    neutral: int
    negative: int
    summary: str

class AudienceResponse(BaseModel):
    query: str
    sentiment: SentimentBreakdown
    platforms: List[PlatformAffinity]
    top_communities: List[SubredditHub]
    key_topics: List[str]
    demographic_profile: Dict[str, Any]
    confidence: ConfidenceMeta

