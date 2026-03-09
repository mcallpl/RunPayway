// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Deterministic Scoring

import type { DiagnosticInput, ScoringResult, StabilityBand } from "./types";
import {
  STRUCTURE_WEIGHT_PERCENT,
  STABILITY_WEIGHT_PERCENT,
  BAND_THRESHOLDS,
} from "./constants";

export function computeScore(input: DiagnosticInput): ScoringResult {
  // Structure score: floor(mean of structure fields)
  const structure_score = Math.floor(
    (input.recurring_income_proportion +
      input.number_of_income_sources +
      input.forward_revenue_visibility) /
      3
  );

  // Stability score: floor(mean of stability fields)
  const stability_score = Math.floor(
    (input.income_concentration +
      input.earnings_variability +
      input.income_continuity_without_active_labor) /
      3
  );

  // Final score: floor(weighted combination)
  const final_score = Math.floor(
    (structure_score * STRUCTURE_WEIGHT_PERCENT +
      stability_score * STABILITY_WEIGHT_PERCENT) /
      100
  );

  // Band assignment
  const stability_band = assignBand(final_score);

  return {
    structure_score,
    stability_score,
    final_score,
    stability_band,
  };
}

function assignBand(score: number): StabilityBand {
  for (const threshold of BAND_THRESHOLDS) {
    if (score >= threshold.min && score <= threshold.max) {
      return threshold.band;
    }
  }
  throw new Error(`Score ${score} does not fall within any band threshold`);
}
