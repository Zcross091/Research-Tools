import React from 'react';
import { X, Download, FileSpreadsheet, Printer } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, activeTab, currentData }) {
  if (!isOpen) return null;

  const downloadCSV = () => {
    if (!currentData) return;

    let rows = [];
    rows.push(['OmniResearch Executive Report']);
    rows.push(['Module', activeTab.toUpperCase()]);
    rows.push(['Export Timestamp', new Date().toISOString()]);
    rows.push(['Confidence Score', currentData.confidence?.confidence_score + '%']);
    rows.push(['Data Source', currentData.confidence?.data_source]);
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
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `research-report-${activeTab}-${Date.now()}.csv`);
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
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-2xl space-y-5">
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

        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Export verified research data for your active view ({activeTab.toUpperCase()}). Every export includes transparent data provenance and confidence scoring.
        </p>

        <div className="space-y-3 pt-2">
          <button
            onClick={downloadCSV}
            className="w-full p-4 rounded-2xl bg-sky-50/50 border border-sky-200 hover:border-sky-400 hover:bg-sky-50 flex items-center justify-between group transition-all"
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
            className="w-full p-4 rounded-2xl bg-sky-50/50 border border-sky-200 hover:border-sky-400 hover:bg-sky-50 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-sky-600 border border-sky-200 shadow-xs">
                <Printer className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Print / Save as Executive PDF
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Formatted client-ready presentation summary</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
