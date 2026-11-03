import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { fetchTraffic, fetchKeywords } from '../services/api';

export default function ComparisonView() {
  const [mode, setMode] = useState('domains'); // 'domains' | 'keywords'
  const [itemA, setItemA] = useState('stripe.com');
  const [itemB, setItemB] = useState('shopify.com');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async (e) => {
    e?.preventDefault();
    if (!itemA.trim() || !itemB.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === 'domains') {
        const [resA, resB] = await Promise.all([
          fetchTraffic(itemA.trim()),
          fetchTraffic(itemB.trim())
        ]);
        setDataA(resA);
        setDataB(resB);
      } else {
        const [resA, resB] = await Promise.all([
          fetchKeywords(itemA.trim()),
          fetchKeywords(itemB.trim())
        ]);
        setDataA(resA);
        setDataB(resB);
      }
    } catch (err) {
      setError(err.message || 'Failed to compare targets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Side-by-Side Competitive Benchmark</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-50 p-1.5 rounded-2xl border border-sky-200">
            <button
              onClick={() => { setMode('domains'); setDataA(null); setDataB(null); setItemA('stripe.com'); setItemB('shopify.com'); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'domains' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              Compare Websites
            </button>
            <button
              onClick={() => { setMode('keywords'); setDataA(null); setDataB(null); setItemA('react'); setItemB('vue'); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'keywords' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              Compare Keywords
            </button>
          </div>
        </div>

        <form onSubmit={handleCompare} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          <div className="md:col-span-2">
            <input
              type="text"
              value={itemA}
              onChange={(e) => setItemA(e.target.value)}
              placeholder={mode === 'domains' ? "Domain A (e.g. stripe.com)" : "Keyword A (e.g. react)"}
              className="w-full px-4 py-3.5 bg-sky-50/40 border border-sky-200 rounded-xl text-slate-800 text-sm font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="text-center font-bold text-sky-600 text-xs uppercase tracking-wider bg-sky-50 py-2 rounded-xl border border-sky-100">VS</div>
          <div className="md:col-span-2">
            <input
              type="text"
              value={itemB}
              onChange={(e) => setItemB(e.target.value)}
              placeholder={mode === 'domains' ? "Domain B (e.g. shopify.com)" : "Keyword B (e.g. vue)"}
              className="w-full px-4 py-3.5 bg-sky-50/40 border border-sky-200 rounded-xl text-slate-800 text-sm font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-5 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Running Analysis...' : 'Run Head-to-Head Comparison'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Results Comparison Grid */}
      {dataA && dataB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'domains' ? dataA.domain : dataA.query}
              </h4>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200">
                Target #1
              </span>
            </div>

            {mode === 'domains' ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Monthly Traffic</span>
                  <span className="font-bold text-sky-600 font-mono text-sm">{dataA.total_visits.toLocaleString()} visits</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Global Rank</span>
                  <span className="font-bold text-slate-800 font-mono">#{dataA.global_rank.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Bounce Rate</span>
                  <span className="font-bold text-slate-800">{dataA.bounce_rate}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Avg Session Duration</span>
                  <span className="font-bold text-slate-800">{dataA.avg_visit_duration}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Search Traffic Share</span>
                  <span className="font-bold text-slate-800">{dataA.sources?.search}%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Monthly Search Volume</span>
                  <span className="font-bold text-sky-600 font-mono text-sm">{dataA.search_volume.toLocaleString()} searches</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Keyword Difficulty</span>
                  <span className="font-bold text-slate-800 font-mono">KD {dataA.difficulty}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Average CPC</span>
                  <span className="font-bold text-slate-800">${dataA.cpc}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Search Intent</span>
                  <span className="font-bold text-slate-800">{dataA.intent}</span>
                </div>
              </div>
            )}
          </div>

          {/* Card B */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'domains' ? dataB.domain : dataB.query}
              </h4>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200">
                Target #2
              </span>
            </div>

            {mode === 'domains' ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Monthly Traffic</span>
                  <span className="font-bold text-sky-600 font-mono text-sm">{dataB.total_visits.toLocaleString()} visits</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Global Rank</span>
                  <span className="font-bold text-slate-800 font-mono">#{dataB.global_rank.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Bounce Rate</span>
                  <span className="font-bold text-slate-800">{dataB.bounce_rate}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Avg Session Duration</span>
                  <span className="font-bold text-slate-800">{dataB.avg_visit_duration}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Search Traffic Share</span>
                  <span className="font-bold text-slate-800">{dataB.sources?.search}%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Monthly Search Volume</span>
                  <span className="font-bold text-sky-600 font-mono text-sm">{dataB.search_volume.toLocaleString()} searches</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Keyword Difficulty</span>
                  <span className="font-bold text-slate-800 font-mono">KD {dataB.difficulty}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-500 font-medium">Average CPC</span>
                  <span className="font-bold text-slate-800">${dataB.cpc}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Search Intent</span>
                  <span className="font-bold text-slate-800">{dataB.intent}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
