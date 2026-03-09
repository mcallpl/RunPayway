// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Interpretation Selection

import type {
  CanonicalKey,
  DiagnosticInput,
  InterpretationResult,
  StabilityBand,
} from "./types";
import {
  CONSTRAINT_TIE_BREAK_ORDER,
  DRIVER_TIE_BREAK_ORDER,
  STRUCTURAL_PRIORITY_MAP,
  FIELD_LABELS,
} from "./constants";

// Locked band interpretation blocks — Section 12
const BAND_INTERPRETATIONS: Record<
  StabilityBand,
  { key: string; text: string }
> = {
  "Limited Stability": {
    key: "limited_stability",
    text: `Stability Classification: Limited Stability\nDetermination under Model RP-1.0 structural stability methodology.\n\nIncome structure is in an early stage of structural stability.\n\nRevenue continuity may rely primarily on active work or a limited number of income sources. Structural reinforcement may strengthen the durability and persistence of income over time.\n\nIncome structures within this band represent developing foundations for long-term income continuity under Model RP-1.0.`,
  },
  "Developing Stability": {
    key: "developing_stability",
    text: `Stability Classification: Developing Stability\nDetermination under Model RP-1.0 structural stability methodology.\n\nIncome structure demonstrates emerging structural stability.\n\nElements such as diversification, recurring revenue, or forward visibility may be present but remain in the process of strengthening.\n\nIncome structures within this band show measurable progress toward durable income continuity under typical market conditions.`,
  },
  "Established Stability": {
    key: "established_stability",
    text: `Stability Classification: Established Stability\nDetermination under Model RP-1.0 structural stability methodology.\n\nIncome structure demonstrates durable continuity under disruption.\n\nRevenue typically reflects multiple contributing sources and may include recurring characteristics or forward contractual visibility.\n\nIncome structures within this band represent stable operational income systems with opportunities for additional persistence and structural reinforcement.`,
  },
  "High Stability": {
    key: "high_stability",
    text: `Stability Classification: High Stability\nDetermination under Model RP-1.0 structural stability methodology.\n\nIncome structure demonstrates strong persistence and resilience.\n\nRevenue continuity is supported by diversified income sources, forward revenue visibility, and meaningful income persistence beyond immediate operational activity.\n\nIncome structures within this band represent the upper tier of structural income durability under Model RP-1.0.`,
  },
};

// Constraint text templates (deterministic, no coaching language)
const CONSTRAINT_TEXTS: Record<CanonicalKey, string> = {
  income_continuity_without_active_labor:
    "Income continuity without active labor is the primary structural constraint identified in this assessment.",
  recurring_income_proportion:
    "Recurring income proportion is the primary structural constraint identified in this assessment.",
  forward_revenue_visibility:
    "Forward revenue visibility is the primary structural constraint identified in this assessment.",
  income_concentration:
    "Income concentration is the primary structural constraint identified in this assessment.",
  number_of_income_sources:
    "Number of income sources is the primary structural constraint identified in this assessment.",
  earnings_variability:
    "Earnings variability is the primary structural constraint identified in this assessment.",
};

// Driver text templates
const DRIVER_TEXTS: Record<CanonicalKey, string> = {
  recurring_income_proportion:
    "Recurring revenue base contributes to structural income stability.",
  income_concentration:
    "Income concentration level supports diversification of revenue sources.",
  number_of_income_sources:
    "Income source count supports structural breadth of the income system.",
  forward_revenue_visibility:
    "Forward revenue visibility supports predictability of future income.",
  earnings_variability:
    "Earnings variability level supports consistency of income over time.",
  income_continuity_without_active_labor:
    "Income continuity without active labor supports persistence of revenue.",
};

// Structural priority text templates
const PRIORITY_TEXTS: Record<CanonicalKey, string> = {
  income_continuity_without_active_labor:
    "Increasing income persistence is the structural priority identified for this income system.",
  recurring_income_proportion:
    "Expanding the recurring revenue base is the structural priority identified for this income system.",
  forward_revenue_visibility:
    "Extending forward revenue commitments is the structural priority identified for this income system.",
  income_concentration:
    "Reducing income concentration is the structural priority identified for this income system.",
  number_of_income_sources:
    "Increasing qualifying income sources is the structural priority identified for this income system.",
  earnings_variability:
    "Reducing earnings variability is the structural priority identified for this income system.",
};

export function selectInterpretation(
  inputs: DiagnosticInput,
  finalScore: number,
  stabilityBand: StabilityBand
): InterpretationResult {
  // Band interpretation
  const bandInterp = BAND_INTERPRETATIONS[stabilityBand];

  // Primary structural constraint: lowest value, tie-break by constraint order
  const primaryConstraintKey = selectPrimaryConstraint(inputs);

  // Structural drivers: top 3 highest values excluding constraint
  const drivers = selectDrivers(inputs, primaryConstraintKey);

  return {
    band_interpretation_key: bandInterp.key,
    band_interpretation_text: bandInterp.text,

    primary_constraint_key: primaryConstraintKey,
    primary_constraint_label: FIELD_LABELS[primaryConstraintKey],
    primary_constraint_text: CONSTRAINT_TEXTS[primaryConstraintKey],

    driver_1_key: drivers[0],
    driver_1_label: FIELD_LABELS[drivers[0]],
    driver_1_text: DRIVER_TEXTS[drivers[0]],

    driver_2_key: drivers[1],
    driver_2_label: FIELD_LABELS[drivers[1]],
    driver_2_text: DRIVER_TEXTS[drivers[1]],

    driver_3_key: drivers[2],
    driver_3_label: FIELD_LABELS[drivers[2]],
    driver_3_text: DRIVER_TEXTS[drivers[2]],

    structural_priority_key: primaryConstraintKey,
    structural_priority_label: STRUCTURAL_PRIORITY_MAP[primaryConstraintKey],
    structural_priority_text: PRIORITY_TEXTS[primaryConstraintKey],
  };
}

function selectPrimaryConstraint(inputs: DiagnosticInput): CanonicalKey {
  let lowestValue = Infinity;
  let constraintKey: CanonicalKey = CONSTRAINT_TIE_BREAK_ORDER[0];

  for (const key of CONSTRAINT_TIE_BREAK_ORDER) {
    const value = inputs[key];
    if (value < lowestValue) {
      lowestValue = value;
      constraintKey = key;
    }
  }

  return constraintKey;
}

function selectDrivers(
  inputs: DiagnosticInput,
  excludeKey: CanonicalKey
): [CanonicalKey, CanonicalKey, CanonicalKey] {
  // Collect all keys except constraint
  const candidates = DRIVER_TIE_BREAK_ORDER.filter((k) => k !== excludeKey);

  // Sort by value descending, tie-break by driver order (earlier = higher priority)
  candidates.sort((a, b) => {
    const diff = inputs[b] - inputs[a];
    if (diff !== 0) return diff;
    return (
      DRIVER_TIE_BREAK_ORDER.indexOf(a) - DRIVER_TIE_BREAK_ORDER.indexOf(b)
    );
  });

  return [candidates[0], candidates[1], candidates[2]];
}
