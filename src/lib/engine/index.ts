// RUNPAYWAY™ Income Stability Score™ Refined Diagnostic System
// Model RP-1.0 | Version 1.0 — Engine Entry Point

import { v4 as uuidv4 } from "uuid";
import { requireVerifiedEngine } from "./integrity";
import { validateDiagnosticInput, validateProfileContext } from "./validation";
import { computeScore } from "./scoring";
import { selectInterpretation } from "./interpretation";
import { computeInputChecksum, computeRecordHash } from "./serialization";
import { generateAuthorizationCode } from "./authentication";
import { getRulesetChecksum } from "./manifest";
import { createStorageBackend } from "./storage";
import {
  computeStructuralIndicators,
  computeLaborAssetPosition,
  computeStructuralIncomeMap,
  computeStabilitySpectrumPosition,
  computePeerPositionMarker,
  selectCurrentEvolutionStage,
  generatePageInsights,
} from "./mappings";
import { getSectorData } from "./sectors";
import { computePeerPercentile, formatPercentileLabel } from "./percentile";
import { computeTrajectoryProjection } from "./trajectory";
import {
  MODEL_VERSION_FULL,
  MANIFEST_ID,
  INTERPRETATION_VERSION,
  APPLICATION_VERSION,
  DEFAULT_REGISTRY_STATUS,
  DEFAULT_VERIFICATION_STATUS,
  DELIVERY_METHOD,
} from "./constants";
import type {
  DiagnosticSubmission,
  StructuralAssessmentRecord,
} from "./types";

export type { DiagnosticSubmission, StructuralAssessmentRecord } from "./types";
export type { ScoringResult, DiagnosticInput, StabilityBand, ProfileContext } from "./types";
export {
  MODEL_VERSION_FULL,
  MODEL_CODE,
  MODEL_DISPLAY_VERSION,
  MODEL_NAME,
  MODEL_ISSUER,
  MANIFEST_ID,
  VERIFICATION_URL,
  FIELD_LABELS,
  STRUCTURAL_PRIORITY_MAP,
  CLASSIFICATIONS,
  OPERATING_STRUCTURES,
  PRIMARY_INCOME_MODELS,
  REVENUE_STRUCTURES,
  INDUSTRY_SECTORS,
  ANSWER_MAP,
  BAND_THRESHOLDS,
  STRUCTURE_WEIGHT_PERCENT,
  STABILITY_WEIGHT_PERCENT,
} from "./constants";
export { CANONICAL_KEYS, STRUCTURE_KEYS, STABILITY_KEYS } from "./types";
export { getRulesetChecksum } from "./manifest";
export { computeScore } from "./scoring";
export { selectInterpretation } from "./interpretation";
export { createStorageBackend } from "./storage";
export {
  computeStructuralIndicators,
  computeLaborAssetPosition,
  computeStructuralIncomeMap,
  computeStabilitySpectrumPosition,
  computePeerPositionMarker,
  selectCurrentEvolutionStage,
  generatePageInsights,
} from "./mappings";
export { SECTOR_DATA, getSectorData } from "./sectors";
export { computePeerPercentile, formatPercentileLabel } from "./percentile";
export { computeTrajectoryProjection } from "./trajectory";
export type { TrajectoryProjection } from "./trajectory";

