import React from 'react';
import { Globe, TrendingUp, Youtube, Users, GitCompare, Download, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenExport }) {
  const tabs = [
    { id: 'traffic', label: 'Website Intelligence', icon: Globe },
    { id: 'keywords', label: 'Keywords & Trends', icon: TrendingUp },
    { id: 'social', label: 'Creator & Video SEO', icon: Youtube },
    { id: 'audience', label: 'Audience & Brand', icon: Users },
    { id: 'compare', label: 'Competitor Compare', icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-lg text-slate-900 flex items-center gap-1.5">
                Omni<span className="text-sky-600">Research</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold">PRO</span>
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:block font-medium">All-in-One Market & Competitor Intelligence</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-2xl border border-sky-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-sm border border-sky-200/80'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-sky-100 no-scrollbar">
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
                    : 'bg-white text-slate-600 border border-sky-100'
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
