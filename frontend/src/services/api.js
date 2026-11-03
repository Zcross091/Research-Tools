const API_BASE = '/api';

export async function fetchTraffic(domain) {
  const res = await fetch(`${API_BASE}/traffic/analyze?domain=${encodeURIComponent(domain)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to analyze domain: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchKeywords(query) {
  const res = await fetch(`${API_BASE}/keywords/analyze?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to analyze keyword: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchKeywordSuggestions(query) {
  const res = await fetch(`${API_BASE}/keywords/suggestions?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchSocial(query) {
  const res = await fetch(`${API_BASE}/social/analyze?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to analyze social profile: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchVideoTags(videoIdOrUrl) {
  const res = await fetch(`${API_BASE}/social/tags?video_id=${encodeURIComponent(videoIdOrUrl)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to extract video tags: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAudience(topic) {
  const res = await fetch(`${API_BASE}/audience/analyze?topic=${encodeURIComponent(topic)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to analyze audience: ${res.statusText}`);
  }
  return res.json();
}

