import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function StateCraftBadge() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      aria-label="Creator attribution"
      className="fixed bottom-3 right-4 z-30 pointer-events-auto select-none"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-sky-200/80 hover:border-sky-400 shadow-xs hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300 ease-out cursor-default hover:-translate-y-0.5"
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

        <Sparkles className={`w-3 h-3 text-sky-500 transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12 text-sky-600' : 'opacity-60'}`} />
      </div>
    </aside>
  );
}
