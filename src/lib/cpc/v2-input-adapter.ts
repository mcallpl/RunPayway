// ═══════════════════════════════════════════════════════════════════════════════
// RUNPAYWAY™ — CPC V2-to-Input Adapter
// Maps AssessmentRecord (v2 engine output) to CPCInput for CPC formula computation.
//
// This adapter is pure and deterministic:
// - No side effects
// - No database access
// - No external service calls
// - No final_score dependencies
// - No stability_band dependencies
// - Not integrated into v2 engine or routes
// ═══════════════════════════════════════════════════════════════════════════════

import type { AssessmentRecord } from "../engine/v2/types";
import type { CPCInput } from "./formula";

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

// ─── EXTRACTION FUNCTIONS ───────────────────────────────────────────────────

/**
 * Extract fragility_score from AssessmentRecord.
 *
 * Source: record.fragility.fragility_score
 * Expected range: 0 to 1 (normalized by v2 engine)
 * Returns: 0 to 1 (clamped defensively)
 *
 * Independent from: final_score, stability_band
 */
export function extractFragilityScore(record: AssessmentRecord): number {
  const score = record.fragility.fragility_score ?? 0;
  return clamp(score, 0, 1);
}

/**
 * Extract constraint_count from AssessmentRecord.
 *
 * Source: record.constraints (ConstraintHierarchy)
 * Counts non-null constraint slots:
 *   - root_constraint (always present)
 *   - primary_constraint (always present)
 *   - secondary_constraint (always present)
 *   - dependent_constraint (may be null)
 *   - hidden_unlock (may be null)
 *
 * Returns: 1 to 5 (clamped to valid range)
 * Minimum 3 (root, primary, secondary always present)
 * Maximum 5 (all 5 slots filled)
 *
 * Independent from: final_score, stability_band
 */
export function extractConstraintCount(record: AssessmentRecord): number {
  const hierarchy = record.constraints;

  // Count non-null constraint slots
  let count = 0;

  if (hierarchy.root_constraint) count++;
  if (hierarchy.primary_constraint) count++;
  if (hierarchy.secondary_constraint) count++;
  if (hierarchy.dependent_constraint) count++;
  if (hierarchy.hidden_unlock) count++;

  // Clamp to valid CPC range [1, 5]
  return clamp(count, 1, 5);
}

/**
 * Extract concentration_factor from AssessmentRecord.
 *
 * Source: record.normalized_inputs.largest_source_pct (structural input)
 * Expected range: 0 to 1 (percentage of revenue from largest source)
 * Returns: 0 to 1 (clamped defensively)
 *
 * Independent from: final_score, stability_band, scores
 */
export function extractConcentrationFactor(record: AssessmentRecord): number {
  const pct = record.normalized_inputs?.largest_source_pct ?? 0.5;
  // Normalize 0-100 percentage to 0-1 if needed
  const normalized = pct > 1 ? pct / 100 : pct;
  return clamp(normalized, 0, 1);
}

/**
 * Extract scenario_amplification from AssessmentRecord.
 *
 * V1 Baseline: Constant 1.0
 *
 * Rationale:
 * - Scenarios in v2 engine measure score drops under stress (downside risk)
 * - Lift projections measure score improvements (upside potential)
 * - Neither directly represents "pressure amplification" (stress multiplier)
 * - Both depend on final_score baseline for interpretation
 * - Using them would create hidden dependency on score computation logic
 *
 * Solution:
 * - Use neutral constant 1.0: "structural stress has unit impact on pressure"
 * - Preserves independence from final_score and stability_band
 * - Allows Phase 8 CPC implementation without blocking on perfect engine
 * - Can be replaced when pressure-amplification engine is designed
 *
 * Returns: Constant 1.0 (no amplification beyond structural stress)
 *
 * Independent from: final_score, stability_band, scenarios, lift projections
 */
export function extractScenarioAmplification(
  _record: AssessmentRecord,
): number {
  // V1 baseline: unit amplification (no amplification)
  // This preserves determinism and independence from score logic
  return 1.0;
}

// ─── ADAPTER FUNCTION ───────────────────────────────────────────────────────

/**
 * Adapt an AssessmentRecord into CPCInput.
 *
 * Orchestrates all four input extractions and returns a complete CPCInput
 * ready for computeCPCFromInputs() in the CPC formula module.
 *
 * Preconditions:
 * - record is a valid AssessmentRecord from v2 engine
 *
 * Postconditions:
 * - Returned CPCInput is valid (validateCPCInput returns true)
 * - All values are clamped to valid ranges
 * - No side effects
 * - No external dependencies
 */
export function adaptToCPCInput(record: AssessmentRecord): CPCInput {
  const input: CPCInput = {
    fragility_score: extractFragilityScore(record),
    constraint_count: extractConstraintCount(record),
    concentration_factor: extractConcentrationFactor(record),
    scenario_amplification: extractScenarioAmplification(record),
  };

  return input;
}

// ─── VALIDATION FUNCTION ────────────────────────────────────────────────────

/**
 * Validate a CPCInput for correctness.
 *
 * Returns true only if all fields are within valid ranges:
 * - fragility_score: [0, 1]
 * - constraint_count: [1, 5]
 * - concentration_factor: [0, 1]
 * - scenario_amplification: [0.3, 1.5]
 *
 * All values must be finite numbers.
 */
export function validateCPCInput(input: CPCInput): boolean {
  // Fragility score: 0 to 1
  if (
    !Number.isFinite(input.fragility_score) ||
    input.fragility_score < 0 ||
    input.fragility_score > 1
  ) {
    return false;
  }

  // Constraint count: 1 to 5 (must be integer)
  if (
    !Number.isFinite(input.constraint_count) ||
    !Number.isInteger(input.constraint_count) ||
    input.constraint_count < 1 ||
    input.constraint_count > 5
  ) {
    return false;
  }

  // Concentration factor: 0 to 1
  if (
    !Number.isFinite(input.concentration_factor) ||
    input.concentration_factor < 0 ||
    input.concentration_factor > 1
  ) {
    return false;
  }

  // Scenario amplification: 0.3 to 1.5
  if (
    !Number.isFinite(input.scenario_amplification) ||
    input.scenario_amplification < 0.3 ||
    input.scenario_amplification > 1.5
  ) {
    return false;
  }

  return true;
}
