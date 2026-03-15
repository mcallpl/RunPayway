// RUNPAYWAY™ — Client-Side Engine for Static Export
// Runs the same deterministic scoring logic in the browser
// when the server API is unavailable (static GoDaddy deployment).

import { computeScore } from "./engine/scoring";
import { selectInterpretation } from "./engine/interpretation";
import { validateDiagnosticInput, validateProfileContext } from "./engine/validation";
import {
  computeStructuralIndicators,
  computeLaborAssetPosition,
  computeStructuralIncomeMap,
  computeStabilitySpectrumPosition,
  computePeerPositionMarker,
  selectCurrentEvolutionStage,
  generatePageInsights,
} from "./engine/mappings";
import { getSectorData, filterActionPlan } from "./engine/sectors";
import { computePeerPercentile, formatPercentileLabel } from "./engine/percentile";
import { computeTrajectoryProjection } from "./engine/trajectory";
import {
  MODEL_VERSION_FULL,
  MANIFEST_ID,
  INTERPRETATION_VERSION,
  APPLICATION_VERSION,
  DEFAULT_REGISTRY_STATUS,
  DEFAULT_VERIFICATION_STATUS,
  DELIVERY_METHOD,
} from "./engine/constants";
import { CANONICAL_KEYS, type DiagnosticInput } from "./engine/types";

// Browser-compatible SHA-256 using Web Crypto API
async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeInputChecksumBrowser(input: DiagnosticInput): Promise<string> {
  const ordered: Record<string, number> = {};
  for (const key of CANONICAL_KEYS) {
    ordered[key] = input[key];
  }
  return sha256(JSON.stringify(ordered));
}

async function computeRecordHashBrowser(fields: Record<string, unknown>): Promise<string> {
  const sorted = JSON.stringify(fields, Object.keys(fields).sort());
  return sha256(sorted);
}

async function generateAuthCodeBrowser(
  recordId: string,
  input: DiagnosticInput,
  issuedTimestamp: string
): Promise<string> {
  const parts: string[] = [recordId];
  for (const key of CANONICAL_KEYS) {
    parts.push(`${key}=${input[key]}`);
  }
  parts.push(issuedTimestamp);
  return sha256(parts.join("|"));
}

