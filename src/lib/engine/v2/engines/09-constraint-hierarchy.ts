// Engine 09 — Constraint Hierarchy
// Determines root, primary, secondary, dependent, and hidden unlock constraints.

import type {
  CanonicalInput,
  RawScoreBreakdown,
  InteractionResult,
  QualityResult,
  ConstraintKey,
  ConstraintHierarchy,
} from "../types";

interface ConstraintCandidate {
  key: ConstraintKey;
  factor_score: number;
  interaction_involvement: number;
  continuity_impact: boolean;
  fragility_impact: number;
}

export function computeConstraints(
  n: CanonicalInput,
  rawScores: RawScoreBreakdown,
  interactions: InteractionResult,
  quality: QualityResult,
): ConstraintHierarchy {
  const candidates: ConstraintCandidate[] = [
    {
      key: "weak_forward_visibility",
      factor_score: rawScores.forward_security_score,
      interaction_involvement: countInvolvement("forward_secured_pct", interactions),
      continuity_impact: true,
      fragility_impact: n.forward_secured_pct <= 10 ? 20 : 0,
    },
    {
      key: "high_labor_dependence",
      factor_score: rawScores.labor_dependence_score,
      interaction_involvement: countInvolvement("labor_dependence_pct", interactions),
      continuity_impact: true,
      fragility_impact: n.labor_dependence_pct >= 80 ? 20 : 0,
    },
    {
      key: "high_concentration",
      factor_score: rawScores.concentration_resilience_score,
      interaction_involvement: countInvolvement("largest_source_pct", interactions),
      continuity_impact: true,
      fragility_impact: n.largest_source_pct >= 70 ? 25 : 0,
    },
    {
      key: "low_persistence",
      factor_score: rawScores.income_persistence_score,
      interaction_involvement: countInvolvement("income_persistence_pct", interactions),
      continuity_impact: true,
      fragility_impact: 0,
    },
    {
      key: "high_variability",
      factor_score: rawScores.variability_score,
      interaction_involvement: countInvolvement("income_variability_level", interactions),
      continuity_impact: false,
      fragility_impact:
        n.income_variability_level === "extreme"
          ? 20
          : n.income_variability_level === "high"
            ? 10
            : 0,
    },
    {
      key: "weak_durability",
      factor_score: quality.quality_score,
      interaction_involvement: 0,
      continuity_impact: false,
      fragility_impact: quality.durability_grade === "fragile" ? 15 : 0,
    },
    {
      key: "shallow_continuity",
      factor_score: rawScores.continuity_score,
      interaction_involvement: 0,
      continuity_impact: true,
      fragility_impact: rawScores.continuity_months < 1 ? 15 : 0,
    },
  ];

  // Sort: most interaction involvement → lowest factor score → highest fragility impact
  candidates.sort((a, b) => {
    if (b.interaction_involvement !== a.interaction_involvement) {
      return b.interaction_involvement - a.interaction_involvement;
    }
    if (a.factor_score !== b.factor_score) {
      return a.factor_score - b.factor_score;
    }
    return b.fragility_impact - a.fragility_impact;
  });

  const root_constraint = candidates[0].key;
  const primary_constraint = candidates[1]?.key ?? root_constraint;
  const secondary_constraint = candidates[2]?.key ?? primary_constraint;

  const dependent_constraint = findDependent(root_constraint, candidates);
  const hidden_unlock = findHiddenUnlock(candidates);

  return {
    root_constraint,
    primary_constraint,
    secondary_constraint,
    dependent_constraint,
    hidden_unlock,
  };
}

function countInvolvement(
  factor: string,
  interactions: InteractionResult,
): number {
  return interactions.effects.filter(
    (e) => e.type === "penalty" && e.factors_involved.includes(factor),
  ).length;
}

function findDependent(
  root: ConstraintKey,
  candidates: ConstraintCandidate[],
): ConstraintKey | null {
  const rootCandidate = candidates.find((c) => c.key === root);
  if (!rootCandidate) return null;

  for (const c of candidates) {
    if (c.key === root) continue;
    if (
      c.interaction_involvement > 0 &&
      c.factor_score > rootCandidate.factor_score
    ) {
      return c.key;
    }
  }
  return null;
}

function findHiddenUnlock(
  candidates: ConstraintCandidate[],
): ConstraintKey | null {
  for (const c of candidates.slice(2)) {
    if (c.continuity_impact && c.factor_score >= 3 && c.factor_score <= 8) {
      return c.key;
    }
  }
  return null;
}
