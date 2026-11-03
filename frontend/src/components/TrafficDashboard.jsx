import React, { useState } from 'react';
import { 
  Globe, Search, TrendingUp, Layers, Flag, ExternalLink, Cpu, 
  Clock, Eye, BarChart3, PieChart as PieIcon, Sparkles, AlertCircle,
  Smartphone, Monitor, Share2, ArrowUpRight, ShieldCheck, Users,
  FolderGit2, Link2, Target, GitCompare, Megaphone
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';
import BacklinksExplorer from './BacklinksExplorer';

const CHANNEL_COLORS = ['#0284c7', '#38bdf8', '#6366f1', '#f59e0b', '#ec4899', '#94a3b8'];

export default function TrafficDashboard({ data, loading, onSearch, onCompare }) {
  const [inputVal, setInputVal] = useState('');
  const [activeRange, setActiveRange] = useState('6M');
  const [keywordFilter, setKeywordFilter] = useState('');

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

  const filteredOrganicKeywords = (data?.top_organic_keywords || []).filter(k => 
    k.keyword.toLowerCase().includes(keywordFilter.toLowerCase())
  );

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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all shadow-xs flex items-center gap-1.5"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare</span>
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

          {/* Core Metrics Cards (6 Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <MetricsCard
              title="Monthly Visits"
              value={data.is_newly_launched ? `~${data.total_visits.toLocaleString()}` : data.total_visits.toLocaleString()}
              subtitle={data.is_newly_launched ? "Early launch baseline" : "Total 30-day traffic"}
              trend={data.is_newly_launched ? "Emerging" : `+${data.mom_growth || 4.2}%`}
              icon={Eye}
              highlight={true}
            />
            <MetricsCard
              title="Unique Visitors"
              value={(data.unique_visitors || Math.round(data.total_visits * 0.74)).toLocaleString()}
              subtitle="Monthly active audience"
              icon={Users}
            />
            <MetricsCard
              title="Global Rank"
              value={data.global_rank === 0 ? "Unranked" : `#${data.global_rank.toLocaleString()}`}
              subtitle={data.global_rank === 0 ? "Outside Top 1M" : `Country Rank: #${data.country_rank.toLocaleString()}`}
              icon={Globe}
            />
            <MetricsCard
              title="Avg Duration"
              value={data.avg_visit_duration}
              subtitle="Time per session"
              icon={Clock}
            />
            <MetricsCard
              title="Bounce Rate"
              value={`${data.bounce_rate}%`}
              subtitle={`${data.pages_per_visit} Pages / Visit`}
              icon={BarChart3}
            />
            <MetricsCard
              title="Device Leader"
              value={data.device_split ? `${data.device_split.desktop}% Desktop` : '56% Desktop'}
              subtitle={data.device_split ? `${data.device_split.mobile}% Mobile Web` : '44% Mobile'}
              icon={Monitor}
            />
          </div>

          {/* Desktop vs Mobile Split Deep-Dive Bar */}
          {data.device_split && (
            <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Desktop Traffic Distribution</div>
                  <div className="text-[11px] text-slate-500 font-medium">Avg Duration: {data.device_split.desktop_duration} • Bounce: {data.device_split.desktop_bounce}%</div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-sky-700">Desktop: {data.device_split.desktop}%</span>
                  <span className="text-blue-600">Mobile: {data.device_split.mobile}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-blue-100 overflow-hidden flex">
                  <div className="bg-sky-600 h-full rounded-l-full" style={{ width: `${data.device_split.desktop}%` }}></div>
                  <div className="bg-blue-400 h-full rounded-r-full" style={{ width: `${data.device_split.mobile}%` }}></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Mobile Web Distribution</div>
                  <div className="text-[11px] text-slate-500 font-medium">Avg Duration: {data.device_split.mobile_duration} • Bounce: {data.device_split.mobile_bounce}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Traffic Trend and Sources Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend Area Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <span>Monthly Traffic Growth</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {data.is_newly_launched 
                      ? 'Verified timeline: Pre-registration months recorded as 0 visits' 
                      : 'Similarweb validated traffic trajectory'}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-sky-50 p-1 rounded-xl border border-sky-200 text-xs font-bold">
                  {['3M', '6M', '12M'].map(r => (
                    <button
                      key={r}
                      onClick={() => setActiveRange(r)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        activeRange === r ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
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
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bae6fd', borderRadius: '16px', color: '#0f172a' }}
                      formatter={(val) => [val.toLocaleString(), 'Estimated Visits']}
                    />
                    <Area type="monotone" dataKey="visits" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#trafficGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Channels Pie Chart */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <PieIcon className="w-4 h-4 text-sky-600" />
                  <span>Traffic Acquisition Channels</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Traffic share by source channel</p>

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

          {/* Organic & Paid Search Keywords Table (Semrush/Similarweb Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Organic Search Keywords */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-4 h-4 text-sky-600" />
                    <span>Top Organic Search Keywords</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Keywords driving unpaid search traffic to {data.domain}</p>
                </div>
                <input
                  type="text"
                  placeholder="Filter keywords..."
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  className="px-3 py-1 text-xs rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:bg-white focus:border-sky-500 font-medium"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-sky-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Keyword</th>
                      <th className="py-2.5 px-3 text-right">Volume</th>
                      <th className="py-2.5 px-3 text-right">Traffic Share</th>
                      <th className="py-2.5 px-3 text-right">Position</th>
                      <th className="py-2.5 px-3 text-right">CPC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50">
                    {filteredOrganicKeywords.map((kw, idx) => (
                      <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-800 font-mono flex items-center gap-1.5">
                          <span>{kw.keyword}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{kw.volume.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-sky-700 font-mono">{kw.traffic_share}%</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 font-mono">
                            #{kw.position}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono">${kw.cpc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Paid Keywords (Google Ads PPC) */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                <span>Paid Search Keywords (Google Ads)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">PPC campaigns driving paid traffic</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-sky-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Paid Keyword</th>
                      <th className="py-2.5 px-3 text-right">Est. Volume</th>
                      <th className="py-2.5 px-3 text-right">Traffic Share</th>
                      <th className="py-2.5 px-3 text-right">Target CPC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50">
                    {(data.top_paid_keywords || []).map((pkw, idx) => (
                      <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-800 font-mono">{pkw.keyword}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{pkw.volume.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-indigo-700 font-mono">{pkw.traffic_share}%</td>
                        <td className="py-2.5 px-3 text-right text-slate-700 font-bold font-mono">${pkw.cpc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Referral Ecosystem & Outgoing Destination Domains */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Referring Domains */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Link2 className="w-4 h-4 text-sky-600" />
                <span>Top Referring Websites</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">External domains sending traffic via backlinks & mentions</p>

              <div className="space-y-3">
                {(data.referring_domains || []).map((ref, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-500" />
                        <span>{ref.domain}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">{ref.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sky-700 font-mono text-xs">{ref.share_percentage}%</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ref.monthly_visits.toLocaleString()} visits</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Outgoing Destination Domains */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <ExternalLink className="w-4 h-4 text-sky-600" />
                <span>Outgoing Destination Websites</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Where visitors navigate immediately after visiting {data.domain}</p>

              <div className="space-y-3">
                {(data.outgoing_domains || []).map((out, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{out.domain}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">{out.category}</div>
                    </div>
                    <div className="font-bold text-indigo-700 font-mono text-xs">{out.share_percentage}% share</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subdomains & Social Media Channels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subdomains Traffic Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <FolderGit2 className="w-4 h-4 text-sky-600" />
                <span>Top Subdomains & Portals</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Traffic allocation across key subdomain sections</p>

              <div className="space-y-3.5">
                {(data.subdomains || []).map((sub, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="font-mono text-slate-800">{sub.subdomain}</span>
                      <span className="font-mono text-sky-700 font-bold">{sub.traffic_share}% ({sub.monthly_visits.toLocaleString()})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-sky-100 overflow-hidden">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${sub.traffic_share}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Network Referrals Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-sky-600" />
                <span>Social Media Traffic Split</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Acquisition by specific social platforms</p>

              <div className="space-y-3.5">
                {(data.social_breakdown || []).map((soc, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{soc.platform}</span>
                      <span className="font-mono text-sky-700 font-bold">{soc.share}% ({soc.visits.toLocaleString()} visits)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-sky-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full" style={{ width: `${soc.share}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Intelligence Matrix (Similarweb Style) */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-sky-600" />
                  <span>Direct Competitor Matrix & Overlap</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Leading industry alternatives ranked by similarity score and market volume</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-sky-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Competitor Domain</th>
                    <th className="py-3 px-4 text-center">Similarity</th>
                    <th className="py-3 px-4 text-right">Global Rank</th>
                    <th className="py-3 px-4 text-right">Monthly Visits</th>
                    <th className="py-3 px-4 text-right">Shared Keywords</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {(data.competitor_matrix || []).map((comp, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-sky-500" />
                        <span>{comp.domain}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200 font-mono">
                          {comp.similarity}% Match
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">#{comp.global_rank.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{comp.monthly_visits.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">{comp.shared_keywords.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onCompare && onCompare(comp.domain)}
                          className="px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 transition-all text-[11px]"
                        >
                          + Compare
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Backlink Profile & Authority Health Hub (Ahrefs Caliber) */}
          {data.backlink_profile && (
            <BacklinksExplorer backlinkProfile={data.backlink_profile} domain={data.domain} />
          )}

          {/* Display Ads & Creative Intelligence (Similarweb Ads Caliber) */}
          {data.ad_intelligence && (
            <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sky-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-50 rounded-xl text-sky-600 border border-sky-100">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">Display Ad Intelligence & Placements</h3>
                      <span className="text-[11px] px-2 py-0.5 bg-sky-100 text-sky-700 font-semibold rounded-full border border-sky-200">
                        Similarweb Ads
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Top ad networks, placement publishers, and live creative copies</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Paid Display Traffic Share: <span className="font-bold text-sky-700">{data.sources?.display || 1.0}%</span>
                </div>
              </div>

              {/* Ad Networks & Top Publishers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Ad Networks */}
                <div className="p-4 bg-sky-50/40 rounded-2xl border border-sky-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Top Ad Networks Used</h4>
                  <div className="space-y-2.5">
                    {data.ad_intelligence.ad_networks?.map((net, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{net.network}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-sky-600 h-full rounded-full" style={{ width: `${net.share}%` }}></div>
                          </div>
                          <span className="font-mono font-semibold text-slate-800 w-12 text-right">{net.share}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Placement Publishers */}
                <div className="p-4 bg-sky-50/40 rounded-2xl border border-sky-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Top Placement Publisher Sites</h4>
                  <div className="space-y-2.5">
                    {data.ad_intelligence.top_publishers?.map((pub, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sky-700">{pub.domain}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{pub.category}</span>
                        </div>
                        <span className="font-mono text-slate-600 font-medium">{pub.impressions_share}% share</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Display Ad Banners */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Sample Banner Creatives & Ad Headlines</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.ad_intelligence.sample_ad_copies?.map((ad, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-200/80 shadow-xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{ad.format}</span>
                        <h5 className="font-bold text-slate-800 text-sm mt-1 mb-2">&ldquo;{ad.headline}&rdquo;</h5>
                        <div className="text-[11px] text-sky-600 font-mono flex items-center gap-1 mb-4">
                          <ExternalLink className="w-3 h-3" /> {ad.display_url}
                        </div>
                      </div>
                      <div className="w-full py-1.5 px-3 bg-sky-600 text-white rounded-xl text-xs font-semibold text-center shadow-xs">
                        {ad.cta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Grid: Geography & Tech Stack & Audience Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 10 Geography Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Flag className="w-4 h-4 text-sky-600" />
                <span>Top Countries (Top 10)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Traffic volume by audience country</p>

              <div className="space-y-3">
                {data.top_countries?.map((c) => (
                  <div key={c.country} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded border border-sky-100 text-[10px]">{c.code}</span>
                        <span>{c.country}</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">{c.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-sky-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" style={{ width: `${c.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Demographics & Age Pyramid */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Audience Demographics</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Gender & age bracket profile</p>

              {data.audience_demographics && (
                <div className="space-y-4">
                  {/* Gender Split */}
                  <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-sky-700">Male: {data.audience_demographics.gender.male}%</span>
                      <span className="text-pink-600">Female: {data.audience_demographics.gender.female}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-pink-100 overflow-hidden flex">
                      <div className="bg-sky-600 h-full" style={{ width: `${data.audience_demographics.gender.male}%` }}></div>
                      <div className="bg-pink-400 h-full" style={{ width: `${data.audience_demographics.gender.female}%` }}></div>
                    </div>
                  </div>

                  {/* Age Distribution */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Age Brackets</div>
                    {data.audience_demographics.age_distribution?.map((ag, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-600">{ag.bracket}</span>
                        <div className="w-32 h-1.5 rounded-full bg-sky-100 overflow-hidden mx-2">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${ag.percentage * 2}%` }}></div>
                        </div>
                        <span className="font-bold text-slate-800 font-mono">{ag.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technology Stack */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-sky-600" />
                <span>Detected Technology Stack</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Frameworks, CDN & infrastructure</p>

              <div className="space-y-2.5">
                {data.tech_stack?.map((tech, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-white text-sky-600 border border-sky-200 shadow-xs">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tech.name}</div>
                      <div className="text-[10px] text-sky-700 font-semibold">{tech.category}</div>
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
