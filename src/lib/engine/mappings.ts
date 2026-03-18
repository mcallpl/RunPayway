// RUNPAYWAY™ Income Stability Score™ Refined Diagnostic System
// Model RP-1.0 | Version 1.0 — Deterministic Mapping Logic

import type { DiagnosticInput, ProfileContext, StabilityBand } from "./types";

// ============================================================
// STRUCTURAL INDICATORS
// ============================================================

type IndicatorLevel = "Very Low" | "Low" | "Moderate" | "High" | "Very High";

function mapValueToLevel(value: number): IndicatorLevel {
  if (value <= 10) return "Very Low";
  if (value <= 30) return "Low";
  if (value <= 55) return "Moderate";
  if (value <= 80) return "High";
  return "Very High";
}

export interface StructuralIndicators {
  income_persistence_label: string;
  income_source_diversity_label: string;
  forward_revenue_visibility_label: string;
  income_variability_label: string;
  active_labor_dependence_label: string;
  exposure_concentration_label: string;
}

export function computeStructuralIndicators(
  inputs: DiagnosticInput
): StructuralIndicators {
  // Income Persistence: derived from income_continuity_without_active_labor
  const income_persistence_label = mapValueToLevel(
    inputs.income_continuity_without_active_labor
  );

  // Income Source Diversity: derived from number_of_income_sources
  const income_source_diversity_label = mapValueToLevel(
    inputs.number_of_income_sources
  );

  // Forward Revenue Visibility: derived from forward_revenue_visibility
  const forward_revenue_visibility_label = mapValueToLevel(
    inputs.forward_revenue_visibility
  );

  // Income Variability: inverted — high earnings_variability score means LOW variability
  const income_variability_label = mapValueToLevel(
    100 - inputs.earnings_variability
  );

  // Active Labor Dependence: inverted — high continuity means LOW dependence
  const active_labor_dependence_label = mapValueToLevel(
    100 - inputs.income_continuity_without_active_labor
  );

  // Exposure Concentration: inverted — high income_concentration score means LOW concentration
  const exposure_concentration_label = mapValueToLevel(
    100 - inputs.income_concentration
  );

  return {
    income_persistence_label,
    income_source_diversity_label,
    forward_revenue_visibility_label,
    income_variability_label,
    active_labor_dependence_label,
    exposure_concentration_label,
  };
}

// ============================================================
// LABOR–ASSET POSITION
// ============================================================

export type LaborAssetKey =
  | "labor_dependent"
  | "labor_primary"
  | "transitional"
  | "asset_emerging"
  | "asset_supported";

export interface LaborAssetResult {
  labor_asset_position_key: LaborAssetKey;
  labor_asset_position_label: string;
  labor_asset_framework_text: string;
  labor_asset_marker_position: number; // 0-100 on spectrum
}

const LABOR_ASSET_LABELS: Record<LaborAssetKey, string> = {
  labor_dependent: "Labor-Dependent",
  labor_primary: "Labor-Primary",
  transitional: "Transitional",
  asset_emerging: "Asset-Emerging",
  asset_supported: "Asset-Supported",
};

const LABOR_ASSET_TEXTS: Record<LaborAssetKey, string> = {
  labor_dependent:
    "Income is primarily generated through active labor with minimal asset-derived or recurring revenue. Income continuity depends on sustained personal activity.",
  labor_primary:
    "Income relies primarily on active labor, with limited recurring or asset-derived components beginning to emerge.",
  transitional:
    "Income reflects a mix of active labor and emerging recurring or asset-derived components. The income system is transitioning toward greater structural persistence.",
  asset_emerging:
    "Income includes meaningful recurring or asset-derived components alongside active work. Structural persistence is emerging as a material contributor to income continuity.",
  asset_supported:
    "Income is materially supported by asset-derived, recurring, or contractually persistent revenue sources. Income continuity extends beyond immediate active labor.",
};

const LABOR_ASSET_POSITIONS: Record<LaborAssetKey, number> = {
  labor_dependent: 10,
  labor_primary: 30,
  transitional: 50,
  asset_emerging: 70,
  asset_supported: 90,
};

