import {
  analyzeTrafficClient,
  analyzeKeywordsClient,
  getLiveKeywordSuggestions,
  analyzeSocialClient,
  analyzeAudienceClient
} from './clientEngine';

function getApiBase() {
  // If running in standalone desktop (.exe / Electron file://) or mobile (.apk Capacitor file://)
  if (typeof window !== 'undefined' && (window.location.protocol === 'file:' || window.location.protocol === 'capacitor:')) {
    return 'http://127.0.0.1:8000/api';
  }
  return '/api';
}

/**
 * Helper to fetch from backend with strict timeout.
 * If backend is offline or unreachable, returns null so caller uses client engine.
 */
async function tryFetchBackend(endpoint, timeoutMs = 2000) {
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
    // Backend offline or unreachable - expected in standalone desktop/mobile app
  }
  return null;
}

export async function fetchTraffic(domain) {
  // 1. Try local or custom backend
  const backendData = await tryFetchBackend(`/traffic/analyze?domain=${encodeURIComponent(domain)}`);
  if (backendData) return backendData;

  // 2. Seamless client-side engine (works standalone on desktop & mobile)
  return await analyzeTrafficClient(domain);
}

export async function fetchKeywords(query) {
  const backendData = await tryFetchBackend(`/keywords/analyze?q=${encodeURIComponent(query)}`);
  if (backendData) return backendData;

  return await analyzeKeywordsClient(query);
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
  const backendData = await tryFetchBackend(`/social/tags?video_id=${encodeURIComponent(videoIdOrUrl)}`);
  if (backendData) return backendData;

  const socialRes = await analyzeSocialClient(videoIdOrUrl || 'OmniVideo');
  return socialRes.video_analysis;
}

export async function fetchAudience(topic) {
  const backendData = await tryFetchBackend(`/audience/analyze?topic=${encodeURIComponent(topic)}`);
  if (backendData) return backendData;

  return await analyzeAudienceClient(topic);
}
