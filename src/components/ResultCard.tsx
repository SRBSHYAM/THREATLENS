import React, { useState } from 'react';
import { ThreatAnalysisResult } from '../types';
import { RiskMeter } from './RiskMeter';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Share2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
  ChevronRight,
  ListOrdered,
  Layers,
  Cpu,
  BookmarkPlus,
  Radio
} from 'lucide-react';

interface ResultCardProps {
  result: ThreatAnalysisResult;
  onReset: () => void;
  onSaveToHistory?: (result: ThreatAnalysisResult) => void;
  isSaved?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onReset,
  onSaveToHistory,
  isSaved = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'redflags' | 'technical' | 'actions'>('overview');
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const isHighRisk = result.riskLevel === 'high_risk';
  const isSuspicious = result.riskLevel === 'suspicious';
  const isSafe = result.riskLevel === 'safe';

  const containerBorder = isHighRisk
    ? 'border-rose-500/40 shadow-rose-500/10'
    : isSuspicious
    ? 'border-amber-500/40 shadow-amber-500/10'
    : 'border-emerald-500/40 shadow-emerald-500/10';

  const badgeBg = isHighRisk
    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
    : isSuspicious
    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

  const handleCopy = () => {
    const report = `[Scammer Shield AI Risk Assessment]
Risk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase().replace('_', ' ')})
Category: ${result.category}
Headline: ${result.headline}
Summary: ${result.summary}

RED FLAGS IDENTIFIED:
${result.redFlags.map((rf, i) => `${i + 1}. ${rf}`).join('\n')}

RECOMMENDED ACTIONS:
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

*Disclaimer: AI-based risk assessment. Results are probabilistic evaluations. Always verify via official channels.`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Scammer Shield Analysis: ${result.category}`,
          text: `Risk Assessment Score: ${result.riskScore}/100 - ${result.headline}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopy();
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  return (
    <div
      id={`result-card-${result.id}`}
      className={`w-full rounded-2xl bg-slate-900/95 border backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-300 ${containerBorder}`}
    >
      {/* Top Banner Header */}
      <div className="bg-slate-950/80 px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                AI Threat Assessment
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-cyan-500/20">
                {result.type.toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-200">{result.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-report-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Copy Report to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>

          <button
            id="share-report-btn"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Share Assessment"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareFeedback ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            id="rescan-btn"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Risk Gauge & Headline Breakdown */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-slate-800/80">
        {/* Left Col: Visual Risk Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <RiskMeter score={result.riskScore} level={result.riskLevel} confidenceScore={result.confidenceScore} size="lg" />
        </div>

        {/* Right Col: Finding Overview & Input preview */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${badgeBg}`}>
                {result.riskLevel.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {result.headline}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">{result.summary}</p>
          </div>

          {/* Input Snippet Box */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mb-1">
              Scanned Input Context:
            </span>
            <p className="font-mono text-slate-300 line-clamp-2 break-all">{result.input}</p>
          </div>

          {/* Identified Attack Tactics Tags */}
          {result.tactics.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Identified Scam Tactics & Deception Vectors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.tactics.map((tactic, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/90 text-cyan-300 border border-slate-700"
                  >
                    <Radio className="w-3 h-3 text-cyan-400" />
                    {tactic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tabs for In-Depth Analysis */}
      <div className="px-6 pt-4 pb-0 bg-slate-950/40 border-b border-slate-800 flex overflow-x-auto gap-2">
        <button
          id="tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Threat Breakdown</span>
        </button>

        <button
          id="tab-redflags"
          onClick={() => setActiveTab('redflags')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'redflags'
              ? 'border-rose-400 text-rose-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Red Flags ({result.redFlags.length})</span>
        </button>

        <button
          id="tab-technical"
          onClick={() => setActiveTab('technical')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'technical'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Technical Telemetry</span>
        </button>

        <button
          id="tab-actions"
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'actions'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safety Recommendations ({result.recommendations.length})</span>
        </button>
      </div>

      {/* Tab Panels Content */}
      <div className="p-6">
        {/* Tab 1: Overview & Reasons */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Red flags column */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>Suspicious Indicators & Triggers</span>
                </div>
                <ul className="space-y-2.5">
                  {result.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Positive Indicators column */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Legitimacy & Neutral Factors</span>
                </div>
                <ul className="space-y-2.5">
                  {result.positiveIndicators.map((pos, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Safety Summary Bar */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">Immediate Protective Recommendation</span>
                  <span className="text-xs text-slate-300">
                    {result.recommendations[0] || 'Do not click links or share verification codes.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('actions')}
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 shrink-0"
              >
                <span>View Full Steps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Red Flags */}
        {activeTab === 'redflags' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Detailed Suspicious Characteristics Identified:
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {result.redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3"
                >
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                    FLAG #{idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Technical Telemetry Specs */}
        {activeTab === 'technical' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Technical Analysis Telemetry:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Scan Identifier</span>
                <span className="text-xs font-mono text-cyan-300 break-all">{result.id}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Confidence Score</span>
                <span className="text-xs font-mono text-emerald-400">
                  {(result.confidenceScore * 100).toFixed(0)}% Certainty
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Target Category</span>
                <span className="text-xs font-semibold text-slate-200">{result.category}</span>
              </div>

              {result.technicalDetails.map((tech, idx) => {
                const statusColor =
                  tech.status === 'danger'
                    ? 'text-rose-400'
                    : tech.status === 'warning'
                    ? 'text-amber-400'
                    : tech.status === 'safe'
                    ? 'text-emerald-400'
                    : 'text-slate-300';
                return (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">{tech.label}</span>
                    <span className={`text-xs font-mono font-medium ${statusColor}`}>{tech.value}</span>
                    {tech.info && <span className="text-[10px] text-slate-400 block mt-1">{tech.info}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Step-by-Step Action Plan */}
        {activeTab === 'actions' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Recommended Defense & Response Steps:
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed font-medium">
                    {rec}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mandatory AI Risk Assessment Disclaimer Footer */}
      <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-slate-300 font-semibold">AI Risk Assessment Notice:</strong> Results are probabilistic AI evaluations. Always verify sensitive requests directly with official organizations using verified phone numbers or URLs.
          </span>
        </div>
      </div>
    </div>
  );
};
