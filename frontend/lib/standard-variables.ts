export interface StructuralVariable {
  slug: string;
  name: string;
  domainIndex: number;
  domainLabel: string;
  description: string;
  whyItMatters: string[];
  structureSupported: string[];
  directInvolvement: string[];
  reassessmentTrigger: string;
}

export interface VariableDomain {
  numeral: string;
  label: string;
  variables: StructuralVariable[];
}

export const VARIABLE_DOMAINS: VariableDomain[] = [
  {
    numeral: "I",
    label: "Revenue Initiation Architecture",
    variables: [
      {
        slug: "acquisition-mechanism",
        name: "Acquisition Mechanism",
        domainIndex: 1,
        domainLabel: "Revenue Initiation Architecture",
        description:
          "The primary method through which new revenue enters the business. Indicates whether income generation depends on direct personal effort or systematic channels.",
        whyItMatters: [
          "Determines how vulnerable revenue initiation is to personal availability",
          "Reflects whether growth can occur without proportional increases in direct effort",
        ],
        structureSupported: [
          "Inbound systems generate leads independently of personal outreach",
          "Platform-driven acquisition channels operate continuously",
          "Marketing infrastructure produces measurable, repeatable results",
        ],
        directInvolvement: [
          "Revenue initiation depends on personal networking and referral cultivation",
          "Each new engagement requires individual outreach or relationship activation",
          "Pipeline development pauses when the individual is unavailable",
        ],
        reassessmentTrigger:
          "Reassess when the balance between inbound and outbound acquisition shifts meaningfully.",
      },
      {
        slug: "revenue-generation-method",
        name: "Revenue Generation Method",
        domainIndex: 1,
        domainLabel: "Revenue Initiation Architecture",
        description:
          "The core mechanism that converts activity into income. Reflects whether revenue is tied to personal delivery or to systematized processes.",
        whyItMatters: [
          "Indicates the scalability ceiling of the current income model",
          "Reveals whether income generation can persist without direct involvement",
        ],
        structureSupported: [
          "Products, platforms, or assets generate revenue with minimal per-transaction effort",
          "Defined service tiers with structured pricing reduce dependency on custom delivery",
          "Automated fulfillment handles conversion independently",
        ],
        directInvolvement: [
          "Revenue requires personal service delivery for each engagement",
          "Billing is tied to hours worked or tasks completed individually",
          "Income stops when personal delivery capacity is reached",
        ],
        reassessmentTrigger:
          "Reassess when the primary revenue generation method changes or a new delivery model is introduced.",
      },
    ],
  },
  {
    numeral: "II",
    label: "Revenue Fulfillment Architecture",
    variables: [
      {
        slug: "delivery-dependency",
        name: "Delivery Dependency",
        domainIndex: 2,
        domainLabel: "Revenue Fulfillment Architecture",
        description:
          "The extent to which revenue fulfillment depends on the direct personal involvement of the primary operator.",
        whyItMatters: [
          "Directly affects income continuity during absence or capacity constraints",
          "Determines whether the business can fulfill obligations without the founder or operator",
        ],
        structureSupported: [
          "Delivery is systematized through documented processes and team execution",
          "Fulfillment continues without the primary operator present",
          "Quality standards are maintained through systems, not personal oversight",
        ],
        directInvolvement: [
          "The primary operator personally performs or oversees all delivery",
          "Client satisfaction depends on the individual\u2019s direct involvement",
          "Delegation is limited or results in perceived quality reduction",
        ],
        reassessmentTrigger:
          "Reassess when delivery responsibility shifts between the operator and a team or system.",
      },
    ],
  },
  {
    numeral: "III",
    label: "Revenue Enforcement Reliability",
    variables: [
      {
        slug: "contractual-structure",
        name: "Contractual Structure",
        domainIndex: 3,
        domainLabel: "Revenue Enforcement Reliability",
        description:
          "The formality and enforceability of agreements governing revenue. Reflects whether income is protected by defined terms or operates on informal arrangements.",
        whyItMatters: [
          "Determines how protected revenue is against unilateral termination",
          "Indicates the predictability of future income streams",
          "Affects the resilience of revenue under external disruption",
        ],
        structureSupported: [
          "Long-term contracts with defined terms provide structural protection",
          "Recurring agreements auto-renew without manual renegotiation",
          "Subscription models create enforceable, predictable revenue flows",
        ],
        directInvolvement: [
          "Revenue operates on per-transaction or verbal agreements",
          "Engagements can be terminated with minimal notice",
          "Each revenue cycle requires active renegotiation or reconfirmation",
        ],
        reassessmentTrigger:
          "Reassess when the contract mix shifts significantly toward or away from long-term agreements.",
      },
    ],
  },
  {
    numeral: "IV",
    label: "Revenue Concentration Structure",
    variables: [
      {
        slug: "client-concentration",
        name: "Client Concentration",
        domainIndex: 4,
        domainLabel: "Revenue Concentration Structure",
        description:
          "The degree to which revenue is concentrated among a small number of clients or accounts. A measure of single-point-of-failure exposure.",
        whyItMatters: [
          "High concentration increases the impact of any single client departure",
          "Reflects the structural resilience of the revenue base",
        ],
        structureSupported: [
          "Revenue is distributed across many clients, products, or channels",
          "No single source dominates the income base",
          "Client turnover has limited impact on total revenue",
        ],
        directInvolvement: [
          "A small number of clients represent the majority of income",
          "Loss of one relationship can cause substantial revenue decline",
          "Revenue stability depends on maintaining specific relationships",
        ],
        reassessmentTrigger:
          "Reassess when the top client\u2019s share of total revenue changes by more than 15 percentage points.",
      },
    ],
  },
  {
    numeral: "V",
    label: "Operational Transferability",
    variables: [
      {
        slug: "process-delegation",
        name: "Process Delegation",
        domainIndex: 5,
        domainLabel: "Operational Transferability",
        description:
          "The degree to which revenue-generating processes can be transferred to other individuals or systems without loss of quality or continuity.",
        whyItMatters: [
          "Indicates whether the business can operate independently of the founder",
          "Reflects the maturity of operational documentation and team capability",
        ],
        structureSupported: [
          "Processes are documented, repeatable, and executable by trained team members",
          "Delegation occurs without meaningful quality degradation",
          "Operational knowledge is institutionalized, not personal",
        ],
        directInvolvement: [
          "Critical processes exist only in the operator\u2019s knowledge",
          "Delegation attempts result in quality or consistency issues",
          "The operator is the single point of competence for key functions",
        ],
        reassessmentTrigger:
          "Reassess when a meaningful portion of delivery is successfully transferred to another individual or system.",
      },
    ],
  },
  {
    numeral: "VI",
    label: "Continuity Under Absence",
    variables: [
      {
        slug: "absence-resilience",
        name: "Absence Resilience",
        domainIndex: 6,
        domainLabel: "Continuity Under Absence",
        description:
          "The capacity of revenue to continue flowing during periods when the primary operator is absent, unavailable, or deliberately disengaged.",
        whyItMatters: [
          "The most direct test of structural dependency",
          "Reveals whether income is attached to a person or to a system",
          "Indicates the practical continuity ceiling of the current model",
        ],
        structureSupported: [
          "Revenue continues during extended absence with minimal decline",
          "Existing contracts, subscriptions, or assets sustain income independently",
          "The business demonstrates operational continuity without the founder",
        ],
        directInvolvement: [
          "Revenue declines rapidly when the operator steps away",
          "Client relationships require personal maintenance to avoid attrition",
          "Income generation pauses entirely during absence",
        ],
        reassessmentTrigger:
          "Reassess after any period of extended absence that tests actual revenue continuity.",
      },
    ],
  },
];

export const ALL_VARIABLES: StructuralVariable[] = VARIABLE_DOMAINS.flatMap(
  (d) => d.variables
);

export function getVariableBySlug(
  slug: string
): StructuralVariable | undefined {
  return ALL_VARIABLES.find((v) => v.slug === slug);
}
