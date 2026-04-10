// RunPayway AI Worker — Cloudflare Worker
// Secure proxy for all Claude API calls. Routes by URL path.
// Endpoints: /pressuremap, /plain-english, /action-plan, /save-record, /get-record, /stats,
//            /simulate, /simulate-batch, /timeline, /presets, /action-scripts/:sector,
//            /entitlement/create, /entitlement/check, /entitlement/use, /entitlement/lookup

// ══════════════════════════════════════════════════════════
// BRAND VOICE — shared across all AI endpoints
// ══════════════════════════════════════════════════════════

const BRAND_RULES = `
VOICE AND TONE:
- Write like a senior analyst preparing a private structural briefing for a high-value client
- Tone: authoritative, calm, precise, institutional
- Every sentence must earn its place — no filler, no padding, no transitions
- Use plain English — no jargon unless it is the clearest way to say something
- Be direct. State what is true. Do not hedge unnecessarily.
- Create quiet urgency — make the reader feel that acting is important, without being alarmist

LANGUAGE RULES:
- Address the user as "your" and "you" — never "the client" or "one"
- Use present tense — this is about right now
- Reference their exact numbers (percentages, scores, months) — never generalize
- Name their specific industry, operating structure, and income model in every section
- Use "structure" and "structural" — these are RunPayway brand words
- Say "income stability" not "financial stability"
- Say "structural protection" not "financial security"
- Say "income continuity" not "passive income runway"

PROHIBITED:
- Never use exclamation marks
- Never say "congratulations", "great news", "exciting", "amazing", or motivational language
- Never use emojis
- Never provide financial advice, investment recommendations, or income predictions
- Never mention specific companies, stocks, funds, or investment vehicles
- Never fabricate statistics or cite specific market data — use directional language (rising, declining, compressing, accelerating)
- Never reference competitors or other scoring/assessment tools
- Never say "you should" — say "the highest-leverage move is" or "the structural priority is"
- Never guarantee outcomes — say "projected" or "estimated" or "the model indicates"
- Never use "passive income" — say "income that continues without daily work"
- Never use "side hustle" or "gig" — say "additional income source" or "secondary revenue stream"

STRUCTURAL FRAMING:
- Frame everything through income structure, not income amount
- The score measures how income holds up under disruption — not how much someone earns
- Every observation must connect back to a specific structural factor: persistence, concentration, forward visibility, labor dependence, continuity, or variability
- When describing what to change, name the exact type of arrangement: retainer, maintenance contract, prepaid package, licensing arrangement, standing agreement, recurring advisory, productized service

LENGTH DISCIPLINE:
- PressureMap sections: exactly 2 sentences each, no more
- Plain English interpretation: exactly 3-4 sentences
- Plain English why-not-higher: exactly 1-2 sentences
- Action plan items: exactly 2-3 sentences each
- Tradeoff items: exactly 1-2 sentences each
- Never exceed these limits. Shorter is better than longer.
`;

