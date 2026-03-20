// Engine 13 — Score Lift Simulator
// Projects score improvement for 5 individual moves + combined top two.

import type {
  CanonicalInput,
  ExtendedInputs,
  StabilityBand,
  ScoreLiftProjection,
  LiftScenario,
} from "../types";
import { LIFT_SCENARIO_TEMPLATES } from "../constants";
import { getBand } from "./05-band-classification";

type ScoreComputeFn = (modified: CanonicalInput) => number;

/** Safely modify a numeric field on CanonicalInput, clamping to [0, 100] */
function adjustField(
  n: CanonicalInput,
  factor: string,
  delta: number,
): CanonicalInput {
  const modified = { ...n };
  const key = factor as keyof CanonicalInput;
  const current = modified[key];
  if (typeof current === "number") {
    (modified as unknown as Record<string, number>)[factor] = Math.max(
      0,
      Math.min(100, current + delta),
    );
  }
  return modified;
}

export function computeScoreLift(
  n: CanonicalInput,
  _ext: ExtendedInputs | null,
  currentScore: number,
  currentBand: StabilityBand,
  computeScoreFn: ScoreComputeFn,
): ScoreLiftProjection {
  const lift_scenarios: LiftScenario[] = [];

  for (const template of LIFT_SCENARIO_TEMPLATES) {
    if (template.factor === "quality_score") {
      const projected_score = Math.min(100, currentScore + template.delta);
      lift_scenarios.push({
        scenario_id: template.scenario_id,
        label: template.label,
        change_description: `Improve quality score by ${template.delta}`,
        original_score: currentScore,
        projected_score,
        lift: projected_score - currentScore,
        projected_band: getBand(projected_score),
        band_shift: getBand(projected_score) !== currentBand,
      });
      continue;
    }

    const modified = adjustField(n, template.factor, template.delta);
    const projected_score = computeScoreFn(modified);

    lift_scenarios.push({
      scenario_id: template.scenario_id,
      label: template.label,
      change_description: `${template.delta > 0 ? "+" : ""}${template.delta} ${template.factor}`,
      original_score: currentScore,
      projected_score,
      lift: projected_score - currentScore,
      projected_band: getBand(projected_score),
      band_shift: getBand(projected_score) !== currentBand,
    });
  }

  // Sort by lift to find top two
  const sorted = [...lift_scenarios].sort((a, b) => b.lift - a.lift);
  const highest_single_lift = sorted[0];

  // Combined top two
  const top1 = LIFT_SCENARIO_TEMPLATES.find(
    (t) => t.scenario_id === sorted[0]?.scenario_id,
  );
  const top2 = LIFT_SCENARIO_TEMPLATES.find(
    (t) => t.scenario_id === sorted[1]?.scenario_id,
  );

  let combined: LiftScenario;
  if (
    top1 &&
    top2 &&
    top1.factor !== "quality_score" &&
    top2.factor !== "quality_score"
  ) {
    let modified = adjustField(n, top1.factor, top1.delta);
    modified = adjustField(modified, top2.factor, top2.delta);
    const combined_score = computeScoreFn(modified);
    combined = {
      scenario_id: "LS-06",
      label: "Combined Top Two Moves",
      change_description: `${top1.label} + ${top2.label}`,
      original_score: currentScore,
      projected_score: combined_score,
      lift: combined_score - currentScore,
      projected_band: getBand(combined_score),
      band_shift: getBand(combined_score) !== currentBand,
    };
  } else {
    combined = {
      scenario_id: "LS-06",
      label: "Combined Top Two Moves",
      change_description: "N/A",
      original_score: currentScore,
      projected_score: currentScore,
      lift: 0,
      projected_band: currentBand,
      band_shift: false,
    };
  }

  return { lift_scenarios, combined_top_two: combined, highest_single_lift };
}
