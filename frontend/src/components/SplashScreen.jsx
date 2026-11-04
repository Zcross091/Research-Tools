import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import OmniLogo from './OmniLogo';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing OmniResearch Suite...');

  useEffect(() => {
    const DURATION_MS = 3000; // Smooth 3-second initialization
    const INTERVAL_MS = 30;
    const increment = 100 / (DURATION_MS / INTERVAL_MS);

    // Animate progress bar smoothly
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;

        if (next >= 25 && next < 65) {
          setStatusMessage('Calibrating real-time intelligence feeds...');
        } else if (next >= 65 && next < 90) {
          setStatusMessage('Validating local database cache...');
        } else if (next >= 90) {
          setStatusMessage('Ready! Loading dashboard...');
        }

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onFinish) {
              onFinish();
            }
          }, 150);
          return 100;
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [onFinish]);


  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f7ff] dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-6 select-none">
      {/* Central Branded Card */}
      <div className="w-full max-w-sm p-8 rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-6">
        
        {/* Animated App Icon */}
        <div className="relative">
          <OmniLogo className="w-20 h-20 animate-bounce duration-1000" />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-1">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Omni<span className="text-sky-600 dark:text-sky-400">Research</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Unified Market, Competitor & SEO Suite
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              Enterprise Edition
            </span>
          </div>
        </div>

        {/* 3-Second Animated Progress Bar */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full h-2.5 rounded-full bg-sky-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-sky-200/50 dark:border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-75 ease-out shadow-xs"
              style={{ width: `${Math.min(100, progress)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-0.5">
            <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
              {statusMessage}
            </span>
            <span className="font-mono text-slate-400">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Helper Badge */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pt-2">
          Enterprise Intelligence Engine Active
        </div>
      </div>
    </div>
  );
}
