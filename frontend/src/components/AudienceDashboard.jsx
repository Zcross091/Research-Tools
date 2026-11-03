import React, { useState } from 'react';
import { 
  Users, Search, Smile, Frown, Meh, MessageSquare, 
  Share2, Radio, ExternalLink 
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
                  Audience Intelligence: "{data.query}"
                </h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  SparkToro & Brandwatch Insights
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Community gathering hubs, cross-platform media consumption, and social sentiment
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
              <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden">
                <div 
                  className="bg-sky-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ width: `${data.sentiment.positive}%` }}
                  title={`Positive: ${data.sentiment.positive}%`}
                >
                  {data.sentiment.positive}%
                </div>
                <div 
                  className="bg-slate-300 h-full flex items-center justify-center text-[10px] font-bold text-slate-700"
                  style={{ width: `${data.sentiment.neutral}%` }}
                  title={`Neutral: ${data.sentiment.neutral}%`}
                >
                  {data.sentiment.neutral}%
                </div>
                <div 
                  className="bg-rose-400 h-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ width: `${data.sentiment.negative}%` }}
                  title={`Negative: ${data.sentiment.negative}%`}
                >
                  {data.sentiment.negative}%
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold pt-1">
                <span className="flex items-center gap-1.5 text-sky-600">
                  <Smile className="w-4 h-4" /> Positive ({data.sentiment.positive}%)
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Meh className="w-4 h-4" /> Neutral ({data.sentiment.neutral}%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-500">
                  <Frown className="w-4 h-4" /> Negative ({data.sentiment.negative}%)
                </span>
              </div>

              <div className="mt-3 p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs text-slate-700 leading-relaxed font-medium">
                <strong className="text-slate-900 font-bold">Executive Summary: </strong>
                {data.sentiment.summary}
              </div>
            </div>
          </div>

          {/* Dual Columns: Platform Affinity & Top Communities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Platform Affinity (SparkToro) */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-sky-600" />
                <span>Where This Audience Hangs Out</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Cross-channel platform affinity and active engagement</p>

              <div className="space-y-3.5">
                {data.platforms?.map((p) => (
                  <div key={p.platform} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800">{p.platform}</span>
                      <span className="font-mono text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{p.affinity_score}% Affinity</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-sky-100/60 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" 
                        style={{ width: `${p.affinity_score}%` }}
                      ></div>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{p.details}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discovered Reddit Communities */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>Active Community Discussion Hubs</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Real subreddits and forums populated by target buyers</p>

              <div className="space-y-2.5">
                {data.top_communities?.map((sub, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-center justify-between hover:border-sky-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-sky-700 font-mono font-bold">{sub.name}</span>
                        <a 
                          href={`https://reddit.com/${sub.name}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-sky-600"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 max-w-sm line-clamp-1 font-medium">{sub.relevance}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white text-slate-700 border border-sky-200 font-mono shadow-xs">
                        {sub.subscribers.toLocaleString()} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Demographics & Hashtags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Demographics Profile */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Audience Demographics & Roles</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Age distribution and common professional roles</p>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">Age Distribution:</div>
                <div className="grid grid-cols-4 gap-2">
                  {data.demographic_profile?.age_distribution?.map((item) => (
                    <div key={item.bracket} className="p-3 rounded-2xl bg-sky-50/50 text-center border border-sky-100">
                      <div className="text-xs font-extrabold text-slate-900 font-mono">{item.percentage}%</div>
                      <div className="text-[10px] text-slate-500 font-medium">{item.bracket} yrs</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs font-bold text-slate-700">Top Job Roles:</div>
                <div className="flex flex-wrap gap-2">
                  {data.demographic_profile?.top_job_roles?.map((role, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-sky-200 shadow-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-sky-600" />
                <span>Key Social Topics & Hashtags</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">High-velocity tags used across social commentary</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {data.key_topics?.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
