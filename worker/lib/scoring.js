// RunPayway — Scoring tables and simulation engine

/** @type {ReadonlyArray<[number, number, number]>} income_persistence_pct -> 0-15 points */
const INCOME_PERSISTENCE_SCORE_TABLE = [
  [0,   10,  1],
  [11,  20,  3],
  [21,  35,  5],
  [36,  50,  8],
  [51,  65,  11],
  [66,  80,  13],
  [81,  100, 15],
];

/** @type {ReadonlyArray<[number, number]>} source_diversity_count -> 0-10 points */
const SOURCE_DIVERSITY_SCORE_TABLE = [
  [1, 1],
  [2, 3],
  [3, 5],
  [4, 7],
  [5, 8],
  [6, 10],
];

/** @type {ReadonlyArray<[number, number, number]>} forward_secured_pct -> 0-15 points */
const FORWARD_SECURED_SCORE_TABLE = [
  [0,   5,   0],
  [6,   15,  2],
  [16,  30,  5],
  [31,  45,  8],
  [46,  60,  11],
  [61,  75,  13],
  [76,  100, 15],
];

/** @type {ReadonlyArray<[number, number, number]>} largest_source_pct (inverse) -> 0-10 points */
const CONCENTRATION_INVERSE_SCORE_TABLE = [
  [0,   20,  10],
  [21,  35,  8],
  [36,  50,  6],
  [51,  65,  4],
  [66,  80,  2],
  [81,  100, 0],
];

/** @type {ReadonlyArray<[number, number, number]>} labor_dependence_pct (inverse) -> 0-20 points */
const LABOR_DEPENDENCE_INVERSE_SCORE_TABLE = [
  [0,   20,  20],
  [21,  35,  17],
  [36,  50,  14],
  [51,  65,  10],
  [66,  80,  6],
  [81,  100, 2],
];

/** @type {Record<string, number>} income_variability_level (inverse) -> 0-10 points */
const VARIABILITY_INVERSE_SCORE_TABLE = {
  low: 10,
  moderate: 7,
  high: 3,
  extreme: 0,
};

/** @type {ReadonlyArray<[number, number, number]>} continuity_months -> 0-10 points */
const CONTINUITY_SCORE_TABLE = [
  [0,     0.9,  0],
  [1.0,   1.9,  2],
  [2.0,   2.9,  4],
  [3.0,   4.4,  6],
  [4.5,   6.0,  8],
  [6.01,  12,   10],
];

/** @type {ReadonlyArray<{min: number, max: number, band: string}>} */
const BAND_THRESHOLDS = [
  { min: 0,  max: 29,  band: "Limited Stability" },
  { min: 30, max: 49,  band: "Developing Stability" },
  { min: 50, max: 74,  band: "Established Stability" },
  { min: 75, max: 100, band: "High Stability" },
];

/**
 * Interaction penalty/bonus rules.
 * @type {Array<{code: string, type: string, points: number, condition: function, factors: string[], description: string}>}
 */
