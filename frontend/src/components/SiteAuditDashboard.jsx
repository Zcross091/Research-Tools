import React, { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, AlertCircle, Info, Search,
  RefreshCw, CheckCircle2, Globe, FileText, ExternalLink, Filter, Layers
} from 'lucide-react';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import { generateExecutiveSummaryClient } from '../services/clientEngine';

export default function SiteAuditDashboard({ auditData, loading, onRunAudit }) {
  const [inputDomain, setInputDomain] = useState('stripe.com');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputDomain.trim()) {
      onRunAudit(inputDomain.trim());
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-sky-100 shadow-sm text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-sky-50 text-sky-600 animate-spin">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Crawling & Auditing Site Architecture...</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Inspecting canonical tags, HTTP status codes, meta tags, H1 headings, image ALT attributes, and sitemap.xml structure.
        </p>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-sky-100 shadow-sm text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Automated Technical SEO Site Audit</h2>
          <p className="text-xs text-slate-500 mt-2">
            Run an asynchronous BFS web crawl with sitemap.xml auto-discovery to discover broken links, missing meta tags, canonical errors, and HTTP status codes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={inputDomain}
            onChange={(e) => setInputDomain(e.target.value)}
            placeholder="Enter website domain (e.g. stripe.com)"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Run Audit</span>
          </button>
        </form>
      </div>
    );
  }

  const {
    domain,
    health_score = 0,
    health_grade = 'N/A',
    total_pages_crawled = 0,
    status_summary = {},
    issue_counts = { errors: 0, warnings: 0, notices: 0 },
    crawled_pages = [],
    top_issues = [],
    scan_timestamp
  } = auditData;

  const filteredPages = crawled_pages.filter(page => {
    const matchesSearch = page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (page.page_title && page.page_title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterCategory === 'all') return matchesSearch;
    if (filterCategory === 'errors') return matchesSearch && page.issues.some(i => i.issue_type === 'Error');
    if (filterCategory === 'warnings') return matchesSearch && page.issues.some(i => i.issue_type === 'Warning');
    if (filterCategory === 'notices') return matchesSearch && page.issues.some(i => i.issue_type === 'Notice');
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Site Audit Report: {domain}</h2>
            <span className="px-2.5 py-0.5 bg-sky-100 text-sky-700 font-bold rounded-full text-xs border border-sky-200">
              Grade {health_grade}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Last scanned {scan_timestamp ? new Date(scan_timestamp).toLocaleTimeString() : 'Just now'} • {total_pages_crawled} pages indexed
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={inputDomain}
            onChange={(e) => setInputDomain(e.target.value)}
            placeholder="Audit another domain..."
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-56 font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-scan</span>
          </button>
        </form>
      </div>

      {/* AI Executive Insights Brief */}
      <ExecutiveSummaryCard
        moduleType="audit"
        bullets={generateExecutiveSummaryClient('audit', auditData)}
      />

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Score Card */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">SEO Health Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-sky-700">{health_score}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Grade {health_grade} Architecture</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-sky-50 border-4 border-sky-500 flex items-center justify-center text-sky-700 font-extrabold text-lg">
            {health_score}
          </div>
        </div>

        {/* Error Count */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-600 mb-1">
            <span>Critical Errors</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold text-rose-700">{issue_counts.errors || 0}</span>
          <p className="text-[11px] text-slate-500 mt-1">Broken links & HTTP 404/500s</p>
        </div>

        {/* Warning Count */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600 mb-1">
            <span>Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-700">{issue_counts.warnings || 0}</span>
          <p className="text-[11px] text-slate-500 mt-1">Missing meta titles/H1s</p>
        </div>

        {/* Notice Count */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-600 mb-1">
            <span>Notices</span>
            <Info className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-2xl font-bold text-sky-700">{issue_counts.notices || 0}</span>
          <p className="text-[11px] text-slate-500 mt-1">Missing canonicals & ALT tags</p>
        </div>
      </div>

      {/* HTTP Status Breakdown & Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-sky-50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <h3 className="font-semibold text-slate-800 text-sm">Crawled Pages & Issue Filter</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterCategory === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({crawled_pages.length})
            </button>
            <button
              onClick={() => setFilterCategory('errors')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterCategory === 'errors' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Errors ({issue_counts.errors || 0})
            </button>
            <button
              onClick={() => setFilterCategory('warnings')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterCategory === 'warnings' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Warnings ({issue_counts.warnings || 0})
            </button>
          </div>
        </div>

        {/* Filtered Pages Table */}
        <div className="border border-sky-100 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sky-50/50 text-slate-600 border-b border-sky-100 font-medium">
              <tr>
                <th className="py-2.5 px-3">Page URL</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Page Title</th>
                <th className="py-2.5 px-3 text-center">Canonical</th>
                <th className="py-2.5 px-3 text-center">Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50 text-slate-700">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No crawled pages match the current filter.
                  </td>
                </tr>
              ) : (
                filteredPages.map((page, idx) => {
                  const isOk = page.status_code === 200;
                  const hasErr = page.issues.some(i => i.issue_type === 'Error');
                  return (
                    <tr key={idx} className="hover:bg-sky-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-sky-700 font-medium flex items-center gap-1.5 max-w-xs truncate">
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{page.url}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isOk ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {page.status_code}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 max-w-xs truncate">
                        {page.page_title || <span className="text-slate-400 italic">No Title</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {page.canonical_url ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {page.issues.length > 0 ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            hasErr ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {page.issues.length} {page.issues.length === 1 ? 'issue' : 'issues'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">Clean</span>
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
    </div>
  );
}
