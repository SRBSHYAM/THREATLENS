import React, { useState } from 'react';
import { ThreatAnalysisResult } from '../types';
import { SAMPLE_THREATS } from '../data/samples';
import {
  Sparkles,
  ShieldCheck,
  Search,
  AlertCircle,
  Loader2,
  Zap,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  Globe,
  PhoneCall,
  Trash2,
} from 'lucide-react';

interface QuickScannerProps {
  onScanComplete: (result: ThreatAnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const QuickScanner: React.FC<QuickScannerProps> = ({
  onScanComplete,
  isLoading,
  setIsLoading,
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please paste any message, URL, or phone number to scan.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/scan/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Scan analysis failed.');
      }

      const data: ThreatAnalysisResult = await res.json();
      onScanComplete(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during quick analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleClick = (sampleText: string) => {
    setInput(sampleText);
    setError(null);
  };

  return (
    <div id="quick-scanner-panel" className="space-y-6">
      {/* Hero Banner within Dashboard */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Vector AI Threat Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Universal Scam & Cyber Fraud Scanner
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            Instantly evaluate suspicious SMS texts, phishing URLs, fake invoice notifications, and scam caller IDs powered by real-time AI threat intelligence.
          </p>

          {/* Quick Input Box */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="relative rounded-2xl bg-slate-950/90 border-2 border-slate-700/80 focus-within:border-cyan-400 transition shadow-2xl p-2 sm:p-2.5">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1 flex items-center">
                  <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                    <Search className="w-5 h-5 text-cyan-400" />
                  </div>
                  <input
                    id="universal-scan-input"
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Paste suspicious text message, email link, or phone number..."
                    className="w-full bg-transparent pl-11 pr-10 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-sans"
                  />
                  {input && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="absolute right-3 text-slate-400 hover:text-slate-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  id="universal-scan-btn"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Scan Threat</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Quick Category Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Quick Test:</span>
            <button
              onClick={() => handleSampleClick(SAMPLE_THREATS[0].sampleInput)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3 text-cyan-400" />
              <span>USPS Delivery SMS</span>
            </button>
            <button
              onClick={() => handleSampleClick(SAMPLE_THREATS[3].sampleInput)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition flex items-center gap-1.5"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Phishing URL</span>
            </button>
            <button
              onClick={() => handleSampleClick(SAMPLE_THREATS[5].sampleInput)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition flex items-center gap-1.5"
            >
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              <span>Fake IRS Robocall</span>
            </button>
            <button
              onClick={() => handleSampleClick(SAMPLE_THREATS[7].sampleInput)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Legitimate Amazon SMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Scam Message Detection</h3>
          <p className="text-xs text-slate-400 mt-1">
            Detects coercive psychological urgency, OTP theft traps, extortion messages, and brand impersonation in text & email.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">URL & Link Inspector</h3>
          <p className="text-xs text-slate-400 mt-1">
            Uncovers typosquatted lookalike domains, deceptive redirects, disposable TLDs, and credential harvesting landing pages.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
            <PhoneCall className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Caller Risk & Toll Radar</h3>
          <p className="text-xs text-slate-400 mt-1">
            Evaluates international Wangiri one-ring callback traps, toll-free tech support spoofing, and robocall risk factors.
          </p>
        </div>
      </div>
    </div>
  );
};
