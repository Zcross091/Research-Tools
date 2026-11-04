import React from 'react';

export default function OmniLogo({ className = "w-10 h-10", showText = false, textClassName = "" }) {
  return (
    <div className="flex items-center gap-3 inline-flex select-none">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="omniGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="omniGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter id="omniGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit Ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="url(#omniGrad1)"
          strokeWidth="6"
          strokeDasharray="210 60"
          strokeLinecap="round"
          className="animate-spin-slow"
        />

        {/* Globe Grid Arc Lines */}
        <ellipse cx="50" cy="50" rx="38" ry="16" stroke="url(#omniGrad2)" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 4" />
        <ellipse cx="50" cy="50" rx="16" ry="38" stroke="url(#omniGrad2)" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 4" />

        {/* Inner Lens Core */}
        <circle cx="50" cy="50" r="22" fill="url(#omniGrad1)" filter="url(#omniGlow)" />

        {/* Quantum Spark Crosshair */}
        <path
          d="M50 36L50 64M36 50L64 50"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="4" fill="#ffffff" />
      </svg>

      {showText && (
        <div className={`flex flex-col leading-tight ${textClassName}`}>
          <div className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
            Omni<span className="text-sky-600 dark:text-sky-400">Research</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold">
              PRO
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Intelligence Platform
          </span>
        </div>
      )}
    </div>
  );
}
