import React, { useState } from 'react';
import { ThreatAnalysisResult } from '../types';
import {
  History,
  Trash2,
  Download,
  Search,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Globe,
  PhoneCall,
  Calendar,
  Layers
} from 'lucide-react';

interface ScanHistoryProps {
  history: ThreatAnalysisResult[];
  onSelectResult: (result: ThreatAnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onDeleteItem,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'message' | 'url' | 'phone'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'safe' | 'suspicious' | 'high_risk'>('all');
  const [search, setSearch] = useState('');

  const filteredHistory = history.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesRisk = filterRisk === 'all' || item.riskLevel === filterRisk;
    const matchesSearch =
      item.input.toLowerCase().includes(search.toLowerCase()) ||
      item.headline.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesRisk && matchesSearch;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scammer-shield-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['Timestamp', 'Type', 'Risk Level', 'Risk Score', 'Category', 'Headline', 'Input'];
    const rows = history.map((item) => [
      new Date(item.timestamp).toISOString(),
      item.type,
      item.riskLevel,
      item.riskScore,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${(item.headline || '').replace(/"/g, '""')}"`,
      `"${(item.input || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scammer-shield-logs-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div id="scan-history-panel" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Threat Scan History ({history.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review past scans, re-inspect risk evaluations, or export reports for security logging.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Export as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scan logs by text, category, or headline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="all">All Channels</option>
            <option value="message">Messages</option>
            <option value="url">URLs / Links</option>
            <option value="phone">Phone Numbers</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e: any) => setFilterRisk(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="all">All Risk Levels</option>
            <option value="high_risk">High Risk Only</option>
            <option value="suspicious">Suspicious Only</option>
            <option value="safe">Safe Only</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">No Scan Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {history.length === 0
              ? 'Run your first scan on any message, URL, or phone number to populate your activity history.'
              : 'No scans match your current filter query.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isHigh = item.riskLevel === 'high_risk';
            const isSusp = item.riskLevel === 'suspicious';

            const TypeIcon = item.type === 'message' ? MessageSquare : item.type === 'url' ? Globe : PhoneCall;

            const badgeBg = isHigh
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : isSusp
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

            const riskBorder = isHigh
              ? 'border-rose-500/20 hover:border-rose-500/40'
              : isSusp
              ? 'border-amber-500/20 hover:border-amber-500/40'
              : 'border-emerald-500/20 hover:border-emerald-500/40';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl bg-slate-900/90 border ${riskBorder} transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 shrink-0 mt-0.5">
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeBg}`}>
                        Score {item.riskScore} • {item.riskLevel.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {item.headline}
                    </h4>

                    <p className="text-xs font-mono text-slate-400 truncate mt-0.5">{item.input}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onSelectResult(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
                  >
                    <span>View Assessment</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
                    title="Delete Scan Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
