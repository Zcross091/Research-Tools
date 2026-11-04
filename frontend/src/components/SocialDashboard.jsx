import React, { useState } from 'react';
import { 
  Youtube, Search, Users, Eye, DollarSign, 
  Tag, Copy, Check, Sparkles, TrendingUp, Calendar,
  ShieldCheck, Share2, Video, Award, Clock
} from 'lucide-react';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import { generateExecutiveSummaryClient } from '../services/clientEngine';

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

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold">Verified Creators:</span>
          {['mrbeast', 'mkbhd', 'veritasium', 'fireship'].map((ch) => (
            <button
              key={ch}
              onClick={() => { setChannelInput(ch); onSearch(ch); }}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-sky-200 transition-all shadow-xs hover:border-sky-300 font-mono"
            >
              @{ch}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Channel Header */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={data.avatar_url}
                alt={data.title}
                className="w-16 h-16 rounded-2xl bg-sky-50 p-1 border border-sky-100 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{data.title}</h2>
                  <span className="text-xs font-mono font-bold text-slate-500">{data.handle}</span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Grade {data.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">SocialBlade & vidIQ Creator Intelligence</p>
              </div>
            </div>

            <ConfidenceBadge confidence={data.confidence} />
          </div>

          {/* AI Executive Insights Brief */}
          <ExecutiveSummaryCard
            moduleType="social"
            bullets={generateExecutiveSummaryClient('social', data)}
          />

          {/* Metric Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Subscribers"
              value={data.subscriber_count.toLocaleString()}
              subtitle="Active Channel Subs"
              icon={Users}
            />
            <MetricsCard
              title="Total Lifetime Views"
              value={data.total_views.toLocaleString()}
              subtitle={`${data.video_count} Published Videos`}
              icon={Eye}
            />
            <MetricsCard
              title="Est. Monthly Earnings"
              value={`$${data.monthly_earnings_min.toLocaleString()} - $${data.monthly_earnings_max.toLocaleString()}`}
              subtitle="AdSense Revenue Range"
              icon={DollarSign}
            />
            <MetricsCard
              title="Engagement Rate"
              value={`${data.engagement_rate}%`}
              subtitle="Audience Retention Score"
              icon={Award}
            />
          </div>

          {/* Video SEO Tag Extractor Bar */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-600" />
                <span>Live Video SEO Tag Scraper</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Extract hidden public YouTube tags from any video link</p>
            </div>

            <form onSubmit={handleVideoSubmit} className="flex gap-2">
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="Paste YouTube Video URL or Video ID e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ..."
                className="flex-1 px-4 py-2.5 text-xs bg-sky-50/40 border border-sky-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 font-medium"
              />
              <button
                type="submit"
                disabled={tagLoading}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                {tagLoading ? <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Tag className="w-3.5 h-3.5" />}
                <span>Inspect Tags</span>
              </button>
            </form>

            {tagAnalysis && (
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{tagAnalysis.title}</span>
                  <button
                    onClick={() => copyAllTags(tagAnalysis.tags)}
                    className="px-3 py-1 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    {copiedAll ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAll ? 'Copied All!' : 'Copy All Tags'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(tagAnalysis.tags || []).map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white text-slate-700 rounded-lg border border-sky-200 text-xs font-mono font-medium shadow-2xs">
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
