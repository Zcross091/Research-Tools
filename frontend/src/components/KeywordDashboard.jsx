import React, { useState } from 'react';
import { 
  TrendingUp, Search, Flame, HelpCircle, DollarSign, 
  Target, BarChart2, Check, Copy 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';

export default function KeywordDashboard({ data, loading, onSearch }) {
  const [inputVal, setInputVal] = useState('');
  const [copiedQuery, setCopiedQuery] = useState(null);

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
                  "{data.query}"
                </h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  {data.intent} Intent
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(data.difficulty).color}`}>
                  KD {data.difficulty}% ({getDifficultyColor(data.difficulty).label})
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Aggregated Google Trends interest, SERP difficulty, and live search suggestions
              </p>
            </div>

            <ConfidenceBadge confidence={data.confidence} />
          </div>

          {/* 4 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Est. Monthly Search Volume"
              value={data.search_volume.toLocaleString()}
              subtitle="Global monthly searches"
              icon={Target}
              highlight={true}
            />
            <MetricsCard
              title="Keyword Difficulty (KD)"
              value={`${data.difficulty}%`}
              subtitle={`Competitive barrier: ${getDifficultyColor(data.difficulty).label}`}
              icon={BarChart2}
            />
            <MetricsCard
              title="Avg. Cost Per Click (CPC)"
              value={`$${data.cpc}`}
              subtitle="Google Ads commercial value"
              icon={DollarSign}
            />
            <MetricsCard
              title="Search Intent"
              value={data.intent}
              subtitle="Primary query motive"
              icon={HelpCircle}
            />
          </div>

          {/* 12-Month Google Trends Curve */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
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
              <span>"People Also Ask" Question Explorer</span>
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
