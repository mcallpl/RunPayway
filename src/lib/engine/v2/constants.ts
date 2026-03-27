// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Model RP-2.0 Versioned Constants & Scoring Rulesets
// ═══════════════════════════════════════════════════════════════

import type {
  CanonicalInput,
  VariabilityLevel,
  DurabilityGrade,
  FragilityClass,
  ConfidenceLevel,
  ConstraintKey,
  ExtendedInputs,
  QualityResult,
} from "./types";

// ─── MODEL IDENTITY ─────────────────────────────────────

export const MODEL_VERSION = "RP-2.0" as const;
export const FACTOR_VERSION = "F-2.0" as const;
export const SCENARIO_VERSION = "S-2.0" as const;
export const BENCHMARK_VERSION = "B-2.0" as const;
export const EXPLANATION_VERSION = "E-2.0" as const;

// ─── ANSWER → CANONICAL MAPPING ─────────────────────────

/** Q1 — Recurring or Continuing Revenue Base → income_persistence_pct */
export const Q1_MAPPING: Record<string, number> = {
  A: 5,
  B: 20,
  C: 45,
  D: 73,
  E: 93,
};

/** Q2 — Income Concentration → largest_source_pct (high = bad) */
export const Q2_MAPPING: Record<string, number> = {
  A: 95,
  B: 80,
  C: 60,
  D: 40,
  E: 15,
};

/** Q3 — Meaningful Income Source Diversity → source_diversity_count */
export const Q3_MAPPING: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 6,
  E: 8,
};

/** Q4 — Forward Revenue Visibility → forward_secured_pct */
export const Q4_MAPPING: Record<string, number> = {
  A: 4,
  B: 12,
  C: 33,
  D: 71,
  E: 100,
};

/** Q5 — Earnings Variability → income_variability_level */
export const Q5_MAPPING: Record<string, VariabilityLevel> = {
  A: "extreme",
  B: "high",
  C: "moderate",
  D: "low",
  E: "low",
};

/** Q5 — Numeric mapping for formulas */
export const Q5_NUMERIC_MAPPING: Record<string, number> = {
  A: 88,
  B: 63,
  C: 37,
  D: 17,
  E: 5,
};

/** Q6 — Income Continuity Without Active Labor → labor_dependence_pct (inverse) */
export const Q6_MAPPING: Record<string, number> = {
  A: 100,
  B: 87,
  C: 62,
  D: 37,
  E: 12,
};

// ─── FACTOR SCORING TABLES ──────────────────────────────

/** income_persistence_pct → 0–15 points */
export const INCOME_PERSISTENCE_SCORE_TABLE: readonly [number, number, number][] = [
  [0,   10,  1],
  [11,  20,  3],
  [21,  35,  5],
  [36,  50,  8],
  [51,  65,  11],
  [66,  80,  13],
  [81,  100, 15],
];

/** source_diversity_count → 0–10 points */
export const SOURCE_DIVERSITY_SCORE_TABLE: readonly [number, number][] = [
  [1, 1],
  [2, 3],
  [3, 5],
  [4, 7],
  [5, 8],
  [6, 10],
];

/** forward_secured_pct → 0–15 points */
export const FORWARD_SECURED_SCORE_TABLE: readonly [number, number, number][] = [
  [0,   5,   0],
  [6,   15,  2],
  [16,  30,  5],
  [31,  45,  8],
  [46,  60,  11],
  [61,  75,  13],
  [76,  100, 15],
];

/** largest_source_pct (inverse) → 0–10 points */
export const CONCENTRATION_INVERSE_SCORE_TABLE: readonly [number, number, number][] = [
  [0,   20,  10],
  [21,  35,  8],
  [36,  50,  6],
  [51,  65,  4],
  [66,  80,  2],
  [81,  100, 0],
];

/** labor_dependence_pct (inverse) → 0–20 points */
export const LABOR_DEPENDENCE_INVERSE_SCORE_TABLE: readonly [number, number, number][] = [
  [0,   20,  20],
  [21,  35,  17],
  [36,  50,  14],
  [51,  65,  10],
  [66,  80,  6],
  [81,  100, 2],
];

/** income_variability_level (inverse) → 0–10 points */
export const VARIABILITY_INVERSE_SCORE_TABLE: Record<VariabilityLevel, number> = {
  low: 10,
  moderate: 7,
  high: 3,
  extreme: 0,
};

/** continuity_months → 0–10 points */
export const CONTINUITY_SCORE_TABLE: readonly [number, number, number][] = [
  [0,     0.9,  0],
  [1.0,   1.9,  2],
  [2.0,   2.9,  4],
  [3.0,   4.4,  6],
  [4.5,   6.0,  8],
  [6.01,  12,   10],
];

// ─── BAND THRESHOLDS ────────────────────────────────────

export const BAND_THRESHOLDS: readonly { min: number; max: number; band: string }[] = [
  { min: 0,  max: 29,  band: "Limited Stability" },
  { min: 30, max: 49,  band: "Developing Stability" },
  { min: 50, max: 74,  band: "Established Stability" },
  { min: 75, max: 100, band: "High Stability" },
];

