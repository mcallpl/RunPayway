// RUNPAYWAY™ — V2 → V1 Output Adapter
// Maps the v2 AssessmentRecord to the flat field structure
// expected by the existing review/page.tsx report renderer.
// This adapter enables the v2 engine to power the existing UI
// without requiring a full report page rewrite.

import type { AssessmentRecord } from "./engine/v2/types";
import { CONSTRAINT_LABELS, FAILURE_MODE_LABELS } from "./engine/v2/constants";

export function adaptV2ToV1(r: AssessmentRecord): Record<string, unknown> {
  // Constraint → driver/suppressor text generation
  const constraintLabel = CONSTRAINT_LABELS[r.constraints.root_constraint];
  const primaryLabel = CONSTRAINT_LABELS[r.constraints.primary_constraint];
  const secondaryLabel = CONSTRAINT_LABELS[r.constraints.secondary_constraint];

  // Build indicator labels in V1 format ("Very Low" / "Low" / "Moderate" / "High" / "Very High")
  const indicatorMap: Record<string, string> = {};
  for (const ind of r.indicators) {
    const label = ind.level.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    indicatorMap[ind.key] = label;
  }

  // Find key indicators by key
  const getIndicator = (key: string) => r.indicators.find((i) => i.key === key);

  // Build peer band distribution payload
  const peerDistPayload = r.benchmarks
    ? JSON.stringify({
        limited: r.benchmarks.peer_band_distribution.limited,
        developing: r.benchmarks.peer_band_distribution.developing,
        established: r.benchmarks.peer_band_distribution.established,
        high: r.benchmarks.peer_band_distribution.high,
      })
    : "{}";

  // Build advisor discussion guide payload from explainability
  const advisorGuide = JSON.stringify({
    talking_points: [
      r.explainability.why_this_score,
      r.explainability.why_not_higher,
      r.explainability.interaction_summary,
    ].filter(Boolean),
    client_questions: r.reassessment_triggers.map((t) => t.description),
    red_flags: r.explainability.strongest_suppressors,
    next_steps: r.recommended_actions.slice(0, 4).map((a) => a.description),
  });

  // Build product recommendations payload from actions
  const productRecs = JSON.stringify(
    r.recommended_actions.slice(0, 4).map((a) => ({
      category: a.label,
      rationale: a.description,
      urgency: a.priority <= 1 ? "High" : a.priority <= 2 ? "Medium" : "Low",
    })),
  );

  // Build action plan payload
  const actionPlan = JSON.stringify(
    r.recommended_actions.map((a) => a.description),
  );

  // Build constraint guidance payload
  const constraintGuidance = JSON.stringify({
    [r.constraints.root_constraint]: r.explainability.why_not_higher,
    [r.constraints.primary_constraint]: `${primaryLabel} is a secondary constraint limiting improvement.`,
  });

  // Evolution path (simplified from v2 data)
  const evolutionSteps = JSON.stringify([
    { label: "Early Stage", position: 0 },
    { label: "Developing", position: 25 },
    { label: "Established", position: 50 },
    { label: "Advanced", position: 75 },
    { label: "Optimized", position: 100 },
  ]);

  // Sector mechanisms from benchmarks
  const sectorMechanisms = JSON.stringify(
    r.benchmarks?.outlier_dimensions.map((d) => d.factor) ?? [],
  );

  // Compute labor-asset position from indicators
  const laborInd = getIndicator("labor_independence");
  const laborIndependenceValue = laborInd?.normalized_value ?? 50;
  let laborAssetLabel = "Transitional";
  let laborAssetPosition = 50;
  if (laborIndependenceValue <= 15) { laborAssetLabel = "Labor-Dependent"; laborAssetPosition = 10; }
  else if (laborIndependenceValue <= 35) { laborAssetLabel = "Labor-Primary"; laborAssetPosition = 30; }
  else if (laborIndependenceValue <= 55) { laborAssetLabel = "Transitional"; laborAssetPosition = 50; }
  else if (laborIndependenceValue <= 75) { laborAssetLabel = "Asset-Emerging"; laborAssetPosition = 70; }
  else { laborAssetLabel = "Asset-Supported"; laborAssetPosition = 90; }

  // Structural income map (derived from indicators)
  const persistenceValue = getIndicator("income_persistence")?.normalized_value ?? 0;
  const persistentLevel = Math.min(100, persistenceValue);
  const semiPersistentLevel = Math.min(100 - persistentLevel, Math.round((getIndicator("forward_visibility")?.normalized_value ?? 0) * 0.5));
  const activeLevel = 100 - persistentLevel - semiPersistentLevel;

  // Find best scenario for trajectory projection
  const bestLift = r.score_lift_projection.highest_single_lift;
  const projectedScore = bestLift?.projected_score ?? r.scores.overall_score;
  const projectedBand = bestLift?.projected_band ?? r.bands.primary_band;

  // Risk scenario — use worst one
  const worstScenario = [...r.scenarios].sort((a, b) => b.score_drop - a.score_drop)[0];

  // Continuity from raw scores
  const continuityMonths = r.raw_scores.continuity_months;
  const continuityPct = Math.min(100, Math.round(continuityMonths / 12 * 100));

  // Improvement estimate
  const improvementText = bestLift
    ? `If you address ${bestLift.label.toLowerCase()}, your projected score would increase by ${bestLift.lift} points to ${bestLift.projected_score}.`
    : "Focus on your primary constraint to see meaningful improvement.";

  // Peer percentile formatting
  const pctile = r.benchmarks?.peer_percentile ?? 50;
  const pctileLabel = formatOrdinal(pctile);

  // Stability spectrum position (0-100 normalized)
  const spectrumPosition = r.scores.overall_score;

  return {
    // Record identity
    record_id: r.assessment_id,
    authorization_code: r.integrity.record_hash.slice(0, 16),
    model_version: r.model_manifest.model_version,
    assessment_date_utc: r.created_at,
    issued_timestamp_utc: r.created_at,

    // Profile
    assessment_title: r.profile_context.industry_sector.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Assessment",
    classification: r.profile_context.profile_class,
    operating_structure: r.profile_context.operating_structure,
    primary_income_model: r.profile_context.primary_income_model,
    revenue_structure: r.profile_context.revenue_structure,
    industry_sector: r.profile_context.industry_sector,

    // Score
    final_score: r.scores.overall_score,
    stability_band: r.bands.primary_band,

    // Inputs (v1 format: 0/25/50/75/100)
    recurring_income_proportion: answerToV1(r.raw_inputs.q1_recurring_revenue_base),
    income_concentration: answerToV1(r.raw_inputs.q2_income_concentration),
    number_of_income_sources: answerToV1(r.raw_inputs.q3_income_source_diversity),
    forward_revenue_visibility: answerToV1(r.raw_inputs.q4_forward_revenue_visibility),
    earnings_variability: answerToV1(r.raw_inputs.q5_earnings_variability),
    income_continuity_without_active_labor: answerToV1(r.raw_inputs.q6_income_continuity_without_labor),

    // Interpretation
    band_interpretation_key: r.bands.primary_band.toLowerCase().replace(/ /g, "_"),
    band_interpretation_text: r.explainability.why_this_score,
    primary_constraint_key: r.constraints.root_constraint,
    primary_constraint_label: constraintLabel.replace(/\b\w/g, (c) => c.toUpperCase()),
    primary_constraint_text: r.explainability.why_not_higher,
    driver_1_key: r.explainability.strongest_supports[0] ?? "",
    driver_1_label: r.explainability.strongest_supports[0]?.split(":")[0] ?? "",
    driver_1_text: r.explainability.strongest_supports[0] ?? "",
    driver_2_key: r.explainability.strongest_supports[1] ?? "",
    driver_2_label: r.explainability.strongest_supports[1]?.split(":")[0] ?? "",
    driver_2_text: r.explainability.strongest_supports[1] ?? "",
    driver_3_key: r.explainability.strongest_supports[2] ?? "",
    driver_3_label: r.explainability.strongest_supports[2]?.split(":")[0] ?? "",
    driver_3_text: r.explainability.strongest_supports[2] ?? "",
    structural_priority_key: r.constraints.root_constraint,
    structural_priority_label: constraintLabel.replace(/\b\w/g, (c) => c.toUpperCase()),
    structural_priority_text: r.explainability.best_lift_explanation,

    // Page insights (generated from explainability + analysis)
    page_1_key_insight_text: r.explainability.why_this_score,
    page_2_key_insight_text: `Your income structure is classified as ${laborAssetLabel}. ${r.explainability.fragility_explanation}`,
    page_3_key_insight_text: `Your income breaks down as ${activeLevel}% active, ${semiPersistentLevel}% semi-persistent, and ${persistentLevel}% persistent.`,
    page_4_key_insight_text: `You rank in the ${pctileLabel} percentile among peers in your sector. The sector average score is ${r.benchmarks?.cluster_average_score ?? "N/A"}.`,
    page_5_key_insight_text: r.explainability.why_not_higher,
    page_6_key_insight_text: improvementText,

    // Labor-Asset
    labor_asset_position_key: laborAssetLabel.toLowerCase().replace(/ /g, "_").replace(/-/g, "_"),
    labor_asset_position_label: laborAssetLabel,
    labor_asset_framework_text: r.explainability.fragility_explanation,
    labor_asset_marker_position: laborAssetPosition,

    // Structural Income Map
    active_income_level: activeLevel,
    semi_persistent_income_level: semiPersistentLevel,
    persistent_income_level: persistentLevel,

    // Structural Indicators
    income_persistence_label: indicatorMap["income_persistence"] ?? "Moderate",
    income_source_diversity_label: indicatorMap["source_diversification"] ?? "Moderate",
    forward_revenue_visibility_label: indicatorMap["forward_visibility"] ?? "Moderate",
    income_variability_label: indicatorMap["earnings_stability"] ?? "Moderate",
    active_labor_dependence_label: invertLevel(indicatorMap["labor_independence"] ?? "Moderate"),
    exposure_concentration_label: invertLevel(indicatorMap["concentration_resilience"] ?? "Moderate"),

    // Stability spectrum
    stability_spectrum_position: spectrumPosition,

    // Peer benchmark
    peer_benchmark_group_key: r.profile_context.industry_sector,
    peer_benchmark_group_label: r.profile_context.industry_sector.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    peer_benchmark_text: `Your score of ${r.scores.overall_score} places you in the ${pctileLabel} percentile among ${r.profile_context.industry_sector.replace(/_/g, " ")} professionals.`,
    peer_distribution_payload: peerDistPayload,
    peer_position_marker: pctile,

    // Evolution path
    evolution_path_key: "income_stability",
    evolution_path_title: "Income Stability Evolution",
    evolution_path_steps_payload: evolutionSteps,
    current_evolution_stage_key: r.bands.primary_band.toLowerCase().replace(/ /g, "_"),
    current_evolution_stage_label: r.bands.primary_band,
    current_evolution_stage_position: spectrumPosition,
    sector_mechanisms_payload: sectorMechanisms,

    // Sector benchmarks
    sector_avg_score: r.benchmarks?.cluster_average_score ?? 42,
    sector_top_20_threshold: r.benchmarks?.top_20_threshold ?? 65,
    peer_band_distribution_payload: peerDistPayload,
    constraint_guidance_payload: constraintGuidance,
    structural_improvement_path_text: improvementText,
    action_plan_payload: actionPlan,

    // Peer percentile
    peer_stability_percentile: pctile,
    peer_stability_percentile_label: pctileLabel,

    // Stability trajectory
    projected_final_score: projectedScore,
    projected_stability_band: projectedBand,
    projected_structure_score: r.scores.structure_score,
    projected_stability_score: r.scores.stability_score,
    trajectory_constraint_key: r.constraints.root_constraint,
    improvement_estimate_text: improvementText,

    // Income continuity estimate
    income_continuity_pct: continuityPct,
    income_continuity_months: Math.round(continuityMonths * 10) / 10,
    income_continuity_text: `Estimated ${Math.round(continuityMonths * 10) / 10} months of income continuity without active work.`,

    // Risk scenario (worst case)
    risk_scenario_score: worstScenario?.scenario_score ?? r.scores.overall_score,
    risk_scenario_band: worstScenario?.scenario_band ?? r.bands.primary_band,
    risk_scenario_drop: worstScenario?.score_drop ?? 0,
    risk_scenario_text: worstScenario?.narrative ?? "No significant risk scenarios detected.",

    // Advisor tools
    advisor_discussion_guide_payload: advisorGuide,
    product_recommendations_payload: productRecs,

    // Registry
    registry_visibility: "Active",

    // ── V2-specific fields (available for new report sections) ──
    _v2: {
      scores: r.scores,
      raw_scores: r.raw_scores,
      bands: r.bands,
      interactions: r.interactions,
      quality: r.quality,
      constraints: r.constraints,
      fragility: r.fragility,
      sensitivity: r.sensitivity,
      scenarios: r.scenarios,
      score_lift_projection: r.score_lift_projection,
      confidence: r.confidence,
      explainability: r.explainability,
      recommended_actions: r.recommended_actions,
      avoid_actions: r.avoid_actions,
      reassessment_triggers: r.reassessment_triggers,
      benchmarks: r.benchmarks,
      indicators: r.indicators,
      reason_codes: r.reason_codes,
      integrity: r.integrity,
      model_manifest: r.model_manifest,
    },
  };
}

// ─── Helpers ────────────────────────────────────────────

function answerToV1(choice: string): number {
  const map: Record<string, number> = { A: 0, B: 25, C: 50, D: 75, E: 100 };
  return map[choice] ?? 0;
}

function invertLevel(level: string): string {
  const inversions: Record<string, string> = {
    "Very Low": "Very High",
    "Low": "High",
    "Moderate": "Moderate",
    "High": "Low",
    "Very High": "Very Low",
  };
  return inversions[level] ?? level;
}

function formatOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
