// Engine 15 — Deterministic Explainability
// Generates plain-language explanations for every assessment dimension.

import type {
  ScoreBreakdown,
  BandClassification,
  ConstraintHierarchy,
  InteractionResult,
  SensitivityResult,
  FragilityResult,
  QualityResult,
  ExplainabilityResult,
  ConstraintKey,
  FailureMode,
} from "../types";
import { CONSTRAINT_LABELS, FAILURE_MODE_LABELS } from "../constants";

export function generateExplainability(
  scores: ScoreBreakdown,
  bands: BandClassification,
  constraints: ConstraintHierarchy,
  interactions: InteractionResult,
  sensitivity: SensitivityResult,
  fragility: FragilityResult,
  quality: QualityResult,
): ExplainabilityResult {
  return {
    why_this_score: generateWhyThisScore(scores, bands),
    why_not_higher: generateWhyNotHigher(scores, constraints, interactions),
    strongest_supports: generateStrongestSupports(scores),
    strongest_suppressors: generateStrongestSuppressors(constraints),
    interaction_summary: generateInteractionSummary(interactions),
    best_lift_explanation: generateBestLiftExplanation(sensitivity),
    fragility_explanation: generateFragilityExplanation(fragility, quality),
  };
}

function generateWhyThisScore(
  scores: ScoreBreakdown,
  bands: BandClassification,
): string {
  return (
    `Your overall score of ${scores.overall_score} places you in the ${bands.primary_band} range. ` +
    `Your income structure contributes ${scores.structure_score} of 60 possible structure points, ` +
    `and your stability factors contribute ${scores.stability_score} of 40 possible stability points.`
  );
}

function generateWhyNotHigher(
  scores: ScoreBreakdown,
  constraints: ConstraintHierarchy,
  interactions: InteractionResult,
): string {
  const constraintLabel = CONSTRAINT_LABELS[constraints.root_constraint];
  let explanation = `The primary factor holding your score back is ${constraintLabel}. `;

  if (interactions.net_adjustment < 0) {
    explanation +=
      `Cross-factor interactions reduced your score by ${Math.abs(interactions.net_adjustment)} points ` +
      `because of structural tensions between your income characteristics. `;
  }

  if (constraints.secondary_constraint) {
    const secondaryLabel =
      CONSTRAINT_LABELS[constraints.secondary_constraint];
    explanation +=
      `A secondary constraint — ${secondaryLabel} — also limits improvement potential.`;
  }

  return explanation;
}

function generateStrongestSupports(scores: ScoreBreakdown): string[] {
  const supports: { label: string; score: number; max: number }[] = [
    { label: "Labor independence", score: scores.labor_dependence_score, max: 20 },
    { label: "Forward visibility", score: scores.forward_security_score, max: 15 },
    { label: "Income persistence", score: scores.continuity_score, max: 10 },
    { label: "Concentration resilience", score: scores.concentration_resilience_score, max: 10 },
  ];

  return supports
    .filter((s) => s.score >= s.max * 0.6)
    .sort((a, b) => b.score / b.max - a.score / a.max)
    .slice(0, 3)
    .map((s) => `${s.label}: ${s.score}/${s.max} points`);
}

function generateStrongestSuppressors(
  constraints: ConstraintHierarchy,
): string[] {
  const suppressors: string[] = [];
  suppressors.push(CONSTRAINT_LABELS[constraints.root_constraint]);
  if (constraints.primary_constraint !== constraints.root_constraint) {
    suppressors.push(CONSTRAINT_LABELS[constraints.primary_constraint]);
  }
  if (constraints.secondary_constraint !== constraints.primary_constraint) {
    suppressors.push(CONSTRAINT_LABELS[constraints.secondary_constraint]);
  }
  return suppressors;
}

function generateInteractionSummary(interactions: InteractionResult): string {
  if (interactions.effects.length === 0) {
    return "No cross-factor interactions were detected in your income structure.";
  }
  const penalties = interactions.effects.filter((e) => e.type === "penalty");
  const bonuses = interactions.effects.filter((e) => e.type === "bonus");

  let summary = "";
  if (penalties.length > 0) {
    summary +=
      `${penalties.length} structural tension${penalties.length > 1 ? "s" : ""} detected ` +
      `(${interactions.total_penalty} point impact). `;
  }
  if (bonuses.length > 0) {
    summary +=
      `${bonuses.length} structural strength${bonuses.length > 1 ? "s" : ""} recognized ` +
      `(+${interactions.total_bonus} points).`;
  }
  return summary;
}

function generateBestLiftExplanation(sensitivity: SensitivityResult): string {
  const top = sensitivity.tests[0];
  if (!top || top.lift <= 0) {
    return "No single factor change produces meaningful score improvement in isolation.";
  }
  return (
    `The highest-impact improvement would be ${top.delta_description}, ` +
    `which projects a ${top.lift}-point increase from ${top.original_score} to ${top.projected_score}.`
  );
}

function generateFragilityExplanation(
  fragility: FragilityResult,
  quality: QualityResult,
): string {
  return (
    `Your fragility score is ${fragility.fragility_score}/100 (${fragility.fragility_class}). ` +
    `Your primary failure mode is ${FAILURE_MODE_LABELS[fragility.primary_failure_mode]}. ` +
    `Income quality is rated ${quality.durability_grade} (${quality.quality_score}/10).`
  );
}