// ─── INTERACTION PENALTY/BONUS RULES ────────────────────

export interface InteractionRule {
  code: string;
  type: "penalty" | "bonus";
  points: number;
  condition: (n: CanonicalInput, ext?: ExtendedInputs) => boolean;
  factors: string[];
  description: string;
}

export const INTERACTION_RULES: InteractionRule[] = [
  {
    code: "CF-01",
    type: "penalty",
    points: -5,
    condition: (n) => n.largest_source_pct >= 70 && n.forward_secured_pct <= 20,
    factors: ["largest_source_pct", "forward_secured_pct"],
    description: "High concentration with weak forward visibility",
  },
  {
    code: "CF-02",
    type: "penalty",
    points: -5,
    condition: (n) => n.labor_dependence_pct >= 75 && n.income_persistence_pct <= 25,
    factors: ["labor_dependence_pct", "income_persistence_pct"],
    description: "High labor dependence with low persistence",
  },
  {
    code: "CF-03",
    type: "penalty",
    points: -4,
    condition: (n) => n.source_diversity_count >= 4 && n.largest_source_pct >= 65,
    factors: ["source_diversity_count", "largest_source_pct"],
    description: "Diverse sources but still concentrated",
  },
  {
    code: "CF-04",
    type: "penalty",
    points: -5,
    condition: (n, ext) =>
      n.income_persistence_pct >= 50 &&
      ext?.cancellation_risk_level === "high",
    factors: ["income_persistence_pct", "cancellation_risk_level"],
    description: "Persistent revenue but high cancellation risk",
  },
  {
    code: "CF-05",
    type: "penalty",
    points: -4,
    condition: (n, ext) =>
      n.forward_secured_pct >= 40 &&
      (ext?.booked_but_cancelable_pct ?? 0) >= 50,
    factors: ["forward_secured_pct", "booked_but_cancelable_pct"],
    description: "Forward revenue mostly cancelable",
  },
  {
    code: "CF-06",
    type: "penalty",
    points: -4,
    condition: (n) =>
      n.source_diversity_count <= 2 &&
      n.income_variability_level === "extreme",
    factors: ["source_diversity_count", "income_variability_level"],
    description: "Few sources with extreme variability",
  },
  {
    code: "CF-B01",
    type: "bonus",
    points: 3,
    condition: (n) => n.forward_secured_pct >= 45 && n.largest_source_pct <= 35,
    factors: ["forward_secured_pct", "largest_source_pct"],
    description: "Strong visibility with low concentration",
  },
  {
    code: "CF-B02",
    type: "bonus",
    points: 4,
    condition: (n) => n.income_persistence_pct >= 60 && n.labor_dependence_pct <= 35,
    factors: ["income_persistence_pct", "labor_dependence_pct"],
    description: "High persistence with low labor dependence",
  },
];

export const NET_ADJUSTMENT_CLAMP = { min: -12, max: 8 } as const;

// ─── QUALITY RULES ──────────────────────────────────────

export const QUALITY_BASE = 5;
export const QUALITY_CLAMP = { min: 0, max: 10 } as const;

export const QUALITY_RULES: readonly {
  field: string;
  condition: (v: number | string) => boolean;
  delta: number;
  reason: string;
}[] = [
  { field: "recurring_contract_term_months_avg", condition: (v) => (v as number) >= 12, delta: 2, reason: "Long contract terms (12+ months)" },
  { field: "recurring_contract_term_months_avg", condition: (v) => (v as number) >= 6 && (v as number) < 12, delta: 1, reason: "Moderate contract terms (6-11 months)" },
  { field: "recurring_contract_term_months_avg", condition: (v) => (v as number) >= 0 && (v as number) <= 2, delta: -2, reason: "Very short contract terms (0-2 months)" },
  { field: "cancellation_risk_level", condition: (v) => v === "low", delta: 2, reason: "Low cancellation risk" },
  { field: "cancellation_risk_level", condition: (v) => v === "high", delta: -2, reason: "High cancellation risk" },
  { field: "platform_dependency_level", condition: (v) => v === "high", delta: -2, reason: "High platform dependency" },
  { field: "platform_dependency_level", condition: (v) => v === "moderate", delta: -1, reason: "Moderate platform dependency" },
  { field: "customer_concentration_within_recurring_level", condition: (v) => v === "high", delta: -2, reason: "High customer concentration in recurring" },
  { field: "customer_concentration_within_recurring_level", condition: (v) => v === "moderate", delta: -1, reason: "Moderate customer concentration in recurring" },
  { field: "booked_but_cancelable_pct", condition: (v) => (v as number) >= 50, delta: -2, reason: "High cancelable booked revenue" },
];

export const DURABILITY_GRADE_TABLE: readonly [number, number, DurabilityGrade][] = [
  [0, 2, "fragile"],
  [3, 4, "thin"],
  [5, 6, "moderate"],
  [7, 8, "durable"],
  [9, 10, "highly_durable"],
];

// ─── FRAGILITY RULES ────────────────────────────────────

export const FRAGILITY_BASE = 100;

