import React, { useState } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

const STATECRAFT_URL = 'https://statecraft-ebon.vercel.app/';

export default function StateCraftBadge() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    // Cross-platform external browser handler (Web, Android APK, Windows EXE)
    // 1. If running inside Capacitor Android app:
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
      e.preventDefault();
      window.open(STATECRAFT_URL, '_system');
      return;
    }

    // 2. If running inside Electron desktop app:
    // Electron's setWindowOpenHandler intercepts window.open and delegates to shell.openExternal
    // 3. If running in a standard mobile/desktop web browser: standard _blank handles it
  };

  return (
    <aside 
      aria-label="Creator attribution"
      className="fixed bottom-3 right-4 z-30 pointer-events-auto select-none"
    >
      <a
        href={STATECRAFT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Visit StateCraft — Developer (opens in browser)"
        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-sky-200/90 hover:border-sky-400 shadow-xs hover:shadow-md hover:shadow-sky-500/15 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 no-underline"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        
        <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
          made by{' '}
          <strong className="font-bold text-sky-700 group-hover:text-sky-600 transition-colors tracking-tight">
            StateCraft
          </strong>
        </span>

        {isHovered ? (
          <ExternalLink className="w-3 h-3 text-sky-600 transition-all transform translate-x-0.5" />
        ) : (
          <Sparkles className="w-3 h-3 text-sky-400 opacity-70 transition-all" />
        )}
      </a>
    </aside>
  );
}
