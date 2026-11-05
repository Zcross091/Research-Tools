import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TrafficDashboard from './components/TrafficDashboard';
import KeywordDashboard from './components/KeywordDashboard';
import SocialDashboard from './components/SocialDashboard';
import AudienceDashboard from './components/AudienceDashboard';
import SiteAuditDashboard from './components/SiteAuditDashboard';
import ComparisonView from './components/ComparisonView';
import DownloadPortal from './components/DownloadPortal';
import ExportReportModal from './components/ExportReportModal';
import ConnectorsModal from './components/ConnectorsModal';
import SettingsModal from './components/SettingsModal';
import SplashScreen from './components/SplashScreen';
import UpdateModal from './components/UpdateModal';
import StateCraftBadge from './components/StateCraftBadge';
import { checkForAppUpdates, APP_VERSION } from './services/updater';
import { 
  fetchTraffic, fetchKeywords, fetchSocial, 
  fetchAudience, fetchVideoTags, runSiteAudit, fetchSiteAuditResults
} from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('traffic');
  
  // Dark Mode Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme_dark') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_dark', 'false');
    }
  }, [isDarkMode]);

  // Splash & Update states
  const [showSplash, setShowSplash] = useState(true);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [checkingManualUpdate, setCheckingManualUpdate] = useState(false);

  // Modal visibility states
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Data states
  const [trafficData, setTrafficData] = useState(null);
  const [keywordsData, setKeywordsData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [audienceData, setAudienceData] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [tagAnalysis, setTagAnalysis] = useState(null);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selected Country for Keywords
  const [selectedKeywordCountry, setSelectedKeywordCountry] = useState('US');

  // Load initial representative baseline data on mount
  useEffect(() => {
    handleSearchTraffic('stripe.com');
  }, []);

  const handleSplashFinish = (result) => {
    setShowSplash(false);
    if (result && result.hasUpdate) {
      setUpdateInfo(result);
      setIsUpdateModalOpen(true);
    }
  };

  const handleManualCheckUpdate = async () => {
    setCheckingManualUpdate(true);
    try {
      const res = await checkForAppUpdates();
      setUpdateInfo(res);
      setIsUpdateModalOpen(true);
    } catch (e) {
      console.warn(e);
    } finally {
      setCheckingManualUpdate(false);
    }
  };

  const handleSearchTraffic = async (domain) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTraffic(domain);
      setTrafficData(res);
    } catch (err) {
      setError(err.message || 'Failed to analyze website traffic.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeywords = async (query, country = selectedKeywordCountry) => {
    setLoading(true);
    setError(null);
    setSelectedKeywordCountry(country);
    try {
      const res = await fetchKeywords(query, country);
      setKeywordsData(res);
    } catch (err) {
      setError(err.message || 'Failed to analyze keyword.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSocial = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSocial(query);
      setSocialData(res);
      if (res.video_analysis) {
        setTagAnalysis(res.video_analysis);
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze social creator.');
    } finally {
      setLoading(false);
    }
  };

  const handleInspectTags = async (videoIdOrUrl) => {
    setTagLoading(true);
    setError(null);
    try {
      const res = await fetchVideoTags(videoIdOrUrl);
      setTagAnalysis(res);
    } catch (err) {
      setError(err.message || 'Failed to extract video tags.');
    } finally {
      setTagLoading(false);
    }
  };

  const handleSearchAudience = async (topic) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAudience(topic);
      setAudienceData(res);
    } catch (err) {
      setError(err.message || 'Failed to analyze audience.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunSiteAudit = async (domain) => {
    setLoading(true);
    setError(null);
    try {
      const res = await runSiteAudit(domain);
      setAuditData(res);
    } catch (err) {
      setError(err.message || 'Failed to perform site audit.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setError(null);
    if (tabId === 'keywords' && !keywordsData) {
      handleSearchKeywords('artificial intelligence', selectedKeywordCountry);
    } else if (tabId === 'social' && !socialData) {
      handleSearchSocial('mrbeast');
    } else if (tabId === 'audience' && !audienceData) {
      handleSearchAudience('b2b saas');
    } else if (tabId === 'audit' && !auditData) {
      handleRunSiteAudit('stripe.com');
    }
  };

  const getCurrentData = () => {
    if (activeTab === 'traffic') return trafficData;
    if (activeTab === 'keywords') return keywordsData;
    if (activeTab === 'social') return socialData;
    if (activeTab === 'audience') return audienceData;
    if (activeTab === 'audit') return auditData;
    return null;
  };

  // If initial 4-second splash screen is active, display it
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onOpenExport={() => setIsExportOpen(true)}
        onOpenConnectors={() => setIsConnectorsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <div className="flex-1">{error}</div>
            <button 
              onClick={() => setError(null)}
              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'traffic' && (
          <TrafficDashboard
            data={trafficData}
            loading={loading}
            onSearch={handleSearchTraffic}
            onCompare={() => setActiveTab('compare')}
          />
        )}

        {activeTab === 'keywords' && (
          <KeywordDashboard
            data={keywordsData}
            loading={loading}
            onSearch={handleSearchKeywords}
          />
        )}

        {activeTab === 'social' && (
          <SocialDashboard
            data={socialData}
            loading={loading}
            onSearch={handleSearchSocial}
            onInspectTags={handleInspectTags}
            tagAnalysis={tagAnalysis}
            tagLoading={tagLoading}
          />
        )}

        {activeTab === 'audience' && (
          <AudienceDashboard
            data={audienceData}
            loading={loading}
            onSearch={handleSearchAudience}
          />
        )}

        {activeTab === 'audit' && (
          <SiteAuditDashboard
            auditData={auditData}
            loading={loading}
            onRunAudit={handleRunSiteAudit}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView />
        )}

        {activeTab === 'downloads' && (
          <DownloadPortal onNavigateTab={handleTabChange} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>OmniResearch Suite • Similarweb, SocialBlade, vidIQ, SparkToro, Ahrefs & Site Audit</div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualCheckUpdate}
              disabled={checkingManualUpdate}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-slate-700 hover:bg-sky-50 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3 h-3 ${checkingManualUpdate ? 'animate-spin' : ''}`} />
              <span>v{APP_VERSION} • Check for Updates</span>
            </button>
            <span className="text-[11px] font-mono text-sky-700 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
              Verified Data Engine
            </span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeTab={activeTab}
        currentData={getCurrentData()}
      />

      {/* First-Party Connectors Modal */}
      <ConnectorsModal
        isOpen={isConnectorsOpen}
        onClose={() => setIsConnectorsOpen(false)}
        currentDomain={trafficData ? trafficData.domain : 'stripe.com'}
      />

      {/* Settings / API Keys Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* In-App Update Modal */}
      {isUpdateModalOpen && (
        <UpdateModal
          updateInfo={updateInfo}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}

      {/* Persistent Brand Attribution Badge */}
      <StateCraftBadge />
    </div>
  );
}