// ══════════════════════════════════════════════════════════
// SCORING ENGINE — ported from src/lib/engine/v2/
// Identical logic, weights, thresholds, formulas.
// ══════════════════════════════════════════════════════════

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
function simulateScore(inputs, qualityScore) {
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
function projectTimeline(currentInputs, targetInputs, qualityScore) {
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

const SIMULATOR_PRESETS = [
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

const INDUSTRY_PRESET_MAP = {
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

// ══════════════════════════════════════════════════════════
// ACTION SCRIPTS — 57 negotiation templates by sector
// ══════════════════════════════════════════════════════════

const ACTION_SCRIPTS_DATA = {
  real_estate: [
    { id: "re-retainer", title: "Retainer Pitch — Property Management", context: "Shift from transaction-based commissions to recurring management fees", script: "Hi [Client Name],\n\nI wanted to share something I've been building for select clients. Beyond buying and selling, I now offer a retained property management and advisory service — a fixed monthly engagement that covers market monitoring, tenant coordination, and portfolio strategy.\n\nFor clients like you with [X properties / ongoing real estate interests], this means you have a dedicated advisor year-round, not just at closing.\n\nThe retainer is [$ amount]/month. I'd be happy to walk through what's included — would next week work for a quick call?" },
    { id: "re-diversify", title: "Diversification Outreach — Commercial Referral", context: "Build a referral pipeline into commercial real estate to reduce residential dependency", script: "Hi [Contact Name],\n\nI've been expanding my practice to include commercial advisory alongside residential. I know you work with [business owners / investors / developers] who occasionally need guidance on commercial spaces — leasing, acquisitions, or dispositions.\n\nIf any of your clients need that kind of support, I'd welcome the introduction. I handle the full process and, of course, any referral fee arrangement is standard.\n\nWould you be open to a quick coffee to discuss how this might work?" },
    { id: "re-referral", title: "Referral Partnership Ask — Mortgage Broker", context: "Establish a two-way referral relationship to generate consistent leads", script: "Hi [Broker Name],\n\nI've been working with a number of pre-approved buyers lately and I want to make sure my clients are getting the best lending options. I'd like to establish a formal referral partnership — I send qualified buyers your way, and when your borrowers need an agent, you think of me first.\n\nI typically close [X] transactions per quarter, so the volume is consistent. Would you be interested in setting up a quick intro meeting to align on how we'd work together?" },
  ],
  consulting_professional_services: [
    { id: "cps-retainer", title: "Retainer Pitch — Advisory Retainer", context: "Convert project-based engagements into ongoing advisory relationships", script: "Hi [Client Name],\n\nNow that we've completed the [project name] engagement, I wanted to propose something that several of my long-term clients have found valuable — an ongoing advisory retainer.\n\nRather than scoping a new project every time a question comes up, this gives you direct access to me on a monthly basis for strategic guidance, review, and prioritization. Think of it as having a senior advisor on call.\n\nThe retainer is [$ amount]/month for [X hours] of dedicated advisory time. I'll send over the structure — would it be worth discussing?" },
    { id: "cps-diversify", title: "Diversification Outreach — New Vertical", context: "Expand into an adjacent industry to reduce client concentration", script: "Hi [Contact Name],\n\nI've spent the last [X years] helping [current industry] companies with [service]. I'm now selectively expanding into [new vertical] — the challenges are structurally similar, and I believe the frameworks we've built translate directly.\n\nI'd love to learn more about what [their company / their clients] are facing in this area. Would you be open to a 20-minute conversation? No pitch — I'm genuinely exploring whether this is a space where I can add value." },
    { id: "cps-referral", title: "Referral Partnership Ask — Complementary Firm", context: "Build a referral relationship with a non-competing firm serving the same clients", script: "Hi [Partner Name],\n\nI've noticed that we serve a lot of the same clients but in complementary ways — you handle [their service], and I focus on [your service]. I think there's a natural opportunity to refer work to each other.\n\nWhen your clients need [your expertise area], I'd be the right person to bring in — and vice versa. Would you be interested in a quarterly check-in to keep each other informed on capacity and client needs?" },
  ],
  sales_brokerage: [
    { id: "sb-retainer", title: "Retainer Pitch — Managed Sales Channel", context: "Offer a recurring managed service instead of per-deal commissions", script: "Hi [Client Name],\n\nInstead of engaging deal-by-deal, I'd like to propose a managed sales channel arrangement. For [$ amount]/month, I'll run a dedicated pipeline for your [product/territory] — prospecting, relationship management, and closing, with monthly reporting.\n\nThis gives you predictable sales coverage without the overhead of a full-time hire, and it gives me the stability to prioritize your pipeline. Would you be open to a conversation about structuring this?" },
    { id: "sb-diversify", title: "Diversification Outreach — Adjacent Product Line", context: "Add a complementary product line to reduce single-principal risk", script: "Hi [Principal Name],\n\nI currently represent [current principal] in [territory/market] and have built strong relationships with [buyer type]. I'm looking to add one complementary product line to my portfolio — something that serves the same buyers without competing.\n\nYour [product] seems like a natural fit. Would you be open to exploring a representation arrangement? I can share my current coverage and client list for your review." },
    { id: "sb-followup", title: "Client Follow-Up — Reactivation", context: "Re-engage a dormant client relationship to reopen the pipeline", script: "Hi [Client Name],\n\nIt's been a while since we last connected, and I wanted to reach out. I've been working on some new [products / partnerships / opportunities] that I think align well with where you were headed when we last spoke.\n\nNo pressure at all — I just didn't want to let a strong relationship go quiet. Would a 15-minute catch-up be worthwhile? I'm flexible on timing." },
  ],
  technology: [
    { id: "tech-retainer", title: "Retainer Pitch — Ongoing Technical Advisory", context: "Convert one-time builds into recurring support and development agreements", script: "Hi [Client Name],\n\nNow that the initial build is live, the real work begins — iteration, optimization, and making sure the system evolves with your business. I'd like to propose a monthly retainer that covers ongoing development, bug resolution, performance monitoring, and strategic technical advisory.\n\nThis is [$ amount]/month for [X] hours of dedicated capacity, with rollover for unused time. You'll have priority access and won't need to re-scope every time something comes up.\n\nWant me to put together a formal scope?" },
    { id: "tech-diversify", title: "Diversification Outreach — SaaS or Licensing Model", context: "Develop a product-based revenue stream alongside client services", script: "Hi [Contact Name],\n\nI've been building [tool/platform] as an internal solution for my consulting work, and several clients have asked if they could license it directly. I'm now exploring offering it as a standalone product.\n\nWould you be interested in an early-access look? I'm offering founding-tier pricing for the first [X] users, with input into the roadmap. Let me know if a quick demo would be useful." },
    { id: "tech-referral", title: "Referral Partnership Ask — Design or Marketing Agency", context: "Build a referral pipeline with agencies that need technical implementation", script: "Hi [Agency Name],\n\nI know your team focuses on [design / marketing / strategy], and clients often need technical implementation to bring those plans to life. I'd like to be your go-to development partner for those projects.\n\nI handle [your tech stack / capabilities], and I'm used to working alongside agency timelines and client expectations. Could we set up a quick intro call to see if there's a fit?" },
  ],
  finance_banking: [
    { id: "fin-retainer", title: "Retainer Pitch — Ongoing Financial Advisory", context: "Move from transactional financial services to a retained advisory model", script: "Hi [Client Name],\n\nI'd like to propose transitioning our relationship from transactional to a retained advisory model. Instead of engaging only around specific events — tax season, a refinance, a new investment — you'd have ongoing access to proactive financial guidance throughout the year.\n\nThe retainer is [$ amount]/month and includes quarterly reviews, real-time advisory access, and proactive alerts when market conditions warrant action. Would this kind of arrangement be valuable to you?" },
    { id: "fin-diversify", title: "Diversification Outreach — Adjacent Client Segment", context: "Expand into a new client segment to reduce concentration risk", script: "Hi [Contact Name],\n\nMy practice has historically focused on [current segment — e.g., high-net-worth individuals], but I'm now selectively working with [new segment — e.g., business owners approaching exit]. The financial planning challenges overlap significantly, and I've built frameworks that translate well.\n\nIf you know anyone in that situation who could use guidance, I'd welcome an introduction. Happy to do an initial consultation at no cost to see if there's a fit." },
    { id: "fin-referral", title: "Referral Partnership Ask — CPA or Estate Attorney", context: "Establish a cross-referral relationship with a complementary professional", script: "Hi [CPA/Attorney Name],\n\nOur clients often need both of our services, and I think a formal referral relationship would serve them well. When your clients need financial planning or investment guidance, I'd be glad to step in — and when mine need [tax strategy / estate planning], I'd send them your way.\n\nWould you be open to a quarterly check-in to share notes on client needs and referral opportunities?" },
  ],
  insurance: [
    { id: "ins-retainer", title: "Retainer Pitch — Annual Risk Review Program", context: "Create a recurring engagement through annual policy and risk reviews", script: "Hi [Client Name],\n\nI'd like to introduce my Annual Risk Review Program. Instead of only connecting at renewal time, this is a structured engagement where we review your full coverage portfolio twice a year — proactively identifying gaps, optimizing premiums, and adjusting as your life or business changes.\n\nThe program is [$ amount]/year and includes two comprehensive reviews, priority claims support, and real-time alerts when regulatory changes affect your coverage. Would you like to hear more?" },
    { id: "ins-diversify", title: "Diversification Outreach — Commercial Lines", context: "Expand from personal lines into commercial coverage to broaden revenue base", script: "Hi [Business Owner Name],\n\nI've been working in personal insurance for [X years], and many of my clients are business owners who also need commercial coverage — general liability, professional liability, property, or workers' comp. I'm now offering commercial lines as part of my practice.\n\nIf your current business coverage is due for review, I'd be happy to do a no-obligation audit. Sometimes a fresh set of eyes catches gaps or savings that get overlooked." },
    { id: "ins-referral", title: "Referral Partnership Ask — Real Estate Agent or Mortgage Broker", context: "Build a referral pipeline through professionals whose clients need insurance immediately", script: "Hi [Agent/Broker Name],\n\nEvery home purchase and refinance requires insurance — and your clients often need it fast. I'd like to be the advisor you refer to. I specialize in quick turnaround, competitive quotes, and making the process seamless for your clients.\n\nI'm happy to provide same-day quotes and coordinate directly with the lender. Would you be open to a trial referral to see how the process works?" },
  ],
  healthcare: [
    { id: "hc-retainer", title: "Retainer Pitch — Concierge or Membership Model", context: "Establish a recurring membership fee for priority access and expanded services", script: "Hi [Patient/Client Name],\n\nI'm introducing a membership program for patients who want a more proactive approach to their health. For [$ amount]/month, you'd receive [expanded appointment access, same-day scheduling, annual comprehensive assessment, direct communication channel].\n\nThis allows me to limit my patient panel and spend more time per visit — which means better care and no rushing. I'm only offering this to [X] patients. Would you like to learn more?" },
    { id: "hc-pricing", title: "Pricing Restructure — Cash-Pay Service Package", context: "Offer a direct-pay package that reduces insurance dependency", script: "Hi [Patient/Client Name],\n\nI'm now offering a direct-pay option for [service]. For [$ amount], the package includes [specific services] — no insurance claims, no surprise bills, no waiting for authorization. You know the exact cost upfront.\n\nMany of my patients have found this simpler and more transparent than going through insurance for this type of care. Would you like me to send over the details?" },
    { id: "hc-diversify", title: "Diversification Outreach — Corporate Wellness Program", context: "Sell health services to businesses rather than relying solely on individual patients", script: "Hi [HR Director / Business Owner],\n\nI'm offering a corporate wellness program designed for teams of [X\u2013Y] people. It includes [annual health assessments, on-site or virtual consultations, wellness workshops]. The goal is to reduce absenteeism and health-related productivity loss.\n\nThe program is [$ amount] per employee per year. I'd be happy to share a case study from a similar company. Would a brief overview be helpful?" },
    { id: "hc-referral", title: "Referral Partnership Ask — Specialist or Allied Health Provider", context: "Build a two-way referral relationship with a complementary provider", script: "Hi [Provider Name],\n\nI frequently see patients who need [their specialty], and I want to make sure I'm sending them to someone I trust. I'd like to establish a formal referral relationship — I refer to you for [their area], and when your patients need [your area], you think of me.\n\nWould you be open to a brief meeting to align on how we'd coordinate patient care?" },
  ],
  legal_services: [
    { id: "leg-retainer", title: "Retainer Pitch — General Counsel Retainer", context: "Offer ongoing legal advisory access on a monthly retainer", script: "Hi [Client Name],\n\nRather than engaging on a matter-by-matter basis, I'd like to propose a monthly retainer that gives you ongoing access to legal counsel. For [$ amount]/month, you'd have priority access for contract reviews, compliance questions, and strategic legal guidance — without needing to scope a new engagement every time.\n\nMost of my retained clients find this saves them money over time because issues get addressed before they become expensive problems. Shall I send over the terms?" },
    { id: "leg-pricing", title: "Pricing Restructure — Flat-Fee Legal Package", context: "Move from hourly billing to fixed-fee for predictable legal costs", script: "Hi [Client Name],\n\nFor [matter type], I'm offering a flat-fee arrangement at [$ amount]. This covers the full scope from start to finish — no hourly surprises, no uncertainty about the final bill.\n\nI've found that flat fees create better alignment between us. I'm incentivized to work efficiently, and you get cost certainty. Want me to detail what's included?" },
    { id: "leg-diversify", title: "Diversification Outreach — New Practice Area", context: "Expand into an adjacent legal specialty to reduce client concentration", script: "Hi [Contact Name],\n\nIn addition to my [current practice area] work, I've been building expertise in [new area] — the legal frameworks overlap significantly, and I've seen strong demand from existing clients. I'm now taking on new matters in this space.\n\nIf you or anyone in your network needs support with [new area], I'd welcome the conversation. Happy to do an initial assessment at no charge." },
    { id: "leg-referral", title: "Referral Partnership Ask — CPA or Financial Advisor", context: "Build a cross-referral relationship with professionals who serve the same clients", script: "Hi [CPA/Advisor Name],\n\nMany of my clients need both legal and [tax/financial] guidance, especially around [business formation, estate planning, M&A]. I'd like to establish a referral partnership where we send clients to each other when the need arises.\n\nThis could be as simple as a quarterly check-in to share notes. Would you be interested in exploring this?" },
  ],
  construction_trades: [
    { id: "ct-retainer", title: "Retainer Pitch — Maintenance Contract", context: "Convert one-time project clients into recurring maintenance relationships", script: "Hi [Client Name],\n\nNow that the [project] is complete, I'd like to offer a maintenance and priority service agreement. For [$ amount]/month, you get scheduled preventive maintenance, priority scheduling for any issues, and a guaranteed response time of [X hours].\n\nThis keeps your property in top condition and gives you a reliable contractor on call — no more searching for availability when something breaks. Would this be useful?" },
    { id: "ct-renewal", title: "Contract Renewal — Multi-Phase Project", context: "Extend a completed project into additional phases", script: "Hi [Client Name],\n\nPhase 1 is wrapping up on schedule. Based on what we've seen during construction, I'd recommend moving forward with Phase 2 sooner rather than later — [reason: weather window, material pricing, permitting timeline]. I've put together a proposal for the next phase.\n\nContinuity with the same crew and subcontractors also means faster mobilization and fewer surprises. Shall I walk you through the scope and timeline?" },
    { id: "ct-diversify", title: "Diversification Outreach — Commercial or Municipal Work", context: "Move beyond residential into commercial or public sector contracts", script: "Hi [Property Manager / Procurement Contact],\n\nMy company has [X years] of experience in [residential/specialty], and we're expanding into [commercial/municipal] projects. Our licensing, insurance, and crew capabilities are fully aligned for this type of work.\n\nI'd like to be considered for upcoming [bid opportunities / preferred vendor lists]. Could I send over our qualifications and recent project portfolio?" },
    { id: "ct-referral", title: "Referral Partnership Ask — Architect or General Contractor", context: "Build a referral pipeline with professionals who specify or manage trade work", script: "Hi [Architect/GC Name],\n\nI specialize in [your trade] and I've been told my work speaks for itself. I'd like to be on your preferred subcontractor list for projects that need [your specialty]. I'm licensed, insured, and I show up on time.\n\nCan I send over my portfolio and references? I'd love to be your go-to for [trade] on upcoming projects." },
  ],
  hospitality_food_service: [
    { id: "hfs-retainer", title: "Retainer Pitch — Catering or Event Partnership", context: "Establish a recurring catering agreement with a venue or corporate client", script: "Hi [Event Manager / HR Contact],\n\nI'd like to propose a standing catering partnership for your [monthly events / corporate meetings / venue programming]. Rather than quoting each event individually, we'd establish a preferred-vendor agreement with set pricing, priority scheduling, and a dedicated coordinator.\n\nThis simplifies your planning, locks in rates, and guarantees availability. Would you be interested in seeing a partnership proposal?" },
    { id: "hfs-pricing", title: "Pricing Restructure — Subscription or Meal Plan", context: "Offer a prepaid subscription model for recurring customers", script: "Hi [Customer Name],\n\nI'm introducing a monthly meal plan for regular customers like you. For [$ amount]/month, you get [X meals/credits per week] at a [X%] discount versus ordering individually. It's prepaid, simple, and you can customize each order.\n\nThis gives you reliable meals and gives me reliable revenue — it works for both of us. Want me to set you up for a trial month?" },
    { id: "hfs-diversify", title: "Diversification Outreach — Wholesale or Retail Distribution", context: "Sell packaged products through retail channels beyond the restaurant", script: "Hi [Buyer / Store Manager],\n\nI make [signature product — sauce, baked goods, prepared meals] that my restaurant customers consistently ask about. I'm now offering it in retail-ready packaging for stores like yours.\n\nI can provide samples, shelf-stable packaging, and competitive wholesale pricing. Would you be willing to try a small initial order to see how it performs with your customers?" },
    { id: "hfs-referral", title: "Referral Partnership Ask — Event Planner or Hotel", context: "Build a referral pipeline with professionals who book food service regularly", script: "Hi [Planner / Hotel Contact],\n\nI know you're constantly coordinating food for events. I'd like to be your preferred catering partner — reliable, professional, and easy to work with. I specialize in [cuisine type / event scale].\n\nI'm happy to do a tasting or a trial event at a reduced rate so you can experience the quality firsthand. Would that be worthwhile?" },
  ],
  transportation_logistics: [
    { id: "tl-retainer", title: "Retainer Pitch — Dedicated Capacity Agreement", context: "Lock in recurring freight or delivery commitments", script: "Hi [Shipper / Logistics Manager],\n\nInstead of booking lanes on the spot market each time, I'd like to propose a dedicated capacity agreement. I'd reserve [X trucks/routes] for your freight at a locked-in rate for [6/12 months], with guaranteed availability and priority loading.\n\nThis protects you from rate volatility and gives you reliability. I've prepared a rate sheet and capacity commitment — can we schedule a review?" },
    { id: "tl-renewal", title: "Contract Renewal — Carrier Agreement Extension", context: "Renew a carrier or broker agreement with improved terms", script: "Hi [Client Name],\n\nOur current agreement is up for renewal. Based on our on-time performance of [X%] and zero claims over the past [period], I'd like to propose a 12-month renewal with a [X%] volume increase and locked rates.\n\nContinuity with a proven carrier reduces your operational risk. I've prepared the renewal terms — when can we walk through them?" },
    { id: "tl-diversify", title: "Diversification Outreach — Last-Mile or Specialty Freight", context: "Expand into a new service category to reduce lane concentration", script: "Hi [Contact Name],\n\nIn addition to [current service — long-haul, LTL, etc.], I'm now offering [last-mile delivery / temperature-controlled freight / oversized loads]. I've invested in the equipment and certifications to serve this market.\n\nIf you have any upcoming needs in this area, I'd love to provide a competitive quote. No obligation — just want to show you what we can do." },
    { id: "tl-referral", title: "Referral Partnership Ask — Freight Broker or Warehouse", context: "Build a referral relationship with complementary logistics providers", script: "Hi [Broker / Warehouse Contact],\n\nI think there's a natural partnership opportunity between us. When you need reliable carrier capacity for [your lane / specialty], I'd like to be your first call. And when my clients need [their service — warehousing, brokerage, drayage], I'd refer them to you.\n\nCan we set up a quick call to discuss how this would work?" },
  ],
  manufacturing: [
    { id: "mfg-retainer", title: "Retainer Pitch — Supply Agreement with Minimum Commitment", context: "Establish a recurring supply contract with volume minimums", script: "Hi [Buyer / Procurement Manager],\n\nI'd like to propose a supply agreement with a minimum monthly commitment. For a guaranteed order of [X units/month], I can lock in your pricing at [$ amount per unit] for the next 12 months — protecting you from raw material price increases and ensuring priority production scheduling.\n\nThis gives you cost predictability and supply security. Want me to send over the terms?" },
    { id: "mfg-renewal", title: "Contract Renewal — Purchase Order Extension", context: "Renew a production contract with improved terms based on track record", script: "Hi [Client Name],\n\nOur current production agreement is coming up for renewal. Over the past [period], we've maintained a [X%] on-time delivery rate and [X%] quality acceptance rate. Based on this performance, I'd like to propose a 12-month renewal with a [X%] volume increase.\n\nI've also identified a few process improvements that could reduce your per-unit cost by [X%]. Shall I put together a renewal proposal?" },
    { id: "mfg-diversify", title: "Diversification Outreach — Private Label or OEM", context: "Offer manufacturing capacity for other brands to reduce single-client dependency", script: "Hi [Brand Owner / Product Company],\n\nI have [manufacturing capability — CNC, injection molding, food production, etc.] with available capacity. I'm selectively offering private-label and OEM manufacturing for companies that need reliable production without building their own facility.\n\nI handle [scope — production, packaging, quality control, shipping]. Would it be worth sharing our capabilities and sample pricing?" },
    { id: "mfg-referral", title: "Referral Partnership Ask — Distributor or Reseller", context: "Build a distribution partnership to expand market reach", script: "Hi [Distributor Name],\n\nI manufacture [product category] and I'm looking for distribution partners in [region / channel]. My products are [quality differentiator], and I offer competitive wholesale pricing with reliable lead times.\n\nWould you be open to carrying our line on a trial basis? I can provide samples and marketing collateral to support the sell-through." },
  ],
  education: [
    { id: "edu-retainer", title: "Retainer Pitch — Ongoing Training or Tutoring Package", context: "Convert one-time students into recurring monthly engagements", script: "Hi [Student / Parent / HR Contact],\n\nRather than booking sessions individually, I'd like to offer a monthly package. For [$ amount]/month, you get [X sessions] per month with priority scheduling, progress tracking, and a customized curriculum.\n\nStudents on a monthly plan consistently outperform drop-in students because of the continuity and accountability. Would you like to try a month and see the difference?" },
    { id: "edu-pricing", title: "Pricing Restructure — Cohort or Group Program", context: "Move from 1-on-1 to group delivery to scale income without scaling hours", script: "Hi [Prospective Student],\n\nI'm launching a [X-week] group program on [topic]. It includes [live sessions, materials, community access, office hours]. The group format is [$ amount] per person — significantly less than 1-on-1, but with the added benefit of peer learning and accountability.\n\nThe next cohort starts [date]. Would you like me to reserve a spot?" },
    { id: "edu-diversify", title: "Diversification Outreach — Corporate Training Contract", context: "Sell training services to organizations rather than individual students", script: "Hi [L&D Manager / HR Director],\n\nI offer [training topic] programs designed for professional teams. The curriculum is built for working professionals and can be delivered on-site or virtually in [X-hour / X-day] formats.\n\nI've trained teams at [reference companies or industries]. Would it be helpful if I shared a sample agenda and pricing for a pilot workshop?" },
    { id: "edu-referral", title: "Referral Partnership Ask — School, Community Org, or Platform", context: "Build a referral channel through institutions that serve your target students", script: "Hi [School Counselor / Community Director / Platform Manager],\n\nI specialize in [your educational focus] and I'd love to be a resource for your [students / members / users] who need additional support or advanced instruction. I offer [your format — tutoring, courses, workshops].\n\nCould I provide you with materials to share when the need comes up? I'm happy to offer a [discount / free intro session] for referrals from your organization." },
  ],
  nonprofit_public_sector: [
    { id: "nps-retainer", title: "Retainer Pitch — Multi-Year Grant or Service Agreement", context: "Secure multi-year funding commitments for program stability", script: "Hi [Funder / Program Officer],\n\nI'd like to propose a multi-year funding arrangement for [program name]. A 3-year commitment at [$ amount/year] would allow us to plan long-term, retain key staff, and deliver measurably stronger outcomes than year-to-year funding permits.\n\nI've prepared a multi-year impact projection and budget. Would you be open to reviewing it?" },
    { id: "nps-diversify", title: "Diversification Outreach — Earned Revenue Program", context: "Develop a fee-for-service or social enterprise revenue stream", script: "Hi [Board Member / Advisor],\n\nI've been exploring an earned revenue model to complement our grant funding. The concept is [fee-for-service program, social enterprise, training-for-fee]. This would generate [estimated revenue] annually while directly advancing our mission.\n\nI'd like to pilot it next quarter. Can we discuss the feasibility and any governance considerations at the next board meeting?" },
    { id: "nps-renewal", title: "Contract Renewal — Government Contract Extension", context: "Renew a government or institutional service contract", script: "Hi [Contracting Officer / Program Director],\n\nOur current contract for [service] expires [date]. Over the term, we've delivered [key metrics — people served, outcomes achieved, cost per unit]. Based on these results, I'd like to discuss a renewal and potential scope expansion.\n\nI've prepared a performance summary and proposed renewal terms. When would be a good time to review?" },
    { id: "nps-referral", title: "Referral Partnership Ask — Complementary Nonprofit or Agency", context: "Build a referral network with organizations serving overlapping populations", script: "Hi [Executive Director / Program Manager],\n\nOur organizations serve [overlapping population], and I think there's an opportunity to strengthen referrals between us. When your clients need [your service], we'd love to be the recommended resource — and we'd do the same for [their service].\n\nCould we set up a brief meeting to map out how our programs connect and formalize the referral pathway?" },
  ],
  agriculture: [
    { id: "ag-retainer", title: "Retainer Pitch — CSA or Subscription Box", context: "Establish recurring revenue through direct-to-consumer subscriptions", script: "Hi [Customer Name],\n\nI'm offering a seasonal subscription — [weekly/biweekly] deliveries of [product type] straight from the farm. For [$ amount]/month, you get [quantity/variety], picked fresh and delivered to [location/pickup point].\n\nSubscriptions help me plan production and reduce waste, and you get the freshest product at a better price than retail. Want me to sign you up for the next season?" },
    { id: "ag-renewal", title: "Contract Renewal — Wholesale Buyer Agreement", context: "Renew a supply agreement with a restaurant, grocer, or distributor", script: "Hi [Buyer Name],\n\nOur current supply agreement is coming up for renewal. This season, I can offer [increased volume, new varieties, improved packaging] at the same pricing if we commit to a 12-month term. I've also invested in [cold chain, organic certification, etc.] that improves the product quality you'll receive.\n\nWould you like to review the updated terms?" },
    { id: "ag-diversify", title: "Diversification Outreach — Value-Added Products", context: "Sell processed or packaged goods to reduce raw commodity dependency", script: "Hi [Retailer / Distributor],\n\nIn addition to fresh [product], I'm now producing [value-added product — jams, dried goods, sauces, flour, etc.]. These are made from the same farm-fresh ingredients, shelf-stable, and retail-ready with professional labeling.\n\nI can offer wholesale pricing and initial samples. Would you be interested in stocking a trial order?" },
    { id: "ag-referral", title: "Referral Partnership Ask — Chef, Market, or Agritourism Operator", context: "Build a referral relationship to expand market access", script: "Hi [Chef / Market Manager / Tour Operator],\n\nI grow [product] locally and I'd like to supply your [restaurant / market / farm tours]. My products are [organic, heritage variety, sustainably grown] — whatever matters most to your customers, I can speak to the provenance and quality.\n\nCan I bring by some samples? I think your [customers / guests] would appreciate knowing exactly where their food comes from." },
  ],
  energy_utilities: [
    { id: "eu-retainer", title: "Retainer Pitch — Ongoing Maintenance and Monitoring", context: "Establish recurring service contracts for energy systems", script: "Hi [Facility Manager / Property Owner],\n\nI'd like to propose a maintenance and monitoring agreement for your [solar installation, HVAC system, energy infrastructure]. For [$ amount]/month, this includes [quarterly inspections, 24/7 monitoring, priority emergency response, parts warranty].\n\nProactive maintenance extends system life by [X years] on average and prevents costly emergency repairs. Want me to send over the agreement?" },
    { id: "eu-renewal", title: "Contract Renewal — Service or Supply Agreement", context: "Renew an energy service contract with performance-based terms", script: "Hi [Client Name],\n\nOur service agreement is up for renewal. Over the past [period], we've delivered [energy savings, uptime percentage, cost reduction]. I'd like to propose a renewal with performance guarantees — if we don't hit [target], the rate adjusts in your favor.\n\nThis shows our confidence in the service and aligns our incentives. Shall I draft the renewal with these terms?" },
    { id: "eu-diversify", title: "Diversification Outreach — Residential or Commercial Expansion", context: "Expand into a new market segment within energy services", script: "Hi [Contact Name],\n\nMy company has been serving [current segment — commercial, industrial, residential] with [energy service]. We're now expanding into [new segment] — the technology and expertise are the same, but the market opportunity is significant.\n\nI'd love to discuss potential projects in your portfolio. Could I share our capabilities and a few relevant case studies?" },
    { id: "eu-referral", title: "Referral Partnership Ask — Contractor or Property Developer", context: "Build a referral pipeline with professionals who specify energy systems", script: "Hi [Contractor / Developer Name],\n\nI specialize in [energy service — solar installation, energy audits, EV charging, etc.] and I'd like to be your go-to partner for projects that need this expertise. I handle everything from design to installation to ongoing maintenance.\n\nCan I send over our project portfolio? I'd love to be included in your next relevant bid or spec." },
  ],
  creator_media: [
    { id: "cm-retainer", title: "Retainer Pitch — Content or Creative Retainer", context: "Convert one-off projects into ongoing monthly creative relationships", script: "Hi [Client / Brand Name],\n\nRather than scoping each project individually, I'd like to offer a monthly creative retainer. For [$ amount]/month, you get [X deliverables — posts, videos, designs, articles] per month, with priority scheduling and a dedicated creative direction.\n\nRetainer clients get my best thinking because I understand your brand deeply over time. The work gets better and faster the longer we work together. Interested in trying a quarter?" },
    { id: "cm-pricing", title: "Pricing Restructure — Licensing and Royalties", context: "Shift from work-for-hire to licensing deals that generate passive income", script: "Hi [Client / Publisher / Platform],\n\nFor this project, I'd like to propose a licensing arrangement rather than a flat buyout. I'll create [the work] and license it to you for [specific use, duration, territory] at [$ amount] — with a [X%] royalty on [sales, streams, syndication].\n\nThis gives you full usage rights for your needs while allowing me to retain ownership. It's standard in [industry] and often results in a lower upfront cost for you. Shall I send over the licensing terms?" },
    { id: "cm-diversify", title: "Diversification Outreach — Course or Digital Product", context: "Build a scalable revenue stream from expertise", script: "Hi [Audience / Newsletter / Community],\n\nI'm launching [course / template pack / digital resource] — everything I've learned about [topic] packaged into a [format]. It's [$ amount] for [lifetime access / X modules / complete toolkit].\n\nEarly supporters get [discount / bonus / founding member access]. If you've ever wanted to learn [topic] from someone who does it professionally, this is it. [Link]" },
    { id: "cm-referral", title: "Referral Partnership Ask — Agency or Complementary Creator", context: "Build a referral pipeline with professionals who need creative talent", script: "Hi [Agency / Creator Name],\n\nI specialize in [your medium — video, design, writing, photography] and I'd love to be your go-to when you need [your specialty] for client projects or collaborations. I work fast, hit deadlines, and I'm easy to brief.\n\nCould I send over my portfolio? And if you ever have overflow work or a project outside your wheelhouse, I'd welcome the referral — and reciprocate when the opportunity arises." },
  ],
  ecommerce_product: [
    { id: "ec-retainer", title: "Retainer Pitch — Subscription or Auto-Replenishment", context: "Convert one-time buyers into recurring subscribers", script: "Hi [Customer Name],\n\nLove your [product]? Never run out again. Subscribe for automatic delivery every [X weeks] and save [X%] on every order. You can pause, skip, or cancel anytime — no commitment.\n\nSubscribers also get early access to new products and exclusive pricing. Want me to set up your subscription?" },
    { id: "ec-pricing", title: "Pricing Restructure — Wholesale or Bulk Pricing", context: "Offer B2B wholesale pricing to diversify beyond direct-to-consumer", script: "Hi [Retailer / Buyer Name],\n\nI'd like to offer [product] at wholesale pricing for your [store / platform / catalog]. My wholesale rates start at [$ amount] per unit for minimum orders of [X units], with [shipping terms].\n\nThe product has strong consumer demand — [social proof: reviews, sales figures, press]. Can I send over a wholesale line sheet and samples?" },
    { id: "ec-diversify", title: "Diversification Outreach — New Sales Channel", context: "Expand from a single platform to additional marketplaces or retail", script: "Hi [Marketplace / Retail Buyer],\n\nI currently sell [product] on [current channel] with strong performance — [X units/month, X-star reviews]. I'm looking to expand into [new channel] and I believe there's a strong fit with your customer base.\n\nI can provide product samples, listing assets, and fulfillment from [your warehouse / 3PL]. Would you be open to a trial listing?" },
    { id: "ec-referral", title: "Referral Partnership Ask — Influencer or Affiliate", context: "Build a referral and affiliate program to drive consistent new customer acquisition", script: "Hi [Creator / Influencer Name],\n\nI think [product] would resonate with your audience. I'd like to offer you an affiliate partnership — you share [product] with your followers, and you earn [X%] on every sale through your link. No inventory, no risk.\n\nI'll provide free product, custom discount codes, and creative assets. Would you be interested in trying it? Happy to send samples first." },
  ],
};

/** Sector key resolution — matches display names, snake_case, and alternates */
const DISPLAY_TO_KEY_MAP = {
  "Real Estate": "real_estate",
  "Finance / Banking": "finance_banking",
  "Insurance": "insurance",
  "Technology": "technology",
  "Healthcare": "healthcare",
  "Legal Services": "legal_services",
  "Consulting / Professional Services": "consulting_professional_services",
  "Sales / Brokerage": "sales_brokerage",
  "Media / Entertainment": "creator_media",
  "Construction / Trades": "construction_trades",
  "Retail / E-Commerce": "ecommerce_product",
  "Hospitality / Food Service": "hospitality_food_service",
  "Transportation / Logistics": "transportation_logistics",
  "Manufacturing": "manufacturing",
  "Education": "education",
  "Nonprofit / Public Sector": "nonprofit_public_sector",
  "Agriculture": "agriculture",
  "Energy / Utilities": "energy_utilities",
};

const ALTERNATE_KEY_MAP = {
  media_entertainment: "creator_media",
  retail_ecommerce: "ecommerce_product",
};

function getScriptsForSector(sectorKey) {
  if (ACTION_SCRIPTS_DATA[sectorKey]) return ACTION_SCRIPTS_DATA[sectorKey];
  const resolved = DISPLAY_TO_KEY_MAP[sectorKey];
  if (resolved && ACTION_SCRIPTS_DATA[resolved]) return ACTION_SCRIPTS_DATA[resolved];
  if (ALTERNATE_KEY_MAP[sectorKey] && ACTION_SCRIPTS_DATA[ALTERNATE_KEY_MAP[sectorKey]]) {
    return ACTION_SCRIPTS_DATA[ALTERNATE_KEY_MAP[sectorKey]];
  }
  return [];
}

// ══════════════════════════════════════════════════════════
// SIMULATION ENDPOINT HANDLERS
// ══════════════════════════════════════════════════════════

async function handleSimulate(body, corsHeaders) {
  if (!body.inputs) {
    return new Response(JSON.stringify({ error: "Missing inputs" }), { status: 400, headers: corsHeaders });
  }
  const result = simulateScore(body.inputs, body.quality_score);
  return new Response(JSON.stringify(result), { headers: corsHeaders });
}

async function handleSimulateBatch(body, corsHeaders) {
  if (!body.base_inputs || !body.scenarios) {
    return new Response(JSON.stringify({ error: "Missing base_inputs or scenarios" }), { status: 400, headers: corsHeaders });
  }

  const results = {};
  for (const scenario of body.scenarios) {
    let inputs = { ...body.base_inputs };

    if (scenario.preset_id) {
      // Look up preset in generic + industry maps
      let preset = SIMULATOR_PRESETS.find((p) => p.id === scenario.preset_id);
      if (!preset) {
        // Search all industry preset maps
        for (const presets of Object.values(INDUSTRY_PRESET_MAP)) {
          preset = presets.find((p) => p.id === scenario.preset_id);
          if (preset) break;
        }
      }
      if (preset) {
        inputs = preset.modify(inputs);
      }
    }

    if (scenario.modified_inputs) {
      inputs = { ...inputs, ...scenario.modified_inputs };
    }

    results[scenario.id] = simulateScore(inputs, body.quality_score);
  }

  return new Response(JSON.stringify({ results }), { headers: corsHeaders });
}

async function handleTimeline(body, corsHeaders) {
  if (!body.current_inputs || !body.target_inputs) {
    return new Response(JSON.stringify({ error: "Missing current_inputs or target_inputs" }), { status: 400, headers: corsHeaders });
  }
  const timeline = projectTimeline(body.current_inputs, body.target_inputs, body.quality_score);
  return new Response(JSON.stringify({ timeline }), { headers: corsHeaders });
}

function handleActionScripts(sector, request, corsHeaders) {
  // Auth gate: require Authorization header
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader) {
    return new Response(JSON.stringify({ scripts: [] }), { headers: corsHeaders });
  }

  const scripts = getScriptsForSector(sector);
  return new Response(JSON.stringify({ scripts }), { headers: corsHeaders });
}

function handlePresets(url, corsHeaders) {
  const sectorParam = url.searchParams.get("sector");

  // Strip modify functions — return metadata only
  function stripPreset(p) {
    return { id: p.id, label: p.label, description: p.description };
  }

  if (sectorParam) {
    const presets = INDUSTRY_PRESET_MAP[sectorParam] || SIMULATOR_PRESETS;
    return new Response(JSON.stringify({ presets: presets.map(stripPreset) }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ presets: SIMULATOR_PRESETS.map(stripPreset) }), { headers: corsHeaders });
}

function handleAnalytics(body, corsHeaders) {
  // Accept and acknowledge analytics events (fire-and-forget from frontend).
  // In production this could write to D1 or Analytics Engine;
  // for now we simply accept the payload so the endpoint exists.
  return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// MAIN WORKER
// ══════════════════════════════════════════════════════════

export default {
  // ── Cron trigger: send follow-up emails + nurture sequence ──
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleFollowUpCron(env));
    ctx.waitUntil(processNurtureQueue(env));
  },

  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Content-Type": "application/json",
    };

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/pressuremap";

    // GET endpoints
    if (request.method === "GET") {
      if (path === "/stats") return await handleStats(env, corsHeaders);
      if (path === "/presets") return handlePresets(url, corsHeaders);
      // GET /action-scripts/:sector
      const actionScriptsMatch = path.match(/^\/action-scripts\/(.+)$/);
      if (actionScriptsMatch) return handleActionScripts(decodeURIComponent(actionScriptsMatch[1]), request, corsHeaders);
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      if (path === "/pressuremap" || path === "/") return await handlePressureMap(body, env, corsHeaders);
      if (path === "/plain-english") return await handlePlainEnglish(body, env, corsHeaders);
      if (path === "/action-plan") return await handleActionPlan(body, env, corsHeaders);
      if (path === "/save-record") return await handleSaveRecord(body, env, corsHeaders);
      if (path === "/get-record") return await handleGetRecord(body, env, corsHeaders);
      if (path === "/entitlement/create") return await handleEntitlementCreate(body, env, corsHeaders);
      if (path === "/entitlement/check") return await handleEntitlementCheck(body, env, corsHeaders);
      if (path === "/entitlement/use") return await handleEntitlementUse(body, env, corsHeaders);
      if (path === "/entitlement/lookup") return await handleEntitlementLookup(body, env, corsHeaders);
      if (path === "/send-email") return await handleSendEmail(body, env, corsHeaders);
      if (path === "/contact") return await handleContact(body, env, corsHeaders);
      if (path === "/nurture") return await handleNurture(body, env, corsHeaders);
      if (path === "/simulate") return await handleSimulate(body, corsHeaders);
      if (path === "/simulate-batch") return await handleSimulateBatch(body, corsHeaders);
      if (path === "/timeline") return await handleTimeline(body, corsHeaders);
      if (path === "/analytics") return handleAnalytics(body, corsHeaders);

      return new Response(JSON.stringify({ error: "Unknown endpoint" }), {
        status: 404, headers: corsHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Worker error", detail: String(err) }), {
        status: 500, headers: corsHeaders,
      });
    }
  },
};

