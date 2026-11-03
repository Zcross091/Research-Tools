import React from 'react';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OmniResearch Uncaught UI Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f0f7ff] text-slate-800 flex items-center justify-center p-6 font-sans">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-white border border-sky-100 shadow-2xl shadow-sky-500/10 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Application Recovery
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                An unexpected view error occurred. OmniResearch has preserved your session state and can reload the dashboard safely.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 max-h-36 overflow-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>

              <a
                href="https://statecraft-ebon.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold border border-sky-200 transition-colors"
              >
                <span>StateCraft Support</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-[10px] text-slate-400 font-medium">
              OmniResearch Native Suite • Built by StateCraft
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
