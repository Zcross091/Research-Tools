import React, { useState } from 'react';
import { 
  Youtube, Search, Users, Eye, DollarSign, 
  Tag, Copy, Check, Sparkles, TrendingUp, Calendar,
  ShieldCheck, Share2, Video, Award, Clock
} from 'lucide-react';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';

export default function SocialDashboard({ data, loading, onSearch, onInspectTags, tagAnalysis, tagLoading }) {
  const [channelInput, setChannelInput] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const handleChannelSubmit = (e) => {
    e.preventDefault();
    if (channelInput.trim()) {
      onSearch(channelInput.trim());
    }
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    if (videoInput.trim()) {
      onInspectTags(videoInput.trim());
    }
  };

  const copyAllTags = (tags) => {
    if (!tags || tags.length === 0) return;
    navigator.clipboard.writeText(tags.join(', '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Header for Channel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-500/5">
        <form onSubmit={handleChannelSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
            <input
              type="text"
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              placeholder="Enter YouTube channel name or handle e.g. @MrBeast, mkbhd, fireship..."
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
            <span>Analyze Creator</span>
          </button>
        </form>

        {/* Quick Creator Chips */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold">Popular Creators:</span>
          {['@MrBeast', 'mkbhd', 'veritasium', 'fireship'].map((ch) => (
            <button
              key={ch}
              onClick={() => { setChannelInput(ch); onSearch(ch); }}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-sky-200 transition-all font-mono shadow-xs hover:border-sky-300"
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Channel Header Profile */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={data.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.handle}`}
                alt={data.title}
                className="w-16 h-16 rounded-2xl bg-white border border-sky-100 shadow-sm p-1"
              />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{data.title}</h2>
                  <span className="text-sm font-mono text-slate-500 font-bold">{data.handle}</span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 font-mono">
                    Grade {data.grade}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{data.engagement_rate}% Engagement</span>
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-3">
                  <span>{data.video_count.toLocaleString()} Uploads</span>
                  <span>•</span>
                  <span>{data.country}</span>
                  <span>•</span>
                  <span className="text-sky-700 font-bold">~{data.avg_views_per_video.toLocaleString()} Avg Views / Video</span>
                </div>
              </div>
            </div>

            <ConfidenceBadge confidence={data.confidence} />
          </div>

          {/* 4 Core Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Subscribers"
              value={data.subscriber_count.toLocaleString()}
              subtitle="Audience reach"
              trend={`+${Math.round(data.subscriber_count * 0.0035).toLocaleString()} this month`}
              icon={Users}
              highlight={true}
            />
            <MetricsCard
              title="Lifetime Channel Views"
              value={data.total_views.toLocaleString()}
              subtitle="Global video impressions"
              icon={Eye}
            />
            <MetricsCard
              title="Est. Monthly Earnings"
              value={`$${data.monthly_earnings_min.toLocaleString()} - $${data.monthly_earnings_max.toLocaleString()}`}
              subtitle="Calculated at $1.20 - $4.50 CPM"
              icon={DollarSign}
            />
            <MetricsCard
              title="Est. Yearly Earnings"
              value={`$${data.yearly_earnings_min.toLocaleString()} - $${data.yearly_earnings_max.toLocaleString()}`}
              subtitle="Projected annualized ad revenue"
              icon={Award}
            />
          </div>

          {/* 14-Day Daily Growth History Log (SocialBlade Caliber) */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>14-Day Daily Historical Growth Log</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Daily subscriber and view delta with estimated earnings</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-sky-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Subs Gained</th>
                    <th className="py-2.5 px-3 text-right">Total Subscribers</th>
                    <th className="py-2.5 px-3 text-right">Views Gained</th>
                    <th className="py-2.5 px-3 text-right">Total Views</th>
                    <th className="py-2.5 px-3 text-right">Est. Daily Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {(data.daily_growth_history || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-700 font-bold">{row.date}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+{row.subs_gained.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-800">{row.total_subs.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-600">+{row.views_gained.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-800">{row.total_views.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${row.est_earnings_min} - ${row.est_earnings_max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Future Milestone Projections Table */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>Future Milestone Projections (Trajectory Modeling)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Projected channel milestone targets based on current 30-day velocity</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(data.milestone_projections || []).map((ms, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-center space-y-1">
                  <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">{ms.timeframe}</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono">{(ms.projected_subs / 1e6 >= 1 ? `${(ms.projected_subs / 1e6).toFixed(1)}M` : `${Math.round(ms.projected_subs / 1e3)}k`)}</div>
                  <div className="text-[10px] text-slate-500">{(ms.projected_views / 1e9 >= 1 ? `${(ms.projected_views / 1e9).toFixed(1)}B` : `${(ms.projected_views / 1e6).toFixed(0)}M`)} Views</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 6 Popular & Trending Videos Table */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Video className="w-4 h-4 text-rose-600" />
              <span>Top Performing & Viral Uploads</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Highest engagement videos with views-per-hour velocity</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-sky-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Video Title</th>
                    <th className="py-2.5 px-3 text-right">Published</th>
                    <th className="py-2.5 px-3 text-right">Views</th>
                    <th className="py-2.5 px-3 text-right">Likes</th>
                    <th className="py-2.5 px-3 text-right">Est. Revenue</th>
                    <th className="py-2.5 px-3 text-right">Velocity (VPH)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {(data.top_videos || []).map((vid, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="line-clamp-1">{vid.title}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">{vid.published_date}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{vid.views.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">{vid.likes.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">${vid.est_revenue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 font-mono text-[11px]">
                          {vid.vph} VPH
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Footprint & vidIQ SEO Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Platform Social Footprint */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-sky-600" />
                <span>Cross-Platform Social Footprint</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Audience presence across major creator ecosystems</p>

              <div className="space-y-3">
                {(data.social_footprint || []).map((sp, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-sky-200 flex items-center justify-center font-bold text-sky-700 text-xs shadow-xs">
                        {sp.platform.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{sp.platform}</span>
                          {sp.verified && <Check className="w-3.5 h-3.5 text-sky-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{sp.handle}</div>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 font-mono text-xs">
                      {sp.followers.toLocaleString()} followers
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Depth vidIQ SEO Audit Checklist */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>vidIQ Algorithm SEO Checklist</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Optimization audit for maximum algorithmic reach</p>

              <div className="space-y-2.5">
                {(data.seo_checklist || []).map((chk, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-start gap-3">
                    <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{chk.item}</span>
                        <span className="font-mono text-emerald-700 font-bold">{chk.score}/100</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{chk.tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audience Cross-Channel Overlap & Optimal Upload Timing (vidIQ Boost Caliber) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audience Overlap */}
            {data.audience_overlap && data.audience_overlap.length > 0 && (
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-600" />
                      <span>Audience Overlap Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Other channels this creator&apos;s viewers also watch</p>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 bg-sky-100 text-sky-700 font-bold rounded-full border border-sky-200">
                    vidIQ Pro
                  </span>
                </div>

                <div className="space-y-3">
                  {data.audience_overlap.map((ov, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 text-xs">{ov.title}</span>
                          <span className="text-slate-400 font-mono text-[11px] ml-1.5">{ov.handle}</span>
                        </div>
                        <span className="text-xs font-bold font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded-lg border border-sky-200">
                          {ov.overlap_score}% Shared
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-sky-100 overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: `${ov.overlap_score}%` }}></div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ov.shared_topics?.map((topic, tidx) => (
                          <span key={tidx} className="text-[10px] px-2 py-0.5 bg-white border border-sky-200 text-slate-600 rounded-md font-medium">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimal Upload Timing */}
            {data.upload_schedule && (
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-600" />
                        <span>Optimal Upload Timing Schedule</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Peak algorithmic velocity windows for maximum initial CTR</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
                      Peak Velocity
                    </span>
                  </div>

                  <div className="space-y-3 pt-3">
                    <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">Best Days to Publish:</span>
                      <span className="font-bold text-sky-800 text-xs font-mono">{data.upload_schedule.best_day}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">Optimal Time Window:</span>
                      <span className="font-bold text-slate-900 text-xs font-mono">{data.upload_schedule.best_time}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">Peak Velocity Window:</span>
                      <span className="font-bold text-emerald-700 text-xs font-mono">{data.upload_schedule.peak_velocity_window}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">Publishing Consistency:</span>
                      <span className="font-bold text-sky-700 text-xs font-mono">{data.upload_schedule.consistency_score}% High Grade</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-[11px] text-sky-800">
                  Publishing during this optimal window ensures subscriber push notifications land when audience session density is at its highest.
                </div>
              </div>
            )}
          </div>

          {/* vidIQ Competitor Video Tag Inspector */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="max-w-2xl mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-600" />
                <span>vidIQ Video Tag Inspector</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter any specific YouTube video link to extract hidden ranking tags & SEO scores
              </p>
            </div>

            <form onSubmit={handleVideoSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="Paste video URL e.g. https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 bg-sky-50/40 border border-sky-200/80 rounded-2xl text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={tagLoading}
                className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {tagLoading ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Inspect Video SEO</span>
              </button>
            </form>

            {/* Display Inspect Results or Channel Sample Tags */}
            {tagAnalysis ? (
              <div className="p-6 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{tagAnalysis.title}</h4>
                    <div className="text-xs text-slate-500 font-medium">Video SEO Score: <strong className="text-emerald-700">{tagAnalysis.seo_score}/100</strong> • {tagAnalysis.tag_count} Tags Found</div>
                  </div>
                  <button
                    onClick={() => copyAllTags(tagAnalysis.tags)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-xs font-bold text-sky-700 hover:bg-sky-50 transition-all shadow-xs"
                  >
                    {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAll ? 'Copied All!' : 'Copy All Tags'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {tagAnalysis.tags.map((t, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-slate-800 border border-sky-200 text-xs font-medium font-mono shadow-xs"
                    >
                      <span>#{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Channel Ranked Target Keywords:</span>
                  <button
                    onClick={() => copyAllTags(data.sample_tags)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-colors"
                  >
                    {copiedAll ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAll ? 'Copied!' : 'Copy Channel Tags'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.sample_tags?.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-sky-50/70 border border-sky-200 text-sky-800 text-xs font-mono font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
