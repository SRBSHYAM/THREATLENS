import React, { useState } from 'react';
import { ThreatAnalysisResult, SampleThreatItem } from '../types';
import { SAMPLE_THREATS } from '../data/samples';
import { PhoneCall, Sparkles, AlertCircle, Loader2, ShieldCheck, Radio, Trash2 } from 'lucide-react';

interface PhoneScannerProps {
  onScanComplete: (result: ThreatAnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const PhoneScanner: React.FC<PhoneScannerProps> = ({
  onScanComplete,
  isLoading,
  setIsLoading,
}) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const phoneSamples = SAMPLE_THREATS.filter((s) => s.type === 'phone');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter a phone number or caller ID to check.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/scan/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze phone number.');
      }

      const data: ThreatAnalysisResult = await res.json();
      onScanComplete(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during phone risk analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (sample: SampleThreatItem) => {
    setPhone(sample.sampleInput);
    setError(null);
  };

  return (
    <div id="phone-scanner-panel" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-cyan-400" />
          Phone Number & Robocall Risk Checker
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Evaluate unsolicited caller IDs, international toll traps (Wangiri scams), IRS/tax imposter hotlines, and VoIP spoofing exposure.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-4 focus-within:border-cyan-500/50 transition shadow-inner">
          <label htmlFor="phone-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Phone Number / Sender Caller ID:
          </label>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
            </div>

            <input
              id="phone-input"
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError(null);
              }}
              placeholder="+1 (800) 843-9921 or +232 99 821044"
              className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-3.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 leading-normal"
            />

            {phone && (
              <button
                type="button"
                onClick={() => setPhone('')}
                className="absolute right-3 text-slate-400 hover:text-slate-200 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Note: Caller IDs can be spoofed by VoIP software; always verify callbacks</span>
            </div>

            <button
              id="analyze-phone-submit-btn"
              type="submit"
              disabled={isLoading || !phone.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Evaluating Caller Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Check Phone Risk</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Quick Test Samples */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
          Or check known high-risk caller patterns:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {phoneSamples.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample)}
              className="text-left p-3 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/30 transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                  {sample.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {sample.tag}
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400/80 mb-1">{sample.sampleInput}</p>
              <p className="text-[11px] text-slate-400">{sample.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
