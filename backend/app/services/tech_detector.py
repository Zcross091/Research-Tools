import httpx
import re
from bs4 import BeautifulSoup
from typing import List, Dict, Tuple
from app.models.schemas import TechStackItem

TECH_SIGNATURES = [
    # CMS / eCommerce
    {"category": "eCommerce", "name": "Shopify", "pattern": r"cdn\.shopify\.com|myshopify\.com"},
    {"category": "CMS", "name": "WordPress", "pattern": r"wp-content|wp-includes|wordpress"},
    {"category": "CMS", "name": "Webflow", "pattern": r"assets\.webflow\.com|wf-page"},
    {"category": "CMS", "name": "Ghost", "pattern": r"ghost\.io|ghost-search"},
    {"category": "CMS", "name": "Drupal", "pattern": r"drupal\.org|Drupal\.settings"},
    
    # Frontend Frameworks
    {"category": "Framework", "name": "Next.js", "pattern": r"_next/static|__NEXT_DATA__"},
    {"category": "Framework", "name": "React", "pattern": r"react\.production\.min\.js|_reactRoot|react-dom"},
    {"category": "Framework", "name": "Vue.js", "pattern": r"vue\.runtime|data-v-|\/vue\.js"},
    {"category": "Framework", "name": "Nuxt.js", "pattern": r"_nuxt\/|__NUXT__"},
    {"category": "Framework", "name": "Angular", "pattern": r"ng-version|ng-app"},
    {"category": "Framework", "name": "Svelte", "pattern": r"svelte-"},
    {"category": "UI Library", "name": "Tailwind CSS", "pattern": r"tailwind"},

    # Analytics & Tracking
    {"category": "Analytics", "name": "Google Analytics (GA4)", "pattern": r"googletagmanager\.com/gtag/js|gtag\('config',\s*'G-"},
    {"category": "Analytics", "name": "Google Tag Manager", "pattern": r"googletagmanager\.com/gtm\.js"},
    {"category": "Analytics", "name": "Segment", "pattern": r"cdn\.segment\.com/analytics\.js"},
    {"category": "Analytics", "name": "Mixpanel", "pattern": r"mixpanel\.init|cdn\.mxpnl\.com"},
    {"category": "Analytics", "name": "Hotjar", "pattern": r"static\.hotjar\.com"},
    {"category": "Analytics", "name": "PostHog", "pattern": r"posthog-js|app\.posthog\.com"},

    # CDN & Infrastructure
    {"category": "CDN / Hosting", "name": "Cloudflare", "header": ("server", r"cloudflare")},
    {"category": "CDN / Hosting", "name": "Vercel", "header": ("x-vercel-id", r".*")},
    {"category": "CDN / Hosting", "name": "Netlify", "header": ("server", r"netlify")},
    {"category": "CDN / Hosting", "name": "AWS CloudFront", "header": ("via", r"cloudfront|awselb")},
    {"category": "CDN / Hosting", "name": "Fastly", "header": ("fastly-debug-digest", r".*")},
    {"category": "Web Server", "name": "Nginx", "header": ("server", r"nginx")},
    {"category": "Web Server", "name": "Apache", "header": ("server", r"apache")},

    # Payments & Auth
    {"category": "Payments", "name": "Stripe", "pattern": r"js\.stripe\.com"},
    {"category": "Payments", "name": "PayPal", "pattern": r"paypal\.com/sdk"},
    {"category": "Customer Support", "name": "Intercom", "pattern": r"widget\.intercom\.io"},
    {"category": "Customer Support", "name": "Zendesk", "pattern": r"static\.zdassets\.com"},
]

async def detect_technologies(domain: str) -> Tuple[List[TechStackItem], str, str]:
    """
    Inspects live website headers and HTML content to identify
    frameworks, analytics, CMS, and cloud infrastructure.
    Returns: (List[TechStackItem], page_title, page_description)
    """
    detected: List[TechStackItem] = []
    title = domain
    description = f"Website and competitor intelligence for {domain}"
    
    url = f"https://{domain}" if not domain.startswith("http") else domain
    
    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"}) as client:
            resp = await client.get(url)
            html_text = resp.text
            headers = {k.lower(): v.lower() for k, v in resp.headers.items()}
            
            # Parse page metadata
            soup = BeautifulSoup(html_text[:500000], "html.parser")
            if soup.title and soup.title.string:
                title = soup.title.string.strip()
            
            meta_desc = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
            if meta_desc and meta_desc.get("content"):
                description = meta_desc["content"].strip()

            # Check Headers
            for sig in TECH_SIGNATURES:
                if "header" in sig:
                    h_key, h_pattern = sig["header"]
                    if h_key in headers and re.search(h_pattern, headers[h_key], re.IGNORECASE):
                        if not any(d.name == sig["name"] for d in detected):
                            detected.append(TechStackItem(
                                category=sig["category"],
                                name=sig["name"],
                                details=headers.get(h_key, "")[:50]
                            ))

            # Check HTML Signatures
            for sig in TECH_SIGNATURES:
                if "pattern" in sig:
                    if re.search(sig["pattern"], html_text, re.IGNORECASE):
                        if not any(d.name == sig["name"] for d in detected):
                            detected.append(TechStackItem(
                                category=sig["category"],
                                name=sig["name"],
                                details="Detected via script/asset signature"
                            ))

    except Exception:
        # Fallback if site blocks crawler or is offline
        detected.append(TechStackItem(category="Infrastructure", name="DNS / HTTP", details="Standard Web Service"))

    if not detected:
        detected.append(TechStackItem(category="Frontend", name="HTML5 / Modern JS", details="Native Web Standards"))

    return detected, title, description

