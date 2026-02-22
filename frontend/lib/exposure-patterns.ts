/**
 * Exposure pattern data for the ExposurePatternViewer.
 *
 * CONTENT SAFETY RULES:
 * - Patterns must never imply a fix or suggest action
 * - Must never say "you have this"
 * - Must never give step-by-step action
 * - Allowed verbs: tends to, often, may, typically, can, reflects, indicates, suggests
 * - Forbidden verbs: do, implement, change, switch, optimize, increase, decrease, add, remove, improve, fix
 */

export interface ExposurePattern {
  name: string;
  reflects: string;
  surfaces: string[];
  clarifies: string;
}

/**
 * Generic patterns shown when calibration is not set
 * or as fallback for unmapped combinations.
 */
export const GENERIC_PATTERNS: ExposurePattern[] = [
  {
    name: "Operator Continuity Gap",
    reflects:
      "Income flow typically reflects a dependency on the primary operator\u2019s ongoing availability and direct attention.",
    surfaces: [
      "Revenue tends to decline during periods of operator absence",
      "Client retention often depends on personal relationship maintenance",
      "Delegation may result in perceived quality reduction",
    ],
    clarifies:
      "The diagnostic measures the specific degree to which income depends on direct involvement versus structural mechanisms.",
  },
  {
    name: "Concentration Exposure",
    reflects:
      "Revenue often concentrates around a limited number of clients or accounts, creating single-point-of-failure sensitivity.",
    surfaces: [
      "A small number of relationships typically represent a disproportionate share of income",
      "Loss of a key client can cause measurable revenue disruption",
      "Acquisition of new revenue may depend on personal outreach",
    ],
    clarifies:
      "The diagnostic quantifies concentration risk and its structural impact on the Payway Rating.",
  },
  {
    name: "Contractual Fragility",
    reflects:
      "Income may operate under informal or short-term arrangements that can be disrupted with limited notice.",
    surfaces: [
      "Revenue cycles typically require active renegotiation or reconfirmation",
      "Enforcement mechanisms may be limited or non-existent",
      "Income predictability can fluctuate based on agreement stability",
    ],
    clarifies:
      "The diagnostic evaluates contractual structure as a component of overall revenue resilience.",
  },
  {
    name: "Scalability Ceiling",
    reflects:
      "Revenue generation capacity often reflects the personal throughput limits of the primary operator.",
    surfaces: [
      "Income growth tends to plateau at the operator\u2019s delivery capacity",
      "Demand increases may not translate to proportional revenue increases",
      "Process systematization typically remains limited",
    ],
    clarifies:
      "The diagnostic identifies whether revenue mechanisms can sustain income independently of personal effort.",
  },
];

/**
 * Revenue-model-specific patterns. These are shown when calibration is complete.
 * Keyed by REVENUE_MODEL value.
 */
export const MODEL_PATTERNS: Record<string, ExposurePattern[]> = {
  TRANSACTIONAL: [
    {
      name: "Per-Transaction Dependency",
      reflects:
        "Income typically reflects a direct link between individual transactions and personal effort. Each unit of revenue often requires a specific action.",
      surfaces: [
        "Revenue tends to stop when transaction activity pauses",
        "Income volume often correlates directly with hours or engagements",
        "Scaling typically requires proportional increases in personal capacity",
      ],
      clarifies:
        "The diagnostic measures how much of your revenue depends on per-transaction effort versus structural mechanisms.",
    },
    {
      name: "Pipeline Volatility",
      reflects:
        "Revenue flow may be subject to demand cycles that depend on continuous personal pipeline development.",
      surfaces: [
        "Income predictability can fluctuate with market conditions",
        "Client acquisition often depends on direct outreach",
        "Revenue gaps may appear between engagement cycles",
      ],
      clarifies:
        "The diagnostic quantifies pipeline dependency as a component of structural exposure.",
    },
    GENERIC_PATTERNS[1],
    GENERIC_PATTERNS[2],
  ],
  COMMISSION: [
    {
      name: "Sales Activity Dependency",
      reflects:
        "Revenue typically reflects ongoing personal sales activity. Income tends to correlate with individual closing capacity.",
      surfaces: [
        "Commission income often pauses when sales activity stops",
        "Earnings may concentrate around personal relationship networks",
        "Revenue predictability can fluctuate with pipeline health",
      ],
      clarifies:
        "The diagnostic measures the structural balance between personal sales effort and systematized revenue.",
    },
    {
      name: "Relationship Concentration",
      reflects:
        "Revenue may concentrate around key accounts or territories that depend on personal relationship maintenance.",
      surfaces: [
        "Account retention often requires direct attention from the producer",
        "Transition of accounts to others may result in revenue leakage",
        "Referral networks typically depend on personal cultivation",
      ],
      clarifies:
        "The diagnostic evaluates concentration patterns and their structural impact.",
    },
    GENERIC_PATTERNS[0],
    GENERIC_PATTERNS[3],
  ],
  RETAINER_SUBSCRIPTION: [
    {
      name: "Renewal Dependency",
      reflects:
        "Revenue may appear structurally supported by recurring arrangements while remaining dependent on active renewal management.",
      surfaces: [
        "Retention rates often depend on personal service quality",
        "Churn risk can increase when the primary operator disengages",
        "Revenue continuity may mask underlying relationship dependencies",
      ],
      clarifies:
        "The diagnostic distinguishes between genuinely structural recurring revenue and attention-dependent retention.",
    },
    {
      name: "Service Delivery Ceiling",
      reflects:
        "Subscription or retainer models may reach delivery capacity limits tied to operator involvement.",
      surfaces: [
        "Client satisfaction often correlates with personal attention levels",
        "Scaling the client base may require proportional operator effort",
        "Fulfillment quality can decline when capacity is stretched",
      ],
      clarifies:
        "The diagnostic measures whether delivery can scale independently of the primary operator.",
    },
    GENERIC_PATTERNS[1],
    GENERIC_PATTERNS[2],
  ],
};

export function getPatternsForCalibration(revenueModel: string): ExposurePattern[] {
  return MODEL_PATTERNS[revenueModel] ?? GENERIC_PATTERNS;
}
