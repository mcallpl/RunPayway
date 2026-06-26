// ═══════════════════════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Internal CPC Computation Service
// Pure, deterministic orchestrator for Commitment Pressure Classification.
//
// This service:
// - Adapts AssessmentRecord to CPCInput
// - Computes CPC classification using locked formula
// - Returns internal-only result object
// - Does not mutate AssessmentRecord
// - Does not persist, audit, or expose publicly
// - No timestamps, no random, no side effects
// ═══════════════════════════════════════════════════════════════════════════════

import type { AssessmentRecord } from "../engine/v2/types";
import type { CPCInput, CPCResult } from "./formula";
import { computeCPCFromInputs } from "./formula";
import { adaptToCPCInput, validateCPCInput } from "./v2-input-adapter";

// ─── TYPES ──────────────────────────────────────────────────────────────────

/**
 * Internal result object for CPC computation.
 * Completely separate from AssessmentRecord.
 * Contains adapter output and formula result.
 * Not attached to record, not persisted, not exposed publicly.
 */
export interface InternalCPCComputationResult {
  /** Optional reference to source AssessmentRecord.id (for audit tracing) */
  assessment_id?: string;

  /** Extracted CPC inputs (fragility, constraints, concentration, amplification) */
  cpc_input: CPCInput;

  /** CPC formula result (classification, CPI, traces, versions) */
  cpc_result: CPCResult;

  /** Model version identifier */
  model_version: "cpc_v1_baseline";

  /** Threshold version identifier */
  threshold_version: "cpc_thresholds_v1";
}

// ─── FUNCTIONS ──────────────────────────────────────────────────────────────

/**
 * Compute internal CPC from an AssessmentRecord.
 * Pure, deterministic orchestration of adapter and formula.
 *
 * Steps:
 * 1. Adapt AssessmentRecord to CPCInput
 * 2. Validate CPCInput
 * 3. Compute CPC classification
 * 4. Return internal result object
 *
 * Does not mutate the input record.
 * Does not persist or create audit events.
 * Throws deterministic error if input is invalid.
 *
 * @param record - v2 AssessmentRecord (not mutated)
 * @returns InternalCPCComputationResult (separate from record)
 * @throws Error if CPCInput validation fails
 */
export function computeInternalCPC(
  record: AssessmentRecord
): InternalCPCComputationResult {
  // Step 1: Adapt AssessmentRecord to CPCInput
  const cpc_input = adaptToCPCInput(record);

  // Step 2: Validate CPCInput
  if (!validateCPCInput(cpc_input)) {
    throw new Error("Invalid CPC input generated from AssessmentRecord");
  }

  // Step 3: Compute CPC classification
  const cpc_result = computeCPCFromInputs(cpc_input);

  // Step 4: Return internal result object
  return {
    assessment_id: record.assessment_id,
    cpc_input,
    cpc_result,
    model_version: "cpc_v1_baseline",
    threshold_version: "cpc_thresholds_v1",
  };
}

/**
 * Compute internal CPC from a pre-validated CPCInput.
 * Useful for testing, audit replays, or direct input scenarios.
 *
 * Steps:
 * 1. Validate CPCInput
 * 2. Compute CPC classification
 * 3. Return internal result object
 *
 * Does not call adapter (assumes input is already prepared).
 * Throws deterministic error if input is invalid.
 *
 * @param input - Pre-prepared CPCInput
 * @param assessmentId - Optional reference to source assessment
 * @returns InternalCPCComputationResult
 * @throws Error if CPCInput validation fails
 */
export function computeInternalCPCFromInput(
  input: CPCInput,
  assessmentId?: string
): InternalCPCComputationResult {
  // Step 1: Validate CPCInput
  if (!validateCPCInput(input)) {
    throw new Error("Invalid CPC input");
  }

  // Step 2: Compute CPC classification
  const cpc_result = computeCPCFromInputs(input);

  // Step 3: Return internal result object
  return {
    assessment_id: assessmentId,
    cpc_input: input,
    cpc_result,
    model_version: "cpc_v1_baseline",
    threshold_version: "cpc_thresholds_v1",
  };
}
