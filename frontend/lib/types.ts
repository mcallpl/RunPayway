// ── Assessment & Diagnostic Types ────────────────────────────────────────────

export type AnswerLetter = "A" | "B" | "C" | "D";

export interface CalibrationData {
  industry: string;
  revenue_model: string;
  role: string;
}

export interface DiagnosticResponses {
  [questionId: string]: AnswerLetter;
}

export interface DiagnosticSubmission {
  token: string;
  industry: string;
  revenue_model: string;
  role: string;
  responses: Record<string, AnswerLetter>;
}

// ── Report / Output Types ───────────────────────────────────────────────────

export interface ReportData {
  assessment_id: string;
  assessment_date: string;
  model_version: string;
  calibration: {
    industry: string;
    revenue_model: string;
    role: string;
    profile_id: string;
  };
  rating: {
    score_exact: number;
    display_score: number;
    band: string;
    band_label: string;
  };
  composition: {
    structural_revenue_pct: number;
    direct_involvement_pct: number;
    structural_label: string;
    direct_label: string;
  };
  exposure: {
    pressure_index: number;
    pressure_label: string;
    attention_dependence_impact: string;
    contract_disruption_impact: string;
    client_turnover_impact: string;
  };
  direction: {
    indicator: string;
    label: string;
    description: string;
  };
  advancement: {
    current_band: string;
    current_band_label: string;
    gap_to_next_band: number | null;
    next_band_label: string | null;
    characteristics: string[];
  };
  confidence_statement: string;
  disclaimer: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SubmitDiagnosticResponse {
  assessment_id: string;
  token: string;
  report: ReportData;
}
