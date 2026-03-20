// Engine 04 — Deterministic Scoring
// Computes factor scores, continuity estimate, and subtotals from canonical inputs.

import type { CanonicalInput, RawScoreBreakdown, VariabilityLevel } from "../types";
import {
  INCOME_PERSISTENCE_SCORE_TABLE,
  SOURCE_DIVERSITY_SCORE_TABLE,
  FORWARD_SECURED_SCORE_TABLE,
  CONCENTRATION_INVERSE_SCORE_TABLE,
  LABOR_DEPENDENCE_INVERSE_SCORE_TABLE,
  VARIABILITY_INVERSE_SCORE_TABLE,
  CONTINUITY_SCORE_TABLE,
} from "../constants";

/** Look up score from a [min, max, points] range table */
export function lookupRangeScore(
  value: number,
  table: readonly [number, number, number][],
): number {
  for (const [min, max, points] of table) {
    if (value >= min && value <= max) return points;
  }
  return 0;
}

/** Look up score from a [count, points] table (uses highest matching entry) */
export function lookupCountScore(
  count: number,
  table: readonly [number, number][],
): number {
  for (let i = table.length - 1; i >= 0; i--) {
    if (count >= table[i][0]) return table[i][1];
  }
  return table[0][1];
}

/**
 * Continuity estimate formula:
 * continuity_months = (persistence * 0.03) + (forward * 0.04) + ((100 - labor) * 0.02) - (largest * 0.015)
 * Clamped to [0, 12]
 */
export function computeContinuityMonths(n: CanonicalInput): number {
  const raw =
    n.income_persistence_pct * 0.03 +
    n.forward_secured_pct * 0.04 +
    (100 - n.labor_dependence_pct) * 0.02 -
    n.largest_source_pct * 0.015;
  return Math.min(12, Math.max(0, raw));
}

/** Compute all raw factor scores and subtotals */
export function computeRawScores(n: CanonicalInput): RawScoreBreakdown {
  const income_persistence_score = lookupRangeScore(
    n.income_persistence_pct,
    INCOME_PERSISTENCE_SCORE_TABLE,
  );
  const source_diversity_score = lookupCountScore(
    n.source_diversity_count,
    SOURCE_DIVERSITY_SCORE_TABLE,
  );
  const forward_security_score = lookupRangeScore(
    n.forward_secured_pct,
    FORWARD_SECURED_SCORE_TABLE,
  );
  const concentration_resilience_score = lookupRangeScore(
    n.largest_source_pct,
    CONCENTRATION_INVERSE_SCORE_TABLE,
  );
  const labor_dependence_score = lookupRangeScore(
    n.labor_dependence_pct,
    LABOR_DEPENDENCE_INVERSE_SCORE_TABLE,
  );
  const variability_score =
    VARIABILITY_INVERSE_SCORE_TABLE[n.income_variability_level];

  const continuity_months = computeContinuityMonths(n);
  const continuity_score = lookupRangeScore(
    continuity_months,
    CONTINUITY_SCORE_TABLE,
  );

  // Structure block: persistence(15) + diversity(10) + forward(15) + concentration(10) = 50 max
  // Quality adjustment(10) added separately by orchestrator = 60 total
  const structure_subtotal =
    income_persistence_score +
    source_diversity_score +
    forward_security_score +
    concentration_resilience_score;

  // Stability block: labor(20) + variability(10) + continuity(10) = 40 max
  const stability_subtotal =
    labor_dependence_score + variability_score + continuity_score;

  const raw_total = structure_subtotal + stability_subtotal;

  return {
    income_persistence_score,
    source_diversity_score,
    forward_security_score,
    concentration_resilience_score,
    labor_dependence_score,
    variability_score,
    continuity_months,
    continuity_score,
    structure_subtotal,
    stability_subtotal,
    raw_total,
  };
}