export async function executeClientEngine(submission: {
  profile: Record<string, unknown>;
  inputs: Record<string, unknown>;
}) {
  // Validate
  const validatedInputs = validateDiagnosticInput(submission.inputs);
  const validatedProfile = validateProfileContext(submission.profile);

  // Score
  const scoringResult = computeScore(validatedInputs);

  // Interpret
  const interpretation = selectInterpretation(
    validatedInputs,
    scoringResult.final_score,
    scoringResult.stability_band
  );

  // Refined outputs
  const indicators = computeStructuralIndicators(validatedInputs);
  const laborAsset = computeLaborAssetPosition(validatedInputs, validatedProfile);
  const incomeMap = computeStructuralIncomeMap(validatedInputs);
  const stabilitySpectrumPosition = computeStabilitySpectrumPosition(scoringResult.final_score);
  const peerPositionMarker = computePeerPositionMarker(scoringResult.stability_band);

  // Sector data
  const sectorData = getSectorData(validatedProfile.industry_sector);
  const evolutionStage = selectCurrentEvolutionStage(
    sectorData.evolution_path_steps,
    validatedProfile,
    validatedInputs,
    scoringResult.final_score
  );

  // Peer percentile (sector-aware)
  const peerPercentile = computePeerPercentile(scoringResult.final_score, sectorData.peer_band_distribution);
  const peerPercentileLabel = formatPercentileLabel(peerPercentile);

  // Trajectory
  const trajectory = computeTrajectoryProjection(
    validatedInputs,
    interpretation.primary_constraint_key
  );

  // Page insights
  const insights = generatePageInsights(
    scoringResult.final_score,
    scoringResult.stability_band,
    interpretation.primary_constraint_label,
    interpretation.structural_priority_label,
    laborAsset.labor_asset_position_label,
    validatedProfile.industry_sector
  );

  // Record identity (browser-compatible UUID)
  const recordId = crypto.randomUUID();
  const now = new Date();
  const issuedTimestamp = now.toISOString();
  const assessmentDate = issuedTimestamp.split("T")[0];

  // Browser-compatible hashing
  const inputChecksum = await computeInputChecksumBrowser(validatedInputs);
  const authorizationCode = await generateAuthCodeBrowser(recordId, validatedInputs, issuedTimestamp);
  const recordHash = await computeRecordHashBrowser({
    record_id: recordId,
    model_version: MODEL_VERSION_FULL,
    input_checksum: inputChecksum,
    final_score: scoringResult.final_score,
    stability_band: scoringResult.stability_band,
    issued_timestamp_utc: issuedTimestamp,
  });

  // Build record (same shape as server response)
  return {
    record_id: recordId,
    authorization_code: authorizationCode,
    model_version: MODEL_VERSION_FULL,
    assessment_date_utc: assessmentDate,
    issued_timestamp_utc: issuedTimestamp,
    manifest_id: MANIFEST_ID,
    application_version: APPLICATION_VERSION,
    interpretation_version: INTERPRETATION_VERSION,
    record_hash: recordHash,
    input_checksum: inputChecksum,

    // Profile
    assessment_title: validatedProfile.assessment_title || "",
    classification: validatedProfile.classification,
    operating_structure: validatedProfile.operating_structure,
    primary_income_model: validatedProfile.primary_income_model,
    revenue_structure: validatedProfile.revenue_structure,
    industry_sector: validatedProfile.industry_sector,

    // Inputs
    recurring_income_proportion: validatedInputs.recurring_income_proportion,
    income_concentration: validatedInputs.income_concentration,
    number_of_income_sources: validatedInputs.number_of_income_sources,
    forward_revenue_visibility: validatedInputs.forward_revenue_visibility,
    earnings_variability: validatedInputs.earnings_variability,
    income_continuity_without_active_labor: validatedInputs.income_continuity_without_active_labor,

    // Score
    final_score: scoringResult.final_score,
    stability_band: scoringResult.stability_band,
    structure_score: scoringResult.structure_score,
    stability_score: scoringResult.stability_score,

    // Interpretation
    ...interpretation,

    // Page insights
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
    evolution_path_steps_payload: JSON.stringify(sectorData.evolution_path_steps),
    current_evolution_stage_key: evolutionStage.key,
    current_evolution_stage_label: evolutionStage.label,
    current_evolution_stage_position: evolutionStage.position,
    sector_mechanisms_payload: JSON.stringify(sectorData.sector_stability_mechanisms),
    sector_avg_score: sectorData.avg_score,
    sector_top_20_threshold: sectorData.top_20_threshold,
    constraint_guidance_payload: JSON.stringify(sectorData.constraint_guidance),
    structural_improvement_path_text: sectorData.improvement_guidance,
    action_plan_payload: JSON.stringify(
      filterActionPlan(
        sectorData.action_plan[interpretation.primary_constraint_key] || [],
        interpretation.primary_constraint_key,
        { primary_income_model: validatedProfile.primary_income_model, revenue_structure: validatedProfile.revenue_structure }
      )
    ),

    // Peer percentile
    peer_stability_percentile: peerPercentile,
    peer_stability_percentile_label: peerPercentileLabel,

    // Trajectory
    projected_final_score: trajectory.projected_final_score,
    projected_stability_band: trajectory.projected_stability_band,
    projected_structure_score: trajectory.projected_structure_score,
    projected_stability_score: trajectory.projected_stability_score,
    trajectory_constraint_key: trajectory.constraint_key,

    // Registry
    registry_visibility: "private",
    registry_status: DEFAULT_REGISTRY_STATUS,
    verification_status: DEFAULT_VERIFICATION_STATUS,
    delivery_method: DELIVERY_METHOD,
  };
}