const INTERACTION_RULES = [
  {
    code: "CF-01", type: "penalty", points: -5,
    condition: (n) => n.largest_source_pct >= 70 && n.forward_secured_pct <= 20,
    factors: ["largest_source_pct", "forward_secured_pct"],
    description: "High concentration with weak forward visibility",
  },
  {
    code: "CF-02", type: "penalty", points: -5,
    condition: (n) => n.labor_dependence_pct >= 75 && n.income_persistence_pct <= 25,
    factors: ["labor_dependence_pct", "income_persistence_pct"],
    description: "High labor dependence with low persistence",
  },
  {
    code: "CF-03", type: "penalty", points: -4,
    condition: (n) => n.source_diversity_count >= 4 && n.largest_source_pct >= 65,
    factors: ["source_diversity_count", "largest_source_pct"],
    description: "Diverse sources but still concentrated",
  },
  {
    code: "CF-04", type: "penalty", points: -5,
    condition: (n, ext) => n.income_persistence_pct >= 50 && ext?.cancellation_risk_level === "high",
    factors: ["income_persistence_pct", "cancellation_risk_level"],
    description: "Persistent revenue but high cancellation risk",
  },
  {
    code: "CF-05", type: "penalty", points: -4,
    condition: (n, ext) => n.forward_secured_pct >= 40 && (ext?.booked_but_cancelable_pct ?? 0) >= 50,
    factors: ["forward_secured_pct", "booked_but_cancelable_pct"],
    description: "Forward revenue mostly cancelable",
  },
  {
    code: "CF-06", type: "penalty", points: -4,
    condition: (n) => n.source_diversity_count <= 2 && n.income_variability_level === "extreme",
    factors: ["source_diversity_count", "income_variability_level"],
    description: "Few sources with extreme variability",
  },
  {
    code: "CF-B01", type: "bonus", points: 3,
    condition: (n) => n.forward_secured_pct >= 45 && n.largest_source_pct <= 35,
    factors: ["forward_secured_pct", "largest_source_pct"],
    description: "Strong visibility with low concentration",
  },
  {
    code: "CF-B02", type: "bonus", points: 4,
    condition: (n) => n.income_persistence_pct >= 60 && n.labor_dependence_pct <= 35,
    factors: ["income_persistence_pct", "labor_dependence_pct"],
    description: "High persistence with low labor dependence",
  },
];

const NET_ADJUSTMENT_CLAMP = { min: -12, max: 8 };
const FRAGILITY_BASE = 100;

/** @type {ReadonlyArray<[number, number, string]>} */
const FRAGILITY_CLASS_TABLE = [
  [0,  24,  "brittle"],
  [25, 44,  "thin"],
  [45, 64,  "uneven"],
  [65, 79,  "supported"],
  [80, 100, "resilient"],
];

// ── Lookup utilities ──

function lookupRange(value, table) {
  for (const [min, max, points] of table) {
    if (value >= min && value <= max) return points;
  }
  return 0;
}

function lookupCount(count, table) {
  for (let i = table.length - 1; i >= 0; i--) {
    if (count >= table[i][0]) return table[i][1];
  }
  return table[0][1];
}

// ── simulateScore ──

/**
 * @param {{income_persistence_pct: number, largest_source_pct: number, source_diversity_count: number, forward_secured_pct: number, income_variability_level: string, labor_dependence_pct: number}} inputs
 * @param {number} [qualityScore]
 * @returns {{overall_score: number, band: string, structure_score: number, stability_score: number, interaction_adjustment: number, continuity_months: number, fragility_class: string, factor_scores: object}}
 */
