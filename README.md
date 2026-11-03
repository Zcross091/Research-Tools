# OmniResearch | Unified All-in-One Research Tools Platform

A high-performance market, competitor, audience, and keyword intelligence platform consolidating **Similarweb**, **SocialBlade**, **vidIQ**, **SparkToro**, **Audiense**, **Brandwatch**, and **Google Trends** into a single modern web application.

---

## Features & Supported Tools

1. **Website & Competitor Intelligence** (*Similarweb clone*)
   - Total estimated monthly visits with 6-month historical curve.
   - Global rank, country rank, and category benchmarks.
   - Engagement metrics: Bounce rate, pages per visit, average session duration.
   - Traffic acquisition channels: Direct, Organic Search, Social, Referral, Email, Display.
   - Top countries traffic distribution with visual bars.
   - Live technology stack detector: Frameworks (React, Next.js), CMS (WordPress, Shopify), Analytics (GA4, Mixpanel), Hosting/CDN (Cloudflare, AWS), Payments (Stripe).

2. **Keywords & Trend Intelligence** (*Google Trends / Semrush / Ahrefs clone*)
   - 12-month Google Trends Interest Over Time normalized timeline (0-100 scale).
   - Monthly search volume estimates, Keyword Difficulty (KD %), and CPC benchmarks.
   - Search intent classification (Informational, Commercial, Transactional, Navigational).
   - Fast-rising & Breakout queries (+150%, +450%, "Breakout").
   - Live real-time Google Autocomplete suggestions with 1-click copy.
   - "People Also Ask" questions classified by Who, What, Where, Why, How, Best.

3. **Creator & Social Intelligence** (*SocialBlade & vidIQ clone*)
   - YouTube channel subscriber counts, total views, and video counts.
   - SocialBlade grade rating (`A++`, `A`, `B+`).
   - Estimated monthly and annualized monetization earnings brackets ($).
   - 1-Year subscriber growth projection and engagement rate.
   - **vidIQ Video SEO Tag Inspector**: Paste any YouTube video link to extract all hidden tags, title SEO score, and word counts with 1-click "Copy All Tags".

4. **Audience & Brand Intelligence** (*SparkToro & Brandwatch clone*)
   - Platform affinity scores: Where the target audience hangs out (Reddit, YouTube, Twitter/X, LinkedIn, Podcasts).
   - Real-time Reddit community discovery with active member counts.
   - Brandwatch NLP discussion sentiment distribution (Positive, Neutral, Negative) + executive summary.
   - Demographic profile (age brackets, top job roles).
   - Trending social topics and hashtags.

5. **Head-to-Head Comparison Matrix**
   - Side-by-side comparison for two competitor websites (e.g. `stripe.com` vs `shopify.com`).
   - Side-by-side comparison for two keywords (e.g. `react` vs `vue`).

6. **Executive Export**
   - 1-click export to structured `.CSV` spreadsheet.
   - 1-click print / export to formatted executive PDF summary.

7. **Client Reputation & Data Transparency**
   - Every metric displays a **Data Confidence Level** badge (e.g. 98%) with transparent attribution to verified sources and deterministic models.
   - Built-in SQLite caching ensures sub-50ms repeat searches and protects against upstream IP rate limits.

---

## Quickstart Guide

### 1. Backend Service (FastAPI)
```powershell
# Navigate to backend and install dependencies
cd backend
python -m pip install -r requirements.txt

# Run the server
$env:PYTHONPATH="."
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API and Swagger docs will be live at `http://127.0.0.1:8000/docs`.

### 2. Frontend Application (React + Vite)
```powershell
# In a new terminal, navigate to frontend and install dependencies
cd frontend
npm.cmd install

# Start development server
npm.cmd run dev
```
Open your browser at `http://localhost:5173`.

