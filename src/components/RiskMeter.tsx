import React from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, ShieldCheck, ShieldOff, AlertTriangle } from 'lucide-react';

interface RiskMeterProps {
  score: number; // 0 to 100
  level: RiskLevel;
  confidenceScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  confidenceScore = 0.92,
  size = 'md',
}) => {
  // SVG gauge calculations
  const radius = size === 'lg' ? 70 : size === 'md' ? 54 : 38;
  const stroke = size === 'lg' ? 12 : size === 'md' ? 10 : 7;
  const circumference = 2 * Math.PI * radius;
  // Use a 270-degree arc or full circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorConfig = {
    ring: 'stroke-emerald-500',
    glow: 'rgba(16, 185, 129, 0.25)',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    label: 'SAFE / LOW RISK',
    icon: ShieldCheck,
  };

  if (level === 'high_risk') {
    colorConfig = {
      ring: 'stroke-rose-500',
      glow: 'rgba(244, 63, 94, 0.35)',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      label: 'HIGH RISK THREAT',
      icon: ShieldAlert,
    };
  } else if (level === 'suspicious') {
    colorConfig = {
      ring: 'stroke-amber-500',
      glow: 'rgba(245, 158, 11, 0.3)',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      label: 'SUSPICIOUS / CAUTION',
      icon: AlertTriangle,
    };
  }

  const Icon = colorConfig.icon;
  const svgSize = (radius + stroke) * 2;

  return (
    <div id="risk-meter-container" className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: colorConfig.glow }}
        />

        {/* Circular SVG Gauge */}
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90 transition-all duration-700"
        >
          {/* Background Track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            className="text-slate-800/80"
          />
          {/* Active Risk Gauge Arc */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className={`${colorConfig.ring} transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Icon className={`w-6 h-6 mb-1 ${colorConfig.text}`} />
          <div className="flex items-baseline">
            <span className={`text-3xl lg:text-4xl font-black tracking-tight font-mono ${colorConfig.text}`}>
              {score}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-0.5 font-semibold">/100</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Risk Score</span>
        </div>
      </div>

      {/* Level Badge */}
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {colorConfig.label}
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          AI Confidence: {Math.round(confidenceScore * 100)}%
        </span>
      </div>
    </div>
  );
};
