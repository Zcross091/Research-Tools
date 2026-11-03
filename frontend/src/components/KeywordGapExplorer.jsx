import React, { useState } from 'react';
import { Target, Search, AlertCircle, ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, Filter } from 'lucide-react';

export default function KeywordGapExplorer({ keywordGap, primaryDomain = 'Your Domain', competitorDomain = 'Competitor' }) {
  const [activeTab, setActiveTab] = useState('missing');
  const [searchFilter, setSearchFilter] = useState('');

  if (!keywordGap) return null;

  const {
    missing_keywords = [],
    weak_keywords = [],
    shared_keywords = [],
    untapped_keywords = []
  } = keywordGap;

  const tabConfigs = {
    missing: {
      label: 'Missing Keywords',
      count: missing_keywords.length,
      badge: 'Immediate Opportunity',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: `Keywords where ${competitorDomain} ranks in top 10 SERPs, but ${primaryDomain} does not rank.`,
      data: missing_keywords,
    },
    weak: {
      label: 'Weak Keywords',
      count: weak_keywords.length,
      badge: 'Content Optimization',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: `Keywords where ${competitorDomain} ranks higher than ${primaryDomain}. Quick refresh targets.`,
      data: weak_keywords,
    },
    shared: {
      label: 'Shared Keywords',
      count: shared_keywords.length,
      badge: 'Direct Competition',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      description: `High-value queries where both domains actively compete in Google Page 1 SERPs.`,
      data: shared_keywords,
    },
    untapped: {
      label: 'Untapped Keywords',
      count: untapped_keywords.length,
      badge: 'High ROI Easy Wins',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: `High search volume terms with low KD (< 35) that neither domain has fully monopolized.`,
      data: untapped_keywords,
    }
  };

  const currentTab = tabConfigs[activeTab];
  const filteredData = currentTab.data.filter(item =>
    item.keyword.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sky-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 rounded-lg text-sky-600 border border-sky-100">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800 text-lg">Keyword Gap & Competitive Content Matrix</h3>
              <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 font-semibold rounded-full border border-sky-200">
                Semrush Flagship
              </span>
            </div>
            <p className="text-xs text-slate-500">Discover untapped content opportunities and keyword intersection gaps</p>
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* 4 Interactive Opportunity Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(tabConfigs).map(([key, cfg]) => {
          const isSelected = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-300 shadow-sm ring-1 ring-sky-400/30'
                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold ${isSelected ? 'text-sky-800' : 'text-slate-700'}`}>
                  {cfg.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                  {cfg.count}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 line-clamp-1">{cfg.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Context Banner */}
      <div className="p-3 bg-sky-50/40 rounded-lg border border-sky-100/80 flex items-center justify-between text-xs text-slate-600">
        <span>{currentTab.description}</span>
        <span className="font-semibold text-sky-700 hidden sm:inline">Showing {filteredData.length} opportunities</span>
      </div>

      {/* Keywords Table */}
      <div className="border border-sky-100 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-sky-50/50 text-slate-600 border-b border-sky-100 font-medium">
            <tr>
              <th className="py-2.5 px-3">Keyword Query</th>
              <th className="py-2.5 px-3 text-right">Search Volume</th>
              <th className="py-2.5 px-3 text-right">KD %</th>
              <th className="py-2.5 px-3 text-right">Est. CPC</th>
              <th className="py-2.5 px-3 text-center">Intent</th>
              <th className="py-2.5 px-3 text-center">Your Rank</th>
              <th className="py-2.5 px-3 text-center">{competitorDomain} Rank</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50 text-slate-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                  No keywords matching &ldquo;{searchFilter}&rdquo; in this category.
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => {
                const isHighKd = item.kd > 60;
                const isEasyKd = item.kd < 35;
                return (
                  <tr key={idx} className="hover:bg-sky-50/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                      <span>{item.keyword}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      {item.volume.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isEasyKd
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isHighKd
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.kd}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ${item.cpc.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium uppercase tracking-wider">
                        {item.intent}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.your_rank ? (
                        <span className="font-semibold text-slate-800 font-mono">#{item.your_rank}</span>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.competitor_rank ? (
                        <span className="font-semibold text-sky-700 font-mono">#{item.competitor_rank}</span>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