export function simulateScore(inputs, qualityScore) {
  const qAdj = qualityScore ?? 5;

  // Factor scores
  const persistence = lookupRange(inputs.income_persistence_pct, INCOME_PERSISTENCE_SCORE_TABLE);
  const diversity = lookupCount(inputs.source_diversity_count, SOURCE_DIVERSITY_SCORE_TABLE);
  const forward = lookupRange(inputs.forward_secured_pct, FORWARD_SECURED_SCORE_TABLE);
  const concentration = lookupRange(inputs.largest_source_pct, CONCENTRATION_INVERSE_SCORE_TABLE);
  const labor = lookupRange(inputs.labor_dependence_pct, LABOR_DEPENDENCE_INVERSE_SCORE_TABLE);
  const variability = VARIABILITY_INVERSE_SCORE_TABLE[inputs.income_variability_level];

  // Continuity
  const continuity_months = Math.min(12, Math.max(0,
    inputs.income_persistence_pct * 0.03 +
    inputs.forward_secured_pct * 0.04 +
    (100 - inputs.labor_dependence_pct) * 0.02 -
    inputs.largest_source_pct * 0.015,
  ));
  const continuity = lookupRange(continuity_months, CONTINUITY_SCORE_TABLE);

  // Subtotals
  const structure_score = persistence + diversity + forward + concentration + qAdj;
  const stability_score = labor + variability + continuity;

  // Interactions
  let totalPenalty = 0;
  let totalBonus = 0;
  for (const rule of INTERACTION_RULES) {
    if (rule.condition(inputs)) {
      if (rule.type === "penalty") totalPenalty += rule.points;
      else totalBonus += rule.points;
    }
  }
  const interaction_adjustment = Math.max(
    NET_ADJUSTMENT_CLAMP.min,
    Math.min(NET_ADJUSTMENT_CLAMP.max, totalPenalty + totalBonus),
  );

  const overall_score = Math.max(0, Math.min(100,
    structure_score + stability_score + interaction_adjustment,
  ));

  // Band
  let band = "Limited Stability";
  for (const { min, max, band: b } of BAND_THRESHOLDS) {
    if (overall_score >= min && overall_score <= max) {
      band = b;
      break;
    }
  }

  // Fragility
  let fragScore = FRAGILITY_BASE;
  if (inputs.largest_source_pct >= 70) fragScore -= 25;
  if (inputs.labor_dependence_pct >= 80) fragScore -= 20;
  if (inputs.forward_secured_pct <= 10) fragScore -= 20;
  if (inputs.income_variability_level === "high") fragScore -= 10;
  if (inputs.income_variability_level === "extreme") fragScore -= 20;
  if (continuity_months < 1) fragScore -= 15;
  fragScore = Math.max(0, Math.min(100, fragScore));

  let fragility_class = "resilient";
  for (const [min, max, cls] of FRAGILITY_CLASS_TABLE) {
    if (fragScore >= min && fragScore <= max) {
      fragility_class = cls;
      break;
    }
  }

  return {
    overall_score,
    band,
    structure_score,
    stability_score,
    interaction_adjustment,
    continuity_months,
    fragility_class,
    factor_scores: { persistence, diversity, forward, concentration, labor, variability, continuity },
  };
}

// ── Timeline projection ──

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function buildTimelineNarrative(month, delta, newBand, oldBand, isNegative, interpolated, original) {
  if (delta === 0) return "No measurable impact yet — structural changes take time to compound.";
  const bandCrossed = newBand !== oldBand;

  if (isNegative) {
    if (month <= 3) return `Immediate impact: ${Math.abs(delta)}-point drop as income structure weakens.`;
    if (month <= 6) return bandCrossed
      ? `Full damage realized — drops to ${newBand}. Recovery requires structural rebuilding.`
      : `Continued erosion as reduced structure compounds. ${Math.abs(delta)} points lost.`;
    return bandCrossed
      ? `Long-term structural damage: ${newBand}. The compounding effect of weaker fundamentals.`
      : `Sustained ${Math.abs(delta)}-point deficit. Without intervention, this becomes the new baseline.`;
  }

  const recDelta = interpolated.income_persistence_pct - original.income_persistence_pct;
  const fwdDelta = interpolated.forward_secured_pct - original.forward_secured_pct;

  if (month <= 3) {
    const drivers = [];
    if (recDelta > 5) drivers.push("recurring revenue gains");
    if (fwdDelta > 5) drivers.push("forward commitments");
    return `Early momentum: +${delta} from ${drivers.length > 0 ? drivers.join(" and ") : "structural improvements"}.`;
  }
  if (month <= 6) {
    return bandCrossed
      ? `Crosses into ${newBand} — interaction bonuses begin unlocking.`
      : `Structural changes taking hold. +${delta} points as compounding effects build.`;
  }
  return bandCrossed
    ? `Full compound effect: ${newBand} with +${delta} total gain. Interaction bonuses fully active.`
    : `+${delta} points. Structural improvements fully embedded — this is your new operating baseline.`;
}

/**
 * @param {{income_persistence_pct: number, largest_source_pct: number, source_diversity_count: number, forward_secured_pct: number, income_variability_level: string, labor_dependence_pct: number}} currentInputs
 * @param {{income_persistence_pct: number, largest_source_pct: number, source_diversity_count: number, forward_secured_pct: number, income_variability_level: string, labor_dependence_pct: number}} targetInputs
 * @param {number} [qualityScore]
 * @returns {Array<{month: number, label: string, score: number, band: string, delta: number, fragility_class: string, continuity_months: number, narrative: string}>}
 */
