import React, { useState } from 'react';
import { SAMPLE_THREATS } from '../data/samples';
import { SampleThreatItem, ThreatAnalysisResult } from '../types';
import { BookOpen, ShieldAlert, ShieldCheck, AlertTriangle, Play, Sparkles, Filter, Search } from 'lucide-react';

interface ThreatLibraryProps {
  onSelectSample: (sample: SampleThreatItem) => void;
}

export const ThreatLibrary: React.FC<ThreatLibraryProps> = ({ onSelectSample }) => {
  const [filterType, setFilterType] = useState<'all' | 'message' | 'url' | 'phone'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSamples = SAMPLE_THREATS.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sampleInput.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div id="threat-library-panel" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Threat Intelligence & Scam Scenario Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore and test verified scam templates, phishing signatures, and deceptive caller tactics.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scam library (e.g. USPS, bank, robocall)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('message')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterType === 'message'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setFilterType('url')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterType === 'url'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            URLs
          </button>
          <button
            onClick={() => setFilterType('phone')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterType === 'phone'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950'
            }`}
          >
            Phones
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSamples.map((sample) => {
          const isHigh = sample.expectedRisk === 'high_risk';
          const isSusp = sample.expectedRisk === 'suspicious';
          const isSafe = sample.expectedRisk === 'safe';

          const borderStyle = isHigh
            ? 'border-rose-500/20 hover:border-rose-500/50'
            : isSusp
            ? 'border-amber-500/20 hover:border-amber-500/50'
            : 'border-emerald-500/20 hover:border-emerald-500/50';

          const riskBadge = isHigh ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              HIGH RISK
            </span>
          ) : isSusp ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              SUSPICIOUS
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              SAFE / LEGIT
            </span>
          );

          return (
            <div
              key={sample.id}
              className={`p-5 rounded-2xl bg-slate-900/80 border ${borderStyle} flex flex-col justify-between gap-4 transition shadow-lg group`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                      {sample.type.toUpperCase()} • {sample.tag}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      {sample.title}
                    </h3>
                  </div>
                  {riskBadge}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{sample.description}</p>

                {/* Sample Payload Box */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 break-all leading-relaxed">
                  {sample.sampleInput}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectSample(sample)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run AI Threat Scan on this Scenario</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
