// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Stability Trajectory Projection (Derived)

import type { CanonicalKey, DiagnosticInput, AllowedValue, StabilityBand } from "./types";
import { computeScore } from "./scoring";

export interface TrajectoryProjection {
  projected_final_score: number;
  projected_stability_band: StabilityBand;
  projected_structure_score: number;
  projected_stability_score: number;
  constraint_key: CanonicalKey;
  current_value: AllowedValue;
  projected_value: AllowedValue;
}

/**
 * Simulate improving the primary structural constraint by one category level.
 * One level = +25 on the mapped value scale [0, 25, 50, 75, 100].
 * This is a derived analytical output only — it does not modify the issued record.
 */
export function computeTrajectoryProjection(
  inputs: DiagnosticInput,
  primaryConstraintKey: CanonicalKey
): TrajectoryProjection {
  const currentValue = inputs[primaryConstraintKey];
  const projectedValue = Math.min(currentValue + 25, 100) as AllowedValue;

  // Build modified inputs with the constraint improved by one level
  const projectedInputs: DiagnosticInput = {
    ...inputs,
    [primaryConstraintKey]: projectedValue,
  };

  const projectedResult = computeScore(projectedInputs);

  return {
    projected_final_score: projectedResult.final_score,
    projected_stability_band: projectedResult.stability_band,
    projected_structure_score: projectedResult.structure_score,
    projected_stability_score: projectedResult.stability_score,
    constraint_key: primaryConstraintKey,
    current_value: currentValue,
    projected_value: projectedValue,
  };
}
