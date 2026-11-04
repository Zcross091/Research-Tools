import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, FileText, Database, ShieldCheck, RefreshCw } from 'lucide-react';
import { uploadGscCsv, uploadGa4Csv, fetchConnectorSummary } from '../services/api';
import { parseGscCsvClient, parseGa4CsvClient } from '../services/clientEngine';

export default function ConnectorsModal({ isOpen, onClose, currentDomain = 'stripe.com' }) {
  const [domainInput, setDomainInput] = useState(currentDomain);
  const [summary, setSummary] = useState(null);
  const [uploadingGsc, setUploadingGsc] = useState(false);
  const [uploadingGa4, setUploadingGa4] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadSummary(domainInput);
    }
  }, [isOpen, domainInput]);

  const loadSummary = async (dom) => {
    try {
      const res = await fetchConnectorSummary(dom);
      setSummary(res);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleGscFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingGsc(true);
    setMessage(null);
    try {
      // 1. Try API upload
      const res = await uploadGscCsv(domainInput, file);
      if (res && res.status === 'success') {
        setMessage(res.message || 'Successfully connected Google Search Console CSV.');
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      // 2. Client-side fallback read
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseGscCsvClient(text, domainInput);
        setMessage('Connected GSC CSV (Local Persistence Active).');
        loadSummary(domainInput);
      };
      reader.readAsText(file);
    } finally {
      setUploadingGsc(false);
      loadSummary(domainInput);
    }
  };

  const handleGa4FileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingGa4(true);
    setMessage(null);
    try {
      const res = await uploadGa4Csv(domainInput, file);
      if (res && res.status === 'success') {
        setMessage(res.message || 'Successfully connected Google Analytics 4 CSV.');
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseGa4CsvClient(text, domainInput);
        setMessage('Connected GA4 CSV (Local Persistence Active).');
        loadSummary(domainInput);
      };
      reader.readAsText(file);
    } finally {
      setUploadingGa4(false);
      loadSummary(domainInput);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-2xl max-w-xl w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Connect First-Party Data (GSC & GA4)</h3>
              <p className="text-xs text-slate-500">Upload export CSVs to ground competitive metrics with 100% accurate data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Domain input selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Domain</label>
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            placeholder="e.g. stripe.com"
          />
        </div>

        {/* Upload boxes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* GSC Card */}
          <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/40 space-y-3 text-center">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Google Search Console</span>
              {summary && summary.has_gsc_connected && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-bold">Connected</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Upload GSC Performance export CSV (Queries, Clicks, Impressions, CTR, Position).
            </p>

            <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all shadow-xs w-full">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingGsc ? 'Parsing CSV...' : 'Upload GSC CSV'}</span>
              <input type="file" accept=".csv" onChange={handleGscFileChange} className="hidden" />
            </label>
          </div>

          {/* GA4 Card */}
          <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/40 space-y-3 text-center">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Google Analytics 4</span>
              {summary && summary.has_ga4_connected && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-bold">Connected</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Upload GA4 Traffic / Pages export CSV (Sessions, Active Users).
            </p>

            <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all shadow-xs w-full">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingGa4 ? 'Parsing CSV...' : 'Upload GA4 CSV'}</span>
              <input type="file" accept=".csv" onChange={handleGa4FileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Current Summary Statistics */}
        {summary && (summary.has_gsc_connected || summary.has_ga4_connected) && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active First-Party Performance Metrics
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div>GSC Clicks: <strong>{summary.gsc_total_clicks.toLocaleString()}</strong></div>
              <div>GSC Impressions: <strong>{summary.gsc_total_impressions.toLocaleString()}</strong></div>
              <div>GSC Avg CTR: <strong>{summary.gsc_avg_ctr}%</strong></div>
              <div>GA4 Monthly Sessions: <strong>{summary.ga4_monthly_sessions.toLocaleString()}</strong></div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
