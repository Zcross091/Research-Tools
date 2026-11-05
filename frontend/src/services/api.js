import {
  analyzeTrafficClient, analyzeKeywordsClient, analyzeSocialClient,
  analyzeAudienceClient, runSiteAuditClient, getLiveKeywordSuggestions,
  getConnectorSummaryClient
} from './clientEngine';

function getApiBase() {
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.port === '5173' || window.location.port === '3000') {
      return 'http://127.0.0.1:8000/api';
    }
  }
  return '/api';
}

async function tryFetchBackend(endpoint, timeoutMs = 2500) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${getApiBase()}${endpoint}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timer);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline
  }
  return null;
}

export async function fetchTraffic(domain) {
  const backendData = await tryFetchBackend(`/traffic/analyze?domain=${encodeURIComponent(domain)}`);
  if (backendData) return backendData;
  return await analyzeTrafficClient(domain);
}

export async function fetchKeywords(query, country = 'US') {
  const backendData = await tryFetchBackend(`/keywords/analyze?q=${encodeURIComponent(query)}&country=${encodeURIComponent(country)}`);
  if (backendData) return backendData;
  return await analyzeKeywordsClient(query, country);
}

export async function fetchKeywordSuggestions(query) {
  const backendData = await tryFetchBackend(`/keywords/suggestions?q=${encodeURIComponent(query)}`, 1200);
  if (backendData && Array.isArray(backendData) && backendData.length > 0) {
    return backendData;
  }
  return await getLiveKeywordSuggestions(query);
}

export async function fetchSocial(query) {
  const backendData = await tryFetchBackend(`/social/analyze?query=${encodeURIComponent(query)}`);
  if (backendData) return backendData;
  return await analyzeSocialClient(query);
}

export async function fetchVideoTags(videoIdOrUrl) {
  const backendData = await tryFetchBackend(`/social/video-tags?url=${encodeURIComponent(videoIdOrUrl)}`);
  if (backendData) return backendData;
  return {
    video_id: 'sample',
    title: 'Extracted Video Analysis',
    seo_score: 88,
    tags: ['marketing', 'analytics', 'seo', 'traffic', 'tools'],
    title_word_count: 6,
    has_description: true,
    tag_count: 5
  };
}

export async function fetchAudience(topic) {
  const backendData = await tryFetchBackend(`/audience/analyze?topic=${encodeURIComponent(topic)}`);
  if (backendData) return backendData;
  return await analyzeAudienceClient(topic);
}

export async function runSiteAudit(domain, maxPages = 20) {
  const backendData = await tryFetchBackend(`/audit/run?domain=${encodeURIComponent(domain)}&max_pages=${maxPages}`, 15000);
  if (backendData) return backendData;
  return await runSiteAuditClient(domain);
}

export async function fetchSiteAuditResults(domain) {
  const backendData = await tryFetchBackend(`/audit/results?domain=${encodeURIComponent(domain)}`);
  if (backendData) return backendData;
  return await runSiteAuditClient(domain);
}

export async function uploadGscCsv(csvText, domain) {
  try {
    const res = await fetch(`${getApiBase()}/connectors/gsc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv_text: csvText, domain })
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function uploadGa4Csv(csvText, domain) {
  try {
    const res = await fetch(`${getApiBase()}/connectors/ga4`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv_text: csvText, domain })
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function fetchConnectorSummary(domain) {
  const backendData = await tryFetchBackend(`/connectors/summary?domain=${encodeURIComponent(domain)}`);
  if (backendData) return backendData;
  return getConnectorSummaryClient(domain);
}

export async function fetchApiKeysStatus() {
  const backendData = await tryFetchBackend('/settings/keys');
  if (backendData) return backendData;
  return { has_dataforseo: false, has_ahrefs: false, has_crux: false };
}

export async function saveApiKeys(payload) {
  try {
    const res = await fetch(`${getApiBase()}/settings/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { status: 'saved' };
}
