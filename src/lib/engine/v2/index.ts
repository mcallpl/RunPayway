// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Model RP-2.0 Engine Orchestrator
// Deterministic Structural Income Diagnostic Platform
//
// This is the single entry point for the v2 scoring pipeline.
// All engines are pure functions. Identical inputs always produce
// identical outputs.
// ═══════════════════════════════════════════════════════════════

import { randomUUID } from "crypto";

import type {
  RawDiagnosticInput,
  ProfileContext,
  ExtendedInputs,
  CanonicalInput,
  AssessmentRecord,
  ReasonCode,
  StabilityBand,
} from "./types";

// Engine imports
import { validateInputs, validateProfile, validateExtendedInputs } from "./engines/01-input-validation";
import { resolveProfileContext } from "./engines/02-profile-context";
import { normalizeInputs } from "./engines/03-income-normalization";
import { computeRawScores } from "./engines/04-scoring";
import { classifyBand, getBand } from "./engines/05-band-classification";
import { computeIndicators } from "./engines/06-structural-indicators";
import { computeInteractions, applyInteractions } from "./engines/07-cross-factor-dependency";
import { computeQuality } from "./engines/08-income-quality";
import { computeConstraints } from "./engines/09-constraint-hierarchy";
import { computeFragility } from "./engines/10-fragility";
import { computeSensitivity } from "./engines/11-sensitivity";
import { computeRiskScenarios } from "./engines/12-risk-scenarios";
import { computeScoreLift } from "./engines/13-score-lift";
import { computeConfidence } from "./engines/14-diagnostic-confidence";
import { generateExplainability } from "./engines/15-explainability";
import { prioritizeActions } from "./engines/16-action-prioritization";
import { computeReassessmentTriggers } from "./engines/17-reassessment-triggers";
import { computeBenchmarks } from "./engines/18-benchmarking";
import { computeComparison } from "./engines/19-comparative-reassessment";
import { computeIntegrity, getModelManifest } from "./engines/20-integrity-manifest";
import { REASON_CODES } from "./reason-codes";
import { executeOutcomeLayer } from "./outcome/index";
import type { RawIntakeFields } from "./outcome/types";

/**
 * Compute the overall score from canonical inputs + extended inputs.
 * Used by sensitivity, risk, and lift engines for "what-if" calculations.
 */
function computeOverallScore(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
): number {
  const rawScores = computeRawScores(n);
  const quality = computeQuality(n, ext);
  const interactions = computeInteractions(n, ext);
  const scores = applyInteractions(rawScores, interactions, quality.quality_score, 0);
  return scores.overall_score;
}

/** Simplified score compute for scenario engines (no extended inputs in what-if) */
function computeScoreSimple(n: CanonicalInput): number {
  return computeOverallScore(n, null);
}

export interface ExecuteAssessmentOptions {
  rawInputs: unknown;
  profile: unknown;
  extendedInputs?: unknown;
  intakeFields?: unknown;
  priorAssessment?: {
    assessment_id: string;
    overall_score: number;
    primary_band: StabilityBand;
    normalized_inputs: CanonicalInput;
  } | null;
}

/**
 * Execute the full 20-engine deterministic assessment pipeline.
 *
 * This function is pure given fixed inputs and a fixed randomUUID seed.
 * The only non-deterministic element is the assessment_id (UUID).
 */
