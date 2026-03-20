// Engine 06 — Structural Indicators
// Computes 6 normalized indicators with level classifications.

import type { CanonicalInput, StructuralIndicator, IndicatorLevel } from "../types";
import { VARIABILITY_TO_NUMERIC } from "../constants";

function classifyLevel(value: number): IndicatorLevel {
  if (value <= 10) return "very_low";
  if (value <= 30) return "low";
  if (value <= 55) return "moderate";
  if (value <= 80) return "high";
  return "very_high";
}

export function computeIndicators(n: CanonicalInput): StructuralIndicator[] {
  const diversityNormalized = Math.min(
    100,
    Math.round((n.source_diversity_count / 8) * 100),
  );
  const concentrationResilience = 100 - n.largest_source_pct;
  const laborIndependence = 100 - n.labor_dependence_pct;
  const earningsStability =
    100 - VARIABILITY_TO_NUMERIC[n.income_variability_level];

  return [
    {
      key: "income_persistence",
      label: "Income Persistence",
      raw_value: n.income_persistence_pct,
      normalized_value: n.income_persistence_pct,
      level: classifyLevel(n.income_persistence_pct),
    },
    {
      key: "source_diversification",
      label: "Source Diversification",
      raw_value: n.source_diversity_count,
      normalized_value: diversityNormalized,
      level: classifyLevel(diversityNormalized),
    },
    {
      key: "forward_visibility",
      label: "Forward Revenue Visibility",
      raw_value: n.forward_secured_pct,
      normalized_value: n.forward_secured_pct,
      level: classifyLevel(n.forward_secured_pct),
    },
    {
      key: "concentration_resilience",
      label: "Concentration Resilience",
      raw_value: n.largest_source_pct,
      normalized_value: concentrationResilience,
      level: classifyLevel(concentrationResilience),
    },
    {
      key: "labor_independence",
      label: "Labor Independence",
      raw_value: n.labor_dependence_pct,
      normalized_value: laborIndependence,
      level: classifyLevel(laborIndependence),
    },
    {
      key: "earnings_stability",
      label: "Earnings Stability",
      raw_value: VARIABILITY_TO_NUMERIC[n.income_variability_level],
      normalized_value: earningsStability,
      level: classifyLevel(earningsStability),
    },
  ];
}
