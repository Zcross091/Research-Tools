import React from 'react';
import { Sparkles, Download, X, ExternalLink, Smartphone, Monitor } from 'lucide-react';

export default function UpdateModal({ updateInfo, onClose }) {
  if (!updateInfo || !updateInfo.hasUpdate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-2xl shadow-sky-500/10 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">New Version Available!</h3>
              <p className="text-xs text-sky-700 font-semibold font-mono">
                v{updateInfo.currentVersion} ➔ v{updateInfo.latestVersion}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Release Notes */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-700">What's New in {updateInfo.releaseName}:</div>
          <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs text-slate-600 max-h-36 overflow-y-auto font-medium leading-relaxed">
            {updateInfo.releaseNotes}
          </div>
        </div>

        {/* Update Notice: In-Place Update */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
          ✓ <strong>Seamless In-Place Update:</strong> Signed with a persistent certificate. Installs directly over your current version without deleting data.
        </div>

        {/* Action Buttons for Android & Windows */}
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
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-between group"
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
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
}

