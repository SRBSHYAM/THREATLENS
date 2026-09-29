import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Radio, AlertTriangle, ExternalLink, RefreshCw, BarChart2, ShieldCheck, Zap } from 'lucide-react';

interface ThreatIntelFeedProps {
  onTestIndicator?: (indicator: string) => void;
}

export const ThreatIntelFeed: React.FC<ThreatIntelFeedProps> = ({ onTestIndicator }) => {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/threat-intel/feed');
      if (res.ok) {
        const data = await res.json();
        setIntel(data);
      }
    } catch (e) {
      console.error('Failed to load intel feed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
  }, []);

  return (
    <div id="threat-intel-panel" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Cyber Threat Intelligence Feed
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              ACTIVE RADAR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of active phishing waves, deceptive domain registrations, and telephone fraud campaigns.
          </p>
        </div>

        <button
          onClick={fetchIntel}
          disabled={loading}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Cyber Threat Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Global Threat Status</span>
            <span className="text-base font-black text-rose-400 tracking-tight">ELEVATED PHISHING WAVE</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Active Smishing Vectors</span>
            <span className="text-base font-black text-cyan-400 tracking-tight">USPS & E-ZPass Imposters</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Engine Model</span>
            <span className="text-base font-black text-emerald-400 tracking-tight">Gemini 3.7 Flash AI</span>
          </div>
        </div>
      </div>

      {/* Active Threat Campaigns */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Monitored Threat Campaigns (Past 48 Hours)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intel?.activeCampaigns?.map((camp: any) => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                    Target: {camp.target}
                  </span>
                  <h4 className="text-sm font-bold text-white">{camp.title}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  {camp.risk}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{camp.description}</p>

              {/* Observed Indicators */}
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Known Sample Indicators:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {camp.indicators.map((ind: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-[11px] border border-slate-800"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
