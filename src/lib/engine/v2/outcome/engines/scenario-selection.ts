// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Scenario Selection Engine (OL-1.0)
// Selects top 4 deterministic scenarios by family + industry + signals
// ═══════════════════════════════════════════════════════════════

import type {
  IncomeModelFamilyId,
  IntakeSignals,
  SelectedScenario,
  DeterministicScenario,
  ScenarioSeverity,
} from "../types";
import { SCENARIO_REGISTRY } from "../data/scenario-registry";

const SEVERITY_RANK: Record<ScenarioSeverity, number> = {
  critical: 3,
  high: 2,
  moderate: 1,
};

const MAX_SCENARIOS = 4;

/**
 * Select the top scenarios for a given family + industry + intake signals.
 * Pure function — deterministic selection.
 */
export function selectScenarios(
  familyId: IncomeModelFamilyId,
  industrySector: string,
  intakeSignals: IntakeSignals,
  fragilityClass: string,
): SelectedScenario[] {
  // 1. Filter by family applicability
  let candidates = SCENARIO_REGISTRY.filter((s) =>
    s.applicable_families.includes(familyId),
  );

  // 2. Filter by industry applicability
  candidates = candidates.filter(
    (s) =>
      s.applicable_industries.includes("*") ||
      s.applicable_industries.includes(industrySector),
  );

  // 3. Score each candidate
  const scored = candidates.map((s) => ({
    scenario: s,
    score: computeScenarioScore(s, intakeSignals, fragilityClass),
  }));

  // 4. Sort by score descending, then by severity descending for ties
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return SEVERITY_RANK[b.scenario.severity] - SEVERITY_RANK[a.scenario.severity];
  });

  // 5. Take top N
  return scored.slice(0, MAX_SCENARIOS).map((s) => ({
    scenario_id: s.scenario.scenario_id,
    label: s.scenario.label,
    description: s.scenario.description,
    severity: s.scenario.severity,
    why_it_matters: s.scenario.why_it_matters,
  }));
}

/**
 * Compute a relevance score for a scenario based on intake signals and fragility.
 * Higher = more relevant to show.
 */
function computeScenarioScore(
  scenario: DeterministicScenario,
  signals: IntakeSignals,
  fragilityClass: string,
): number {
  let score = SEVERITY_RANK[scenario.severity] * 10;

  // Boost labor-related scenarios if labor sensitivity is high
  if (
    signals.labor_sensitivity === "high" &&
    isLaborScenario(scenario.scenario_id)
  ) {
    score += 5;
  }

  // Boost pipeline scenarios if pipeline sensitivity is high
  if (
    signals.pipeline_sensitivity === "high" &&
    isPipelineScenario(scenario.scenario_id)
  ) {
    score += 5;
  }

  // Boost external/platform scenarios if external sensitivity is high
  if (
    signals.external_sensitivity === "high" &&
    isExternalScenario(scenario.scenario_id)
  ) {
    score += 5;
  }

  // Boost concentration scenarios if concentration type is "client" or "employer"
  if (
    (signals.concentration_type === "client" || signals.concentration_type === "employer") &&
    isConcentrationScenario(scenario.scenario_id)
  ) {
    score += 3;
  }

  // Boost all scenarios if fragility is brittle or thin
  if (fragilityClass === "brittle" || fragilityClass === "thin") {
    score += 2;
  }

  // Boost forward-related scenarios if forward quality is none
  if (
    signals.forward_quality === "none" &&
    isForwardScenario(scenario.scenario_id)
  ) {
    score += 4;
  }

  return score;
}

// ─── Scenario Classification Helpers ────────────────────

function isLaborScenario(id: string): boolean {
  return [
    "RS-JOB-LOSS",
    "RS-FOUNDER-UNAVAILABLE",
    "RS-PRACTITIONER-UNAVAILABLE",
    "RS-EMPLOYER-DOWNSIZE",
  ].includes(id);
}

function isPipelineScenario(id: string): boolean {
  return [
    "RS-PIPELINE-DRY",
    "RS-DEAL-DELAYED",
    "RS-CONTRACT-END",
    "RS-GAP-PERIOD",
  ].includes(id);
}

function isExternalScenario(id: string): boolean {
  return [
    "RS-PLATFORM-ALGO-CHANGE",
    "RS-CHANNEL-DISRUPTION",
    "RS-AUDIENCE-DECLINE",
    "RS-SPONSOR-PULLBACK",
    "RS-TRAFFIC-DECLINE",
    "RS-MARKET-SLOWDOWN",
  ].includes(id);
}

function isConcentrationScenario(id: string): boolean {
  return [
    "RS-TOP-CLIENT-LOST",
    "RS-TOP-ACCOUNT-LOST",
    "RS-TOP-RETAINER-LOST",
    "RS-DOMINANT-SOURCE-LOST",
  ].includes(id);
}

function isForwardScenario(id: string): boolean {
  return [
    "RS-PIPELINE-DRY",
    "RS-CONTRACT-END",
    "RS-GAP-PERIOD",
    "RS-RENEWAL-DECLINE",
  ].includes(id);
}
