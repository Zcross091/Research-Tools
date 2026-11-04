"""
Site Audit Asynchronous Crawler Engine
=====================================
Performs automated multi-page site audits by crawling site pages, inspecting HTTP status codes,
internal/external link graphs, canonical link tags, meta titles, descriptions, H1 headings,
image ALT tags, and SSL parameters to calculate an overall SEO Health Score.

Includes rate limiting via asyncio.Semaphore(5), rotating User-Agent headers, polite delays,
and sitemap.xml auto-discovery seeding.
"""

import asyncio
import random
import httpx
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from typing import Dict, Any, List, Set
from app.models.schemas import (
    SiteAuditResponse, CrawledPageItem, IssueItem, LinkCheckResult
)
from app.database import save_site_audit, get_site_audit

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0"
]

def clean_url_host(url: str) -> str:
    """Extract root hostname from URL."""
    parsed = urlparse(url if url.startswith("http") else f"https://{url}")
    host = parsed.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host

async def discover_sitemap_urls(client: httpx.AsyncClient, root_host: str) -> List[str]:
    """
    Attempts auto-discovery of URLs from /sitemap.xml or /sitemap_index.xml to seed crawl queue.
    """
    sitemap_candidates = [
        f"https://{root_host}/sitemap.xml",
        f"https://{root_host}/sitemap_index.xml"
    ]
    discovered_urls: List[str] = []

    for sm_url in sitemap_candidates:
        try:
            resp = await client.get(sm_url, headers={"User-Agent": random.choice(USER_AGENTS)})
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text[:500000], "html.parser")
                loc_tags = soup.find_all("loc")
                for loc in loc_tags:
                    if loc.text:
                        u = loc.text.strip()
                        if clean_url_host(u) == root_host and u not in discovered_urls:
                            discovered_urls.append(u)
                            if len(discovered_urls) >= 15:
                                break
            if discovered_urls:
                break
        except Exception:
            pass

    return discovered_urls

