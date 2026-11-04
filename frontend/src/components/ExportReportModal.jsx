import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Printer, Building2, Sparkles } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, activeTab, currentData }) {
  const [agencyName, setAgencyName] = useState('OmniResearch Enterprise');
  const [agencySubtitle, setAgencySubtitle] = useState('Executive Market & Competitor Intelligence Brief');

  if (!isOpen) return null;

  const downloadCSV = () => {
    if (!currentData) return;

    let rows = [];
    rows.push([`${agencyName} - Executive Report`]);
    rows.push(['Subtitle', agencySubtitle]);
    rows.push(['Module', activeTab.toUpperCase()]);
    rows.push(['Export Timestamp', new Date().toISOString()]);
    rows.push(['Confidence Score', (currentData.confidence?.confidence_score || 95) + '%']);
    rows.push(['Data Source', currentData.confidence?.data_source || 'Verified Intelligence Engine']);
    rows.push([]);

    if (activeTab === 'traffic') {
      rows.push(['Domain', currentData.domain]);
      rows.push(['Global Rank', currentData.global_rank === 0 ? 'Unranked' : currentData.global_rank]);
      rows.push(['Country Rank', currentData.country_rank === 0 ? 'Unranked' : currentData.country_rank]);
      rows.push(['Monthly Visits', currentData.total_visits]);
      rows.push(['Bounce Rate', currentData.bounce_rate + '%']);
      rows.push(['Avg Duration', currentData.avg_visit_duration]);
      rows.push(['Category', currentData.category]);
      if (currentData.registration_date) {
        rows.push(['Registration Date', currentData.registration_date]);
        rows.push(['Domain Age (Days)', currentData.domain_age_days]);
      }
    } else if (activeTab === 'keywords') {
      rows.push(['Target Query', currentData.query]);
      rows.push(['Search Volume', currentData.search_volume]);
      rows.push(['Keyword Difficulty', currentData.difficulty + '%']);
      rows.push(['CPC ($)', currentData.cpc]);
      rows.push(['Intent', currentData.intent]);
    } else if (activeTab === 'social') {
      rows.push(['Channel Handle', currentData.handle]);
      rows.push(['Title', currentData.title]);
      rows.push(['Subscribers', currentData.subscriber_count]);
      rows.push(['Total Views', currentData.total_views]);
      rows.push(['Grade', currentData.grade]);
      rows.push(['Engagement Rate', currentData.engagement_rate + '%']);
    } else if (activeTab === 'audience') {
      rows.push(['Topic', currentData.query]);
      rows.push(['Positive Sentiment', currentData.sentiment?.positive + '%']);
      rows.push(['Negative Sentiment', currentData.sentiment?.negative + '%']);
      rows.push(['Neutral Sentiment', currentData.sentiment?.neutral + '%']);
    } else if (activeTab === 'audit') {
      rows.push(['Audited Domain', currentData.domain]);
      rows.push(['Health Score', currentData.health_score + '/100']);
      rows.push(['Health Grade', currentData.health_grade]);
      rows.push(['Total Pages Crawled', currentData.total_pages_crawled]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report-${activeTab}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handlePrint = () => {
    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">

      {/* Hidden Print-Only White-Label Header */}
      <div className="print-only p-8 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">{agencyName}</h1>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">{agencySubtitle}</p>
          </div>
          <div className="text-right text-xs font-mono text-slate-500">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Module: {activeTab.toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-2xl space-y-5 no-print">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Export Intelligence Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agency White-Label Branding Settings */}
        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>White-Label Agency Branding</span>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Agency / Company Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Report Subtitle</label>
            <input
              type="text"
              value={agencySubtitle}
              onChange={(e) => setAgencySubtitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <button
            onClick={downloadCSV}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-sky-600 border border-sky-200 shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Export as Spreadsheet (.CSV)
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Standard table format for Excel, Google Sheets</div>
              </div>
            </div>
          </button>

          <button
            onClick={handlePrint}
            className="w-full p-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-between group transition-all shadow-md shadow-sky-600/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Printer className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">
                  Print / Save as Branded PDF
                </div>
                <div className="text-[11px] text-sky-100 font-medium">Formatted client-ready presentation summary</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
