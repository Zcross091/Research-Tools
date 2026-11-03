import React, { useState } from 'react';
import { 
  Youtube, Search, Users, Eye, DollarSign, 
  Tag, Copy, Check, Sparkles, TrendingUp 
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
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-3">
                  <span>{data.video_count.toLocaleString()} Uploads</span>
                  <span>•</span>
                  <span>{data.country}</span>
                  <span>•</span>
                  <span>Engagement: <strong className="text-sky-600 font-bold">{data.engagement_rate}%</strong></span>
                </div>
              </div>
            </div>

            <ConfidenceBadge confidence={data.confidence} />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Subscribers"
              value={data.subscriber_count.toLocaleString()}
              subtitle={`1-Year Projection: ~${data.projected_subs_1y.toLocaleString()}`}
              icon={Users}
              highlight={true}
            />
            <MetricsCard
              title="Total Channel Views"
              value={data.total_views.toLocaleString()}
              subtitle={`~${data.avg_views_per_video.toLocaleString()} avg / video`}
              icon={Eye}
            />
            <MetricsCard
              title="Est. Monthly Earnings"
              value={`$${data.monthly_earnings_min.toLocaleString()} - $${data.monthly_earnings_max.toLocaleString()}`}
              subtitle="SocialBlade CPM benchmark"
              icon={DollarSign}
            />
            <MetricsCard
              title="Est. Yearly Earnings"
              value={`$${data.yearly_earnings_min.toLocaleString()} - $${data.yearly_earnings_max.toLocaleString()}`}
              subtitle="Annualized monetization bracket"
              icon={TrendingUp}
            />
          </div>

          {/* vidIQ Video SEO Tag Inspector */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-600" />
                  <span>vidIQ Video SEO & Competitor Tag Inspector</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Inspect hidden video tags, title keyword score, and SEO metadata
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
                vidIQ Reverse-Engineering
              </span>
            </div>

            {/* Video Input */}
            <form onSubmit={handleVideoSubmit} className="flex gap-2.5 mb-6">
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="Paste any YouTube video URL or ID (e.g. https://www.youtube.com/watch?v=...) to inspect tags..."
                className="flex-1 px-4 py-3 bg-sky-50/40 border border-sky-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:bg-white focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={tagLoading}
                className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                {tagLoading ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Inspect Tags</span>
              </button>
            </form>

            {/* Tag Results */}
            {tagAnalysis ? (
              <div className="p-5 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-200/60 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{tagAnalysis.title}</h4>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3 font-medium">
                      <span>SEO Score: <strong className="text-sky-700 font-bold">{tagAnalysis.seo_score}/100</strong></span>
                      <span>•</span>
                      <span>{tagAnalysis.tag_count} Tags Found</span>
                      <span>•</span>
                      <span>{tagAnalysis.title_word_count} Words in Title</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyAllTags(tagAnalysis.tags)}
                    className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    {copiedAll ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAll ? 'Copied All!' : 'Copy All Tags'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tagAnalysis.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-sky-700 border border-sky-200 hover:border-sky-400 transition-colors shadow-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Sample Channel Content Tags:</span>
                  <button
                    onClick={() => copyAllTags(data.sample_tags)}
                    className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
                  >
                    {copiedAll ? <Check className="w-3 h-3 text-sky-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAll ? 'Copied!' : 'Copy Tags'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.sample_tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200"
                    >
                      #{tag}
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
