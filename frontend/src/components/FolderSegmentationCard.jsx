import React from 'react';
import { FolderGit2, Layers, ExternalLink, ArrowRight } from 'lucide-react';

export default function FolderSegmentationCard({ folderData, domain, onSelectSubpath }) {
  if (!folderData) return null;

  const {
    has_subpath = false,
    active_path = null,
    folder_traffic_share = 100,
    folder_visits = 0,
    top_subpaths = []
  } = folderData;

  const rootDomain = domain.split('/')[0];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Folder & Directory Segmentation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sub-path traffic breakdown and direct breadcrumb drilldown</p>
          </div>
        </div>
        {has_subpath ? (
          <button
            onClick={() => onSelectSubpath && onSelectSubpath(rootDomain)}
            className="px-3 py-1 bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono font-bold rounded-full text-xs border border-sky-200 dark:border-sky-800 hover:bg-sky-200 transition-colors flex items-center gap-1"
          >
            <span>Directory: {active_path} ({folder_traffic_share}% Share)</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 underline font-sans ml-1">Reset to Root</span>
          </button>
        ) : (
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium rounded-full text-xs">
            Root Domain View
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {top_subpaths.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSubpath && onSelectSubpath(`${rootDomain}${sp.path}`)}
            className="p-3.5 rounded-2xl bg-sky-50/40 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 text-left transition-all group space-y-1.5 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sky-800 dark:text-sky-300 text-xs flex items-center gap-1 group-hover:text-sky-600">
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                {sp.path}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-slate-700">
                {sp.traffic_share}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono flex items-center justify-between">
              <span>{sp.monthly_visits.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">visits/mo</span></span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{sp.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
