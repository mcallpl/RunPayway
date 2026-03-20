// Engine 03 — Income Structure Normalization
// Maps raw answer choices to canonical numeric values.

import type { RawDiagnosticInput, CanonicalInput } from "../types";
import {
  Q1_MAPPING,
  Q2_MAPPING,
  Q3_MAPPING,
  Q4_MAPPING,
  Q5_MAPPING,
  Q6_MAPPING,
} from "../constants";

export function normalizeInputs(raw: RawDiagnosticInput): CanonicalInput {
  return {
    income_persistence_pct: Q1_MAPPING[raw.q1_recurring_revenue_base],
    largest_source_pct: Q2_MAPPING[raw.q2_income_concentration],
    source_diversity_count: Q3_MAPPING[raw.q3_income_source_diversity],
    forward_secured_pct: Q4_MAPPING[raw.q4_forward_revenue_visibility],
    income_variability_level: Q5_MAPPING[raw.q5_earnings_variability],
    labor_dependence_pct: Q6_MAPPING[raw.q6_income_continuity_without_labor],
  };
}
