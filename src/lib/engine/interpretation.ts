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
    text: `Stability Classification: Limited Stability Determination under Model RP-1.0 stability methodology. Income structure is in an early stage of stability. Revenue continuity may rely primarily on active work or a limited number of income sources. Building recurring or built-in income may strengthen the durability and persistence of income over time. Income within this band represent developing foundations for long-term income continuity under Model RP-1.0.`,
  },
  "Developing Stability": {
    key: "developing_stability",
    text: `Stability Classification: Developing Stability Determination under Model RP-1.0 stability methodology. Income structure demonstrates emerging stability. Elements such as diversification, recurring revenue, or forward visibility may be present but remain in the process of strengthening. Income within this band show measurable progress toward durable income continuity under typical market conditions.`,
  },
  "Established Stability": {
    key: "established_stability",
    text: `Stability Classification: Established Stability Determination under Model RP-1.0 stability methodology. Income demonstrates durable continuity under disruption. Revenue typically reflects multiple contributing sources and may include recurring characteristics or forward contractual visibility. Income within this band represents stable income with opportunities to further strengthen persistence and durability.`,
  },
  "High Stability": {
    key: "high_stability",
    text: `Stability Classification: High Stability Determination under Model RP-1.0 stability methodology. Income demonstrates strong persistence and resilience. Revenue continuity is supported by diversified income sources, forward revenue visibility, and meaningful income persistence beyond immediate operational activity. Income within this band represents the upper tier of income durability under Model RP-1.0.`,
  },
};

// Constraint text templates — rich, specific descriptions explaining WHY this matters
const CONSTRAINT_TEXTS: Record<CanonicalKey, string> = {
  income_continuity_without_active_labor:
    "Income stops when active work stops. This creates a direct dependency between personal effort and revenue — meaning illness, time off, or capacity limits directly reduce income. This is the single largest vulnerability because it makes the entire revenue stream dependent on one person's sustained output.",
  recurring_income_proportion:
    "Revenue is predominantly generated through one-time transactions rather than recurring arrangements. Each month starts near zero, requiring new sales or engagements to maintain income levels. Without a recurring base, the income system lacks the predictable foundation that enables planning, investment, and growth.",
  forward_revenue_visibility:
    "Future income is uncertain — there is limited contractual or committed revenue beyond the immediate period. This creates anxiety around pipeline, makes cash flow unpredictable, and forces reactive rather than strategic decision-making. Forward visibility is what separates stable income systems from month-to-month uncertainty.",
  income_concentration:
    "Revenue depends heavily on a small number of sources, creating outsized exposure to any single client or contract. If the largest source were to end, the impact on total income would be severe. This is like building on a single foundation pillar.",
  number_of_income_sources:
    "Income draws from too few sources. With limited diversification, the loss of any single source represents a significant percentage of total income. Having multiple independent sources each contributing meaningful revenue is a core indicator of income durability.",
  earnings_variability:
    "Month-to-month income fluctuates significantly, creating unpredictable cash flow patterns. High variability makes financial planning difficult, increases stress, and can mask underlying weaknesses. Consistency — not just total earnings — is a key driver of long-term income stability.",
};

// Driver text templates — specific explanations of how each factor contributes
const DRIVER_TEXTS: Record<CanonicalKey, string> = {
  recurring_income_proportion:
    "A meaningful portion of revenue recurs automatically through subscriptions, retainers, or ongoing agreements. This recurring base provides predictable monthly income that doesn't require new sales activity to sustain.",
  income_concentration:
    "Revenue is distributed across multiple clients or sources, reducing the impact of losing any single one. This diversification provides a natural buffer against client turnover and market disruptions.",
  number_of_income_sources:
    "Multiple independent income sources contribute to total revenue, creating breadth. Each additional qualifying source reduces the proportional impact of any single loss.",
  forward_revenue_visibility:
    "A portion of future income is already committed through contracts, agreements, or scheduled work. This forward visibility enables confident planning and reduces month-to-month uncertainty.",
  earnings_variability:
    "Monthly income remains relatively consistent, indicating stable demand and predictable revenue patterns. Low variability reduces cash flow stress and supports reliable financial planning.",
  income_continuity_without_active_labor:
    "A meaningful portion of income continues even during periods of reduced active work. This persistence — through recurring contracts, asset income, or automated revenue — provides a safety net.",
};

// Structural priority text templates — observational, not prescriptive
const PRIORITY_TEXTS: Record<CanonicalKey, string> = {
  income_continuity_without_active_labor:
    "Income persistence — revenue that continues without active work — is the structural factor with the greatest weight in this score. Income systems that shift even a portion of revenue from active to persistent tend to show measurably different structural profiles.",
  recurring_income_proportion:
    "The recurring revenue base is the structural factor with the most room for change. Income systems that include retainer-based or subscription-based arrangements tend to exhibit more predictable monthly revenue patterns.",
  forward_revenue_visibility:
    "Forward revenue visibility — income committed through contracts, advance bookings, or multi-month agreements — is the structural factor most directly associated with reduced month-to-month uncertainty in this profile.",
  income_concentration:
    "Revenue concentration on a limited number of sources is the most prominent structural characteristic in this profile. Income systems with broader source distribution tend to show greater resilience to individual source loss.",
  number_of_income_sources:
    "The number of qualifying income sources is the structural factor with the most direct path to measured improvement. Each independent source contributing at least 10% of total income adds measurable diversification.",
  earnings_variability:
    "Month-to-month income fluctuation is the structural characteristic most affecting this profile. Income systems with more predictable revenue arrangements tend to show greater structural consistency.",
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
