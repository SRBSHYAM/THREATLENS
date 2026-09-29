export type ScanType = 'message' | 'url' | 'phone';
export type RiskLevel = 'safe' | 'suspicious' | 'high_risk';

export interface TechnicalDetail {
  label: string;
  value: string;
  status: 'safe' | 'warning' | 'danger' | 'neutral';
  info?: string;
}

export interface ThreatAnalysisResult {
  id: string;
  type: ScanType;
  input: string;
  timestamp: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  headline: string;
  summary: string;
  category: string;
  tactics: string[];
  redFlags: string[];
  positiveIndicators: string[];
  recommendations: string[];
  technicalDetails: TechnicalDetail[];
  confidenceScore: number;
}

export interface SampleThreatItem {
  id: string;
  title: string;
  type: ScanType;
  description: string;
  sampleInput: string;
  tag: string;
  expectedRisk: RiskLevel;
}

export interface ScanStats {
  totalScans: number;
  threatsDetected: number;
  safeItems: number;
  avgRiskScore: number;
}
