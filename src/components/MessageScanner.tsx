import React, { useState } from 'react';
import { ThreatAnalysisResult, SampleThreatItem } from '../types';
import { SAMPLE_THREATS } from '../data/samples';
import { MessageSquare, Send, Sparkles, AlertCircle, Loader2, FileText, Trash2 } from 'lucide-react';

interface MessageScannerProps {
  onScanComplete: (result: ThreatAnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({
  onScanComplete,
  isLoading,
  setIsLoading,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const messageSamples = SAMPLE_THREATS.filter((s) => s.type === 'message');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter or paste a message to analyze.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/scan/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to scan message.');
      }

      const data: ThreatAnalysisResult = await res.json();
      onScanComplete(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (sample: SampleThreatItem) => {
    setText(sample.sampleInput);
    setError(null);
  };

  return (
    <div id="message-scanner-panel" className="space-y-6">
      {/* Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Scam Message & Email Scanner
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detect smishing (SMS scams), phishing emails, Telegram/WhatsApp deception, fake bank alerts, and urgent extortion.
          </p>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-4 focus-within:border-cyan-500/50 transition shadow-inner">
          <label htmlFor="message-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Paste suspicious text message, email body, or DM:
          </label>
          <textarea
            id="message-input"
            rows={5}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. 'USPS: Your package could not be delivered due to address errors. Update address and pay $0.35 here: http://...'"
            className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans leading-relaxed resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span>Characters: {text.length}</span>
              {text && (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="hover:text-rose-400 flex items-center gap-1 ml-2 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <button
              id="analyze-message-submit-btn"
              type="submit"
              disabled={isLoading || !text.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analyzing Threat Vector...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Scan for Scam Indicators</span>
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
          Or try a pre-loaded real-world scam scenario:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {messageSamples.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample)}
              className="text-left p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/30 transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                  {sample.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {sample.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{sample.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
