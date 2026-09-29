import React from 'react';
import { Shield, KeyRound, PhoneOff, Lock, AlertOctagon, HelpCircle, CheckCircle, ExternalLink } from 'lucide-react';

export const EducationalSafetyTips: React.FC = () => {
  const rules = [
    {
      icon: KeyRound,
      title: 'Never Share One-Time Passcodes (OTP)',
      description: 'Banks and legitimate tech services will NEVER call or text you asking for a 2FA verification code. Anyone asking for an OTP is attempting an account takeover.',
      tag: 'Critical Rule',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: PhoneOff,
      title: 'Hang Up on Urgent Financial Threats',
      description: 'The IRS, Social Security Administration, and law enforcement do NOT demand immediate wire transfers, Bitcoin, or Apple/Target gift cards under threat of arrest.',
      tag: 'Imposter Scams',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Lock,
      title: 'Inspect the Real Root Domain',
      description: 'Always look at the characters directly before the .com or .org. Domains like `paypal.security-update.xyz` belong to `security-update.xyz`, not PayPal.',
      tag: 'URL Hygiene',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: AlertOctagon,
      title: 'Avoid Clicking Unsolicited Delivery Links',
      description: 'If you receive a text claiming your package address is incomplete or requires a redelivery fee, verify directly on the official carrier website or app.',
      tag: 'Smishing Defense',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div id="safety-guide-panel" className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Scam Defense Playbook & Safety Rules
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Essential cybersecurity principles to protect your personal identity, financial accounts, and passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl border ${rule.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {rule.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{rule.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Reporting Hotlines & Links */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Official Fraud Reporting Resources
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition flex items-center justify-between"
          >
            <span>FTC ReportFraud.gov</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition flex items-center justify-between"
          >
            <span>FBI IC3 (Internet Crime)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://safebrowsing.google.com/safebrowsing/report_phish/"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition flex items-center justify-between"
          >
            <span>Google Safe Browsing Report</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
