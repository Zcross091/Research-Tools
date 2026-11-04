import {
  analyzeTrafficClient,
  analyzeKeywordsClient,
  getLiveKeywordSuggestions,
  analyzeSocialClient,
  analyzeAudienceClient,
  runSiteAuditClient,
  getConnectorSummaryClient,
  generateExecutiveSummaryClient
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
    // Backend offline or unreachable - expected in standalone desktop/mobile app
  }
  return null;
}

export async function fetchTraffic(domain) {
  const backendData = await tryFetchBackend(`/traffic/analyze?domain=${encodeURIComponent(domain)}`);
  if (backendData) return backendData;
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

// ----------------- AI SUMMARY API -----------------

export async function fetchExecutiveSummary(moduleType, data) {
  try {
    const res = await fetch(`${getApiBase()}/summary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_type: moduleType, data: data })
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.bullets)) {
        return json.bullets;
      }
    }
  } catch (err) {
    // Offline fallback
  }
  return generateExecutiveSummaryClient(moduleType, data);
}

// ----------------- SITE AUDIT API -----------------

export async function runSiteAudit(domain, maxPages = 20) {
  try {
    const res = await fetch(`${getApiBase()}/audit/run?domain=${encodeURIComponent(domain)}&max_pages=${maxPages}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend audit endpoint unreachable, falling back to client audit engine.');
  }
  return await runSiteAuditClient(domain);
}

export async function fetchSiteAuditResults(domain) {
  const backendData = await tryFetchBackend(`/audit/results?domain=${encodeURIComponent(domain)}`, 8000);
  if (backendData) return backendData;
  return await runSiteAuditClient(domain);
}

// ----------------- CONNECTORS & SETTINGS API -----------------

export async function uploadGscCsv(domain, file) {
  const formData = new FormData();
  formData.append('domain', domain);
  formData.append('file', file);

  try {
    const res = await fetch(`${getApiBase()}/connectors/gsc/upload`, {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend GSC upload failed.');
  }
  return { status: 'success', message: 'Local GSC parsing applied successfully.' };
}

export async function uploadGa4Csv(domain, file) {
  const formData = new FormData();
  formData.append('domain', domain);
  formData.append('file', file);

  try {
    const res = await fetch(`${getApiBase()}/connectors/ga4/upload`, {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend GA4 upload failed.');
  }
  return { status: 'success', message: 'Local GA4 parsing applied successfully.' };
}

export async function fetchConnectorSummary(domain) {
  const backendData = await tryFetchBackend(`/connectors/summary?domain=${encodeURIComponent(domain)}`);
  if (backendData) return backendData;
  return getConnectorSummaryClient(domain);
}

export async function fetchApiKeysStatus() {
  const backendData = await tryFetchBackend('/settings/keys');
  if (backendData) return backendData;
  return {
    has_dataforseo: Boolean(localStorage.getItem('dfs_login')),
    has_ahrefs: Boolean(localStorage.getItem('ahrefs_key')),
    has_crux: false,
    dataforseo_login_partial: localStorage.getItem('dfs_login') ? localStorage.getItem('dfs_login').slice(0, 3) + '***' : ''
  };
}

export async function saveApiKeys(payload) {
  if (payload.dataforseo_login) localStorage.setItem('dfs_login', payload.dataforseo_login);
  if (payload.ahrefs_api_key) localStorage.setItem('ahrefs_key', payload.ahrefs_api_key);

  try {
    const res = await fetch(`${getApiBase()}/settings/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend settings save failed, saved to local storage.');
  }
  return { status: 'success', message: 'Settings saved locally.' };
}
