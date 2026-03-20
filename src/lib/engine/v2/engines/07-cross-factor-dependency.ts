// Engine 07 — Cross-Factor Dependency
// Evaluates interaction penalties and bonuses between canonical inputs.

import type {
  CanonicalInput,
  ExtendedInputs,
  InteractionEffect,
  InteractionResult,
  RawScoreBreakdown,
  ScoreBreakdown,
} from "../types";
import { INTERACTION_RULES, NET_ADJUSTMENT_CLAMP } from "../constants";

export function computeInteractions(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
): InteractionResult {
  const effects: InteractionEffect[] = [];

  for (const rule of INTERACTION_RULES) {
    if (rule.condition(n, ext ?? undefined)) {
      effects.push({
        code: rule.code,
        type: rule.type,
        points: rule.points,
        trigger_condition: rule.description,
        factors_involved: rule.factors,
      });
    }
  }

  const total_penalty = effects
    .filter((e) => e.type === "penalty")
    .reduce((sum, e) => sum + e.points, 0);

  const total_bonus = effects
    .filter((e) => e.type === "bonus")
    .reduce((sum, e) => sum + e.points, 0);

  const raw_net = total_penalty + total_bonus;
  const net_adjustment = Math.max(
    NET_ADJUSTMENT_CLAMP.min,
    Math.min(NET_ADJUSTMENT_CLAMP.max, raw_net),
  );

  return { effects, total_penalty, total_bonus, net_adjustment };
}

/** Apply interaction adjustments and quality to produce final ScoreBreakdown */
export function applyInteractions(
  rawScores: RawScoreBreakdown,
  interactions: InteractionResult,
  qualityAdjustment: number,
  fragilityScore: number,
): ScoreBreakdown {
  const structure_score = rawScores.structure_subtotal + qualityAdjustment;
  const stability_score = rawScores.stability_subtotal;
  const pre_interaction = structure_score + stability_score;

  const overall_score = Math.max(
    0,
    Math.min(100, pre_interaction + interactions.net_adjustment),
  );

  return {
    overall_score,
    structure_score,
    stability_score,
    continuity_score: rawScores.continuity_score,
    concentration_resilience_score: rawScores.concentration_resilience_score,
    forward_security_score: rawScores.forward_security_score,
    labor_dependence_score: rawScores.labor_dependence_score,
    quality_adjustment: qualityAdjustment,
    fragility_score: fragilityScore,
  };
}
