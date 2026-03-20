// Engine 11 — Sensitivity / Marginal Impact
// Runs deterministic uplift tests to rank factor impact.

import type {
  CanonicalInput,
  ExtendedInputs,
  SensitivityResult,
  SensitivityTest,
} from "../types";
import { SENSITIVITY_TESTS } from "../constants";

type ScoreComputeFn = (modified: CanonicalInput, ext: ExtendedInputs | null) => number;

export function computeSensitivity(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
  currentScore: number,
  computeScoreFn: ScoreComputeFn,
): SensitivityResult {
  const tests: SensitivityTest[] = [];

  for (const test of SENSITIVITY_TESTS) {
    let projected_score: number;

    if (test.factor === "quality_score") {
      // Quality improvement approximated as direct score add
      projected_score = Math.min(100, currentScore + test.delta);
    } else {
      const modified = { ...n };
      const key = test.factor as keyof CanonicalInput;
      const currentVal = modified[key] as number;
      (modified as Record<string, unknown>)[test.factor] = Math.max(
        0,
        Math.min(100, currentVal + test.delta),
      );
      projected_score = computeScoreFn(modified, ext);
    }

    tests.push({
      factor: test.factor,
      delta_description: test.description,
      original_score: currentScore,
      projected_score,
      lift: projected_score - currentScore,
      rank: 0,
    });
  }

  // Rank by lift descending
  tests.sort((a, b) => b.lift - a.lift);
  tests.forEach((t, i) => {
    t.rank = i + 1;
  });

  const lowReturn = tests.find((t) => t.lift <= 1) ?? tests[tests.length - 1];

  return {
    tests,
    highest_lift_factor: tests[0]?.factor ?? "",
    bottleneck_factor: tests[tests.length - 1]?.factor ?? "",
    low_return_factor: lowReturn?.factor ?? "",
  };
}