export const FRAGILITY_RULES: readonly {
  condition: (n: CanonicalInput, q: QualityResult, cm: number) => boolean;
  points: number;
  trigger: string;
}[] = [
  { condition: (n) => n.largest_source_pct >= 70, points: -25, trigger: "largest_source_pct >= 70" },
  { condition: (n) => n.labor_dependence_pct >= 80, points: -20, trigger: "labor_dependence_pct >= 80" },
  { condition: (n) => n.forward_secured_pct <= 10, points: -20, trigger: "forward_secured_pct <= 10" },
  { condition: (n) => n.income_variability_level === "high", points: -10, trigger: "variability = high" },
  { condition: (n) => n.income_variability_level === "extreme", points: -20, trigger: "variability = extreme" },
  { condition: (_n, _q, cm) => cm < 1, points: -15, trigger: "continuity_months < 1" },
  { condition: (_n, q) => q.durability_grade === "fragile", points: -15, trigger: "durability_grade = fragile" },
];

export const FRAGILITY_CLASS_TABLE: readonly [number, number, FragilityClass][] = [
  [0,  24,  "brittle"],
  [25, 44,  "thin"],
  [45, 64,  "uneven"],
  [65, 79,  "supported"],
  [80, 100, "resilient"],
];

// ─── SENSITIVITY TEST DEFINITIONS ───────────────────────

export const SENSITIVITY_TESTS: readonly {
  factor: string;
  delta: number;
  description: string;
}[] = [
  { factor: "forward_secured_pct", delta: 15, description: "+15 forward secured %" },
  { factor: "largest_source_pct", delta: -15, description: "-15 largest source %" },
  { factor: "labor_dependence_pct", delta: -15, description: "-15 labor dependence %" },
  { factor: "income_persistence_pct", delta: 15, description: "+15 income persistence %" },
  { factor: "source_diversity_count", delta: 2, description: "+2 income sources" },
  { factor: "quality_score", delta: 2, description: "+2 quality score" },
];

// ─── CONFIDENCE LEVELS ──────────────────────────────────

export const CONFIDENCE_BASE = 100;

export const CONFIDENCE_LEVELS: readonly [number, number, ConfidenceLevel][] = [
  [85, 100, "high"],
  [65, 84,  "moderate"],
  [45, 64,  "guarded"],
  [0,  44,  "low"],
];

// ─── RISK SCENARIO TEMPLATES ────────────────────────────

export const RISK_SCENARIO_TEMPLATES: readonly {
  scenario_id: string;
  label: string;
  description: string;
}[] = [
  { scenario_id: "RS-01", label: "Largest Source Removed", description: "Your single largest income source is lost entirely." },
  { scenario_id: "RS-02", label: "Active Labor Interrupted", description: "You are unable to perform active work for 90 days." },
  { scenario_id: "RS-03", label: "Forward Commitments Delayed", description: "All booked forward revenue is delayed by 3 months." },
  { scenario_id: "RS-04", label: "Recurring Stream Degrades", description: "Your recurring/continuing revenue drops by 40%." },
  { scenario_id: "RS-05", label: "High Volatility Month", description: "You experience a month at your historical low income level." },
  { scenario_id: "RS-06", label: "Platform Dependency Shock", description: "A platform you depend on changes terms or access." },
];

// ─── SCORE LIFT SCENARIO TEMPLATES ──────────────────────

export const LIFT_SCENARIO_TEMPLATES: readonly {
  scenario_id: string;
  label: string;
  factor: string;
  delta: number;
}[] = [
  { scenario_id: "LS-01", label: "Extend Forward Visibility", factor: "forward_secured_pct", delta: 15 },
  { scenario_id: "LS-02", label: "Reduce Concentration", factor: "largest_source_pct", delta: -15 },
  { scenario_id: "LS-03", label: "Reduce Labor Dependence", factor: "labor_dependence_pct", delta: -15 },
  { scenario_id: "LS-04", label: "Increase Persistent Revenue", factor: "income_persistence_pct", delta: 15 },
  { scenario_id: "LS-05", label: "Improve Income Quality", factor: "quality_score", delta: 2 },
];

// ─── CONSTRAINT LABELS ──────────────────────────────────

export const CONSTRAINT_LABELS: Record<ConstraintKey, string> = {
  weak_forward_visibility: "weak forward revenue visibility",
  high_labor_dependence: "high labor dependence",
  high_concentration: "high income concentration",
  low_persistence: "low income persistence",
  high_variability: "high earnings variability",
  weak_durability: "weak income durability",
  shallow_continuity: "shallow income continuity",
};

// ─── FAILURE MODE LABELS ────────────────────────────────

export const FAILURE_MODE_LABELS: Record<string, string> = {
  concentration_collapse: "concentration collapse — over-reliance on a single source",
  labor_interruption: "labor interruption — income stops when you stop",
  visibility_gap: "visibility gap — no forward revenue certainty",
  durability_thinness: "durability thinness — recurring revenue is fragile or cancelable",
};

// ─── VARIABILITY NUMERIC MAPPING ────────────────────────

export const VARIABILITY_TO_NUMERIC: Record<VariabilityLevel, number> = {
  low: 15,
  moderate: 37,
  high: 63,
  extreme: 88,
};