export function executeAssessment(opts: ExecuteAssessmentOptions): AssessmentRecord {
  const reason_codes: ReasonCode[] = [];

  // ── 1. Validate ───────────────────────────────────────
  const validated = validateInputs(opts.rawInputs);
  const validatedProfile = validateProfile(opts.profile);
  const validatedExtended = validateExtendedInputs(opts.extendedInputs);

  if (!validatedExtended) {
    reason_codes.push(REASON_CODES["VAL-003"]);
  }

  // ── 2. Profile Context Resolution ─────────────────────
  const resolvedProfile = resolveProfileContext(validatedProfile);
  reason_codes.push(REASON_CODES["CTX-001"]);

  // ── 3. Normalize ──────────────────────────────────────
  const normalized = normalizeInputs(validated);
  reason_codes.push(REASON_CODES["NRM-001"]);

  // ── 4. Raw Scores ─────────────────────────────────────
  const rawScores = computeRawScores(normalized);
  reason_codes.push(REASON_CODES["SCR-001"]);

  // ── 5. Quality ────────────────────────────────────────
  const quality = computeQuality(normalized, validatedExtended);
  reason_codes.push(
    validatedExtended ? REASON_CODES["QAL-001"] : REASON_CODES["QAL-002"],
  );

  // ── 6. Cross-Factor Interactions ──────────────────────
  const interactions = computeInteractions(normalized, validatedExtended);
  if (interactions.effects.length === 0) {
    reason_codes.push(REASON_CODES["INT-001"]);
  } else {
    if (interactions.total_penalty < 0) reason_codes.push(REASON_CODES["INT-002"]);
    if (interactions.total_bonus > 0) reason_codes.push(REASON_CODES["INT-003"]);
  }

  // ── 7. Fragility (needs continuity_months from raw scores) ──
  const fragility = computeFragility(
    normalized,
    quality,
    rawScores.continuity_months,
  );
  reason_codes.push(REASON_CODES["FRG-001"]);
  if (fragility.fragility_class === "brittle") {
    reason_codes.push(REASON_CODES["FRG-002"]);
  }
  if (fragility.secondary_failure_modes.length > 0) {
    reason_codes.push(REASON_CODES["FRG-003"]);
  }

  // ── 8. Apply Interactions → Final Scores ──────────────
  const scores = applyInteractions(
    rawScores,
    interactions,
    quality.quality_score,
    fragility.fragility_score,
  );
  reason_codes.push(REASON_CODES["SCR-002"]);
  reason_codes.push(REASON_CODES["SCR-003"]);

  // ── 9. Band Classification ────────────────────────────
  const bands = classifyBand(
    scores.overall_score,
    normalized,
    fragility.fragility_score,
  );

  // ── 10. Structural Indicators ─────────────────────────
  const indicators = computeIndicators(normalized);
  reason_codes.push(REASON_CODES["IND-001"]);

  // ── 11. Constraint Hierarchy ──────────────────────────
  const constraints = computeConstraints(
    normalized,
    rawScores,
    interactions,
    quality,
  );
  reason_codes.push(REASON_CODES["CON-001"]);
  if (constraints.hidden_unlock) {
    reason_codes.push(REASON_CODES["CON-002"]);
  }

  // ── 12. Sensitivity ───────────────────────────────────
  const sensitivity = computeSensitivity(
    normalized,
    validatedExtended,
    scores.overall_score,
    (modified, ext) => computeOverallScore(modified, ext),
  );
  reason_codes.push(REASON_CODES["SEN-001"]);

  // ── 13. Risk Scenarios ────────────────────────────────
  const scenarios = computeRiskScenarios(
    normalized,
    scores.overall_score,
    bands.primary_band,
    computeScoreSimple,
  );
  reason_codes.push(REASON_CODES["SCN-001"]);
  if (scenarios.some((s) => s.band_shift)) {
    reason_codes.push(REASON_CODES["SCN-002"]);
  }

  // ── 14. Score Lift ────────────────────────────────────
  const scoreLift = computeScoreLift(
    normalized,
    validatedExtended,
    scores.overall_score,
    bands.primary_band,
    computeScoreSimple,
  );
  reason_codes.push(REASON_CODES["LFT-001"]);

  // ── 15. Diagnostic Confidence ─────────────────────────
  const confidence = computeConfidence(
    normalized,
    validatedExtended,
    resolvedProfile,
    sensitivity,
  );
  reason_codes.push(REASON_CODES["CNF-001"]);
  if (confidence.confidence_level === "guarded" || confidence.confidence_level === "low") {
    reason_codes.push(REASON_CODES["CNF-003"]);
  }

  // ── 16. Benchmarking ───────────────────────────────────
  const benchmarks = computeBenchmarks(
    scores,
    resolvedProfile,
    indicators,
  );
  reason_codes.push(REASON_CODES["BNK-001"]);

  // ── 17. Explainability ────────────────────────────────
  const explainability = generateExplainability(
    scores,
    bands,
    constraints,
    interactions,
    sensitivity,
    fragility,
    quality,
    normalized,
    benchmarks,
    resolvedProfile,
  );
  reason_codes.push(REASON_CODES["EXP-001"]);

  // ── 18. Action Prioritization ─────────────────────────
  const actions = prioritizeActions(
    constraints,
    fragility,
    sensitivity,
    resolvedProfile,
    normalized,
  );
  reason_codes.push(REASON_CODES["ACT-001"]);

  // ── 19. Reassessment Triggers ─────────────────────────
  const reassessmentTriggers = computeReassessmentTriggers(
    normalized,
    quality,
  );
  reason_codes.push(REASON_CODES["RSA-001"]);

  // ── 20. Comparative Reassessment ──────────────────────
  const comparison = opts.priorAssessment
    ? computeComparison(scores, normalized, opts.priorAssessment)
    : null;

  // ── 21. Integrity ─────────────────────────────────────
  const assessmentId = randomUUID();
  const integrity = computeIntegrity(normalized, scores, assessmentId);
  reason_codes.push(REASON_CODES["IGT-001"]);

  // ── Assemble Record ───────────────────────────────────
  const record: AssessmentRecord = {
    assessment_id: assessmentId,
    created_at: new Date().toISOString(),
    model_manifest: getModelManifest(),

    raw_inputs: validated,
    validated_inputs: validated,
    normalized_inputs: normalized,
    profile_context: validatedProfile,
    resolved_profile: resolvedProfile,
    extended_inputs: validatedExtended,

    scores,
    raw_scores: rawScores,
    bands,

    indicators,
    interactions,
    quality,
    constraints,
    fragility,
    sensitivity,
    scenarios,
    score_lift_projection: scoreLift,
    confidence,

    explainability,
    recommended_actions: actions.recommended_actions,
    avoid_actions: actions.avoid_actions,
    execution_roadmap: actions.execution_roadmap,
    script_templates: actions.script_templates,
    reassessment_triggers: reassessmentTriggers,
    benchmarks,
    comparison,

    reason_codes,
    integrity,
  };

  // ── 22. Outcome Layer (OL-1.0) ──────────────────────
  record.outcome_layer = executeOutcomeLayer(
    record,
    (opts.intakeFields as RawIntakeFields) ?? null,
  );

  return record;
}

// Re-export types and utilities
export type { AssessmentRecord, RawDiagnosticInput, ProfileContext, ExtendedInputs } from "./types";
export { getModelManifest, computeManifestHash } from "./engines/20-integrity-manifest";
export { getBand } from "./engines/05-band-classification";
