// ═══════════════════════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Commitment Pressure Classification (CPC) v1 Formula Module
// Pure deterministic calculation. No v2 engine dependencies. No side effects.
//
// Locked formula:
// CPI = ((fragility_norm + constraints_norm + concentration_norm + amplification_norm) / 4) × 100
//
// All normalized inputs on [0, 1] scale before multiplying by 100 for final CPI.
// ═══════════════════════════════════════════════════════════════════════════════

export type CPCClass = "CPL" | "CPM" | "CPE" | "CPH" | "CPC";

export interface CPCInput {
  fragility_score: number;        // 0–1 (caller must normalize if provided as 0–100)
  constraint_count: number;       // integer, 1–5
  concentration_factor: number;   // 0–1
  scenario_amplification: number; // 0.3–1.5
}

export interface CPCNormalizedInputs {
  fragility_norm: number;         // 0–1 (clamped)
  constraints_norm: number;       // 0–1 (clamped)
  concentration_norm: number;     // 0–1 (clamped)
  amplification_norm: number;     // 0–1 (clamped)
}

export interface CPCResult {
  classification: CPCClass;       // Final CPC class (CPL|CPM|CPE|CPH|CPC)
  cpi_internal: number;           // Final CPI value (0–100)
  normalized_inputs: CPCNormalizedInputs;
  threshold_trace: {
    cpi_final: number;            // After clamping to 0–100
    threshold_applied: number;    // The boundary value that matched
    rule_matched: string;         // "CPI >= 80" | "CPI >= 60" | "CPI >= 40" | "CPI >= 20" | "CPI < 20"
  };
  model_version: "cpc_v1_baseline";
  threshold_version: "cpc_thresholds_v1";
}

/**
 * Clamp a value to [0, 1] range.
 * Used for all normalized dimensions.
 */
export function clampNormalized(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Clamp CPI to [0, 100] range.
 * Used before threshold classification.
 */
export function clampCPI(cpi: number): number {
  return Math.max(0, Math.min(100, cpi));
}

/**
 * Normalize constraint count (1–5 integer) to [0, 1] range.
 * Formula: (constraint_count - 1) / 4
 *
 * Mappings:
 * 1 constraint → 0.00
 * 2 constraints → 0.25
 * 3 constraints → 0.50
 * 4 constraints → 0.75
 * 5 constraints → 1.00
 */
export function normalizeConstraintCount(count: number): number {
  return (count - 1) / 4;
}

/**
 * Normalize scenario amplification (0.3–1.5) to [0, 1] range.
 * Formula: (scenario_amplification - 0.3) / 1.2
 *
 * Mappings:
 * 0.3 → 0.00
 * 0.95 → ~0.542
 * 1.5 → 1.00
 */
export function normalizeScenarioAmplification(amplification: number): number {
  return (amplification - 0.3) / 1.2;
}

/**
 * Compute CPI from normalized inputs.
 * Locked formula (no modifications):
 * CPI = ((fragility_norm + constraints_norm + concentration_norm + amplification_norm) / 4) × 100
 *
 * All inputs must be on [0, 1] scale.
 * Output is scaled to [0, 100] before clamping.
 */
export function computeCPI(normalized: CPCNormalizedInputs): number {
  const average =
    (normalized.fragility_norm +
      normalized.constraints_norm +
      normalized.concentration_norm +
      normalized.amplification_norm) /
    4;
  return average * 100;
}

/**
 * Classify CPC based on CPI.
 * Locked thresholds with boundary rule (exact thresholds assign to higher-pressure class):
 *
 * CPL: CPI < 20
 * CPM: CPI >= 20 and < 40
 * CPE: CPI >= 40 and < 60
 * CPH: CPI >= 60 and < 80
 * CPC: CPI >= 80
 */
export function classifyCPC(cpi: number): CPCClass {
  if (cpi >= 80) return "CPC";
  if (cpi >= 60) return "CPH";
  if (cpi >= 40) return "CPE";
  if (cpi >= 20) return "CPM";
  return "CPL";
}

/**
 * Compute full CPC classification from four normalized inputs.
 * Orchestrates normalization, CPI calculation, and threshold classification.
 *
 * Input validation: caller must ensure inputs are in valid ranges:
 * - fragility_score: 0–1
 * - constraint_count: 1–5 (integer)
 * - concentration_factor: 0–1
 * - scenario_amplification: 0.3–1.5
 */
export function computeCPCFromInputs(input: CPCInput): CPCResult {
  // Normalize all dimensions to [0, 1]
  const normalized: CPCNormalizedInputs = {
    fragility_norm: clampNormalized(input.fragility_score),
    constraints_norm: clampNormalized(
      normalizeConstraintCount(input.constraint_count)
    ),
    concentration_norm: clampNormalized(input.concentration_factor),
    amplification_norm: clampNormalized(
      normalizeScenarioAmplification(input.scenario_amplification)
    ),
  };

  // Compute raw CPI (may be >100 or <0 due to clamping edge cases)
  const cpi_raw = computeCPI(normalized);

  // Clamp CPI to [0, 100]
  const cpi_final = clampCPI(cpi_raw);

  // Classify
  const classification = classifyCPC(cpi_final);

  // Determine threshold trace
  let threshold_applied: number;
  let rule_matched: string;

  if (cpi_final >= 80) {
    threshold_applied = 80;
    rule_matched = "CPI >= 80";
  } else if (cpi_final >= 60) {
    threshold_applied = 60;
    rule_matched = "CPI >= 60";
  } else if (cpi_final >= 40) {
    threshold_applied = 40;
    rule_matched = "CPI >= 40";
  } else if (cpi_final >= 20) {
    threshold_applied = 20;
    rule_matched = "CPI >= 20";
  } else {
    threshold_applied = 0;
    rule_matched = "CPI < 20";
  }

  return {
    classification,
    cpi_internal: Math.round(cpi_final * 10) / 10, // Round to 1 decimal
    normalized_inputs: normalized,
    threshold_trace: {
      cpi_final,
      threshold_applied,
      rule_matched,
    },
    model_version: "cpc_v1_baseline",
    threshold_version: "cpc_thresholds_v1",
  };
}