export function projectTimeline(currentInputs, targetInputs, qualityScore) {
  const qAdj = qualityScore ?? 5;
  const base = simulateScore(currentInputs, qAdj);

  const ramps = [
    { month: 3,  label: "3 months",  pct: 0.40 },
    { month: 6,  label: "6 months",  pct: 0.75 },
    { month: 12, label: "12 months", pct: 1.00 },
  ];

  const targetScore = simulateScore(targetInputs, qAdj).overall_score;
  const isNegative = targetScore < base.overall_score;

  return ramps.map(({ month, label, pct }) => {
    const effectivePct = isNegative ? Math.min(1, pct * 1.6) : pct;

    const interpolated = {
      income_persistence_pct: Math.round(lerp(currentInputs.income_persistence_pct, targetInputs.income_persistence_pct, effectivePct)),
      largest_source_pct: Math.round(lerp(currentInputs.largest_source_pct, targetInputs.largest_source_pct, effectivePct)),
      source_diversity_count: Math.round(lerp(currentInputs.source_diversity_count, targetInputs.source_diversity_count, effectivePct)),
      forward_secured_pct: Math.round(lerp(currentInputs.forward_secured_pct, targetInputs.forward_secured_pct, effectivePct)),
      income_variability_level: effectivePct >= 0.5 ? targetInputs.income_variability_level : currentInputs.income_variability_level,
      labor_dependence_pct: Math.round(lerp(currentInputs.labor_dependence_pct, targetInputs.labor_dependence_pct, effectivePct)),
    };

    const sim = simulateScore(interpolated, qAdj);

    let compoundingBonus = 0;
    if (!isNegative && month === 12 && sim.overall_score > base.overall_score) {
      compoundingBonus = Math.round((sim.overall_score - base.overall_score) * 0.08);
    }

    const finalScore = Math.max(0, Math.min(100, sim.overall_score + compoundingBonus));

    let band = "Limited Stability";
    for (const { min, max, band: b } of BAND_THRESHOLDS) {
      if (finalScore >= min && finalScore <= max) { band = b; break; }
    }

    const delta = finalScore - base.overall_score;
    const narrative = buildTimelineNarrative(month, delta, sim.band, base.band, isNegative, interpolated, currentInputs);

    return { month, label, score: finalScore, band, delta, fragility_class: sim.fragility_class, continuity_months: sim.continuity_months, narrative };
  });
}

// ══════════════════════════════════════════════════════════
// SIMULATOR PRESETS
// ══════════════════════════════════════════════════════════

export const SIMULATOR_PRESETS = [
  {
    id: "add_client",
    label: "Add one additional consistent client",
    description: "One new income source that produces steady, recurring work — reducing how much depends on your current biggest source",
    modify: (base) => ({
      ...base,
      source_diversity_count: Math.min(8, base.source_diversity_count + 1),
      largest_source_pct: Math.max(15, Math.round(base.largest_source_pct * 0.75)),
    }),
  },
  {
    id: "convert_retainer",
    label: "Convert one client to a monthly retainer",
    description: "Move your biggest client from project-based to a recurring monthly agreement — income repeats without re-selling",
    modify: (base) => ({
      ...base,
      income_persistence_pct: Math.min(100, base.income_persistence_pct + 20),
      forward_secured_pct: Math.min(100, base.forward_secured_pct + 15),
    }),
  },
  {
    id: "lose_top_client",
    label: "Your biggest client stops paying",
    description: "Your single largest income source disappears — along with everything tied to it",
    modify: (base) => {
      const lossFactor = base.largest_source_pct / 100;
      const remainingSourceCount = Math.max(1, base.source_diversity_count - 1);
      const newLargest = remainingSourceCount <= 1 ? 100 : Math.min(100, Math.round((100 - base.largest_source_pct) / remainingSourceCount * 1.5));
      return {
        ...base,
        largest_source_pct: newLargest,
        source_diversity_count: remainingSourceCount,
        income_persistence_pct: Math.max(0, Math.round(base.income_persistence_pct * (1 - lossFactor))),
        forward_secured_pct: Math.max(0, Math.round(base.forward_secured_pct * (1 - lossFactor * 0.7))),
        income_variability_level: base.income_variability_level === "low" ? "moderate" : base.income_variability_level === "moderate" ? "high" : "extreme",
      };
    },
  },
  {
    id: "build_passive",
    label: "Create one income stream that continues without your daily work",
    description: "Launch a product, license, or recurring arrangement that produces revenue whether you work that day or not",
    modify: (base) => ({
      ...base,
      labor_dependence_pct: Math.max(12, base.labor_dependence_pct - 20),
      income_persistence_pct: Math.min(100, base.income_persistence_pct + 10),
    }),
  },
  {
    id: "lock_forward",
    label: "Secure next quarter with signed commitments",
    description: "Get written agreements, prepaid packages, or retainers that lock in revenue before the month starts",
    modify: (base) => ({
      ...base,
      forward_secured_pct: Math.min(100, base.forward_secured_pct + 25),
    }),
  },
  {
    id: "cant_work_90_days",
    label: "You cannot work for 90 days",
    description: "Illness, injury, or personal event stops all active work — only passive and pre-committed income continues",
    modify: (base) => ({
      ...base,
      labor_dependence_pct: 100,
      forward_secured_pct: Math.max(0, Math.round(base.forward_secured_pct * 0.5)),
    }),
  },
];

