import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, CheckCircle2, Save, ExternalLink } from 'lucide-react';
import { fetchApiKeysStatus, saveApiKeys } from '../services/api';

export default function SettingsModal({ isOpen, onClose }) {
  const [dfsLogin, setDfsLogin] = useState('');
  const [dfsPassword, setDfsPassword] = useState('');
  const [ahrefsKey, setAhrefsKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadKeys();
    }
  }, [isOpen]);

  const loadKeys = async () => {
    try {
      const res = await fetchApiKeysStatus();
      if (res.dataforseo_login_partial) {
        setDfsLogin(res.dataforseo_login_partial);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await saveApiKeys({
        dataforseo_login: dfsLogin,
        dataforseo_password: dfsPassword,
        ahrefs_api_key: ahrefsKey
      });
      setMessage(res.message || 'API keys saved successfully.');
    } catch (err) {
      setMessage('Failed to save API keys.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">API Keys & Adapters Configuration</h3>
              <p className="text-xs text-slate-500">Configure optional credentials for live DataForSEO & Ahrefs data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              DataForSEO API Login (Username)
            </label>
            <input
              type="text"
              value={dfsLogin}
              onChange={(e) => setDfsLogin(e.target.value)}
              placeholder="e.g. user@domain.com"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              DataForSEO API Password / Key
            </label>
            <input
              type="password"
              value={dfsPassword}
              onChange={(e) => setDfsPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ahrefs API Key (Optional)
            </label>
            <input
              type="password"
              value={ahrefsKey}
              onChange={(e) => setAhrefsKey(e.target.value)}
              placeholder="ahrefs_v3_••••••••"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-[11px] text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>If left empty, Research Tools uses its high-fidelity calibration & public feeds engine.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Keys'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
