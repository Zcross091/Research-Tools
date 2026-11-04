import React, { useState } from 'react';
import { 
  Users, Search, Smile, Frown, Meh, MessageSquare, 
  Share2, Radio, ExternalLink, Globe, Podcast, 
  Video, Newspaper, Award, Hash, AlertCircle, ThumbsUp, Flame
} from 'lucide-react';
import MetricsCard from './MetricsCard';
import ConfidenceBadge from './ConfidenceBadge';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import { generateExecutiveSummaryClient } from '../services/clientEngine';

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
          {/* Header Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-slate-900 capitalize tracking-tight">&ldquo;{data.query}&rdquo; Audience Graph</h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  ~{(data.audience_size_estimate || 500000).toLocaleString()} Active Target Audience
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">SparkToro & BuzzSumo Demographic and Media Graph</p>
            </div>

            <ConfidenceBadge confidence={data.confidence} />
          </div>

          {/* AI Executive Insights Brief */}
          <ExecutiveSummaryCard
            moduleType="audience"
            bullets={generateExecutiveSummaryClient('audience', data)}
          />

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Est. Target Audience"
              value={(data.audience_size_estimate || 500000).toLocaleString()}
              subtitle="Active Market Scale"
              icon={Users}
            />
            <MetricsCard
              title="Positive Sentiment"
              value={`${data.sentiment?.positive || 65}%`}
              subtitle="Audience Brand Approval"
              icon={Smile}
            />
            <MetricsCard
              title="Neutral Sentiment"
              value={`${data.sentiment?.neutral || 25}%`}
              subtitle="Information Queries"
              icon={Meh}
            />
            <MetricsCard
              title="Negative Sentiment"
              value={`${data.sentiment?.negative || 10}%`}
              subtitle="Friction & Pain Points"
              icon={Frown}
            />
          </div>

          {/* Platform Affinity & Reddit Communities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Platform Affinity */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Platform Affinity Scores</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Where this audience spends time online</p>
              </div>

              <div className="space-y-3">
                {(data.platforms || []).map((p, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100/80 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>{p.platform}</span>
                      <span className="text-sky-700 font-mono font-extrabold">{p.affinity_score}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-600 h-full rounded-full" style={{ width: `${p.affinity_score}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-500">{p.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reddit Hubs */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <span>Live Reddit Communities</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Key discussion forums and subscriber counts</p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(data.top_communities || []).map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-2xl bg-sky-50/40 border border-sky-100/80">
                    <div>
                      <a href={c.url} target="_blank" rel="noreferrer" className="font-bold text-sky-700 hover:underline flex items-center gap-1">
                        <span>{c.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.relevance}</p>
                    </div>
                    <div className="text-right font-mono shrink-0 font-semibold text-slate-800">
                      <div>{(c.subscribers || 10000).toLocaleString()} subs</div>
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
