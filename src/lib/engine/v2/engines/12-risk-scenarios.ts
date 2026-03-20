// Engine 12 — Risk Scenario Analysis
// Simulates 6 deterministic stress scenarios.

import type {
  CanonicalInput,
  StabilityBand,
  RiskScenario,
} from "../types";
import { RISK_SCENARIO_TEMPLATES } from "../constants";
import { getBand } from "./05-band-classification";

type ScoreComputeFn = (modified: CanonicalInput) => number;

export function computeRiskScenarios(
  n: CanonicalInput,
  currentScore: number,
  currentBand: StabilityBand,
  computeScoreFn: ScoreComputeFn,
): RiskScenario[] {
  return RISK_SCENARIO_TEMPLATES.map((template) => {
    const modified = { ...n };

    switch (template.scenario_id) {
      case "RS-01": // Largest source removed
        modified.largest_source_pct = 0;
        modified.source_diversity_count = Math.max(1, n.source_diversity_count - 1);
        modified.income_persistence_pct = Math.max(
          0,
          Math.round(n.income_persistence_pct * (1 - n.largest_source_pct / 100)),
        );
        break;

      case "RS-02": // Active labor interrupted
        modified.labor_dependence_pct = 100;
        modified.forward_secured_pct = Math.max(
          0,
          Math.round(n.forward_secured_pct * 0.5),
        );
        break;

      case "RS-03": // Forward commitments delayed
        modified.forward_secured_pct = Math.max(
          0,
          Math.round(n.forward_secured_pct * 0.25),
        );
        break;

      case "RS-04": // Recurring stream degrades
        modified.income_persistence_pct = Math.max(
          0,
          Math.round(n.income_persistence_pct * 0.6),
        );
        break;

      case "RS-05": // High volatility month
        modified.income_variability_level = "extreme";
        break;

      case "RS-06": // Platform dependency shock
        modified.income_persistence_pct = Math.max(
          0,
          Math.round(n.income_persistence_pct * 0.5),
        );
        modified.forward_secured_pct = Math.max(
          0,
          Math.round(n.forward_secured_pct * 0.3),
        );
        break;
    }

    const scenario_score = computeScoreFn(modified);
    const score_drop = currentScore - scenario_score;
    const scenario_band = getBand(scenario_score);

    return {
      scenario_id: template.scenario_id,
      label: template.label,
      description: template.description,
      original_score: currentScore,
      scenario_score,
      score_drop,
      original_band: currentBand,
      scenario_band,
      band_shift: scenario_band !== currentBand,
      narrative: generateNarrative(
        template.label,
        currentScore,
        scenario_score,
        currentBand,
        scenario_band,
      ),
    };
  });
}

function generateNarrative(
  label: string,
  original: number,
  scenario: number,
  originalBand: StabilityBand,
  scenarioBand: StabilityBand,
): string {
  const drop = original - scenario;
  if (drop <= 0) {
    return `Under the "${label}" scenario, your score remains stable at ${scenario}.`;
  }
  const bandShift =
    originalBand !== scenarioBand
      ? ` Your classification would shift from ${originalBand} to ${scenarioBand}.`
      : " Your classification band would remain unchanged.";
  return `Under the "${label}" scenario, your score would drop by ${drop} points to ${scenario}.${bandShift}`;
}