export function computeLaborAssetPosition(
  inputs: DiagnosticInput,
  profile: ProfileContext
): LaborAssetResult {
  // Composite score from recurring income and continuity
  const recurringScore = inputs.recurring_income_proportion;
  const continuityScore = inputs.income_continuity_without_active_labor;

  // Weight: 50/50 between recurring and continuity
  const composite = Math.floor((recurringScore + continuityScore) / 2);

  // Adjust based on income model and revenue structure
  let adjustment = 0;
  const assetModels = ["Asset-Based", "Investment / Dividend Income", "Real Estate Rental Income", "Licensing / Royalty Income"];
  const assetRevenues = ["Asset-Derived Revenue", "Long-Term Recurring Income"];
  const recurringRevenues = ["Recurring Revenue", "Monthly Recurring Payments", "Contracted Multi-Month Revenue"];
  const salaryModels = ["Salary-Based", "Employee Salary"];
  const activeRevenues = ["Primarily Active", "Mostly One-Time Payments"];

  if (
    assetModels.includes(profile.primary_income_model) ||
    assetRevenues.includes(profile.revenue_structure)
  ) {
    adjustment = 10;
  } else if (
    recurringRevenues.includes(profile.revenue_structure)
  ) {
    adjustment = 5;
  } else if (
    salaryModels.includes(profile.primary_income_model) &&
    activeRevenues.includes(profile.revenue_structure)
  ) {
    adjustment = -5;
  }

  const adjusted = Math.max(0, Math.min(100, composite + adjustment));

  let key: LaborAssetKey;
  if (adjusted <= 15) key = "labor_dependent";
  else if (adjusted <= 35) key = "labor_primary";
  else if (adjusted <= 55) key = "transitional";
  else if (adjusted <= 75) key = "asset_emerging";
  else key = "asset_supported";

  return {
    labor_asset_position_key: key,
    labor_asset_position_label: LABOR_ASSET_LABELS[key],
    labor_asset_framework_text: LABOR_ASSET_TEXTS[key],
    labor_asset_marker_position: LABOR_ASSET_POSITIONS[key],
  };
}

// ============================================================
// STRUCTURAL INCOME MAP
// ============================================================

export interface StructuralIncomeMap {
  active_income_level: number;
  semi_persistent_income_level: number;
  persistent_income_level: number;
}

export function computeStructuralIncomeMap(
  inputs: DiagnosticInput
): StructuralIncomeMap {
  // Persistent: income that continues without active labor
  const rawPersistent = inputs.income_continuity_without_active_labor;

  // Semi-Persistent: recurring income that still requires some involvement
  // Derived from recurring revenue and forward visibility, capped so total
  // never exceeds 100%
  const rawSemi = Math.floor(
    (inputs.recurring_income_proportion +
      inputs.forward_revenue_visibility) /
      2
  );
  const cappedSemi = Math.min(rawSemi, 100 - rawPersistent);

  // Active: remainder — income that depends entirely on active work
  const rawActive = 100 - cappedSemi - rawPersistent;

  return {
    active_income_level: Math.max(0, rawActive),
    semi_persistent_income_level: Math.max(0, cappedSemi),
    persistent_income_level: Math.max(0, rawPersistent),
  };
}

// ============================================================
// STABILITY SPECTRUM POSITION
// ============================================================

export function computeStabilitySpectrumPosition(
  finalScore: number
): number {
  // Direct mapping: score 0-100 → position 0-100 on spectrum
  return finalScore;
}

// ============================================================
// PEER BENCHMARK POSITION
// ============================================================

export function computePeerPositionMarker(band: StabilityBand): number {
  switch (band) {
    case "Limited Stability":
      return 1;
    case "Developing Stability":
      return 2;
    case "Established Stability":
      return 3;
    case "High Stability":
      return 4;
  }
}

// ============================================================
// EVOLUTION STAGE SELECTION
// ============================================================

