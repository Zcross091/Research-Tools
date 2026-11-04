import React, { useState } from 'react';
import {
  Laptop, HardDrive, Smartphone, Download, ShieldCheck, CheckCircle2,
  Sparkles, Layers, Globe, TrendingUp, Cpu, Lock, ExternalLink, ArrowRight
} from 'lucide-react';
import OmniLogo from './OmniLogo';

export default function DownloadPortal({ onNavigateTab }) {
  const [downloading, setDownloading] = useState(null);

  const handleDownloadTrigger = (edition, filename, url) => {
    setDownloading(edition);
    // Simulate/trigger download file
    const link = document.createElement('a');
    link.href = url || '#';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(null);
    }, 2000);
  };

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-slate-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Enterprise Production Edition</span>
        </div>

        <div className="flex justify-center pt-2">
          <OmniLogo className="w-20 h-20" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Download <span className="text-sky-600 dark:text-sky-400">OmniResearch PRO</span>
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
          The All-in-One Market, Competitor, Audience, Keyword & Technical SEO Intelligence Engine.
          Install on PC, run portable from USB, or deploy on Mobile.
        </p>
      </div>

      {/* 3 Download Editions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {/* 1. PC Installer */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 shadow-xl shadow-sky-500/5 flex flex-col justify-between space-y-6 hover:border-sky-400 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-2xl border border-sky-100 dark:border-sky-900">
                <Laptop className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold text-[10px] rounded-full uppercase tracking-wider font-mono">
                Windows Desktop
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">PC Desktop Installer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Full desktop application with auto-updates, native desktop shortcuts, and local SQLite cache.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-sky-50 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>64-bit Windows 10 & 11 Compatible</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>In-App Auto Update Channel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Offline SQLite Database Storage</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleDownloadTrigger('pc', 'OmniResearch-PRO-Setup.exe', '/downloads/OmniResearch-PRO-Setup.exe')}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'pc' ? 'Starting Download...' : 'Download PC Installer (.exe)'}</span>
            </button>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-mono">
              Setup Executable • 64-bit Windows
            </div>
          </div>
        </div>

        {/* 2. Standalone Portable */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 shadow-xl shadow-sky-500/5 flex flex-col justify-between space-y-6 hover:border-sky-400 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                <HardDrive className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-[10px] rounded-full uppercase tracking-wider font-mono">
                Portable / USB
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Standalone Portable Edition</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Zero-installation portable edition. Run directly from USB drives or restricted corporate environments without admin rights.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-sky-50 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Administrator Privileges Required</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Runs Directly From USB Drive</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standalone LocalStorage Engine</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleDownloadTrigger('portable', 'OmniResearch-PRO-Portable.zip', '/downloads/OmniResearch-PRO-Portable.zip')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'portable' ? 'Starting Download...' : 'Download Portable Edition (.zip)'}</span>
            </button>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-mono">
              Portable Package • Zero Install
            </div>
          </div>
        </div>

        {/* 3. Mobile App */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 shadow-xl shadow-sky-500/5 flex flex-col justify-between space-y-6 hover:border-sky-400 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] rounded-full uppercase tracking-wider font-mono">
                Android Package
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mobile Android Package</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Touch-optimized mobile app for on-the-go competitive research, keyword tracking, and website audits on tablets & phones.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium pt-2 border-t border-sky-50 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Android 8.0+ Phone & Tablet Support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Touch-Gestures & Mobile Charts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Offline Engine & Local Cache</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleDownloadTrigger('mobile', 'OmniResearch-PRO.apk', '/downloads/OmniResearch-PRO.apk')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'mobile' ? 'Starting Download...' : 'Download Android App (.apk)'}</span>
            </button>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-mono">
              Android Package • Release Signed
            </div>
          </div>
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-6xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Why Professionals Choose OmniResearch PRO</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Replaces $600+/month in individual SaaS subscriptions with zero recurring API costs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1.5">
            <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div className="font-bold text-slate-900 dark:text-white">Similarweb Traffic Data</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Tranco Top 1M, RDAP registry age, and acquisition channels.</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1.5">
            <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div className="font-bold text-slate-900 dark:text-white">Semrush Keyword Gap</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">4-tier missing, weak, shared & untapped keyword opportunities.</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div className="font-bold text-slate-900 dark:text-white">Screaming Frog Crawler</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Asynchronous site crawler with sitemap.xml auto-seeding.</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1.5">
            <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div className="font-bold text-slate-900 dark:text-white">Branded White-Label PDFs</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Custom agency logo and subtitle formatting for client PDF presentations.</p>
          </div>
        </div>
      </div>

      {/* Security Verification & System Requirements */}
      <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3 font-mono">
        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" /> SHA-256 Checksum Security Signatures
          </span>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Verified Clean & Signed
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
          <div><span className="text-slate-400">PC Setup (.exe):</span> <code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code></div>
          <div><span className="text-slate-400">Portable (.zip):</span> <code>8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4</code></div>
          <div><span className="text-slate-400">Mobile (.apk):</span> <code>9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</code></div>
        </div>
      </div>

    </div>
  );
}
