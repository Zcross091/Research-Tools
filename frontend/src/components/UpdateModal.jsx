import React from 'react';
import { Sparkles, Download, X, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';

export default function UpdateModal({ updateInfo, onClose }) {
  if (!updateInfo) return null;

  const isUpToDate = !updateInfo.hasUpdate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xl shadow-sky-500/10 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${isUpToDate ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800' : 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950 dark:border-sky-800'}`}>
              {isUpToDate ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isUpToDate ? 'OmniResearch is Up to Date' : 'New Version Available!'}
              </h3>
              <p className="text-xs text-sky-700 dark:text-sky-400 font-semibold font-mono">
                {isUpToDate ? `Installed Version: v${updateInfo.currentVersion}` : `v${updateInfo.currentVersion} ➔ v${updateInfo.latestVersion}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isUpToDate ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 font-medium leading-relaxed">
              You are currently running the latest enterprise release (<strong>v{updateInfo.currentVersion}</strong>). No new updates are required at this time.
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-md shadow-sky-600/20"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Release Notes */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">What's New in {updateInfo.releaseName}:</div>
              <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 max-h-36 overflow-y-auto font-medium leading-relaxed">
                {updateInfo.releaseNotes}
              </div>
            </div>

            {/* Update Notice */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
              ✓ <strong>Seamless In-Place Update:</strong> Signed with a persistent certificate. Installs directly over your current version without deleting data.
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {updateInfo.apkUrl && (
                <a
                  href={updateInfo.apkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Download Android APK (Direct Update)</span>
                  </div>
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </a>
              )}

              {updateInfo.exeUrl && (
                <a
                  href={updateInfo.exeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-700 dark:hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>Download Windows Executable (.exe)</span>
                  </div>
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Remind Me Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