export function selectCurrentEvolutionStage(
  steps: string[],
  profile: ProfileContext,
  inputs: DiagnosticInput,
  finalScore: number
): { key: string; label: string; position: number } {
  // Determine stage based on income model, revenue structure, score, and continuity
  const continuity = inputs.income_continuity_without_active_labor;

  let stageIndex: number;

  if (finalScore <= 20 && continuity <= 25) {
    stageIndex = 0;
  } else if (finalScore <= 39) {
    stageIndex = 1;
  } else if (finalScore <= 59) {
    stageIndex = 2;
  } else if (finalScore <= 79) {
    // Check if revenue structure suggests higher stage
    if (
      ["Recurring Revenue", "Monthly Recurring Payments", "Contracted Multi-Month Revenue", "Long-Term Recurring Income"].includes(profile.revenue_structure) ||
      ["Asset-Derived Revenue"].includes(profile.revenue_structure)
    ) {
      stageIndex = 3;
    } else {
      stageIndex = 2;
    }
  } else {
    // High stability
    if (continuity >= 75) {
      stageIndex = 4;
    } else {
      stageIndex = 3;
    }
  }

  // Clamp to available steps
  stageIndex = Math.min(stageIndex, steps.length - 1);

  const label = steps[stageIndex];
  const key = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  // Position: 0-based index mapped to percentage
  const position =
    steps.length > 1
      ? Math.floor((stageIndex / (steps.length - 1)) * 100)
      : 50;

  return { key, label, position };
}

// ============================================================
// INCOME CONTINUITY ESTIMATE
// ============================================================

export interface IncomeContinuityEstimate {
  income_continuity_pct: number;
  income_continuity_months: number;
  income_continuity_text: string;
}

export function computeIncomeContinuityEstimate(
  inputs: DiagnosticInput,
  profile: ProfileContext
): IncomeContinuityEstimate {
  // Persistent income percentage (what continues without active work)
  const persistentPct = inputs.income_continuity_without_active_labor;

  // Recurring revenue contributes semi-persistent continuity
  const recurringContribution = Math.floor(inputs.recurring_income_proportion * 0.5);

  // Forward visibility extends the duration
  const visibilityMonths = Math.floor(inputs.forward_revenue_visibility / 25) * 3; // 0→0, 25→3, 50→6, 75→9, 100→12

  // Total continuity percentage
  const totalPct = Math.min(100, persistentPct + recurringContribution);

  // Estimated months of meaningful continuity
  // Base: persistent income sustains indefinitely, recurring sustains for contract duration
  let months: number;
  if (totalPct >= 80) months = 12;
  else if (totalPct >= 60) months = Math.max(6, visibilityMonths);
  else if (totalPct >= 40) months = Math.max(3, Math.floor(visibilityMonths * 0.7));
  else if (totalPct >= 20) months = Math.max(1, Math.floor(visibilityMonths * 0.4));
  else months = 0;

  // Adjust for asset-based models
  const assetModels = ["Asset-Based", "Investment / Dividend Income", "Real Estate Rental Income", "Licensing / Royalty Income"];
  if (assetModels.includes(profile.primary_income_model)) {
    months = Math.min(12, months + 3);
  }

  const name = profile.assessment_title || "this income system";
  let text: string;
  if (totalPct >= 75) {
    text = `If active work stopped today, approximately ${totalPct}% of ${name}'s income would continue for an estimated ${months}+ months. This reflects strong structural persistence with meaningful recurring and asset-derived revenue.`;
  } else if (totalPct >= 50) {
    text = `If active work stopped today, approximately ${totalPct}% of ${name}'s income would continue for an estimated ${months} months. Semi-persistent arrangements and recurring revenue provide moderate continuity, though a significant portion still depends on active effort.`;
  } else if (totalPct >= 25) {
    text = `If active work stopped today, approximately ${totalPct}% of ${name}'s income would continue for an estimated ${months} month${months === 1 ? "" : "s"}. The majority of income requires ongoing active work to sustain.`;
  } else {
    text = `If active work stopped today, most of ${name}'s income would cease within weeks. Approximately ${totalPct}% may continue briefly through existing commitments, but the income system is primarily labor-dependent.`;
  }

  return {
    income_continuity_pct: totalPct,
    income_continuity_months: months,
    income_continuity_text: text,
  };
}

// ============================================================
// RISK SCENARIO ANALYSIS
// ============================================================

export interface RiskScenarioResult {
  risk_scenario_score: number;
  risk_scenario_band: string;
  risk_scenario_drop: number;
  risk_scenario_text: string;
}

function assignBandFromScore(score: number): string {
  if (score >= 80) return "High Stability";
  if (score >= 60) return "Established Stability";
  if (score >= 40) return "Developing Stability";
  return "Limited Stability";
}

