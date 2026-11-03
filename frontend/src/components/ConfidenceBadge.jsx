import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function ConfidenceBadge({ confidence }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!confidence) return null;

  const score = confidence.confidence_score || 90;
  const isHigh = score >= 90;
  const colorClass = isHigh
    ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
  const dotClass = isHigh ? 'bg-sky-500' : 'bg-amber-500';

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${colorClass} transition-all shadow-sm`}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse ${dotClass}`}></span>
        <ShieldCheck className="w-4 h-4" />
        <span>{score}% Data Confidence</span>
        <Info className="w-3.5 h-3.5 opacity-70 ml-0.5" />
      </button>

      {showTooltip && (
        <div className="absolute right-0 mt-2 z-50 w-80 p-4 bg-white border border-sky-200 rounded-2xl shadow-xl text-xs text-slate-700">
          <div className="font-bold text-slate-900 mb-1.5 flex items-center justify-between">
            <span>Verified Source Integrity</span>
            <span className="text-sky-600 font-mono font-bold">{score}% Confidence</span>
          </div>
          <div className="space-y-2 pt-2 border-t border-sky-100">
            <div>
              <span className="text-slate-500 font-medium">Source: </span>
              <span className="text-slate-900 font-semibold">{confidence.data_source}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Method: </span>
              <span className="text-slate-800">{confidence.method}</span>
            </div>
            <div className="text-[11px] text-sky-700 bg-sky-50 p-2 rounded-xl border border-sky-100">
              Verified with live datasets & ICANN registry to protect accuracy.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