export async function executeIncomeStabilityEngine(
  submission: DiagnosticSubmission
): Promise<StructuralAssessmentRecord> {
  // Step 1: Verify engine integrity
  requireVerifiedEngine();

  // Step 2: Validate inputs
  const validatedInputs = validateDiagnosticInput(submission.inputs);
  const validatedProfile = validateProfileContext(submission.profile);

  // Step 3: Compute input checksum (used in record, but no longer for idempotency)
  const storage = createStorageBackend();
  const inputChecksum = computeInputChecksum(validatedInputs);
  // CRITICAL FIX: Idempotency shortcut disabled — findByInputChecksum ignores
  // profile context (email, industry, name), so different users with the same
  // 6 inputs would receive each other's reports. Every assessment now produces
  // a unique record.

  // Step 4: Compute deterministic score
  const scoringResult = computeScore(validatedInputs);

  // Step 5: Select interpretation
  const interpretation = selectInterpretation(
    validatedInputs,
    scoringResult.final_score,
    scoringResult.stability_band
  );

  // Step 6: Compute refined diagnostic outputs
  const indicators = computeStructuralIndicators(validatedInputs);
  const laborAsset = computeLaborAssetPosition(validatedInputs, validatedProfile);
  const incomeMap = computeStructuralIncomeMap(validatedInputs);
  const stabilitySpectrumPosition = computeStabilitySpectrumPosition(
    scoringResult.final_score
  );
  const peerPositionMarker = computePeerPositionMarker(
    scoringResult.stability_band
  );

  // Step 7: Sector data
  const sectorData = getSectorData(validatedProfile.industry_sector);
  const evolutionStage = selectCurrentEvolutionStage(
    sectorData.evolution_path_steps,
    validatedProfile,
    validatedInputs,
    scoringResult.final_score
  );

  // Step 8a: Peer percentile (sector-aware)
  const peerPercentile = computePeerPercentile(scoringResult.final_score, sectorData.peer_band_distribution);
  const peerPercentileLabel = formatPercentileLabel(peerPercentile);

  // Step 8b: Stability trajectory projection
  const trajectory = computeTrajectoryProjection(
    validatedInputs,
    interpretation.primary_constraint_key
  );

  // Step 8: Page insights
  const insights = generatePageInsights(
    scoringResult.final_score,
    scoringResult.stability_band,
    interpretation.primary_constraint_label,
    interpretation.structural_priority_label,
    laborAsset.labor_asset_position_label,
    validatedProfile.industry_sector
  );

  // Step 9: Generate record identity
  const recordId = uuidv4();
  const now = new Date();
  const issuedTimestamp = now.toISOString();
  const assessmentDate = issuedTimestamp.split("T")[0];

  // Step 10: Generate authorization code
  const authorizationCode = generateAuthorizationCode(
    recordId,
    validatedInputs,
    issuedTimestamp
  );

  // Step 11: Build engine snapshot
  const engineSnapshot = JSON.stringify({
    inputs: validatedInputs,
    scoring: scoringResult,
    interpretation,
    indicators,
    laborAsset,
    incomeMap,
  });

  // Step 12: Compute record hash
  const recordHashInput = {
    record_id: recordId,
    model_version: MODEL_VERSION_FULL,
    input_checksum: inputChecksum,
    final_score: scoringResult.final_score,
    stability_band: scoringResult.stability_band,
    issued_timestamp_utc: issuedTimestamp,
  };
  const recordHash = computeRecordHash(recordHashInput);

  // Step 13: Build structural_assessment_record
  const record: StructuralAssessmentRecord = {
    // Record identity
    record_id: recordId,
    authorization_code: authorizationCode,
    assessment_date_utc: assessmentDate,
    issued_timestamp_utc: issuedTimestamp,

    // Governance metadata
    manifest_id: MANIFEST_ID,
    model_version: MODEL_VERSION_FULL,
    application_version: APPLICATION_VERSION,
    ruleset_checksum: getRulesetChecksum(),
    interpretation_version: INTERPRETATION_VERSION,
    record_hash: recordHash,

    // Subject linkage
    subject_identifier: validatedProfile.recipient_email,
    recipient_email: validatedProfile.recipient_email,

    // Profile context
    assessment_title: validatedProfile.assessment_title || "",
    classification: validatedProfile.classification,
    operating_structure: validatedProfile.operating_structure,
    primary_income_model: validatedProfile.primary_income_model,
    revenue_structure: validatedProfile.revenue_structure,
    industry_sector: validatedProfile.industry_sector,

    // Canonical engine inputs
    recurring_income_proportion: validatedInputs.recurring_income_proportion,
    income_concentration: validatedInputs.income_concentration,
    number_of_income_sources: validatedInputs.number_of_income_sources,
    forward_revenue_visibility: validatedInputs.forward_revenue_visibility,
    earnings_variability: validatedInputs.earnings_variability,
    income_continuity_without_active_labor:
      validatedInputs.income_continuity_without_active_labor,

    // Engine snapshot
    engine_snapshot: engineSnapshot,

    // Scoring outputs
    final_score: scoringResult.final_score,
    stability_band: scoringResult.stability_band,
    structure_score: scoringResult.structure_score,
    stability_score: scoringResult.stability_score,
    input_checksum: inputChecksum,

    // Interpretation outputs
    ...interpretation,

    // Refined diagnostic outputs
    page_1_key_insight_text: insights.page_1,
    page_2_key_insight_text: insights.page_2,
    page_3_key_insight_text: insights.page_3,
    page_4_key_insight_text: insights.page_4,
    page_5_key_insight_text: insights.page_5,
    page_6_key_insight_text: insights.page_6,

    // Labor-Asset
    ...laborAsset,

    // Structural Income Map
    ...incomeMap,

    // Structural Indicators
    ...indicators,

    // Stability spectrum
    stability_spectrum_position: stabilitySpectrumPosition,

    // Peer benchmark
    peer_benchmark_group_key: sectorData.peer_benchmark_group_key,
    peer_benchmark_group_label: sectorData.peer_benchmark_group_label,
    peer_benchmark_text: sectorData.peer_benchmark_text,
    peer_distribution_payload: JSON.stringify({
      bands: [
        { band: "High Stability", range: "80-100" },
        { band: "Established Stability", range: "60-79" },
        { band: "Developing Stability", range: "40-59" },
        { band: "Limited Stability", range: "0-39" },
      ],
      active_band: scoringResult.stability_band,
    }),
    peer_position_marker: peerPositionMarker,

    // Evolution path
    evolution_path_key: sectorData.evolution_path_key,
    evolution_path_title: sectorData.evolution_path_title,
    evolution_path_steps_payload: JSON.stringify(
      sectorData.evolution_path_steps
    ),
    current_evolution_stage_key: evolutionStage.key,
    current_evolution_stage_label: evolutionStage.label,
    current_evolution_stage_position: evolutionStage.position,
    sector_mechanisms_payload: JSON.stringify(
      sectorData.sector_stability_mechanisms
    ),
    sector_avg_score: sectorData.avg_score,
    sector_top_20_threshold: sectorData.top_20_threshold,
    constraint_guidance_payload: JSON.stringify(sectorData.constraint_guidance),
    structural_improvement_path_text: sectorData.improvement_guidance,
    action_plan_payload: JSON.stringify(sectorData.action_plan[interpretation.primary_constraint_key] || []),

    // Peer percentile
    peer_stability_percentile: peerPercentile,
    peer_stability_percentile_label: peerPercentileLabel,

    // Stability trajectory projection
    projected_final_score: trajectory.projected_final_score,
    projected_stability_band: trajectory.projected_stability_band,
    projected_structure_score: trajectory.projected_structure_score,
    projected_stability_score: trajectory.projected_stability_score,
    trajectory_constraint_key: trajectory.constraint_key,
    trajectory_current_value: trajectory.current_value,
    trajectory_projected_value: trajectory.projected_value,

    // Registry fields
    registry_status: DEFAULT_REGISTRY_STATUS,
    registry_visibility: "private",
    verification_status: DEFAULT_VERIFICATION_STATUS,

    // Delivery metadata
    delivery_method: DELIVERY_METHOD,
    delivery_status: "pending",
  };

  // Step 14: Store record
  await storage.saveRecord(record);

  // Step 15: Supersede prior records for same subject
  await storage.supersedePriorRecords(
    validatedProfile.recipient_email,
    recordId
  );

  return record;
}