// ══════════════════════════════════════════════════════════
// CALL CLAUDE
// ══════════════════════════════════════════════════════════

async function callClaude(system, user, env, maxTokens = 600) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: BRAND_RULES + "\n\n" + system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");
  return JSON.parse(jsonMatch[0]);
}

// ══════════════════════════════════════════════════════════
// PROFILE BLOCK (shared)
// ══════════════════════════════════════════════════════════

function profileBlock(b) {
  return `PROFILE:
- Industry: ${b.industry || "General"}
- Operating Structure: ${b.operating_structure || "Independent"}
- Income Model: ${b.income_model || "Mixed"}
- Years in current structure: ${b.years_in_structure || "Unknown"}
- Income Stability Score: ${b.score || 0}/100 (${b.band || "Unknown"})
- Weakest structural factor: ${b.weakest_factor || "Unknown"}

STRUCTURAL DATA:
- Recurring revenue: ${b.recurrence_pct || 0}%
- Top client concentration: ${b.concentration_pct || 0}%
- Forward visibility: ${b.forward_visibility_pct || 0}%
- Labor dependence: ${b.labor_dependence_pct || 0}%
- Earnings variability: ${b.variability_level || "moderate"}
- Active income: ${b.active_income || 0}%
- Continuity if work stops: ${b.continuity_months || 0} months
- Risk scenario drop: ${b.risk_drop || 0} points`;
}

