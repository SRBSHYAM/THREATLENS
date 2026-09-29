/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThreatAnalysisResult, SampleThreatItem } from './types';
import { Navbar } from './components/Navbar';
import { QuickScanner } from './components/QuickScanner';
import { MessageScanner } from './components/MessageScanner';
import { UrlScanner } from './components/UrlScanner';
import { PhoneScanner } from './components/PhoneScanner';
import { ResultCard } from './components/ResultCard';
import { ThreatLibrary } from './components/ThreatLibrary';
import { ScanHistory } from './components/ScanHistory';
import { ThreatIntelFeed } from './components/ThreatIntelFeed';
import { EducationalSafetyTips } from './components/EducationalSafetyTips';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Activity,
  History,
  BookOpen,
  HelpCircle,
  Sparkles,
  Lock,
  Radio,
  Zap,
  Info,
} from 'lucide-react';

const STORAGE_KEY = 'scammer_shield_scan_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('quick');
  const [currentResult, setCurrentResult] = useState<ThreatAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ThreatAnalysisResult[]>([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistoryItem = (result: ThreatAnalysisResult) => {
    setHistory((prev) => {
      // Remove any previous item with exact same ID
      const filtered = prev.filter((item) => item.id !== result.id);
      const updated = [result, ...filtered].slice(0, 50); // Keep last 50
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleScanComplete = (result: ThreatAnalysisResult) => {
    setCurrentResult(result);
    saveHistoryItem(result);
  };

  const handleSelectScenario = async (sample: SampleThreatItem) => {
    setIsLoading(true);
    setCurrentResult(null);

    // Switch to corresponding tab
    setActiveTab(sample.type);

    try {
      let endpoint = '/api/scan/message';
      let payload: any = { text: sample.sampleInput };

      if (sample.type === 'url') {
        endpoint = '/api/scan/url';
        payload = { url: sample.sampleInput };
      } else if (sample.type === 'phone') {
        endpoint = '/api/scan/phone';
        payload = { phone: sample.sampleInput };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data: ThreatAnalysisResult = await res.json();
        handleScanComplete(data);
      }
    } catch (e) {
      console.error('Error running sample analysis', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 cyber-grid">
      {/* Top App Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If switching to a main scanner tab and no active scan, reset
          if (['quick', 'message', 'url', 'phone', 'library', 'intel', 'history', 'guide'].includes(tab)) {
            // Keep current result if user just clicks back to the respective scanner
          }
        }}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* If there's an active scan result, show ResultCard first */}
        {currentResult ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentResult(null)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition"
              >
                <span>← Back to Scanner Controls</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">
                Scan ID: {currentResult.id}
              </span>
            </div>

            <ResultCard
              result={currentResult}
              onReset={() => setCurrentResult(null)}
              onSaveToHistory={saveHistoryItem}
            />

            {/* Quick action: compare with defense tips */}
            <EducationalSafetyTips />
          </div>
        ) : (
          <div>
            {/* View based on activeTab */}
            {activeTab === 'quick' && (
              <div className="space-y-8">
                <QuickScanner
                  onScanComplete={handleScanComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
                <ThreatIntelFeed />
                <EducationalSafetyTips />
              </div>
            )}

            {activeTab === 'message' && (
              <div className="space-y-8">
                <MessageScanner
                  onScanComplete={handleScanComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
                <EducationalSafetyTips />
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-8">
                <UrlScanner
                  onScanComplete={handleScanComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
                <EducationalSafetyTips />
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-8">
                <PhoneScanner
                  onScanComplete={handleScanComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
                <EducationalSafetyTips />
              </div>
            )}

            {activeTab === 'library' && (
              <ThreatLibrary onSelectSample={handleSelectScenario} />
            )}

            {activeTab === 'intel' && (
              <ThreatIntelFeed />
            )}

            {activeTab === 'history' && (
              <ScanHistory
                history={history}
                onSelectResult={(res) => setCurrentResult(res)}
                onClearHistory={handleClearHistory}
                onDeleteItem={handleDeleteHistoryItem}
              />
            )}

            {activeTab === 'guide' && (
              <EducationalSafetyTips />
            )}
          </div>
        )}
      </main>

      {/* Cyber Security Footer */}
      <footer className="mt-auto bg-slate-950/80 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-200">Scammer Shield AI Threat Radar</span>
            <span className="text-slate-500">•</span>
            <span>Heuristic & Generative AI Security Framework</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.7 Flash</span>
            <span className="text-slate-700">•</span>
            <span>Zero-Retention Client Privacy</span>
            <span className="text-slate-700">•</span>
            <span className="text-cyan-400/80">AI Risk Assessment Engine</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-400">
          Disclaimer: Scammer Shield provides probabilistic risk assessments powered by artificial intelligence. While highly trained to detect deception indicators, no automated scanner is 100% infallible. Never disclose sensitive banking credentials or two-factor authentication codes.
        </div>
      </footer>
    </div>
  );
}
