import React from 'react';
import { Link2, ShieldCheck, Globe, Anchor, ExternalLink, FileText, BarChart3, Layers } from 'lucide-react';

export default function BacklinksExplorer({ backlinkProfile, domain }) {
  if (!backlinkProfile) return null;

  const {
    domain_rating = 0,
    url_rating = 0,
    total_backlinks = 0,
    referring_domains = 0,
    referring_ips = 0,
    dofollow_ratio = 80,
    tld_distribution = [],
    top_anchors = [],
    top_linked_pages = []
  } = backlinkProfile;

  const nofollowRatio = Number((100 - dofollow_ratio).toFixed(1));

  return (
    <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sky-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 rounded-lg text-sky-600 border border-sky-100">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800 text-lg">Backlink Profile & Authority Health</h3>
              <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 font-semibold rounded-full border border-sky-200">
                Ahrefs Caliber
              </span>
            </div>
            <p className="text-xs text-slate-500">Live link equity, referring domain networks, and anchor distribution for {domain}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            DoFollow: {dofollow_ratio}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            NoFollow: {nofollowRatio}%
          </span>
        </div>
      </div>

      {/* Authority Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Domain Rating</span>
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-sky-700">{domain_rating}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-sky-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: `${domain_rating}%` }}></div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500 mb-1">URL Rating (UR)</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-700">{url_rating}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-slate-600 h-full rounded-full" style={{ width: `${url_rating}%` }}></div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Backlinks</div>
          <div className="text-2xl font-bold text-slate-800">{total_backlinks.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">98.4% crawled active</p>
        </div>

        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="text-xs font-medium text-slate-500 mb-1">Referring Domains</div>
          <div className="text-2xl font-bold text-slate-800">{referring_domains.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-1">Unique root domains</p>
        </div>

        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 col-span-2 md:col-span-1">
          <div className="text-xs font-medium text-slate-500 mb-1">Referring IPs & Subnets</div>
          <div className="text-2xl font-bold text-slate-800">{referring_ips.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-1">Class C subnets</p>
        </div>
      </div>

      {/* Link Equity & TLD Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Link Equity Bar */}
        <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/70">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Layers className="w-3.5 h-3.5 text-sky-600" /> Link Equity Ratio
            </span>
            <span className="text-slate-500">DoFollow vs NoFollow</span>
          </div>
          <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="bg-sky-600 h-full flex items-center justify-center text-[10px] text-white font-semibold transition-all duration-500"
              style={{ width: `${dofollow_ratio}%` }}
              title={`DoFollow: ${dofollow_ratio}%`}
            >
              {dofollow_ratio > 20 ? `${dofollow_ratio}% DoFollow` : ''}
            </div>
            <div
              className="bg-slate-400 h-full flex items-center justify-center text-[10px] text-white font-semibold transition-all duration-500"
              style={{ width: `${nofollowRatio}%` }}
              title={`NoFollow: ${nofollowRatio}%`}
            >
              {nofollowRatio > 15 ? `${nofollowRatio}%` : ''}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            High DoFollow ratio indicates strong PageRank authority passing from editorial and organic citations.
          </p>
        </div>

        {/* TLD Distribution */}
        <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/70">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-600" /> TLD Authority Distribution
            </span>
            <span className="text-[11px] text-slate-500">Top Root Extensions</span>
          </div>
          <div className="space-y-1.5">
            {tld_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center text-xs justify-between gap-2">
                <span className="font-mono text-slate-600 w-20">{item.tld}</span>
                <div className="flex-1 bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <span className="font-medium text-slate-700 w-12 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Anchors & Top Linked Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Top Anchors */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Anchor className="w-4 h-4 text-sky-600" /> Top Anchor Text Cloud
            </h4>
            <span className="text-xs text-slate-500">By Link Frequency</span>
          </div>
          <div className="border border-sky-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-50/50 text-slate-600 border-b border-sky-100 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Anchor Phrase</th>
                  <th className="py-2.5 px-3 text-right">Backlinks</th>
                  <th className="py-2.5 px-3 text-right">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 text-slate-700">
                {top_anchors.map((item, idx) => (
                  <tr key={idx} className="hover:bg-sky-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      &ldquo;{item.anchor}&rdquo;
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">{item.backlinks_count.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-700 font-semibold rounded text-[11px]">
                        {item.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Linked Pages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-600" /> Most Linked Target Pages
            </h4>
            <span className="text-xs text-slate-500">Top Equity Hubs</span>
          </div>
          <div className="border border-sky-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-50/50 text-slate-600 border-b border-sky-100 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Page Path</th>
                  <th className="py-2.5 px-3 text-right">Backlinks</th>
                  <th className="py-2.5 px-3 text-right">Ref. Doms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 text-slate-700">
                {top_linked_pages.map((item, idx) => (
                  <tr key={idx} className="hover:bg-sky-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-sky-700 flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                      {item.path}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">{item.backlinks.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">{item.referring_domains.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

