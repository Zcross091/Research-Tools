import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import OmniLogo from './OmniLogo';

const STATECRAFT_URL = 'https://statecraft-ebon.vercel.app/';

export default function StateCraftBadge() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
      e.preventDefault();
      window.open(STATECRAFT_URL, '_system');
      return;
    }
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
        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white backdrop-blur-md border border-sky-200/90 dark:border-slate-800 hover:border-sky-400 shadow-xs hover:shadow-md hover:shadow-sky-500/15 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 no-underline"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 transition-colors">
          made by{' '}
          <strong className="font-bold text-sky-700 dark:text-sky-400 group-hover:text-sky-600 transition-colors tracking-tight">
            StateCraft
          </strong>
        </span>

        {isHovered ? (
          <ExternalLink className="w-3 h-3 text-sky-600 dark:text-sky-400 transition-all transform translate-x-0.5" />
        ) : (
          <OmniLogo className="w-3.5 h-3.5" />
        )}
      </a>
    </aside>
  );
}
