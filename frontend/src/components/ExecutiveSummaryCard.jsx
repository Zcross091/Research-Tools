import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function ExecutiveSummaryCard({ moduleType, bullets = [] }) {
  if (!bullets || bullets.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-sky-200/80 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            AI Executive Insights Brief
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800">
          Synthesized Brief
        </span>
      </div>

      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        {bullets.map((bullet, idx) => {
          // Parse bold titles if present
          const parts = bullet.split('**');
          return (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                {parts.length >= 3 ? (
                  <>
                    <strong className="text-slate-900 dark:text-white font-bold">{parts[1]}: </strong>
                    <span>{parts[2]}</span>
                  </>
                ) : (
                  <span>{bullet}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