export function computeRiskScenario(
  inputs: DiagnosticInput,
  finalScore: number,
  profile: ProfileContext
): RiskScenarioResult {
  // Simulate losing the largest income source
  // The concentration score tells us how dependent on one source
  // Low concentration (high score) = losing one source has less impact
  // High concentration (low score) = losing one source is devastating

  const concentrationRaw = inputs.income_concentration; // 0=high concentration, 100=well diversified
  const sourceCount = inputs.number_of_income_sources; // 0=1 source, 100=many

  // Impact: inverse of diversification — more concentrated = bigger drop
  const impactPct = Math.max(5, Math.floor((100 - concentrationRaw) * 0.45));
  const sourceDrop = Math.max(3, Math.floor((100 - sourceCount) * 0.2));
  const totalDrop = Math.min(40, impactPct + sourceDrop);

  const scenarioScore = Math.max(0, finalScore - totalDrop);
  const scenarioBand = assignBandFromScore(scenarioScore);

  const name = profile.assessment_title || "this income system";
  const bandChanged = scenarioBand !== assignBandFromScore(finalScore);

  let text: string;
  if (totalDrop <= 8) {
    text = `If ${name}'s largest income source were lost, the score would decline by approximately ${totalDrop} points to ${scenarioScore}. The diversified income structure provides meaningful resilience against single-source disruption.`;
  } else if (totalDrop <= 18) {
    text = `If ${name}'s largest income source were lost, the score would decline by approximately ${totalDrop} points to ${scenarioScore}. ${bandChanged ? `This would shift the classification from ${assignBandFromScore(finalScore)} to ${scenarioBand}. ` : ""}Moderate source concentration creates meaningful exposure to single-client risk.`;
  } else {
    text = `If ${name}'s largest income source were lost, the score would decline significantly — by approximately ${totalDrop} points to ${scenarioScore}${bandChanged ? `, moving from ${assignBandFromScore(finalScore)} to ${scenarioBand}` : ""}. High concentration on a single source creates substantial structural vulnerability.`;
  }

  return {
    risk_scenario_score: scenarioScore,
    risk_scenario_band: scenarioBand,
    risk_scenario_drop: totalDrop,
    risk_scenario_text: text,
  };
}

// ============================================================
// PAGE KEY INSIGHT TEXTS
// ============================================================

export function generatePageInsights(
  finalScore: number,
  band: StabilityBand,
  constraintLabel: string,
  priorityLabel: string,
  laborAssetLabel: string,
  industrySector: string
): {
  page_1: string;
  page_2: string;
  page_3: string;
  page_4: string;
  page_5: string;
  page_6: string;
} {
  // Sector-contextualized band description
  const bandContext =
    band === "High Stability"
      ? `among the most structurally stable income systems in the ${industrySector} sector`
      : band === "Established Stability"
        ? `structurally stronger than most income systems in the ${industrySector} sector, with meaningful recurring or persistent revenue`
        : band === "Developing Stability"
          ? `in a transitional phase typical of many ${industrySector} professionals building toward more persistent income structures`
          : `in the early stages of structural development, which is common in the ${industrySector} sector where income often begins as highly active and transaction-driven`;

  return {
    page_1: `This income system scores ${finalScore} under Model RP-1.0, placing it ${bandContext}. The score reflects the structural composition of income — not total earnings or financial health — and measures how well this system would sustain itself if active work were reduced.`,
    page_2: `Classified as ${laborAssetLabel} on the labor-asset spectrum, this income system in the ${industrySector} sector derives its revenue from a specific mix of active work, semi-persistent arrangements, and ongoing income. The structural indicators below reveal where stability is strong and where it depends on continued personal effort.`,
    page_3: `The income map shows how revenue is distributed across active, semi-persistent, and persistent categories — a pattern shaped by the typical structures available in the ${industrySector} sector. Combined with the structural indicators, this reveals the operational reality behind the score.`,
    page_4: `Within the ${industrySector} peer group, this income system falls in the ${band} band. The benchmark comparison below shows how this score compares to the sector average and the threshold for the top 20% of ${industrySector} income systems.`,
    page_5: `The primary structural constraint is ${constraintLabel}, which is a common limiting factor in the ${industrySector} sector. The structural priority is to ${priorityLabel.charAt(0).toLowerCase() + priorityLabel.slice(1)} — addressing this constraint would have the greatest impact on moving toward more persistent income.`,
    page_6: `The improvement path below outlines how income systems in the ${industrySector} sector typically evolve from active, labor-dependent revenue toward more structured and recurring models. Each stage represents a structural shift, not just an increase in earnings.`,
  };
}
