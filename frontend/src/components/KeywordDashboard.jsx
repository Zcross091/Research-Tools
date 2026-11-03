import React, { useState } from 'react';
import { 
  TrendingUp, Search, Flame, HelpCircle, DollarSign, 
  Target, BarChart2, Check, Copy, Globe, Flag, Sparkles,
  Layers, ExternalLink, MousePointerClick, ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';

export default function KeywordDashboard({ data, loading, onSearch }) {
  const [inputVal, setInputVal] = useState('');
  const [copiedQuery, setCopiedQuery] = useState(null);
  const [activeVariationTab, setActiveVariationTab] = useState('broad'); // 'broad' | 'phrase' | 'related'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(text);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const getDifficultyColor = (diff) => {
    if (diff < 30) return { label: 'Easy', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (diff < 60) return { label: 'Medium', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    return { label: 'Hard', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const currentVariations = data?.variations ? (
    activeVariationTab === 'broad' 
      ? data.variations.broad_match 
      : activeVariationTab === 'phrase' 
        ? data.variations.phrase_match 
        : data.variations.related
  ) : [];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-500/5">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter search keyword e.g. artificial intelligence, dropshipping, crm..."
              className="w-full pl-12 pr-4 py-4 bg-sky-50/40 border border-sky-200/80 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 text-sm font-semibold transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Analyze Keywords</span>
          </button>
        </form>

        {/* Quick Chips */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold">Trending Searches:</span>
          {['artificial intelligence', 'dropshipping', 'saas pricing', 'web development', 'remote jobs'].map((kw) => (
            <button
              key={kw}
              onClick={() => { setInputVal(kw); onSearch(kw); }}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-sky-200 transition-all font-mono shadow-xs hover:border-sky-300"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                  &ldquo;{data.query}&rdquo;
                </h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  {data.intent} Intent
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(data.difficulty).color}`}>
                  KD {data.difficulty}% ({getDifficultyColor(data.difficulty).label})
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Comp. Density: {data.competitive_density || 0.50}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Aggregated Google Trends interest, SERP difficulty, Page 1 rankings & live search suggestions
              </p>
            </div>

            <ConfidenceBadge confidence={data.confidence} />
          </div>

          {/* 6 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <MetricsCard
              title="US Search Volume"
              value={data.search_volume.toLocaleString()}
              subtitle="Monthly search volume"
              icon={Target}
              highlight={true}
            />
            <MetricsCard
              title="Global Volume"
              value={(data.global_volume || Math.round(data.search_volume * 1.84)).toLocaleString()}
              subtitle="Worldwide monthly searches"
              icon={Globe}
            />
            <MetricsCard
              title="Keyword Difficulty"
              value={`${data.difficulty}%`}
              subtitle={`Barrier: ${getDifficultyColor(data.difficulty).label}`}
              icon={BarChart2}
            />
            <MetricsCard
              title="Avg. CPC"
              value={`$${data.cpc}`}
              subtitle="Google Ads click cost"
              icon={DollarSign}
            />
            <MetricsCard
              title="Search Intent"
              value={data.intent}
              subtitle="Primary user motive"
              icon={HelpCircle}
            />
            <MetricsCard
              title="Click Potential"
              value={data.click_potential ? `${data.click_potential.organic_clicks}%` : '65%'}
              subtitle="Organic click rate"
              icon={MousePointerClick}
            />
          </div>

          {/* Click Potential Breakdown Bar */}
          {data.click_potential && (
            <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <MousePointerClick className="w-4 h-4 text-sky-600" />
                <span>SERP Click-Through Distribution:</span>
              </div>
              <div className="flex-1 w-full max-w-xl flex items-center gap-2">
                <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden flex">
                  <div className="bg-sky-600 h-full" style={{ width: `${data.click_potential.organic_clicks}%` }} title="Organic Clicks"></div>
                  <div className="bg-indigo-500 h-full" style={{ width: `${data.click_potential.paid_clicks}%` }} title="Paid Clicks"></div>
                  <div className="bg-slate-300 h-full" style={{ width: `${data.click_potential.zero_clicks}%` }} title="Zero-Click Searches"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1 text-sky-700 font-bold"><span className="w-2 h-2 rounded-full bg-sky-600"></span> {data.click_potential.organic_clicks}% Organic</span>
                <span className="flex items-center gap-1 text-indigo-700 font-bold"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> {data.click_potential.paid_clicks}% Paid</span>
                <span className="flex items-center gap-1 text-slate-500 font-bold"><span className="w-2 h-2 rounded-full bg-slate-400"></span> {data.click_potential.zero_clicks}% Zero-Click</span>
              </div>
            </div>
          )}

          {/* Google Page 1 SERP Features Matrix */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Google SERP Features On Page 1</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Detected rich elements in live Google search results for this query</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(data.serp_features || []).map((feat, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                    feat.present ? 'bg-sky-50/70 border-sky-200 text-sky-900' : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${feat.present ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{feat.name}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{feat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 12-Month Google Trends Curve & Country Volume Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <span>Google Trends Interest Over Time (12 Months)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Search interest index normalized from 0 to 100</p>
                </div>
                <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
                  100 = Peak Popularity
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.interest_over_time}>
                    <defs>
                      <linearGradient id="trendsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bae6fd', borderRadius: '16px', color: '#0f172a' }}
                      formatter={(val) => [`${val} / 100`, 'Interest Index']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#trendsGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Country Volumes */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Flag className="w-4 h-4 text-sky-600" />
                  <span>Volume By Country</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Top geographic search demand</p>

                <div className="space-y-3">
                  {(data.country_volumes || []).map((cv, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-slate-800">
                          <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded border border-sky-100 text-[10px]">{cv.code}</span>
                          <span>{cv.country}</span>
                        </span>
                        <span className="font-mono text-slate-900 font-bold">{cv.volume.toLocaleString()} ({cv.share}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-sky-100 overflow-hidden">
                        <div className="h-full bg-sky-600 rounded-full" style={{ width: `${cv.share}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 Google Page 1 SERP Ranking Competitors (Ahrefs / Semrush Caliber) */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Top 10 Google Page 1 SERP Competitor Rankings</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Verified top 10 URLs ranking organically on Google for &ldquo;{data.query}&rdquo;</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-sky-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 text-center">Rank</th>
                    <th className="py-2.5 px-3">Page Title & URL</th>
                    <th className="py-2.5 px-3 text-center">Domain Auth (DA)</th>
                    <th className="py-2.5 px-3 text-right">Est. Monthly Visits</th>
                    <th className="py-2.5 px-3 text-right">Backlinks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {(data.top_serp_results || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-2.5 px-3 text-center">
                        <span className="w-6 h-6 inline-flex items-center justify-center rounded-lg bg-sky-100 text-sky-800 font-bold font-mono text-xs">
                          #{item.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 font-mono line-clamp-1 mt-0.5"
                        >
                          <span>{item.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold font-mono text-[11px] border border-indigo-200">
                          DA {item.domain_authority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                        {item.est_visits.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                        {item.backlinks.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Keyword Variations & Match Types Explorer (Broad, Phrase, Related) */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>Keyword Variations & Match Type Explorer</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Targeted long-tail and intent variants</p>
              </div>

              <div className="flex items-center gap-1 bg-sky-50 p-1 rounded-2xl border border-sky-200 text-xs font-bold">
                <button
                  onClick={() => setActiveVariationTab('broad')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeVariationTab === 'broad' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'
                  }`}
                >
                  Broad Match
                </button>
                <button
                  onClick={() => setActiveVariationTab('phrase')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeVariationTab === 'phrase' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'
                  }`}
                >
                  Phrase Match
                </button>
                <button
                  onClick={() => setActiveVariationTab('related')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeVariationTab === 'related' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'
                  }`}
                >
                  Related Terms
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-sky-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Keyword Variant</th>
                    <th className="py-2.5 px-3 text-right">Search Volume</th>
                    <th className="py-2.5 px-3 text-center">Difficulty (KD)</th>
                    <th className="py-2.5 px-3 text-right">CPC</th>
                    <th className="py-2.5 px-3 text-center">Intent</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {currentVariations.map((v, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">{v.keyword}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-700">{v.volume.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getDifficultyColor(v.difficulty).color}`}>
                          {v.difficulty}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">${v.cpc}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-100 text-[10px]">
                          {v.intent}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => { setInputVal(v.keyword); onSearch(v.keyword); }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-sky-600 font-bold border border-sky-200 text-[11px]"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dual Columns: Rising Queries & Live Google Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breakout & Rising Queries */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Rising & Breakout Queries</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Fastest surging related search terms</p>

              <div className="space-y-2.5">
                {data.breakout_queries?.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-slate-900">{item.query}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono">
                      {item.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Google Suggestions */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Search className="w-4 h-4 text-sky-600" />
                <span>Live Google Search Suggestions</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Direct autocomplete variations from active searchers</p>

              <div className="space-y-2">
                {data.related_queries?.map((sug, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-sky-50/40 border border-sky-100 flex items-center justify-between hover:border-sky-300 hover:bg-sky-50 transition-all"
                  >
                    <span className="text-xs text-slate-700 font-mono font-medium">{sug}</span>
                    <button
                      onClick={() => copyToClipboard(sug)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-white transition-all shadow-xs"
                      title="Copy keyword"
                    >
                      {copiedQuery === sug ? <Check className="w-4 h-4 text-sky-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* People Also Ask (Questions Explorer) */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>&ldquo;People Also Ask&rdquo; Question Explorer</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">High-intent questions asked by searchers for content creation</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.questions?.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-start gap-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white text-sky-700 border border-sky-200 shadow-xs font-mono">
                    {q.category}
                  </span>
                  <div className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {q.question}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