export const INDUSTRY_PRESET_MAP = {
  real_estate: [
    { id: "listing_falls_through", label: "Your top listing falls through", description: "A high-value deal you were counting on collapses — the commission disappears and pipeline momentum stalls", modify: (b) => ({ ...b, forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.4)), income_variability_level: "high" }) },
    { id: "seasonal_slowdown", label: "Market enters seasonal slowdown", description: "Transaction volume drops for 2–3 months — fewer closings, longer timelines, reduced income flow", modify: (b) => ({ ...b, income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.6)), forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.5)) }) },
    ...SIMULATOR_PRESETS,
  ],
  consulting_professional_services: [
    { id: "retainer_cancels", label: "Your biggest retainer cancels", description: "Your largest recurring client ends the engagement — monthly income drops and forward visibility resets", modify: (b) => ({ ...b, largest_source_pct: Math.min(100, Math.round(b.largest_source_pct * 1.3)), income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.6)), forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.5)) }) },
    { id: "project_gap", label: "3-month gap between projects", description: "Current engagement ends and the next one hasn't started — income pauses while overhead continues", modify: (b) => ({ ...b, forward_secured_pct: Math.max(0, b.forward_secured_pct - 25), income_variability_level: "high" }) },
    ...SIMULATOR_PRESETS,
  ],
  sales_brokerage: [
    { id: "deal_pipeline_stalls", label: "Your deal pipeline stalls", description: "Multiple expected closings push to next quarter — commission income compresses", modify: (b) => ({ ...b, forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.3)), income_variability_level: "extreme" }) },
    ...SIMULATOR_PRESETS,
  ],
  construction_trades: [
    { id: "job_start_delayed", label: "Next job start date moves out 6 weeks", description: "Permits, weather, or client delays push the start — crew sits idle, income gaps open", modify: (b) => ({ ...b, forward_secured_pct: Math.max(0, b.forward_secured_pct - 20), income_variability_level: "high" }) },
    ...SIMULATOR_PRESETS,
  ],
  media_entertainment: [
    { id: "booking_drought", label: "No new bookings for 60 days", description: "The pipeline goes quiet — no projects, no appearances, no incoming work", modify: (b) => ({ ...b, forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.2)), income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.5)) }) },
    ...SIMULATOR_PRESETS,
  ],
  legal_services: [
    { id: "major_matter_concludes", label: "Your largest matter concludes", description: "A major case or engagement that was driving revenue completes — billing drops and replacement pipeline is thin", modify: (b) => ({ ...b, largest_source_pct: Math.min(100, Math.round(b.largest_source_pct * 1.4)), forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.5)) }) },
    ...SIMULATOR_PRESETS,
  ],
  healthcare: [
    { id: "compensation_model_shifts", label: "Your compensation model changes", description: "The institution restructures pay, shifts hours, or modifies reimbursement rates — stable income becomes variable", modify: (b) => ({ ...b, income_variability_level: "high", income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.7)) }) },
    ...SIMULATOR_PRESETS,
  ],
  insurance: [
    { id: "renewal_book_erodes", label: "Renewal retention drops 20%", description: "Clients don't renew — the recurring income base that supports your production erodes underneath you", modify: (b) => ({ ...b, income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.7)), forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.7)) }) },
    ...SIMULATOR_PRESETS,
  ],
  retail_ecommerce: [
    { id: "demand_softens", label: "Sales volume drops 30%", description: "Demand weakens, conversion drops, or a platform algorithm change reduces traffic — revenue compresses while costs stay", modify: (b) => ({ ...b, income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.65)), income_variability_level: "high" }) },
    ...SIMULATOR_PRESETS,
  ],
  hospitality_food_service: [
    { id: "traffic_drops", label: "Customer traffic drops 25%", description: "Foot traffic or reservations decline — thin margins get thinner and labor costs stay fixed", modify: (b) => ({ ...b, income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.6)), income_variability_level: "high" }) },
    ...SIMULATOR_PRESETS,
  ],
  education: [
    { id: "contract_not_renewed", label: "Your position contract isn't renewed", description: "Funding shifts or institutional restructuring means your role doesn't continue — limited flexibility to replace", modify: (b) => ({ ...b, forward_secured_pct: 0, largest_source_pct: 100, income_variability_level: "extreme" }) },
    ...SIMULATOR_PRESETS,
  ],
  transportation_logistics: [
    { id: "route_contract_lost", label: "Your primary route or contract is lost", description: "The carrier, shipper, or client pulls the contract — volume drops and replacement takes time", modify: (b) => ({ ...b, largest_source_pct: Math.min(100, Math.round(b.largest_source_pct * 1.5)), forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.3)) }) },
    ...SIMULATOR_PRESETS,
  ],
  agriculture: [
    { id: "cycle_underperforms", label: "This season's yield underperforms", description: "Weather, pricing, or timing works against you — one cycle's economics reset the full period", modify: (b) => ({ ...b, income_variability_level: "extreme", forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.3)) }) },
    ...SIMULATOR_PRESETS,
  ],
  technology: [
    { id: "employer_restructures", label: "Your employer restructures compensation", description: "Base stays but bonus structure, RSU vesting, or performance targets change — variable portion shifts", modify: (b) => ({ ...b, income_variability_level: "high", income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.7)) }) },
    ...SIMULATOR_PRESETS,
  ],
  energy_utilities: [
    { id: "regulatory_shift", label: "Regulatory conditions change", description: "Capital cycles, market structures, or policy shifts alter the economics of your role or business", modify: (b) => ({ ...b, forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.5)), income_variability_level: "high" }) },
    ...SIMULATOR_PRESETS,
  ],
  finance_banking: [
    { id: "bonus_cut", label: "Performance-linked compensation drops 40%", description: "Markets soften, targets move, or activity slows — the variable portion of your pay weakens", modify: (b) => ({ ...b, income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.6)), income_variability_level: "high" }) },
    ...SIMULATOR_PRESETS,
  ],
  manufacturing: [
    { id: "demand_shift", label: "Customer demand drops and output slows", description: "Orders decrease or a key customer pulls back — production slows while operating costs remain", modify: (b) => ({ ...b, income_persistence_pct: Math.max(0, Math.round(b.income_persistence_pct * 0.6)), largest_source_pct: Math.min(100, Math.round(b.largest_source_pct * 1.3)) }) },
    ...SIMULATOR_PRESETS,
  ],
  nonprofit_public_sector: [
    { id: "funding_cut", label: "Funding priorities shift and budget is cut", description: "Grant allocation, budget decisions, or institutional limits reduce your position's resources", modify: (b) => ({ ...b, forward_secured_pct: Math.max(0, Math.round(b.forward_secured_pct * 0.4)), income_variability_level: "high" }) },
    ...SIMULATOR_PRESETS,
  ],
  other: SIMULATOR_PRESETS,
};
