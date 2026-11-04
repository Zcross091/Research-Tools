import React from 'react';
import {
  Globe, TrendingUp, Youtube, Users, GitCompare, Download,
  ShieldCheck, Database, Settings, Sun, Moon, Laptop
} from 'lucide-react';
import OmniLogo from './OmniLogo';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenExport,
  onOpenConnectors,
  onOpenSettings,
  isDarkMode,
  onToggleDarkMode
}) {
  const tabs = [
    { id: 'traffic', label: 'Website Intelligence', icon: Globe },
    { id: 'keywords', label: 'Keywords & Trends', icon: TrendingUp },
    { id: 'social', label: 'Creator & Video SEO', icon: Youtube },
    { id: 'audience', label: 'Audience & Brand', icon: Users },
    { id: 'audit', label: 'Site Audit', icon: ShieldCheck },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'downloads', label: 'Download App', icon: Laptop },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => setActiveTab('traffic')}>
            <OmniLogo showText={true} className="w-10 h-10" />
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-sky-100 dark:border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs border border-sky-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-sky-700 hover:bg-white/60 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              title="Toggle Light/Dark Theme"
              className="p-2 rounded-xl text-slate-500 dark:text-amber-400 hover:text-sky-700 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 border border-slate-200 dark:border-slate-700 transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenConnectors}
              title="Connect First-Party Data (GSC & GA4)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-slate-700 hover:bg-sky-100 transition-all shadow-xs"
            >
              <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden sm:inline">Connect Data</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Configure API Keys"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-300 hover:text-sky-700 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/20 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-sky-100 dark:border-slate-800 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-sky-100 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