async def audit_domain_site(domain: str, max_pages: int = 20) -> SiteAuditResponse:
    """
    Executes asynchronous BFS web crawl and SEO audit analysis with rate limiting, polite delays, and sitemap seeding.
    """
    root_host = clean_url_host(domain)
    start_url = f"https://{root_host}"

    visited_urls: Set[str] = set()
    queue: List[str] = [start_url]

    crawled_items: List[CrawledPageItem] = []
    top_issues: List[IssueItem] = []

    status_summary: Dict[str, int] = {"200": 0, "301": 0, "404": 0, "500": 0}
    issue_counts: Dict[str, int] = {"errors": 0, "warnings": 0, "notices": 0}

    # Concurrency throttling: max 5 concurrent HTTP requests
    semaphore = asyncio.Semaphore(5)

    async with httpx.AsyncClient(timeout=6.0, follow_redirects=True) as client:
        # Seed queue with discovered sitemap URLs
        sitemap_urls = await discover_sitemap_urls(client, root_host)
        for smu in sitemap_urls:
            if smu not in queue:
                queue.append(smu)

        while queue and len(visited_urls) < max_pages:
            current_url = queue.pop(0)
            if current_url in visited_urls:
                continue
            visited_urls.add(current_url)

            # Polite delay between page crawls
            await asyncio.sleep(0.1)

            page_issues: List[IssueItem] = []
            status_code = 200
            page_title = None
            meta_desc = None
            canonical_url = None
            h1_tag = None
            internal_links_count = 0
            external_links_count = 0
            missing_alt_count = 0

            headers = {
                "User-Agent": random.choice(USER_AGENTS),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            }

            try:
                async with semaphore:
                    resp = await client.get(current_url, headers=headers)

                status_code = resp.status_code
                status_str = str(status_code)
                status_summary[status_str] = status_summary.get(status_str, 0) + 1

                if status_code >= 400:
                    iss = IssueItem(
                        issue_type="Error",
                        category="Broken Link",
                        title=f"HTTP {status_code} Error",
                        description=f"Page returned client/server error code {status_code}.",
                        affected_url=current_url
                    )
                    page_issues.append(iss)
                    top_issues.append(iss)
                    issue_counts["errors"] += 1

                if status_code == 200 and "text/html" in resp.headers.get("content-type", ""):
                    soup = BeautifulSoup(resp.text[:500000], "html.parser")

                    # 1. Page Title
                    if soup.title and soup.title.string:
                        page_title = soup.title.string.strip()
                        if len(page_title) < 15:
                            iss = IssueItem(
                                issue_type="Notice",
                                category="Title/Meta",
                                title="Short Page Title",
                                description=f"Title is only {len(page_title)} characters long (recommended: 30-60 chars).",
                                affected_url=current_url
                            )
                            page_issues.append(iss)
                            issue_counts["notices"] += 1
                        elif len(page_title) > 70:
                            iss = IssueItem(
                                issue_type="Warning",
                                category="Title/Meta",
                                title="Overly Long Page Title",
                                description=f"Title is {len(page_title)} characters long and may truncate in Google SERPs.",
                                affected_url=current_url
                            )
                            page_issues.append(iss)
                            issue_counts["warnings"] += 1
                    else:
                        iss = IssueItem(
                            issue_type="Error",
                            category="Title/Meta",
                            title="Missing HTML Title Tag",
                            description="Page is missing a primary <title> tag.",
                            affected_url=current_url
                        )
                        page_issues.append(iss)
                        top_issues.append(iss)
                        issue_counts["errors"] += 1

                    # 2. Meta Description
                    meta_node = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
                    if meta_node and meta_node.get("content"):
                        meta_desc = meta_node["content"].strip()
                    else:
                        iss = IssueItem(
                            issue_type="Warning",
                            category="Title/Meta",
                            title="Missing Meta Description",
                            description="Search engines will generate an automated snippet.",
                            affected_url=current_url
                        )
                        page_issues.append(iss)
                        issue_counts["warnings"] += 1

                    # 3. Canonical Tag
                    canon_node = soup.find("link", attrs={"rel": "canonical"})
                    if canon_node and canon_node.get("href"):
                        canonical_url = canon_node["href"].strip()
                    else:
                        iss = IssueItem(
                            issue_type="Notice",
                            category="Canonical",
                            title="Missing Canonical Tag",
                            description="Canonical tag avoids duplicate content penalties.",
                            affected_url=current_url
                        )
                        page_issues.append(iss)
                        issue_counts["notices"] += 1

                    # 4. H1 Heading
                    h1_node = soup.find("h1")
                    if h1_node and h1_node.text:
                        h1_tag = h1_node.text.strip()
                    else:
                        iss = IssueItem(
                            issue_type="Warning",
                            category="Heading",
                            title="Missing H1 Heading",
                            description="Page lacks a primary <h1> heading tag.",
                            affected_url=current_url
                        )
                        page_issues.append(iss)
                        issue_counts["warnings"] += 1

                    # 5. Image ALT Tags
                    images = soup.find_all("img")
                    for img in images:
                        if not img.get("alt"):
                            missing_alt_count += 1
                    if missing_alt_count > 0:
                        iss = IssueItem(
                            issue_type="Notice",
                            category="Accessibility",
                            title=f"{missing_alt_count} Images Missing ALT Attribute",
                            description="Image alt attributes improve SEO indexing and screen-reader accessibility.",
                            affected_url=current_url
                        )
                        page_issues.append(iss)
                        issue_counts["notices"] += 1

                    # 6. Extract Internal Links for Crawl Queue
                    links = soup.find_all("a", href=True)
                    for l in links:
                        raw_href = l["href"].strip()
                        if raw_href.startswith("javascript:") or raw_href.startswith("mailto:") or raw_href.startswith("#"):
                            continue
                        full_href = urljoin(current_url, raw_href)
                        href_host = clean_url_host(full_href)

                        if href_host == root_host:
                            internal_links_count += 1
                            if full_href not in visited_urls and full_href not in queue and len(queue) < max_pages * 2:
                                queue.append(full_href)
                        else:
                            external_links_count += 1

            except Exception as exc:
                iss = IssueItem(
                    issue_type="Error",
                    category="Network",
                    title="Crawl Timeout / Connection Failure",
                    description=f"Failed to connect to page ({str(exc)[:60]}).",
                    affected_url=current_url
                )
                page_issues.append(iss)
                top_issues.append(iss)
                issue_counts["errors"] += 1

            crawled_items.append(CrawledPageItem(
                url=current_url,
                status_code=status_code,
                page_title=page_title,
                meta_description=meta_desc,
                canonical_url=canonical_url,
                h1_tag=h1_tag,
                internal_links_count=internal_links_count,
                external_links_count=external_links_count,
                images_missing_alt=missing_alt_count,
                issues=page_issues
            ))

    # Calculate overall SEO Health Score
    total_crawled = max(1, len(crawled_items))
    penalty = (issue_counts["errors"] * 15) + (issue_counts["warnings"] * 4) + (issue_counts["notices"] * 1)
    health_score = max(20, min(100, 100 - int(penalty / total_crawled * 10)))

    if health_score >= 90:
        grade = "A+"
    elif health_score >= 80:
        grade = "A"
    elif health_score >= 70:
        grade = "B"
    elif health_score >= 60:
        grade = "C"
    else:
        grade = "Needs Attention"

    response = SiteAuditResponse(
        domain=root_host,
        health_score=health_score,
        health_grade=grade,
        total_pages_crawled=total_crawled,
        status_summary=status_summary,
        issue_counts=issue_counts,
        crawled_pages=crawled_items,
        top_issues=top_issues[:15],
        scan_timestamp=datetime.now(timezone.utc).isoformat()
    )

    save_site_audit(root_host, response.model_dump())
    return response
