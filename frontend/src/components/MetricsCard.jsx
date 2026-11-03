import React from 'react';

export default function MetricsCard({ title, value, subtitle, icon: Icon, badge, trend, highlight }) {
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-200 ${
      highlight 
        ? 'bg-gradient-to-br from-white via-sky-50/70 to-blue-50/50 border-sky-300 shadow-md shadow-sky-500/5' 
        : 'bg-white border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900 font-mono">{value}</div>
        {badge && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          {trend && (
            <span className={`font-bold ${trend.startsWith('+') || trend === 'Emerging' ? 'text-sky-600' : 'text-rose-500'}`}>
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
