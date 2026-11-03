import httpx

REPO = "Zcross091/Research-Tools"
headers = {"User-Agent": "ResearchToolsMonitor"}

print(f"=== CHECKING GITHUB ACTIONS & RELEASES FOR {REPO} ===")

# 1. Check Releases
try:
    r_rel = httpx.get(f"https://api.github.com/repos/{REPO}/releases", headers=headers, timeout=10.0)
    print(f"\n[Releases API] HTTP {r_rel.status_code}")
    if r_rel.status_code == 200:
        releases = r_rel.json()
        print(f"Total Releases Found: {len(releases)}")
        for rel in releases:
            tag = rel.get("tag_name")
            name = rel.get("name")
            draft = rel.get("draft")
            prerelease = rel.get("prerelease")
            assets = rel.get("assets", [])
            print(f"- Tag: {tag} | Name: {name} | Draft: {draft} | Assets: {len(assets)}")
            for a in assets:
                print(f"    * Asset: {a.get('name')} ({a.get('size')} bytes) -> {a.get('browser_download_url')}")
    else:
        print(f"Response: {r_rel.text}")
except Exception as e:
    print(f"Releases error: {e}")

# 2. Check Workflow Runs
try:
    r_runs = httpx.get(f"https://api.github.com/repos/{REPO}/actions/runs", headers=headers, timeout=10.0)
    print(f"\n[Workflow Runs API] HTTP {r_runs.status_code}")
    if r_runs.status_code == 200:
        runs = r_runs.json().get("workflow_runs", [])
        print(f"Total Runs Found: {len(runs)}")
        for run in runs[:5]:
            run_id = run.get("id")
            status = run.get("status")
            conclusion = run.get("conclusion")
            name = run.get("name")
            commit_msg = run.get("head_commit", {}).get("message", "").strip().split("\n")[0]
            html_url = run.get("html_url")
            print(f"- Run #{run_id}: [{status.upper()}] Conclusion: {conclusion} | Name: {name}")
            print(f"  Commit: {commit_msg}")
            print(f"  URL: {html_url}")
    else:
        print(f"Response: {r_runs.text}")
except Exception as e:
    print(f"Workflow runs error: {e}")
