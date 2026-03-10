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
  // Active Income: inverse of continuity — how much depends on active work
  const active_income_level = Math.max(
    0,
    100 - inputs.income_continuity_without_active_labor
  );

  // Semi-Persistent: recurring income that still requires some maintenance
  const semi_persistent_income_level = Math.floor(
    (inputs.recurring_income_proportion +
      inputs.forward_revenue_visibility) /
      2
  );

  // Persistent: income that continues without active labor
  const persistent_income_level =
    inputs.income_continuity_without_active_labor;

  return {
    active_income_level,
    semi_persistent_income_level,
    persistent_income_level,
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
  return {
    page_1: `This income system scores ${finalScore} under Model RP-1.0, placing it in the ${band} classification band.`,
    page_2: `This income system is classified as ${laborAssetLabel} on the labor–asset spectrum under the RunPayway structural framework.`,
    page_3: `The structural income map illustrates the distribution of active, semi-persistent, and persistent income within this system.`,
    page_4: `Within the ${industrySector} peer benchmark group, this income system falls in the ${band} band.`,
    page_5: `The primary structural constraint identified is ${constraintLabel}. The structural priority is to ${priorityLabel.charAt(0).toLowerCase() + priorityLabel.slice(1)}.`,
    page_6: `The structural improvement path outlines sector-specific evolution stages for income systems in ${industrySector}.`,
  };
}
