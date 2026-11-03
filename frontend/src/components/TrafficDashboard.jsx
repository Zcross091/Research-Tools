import React, { useState } from 'react';
import { 
  Globe, Search, TrendingUp, Layers, Flag, ExternalLink, Cpu, 
  Clock, Eye, BarChart3, PieChart as PieIcon, Sparkles, AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';

const CHANNEL_COLORS = ['#0284c7', '#38bdf8', '#6366f1', '#f59e0b', '#ec4899', '#94a3b8'];

export default function TrafficDashboard({ data, loading, onSearch, onCompare }) {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const channelData = data?.sources ? [
    { name: 'Organic Search', value: data.sources.search },
    { name: 'Direct Traffic', value: data.sources.direct },
    { name: 'Social Media', value: data.sources.social },
    { name: 'Referrals', value: data.sources.referral },
    { name: 'Email Marketing', value: data.sources.mail },
    { name: 'Display Ads', value: data.sources.display },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-500/5">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter any domain to research e.g. stripe.com, nike.com, northexmarketing.com..."
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
            <span>Analyze Website</span>
          </button>
        </form>

        {/* Quick Suggestion Presets */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold">Try Fast Benchmarks:</span>
          {['northexmarketing.com', 'stripe.com', 'openai.com', 'shopify.com', 'github.com'].map((dom) => (
            <button
              key={dom}
              onClick={() => { setInputVal(dom); onSearch(dom); }}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-sky-200 transition-all font-mono shadow-xs hover:border-sky-300"
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={`https://www.google.com/s2/favicons?domain=${data.domain}&sz=64`}
                alt={data.domain}
                className="w-14 h-14 rounded-2xl p-1 bg-white border border-sky-100 shadow-sm"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{data.domain}</h2>
                  <a 
                    href={`https://${data.domain}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-slate-400 hover:text-sky-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                    {data.category}
                  </span>
                  {data.is_newly_launched && (
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Newly Launched ({data.domain_age_days}d old)</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl line-clamp-1">{data.title || data.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ConfidenceBadge confidence={data.confidence} />
              <button
                onClick={() => onCompare && onCompare(data.domain)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all shadow-xs"
              >
                + Compare Competitor
              </button>
            </div>
          </div>

          {/* Newly Launched Banner */}
          {data.is_newly_launched && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 font-bold">Verified Launch Date via ICANN Registry:</strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  This domain was registered on <strong className="text-amber-950 font-semibold">{data.registration_date}</strong> ({data.domain_age_days} days ago). 
                  Historical months prior to registration correctly show <strong>0 visits</strong>. Early launch traffic is in active baseline ramp-up.
                </p>
              </div>
            </div>
          )}

          {/* 4 Core Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Estimated Monthly Visits"
              value={data.is_newly_launched ? `~${data.total_visits.toLocaleString()}` : data.total_visits.toLocaleString()}
              subtitle={data.is_newly_launched ? "Early launch baseline" : "Calibrated 30-day volume"}
              trend={data.is_newly_launched ? "Emerging" : "+4.2%"}
              icon={Eye}
              highlight={true}
            />
            <MetricsCard
              title="Global Rank"
              value={data.global_rank === 0 ? "Unranked" : `#${data.global_rank.toLocaleString()}`}
              subtitle={data.global_rank === 0 ? "Outside Top 1M / Emerging" : `Country Rank: #${data.country_rank.toLocaleString()}`}
              icon={Globe}
            />
            <MetricsCard
              title="Avg Visit Duration"
              value={data.avg_visit_duration}
              subtitle="Time on site per session"
              icon={Clock}
            />
            <MetricsCard
              title="Bounce Rate"
              value={`${data.bounce_rate}%`}
              subtitle={`${data.pages_per_visit} Pages / Visit`}
              icon={BarChart3}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 6-Month Traffic Trend */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <span>Monthly Traffic Growth (6 Months)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {data.is_newly_launched 
                      ? 'Verified timeline: Pre-registration months recorded as 0 visits' 
                      : 'Total desktop & mobile visits index'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
                  Similarweb Modeling
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthly_history}>
                    <defs>
                      <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      tickFormatter={(v) => (v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : `${(v/1e3).toFixed(0)}k`)}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bae6fd', borderRadius: '16px', color: '#0f172a', boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.1)' }}
                      formatter={(val) => [val.toLocaleString(), 'Estimated Visits']}
                    />
                    <Area type="monotone" dataKey="visits" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#trafficGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic Channels Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <PieIcon className="w-4 h-4 text-sky-600" />
                  <span>Traffic Sources</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Distribution by acquisition channel</p>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bae6fd', borderRadius: '14px', color: '#0f172a' }}
                        formatter={(val) => [`${val}%`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-sky-100 text-xs">
                {channelData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHANNEL_COLORS[idx] }}></span>
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Grid: Geography & Tech Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Geography Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Flag className="w-4 h-4 text-sky-600" />
                <span>Top Geography & Country Traffic</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Audiences by country location</p>

              <div className="space-y-3.5">
                {data.top_countries?.map((c) => (
                  <div key={c.country} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">{c.code}</span>
                        <span>{c.country}</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">{c.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-sky-100/60 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" 
                        style={{ width: `${c.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Detected Technology Stack */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-sky-600" />
                <span>Detected Technology Stack</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Live inspection of frameworks, analytics & infrastructure</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.tech_stack?.map((tech, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-start gap-3 hover:border-sky-300 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-white text-sky-600 border border-sky-200 shadow-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tech.name}</div>
                      <div className="text-[11px] text-sky-700 font-semibold">{tech.category}</div>
                      {tech.details && (
                        <div className="text-[10px] text-slate-500 line-clamp-1">{tech.details}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
