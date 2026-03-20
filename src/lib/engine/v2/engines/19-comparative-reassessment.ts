// Engine 19 — Comparative Reassessment
// Computes deltas between current and prior assessments.

import type {
  ScoreBreakdown,
  CanonicalInput,
  StabilityBand,
  ComparisonResult,
  FactorDelta,
} from "../types";
import { getBand } from "./05-band-classification";

interface PriorAssessmentData {
  assessment_id: string;
  overall_score: number;
  primary_band: StabilityBand;
  normalized_inputs: CanonicalInput;
}

export function computeComparison(
  currentScores: ScoreBreakdown,
  currentNormalized: CanonicalInput,
  prior: PriorAssessmentData,
): ComparisonResult {
  const priorN = prior.normalized_inputs;

  const factor_deltas: FactorDelta[] = [
    makeDelta("Income Persistence", currentNormalized.income_persistence_pct, priorN.income_persistence_pct),
    makeDelta("Largest Source %", currentNormalized.largest_source_pct, priorN.largest_source_pct),
    makeDelta("Source Diversity", currentNormalized.source_diversity_count, priorN.source_diversity_count),
    makeDelta("Forward Secured %", currentNormalized.forward_secured_pct, priorN.forward_secured_pct),
    makeDelta("Labor Dependence %", currentNormalized.labor_dependence_pct, priorN.labor_dependence_pct),
  ];

  const score_delta = currentScores.overall_score - prior.overall_score;
  const current_band = getBand(currentScores.overall_score);

  return {
    prior_assessment_id: prior.assessment_id,
    prior_overall_score: prior.overall_score,
    current_overall_score: currentScores.overall_score,
    score_delta,
    prior_band: prior.primary_band,
    current_band,
    band_changed: prior.primary_band !== current_band,
    factor_deltas,
    improvement_narrative: generateNarrative(score_delta, factor_deltas),
  };
}

function makeDelta(
  factor: string,
  current: number,
  prior: number,
): FactorDelta {
  const delta = current - prior;
  return {
    factor,
    prior_value: prior,
    current_value: current,
    delta,
    direction:
      delta > 0 ? "improved" : delta < 0 ? "declined" : "unchanged",
  };
}

function generateNarrative(
  delta: number,
  factors: FactorDelta[],
): string {
  if (delta === 0) {
    return "Your score has not changed since your prior assessment.";
  }

  const direction = delta > 0 ? "improved" : "declined";
  const improved = factors
    .filter((f) => f.direction === "improved")
    .map((f) => f.factor);
  const declined = factors
    .filter((f) => f.direction === "declined")
    .map((f) => f.factor);

  let narrative = `Your score has ${direction} by ${Math.abs(delta)} points. `;
  if (improved.length > 0) {
    narrative += `Improvements in ${improved.join(", ")}. `;
  }
  if (declined.length > 0) {
    narrative += `Declines in ${declined.join(", ")}.`;
  }
  return narrative;
}
