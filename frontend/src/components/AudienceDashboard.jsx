import React, { useState } from 'react';
import { 
  Users, Search, Smile, Frown, Meh, MessageSquare, 
  Share2, Radio, ExternalLink, Globe, Podcast, 
  Video, Newspaper, Award, Hash, AlertCircle, ThumbsUp
} from 'lucide-react';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';

export default function AudienceDashboard({ data, loading, onSearch }) {
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onSearch(topicInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-500/5">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter audience niche or target market e.g. ecommerce, b2b saas, devops..."
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
            <span>Analyze Audience</span>
          </button>
        </form>

        {/* Quick Chips */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold">Niche Presets:</span>
          {['b2b saas', 'ecommerce founders', 'cybersecurity', 'fitness tech', 'ai agents'].map((topic) => (
            <button
              key={topic}
              onClick={() => { setTopicInput(topic); onSearch(topic); }}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-sky-200 transition-all font-mono shadow-xs hover:border-sky-300"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Header Profile */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                  Audience Intelligence: &ldquo;{data.query}&rdquo;
                </h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  SparkToro & Brandwatch Suite
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Est. Reach: {(data.audience_size_estimate || 500000).toLocaleString()} users
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Media consumption, community gathering hubs, demographic income brackets, and Brandwatch sentiment
              </p>
            </div>

            <ConfidenceBadge confidence={data.confidence} />
          </div>

          {/* Sentiment Section (Brandwatch) */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smile className="w-4 h-4 text-sky-600" />
                  <span>Discussion Sentiment & Perception</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Tone and sentiment extracted across discussion streams</p>
              </div>
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
                NLP Sentiment Analysis
              </span>
            </div>

            {/* Sentiment Bar */}
            <div className="space-y-3">
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${data.sentiment.positive}%` }}
                  title={`Positive: ${data.sentiment.positive}%`}
                ></div>
                <div 
                  className="bg-slate-400 h-full transition-all duration-500" 
                  style={{ width: `${data.sentiment.neutral}%` }}
                  title={`Neutral: ${data.sentiment.neutral}%`}
                ></div>
                <div 
                  className="bg-rose-500 h-full transition-all duration-500" 
                  style={{ width: `${data.sentiment.negative}%` }}
                  title={`Negative: ${data.sentiment.negative}%`}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Smile className="w-4 h-4" />
                  <span>{data.sentiment.positive}% Positive</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Meh className="w-4 h-4" />
                  <span>{data.sentiment.neutral}% Neutral</span>
                </span>
                <span className="flex items-center gap-1.5 text-rose-700">
                  <Frown className="w-4 h-4" />
                  <span>{data.sentiment.negative}% Negative</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100 italic leading-relaxed">
                "{data.sentiment.summary}"
              </p>
            </div>
          </div>

          {/* Media Consumption Grid (SparkToro Caliber: Websites, Podcasts, YouTube, Press) */}
          {data.media_consumption && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Websites */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Top Websites Read</span>
                </div>
                <div className="space-y-2.5">
                  {data.media_consumption.top_websites?.map((site, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-sky-50/40 border border-sky-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{site.name}</div>
                        <div className="text-[10px] text-slate-500">{site.category}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px] font-mono">
                        {site.affinity_score}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Podcasts */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Podcast className="w-4 h-4 text-purple-600" />
                  <span>Top Podcasts</span>
                </div>
                <div className="space-y-2.5">
                  {data.media_consumption.top_podcasts?.map((pod, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-purple-50/30 border border-purple-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{pod.name}</div>
                        <div className="text-[10px] text-slate-500">{pod.category}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] font-mono">
                        {pod.affinity_score}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Channels */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>YouTube Channels</span>
                </div>
                <div className="space-y-2.5">
                  {data.media_consumption.top_youtube_channels?.map((yt, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-rose-50/30 border border-rose-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{yt.name}</div>
                        <div className="text-[10px] text-slate-500">{yt.reach}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] font-mono">
                        {yt.affinity_score}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publications */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Newspaper className="w-4 h-4 text-indigo-600" />
                  <span>Press & Publications</span>
                </div>
                <div className="space-y-2.5">
                  {data.media_consumption.top_publications?.map((pub, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-indigo-50/30 border border-indigo-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{pub.name}</div>
                        <div className="text-[10px] text-slate-500">{pub.category}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] font-mono">
                        {pub.affinity_score}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Customer Pain Points & Discussion Wishlist Themes */}
          {data.pain_points && data.pain_points.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>Customer Pain Points & Conversation Drivers</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Core friction points and unaddressed needs extracted from community discourse</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.pain_points.map((pp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white text-sky-600 border border-sky-200 shadow-xs mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{pp.theme}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          {pp.frequency} Mentions
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{pp.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Household Income Profile */}
          {data.extended_demographics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education Level */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>Audience Education Level</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Highest achieved degrees</p>

                <div className="space-y-3">
                  {data.extended_demographics.education_levels?.map((ed, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{ed.level}</span>
                        <span className="font-mono text-sky-700 font-bold">{ed.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-sky-100 overflow-hidden">
                        <div className="h-full bg-sky-600 rounded-full" style={{ width: `${ed.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Household Income */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Estimated Household Income</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Annual purchasing power breakdown</p>

                <div className="space-y-3">
                  {data.extended_demographics.household_income?.map((inc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{inc.bracket}</span>
                        <span className="font-mono text-indigo-700 font-bold">{inc.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-indigo-100 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${inc.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reddit Communities & Platform Affinity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real Reddit Communities */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-orange-500" />
                <span>Primary Community Gathering Hubs</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Live subreddits and forums where this target market meets</p>

              <div className="space-y-3">
                {data.top_communities?.map((sub, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="text-orange-600 font-mono">{sub.name}</span>
                        {sub.url && (
                          <a href={sub.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-600">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium line-clamp-1">{sub.relevance}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800 font-mono text-xs">{sub.subscribers.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">members</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Affinity Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-sky-600" />
                <span>Cross-Platform Affinity Index</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Relative likelihood of engagement compared to average web users</p>

              <div className="space-y-3.5">
                {data.platforms?.map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{p.platform}</span>
                      <span className="font-mono text-sky-700 font-bold">{p.affinity_score}% Affinity</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-sky-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" style={{ width: `${p.affinity_score}%` }}></div>
                    </div>
                    <div className="text-[10px] text-slate-400">{p.details}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Community Hashtags */}
          {data.top_hashtags && data.top_hashtags.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Hash className="w-4 h-4 text-sky-600" />
                <span>Top Community Hashtags & Engagement Velocity</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Highest resonance tags used across Twitter/X and LinkedIn conversations</p>

              <div className="flex flex-wrap gap-2.5">
                {data.top_hashtags.map((ht, idx) => (
                  <div key={idx} className="px-3.5 py-1.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center gap-2">
                    <span className="font-bold text-sky-800 text-xs font-mono">{ht.tag}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({ht.frequency.toLocaleString()})</span>
                    <span className="px-1.5 py-0.2 rounded bg-white text-emerald-700 text-[10px] font-bold font-mono border border-emerald-200">
                      {ht.engagement_score}% score
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
