import React, { useState, useEffect } from 'react';
import { Sparkles, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { checkForAppUpdates, APP_VERSION } from '../services/updater';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing OmniResearch Suite...');
  const [updateResult, setUpdateResult] = useState(null);

  useEffect(() => {
    const DURATION_MS = 4000; // Exact 4-second loading screen
    const INTERVAL_MS = 40;
    const increment = 100 / (DURATION_MS / INTERVAL_MS);

    // 1. Simultaneously check for updates in the background
    checkForAppUpdates().then((res) => {
      setUpdateResult(res);
    });

    // 2. Animate progress bar smoothly over 4000ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;

        // Dynamic status transitions over the 4 seconds
        if (next >= 30 && next < 75) {
          setStatusMessage('Checking for new software updates...');
        } else if (next >= 75 && next < 95) {
          setStatusMessage('Connecting to real-time intelligence feeds...');
        } else if (next >= 95) {
          setStatusMessage('Ready! Loading dashboard...');
        }

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onFinish && onFinish(updateResult);
          }, 200);
          return 100;
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [onFinish, updateResult]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f7ff] text-slate-800 p-6 select-none">
      {/* Central Branded Card */}
      <div className="w-full max-w-sm p-8 rounded-3xl bg-white border border-sky-100 shadow-2xl shadow-sky-500/10 flex flex-col items-center text-center space-y-6">
        
        {/* Animated App Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 animate-bounce duration-1000">
            <Sparkles className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white border border-sky-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-1">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">
            Omni<span className="text-sky-600">Research</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Unified Market, Competitor & SEO Suite
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              v{APP_VERSION}
            </span>
          </div>
        </div>

        {/* 4-Second Animated Progress Bar */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full h-2.5 rounded-full bg-sky-100/70 overflow-hidden p-0.5 border border-sky-200/50">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-75 ease-out shadow-xs"
              style={{ width: `${Math.min(100, progress)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-0.5">
            <span className="flex items-center gap-1.5 text-sky-700">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
              {statusMessage}
            </span>
            <span className="font-mono text-slate-400">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Helper Badge */}
        <div className="text-[10px] text-slate-400 font-medium pt-2">
          Automatic in-place update engine enabled
        </div>
      </div>
    </div>
  );
}

