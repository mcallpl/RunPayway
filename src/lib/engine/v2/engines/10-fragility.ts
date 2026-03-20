// Engine 10 — Failure Mode & Fragility
// Computes fragility score, class, deductions, and failure modes.

import type {
  CanonicalInput,
  QualityResult,
  FragilityResult,
  FragilityDeduction,
  FragilityClass,
  FailureMode,
} from "../types";
import { FRAGILITY_BASE, FRAGILITY_RULES, FRAGILITY_CLASS_TABLE } from "../constants";

export function computeFragility(
  n: CanonicalInput,
  quality: QualityResult,
  continuity_months: number,
): FragilityResult {
  let score = FRAGILITY_BASE;
  const deductions: FragilityDeduction[] = [];

  for (const rule of FRAGILITY_RULES) {
    const met = rule.condition(n, quality, continuity_months);
    deductions.push({
      trigger: rule.trigger,
      points: rule.points,
      condition_met: met,
    });
    if (met) {
      score += rule.points;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let fragility_class: FragilityClass = "resilient";
  for (const [min, max, cls] of FRAGILITY_CLASS_TABLE) {
    if (score >= min && score <= max) {
      fragility_class = cls;
      break;
    }
  }

  const failure_modes: FailureMode[] = [];
  if (n.largest_source_pct >= 70) failure_modes.push("concentration_collapse");
  if (n.labor_dependence_pct >= 80) failure_modes.push("labor_interruption");
  if (n.forward_secured_pct <= 10) failure_modes.push("visibility_gap");
  if (
    quality.durability_grade === "fragile" ||
    quality.durability_grade === "thin"
  ) {
    failure_modes.push("durability_thinness");
  }

  return {
    fragility_score: score,
    fragility_class,
    deductions,
    primary_failure_mode: failure_modes[0] ?? "visibility_gap",
    secondary_failure_modes: failure_modes.slice(1),
  };
}
