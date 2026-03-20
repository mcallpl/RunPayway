// Engine 08 — Income Quality & Durability
// Computes quality score and durability grade from extended inputs.

import type {
  CanonicalInput,
  ExtendedInputs,
  QualityResult,
  QualityAdjustment,
  DurabilityGrade,
} from "../types";
import {
  QUALITY_BASE,
  QUALITY_CLAMP,
  QUALITY_RULES,
  DURABILITY_GRADE_TABLE,
} from "../constants";

export function computeQuality(
  _n: CanonicalInput,
  ext: ExtendedInputs | null,
): QualityResult {
  let score = QUALITY_BASE;
  const adjustments: QualityAdjustment[] = [];

  if (!ext) {
    return {
      quality_score: QUALITY_BASE,
      durability_grade: "moderate",
      adjustments: [],
    };
  }

  for (const rule of QUALITY_RULES) {
    const value = (ext as Record<string, unknown>)[rule.field];
    if (value !== undefined && value !== null && rule.condition(value as never)) {
      score += rule.delta;
      adjustments.push({
        factor: rule.field,
        delta: rule.delta,
        reason: rule.reason,
      });
    }
  }

  score = Math.max(QUALITY_CLAMP.min, Math.min(QUALITY_CLAMP.max, score));

  let durability_grade: DurabilityGrade = "moderate";
  for (const [min, max, grade] of DURABILITY_GRADE_TABLE) {
    if (score >= min && score <= max) {
      durability_grade = grade;
      break;
    }
  }

  return { quality_score: score, durability_grade, adjustments };
}
