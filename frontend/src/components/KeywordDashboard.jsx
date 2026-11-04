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
import KeywordGapExplorer from './KeywordGapExplorer';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import { generateExecutiveSummaryClient } from '../services/clientEngine';

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
            <span>Analyze Keyword</span>
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold">Popular Targets:</span>
          {['artificial intelligence', 'saas pricing', 'remote jobs', 'crypto trading'].map((term) => (
            <button
              key={term}
              onClick={() => { setInputVal(term); onSearch(term); }}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-sky-200 transition-all shadow-xs hover:border-sky-300"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-slate-900 capitalize tracking-tight">&ldquo;{data.query}&rdquo;</h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  {data.intent} Intent
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(data.difficulty).color}`}>
                  KD {data.difficulty}% • {getDifficultyColor(data.difficulty).label}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Google Search Volume & Competitive Opportunity Analysis</p>
            </div>

            <div className="flex items-center gap-3">
              <ConfidenceBadge confidence={data.confidence} />
              <button
                onClick={() => copyToClipboard(data.query)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all shadow-xs flex items-center gap-1.5"
              >
                {copiedQuery === data.query ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQuery === data.query ? 'Copied!' : 'Copy Query'}</span>
              </button>
            </div>
          </div>

          {/* AI Executive Insights Brief */}
          <ExecutiveSummaryCard
            moduleType="keyword"
            bullets={generateExecutiveSummaryClient('keyword', data)}
          />

          {/* Metric Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="US Search Volume"
              value={data.search_volume.toLocaleString()}
              subtitle="Monthly Queries"
              icon={TrendingUp}
            />
            <MetricsCard
              title="Global Search Volume"
              value={(data.global_volume || Math.round(data.search_volume * 1.84)).toLocaleString()}
              subtitle="Worldwide Total"
              icon={Globe}
            />
            <MetricsCard
              title="Keyword Difficulty (KD)"
              value={`${data.difficulty}%`}
              subtitle={getDifficultyColor(data.difficulty).label}
              icon={Flame}
            />
            <MetricsCard
              title="Est. Cost Per Click"
              value={`$${data.cpc}`}
              subtitle="Google Ads Benchmark"
              icon={DollarSign}
            />
          </div>

          {/* 12-Month Google Trends Interest Chart */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sky-600" />
                <span>12-Month Google Search Interest Curve</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Relative search popularity index over time (0-100)</p>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.interest_over_time}>
                  <defs>
                    <linearGradient id="colorKeywordTrends" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bae6fd', borderRadius: '14px' }}
                    formatter={(val) => [val, 'Interest Index']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorKeywordTrends)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Keyword Variations & Opportunity Gap */}
          {data.keyword_gap && (
            <KeywordGapExplorer
              keywordGap={data.keyword_gap}
              primaryDomain="Your Domain"
              competitorDomain="Competitors"
            />
          )}

        </div>
      )}
    </div>
  );
}
