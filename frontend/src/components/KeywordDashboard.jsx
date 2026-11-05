import React, { useState } from 'react';
import { 
  TrendingUp, Search, Flame, HelpCircle, DollarSign, 
  Target, BarChart2, Check, Copy, Globe, Flag, Sparkles,
  Layers, ExternalLink, MousePointerClick, ShieldCheck, ArrowRight,
  Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';
import KeywordGapExplorer from './KeywordGapExplorer';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import { generateExecutiveSummaryClient } from '../services/clientEngine';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'GLOBAL', name: 'Global / Worldwide', flag: '🌐' }
];

export default function KeywordDashboard({ data, loading, onSearch }) {
  const [inputVal, setInputVal] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [copiedQuery, setCopiedQuery] = useState(null);
  const [activeVariationTab, setActiveVariationTab] = useState('broad'); // 'broad' | 'phrase' | 'related'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim(), selectedCountry);
    }
  };

  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);
    if (data?.query) {
      onSearch(data.query, newCountry);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(text);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const getDifficultyInfo = (diff) => {
    if (diff < 30) return { label: 'Easy Target', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', stroke: '#10b981' };
    if (diff < 60) return { label: 'Moderate', color: 'text-sky-700 bg-sky-50 border-sky-200', stroke: '#0284c7' };
    if (diff < 85) return { label: 'Hard Competition', color: 'text-amber-700 bg-amber-50 border-amber-200', stroke: '#f59e0b' };
    return { label: 'Very Hard', color: 'text-rose-700 bg-rose-50 border-rose-200', stroke: '#f43f5e' };
  };

  const currentVariations = data?.variations ? (
    activeVariationTab === 'broad' 
      ? data.variations.broad_match 
      : activeVariationTab === 'phrase' 
        ? data.variations.phrase_match 
        : data.variations.related
  ) : [];

  const diffInfo = data ? getDifficultyInfo(data.difficulty) : null;

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-500/5">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter search keyword e.g. artificial intelligence, saas pricing, remote jobs..."
              className="w-full pl-12 pr-4 py-4 bg-sky-50/40 border border-sky-200/80 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 text-sm font-semibold transition-all font-mono"
            />
          </div>

          {/* Country Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full sm:w-auto h-full px-4 py-4 bg-sky-50/70 border border-sky-200 rounded-2xl text-slate-800 text-xs font-bold focus:outline-none focus:bg-white focus:border-sky-500 appearance-none cursor-pointer pr-10 font-mono"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-sky-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
          {['artificial intelligence', 'saas pricing', 'remote jobs', 'crypto trading', 'dropshipping'].map((term) => (
            <button
              key={term}
              onClick={() => { setInputVal(term); onSearch(term, selectedCountry); }}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-sky-200 transition-all shadow-xs hover:border-sky-300 font-mono"
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
            <div className="flex items-center gap-4">
              {/* Circular KD Ring Gauge */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke={diffInfo.stroke}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={163}
                    strokeDashoffset={163 - (163 * data.difficulty) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center leading-none">
                  <span className="font-extrabold text-xs text-slate-900 font-mono">{data.difficulty}%</span>
                  <span className="text-[8px] font-bold text-slate-400">KD</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900 capitalize tracking-tight font-mono">&ldquo;{data.query}&rdquo;</h2>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    {data.intent} Intent
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${diffInfo.color}`}>
                    {diffInfo.label}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 font-mono">
                    Region: {selectedCountry}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">Search volume, keyword difficulty, and SERP competitive opportunity</p>
              </div>
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
              title={`${selectedCountry} Monthly Searches`}
              value={data.search_volume.toLocaleString()}
              subtitle={`Region (${selectedCountry}) Target`}
              icon={TrendingUp}
            />
            <MetricsCard
              title="Global Search Volume"
              value={(data.global_volume || Math.round(data.search_volume * 1.84)).toLocaleString()}
              subtitle="Worldwide Total Volume"
              icon={Globe}
            />
            <MetricsCard
              title="Keyword Difficulty (KD)"
              value={`${data.difficulty}%`}
              subtitle={diffInfo.label}
              icon={Flame}
            />
            <MetricsCard
              title="Est. Cost Per Click (CPC)"
              value={`$${data.cpc}`}
              subtitle="Google Ads Benchmark"
              icon={DollarSign}
            />
          </div>

          {/* Interactive Google Autocomplete & Related Suggestions Matrix */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Google Autocomplete Suggestions & Related Queries Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Real-time long-tail search phrases with 1-click drilldowns</p>
              </div>
              <div className="flex gap-1 bg-sky-50 p-1 rounded-xl border border-sky-100">
                {['broad', 'phrase', 'related'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveVariationTab(tab)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                      activeVariationTab === tab ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'
                    }`}
                  >
                    {tab} Match
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-sky-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50/50 text-slate-600 border-b border-sky-100 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Suggested Search Phrase</th>
                    <th className="py-3 px-4 text-center">Intent</th>
                    <th className="py-3 px-4 text-right">Volume</th>
                    <th className="py-3 px-4 text-right">KD%</th>
                    <th className="py-3 px-4 text-right">Est. CPC</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50 text-slate-800">
                  {currentVariations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No keyword variations found for this category.
                      </td>
                    </tr>
                  ) : (
                    currentVariations.map((v, idx) => (
                      <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 font-mono capitalize">{v.keyword}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 bg-sky-50 text-sky-800 font-bold rounded-full border border-sky-200 text-[10px]">
                            {v.intent}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-sky-700">{v.volume.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">{v.difficulty}%</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600">${v.cpc}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onSearch(v.keyword, selectedCountry)}
                            className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-[11px] transition-all shadow-xs flex items-center gap-1 mx-auto active:scale-95"
                          >
                            <span>Analyze</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
              primaryDomain="Your Target Domain"
              competitorDomain="Market Competitors"
            />
          )}

        </div>
      )}
    </div>
  );
}