// ══════════════════════════════════════════════════════════
// PRESSUREMAP
// ══════════════════════════════════════════════════════════

async function handlePressureMap(body, env, corsHeaders) {
  const system = `You are the PressureMap engine for RunPayway. You produce real-time structural intelligence specific to one individual's income architecture.

ROLE: Structural analyst producing a private intelligence briefing.
OUTPUT: Three sections, each exactly 2 sentences. No more.`;

  const vc = body.vocab_context || {};
  const vocabBlock = vc.pressure_framing ? `\nINDUSTRY VOCABULARY (use this language — do NOT use generic income terminology):
- Structural pressure in this industry: ${vc.pressure_framing}
- Structural opportunity: ${vc.tailwind_framing}
- Specific arrangement types to recommend: ${vc.arrangement_types}
- Peer group: ${vc.peer_group_label}\n` : "";

  const user = `Generate a PressureMap briefing:

${profileBlock(body)}
${vocabBlock}
Return this JSON:
{
  "pressure": "[Exactly 2 sentences] The specific structural force in ${body.industry} that is currently working against this ${body.operating_structure} with a ${body.income_model} model, given their weakest factor is ${body.weakest_factor} at the values shown above. Name the structural dynamic, not a generic industry trend. Use the industry vocabulary above.",
  "tailwind": "[Exactly 2 sentences] The specific current condition in ${body.industry} that creates a structural opening for this ${body.operating_structure} with a ${body.income_model} model to improve their weakest factor right now. Reference specific arrangement types from the vocabulary.",
  "leverage_move": "[Exactly 2 sentences] The single highest-leverage structural change — name the exact type of arrangement from the vocabulary (${vc.arrangement_types || "retainer, standing agreement, prepaid package, productized service, licensing deal"}) that fits a ${body.operating_structure} in ${body.industry} earning through ${body.income_model}."
}

Return ONLY the JSON.`;

  const parsed = await callClaude(system, user, env);
  if (!parsed.pressure || !parsed.tailwind || !parsed.leverage_move) {
    return new Response(JSON.stringify({ error: "Incomplete" }), { status: 502, headers: corsHeaders });
  }
  return new Response(JSON.stringify(parsed), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// PLAIN ENGLISH
// ══════════════════════════════════════════════════════════

async function handlePlainEnglish(body, env, corsHeaders) {
  const vc = body.vocab_context || {};
  const vocabInstructions = vc.pressure_framing ? `
CRITICAL: Use industry-specific vocabulary. Do NOT use generic terms like "recurring revenue" or "forward visibility."
Instead use terms from this vocabulary:
- Structural pressure: ${vc.pressure_framing}
- Arrangement types: ${vc.arrangement_types}
- Peer group: ${vc.peer_group_label}` : "";

  const system = `You are a structural income analyst for RunPayway. You write the "In Plain English" section of the Income Stability Report.

ROLE: Senior analyst explaining diagnostic results directly to the person who took the assessment. You speak to them as a fellow professional in ${body.industry}.
GOAL: Make the reader feel that this score revealed something they did not already know about their income structure. This is what makes the report worth the price.
${vocabInstructions}

OUTPUT REQUIREMENTS:
- "interpretation": Exactly 3-4 sentences. Start with what the score means structurally for someone in ${body.industry}. Then explain the single most important thing it reveals about their specific situation. Then connect it to their daily reality as a ${body.operating_structure} earning through ${body.income_model}. End with what this means if conditions change.
- "why_not_higher": Exactly 1-2 sentences. The specific structural factor preventing a higher score, using language a ${body.operating_structure} in ${body.industry} would immediately recognize.`;

  const user = `Write the Plain English interpretation:

${profileBlock(body)}

Return this JSON:
{
  "interpretation": "[3-4 sentences as described above]",
  "why_not_higher": "[1-2 sentences] Why the score is ${body.score} and not higher, specific to their ${body.weakest_factor}. Use industry-specific terms, not generic structural language."
}

Return ONLY the JSON.`;

  const parsed = await callClaude(system, user, env, 400);
  if (!parsed.interpretation) {
    return new Response(JSON.stringify({ error: "Incomplete" }), { status: 502, headers: corsHeaders });
  }
  return new Response(JSON.stringify({
    interpretation: parsed.interpretation,
    why_not_higher: parsed.why_not_higher || "",
  }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// ACTION PLAN
// ══════════════════════════════════════════════════════════

async function handleActionPlan(body, env, corsHeaders) {
  const vc = body.vocab_context || {};
  const vocabInstructions = vc.arrangement_types ? `
CRITICAL VOCABULARY RULES:
- You are advising a ${body.operating_structure} in ${body.industry}. Speak their language.
- Use these specific arrangement types: ${vc.arrangement_types}
- Industry pressure context: ${vc.pressure_framing || ""}
- Industry opportunity context: ${vc.tailwind_framing || ""}
- Do NOT use generic terms. Name specific deals, clients, arrangements this person would recognize.` : "";

  const system = `You are a structural income strategist for RunPayway. You write the Action Plan section of the Income Stability Report.

ROLE: Management consultant who has worked extensively in ${body.industry}, delivering a strategy recommendation to a private client.
GOAL: Make the reader feel that this action plan was written by someone who understands their industry. Every recommendation should use the vocabulary of ${body.industry}, not generic income advice.
${vocabInstructions}

OUTPUT REQUIREMENTS:
- primary_action: 2-3 sentences. Name the exact structural change using ${body.industry}-specific terms. Reference specific arrangement types.
- primary_how: 2-3 sentences. Exactly how to execute. What to offer, who to approach, what language to use. Specific to a ${body.operating_structure} in ${body.industry}.
- supporting_action: 1-2 sentences. A second change that compounds with the first. Industry-specific.
- supporting_how: 1-2 sentences. How to execute it.
- combined_interpretation: 1-2 sentences. What the income structure looks like after both changes.
- tradeoff_upside: 1-2 sentences. The structural benefit in terms a ${body.operating_structure} would care about.
- tradeoff_cost: 1-2 sentences. The realistic effort or sacrifice required.
- tradeoff_verdict: Exactly 1 sentence. Whether it is worth doing and why — stated with conviction.`;

  const user = `Write the action plan:

${profileBlock(body)}

Primary constraint: ${body.weakest_factor}
Top projected change: ${body.top_change || "Reduce " + body.weakest_factor}
Projected lift: ${body.projected_lift || "Unknown"}

Return this JSON:
{
  "primary_action": "[2-3 sentences] Use ${body.industry}-specific terminology.",
  "primary_how": "[2-3 sentences] Specific to a ${body.operating_structure} in ${body.industry} with a ${body.income_model} model. Name who to talk to, what to propose, how to frame it.",
  "supporting_action": "[1-2 sentences] Industry-specific.",
  "supporting_how": "[1-2 sentences]",
  "combined_interpretation": "[1-2 sentences] Reference the projected score if provided: ${body.projected_lift}",
  "tradeoff_upside": "[1-2 sentences]",
  "tradeoff_cost": "[1-2 sentences]",
  "tradeoff_verdict": "[1 sentence] State with conviction whether this is worth doing."
}

Return ONLY the JSON.`;

  const parsed = await callClaude(system, user, env, 800);
  if (!parsed.primary_action) {
    return new Response(JSON.stringify({ error: "Incomplete" }), { status: 502, headers: corsHeaders });
  }
  return new Response(JSON.stringify(parsed), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// SAVE RECORD
// ══════════════════════════════════════════════════════════

async function handleSaveRecord(body, env, corsHeaders) {
  if (!body.id || !body.record_data) {
    return new Response(JSON.stringify({ error: "Missing id or record_data" }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Auto-migrate: add columns if missing
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN email TEXT DEFAULT ''").run(); } catch { /* column exists */ }
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN top_action TEXT DEFAULT ''").run(); } catch { /* column exists */ }
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN followup_sent INTEGER DEFAULT 0").run(); } catch { /* column exists */ }

  await env.DB.prepare(
    `INSERT OR REPLACE INTO records (id, created_at, assessment_title, industry, operating_structure, income_model, score, band, record_data, email, top_action) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.id,
    new Date().toISOString(),
    body.assessment_title || "",
    body.industry || "",
    body.operating_structure || "",
    body.income_model || "",
    body.score || 0,
    body.band || "",
    typeof body.record_data === "string" ? body.record_data : JSON.stringify(body.record_data),
    body.email || "",
    body.top_action || "",
  ).run();

  // ── Update nurture record with score data if this email is enrolled ──
  if (body.email && body.score) {
    try {
      await ensureNurtureTable(env);
      const nurture = await env.DB.prepare(
        "SELECT email FROM nurture_queue WHERE email = ?"
      ).bind(body.email.toLowerCase()).first();

      if (nurture) {
        // Parse record_data to extract the weakest factor / constraint
        let constraint = "";
        try {
          const rd = typeof body.record_data === "string" ? JSON.parse(body.record_data) : body.record_data;
          constraint = rd?.weakest_factor || rd?.constraint || body.top_action || "";
        } catch { /* ignore parse errors */ }

        await env.DB.prepare(
          `UPDATE nurture_queue SET score = ?, band = ?, constraint_name = ?, industry = ? WHERE email = ?`
        ).bind(
          body.score || 0,
          body.band || "",
          constraint,
          body.industry || "",
          body.email.toLowerCase()
        ).run();
        console.log(`[Nurture] Updated score data for ${body.email}: ${body.score} (${body.band})`);
      }
    } catch (err) {
      console.error(`[Nurture] Failed to update score for ${body.email}:`, err);
    }
  }

  return new Response(JSON.stringify({ success: true, id: body.id }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// GET RECORD
// ══════════════════════════════════════════════════════════

async function handleGetRecord(body, env, corsHeaders) {
  if (!body.id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const row = await env.DB.prepare(
    `SELECT record_data FROM records WHERE id = ?`
  ).bind(body.id).first();

  if (!row) {
    return new Response(JSON.stringify({ error: "Record not found" }), {
      status: 404, headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({
    success: true,
    record_data: row.record_data,
  }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// SEND EMAIL (via Resend)
// ══════════════════════════════════════════════════════════

async function handleSendEmail(body, env, corsHeaders) {
  if (!body.to || !body.score) {
    return new Response(JSON.stringify({ error: "Missing to or score" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  const navy = "#1C1635";
  const purple = "#4B3FAE";
  const teal = "#1F6D7A";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const sand = "#F4F1EA";
  const name = body.name || "Assessment";
  const shortId = (body.record_id || "").slice(0, 8);
  const fullId = body.record_id || "";
  const dashboardLink = fullId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(fullId)}` : "https://peoplestar.com/RunPayway/dashboard";
  const industry = body.industry || "";
  const structure = body.operating_structure || "";
  const bandColor = (body.score || 0) >= 75 ? teal : (body.score || 0) >= 50 ? "#2B5EA7" : (body.score || 0) >= 30 ? "#92640A" : "#9B2C2C";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${navy};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${navy};">

<!-- Navy pre-header spacer -->
<tr><td style="height:32px;">&nbsp;</td></tr>

<tr><td align="center" style="padding:0 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Logo bar — navy background -->
<tr><td style="padding:28px 40px 24px;text-align:left;">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="display:inline-block;height:auto;filter:brightness(0) invert(1);opacity:0.85;"/>
</td></tr>

<!-- Gradient accent line -->
<tr><td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(90deg,${purple} 0%,${teal} 100%);height:2px;border-radius:1px;">&nbsp;</td></tr></table></td></tr>

<!-- White content card -->
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ffffff;padding:44px 40px 40px;border-radius:12px;margin-top:20px;">

<!-- Personal greeting -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td>
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, we\u2019ve finished your assessment.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">
We looked at how your income holds up${industry ? ` in <strong style="color:${muted};font-weight:600;">${industry}</strong>` : ""}${structure ? ` as ${structure.match(/^[aeiou]/i) ? "an" : "a"} <strong style="color:${muted};font-weight:600;">${structure}</strong>` : ""} \u2014 here\u2019s what stands out.
</p>
</td></tr>
</table>

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Score display -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:28px 32px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:top;">
<p style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 14px;">INCOME STABILITY SCORE</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="font-size:56px;font-weight:200;color:${navy};line-height:1;letter-spacing:-0.04em;font-family:'Georgia',serif;">${body.score}</td>
<td style="font-size:16px;font-weight:300;color:rgba(14,26,43,0.18);vertical-align:bottom;padding-bottom:10px;padding-left:4px;">/100</td>
</tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
<tr>
<td style="width:8px;height:8px;border-radius:2px;background-color:${bandColor};">&nbsp;</td>
<td style="padding-left:8px;font-size:13px;font-weight:600;color:${bandColor};letter-spacing:0.01em;">${body.band || ""}</td>
</tr>
</table>
</td>
<td width="120" style="vertical-align:top;text-align:right;">
<table role="presentation" cellpadding="0" cellspacing="0" style="float:right;">
<tr><td style="padding:6px 12px;border-radius:6px;border:1px solid rgba(14,26,43,0.08);">
<p style="font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${light};margin:0 0 2px;">MODEL</p>
<p style="font-size:12px;font-weight:600;color:${navy};margin:0;">RP-2.0</p>
</td></tr>
</table>
</td>
</tr>
</table>

</td></tr>
</table>

<!-- Industry context interpretation -->
${body.interpretation ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">${body.interpretation}</p>
</td></tr>
</table>
` : ""}

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Assessment details — clean two-column -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="50%" style="vertical-align:top;padding-right:16px;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Industry</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0 0 20px;">${industry || "\u2014"}</p>
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Operating Structure</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0;">${structure || "\u2014"}</p>
</td>
<td width="50%" style="vertical-align:top;padding-left:16px;border-left:1px solid rgba(14,26,43,0.06);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Primary Constraint</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0 0 20px;">${body.constraint || "\u2014"}</p>
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Dimensions Analyzed</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0;">6</p>
</td>
</tr>
</table>

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Command Center CTA -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
<tr><td style="text-align:center;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${teal};margin:0 0 8px;">NEXT STEP</p>
<p style="font-size:18px;font-weight:300;color:${navy};margin:0 0 8px;letter-spacing:-0.01em;">Your full breakdown is ready.</p>
<p style="font-size:13px;color:${muted};line-height:1.65;margin:0 0 24px;">
See exactly where your income is strong, where it\u2019s exposed, and what to focus on first.
</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="background-color:${purple};border-radius:10px;">
<a href="${dashboardLink}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">Open Your Command Center</a>
</td></tr>
</table>
</td></tr>
</table>

<!-- Reassessment guidance -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
<tr><td style="padding:20px 24px;border-radius:8px;border:1px solid rgba(14,26,43,0.06);background-color:#fafaf8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="4" style="vertical-align:top;padding-right:16px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:3px;height:36px;background-color:${teal};border-radius:2px;">&nbsp;</td></tr></table>
</td>
<td>
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">When to check back in</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0;">
Run another assessment in about 90 days, or whenever something meaningful shifts${industry ? ` \u2014 a new contract, a change in how your ${industry.toLowerCase()} revenue comes in, or a move toward recurring work` : ""}. Your Command Center will track the progress for you.
</p>
</td>
</tr>
</table>
</td></tr>
</table>

<!-- Record reference -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
<tr><td>
<p style="font-size:10px;color:rgba(14,26,43,0.22);margin:0;letter-spacing:0.02em;">Record ${shortId} \u00B7 Model RP-2.0</p>
</td></tr>
</table>

</td></tr>
</table>
</td></tr>

<!-- Footer — navy -->
<tr><td style="padding:32px 52px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;">
<p style="font-size:11px;color:rgba(244,241,234,0.40);margin:0 0 6px;letter-spacing:0.04em;">RunPayway \u2014 Income Stability Score\u2122</p>
<p style="font-size:10px;color:rgba(244,241,234,0.22);margin:0 0 12px;">Confidential \u2014 Prepared exclusively for ${name}</p>
<a href="https://peoplestar.com/RunPayway/contact" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">CONTACT US</a>
</td></tr>
</table>
</td></tr>

<tr><td style="height:24px;">&nbsp;</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
      to: body.to,
      subject: `${body.name || "Your"} Income Stability Assessment \u2014 ${body.band || "Results Ready"}`,
      html,
      tags: [
        { name: "type", value: "assessment-report" },
        { name: "record_id", value: shortId },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: "Email failed", detail: err }), {
      status: 502, headers: corsHeaders,
    });
  }

  const result = await res.json();
  return new Response(JSON.stringify({ success: true, id: result.id }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════════════════════

async function handleContact(body, env, corsHeaders) {
  if (!body.name || !body.email || !body.message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  // Format admin notification based on type
  const isBriefSignup = body.subject === "structural_income_brief";
  const adminSubject = isBriefSignup
    ? `[RunPayway] New Brief Subscriber: ${body.email}`
    : `[RunPayway Contact] ${(body.subject || "General Inquiry").replace(/[\r\n]/g, "")} - ${(body.name || "").replace(/[\r\n]/g, "")}`;

  const adminHtml = isBriefSignup
    ? `<div style="font-family:sans-serif;max-width:600px;">
<h2 style="color:#1F6D7A;margin:0 0 16px;">New Structural Income Brief Subscriber</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#6B6155;width:100px;">Email</td><td style="padding:8px 0;color:#1C1635;font-weight:600;">${body.email}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Source</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${body.message.includes("homepage") ? "Homepage" : body.message.includes("footer") ? "Footer" : body.message.includes("free-score") ? "Free Score Page" : "Website"}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Date</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td></tr>
</table>
<div style="margin:16px 0;padding:16px;background:#F0FDF4;border-radius:8px;border:1px solid #BBF7D0;">
<p style="margin:0;color:#166534;line-height:1.6;font-weight:500;">This subscriber will receive the 3-email nurture sequence automatically (Day 0, Day 3, Day 7).</p>
</div>
</div>`
    : `<div style="font-family:sans-serif;max-width:600px;">
<h2 style="color:#1C1635;margin:0 0 16px;">New Contact Form Submission</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#6B6155;width:100px;">Name</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${body.name}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Email</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${body.email}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Subject</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${body.subject || "General"}</td></tr>
</table>
<div style="margin:16px 0;padding:16px;background:#F8F6F1;border-radius:8px;border:1px solid #E8E5DE;">
<p style="margin:0;color:#1C1635;line-height:1.6;">${body.message.replace(/\n/g, "<br/>")}</p>
</div>
<p style="font-size:12px;color:#6B6155;margin:16px 0 0;">Reply directly to this email to respond to ${body.name}.</p>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
      to: "info@peoplestar.com",
      reply_to: body.email,
      subject: adminSubject,
      html: adminHtml,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: "Send failed", detail: err }), {
      status: 502, headers: corsHeaders,
    });
  }

  // ── Nurture sequence: enroll and send email 1 for brief signups ──
  if (body.subject === "structural_income_brief") {
    try {
      await ensureNurtureTable(env);

      // Check if already enrolled (idempotent)
      const existing = await env.DB.prepare(
        "SELECT email, emails_sent FROM nurture_queue WHERE email = ?"
      ).bind(body.email.toLowerCase()).first();

      if (!existing) {
        const now = new Date().toISOString();
        await env.DB.prepare(
          `INSERT INTO nurture_queue (email, name, signed_up_at, emails_sent, score, band, constraint_name, industry)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          body.email.toLowerCase(),
          body.name || "there",
          now,
          "1", // email 1 will be sent immediately
          0,   // score not yet available
          "",  // band not yet available
          "",  // constraint not yet available
          ""   // industry not yet available
        ).run();

        // Send nurture email 1 immediately (welcome version without score)
        const welcomeResult = buildNurtureWelcomeEmail({ name: body.name || "there" });
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
            to: body.email,
            subject: welcomeResult.subject,
            html: welcomeResult.html,
            tags: [{ name: "type", value: "nurture-1" }],
          }),
        });
        console.log(`[Nurture] Enrolled ${body.email} and sent welcome email`);
      } else {
        console.log(`[Nurture] ${body.email} already enrolled, skipping`);
      }
    } catch (err) {
      // Nurture enrollment failure should not break the contact form
      console.error(`[Nurture] Enrollment error for ${body.email}:`, err);
    }
  }

  return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════

async function handleStats(env, corsHeaders) {
  const total = await env.DB.prepare("SELECT COUNT(*) as count FROM records").first();
  const avgScore = await env.DB.prepare("SELECT AVG(score) as avg FROM records").first();
  const byBand = await env.DB.prepare("SELECT band, COUNT(*) as count FROM records GROUP BY band ORDER BY count DESC").all();
  const byIndustry = await env.DB.prepare("SELECT industry, COUNT(*) as count, ROUND(AVG(score),1) as avg_score FROM records GROUP BY industry ORDER BY count DESC LIMIT 20").all();
  const byStructure = await env.DB.prepare("SELECT operating_structure, COUNT(*) as count, ROUND(AVG(score),1) as avg_score FROM records GROUP BY operating_structure ORDER BY count DESC LIMIT 10").all();
  const byModel = await env.DB.prepare("SELECT income_model, COUNT(*) as count, ROUND(AVG(score),1) as avg_score FROM records GROUP BY income_model ORDER BY count DESC LIMIT 10").all();
  const recent = await env.DB.prepare("SELECT id, created_at, assessment_title, industry, score, band FROM records ORDER BY created_at DESC LIMIT 25").all();
  const today = new Date().toISOString().split("T")[0];
  const todayCount = await env.DB.prepare("SELECT COUNT(*) as count FROM records WHERE created_at LIKE ?").bind(`${today}%`).first();

  return new Response(JSON.stringify({
    total_assessments: total?.count || 0,
    today: todayCount?.count || 0,
    average_score: Math.round((avgScore?.avg || 0) * 10) / 10,
    by_band: byBand?.results || [],
    by_industry: byIndustry?.results || [],
    by_structure: byStructure?.results || [],
    by_income_model: byModel?.results || [],
    recent_assessments: recent?.results || [],
  }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// ENTITLEMENT ENFORCEMENT — D1-backed access control
// ══════════════════════════════════════════════════════════

const PLAN_CONFIGS = {
  free:                { assessments_allowed: 1, expires_months: null },
  single_assessment:   { assessments_allowed: 1, expires_months: null },
  annual_monitoring:   { assessments_allowed: 3, expires_months: 12 },
};

// Ensure the entitlements table exists (idempotent)
async function ensureEntitlementsTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS entitlements (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      plan_key TEXT NOT NULL,
      assessments_allowed INTEGER NOT NULL,
      assessments_used INTEGER NOT NULL DEFAULT 0,
      model_version TEXT NOT NULL DEFAULT 'RP-2.0',
      status TEXT NOT NULL DEFAULT 'active',
      stripe_session_id TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT,
      last_assessment_at TEXT,
      last_assessment_id TEXT
    )
  `).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_entitlements_email ON entitlements(email)`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_entitlements_stripe ON entitlements(stripe_session_id)`).run();
}

async function handleEntitlementCreate(body, env, corsHeaders) {
  await ensureEntitlementsTable(env);

  const email = (body.email || "").toLowerCase().trim();
  const plan_key = body.plan_key || "";
  if (!email || !plan_key) {
    return new Response(JSON.stringify({ error: "Missing email or plan_key" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const config = PLAN_CONFIGS[plan_key];
  if (!config) {
    return new Response(JSON.stringify({ error: "Unknown plan_key" }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Duplicate detection: same stripe_session_id
  if (body.stripe_session_id) {
    const existing = await env.DB.prepare(
      "SELECT * FROM entitlements WHERE stripe_session_id = ?"
    ).bind(body.stripe_session_id).first();
    if (existing) {
      return new Response(JSON.stringify({ success: true, entitlement: existing, duplicate: true }), { headers: corsHeaders });
    }
  }

  // Duplicate detection: same email + plan_key within 24h
  const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await env.DB.prepare(
    "SELECT * FROM entitlements WHERE email = ? AND plan_key = ? AND created_at > ? ORDER BY created_at DESC LIMIT 1"
  ).bind(email, plan_key, cutoff24h).first();
  if (recent) {
    return new Response(JSON.stringify({ success: true, entitlement: recent, duplicate: true }), { headers: corsHeaders });
  }

  const now = new Date();
  const id = "ent_" + crypto.randomUUID().slice(0, 12);
  const expires_at = config.expires_months
    ? new Date(now.getTime() + config.expires_months * 30 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  await env.DB.prepare(
    `INSERT INTO entitlements (id, email, plan_key, assessments_allowed, assessments_used, model_version, status, stripe_session_id, created_at, expires_at)
     VALUES (?, ?, ?, ?, 0, ?, 'active', ?, ?, ?)`
  ).bind(
    id,
    email,
    plan_key,
    config.assessments_allowed,
    body.model_version || "RP-2.0",
    body.stripe_session_id || null,
    now.toISOString(),
    expires_at,
  ).run();

  const created = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(id).first();
  return new Response(JSON.stringify({ success: true, entitlement: created }), { headers: corsHeaders });
}

async function handleEntitlementCheck(body, env, corsHeaders) {
  await ensureEntitlementsTable(env);

  const email = (body.email || "").toLowerCase().trim();
  const plan_key = body.plan_key || "";
  if (!email || !plan_key) {
    return new Response(JSON.stringify({ error: "Missing email or plan_key" }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Find active entitlement for this email + plan_key
  let ent = await env.DB.prepare(
    "SELECT * FROM entitlements WHERE email = ? AND plan_key = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  ).bind(email, plan_key).first();

  // Free plan auto-create: if no entitlement exists, create one
  if (!ent && plan_key === "free") {
    const config = PLAN_CONFIGS.free;
    const now = new Date();
    const id = "ent_" + crypto.randomUUID().slice(0, 12);
    await env.DB.prepare(
      `INSERT INTO entitlements (id, email, plan_key, assessments_allowed, assessments_used, model_version, status, created_at)
       VALUES (?, ?, 'free', ?, 0, 'RP-2.0', 'active', ?)`
    ).bind(id, email, config.assessments_allowed, now.toISOString()).run();
    ent = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(id).first();
  }

  if (!ent) {
    return new Response(JSON.stringify({ allowed: false, reason: "no_entitlement", plan_key }), { headers: corsHeaders });
  }

  // Check expiry for annual plans
  if (ent.expires_at && new Date(ent.expires_at) < new Date()) {
    await env.DB.prepare("UPDATE entitlements SET status = 'expired' WHERE id = ?").bind(ent.id).run();
    return new Response(JSON.stringify({ allowed: false, reason: "expired", plan_key, entitlement_id: ent.id }), { headers: corsHeaders });
  }

  // Model version upgrade: if not on RP-2.0, grant +1 bonus and update
  if (ent.model_version !== "RP-2.0") {
    await env.DB.prepare(
      "UPDATE entitlements SET model_version = 'RP-2.0', assessments_allowed = assessments_allowed + 1 WHERE id = ?"
    ).bind(ent.id).run();
    ent = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(ent.id).first();
  }

  const remaining = ent.assessments_allowed - ent.assessments_used;

  if (remaining > 0) {
    return new Response(JSON.stringify({
      allowed: true, remaining, plan_key, entitlement_id: ent.id,
    }), { headers: corsHeaders });
  }

  // Single assessment retake: exhausted but within 30 days of purchase and has a last_assessment_id
  if (ent.assessments_used >= ent.assessments_allowed && ent.last_assessment_id) {
    const daysSincePurchase = (Date.now() - new Date(ent.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePurchase <= 30) {
      return new Response(JSON.stringify({
        allowed: true, remaining: 0, plan_key, entitlement_id: ent.id, retake: true,
        reason: "retake_allowed",
      }), { headers: corsHeaders });
    }
  }

  return new Response(JSON.stringify({
    allowed: false, remaining: 0, plan_key, entitlement_id: ent.id, reason: "exhausted",
  }), { headers: corsHeaders });
}

async function handleEntitlementUse(body, env, corsHeaders) {
  await ensureEntitlementsTable(env);

  const entitlement_id = body.entitlement_id || "";
  const assessment_id = body.assessment_id || "";
  if (!entitlement_id || !assessment_id) {
    return new Response(JSON.stringify({ error: "Missing entitlement_id or assessment_id" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const ent = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(entitlement_id).first();
  if (!ent) {
    return new Response(JSON.stringify({ error: "Entitlement not found" }), {
      status: 404, headers: corsHeaders,
    });
  }

  // Idempotency: if this assessment_id already recorded, skip decrement
  if (ent.last_assessment_id === assessment_id) {
    const remaining = ent.assessments_allowed - ent.assessments_used;
    return new Response(JSON.stringify({ success: true, remaining, status: ent.status, idempotent: true }), { headers: corsHeaders });
  }

  const now = new Date().toISOString();

  if (body.retake) {
    // Retake: don't increment, just update last_assessment fields
    await env.DB.prepare(
      "UPDATE entitlements SET last_assessment_at = ?, last_assessment_id = ? WHERE id = ?"
    ).bind(now, assessment_id, entitlement_id).run();
    const remaining = ent.assessments_allowed - ent.assessments_used;
    return new Response(JSON.stringify({ success: true, remaining, status: ent.status }), { headers: corsHeaders });
  }

  // Normal use: increment assessments_used
  const newUsed = ent.assessments_used + 1;
  const newStatus = newUsed >= ent.assessments_allowed ? "exhausted" : "active";
  await env.DB.prepare(
    "UPDATE entitlements SET assessments_used = ?, status = ?, last_assessment_at = ?, last_assessment_id = ? WHERE id = ?"
  ).bind(newUsed, newStatus, now, assessment_id, entitlement_id).run();

  const remaining = ent.assessments_allowed - newUsed;
  return new Response(JSON.stringify({ success: true, remaining, status: newStatus }), { headers: corsHeaders });
}

async function handleEntitlementLookup(body, env, corsHeaders) {
  await ensureEntitlementsTable(env);

  const email = (body.email || "").toLowerCase().trim();
  if (!email) {
    return new Response(JSON.stringify({ error: "Missing email" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const rows = await env.DB.prepare(
    "SELECT * FROM entitlements WHERE email = ? ORDER BY created_at DESC"
  ).bind(email).all();

  return new Response(JSON.stringify({ success: true, entitlements: rows?.results || [] }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// NURTURE SEQUENCE — D1-backed scheduler
// ══════════════════════════════════════════════════════════

// Ensure the nurture_queue table exists (idempotent)
async function ensureNurtureTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS nurture_queue (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'there',
      signed_up_at TEXT NOT NULL,
      emails_sent TEXT NOT NULL DEFAULT '1',
      score INTEGER DEFAULT 0,
      band TEXT DEFAULT '',
      constraint_name TEXT DEFAULT '',
      industry TEXT DEFAULT ''
    )
  `).run();
}

// Process the nurture queue — called by cron trigger daily at 2pm UTC
async function processNurtureQueue(env) {
  if (!env.RESEND_API_KEY) {
    console.log("[Nurture Cron] No RESEND_API_KEY configured, skipping");
    return;
  }

  try {
    await ensureNurtureTable(env);
  } catch (err) {
    console.error("[Nurture Cron] Failed to ensure table:", err);
    return;
  }

  const fromEmail = env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>";

  // Fetch all nurture records that still have emails to send
  let rows;
  try {
    rows = await env.DB.prepare(
      "SELECT * FROM nurture_queue ORDER BY signed_up_at ASC LIMIT 50"
    ).all();
  } catch (err) {
    console.error("[Nurture Cron] Failed to query nurture_queue:", err);
    return;
  }

  if (!rows?.results?.length) {
    console.log("[Nurture Cron] No records to process");
    return;
  }

  console.log(`[Nurture Cron] Processing ${rows.results.length} nurture records`);
  const now = Date.now();

  for (const row of rows.results) {
    const emailsSent = row.emails_sent ? row.emails_sent.split(",").map(Number) : [];
    const signedUpAt = new Date(row.signed_up_at).getTime();
    const daysSince = Math.floor((now - signedUpAt) / (1000 * 60 * 60 * 24));

    const params = {
      name: row.name || "there",
      score: row.score || 0,
      band: row.band || "",
      constraint: row.constraint_name || "Income Concentration",
      industry: row.industry || "",
    };

    try {
      // Day 3+: send email 2 (the structural move email)
      if (daysSince >= 3 && !emailsSent.includes(2)) {
        let emailContent;
        if (params.score > 0) {
          // Have score data — send the full nurture email 2
          emailContent = buildNurtureEmail2(params);
        } else {
          // No score yet — send a reminder to take the assessment
          emailContent = buildNurtureReminder2(params);
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: row.email,
            subject: emailContent.subject,
            html: emailContent.html,
            tags: [{ name: "type", value: "nurture-2" }],
          }),
        });

        if (res.ok) {
          emailsSent.push(2);
          await env.DB.prepare(
            "UPDATE nurture_queue SET emails_sent = ? WHERE email = ?"
          ).bind(emailsSent.join(","), row.email).run();
          console.log(`[Nurture Cron] Sent email 2 to ${row.email} (day ${daysSince})`);
        } else {
          console.error(`[Nurture Cron] Failed to send email 2 to ${row.email}: ${await res.text()}`);
        }
        continue; // Process one email per record per cron run
      }

      // Day 7+: send email 3 (the industry patterns email)
      if (daysSince >= 7 && !emailsSent.includes(3)) {
        let emailContent;
        if (params.score > 0) {
          emailContent = buildNurtureEmail3(params);
        } else {
          emailContent = buildNurtureReminder3(params);
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: row.email,
            subject: emailContent.subject,
            html: emailContent.html,
            tags: [{ name: "type", value: "nurture-3" }],
          }),
        });

        if (res.ok) {
          emailsSent.push(3);
          await env.DB.prepare(
            "UPDATE nurture_queue SET emails_sent = ? WHERE email = ?"
          ).bind(emailsSent.join(","), row.email).run();
          console.log(`[Nurture Cron] Sent email 3 to ${row.email} (day ${daysSince})`);
        } else {
          console.error(`[Nurture Cron] Failed to send email 3 to ${row.email}: ${await res.text()}`);
        }
        continue;
      }

      // All 3 emails sent — clean up the record
      if (emailsSent.includes(1) && emailsSent.includes(2) && emailsSent.includes(3)) {
        await env.DB.prepare("DELETE FROM nurture_queue WHERE email = ?").bind(row.email).run();
        console.log(`[Nurture Cron] Completed sequence for ${row.email}, record removed`);
      }
    } catch (err) {
      // Individual record failure should not stop processing others
      console.error(`[Nurture Cron] Error processing ${row.email}:`, err);
    }
  }

  console.log("[Nurture Cron] Processing complete");
}

// Welcome email (no score yet) — sent immediately on signup
function buildNurtureWelcomeEmail({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">Welcome to the Structural Income Brief, ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">You are now receiving structural intelligence about how income holds up under pressure.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals have no structural view of their income. They know what they earn, but not how it behaves under disruption \u2014 what happens when a client leaves, a contract ends, or the market shifts.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">The RunPayway Income Stability Score measures exactly this: how your income holds up when conditions change. It looks at six structural dimensions \u2014 concentration, recurrence, forward visibility, labor dependence, variability, and continuity \u2014 and produces a single number that tells you where you stand.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">Take your free assessment to receive your personalized income structure analysis. It takes under 3 minutes.</p>
</td></tr></table>
${nurtureCta("Take Your Free Assessment", "https://peoplestar.com/RunPayway/begin")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">What to expect</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0;">Over the next week, you will receive two more briefs: your primary structural constraint and how to address it, and how income patterns in your industry compare. Each one builds on the last.</p>
</td></tr></table>`;

  return { subject: `Welcome to the Structural Income Brief, ${name}`, html: nurtureEmailWrapper(body, name) };
}

// Reminder email 2 (Day 3, no score available) — nudge to take assessment
function buildNurtureReminder2({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, your structural analysis is waiting.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">We have not received your assessment yet. Here is why it matters.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">The difference between income that feels stable and income that is structurally stable is not always obvious. Most people discover the gap only when something disrupts their earning pattern \u2014 a lost client, an industry shift, an unexpected change.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">The free assessment takes under 3 minutes. It maps six structural dimensions of your income and identifies the single highest-leverage change you can make. No financial advice, no sales pitch \u2014 just a structural reading of how your income actually works.</p>
</td></tr></table>
${nurtureCta("Start Your Free Assessment", "https://peoplestar.com/RunPayway/begin")}`;

  return { subject: `${name}, your structural analysis is waiting`, html: nurtureEmailWrapper(body, name) };
}

// Reminder email 3 (Day 7, no score available) — last nudge
function buildNurtureReminder3({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">One structural question for ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">This is the last email in the series without your assessment.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">If your largest income source disappeared tomorrow \u2014 how many months could your current structure sustain you?</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals answer this question with a feeling, not a number. The Income Stability Score replaces that feeling with a structural measurement. Six dimensions, one score, one clear priority.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">It takes under 3 minutes. The result will either confirm that your structure is sound, or it will show you exactly where it is not.</p>
</td></tr></table>
${nurtureCta("See Where You Stand", "https://peoplestar.com/RunPayway/begin")}`;

  return { subject: `One structural question for ${name}`, html: nurtureEmailWrapper(body, name) };
}

// ══════════════════════════════════════════════════════════
// FOLLOW-UP EMAIL CRON
// ══════════════════════════════════════════════════════════

// followup_sent bitmask: 0=none, 1=day7, 2=day30, 4=day90

async function handleFollowUpCron(env) {
  if (!env.RESEND_API_KEY) return;
  const fromEmail = env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>";

  // Query records with email that haven't received all follow-ups
  const rows = await env.DB.prepare(
    `SELECT id, email, assessment_title, score, band, top_action, industry, created_at, followup_sent
     FROM records
     WHERE email != '' AND email IS NOT NULL AND followup_sent < 7
     ORDER BY created_at ASC LIMIT 50`
  ).all();

  if (!rows?.results?.length) return;

  const now = Date.now();

  for (const row of rows.results) {
    const daysSince = Math.floor((now - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const sent = row.followup_sent || 0;
    const name = row.assessment_title || "there";

    let email = null;

    // Day 7 (send between day 6-14)
    if (daysSince >= 6 && daysSince <= 14 && !(sent & 1)) {
      email = {
        flag: 1,
        subject: `${name}, have you explored your Command Center yet?`,
        html: followUpDay7(name, row.score, row.band, row.top_action, row.id, row.industry),
      };
    }
    // Day 30 (send between day 28-45)
    else if (daysSince >= 28 && daysSince <= 45 && !(sent & 2)) {
      email = {
        flag: 2,
        subject: `${daysSince} days since your assessment \u2014 here\u2019s what to focus on`,
        html: followUpDay30(name, row.score, row.top_action, daysSince, row.id, row.industry),
      };
    }
    // Day 90 (send between day 85-120)
    else if (daysSince >= 85 && daysSince <= 120 && !(sent & 4)) {
      email = {
        flag: 4,
        subject: `${name}, it\u2019s time to see how much you\u2019ve improved`,
        html: followUpDay90(name, daysSince, row.id, row.industry),
      };
    }

    if (!email) continue;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: fromEmail,
          to: row.email,
          subject: email.subject,
          html: email.html,
          tags: [{ name: "type", value: "follow-up" }, { name: "record_id", value: row.id.slice(0, 8) }],
        }),
      });
      if (res.ok) {
        await env.DB.prepare("UPDATE records SET followup_sent = ? WHERE id = ?").bind(sent | email.flag, row.id).run();
      }
    } catch { /* email send failed — will retry next cron */ }
  }
}

// ── Industry-Specific Reassessment Prompts ────────────────────────
// Mirrors reassessment fields from src/lib/industry-vocabulary.ts
// Keys: recurrence, concentration, diversification, forward, variability, labor

const INDUSTRY_REASSESSMENT_PROMPTS = {
  real_estate: {
    recurrence: "Have you added any property management contracts, rental units, or team override arrangements since your last assessment that now generate monthly income without requiring a closing?",
    concentration: "Has the share of your GCI coming from your single largest referral source or client changed — have you added new lead sources, or has one relationship become even more dominant?",
    diversification: "Are you now earning income from transaction types or market areas you were not active in before — commercial, rentals, new construction, or a different geographic farm?",
    forward: "Do you currently have more or fewer signed listing agreements and pre-approved buyers in your pipeline compared to your last assessment?",
    variability: "Over the past six months, has the gap between your highest-earning month and lowest-earning month narrowed or widened?",
    labor: "Have you hired showing assistants, buyer's agents, or established referral partnerships that generate income without your personal presence at every transaction?",
  },
  consulting_professional_services: {
    recurrence: "Have you converted any project clients to monthly retainer arrangements, or added subscription-based services that now generate predictable monthly revenue?",
    concentration: "Has the percentage of your total revenue coming from your single largest client increased or decreased since your last assessment?",
    diversification: "Are you now serving clients in industries or functional areas that you were not active in previously?",
    forward: "Do you currently have more signed engagement letters and committed retainers extending into the next quarter than you did at your last assessment?",
    variability: "Over the last two quarters, has the spread between your highest-revenue month and lowest-revenue month narrowed?",
    labor: "Have you hired associates, engaged subcontractors, or launched any productized offerings that generate revenue without requiring your personal delivery hours?",
  },
  technology: {
    recurrence: "Have you added maintenance contracts, SaaS subscriptions, or any recurring billing arrangements since your last assessment?",
    concentration: "Has the share of revenue from your single largest client or platform changed — have you onboarded new clients, or has one account grown more dominant?",
    diversification: "Are you now generating income from technology stacks, platforms, or client industries you were not serving before?",
    forward: "Do you have more or fewer signed SOWs and committed engagements on the books compared to your last assessment?",
    variability: "Has the gap between your highest and lowest billing months over the past two quarters narrowed or widened?",
    labor: "Have you launched products, hired subcontractors, or built automation that generates revenue without your direct billable hours?",
  },
  healthcare: {
    recurrence: "Have you enrolled new patients in a membership or concierge program, added chronic care management billing, or established any recurring monthly revenue since your last assessment?",
    concentration: "Has the percentage of your collections from your single largest insurance payer or referral source changed significantly?",
    diversification: "Are you now offering clinical services, payer types, or treatment modalities that you were not providing at your last assessment?",
    forward: "Is your patient schedule booked further in advance than it was previously — do you have more pre-scheduled visits and committed treatment plans on the books?",
    variability: "Over the past six months, has the spread between your highest-collection month and lowest-collection month narrowed or widened?",
    labor: "Have you hired associate providers, launched telehealth services, or created any revenue streams that do not require your direct clinical presence?",
  },
  legal_services: {
    recurrence: "Have you converted any hourly clients to monthly retainer arrangements, or established subscription legal services that now generate predictable monthly revenue?",
    concentration: "Has the share of your total billings from your single largest client increased or decreased since your last assessment?",
    diversification: "Are you now practicing in areas of law or serving client industries that you were not active in previously?",
    forward: "Do you have more signed engagement letters, committed retainers, and active matters on the books than at your last assessment?",
    variability: "Over the past two quarters, has the difference between your highest and lowest billing months narrowed?",
    labor: "Have you hired associates, engaged contract attorneys, or launched any legal products or services that generate revenue without your direct billable hours?",
  },
  finance_banking: {
    recurrence: "Have you converted commission-based client relationships to fee-based advisory accounts, or added flat-fee planning subscriptions that generate new recurring revenue?",
    concentration: "Has the percentage of your AUM held by your top three households increased or decreased since your last assessment?",
    diversification: "Are you now serving client demographics, asset classes, or planning niches that you were not active in before?",
    forward: "Do you have more signed multi-year advisory agreements or prepaid planning commitments on the books than at your last assessment?",
    variability: "Over the past four quarters, has the impact of market fluctuations on your fee revenue been reduced by fixed-fee or subscription components?",
    labor: "Have you hired associate advisors, paraplanners, or implemented technology that allows your practice to serve clients without your direct involvement in every interaction?",
  },
  insurance: {
    recurrence: "Has your renewal commission income grown as a percentage of total compensation — are renewals now covering a larger share of your expenses than at your last assessment?",
    concentration: "Has the share of your total commissions coming from your single largest account or carrier changed significantly?",
    diversification: "Are you now writing coverage lines, serving industries, or placed with carriers that you were not active with before?",
    forward: "Do you have more bound policies and signed applications in the pipeline than you did at your last assessment?",
    variability: "Over the past six months, has the gap between your highest and lowest commission months narrowed?",
    labor: "Have you hired service staff, added sub-producers, or implemented quoting automation that generates production without your direct effort?",
  },
  sales_brokerage: {
    recurrence: "Have you established residual commission arrangements, override structures, or recurring advisory fees that now generate income without requiring you to close a new deal?",
    concentration: "Has the share of your total commission income from your single largest account or deal type changed since your last assessment?",
    diversification: "Are you now closing deals in industries, product categories, or geographic markets you were not active in before?",
    forward: "Do you have more signed commitments, LOIs, or binding agreements in your pipeline than at your last assessment?",
    variability: "Over the past two quarters, has the difference between your best and worst commission months narrowed?",
    labor: "Have you added junior reps, automated your prospecting process, or built any income streams that generate commissions without your direct deal involvement?",
  },
  creative_media: {
    recurrence: "Have you launched a membership program, signed retainer-based brand partnerships, or established any licensing arrangements that now generate predictable monthly revenue?",
    concentration: "Has the percentage of your income from a single brand partner, platform, or content buyer changed since your last assessment?",
    diversification: "Are you now earning revenue from content formats, platforms, or brand categories you were not active in previously?",
    forward: "Do you have more signed production contracts, confirmed sponsorships, and pre-sold content packages than at your last assessment?",
    variability: "Over the past six months, has the gap between your highest-earning and lowest-earning months narrowed?",
    labor: "Have you hired production support, launched digital products, or built systems that generate revenue without requiring your personal creative involvement in every deliverable?",
  },
  construction_trades: {
    recurrence: "Have you added maintenance contracts, service agreements, or any recurring monthly revenue arrangements since your last assessment?",
    concentration: "Has the share of your total project revenue from your single largest client or GC relationship changed — have you added new project sources, or has one relationship become more dominant?",
    diversification: "Are you now performing work types, serving market segments, or bidding project categories that you were not active in before?",
    forward: "Do you currently have more awarded bids and signed contracts on your books than at your last assessment?",
    variability: "Over the past six months, has the gap between your highest-revenue and lowest-revenue months narrowed?",
    labor: "Have you developed crew leaders who can manage job sites independently, acquired rental assets, or built any income streams that generate revenue without your personal presence on the job site?",
  },
  education_training: {
    recurrence: "Have you added any new ongoing contracts, subscription courses, or recurring training retainers since your last assessment?",
    concentration: "Has the share of income from your largest institution or client changed — did you reduce dependency or did it grow?",
    diversification: "Are you now serving new types of buyers — different sectors, new platforms, or different learner demographics — compared to before?",
    forward: "How far out is your teaching calendar booked? Do you have confirmed engagements further into the future than last time?",
    variability: "Did your month-to-month income even out, or are the peaks and valleys still as dramatic as before?",
    labor: "Have you launched any asynchronous courses, licensed materials, or other income streams that do not require your live presence?",
  },
  retail_ecommerce: {
    recurrence: "Have you added any subscription offerings, auto-replenishment programs, or recurring wholesale orders since your last assessment?",
    concentration: "Is your revenue more spread across channels now, or has your dependence on a single marketplace grown since last time?",
    diversification: "Have you expanded your product catalog, entered new customer segments, or opened new sales channels?",
    forward: "Do you have more confirmed pre-orders, standing purchase orders, or contracted wholesale commitments than before?",
    variability: "Has your month-to-month revenue become more consistent, or are the seasonal spikes and valleys still extreme?",
    labor: "Have you automated more operations or hired help, or are you still the bottleneck for daily fulfillment and customer service?",
  },
  hospitality: {
    recurrence: "Have you secured any new standing accounts, recurring event contracts, or membership subscriptions since your last assessment?",
    concentration: "Has your largest client's share of revenue decreased, or have you become even more dependent on them?",
    diversification: "Are you generating revenue from new service types or client segments that you were not serving before?",
    forward: "How far into the future is your events and reservations calendar booked compared to last time?",
    variability: "Have your off-peak months improved, or is the gap between your best and worst months still just as wide?",
    labor: "Can your operation run without you for a week now? Have you reduced the number of tasks that only you can perform?",
  },
  transportation: {
    recurrence: "Have you converted any spot lanes into standing contracts or added new recurring freight commitments since your last assessment?",
    concentration: "Has your freight volume become more diversified across shippers, or are you still heavily dependent on one or two accounts?",
    diversification: "Are you hauling for new industries, running new lane types, or serving new geographies compared to before?",
    forward: "How many weeks of confirmed loads do you have booked ahead? Is your forward visibility longer or shorter than last time?",
    variability: "Has your rate per mile and weekly revenue become more consistent, or are you still riding the spot market roller coaster?",
    labor: "Have you improved driver retention, added capacity, or reduced your personal involvement in daily dispatch operations?",
  },
  manufacturing: {
    recurrence: "Have you secured any new blanket orders, long-term supply agreements, or standing production contracts since your last assessment?",
    concentration: "Has your production volume become more balanced across customers, or has your top buyer's share increased?",
    diversification: "Are you now serving customers in new industries or producing new product types compared to before?",
    forward: "How deep is your production backlog in weeks? Do you have more confirmed orders on the books than last time?",
    variability: "Has your monthly production volume stabilized, or do you still experience dramatic swings between busy and idle periods?",
    labor: "Have you reduced skill bottlenecks through cross-training, documentation, or automation since your last assessment?",
  },
  nonprofit: {
    recurrence: "Have you added any new multi-year grants, monthly donors, or recurring program fee revenue since your last assessment?",
    concentration: "Has your largest funder's share of your total budget decreased, or has your dependency on them grown?",
    diversification: "Are you receiving funding from new source types — earned revenue, corporate partners, new government programs — that you were not tapping before?",
    forward: "How many months of committed funding do you have confirmed? Is your financial runway longer or shorter than last time?",
    variability: "Has your monthly cash flow stabilized, or are you still experiencing dramatic swings between funding peaks and valleys?",
    labor: "Could your fundraising and programs continue if you personally stepped away for a month? Have you reduced single-person dependencies?",
  },
  agriculture: {
    recurrence: "Have you added any new CSA subscriptions, forward contracts, or recurring supply agreements since your last assessment?",
    concentration: "Has your revenue become more balanced across buyers and crops, or are you still heavily concentrated in one commodity or one sales channel?",
    diversification: "Are you generating income from new sources — value-added products, agritourism, new crops, or secondary livestock — that were not part of your operation before?",
    forward: "What percentage of your next harvest is already committed or forward-priced? Is your pre-season revenue certainty higher than last year?",
    variability: "Has your monthly cash flow smoothed out, or is your income still arriving in one or two large lumps around harvest?",
    labor: "Could your farm operate for two weeks without you personally in the field? Have you reduced your physical dependency through equipment, training, or hired help?",
  },
  energy: {
    recurrence: "Have you added any new maintenance contracts, PPA income, or recurring monitoring agreements since your last assessment?",
    concentration: "Is your project volume more diversified across referral sources, technologies, and client types, or has dependency on a single channel increased?",
    diversification: "Are you now serving new customer segments, offering new services, or operating in new territories compared to before?",
    forward: "How deep is your signed project backlog? Do you have more committed, permitted projects on the books than last time?",
    variability: "Has your monthly revenue stabilized through recurring services, or is it still driven entirely by project-based installation timing?",
    labor: "Have you expanded your team's capacity or reduced your personal involvement in on-site project execution?",
  },
  fitness_wellness: {
    recurrence: "Have you added any new monthly memberships, coaching retainers, or subscription-based offerings since your last assessment?",
    concentration: "Has your income become more distributed across clients, or are you still heavily dependent on a handful of premium bookings?",
    diversification: "Are you generating revenue from new channels — digital products, corporate wellness, group programming, workshops — that you were not using before?",
    forward: "How far ahead is your booking calendar filled? Do you have more pre-paid commitments and locked-in clients than last time?",
    variability: "Have your seasonal income swings reduced, or is January still dramatically better than July?",
    labor: "Have you created any income source that does not require your physical presence — digital programs, group formats, passive products?",
  },
  default: {
    recurrence: "Have you established any new recurring revenue arrangements since your last assessment?",
    concentration: "Has the share of revenue from your largest client changed?",
    diversification: "Are you now serving markets or offering services you were not active in before?",
    forward: "Do you have more signed commitments extending into the future than at your last assessment?",
    variability: "Has the spread between your best and worst months narrowed over the past two quarters?",
    labor: "Have you added team members, products, or systems that generate revenue without your direct involvement?",
  },
};

function getReassessmentPrompts(industry) {
  if (!industry) return INDUSTRY_REASSESSMENT_PROMPTS.default;
  const key = industry.toLowerCase().replace(/[\s\/&]+/g, "_").replace(/[^a-z0-9_]/g, "");
  return INDUSTRY_REASSESSMENT_PROMPTS[key] || INDUSTRY_REASSESSMENT_PROMPTS.default;
}

function followUpDay7(name, score, band, topAction, recordId, industry) {
  const link = recordId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(recordId)}` : "https://peoplestar.com/RunPayway/dashboard";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">${name}, your Command Center is waiting.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">Your Income Stability Score is <strong style="color:#1C1635;">${score}/100</strong> (${band}). Your 12-week roadmap, PressureMap, and What-If Simulator are ready.</p>
${topAction ? `<div style="border-left:3px solid #4B3FAE;padding:16px 20px;background:rgba(75,63,174,0.04);border-radius:0 8px 8px 0;margin-bottom:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#4B3FAE;margin-bottom:6px;">YOUR #1 PRIORITY</div>
<div style="font-size:15px;font-weight:600;color:#1C1635;">${topAction}</div></div>` : ""}
${(() => { const p = getReassessmentPrompts(industry); return `<div style="border-left:3px solid #1F6D7A;padding:16px 20px;background:rgba(31,109,122,0.04);border-radius:0 8px 8px 0;margin-bottom:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#1F6D7A;margin-bottom:6px;">QUICK CHECK</div>
<div style="font-size:14px;color:rgba(14,26,43,0.7);line-height:1.6;">${p.recurrence}</div></div>`; })()}
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#4B3FAE;border-radius:10px;">
<a href="${link}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open Your Command Center</a>
</td></tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function followUpDay30(name, score, topAction, daysSince, recordId, industry) {
  const link = recordId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(recordId)}` : "https://peoplestar.com/RunPayway/dashboard";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">${daysSince} days since your assessment.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 16px;">Your score of <strong style="color:#1C1635;">${score}</strong> reflects your income structure \u2014 not market conditions. The only way to change it is to make a structural change.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">${topAction ? `Your highest-leverage move is still: <strong style="color:#1C1635;">${topAction}</strong>. ` : ""}Use the Simulator to model the impact before you commit.</p>
${(() => { const p = getReassessmentPrompts(industry); return `<div style="border-left:3px solid #1F6D7A;padding:16px 20px;background:rgba(31,109,122,0.04);border-radius:0 8px 8px 0;margin-bottom:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#1F6D7A;margin-bottom:8px;">HAS ANYTHING CHANGED?</div>
<div style="font-size:13px;color:rgba(14,26,43,0.65);line-height:1.65;margin-bottom:10px;">${p.recurrence}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.65);line-height:1.65;margin-bottom:10px;">${p.concentration}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.65);line-height:1.65;">${p.forward}</div></div>`; })()}
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#4B3FAE;border-radius:10px;">
<a href="${link}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open the Simulator</a>
</td></tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

// ══════════════════════════════════════════════════════════
// NURTURE EMAIL ENDPOINT
// ══════════════════════════════════════════════════════════

async function handleNurture(body, env, corsHeaders) {
  const { email, name, score, band, constraint, industry, emailNumber } = body;

  if (!email || !emailNumber || !name) {
    return new Response(JSON.stringify({ error: "Missing required fields: email, name, emailNumber" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (![1, 2, 3].includes(emailNumber)) {
    return new Response(JSON.stringify({ error: "emailNumber must be 1, 2, or 3" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  const params = {
    name: name || "there",
    score: score || 0,
    band: band || "",
    constraint: constraint || "Income Concentration",
    industry: industry || "",
  };

  let subject, html;

  if (emailNumber === 1) {
    const result = buildNurtureEmail1(params);
    subject = result.subject;
    html = result.html;
  } else if (emailNumber === 2) {
    const result = buildNurtureEmail2(params);
    subject = result.subject;
    html = result.html;
  } else {
    const result = buildNurtureEmail3(params);
    subject = result.subject;
    html = result.html;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
        to: email,
        subject,
        html,
        tags: [
          { name: "type", value: `nurture-${emailNumber}` },
          { name: "score", value: String(score || 0) },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: "Email failed", detail: err }), {
        status: 502, headers: corsHeaders,
      });
    }

    const result = await res.json();
    return new Response(JSON.stringify({ success: true, id: result.id }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Send failed", detail: String(err) }), {
      status: 500, headers: corsHeaders,
    });
  }
}

// ── Nurture email template builders (inlined for Worker compatibility) ──

function nurtureEmailWrapper(bodyContent, recipientName) {
  const navy = "#1C1635";
  const purple = "#4B3FAE";
  const teal = "#1F6D7A";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${navy};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${navy};">
<tr><td style="height:32px;">&nbsp;</td></tr>
<tr><td align="center" style="padding:0 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;text-align:left;">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="display:inline-block;height:auto;filter:brightness(0) invert(1);opacity:0.85;"/>
</td></tr>
<tr><td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(90deg,${purple} 0%,${teal} 100%);height:2px;border-radius:1px;">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ffffff;padding:44px 40px 40px;border-radius:12px;margin-top:20px;">
${bodyContent}
</td></tr>
</table>
</td></tr>
<tr><td style="padding:32px 52px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;">
<p style="font-size:11px;color:rgba(244,241,234,0.40);margin:0 0 6px;letter-spacing:0.04em;">RunPayway \u2014 Income Stability Score\u2122</p>
<p style="font-size:10px;color:rgba(244,241,234,0.22);margin:0 0 12px;">Confidential \u2014 Prepared exclusively for ${recipientName}</p>
<a href="https://peoplestar.com/RunPayway/contact" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">CONTACT US</a>
<span style="font-size:10px;color:rgba(244,241,234,0.18);margin:0 8px;">&middot;</span>
<a href="https://peoplestar.com/RunPayway/contact?subject=unsubscribe" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">UNSUBSCRIBE</a>
</td></tr>
</table>
</td></tr>
<tr><td style="height:24px;">&nbsp;</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function nurtureCta(text, href) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="background-color:#4B3FAE;border-radius:10px;">
<a href="${href}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">${text}</a>
</td></tr>
</table>`;
}

function nurtureBandColor(score) {
  return score >= 75 ? "#1F6D7A" : score >= 50 ? "#2B5EA7" : score >= 30 ? "#92640A" : "#9B2C2C";
}

function buildNurtureEmail1({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const color = nurtureBandColor(score);

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, here is what your score means.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Your Income Stability Score places you in context against structural benchmarks.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="font-size:48px;font-weight:200;color:${navy};line-height:1;letter-spacing:-0.04em;font-family:'Georgia',serif;">${score}</td>
<td style="font-size:14px;font-weight:300;color:rgba(14,26,43,0.18);vertical-align:bottom;padding-bottom:8px;padding-left:4px;">/100</td>
<td style="vertical-align:bottom;padding-bottom:8px;padding-left:16px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:8px;height:8px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:8px;font-size:13px;font-weight:600;color:${color};">${band}</td>
</tr></table></td>
</tr></table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">
A score of ${score} in the <strong style="color:${navy};font-weight:600;">${band}</strong> band means your income structure ${score >= 50 ? "has a functional foundation but carries specific vulnerabilities" : "is exposed to structural disruption in ways that may not be visible day to day"}. ${industry ? `For professionals in ${industry}, this is a common pattern` : "This is a common pattern"} \u2014 and it is addressable.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">
Your primary constraint is <strong style="color:${navy};font-weight:600;">${(constraint || "").toLowerCase()}</strong>. This is the single structural factor holding your score where it is. Addressing it changes the trajectory of your entire income architecture.</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">See the full picture</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">The diagnostic reveals every dimension of your income structure, maps your specific risks, and gives you a step-by-step plan to improve your score.</p>
${nurtureCta("See Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr></table>`;

  return { subject: `${name}, here\u2019s what your ${score} means`, html: nurtureEmailWrapper(body, name) };
}

function buildNurtureEmail2({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const constraintActions = {
    "Income Concentration": "Begin converting one existing client relationship into a retainer or standing agreement. Even a partial shift \u2014 moving 15\u201320% of project-based work into a recurring arrangement \u2014 changes how your income behaves under pressure.",
    "Forward Visibility": "Propose a 3-month or 6-month engagement framework to your most consistent revenue source. The goal is not to lock in every dollar \u2014 it is to extend the horizon of income you can see ahead of you.",
    "Labor Dependence": "Identify one deliverable you currently produce manually and package it as a repeatable, scalable offering. A productized service, a template library, a licensing arrangement \u2014 something that generates revenue without requiring your direct time.",
    "Low Recurrence": "Convert your most reliable one-time engagements into recurring structures. A retainer, a maintenance contract, a subscription-based access model. The structural shift matters more than the dollar amount.",
    "Source Diversification": "Open a second revenue channel that does not depend on your primary source. This does not mean working more hours \u2014 it means distributing income risk across independent relationships.",
    "Earnings Variability": "Introduce a floor into your income structure. A minimum monthly retainer, a base-rate agreement, or a prepaid package that guarantees a threshold regardless of project volume.",
    "Structural Durability": "Strengthen the agreements underpinning your income. Move from verbal commitments to documented terms. Extend contract durations where possible.",
    "Income Continuity": "Build a buffer of income that continues if you stop active work for 30 days. This could be deferred revenue, a licensing stream, or pre-sold capacity that does not require your presence to deliver.",
  };

  const action = constraintActions[constraint] || `Focus on addressing ${(constraint || "").toLowerCase()} \u2014 this is the single highest-leverage structural change available to you.`;

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">The single structural move for ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Based on your score of ${score} and your primary constraint.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:20px 24px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">YOUR PRIMARY CONSTRAINT</p>
<p style="font-size:18px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 16px;">${action}</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">${industry ? `In ${industry}, this type of structural adjustment typically produces measurable score improvement within 60\u201390 days.` : "This type of structural adjustment typically produces measurable score improvement within 60\u201390 days."} The full diagnostic includes the complete action plan \u2014 with specific targets, timelines, and ready-to-use negotiation scripts.</p>
</td></tr></table>
${nurtureCta("See Your Full Action Plan", "https://peoplestar.com/RunPayway/pricing")}`;

  return { subject: `The single structural move for ${name}`, html: nurtureEmailWrapper(body, name) };
}

function buildNurtureEmail3({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const color = nurtureBandColor(score);
  const displayIndustry = industry || "your sector";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">Income patterns in ${displayIndustry}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Where most professionals in your industry score \u2014 and what separates the top from the rest.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">INDUSTRY BASELINE</p>
<p style="font-size:16px;font-weight:500;color:${navy};margin:0 0 16px;">${displayIndustry}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="50%" style="vertical-align:top;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">YOUR SCORE</p>
<p style="font-size:28px;font-weight:200;color:${navy};margin:0;font-family:'Georgia',serif;">${score}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;"><tr>
<td style="width:6px;height:6px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:6px;font-size:12px;font-weight:600;color:${color};">${band}</td>
</tr></table></td>
<td width="50%" style="vertical-align:top;border-left:1px solid rgba(14,26,43,0.06);padding-left:16px;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">PRIMARY CONSTRAINT</p>
<p style="font-size:14px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td></tr></table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals in ${displayIndustry} operate in the Developing to Established range. The most common constraints are forward visibility and income concentration \u2014 structural patterns that are endemic to the industry, not individual failures.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">What distinguishes the top quartile is not earning more \u2014 it is how income is structured. Retainer-based arrangements, diversified client relationships, and contracted forward visibility create scores that hold up under disruption.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">Your score of ${score} reflects your specific position within these patterns. The full diagnostic maps exactly where you stand relative to industry benchmarks and gives you the structural moves to improve.</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">Your full diagnostic is ready to generate</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">Personalized action plan, risk scenarios, 12-week roadmap with your actual numbers, and ready-to-use negotiation scripts. Full refund if it does not reveal something new.</p>
${nurtureCta("Unlock Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr></table>`;

  return { subject: `Income patterns in ${displayIndustry}`, html: nurtureEmailWrapper(body, name) };
}

function followUpDay90(name, daysSince, _recordId, industry) {
  const prompts = getReassessmentPrompts(industry);
  // Build industry-specific examples for the "structural changes" line
  const examplesMap = {
    real_estate: "added a property management contract, diversified your listing sources, or built rental portfolio income",
    consulting_professional_services: "converted a project client to a retainer, added a new industry vertical, or launched a productized service",
    technology: "added maintenance contracts, launched a SaaS offering, or onboarded clients in a new tech stack",
    healthcare: "enrolled patients in a membership program, added a new payer type, or hired an associate provider",
    legal_services: "converted hourly clients to retainers, expanded into a new practice area, or engaged contract attorneys",
    finance_banking: "converted commission clients to fee-based accounts, diversified your AUM across households, or hired a paraplanner",
    insurance: "grown your renewal book, diversified your carrier placements, or added sub-producers to your team",
    sales_brokerage: "established residual commission arrangements, expanded into new markets, or added junior reps",
    creative_media: "signed retainer-based brand deals, launched a membership program, or licensed your content",
    construction_trades: "added maintenance contracts, diversified your GC relationships, or developed independent crew leaders",
    education_training: "launched subscription courses, added new institutional clients, or created asynchronous content",
    retail_ecommerce: "added subscription offerings, opened new sales channels, or automated your fulfillment",
    hospitality: "secured standing accounts, launched a membership program, or booked recurring event contracts",
    transportation: "converted spot lanes to standing contracts, diversified your shipper base, or added capacity",
    manufacturing: "secured blanket orders, diversified your customer base, or reduced skill bottlenecks",
    nonprofit: "added multi-year grants, grown your monthly donor base, or launched earned revenue programs",
    agriculture: "added CSA subscriptions, forward-priced your harvest, or diversified into value-added products",
    energy: "added maintenance contracts, diversified your project pipeline, or expanded your service territory",
    fitness_wellness: "added monthly memberships, launched digital products, or booked corporate wellness contracts",
    default: "signed a retainer, added a new client, or built a recurring income stream",
  };
  const industryKey = industry ? industry.toLowerCase().replace(/[\s\/&]+/g, "_").replace(/[^a-z0-9_]/g, "") : "";
  const examples = examplesMap[industryKey] || "signed a retainer, added a client, or built a recurring stream";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">It has been ${daysSince} days.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 16px;">If you have made structural changes to your income \u2014 ${examples} \u2014 your score may have improved. There is only one way to find out.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">A new assessment will show you exactly how much progress you have made and where to focus next.</p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#1C1635;border-radius:10px;">
<a href="https://peoplestar.com/RunPayway/pricing" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Reassess Your Score</a>
</td></tr></table>
<div style="border-left:3px solid #1F6D7A;padding:16px 20px;background:rgba(31,109,122,0.04);border-radius:0 8px 8px 0;margin-top:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#1F6D7A;margin-bottom:8px;">ASK YOURSELF</div>
<div style="font-size:13px;color:rgba(14,26,43,0.55);line-height:1.6;margin-bottom:10px;">${prompts.recurrence}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.55);line-height:1.6;margin-bottom:10px;">${prompts.diversification}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.55);line-height:1.6;">${prompts.labor}</div>
</div>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}
