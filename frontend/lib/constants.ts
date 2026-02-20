// ── API Configuration ────────────────────────────────────────────────────────

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

// ── Calibration Options ─────────────────────────────────────────────────────

export const INDUSTRIES = [
  { value: "TECH_SAAS", label: "Technology / SaaS" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "FINANCIAL_SERVICES", label: "Financial Services" },
  { value: "LEGAL_SERVICES", label: "Legal Services" },
  { value: "HEALTHCARE_SERVICES", label: "Healthcare Services" },
  { value: "HOME_FIELD_SERVICES", label: "Home & Field Services" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "RETAIL_ECOMMERCE", label: "Retail / E-Commerce" },
  { value: "MEDIA_CONTENT", label: "Media & Content" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "EDUCATION_TRAINING", label: "Education & Training" },
  { value: "PROFESSIONAL_SERVICES", label: "Professional Services" },
] as const;

export const REVENUE_MODELS = [
  { value: "TRANSACTIONAL", label: "Transactional" },
  { value: "COMMISSION", label: "Commission-Based" },
  { value: "PROJECT_FIXED", label: "Project / Fixed-Fee" },
  { value: "CONTRACT_FIXED", label: "Contract / Fixed-Term" },
  { value: "RETAINER_SUBSCRIPTION", label: "Retainer / Subscription" },
  { value: "USAGE_BASED", label: "Usage-Based" },
  { value: "LICENSING_ROYALTY", label: "Licensing / Royalty" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ASSET_LEASE", label: "Asset / Lease" },
] as const;

export const ROLES = [
  { value: "OWNER", label: "Owner / Founder" },
  { value: "MANAGING_PARTNER", label: "Managing Partner" },
  { value: "LICENSED_AGENT", label: "Licensed Agent / Broker" },
  { value: "CONSULTANT", label: "Consultant / Advisor" },
  { value: "SALES_PRODUCER", label: "Sales Producer" },
  { value: "EXEC_OPERATOR", label: "Executive Operator" },
  { value: "DELIVERY_SPECIALIST", label: "Delivery Specialist" },
  { value: "CREATOR", label: "Creator / Independent" },
  { value: "FRANCHISE_OPERATOR", label: "Franchise Operator" },
  { value: "PASSIVE_OWNER", label: "Passive Owner / Investor" },
] as const;

// ── Diagnostic Questions (Phase 3 — LOCKED) ────────────────────────────────

export interface QuestionOption {
  letter: "A" | "B" | "C" | "D";
  text: string;
}

export interface DiagnosticQuestion {
  id: number;
  group: "core" | "modifier" | "stability";
  groupLabel: string;
  text: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
}

export const QUESTIONS: DiagnosticQuestion[] = [
  // ── Core Revenue Flow (Q1–Q4) ──────────────────────────────────────────
  {
    id: 1,
    group: "core",
    groupLabel: "Core Revenue Flow",
    text: "How does your primary income arrive?",
    options: [
      { letter: "A", text: "Entirely from direct, per-transaction effort (each dollar requires a specific action)" },
      { letter: "B", text: "Mostly from direct effort, but some revenue is somewhat routine" },
      { letter: "C", text: "A significant share comes through contracts or recurring arrangements" },
      { letter: "D", text: "Most income arrives through structured, recurring, or passive mechanisms" },
    ],
  },
  {
    id: 2,
    group: "core",
    groupLabel: "Core Revenue Flow",
    text: "If you stopped all direct selling or outreach for 90 days, what would happen to your revenue?",
    options: [
      { letter: "A", text: "Revenue would drop to near zero almost immediately" },
      { letter: "B", text: "Revenue would decline significantly within the first month" },
      { letter: "C", text: "Revenue would decline moderately, but some would continue from existing arrangements" },
      { letter: "D", text: "Revenue would largely continue, sustained by existing contracts, subscriptions, or assets" },
    ],
  },
  {
    id: 3,
    group: "core",
    groupLabel: "Core Revenue Flow",
    text: "How dependent is your revenue on renewing or re-signing existing agreements?",
    options: [
      { letter: "A", text: "Almost all revenue depends on active renewal or re-engagement each cycle" },
      { letter: "B", text: "A majority of revenue requires periodic renewal or renegotiation" },
      { letter: "C", text: "Some revenue renews automatically; the rest requires active management" },
      { letter: "D", text: "Most revenue is structurally recurring and does not depend on manual renewal" },
    ],
  },
  {
    id: 4,
    group: "core",
    groupLabel: "Core Revenue Flow",
    text: "What is the primary mechanism that generates your income?",
    options: [
      { letter: "A", text: "Personal service delivery, billing by the hour or task" },
      { letter: "B", text: "A mix of personal delivery and some systematized processes" },
      { letter: "C", text: "Defined products, packages, or service tiers with structured pricing" },
      { letter: "D", text: "Systems, platforms, or assets that produce revenue with minimal direct involvement" },
    ],
  },

  // ── Modifiers (Q5–Q8) ─────────────────────────────────────────────────
  {
    id: 5,
    group: "modifier",
    groupLabel: "Modifiers",
    text: "How concentrated is your revenue among your top clients or accounts?",
    options: [
      { letter: "A", text: "One client or account represents the majority of revenue" },
      { letter: "B", text: "Two to three clients represent most of the revenue" },
      { letter: "C", text: "Revenue is spread across several clients, but some concentration exists" },
      { letter: "D", text: "Revenue is broadly diversified across many clients, products, or channels" },
    ],
  },
  {
    id: 6,
    group: "modifier",
    groupLabel: "Modifiers",
    text: "How do you acquire new revenue or clients?",
    options: [
      { letter: "A", text: "Almost entirely through personal outreach, referrals, or networking" },
      { letter: "B", text: "Primarily through personal effort, with some inbound or repeat business" },
      { letter: "C", text: "A mix of personal effort and systematic channels (marketing, partnerships)" },
      { letter: "D", text: "Primarily through structured channels, inbound systems, or platform-driven acquisition" },
    ],
  },
  {
    id: 7,
    group: "modifier",
    groupLabel: "Modifiers",
    text: "How would you describe the contractual structure of your revenue?",
    options: [
      { letter: "A", text: "No formal contracts; revenue is based on informal agreements or ad hoc transactions" },
      { letter: "B", text: "Some contracts exist, but most are short-term or easily terminated" },
      { letter: "C", text: "A mix of short- and medium-term contracts with some structural protection" },
      { letter: "D", text: "Primarily long-term contracts, subscriptions, or legally structured recurring revenue" },
    ],
  },
  {
    id: 8,
    group: "modifier",
    groupLabel: "Modifiers",
    text: "What is your direct role in delivering the product or service that generates revenue?",
    options: [
      { letter: "A", text: "I personally perform or deliver everything" },
      { letter: "B", text: "I perform most of the work, with limited support from others" },
      { letter: "C", text: "I oversee delivery, but a team or system handles much of the execution" },
      { letter: "D", text: "Delivery is fully systematized or delegated; my involvement is minimal" },
    ],
  },

  // ── Stability Indicators (Q9–Q12) ─────────────────────────────────────
  {
    id: 9,
    group: "stability",
    groupLabel: "Stability Indicators",
    text: "How predictable is your income from month to month?",
    options: [
      { letter: "A", text: "Highly unpredictable — income varies significantly each month" },
      { letter: "B", text: "Somewhat unpredictable — there is a rough baseline but notable fluctuation" },
      { letter: "C", text: "Moderately predictable — most income is stable with some variability" },
      { letter: "D", text: "Highly predictable — income is consistent and structurally stable" },
    ],
  },
  {
    id: 10,
    group: "stability",
    groupLabel: "Stability Indicators",
    text: "Over the past 12 months, has your income structure become more or less dependent on your direct involvement?",
    options: [
      { letter: "A", text: "It has become significantly more dependent on my direct involvement" },
      { letter: "B", text: "It has stayed about the same, with direct involvement still dominant" },
      { letter: "C", text: "It has shifted slightly toward more structural or recurring support" },
      { letter: "D", text: "It has become noticeably less dependent on my direct involvement" },
    ],
  },
  {
    id: 11,
    group: "stability",
    groupLabel: "Stability Indicators",
    text: "If you lost your single largest client or income source tomorrow, how would your total revenue be affected?",
    options: [
      { letter: "A", text: "It would be devastating — that source represents the majority of my income" },
      { letter: "B", text: "It would be a serious blow, but some income would continue" },
      { letter: "C", text: "It would be noticeable, but the majority of income would be unaffected" },
      { letter: "D", text: "It would have minimal impact — no single source dominates" },
    ],
  },
  {
    id: 12,
    group: "stability",
    groupLabel: "Stability Indicators",
    text: "How would you describe the long-term trajectory of your revenue structure?",
    options: [
      { letter: "A", text: "Revenue has become more fragmented and harder to sustain without constant effort" },
      { letter: "B", text: "Revenue structure has remained largely unchanged" },
      { letter: "C", text: "Revenue is gradually shifting toward more structured or recurring patterns" },
      { letter: "D", text: "Revenue is firmly moving toward structural independence and recurring models" },
    ],
  },
];

// ── Rating Bands ────────────────────────────────────────────────────────────

export const RATING_BANDS = [
  {
    min: 80,
    max: 100,
    key: "structurally_supported",
    label: "Structurally Supported",
    color: "emerald",
  },
  {
    min: 60,
    max: 79,
    key: "mixed_structural_support",
    label: "Mixed Structural Support",
    color: "blue",
  },
  {
    min: 40,
    max: 59,
    key: "attention_weighted",
    label: "Attention-Weighted",
    color: "amber",
  },
  {
    min: 0,
    max: 39,
    key: "attention_dependent",
    label: "Attention-Dependent",
    color: "red",
  },
] as const;
