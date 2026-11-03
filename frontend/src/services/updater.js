export const APP_VERSION = '1.0.0';

/**
 * Checks GitHub Releases for a newer version of the application.
 * Returns { hasUpdate: boolean, latestVersion: string, releaseNotes: string, apkUrl: string, exeUrl: string }
 */
export async function checkForAppUpdates(repo = 'Zcross091/Research-Tools') {
  // Allow overriding repository from environment variable
  const targetRepo = import.meta.env.VITE_GITHUB_REPO || repo;
  const apiUrl = `https://api.github.com/repos/${targetRepo}/releases/latest`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      // If repo does not exist yet or rate limited, return current state gracefully
      return {
        hasUpdate: false,
        currentVersion: APP_VERSION,
        latestVersion: APP_VERSION,
        message: 'Up to date'
      };
    }

    const data = await response.json();
    const rawTag = data.tag_name || '';
    const latestVersion = rawTag.replace(/^v/, '').trim();

    // Compare versions (semver style: e.g. 1.0.1 > 1.0.0)
    const isNewer = compareVersions(latestVersion, APP_VERSION) > 0;

    let apkUrl = '';
    let exeUrl = '';

    if (Array.isArray(data.assets)) {
      const apkAsset = data.assets.find(a => a.name.endsWith('.apk'));
      const exeAsset = data.assets.find(a => a.name.endsWith('.exe'));
      if (apkAsset) apkUrl = apkAsset.browser_download_url;
      if (exeAsset) exeUrl = exeAsset.browser_download_url;
    }

    return {
      hasUpdate: isNewer,
      currentVersion: APP_VERSION,
      latestVersion: latestVersion || APP_VERSION,
      releaseName: data.name || `Release ${latestVersion}`,
      releaseNotes: data.body || 'New features, performance enhancements, and bug fixes.',
      publishedAt: data.published_at,
      apkUrl: apkUrl || data.html_url,
      exeUrl: exeUrl || data.html_url,
      htmlUrl: data.html_url
    };
  } catch (err) {
    console.warn('[Updater] Could not check for updates:', err.message);
    return {
      hasUpdate: false,
      currentVersion: APP_VERSION,
      latestVersion: APP_VERSION,
      error: err.message
    };
  }
}

/**
 * Simple semantic version comparator.
 * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal.
 */
function compareVersions(v1, v2) {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  const len = Math.max(p1.length, p2.length);

  for (let i = 0; i < len; i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

