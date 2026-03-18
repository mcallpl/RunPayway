// sectors.ts — Sector-specific data for the RunPayway Refined Diagnostic System
// Model RP-1.0 | 19 industry sectors

export interface SectorData {
  evolution_path_key: string;
  evolution_path_title: string;
  evolution_path_steps: string[];
  sector_stability_mechanisms: string[];
  peer_benchmark_group_key: string;
  peer_benchmark_group_label: string;
  peer_benchmark_text: string;
  improvement_guidance: string;
  avg_score: number;
  top_20_threshold: number;
  peer_band_distribution: {
    limited: number;
    developing: number;
    established: number;
    high: number;
  };
  constraint_guidance: Record<string, string>;
  action_plan: Record<string, string[]>;
}

/* ------------------------------------------------------------------ */
/* PROFILE-AWARE ACTION FILTERING                                      */
/* ------------------------------------------------------------------ */

/*
 * Profiles that already demonstrate a structural characteristic
 * should not receive advice to build what they already have.
 *
 * This map identifies which (constraint, profile_signal) combinations
 * make the default action #1 redundant, and provides an advanced
 * replacement action appropriate for someone already at that stage.
 */

interface ActionOverride {
  /** Profile field to check */
  field: "revenue_structure" | "primary_income_model";
  /** Values that indicate the user already has this structural element */
  values: string[];
  /** Replacement action for users who already have it */
  advanced_action: string;
}

const ACTION_OVERRIDES: Record<string, ActionOverride[]> = {
  recurring_income_proportion: [
    {
      field: "revenue_structure",
      values: ["Monthly Recurring Payments", "Long-Term Recurring Income", "Contracted Multi-Month Revenue"],
      advanced_action: "Structures that convert one-time engagements into retainer or subscription arrangements tend to show increased recurring revenue proportion.",
    },
    {
      field: "primary_income_model",
      values: ["Subscription / Retainer Services", "Licensing / Royalty Income"],
      advanced_action: "Income systems that add additional subscription tiers or licensing channels tend to demonstrate expanded recurring revenue bases.",
    },
  ],
  income_continuity_without_active_labor: [
    {
      field: "primary_income_model",
      values: ["Licensing / Royalty Income", "Investment / Dividend Income", "Real Estate Rental Income"],
      advanced_action: "Structures that include additional assets, licenses, or investment positions generating income independently tend to show scaled passive income.",
    },
    {
      field: "revenue_structure",
      values: ["Long-Term Recurring Income"],
      advanced_action: "Structures with extended contract durations on recurring agreements tend to show reduced renewal risk and increased continuity coverage.",
    },
  ],
  forward_revenue_visibility: [
    {
      field: "revenue_structure",
      values: ["Contracted Multi-Month Revenue", "Long-Term Recurring Income"],
      advanced_action: "Structures with longer contract terms on renewals tend to exhibit extended forward visibility beyond the current commitment period.",
    },
  ],
  income_concentration: [
    {
      field: "primary_income_model",
      values: ["Hybrid Multiple Income Sources"],
      advanced_action: "Income systems where no single source exceeds 40% of total revenue tend to demonstrate more balanced concentration profiles.",
    },
  ],
  number_of_income_sources: [
    {
      field: "primary_income_model",
      values: ["Hybrid Multiple Income Sources"],
      advanced_action: "Structures that include an additional qualifying income source from a different revenue category tend to show stronger diversification.",
    },
  ],
  earnings_variability: [
    {
      field: "revenue_structure",
      values: ["Monthly Recurring Payments", "Long-Term Recurring Income"],
      advanced_action: "Structures where a larger share of variable income flows through recurring arrangements tend to show reduced month-to-month fluctuation.",
    },
  ],
};

/**
 * Filters the default action plan based on the user's profile.
 * If the user's profile indicates they already have the structural
 * element that action #1 recommends, it swaps in an advanced action.
 */
export function filterActionPlan(
  actions: string[],
  constraintKey: string,
  profile: { primary_income_model: string; revenue_structure: string }
): string[] {
  if (actions.length === 0) return actions;

  const overrides = ACTION_OVERRIDES[constraintKey] || [];
  const filtered = [...actions];

  for (const override of overrides) {
    const profileValue = profile[override.field];
    if (override.values.includes(profileValue)) {
      // Replace the first action with the advanced version
      filtered[0] = override.advanced_action;
      break; // Only apply one override
    }
  }

  return filtered;
}

export const SECTOR_DATA: Record<string, SectorData> = {
  real_estate: {
    evolution_path_key: "real_estate",
    evolution_path_title: "Real Estate Income Evolution",
    evolution_path_steps: [
      "Commission Transactions",
      "Client Portfolio",
      "Team Brokerage",
      "Property Ownership",
      "Recurring Asset Income",
    ],
    sector_stability_mechanisms: [
      "property management income",
      "leasing revenue",
      "real estate investment holdings",
      "brokerage team structures",
      "real estate education programs",
    ],
    peer_benchmark_group_key: "real_estate",
    peer_benchmark_group_label: "Real Estate Professionals",
    peer_benchmark_text:
      "Compared to other real estate professionals at a similar stage.",
    improvement_guidance:
      "Profiles that transition from commission-based transactions toward recurring property management and leasing revenue tend to show stronger resilience. Income systems that include a referral-generating client portfolio independent of active deal flow demonstrate greater stability. Structures with real estate investment holdings that produce passive rental income tend to exhibit higher scores.",
    avg_score: 42,
    top_20_threshold: 62,
    peer_band_distribution: { limited: 28, developing: 36, established: 25, high: 11 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Commission-based transactions stop immediately when active deal-making pauses — income systems that include property management or leasing tend to show greater continuity.",
      recurring_income_proportion: "Most real estate income is one-time commissions — profiles with retainer-based advisory or property management fees tend to exhibit stronger recurring revenue.",
      forward_revenue_visibility: "Real estate transactions are unpredictable — structures that include listing agreements or management contracts tend to demonstrate extended revenue visibility.",
      income_concentration: "Depending on a few large deals creates concentration risk — broader distribution across property types, client segments, or geographic markets tends to reduce exposure.",
      number_of_income_sources: "A single brokerage or transaction pipeline limits stability — profiles that include multiple income streams like referral networks, training, or investment income tend to show greater resilience.",
      earnings_variability: "Real estate income naturally fluctuates with market cycles — recurring management fees or retainer structures tend to smooth out monthly variation.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Income systems that include multiple property management contracts tend to establish baseline monthly recurring revenue.",
        "Structures with referral partnership programs across complementary service providers tend to show greater income continuity.",
        "Profiles that include investment property or rental units tend to demonstrate passive monthly income independent of active transactions.",
      ],
      recurring_income_proportion: [
        "Structures that convert project-based client relationships to retainer arrangements tend to show increased recurring revenue.",
        "Income systems that include subscription-based market update services tend to exhibit more predictable revenue from past client relationships.",
        "Profiles with tenant placement services and recurring landlord management fees tend to demonstrate stronger recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures that include multi-month exclusive listing agreements tend to show extended forward revenue visibility.",
        "Income systems with pre-sold seasonal consultation packages tend to demonstrate committed forward pipeline.",
        "Profiles with property management contracts featuring extended minimum terms tend to exhibit locked-in forward revenue.",
      ],
      income_concentration: [
        "Structures that include commercial or multi-family specialties alongside residential tend to show reduced commission concentration.",
        "Profiles with referral relationships across multiple geographic markets tend to demonstrate broader revenue distribution.",
        "Income systems that include co-branded services with complementary providers tend to exhibit diversified secondary revenue.",
      ],
      number_of_income_sources: [
        "Income systems that include real estate investment education offerings tend to show separate ticket and course revenue streams.",
        "Profiles with content channels monetized through sponsorships or advertising tend to demonstrate additional income sources.",
        "Structures that include home staging consultation as a separate fee-based service tend to exhibit stronger diversification.",
      ],
      earnings_variability: [
        "Profiles that maintain reserve funds covering multiple months of operating expenses tend to show greater resilience during income gaps.",
        "Structures with commission splits that include a monthly draw against future closings tend to demonstrate reduced variability.",
        "Income systems that include property management clients tend to establish a predictable monthly income floor.",
      ],
    },
  },

  finance_banking: {
    evolution_path_key: "finance_banking",
    evolution_path_title: "Finance / Banking Income Evolution",
    evolution_path_steps: [
      "Transactional Advisory",
      "Client Book Development",
      "Portfolio Management",
      "Fund Participation",
      "Recurring Capital Income",
    ],
    sector_stability_mechanisms: [
      "assets under management fees",
      "recurring advisory retainers",
      "fund management structures",
      "interest and dividend income streams",
      "financial education and certification programs",
    ],
    peer_benchmark_group_key: "finance_banking",
    peer_benchmark_group_label: "Finance / Banking Professionals",
    peer_benchmark_text:
      "Compared to other finance and banking professionals at a similar stage.",
    improvement_guidance:
      "Profiles that shift from transactional advisory and deal-based compensation toward assets-under-management fee structures tend to show scalable growth. Income systems that include recurring advisory retainers demonstrate more predictable monthly revenue regardless of market activity. Structures with fund participation or carried-interest arrangements tend to exhibit income from portfolio performance over time.",
    avg_score: 55,
    top_20_threshold: 72,
    peer_band_distribution: { limited: 14, developing: 32, established: 34, high: 20 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Advisory fees tied to active client meetings stop when you step away — profiles with AUM-based fees that accrue regardless of daily activity tend to show stronger continuity.",
      recurring_income_proportion: "Deal-based compensation is episodic — income systems that include recurring advisory retainers or management fees that renew automatically tend to demonstrate greater stability.",
      forward_revenue_visibility: "Transaction pipelines are uncertain quarter to quarter — structures with multi-year advisory contracts or fund commitments tend to exhibit significantly extended revenue visibility.",
      income_concentration: "Heavy reliance on a few institutional clients creates risk — broader distribution across client segments, asset classes, and service lines tends to reduce exposure.",
      number_of_income_sources: "A single advisory practice limits resilience — profiles that include income from fund distributions, training programs, or strategic board participation tend to show stronger diversification.",
      earnings_variability: "Bonus-driven and deal-contingent compensation swings widely — AUM fees and retainers tend to create a more stable monthly baseline.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures where a portion of client relationships use AUM-based fee models tend to show income that accrues regardless of meeting activity.",
        "Income systems with automated portfolio rebalancing reports tend to demonstrate sustained client value without proportional manual effort.",
        "Profiles that include trail commission or residual fee arrangements on advisory accounts tend to exhibit stronger passive income continuity.",
      ],
      recurring_income_proportion: [
        "Structures that convert transactional brokerage clients to annual advisory retainer agreements tend to show increased recurring revenue.",
        "Income systems that include subscription-based financial planning services tend to exhibit more predictable monthly revenue.",
        "Profiles with AUM-based accounts tend to demonstrate scalable recurring management fee income.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-month advisory engagement letters featuring automatic renewal clauses tend to show extended forward visibility.",
        "Income systems with quarterly fee schedules invoiced in advance tend to demonstrate committed near-term revenue.",
        "Profiles that track committed revenue from signed mandates across multiple quarters tend to exhibit stronger pipeline predictability.",
      ],
      income_concentration: [
        "Structures where no single client exceeds 20% of total revenue tend to show reduced concentration risk.",
        "Profiles that include a second asset class or service line tend to demonstrate broader revenue distribution.",
        "Income systems with referral channels across multiple professional firms tend to exhibit diversified client acquisition sources.",
      ],
      number_of_income_sources: [
        "Structures that include paid financial literacy seminars tend to show separate training revenue streams.",
        "Profiles with compensated advisory board positions tend to demonstrate additional income sources beyond client work.",
        "Income systems that include model portfolio licensing arrangements tend to exhibit passive licensing fee income.",
      ],
      earnings_variability: [
        "Structures where a larger share of compensation comes from fixed retainer or AUM fees rather than bonuses tend to show reduced variability.",
        "Income systems with monthly draw arrangements against annual performance compensation tend to demonstrate smoother cash flow.",
        "Profiles with multiple AUM accounts tend to establish a baseline monthly management fee that smooths deal timing fluctuations.",
      ],
    },
  },

  insurance: {
    evolution_path_key: "insurance",
    evolution_path_title: "Insurance Income Evolution",
    evolution_path_steps: [
      "Policy Sales",
      "Renewal Book",
      "Agency Development",
      "Portfolio Underwriting",
      "Recurring Premium Income",
    ],
    sector_stability_mechanisms: [
      "renewal commission structures",
      "policy portfolio retention",
      "agency override income",
      "group and institutional policy contracts",
      "insurance training and licensing programs",
    ],
    peer_benchmark_group_key: "insurance",
    peer_benchmark_group_label: "Insurance Professionals",
    peer_benchmark_text:
      "Compared to other insurance professionals at a similar stage.",
    improvement_guidance:
      "Profiles with a deep renewal book where annual policy renewals generate predictable trailing commissions without active reselling tend to show the strongest resilience. Structures with agency ownership or override arrangements tend to exhibit income from the production of other agents. Income systems that include group and institutional policy contracts demonstrate multi-year premium income with high retention rates.",
    avg_score: 52,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 16, developing: 34, established: 32, high: 18 },
    constraint_guidance: {
      income_continuity_without_active_labor: "New policy sales require constant prospecting — profiles with a renewal book large enough that trailing commissions sustain income during inactive periods tend to show stronger continuity.",
      recurring_income_proportion: "First-year commissions dominate early careers — products with strong renewal commission structures that compound over time tend to demonstrate greater recurring income.",
      forward_revenue_visibility: "Policy lapse rates create uncertainty — structures that include strong retention strategies and multi-year group contracts tend to exhibit more predictable revenue.",
      income_concentration: "Relying on a narrow product line or single carrier concentrates risk — broader distribution across carriers, product types, and client segments tends to reduce exposure.",
      number_of_income_sources: "Income from a single agency or product limits resilience — profiles that include override income, training revenue, or claims consulting tend to show stronger diversification.",
      earnings_variability: "New business production fluctuates seasonally — a mature renewal book with high retention tends to smooth monthly income variation.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Profiles with a renewal book of sufficient scale tend to show trailing commissions that cover a significant share of monthly expenses.",
        "Structures that include licensed service agents handling claims and renewals tend to demonstrate income continuity during absence periods.",
        "Income systems with automated renewal processing on key accounts tend to exhibit hands-off commission continuity.",
      ],
      recurring_income_proportion: [
        "Structures that prioritize products with strong annual renewal commissions tend to show compounding recurring income over time.",
        "Income systems where existing clients hold multiple policy lines tend to demonstrate multiplied renewal commission streams per client.",
        "Profiles with negotiated higher renewal commission rates in exchange for volume commitments tend to exhibit stronger recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures that include detailed renewal book projections with month-by-month income forecasts tend to show clearer forward visibility.",
        "Income systems with group or institutional policy contracts on multi-year terms tend to demonstrate extended revenue certainty.",
        "Profiles with proactive pre-renewal outreach campaigns tend to exhibit locked-in retention on key accounts.",
      ],
      income_concentration: [
        "Structures with appointments across multiple carriers tend to show reduced dependence on any single carrier.",
        "Profiles that include specialty lines complementing the primary product focus tend to demonstrate broader revenue distribution.",
        "Income systems with referral relationships across professionals serving different client demographics tend to exhibit reduced concentration.",
      ],
      number_of_income_sources: [
        "Structures that include paid insurance education workshops tend to show separate training revenue streams.",
        "Profiles with override or agency-building arrangements tend to demonstrate income from sub-producer business.",
        "Income systems that include claims consulting or risk management advisory services tend to exhibit fee-based diversification.",
      ],
      earnings_variability: [
        "Profiles that calculate their monthly renewal income floor and set spending baselines accordingly tend to show better cash flow management.",
        "Structures with evenly distributed prospecting activity across all periods tend to demonstrate smoother commission timing.",
        "Income systems with quarterly advance payments on renewal commissions tend to exhibit reduced monthly variability.",
      ],
    },
  },

  technology: {
    evolution_path_key: "technology",
    evolution_path_title: "Technology Income Evolution",
    evolution_path_steps: [
      "Project-Based Development",
      "Product Licensing",
      "Platform Deployment",
      "Subscription Revenue",
      "Recurring SaaS Income",
    ],
    sector_stability_mechanisms: [
      "subscription and licensing revenue",
      "maintenance and support contracts",
      "platform usage fees",
      "intellectual property licensing",
      "technology training and certification programs",
    ],
    peer_benchmark_group_key: "technology",
    peer_benchmark_group_label: "Technology Professionals",
    peer_benchmark_text:
      "Compared to other technology professionals at a similar stage.",
    improvement_guidance:
      "Profiles that shift project-based development toward subscription or SaaS licensing models tend to show stronger recurring monthly revenue. Structures with maintenance and support contracts that renew annually demonstrate baseline income between projects. Income systems that include licensable intellectual property independent of active consulting tend to exhibit income that scales without proportional labor.",
    avg_score: 48,
    top_20_threshold: 65,
    peer_band_distribution: { limited: 22, developing: 35, established: 28, high: 15 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Custom development and consulting income stops between engagements — profiles with products or platforms that generate revenue without active coding tend to show stronger continuity.",
      recurring_income_proportion: "Project-based billing is one-time by nature — income systems that include subscription access, maintenance contracts, or usage-based pricing tend to demonstrate greater recurring revenue.",
      forward_revenue_visibility: "Technology project pipelines are notoriously unpredictable — structures with annual support contracts and subscription commitments tend to exhibit stronger forward revenue.",
      income_concentration: "Dependence on one or two enterprise clients is common in tech — broader distribution across client sizes, verticals, and contract types tends to reduce exposure.",
      number_of_income_sources: "A single consulting practice or product limits stability — profiles that include training, licensing, support contracts, and affiliate revenue tend to show greater resilience.",
      earnings_variability: "Feast-or-famine project cycles cause wide monthly swings — recurring SaaS or maintenance revenue tends to create a more predictable baseline.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that package internal tools or processes into self-service SaaS products tend to show monthly billing revenue independent of active labor.",
        "Profiles that convert active consulting clients to annual maintenance and support contracts tend to demonstrate income continuity through monthly billing.",
        "Income systems that include paid APIs or developer toolkits tend to exhibit usage-based revenue without direct involvement.",
      ],
      recurring_income_proportion: [
        "Structures that convert project-based client relationships into monthly retainer agreements with defined deliverables tend to show increased recurring revenue.",
        "Income systems that include subscription-based monitoring or managed-service offerings tend to demonstrate more predictable revenue from existing clients.",
        "Profiles with annual site licenses featuring automatic renewal terms tend to exhibit stronger recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-month support and maintenance contracts featuring quarterly billing tend to show extended forward visibility.",
        "Income systems with pre-sold annual SaaS subscriptions tend to demonstrate locked-in forward revenue.",
        "Profiles with multi-phase development contracts spanning extended periods with milestone payments tend to exhibit stronger pipeline certainty.",
      ],
      income_concentration: [
        "Structures where no single client exceeds 30% of revenue tend to show reduced concentration risk across verticals.",
        "Profiles that serve multiple industries beyond a single primary sector tend to demonstrate broader revenue distribution.",
        "Income systems that include white-label product versions for channel partner resale tend to exhibit diversified distribution.",
      ],
      number_of_income_sources: [
        "Structures that include paid online courses or certification programs tend to show separate education revenue streams.",
        "Income systems with affiliate or referral programs for complementary tools tend to demonstrate commission-based diversification.",
        "Profiles that include technical due diligence or fractional executive consulting tend to exhibit distinct revenue lines.",
      ],
      earnings_variability: [
        "Structures with minimum monthly retainer billing across active clients tend to show a stabilized income baseline.",
        "Profiles that maintain multi-month cash reserves from project revenue tend to demonstrate smoother between-project transitions.",
        "Income systems with multiple maintenance contracts tend to establish a monthly income floor covering fixed expenses.",
      ],
    },
  },

  healthcare: {
    evolution_path_key: "healthcare",
    evolution_path_title: "Healthcare Income Evolution",
    evolution_path_steps: [
      "Clinical Practice",
      "Patient Panel Development",
      "Practice Ownership",
      "Multi-Location Operations",
      "Recurring Healthcare Revenue",
    ],
    sector_stability_mechanisms: [
      "contracted payer agreements",
      "patient membership and concierge models",
      "facility ownership structures",
      "ancillary service revenue",
      "medical education and training programs",
    ],
    peer_benchmark_group_key: "healthcare",
    peer_benchmark_group_label: "Healthcare Professionals",
    peer_benchmark_text:
      "Compared to other healthcare professionals at a similar stage.",
    improvement_guidance:
      "Profiles that move beyond fee-for-service clinical work toward contracted payer agreements and capitated care models tend to show more predictable per-patient revenue. Income systems that include concierge or membership-based practice models where patients pay recurring fees demonstrate stronger stability. Structures with practice ownership and ancillary services like diagnostics or physical therapy tend to exhibit facility-based income independent of personal clinical hours.",
    avg_score: 54,
    top_20_threshold: 70,
    peer_band_distribution: { limited: 15, developing: 33, established: 33, high: 19 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Fee-for-service clinical income stops when you stop seeing patients — profiles with practice ownership or concierge models that generate revenue beyond personal appointments tend to show stronger continuity.",
      recurring_income_proportion: "Most clinical income is billed per encounter — structures with capitated contracts, membership fees, and payer agreements tend to demonstrate more predictable recurring revenue.",
      forward_revenue_visibility: "Patient volume fluctuates with seasons and referral patterns — income systems that include long-term payer contracts and membership panels tend to exhibit improved forward visibility.",
      income_concentration: "Reliance on a single payer or hospital system creates vulnerability — broader distribution across payers, service lines, and practice locations tends to reduce exposure.",
      number_of_income_sources: "A solo clinical practice is a single income source — profiles that include ancillary services, training programs, or facility ownership tend to show stronger diversification.",
      earnings_variability: "Clinical income varies with patient volume and reimbursement timing — capitated and membership models tend to smooth monthly revenue.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that include mid-level providers seeing a portion of the patient panel tend to show income continuity independent of personal clinical hours.",
        "Income systems that include concierge or direct-primary-care membership models tend to demonstrate monthly fee revenue from enrolled patients.",
        "Profiles with diagnostic or imaging suites tend to exhibit facility-fee revenue independent of personal clinical hours.",
      ],
      recurring_income_proportion: [
        "Structures that include patient membership plans with monthly fees tend to show stronger recurring revenue.",
        "Income systems with capitated payer contracts providing fixed per-member-per-month revenue tend to demonstrate more predictable income.",
        "Profiles with chronic care management programs billing recurring monthly codes tend to exhibit increased recurring revenue from eligible patients.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-month occupational health contracts for pre-scheduled services tend to show extended forward visibility.",
        "Income systems where a high percentage of the patient panel is pre-booked for quarterly wellness visits tend to demonstrate committed forward revenue.",
        "Profiles with multi-year payer agreements featuring committed patient volume and reimbursement rates tend to exhibit locked-in forward visibility.",
      ],
      income_concentration: [
        "Structures where no single payer represents more than 40% of revenue tend to show reduced concentration risk.",
        "Income systems that include ancillary service lines tend to demonstrate diversified revenue sources.",
        "Profiles with cash-pay or self-pay service menus tend to exhibit reduced dependence on insurance reimbursement.",
      ],
      number_of_income_sources: [
        "Structures that include paid health education courses or wellness programs for corporate clients tend to show separate revenue streams.",
        "Income systems that include medical consulting or expert witness practices tend to demonstrate separate professional fee income.",
        "Profiles that license clinical protocols or training materials to other practices tend to exhibit royalty-based diversification.",
      ],
      earnings_variability: [
        "Structures with patients enrolled in monthly membership plans tend to show a predictable income floor.",
        "Income systems with monthly capitated payments from payers instead of per-visit reimbursement tend to demonstrate reduced variability.",
        "Profiles with high pre-scheduling rates for follow-up visits tend to exhibit reduced no-show and volume variability.",
      ],
    },
  },

  legal_services: {
    evolution_path_key: "legal_services",
    evolution_path_title: "Legal Services Income Evolution",
    evolution_path_steps: [
      "Billable Hour Practice",
      "Client Retainer Development",
      "Practice Group Leadership",
      "Firm Equity Participation",
      "Recurring Legal Revenue",
    ],
    sector_stability_mechanisms: [
      "retainer-based client agreements",
      "institutional client contracts",
      "firm equity distributions",
      "legal process outsourcing structures",
      "continuing legal education programs",
    ],
    peer_benchmark_group_key: "legal_services",
    peer_benchmark_group_label: "Legal Services Professionals",
    peer_benchmark_text:
      "Compared to other legal services professionals at a similar stage.",
    improvement_guidance:
      "Profiles that transition from hourly billing toward monthly retainer agreements tend to show more predictable revenue with ongoing client access. Income systems that include institutional client relationships with multi-year contracts for compliance, regulatory, or general counsel services demonstrate stronger stability. Structures with firm equity participation or origination credit tend to exhibit income from the firm's broader client base beyond personal billable hours.",
    avg_score: 50,
    top_20_threshold: 67,
    peer_band_distribution: { limited: 18, developing: 35, established: 30, high: 17 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Billable-hour income ceases entirely during periods of non-billing — profiles with retainer relationships and firm equity positions that produce income regardless of active casework tend to show stronger continuity.",
      recurring_income_proportion: "Most legal work is billed after completion on a matter-by-matter basis — income systems that include monthly retainers and subscription legal service models tend to demonstrate greater recurring revenue.",
      forward_revenue_visibility: "Legal matters are often unpredictable in timing and scope — structures with multi-year institutional contracts and retainer agreements tend to exhibit forward revenue certainty.",
      income_concentration: "Heavy reliance on a few large matters or clients creates significant risk — broader distribution across practice areas, client industries, and engagement types tends to reduce exposure.",
      number_of_income_sources: "A single practice area or client relationship limits resilience — profiles that include mediation, training, board advisory, or publishing tend to show stronger diversification.",
      earnings_variability: "Legal income fluctuates with case resolutions and new matter origination — retainer-based revenue and equity distributions tend to stabilize monthly cash flow.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that convert active clients to monthly general counsel retainers tend to show billing that continues regardless of matter activity.",
        "Profiles with equity or origination credit positions tend to demonstrate income from firm-wide billings independent of personal casework.",
        "Income systems that include compliance audit packages deliverable by junior associates tend to exhibit continuity without direct personal involvement.",
      ],
      recurring_income_proportion: [
        "Structures with flat-fee monthly retainer agreements for ongoing legal access tend to show stronger recurring revenue.",
        "Income systems that include subscription legal services at fixed monthly rates tend to demonstrate more predictable income.",
        "Profiles with annual compliance review contracts billed quarterly in advance tend to exhibit increased recurring revenue.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-year institutional client contracts for regulatory or compliance services tend to show extended forward visibility.",
        "Income systems where annual legal service packages are sold before current matters close tend to demonstrate committed forward pipeline.",
        "Profiles with multi-year outside general counsel agreements tend to exhibit locked-in forward revenue.",
      ],
      income_concentration: [
        "Structures with client relationships across multiple practice areas or industries tend to show reduced reliance on a single niche.",
        "Profiles where no single client exceeds 25% of billings tend to demonstrate balanced revenue distribution.",
        "Income systems with cross-referral relationships across complementary practice areas tend to exhibit diversified revenue sources.",
      ],
      number_of_income_sources: [
        "Structures that include paid CLE seminars or legal training programs tend to show separate education revenue streams.",
        "Profiles with compensated advisory board positions tend to demonstrate additional income beyond billable practice.",
        "Income systems that include legal reference publications tend to exhibit royalty-based diversification.",
      ],
      earnings_variability: [
        "Structures where retainer income covers a significant share of monthly overhead tend to show reduced earnings variability.",
        "Income systems with rolling billing forecasts tend to demonstrate better anticipation and smoothing of revenue gaps.",
        "Profiles with quarterly advance retainer payments from institutional clients tend to exhibit more stable monthly cash flow.",
      ],
    },
  },

  consulting_professional_services: {
    evolution_path_key: "consulting_professional_services",
    evolution_path_title: "Consulting / Professional Services Income Evolution",
    evolution_path_steps: [
      "Engagement-Based Work",
      "Client Relationship Portfolio",
      "Service Line Development",
      "Firm Ownership",
      "Recurring Advisory Income",
    ],
    sector_stability_mechanisms: [
      "retainer and subscription advisory models",
      "multi-year engagement contracts",
      "productized service offerings",
      "partnership equity structures",
      "professional development and training programs",
    ],
    peer_benchmark_group_key: "consulting_professional_services",
    peer_benchmark_group_label: "Consulting / Professional Services Professionals",
    peer_benchmark_text:
      "Compared to other consulting and professional services professionals at a similar stage.",
    improvement_guidance:
      "Profiles that convert project-based consulting engagements into ongoing retainer or subscription advisory relationships with defined monthly deliverables tend to show stronger stability. Income systems that include productized methodology — frameworks, assessments, or training programs — delivered repeatedly without full custom effort demonstrate greater scalability. Structures with firm ownership or partnership equity tend to exhibit income from the collective output of multiple consultants.",
    avg_score: 45,
    top_20_threshold: 63,
    peer_band_distribution: { limited: 24, developing: 37, established: 27, high: 12 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Consulting income is directly tied to billable hours and active engagements — profiles with productized offerings and retainer contracts that generate revenue between projects tend to show stronger continuity.",
      recurring_income_proportion: "Most consulting revenue is project-based and non-recurring — income systems that include subscription advisory models and annual retainers for ongoing client access tend to demonstrate greater recurring revenue.",
      forward_revenue_visibility: "Engagement pipelines are volatile and subject to client budget cycles — structures with multi-year contracts and retainer commitments tend to exhibit extended visibility.",
      income_concentration: "A small number of large engagements can dominate revenue — broader distribution across industries, service lines, and client sizes tends to reduce dependence.",
      number_of_income_sources: "A single consulting practice is inherently a single source — profiles that include training, licensing, publishing, or partnership distributions tend to show stronger diversification.",
      earnings_variability: "Consulting revenue follows an uneven engagement cycle — retainers and productized offerings tend to create a steadier monthly income pattern.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that productize methodologies into self-service assessment tools tend to show client purchases without direct involvement.",
        "Profiles that convert project clients to monthly advisory retainers with asynchronous deliverables tend to demonstrate income continuity between engagements.",
        "Income systems that license frameworks or templates to other consultants or firms tend to exhibit passive royalty income.",
      ],
      recurring_income_proportion: [
        "Structures that convert project engagements into multi-month retainer agreements with monthly billing tend to show increased recurring revenue.",
        "Income systems that include subscription advisory circles or mastermind groups at fixed monthly fees tend to demonstrate predictable community-based revenue.",
        "Profiles with annual strategy review packages featuring automatic renewal tend to exhibit stronger recurring income from past clients.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-month engagement letters featuring committed monthly fees tend to show extended forward visibility.",
        "Income systems where future advisory capacity is pre-sold with advance deposits tend to demonstrate committed forward pipeline.",
        "Profiles with multi-year consulting contracts for recurring strategic reviews tend to exhibit locked-in institutional revenue.",
      ],
      income_concentration: [
        "Structures where no single client exceeds 25% of revenue tend to show reduced concentration risk across mid-tier retainer clients.",
        "Profiles that serve multiple industry verticals tend to demonstrate broader revenue distribution.",
        "Income systems with referral partnerships across non-competing firms tend to exhibit diversified client acquisition channels.",
      ],
      number_of_income_sources: [
        "Structures that include paid workshops or training programs tend to show separate education revenue streams.",
        "Income systems that include online courses based on consulting methodology tend to demonstrate passive income diversification.",
        "Profiles with compensated advisory board seats or fractional executive roles tend to exhibit distinct income streams.",
      ],
      earnings_variability: [
        "Structures where retainer revenue covers a significant share of monthly operating costs tend to show reduced earnings variability.",
        "Income systems with quarterly billing cycles for larger clients tend to demonstrate smoother cash flow.",
        "Profiles that maintain multiple overlapping engagements tend to exhibit fewer zero-revenue months.",
      ],
    },
  },

  sales_brokerage: {
    evolution_path_key: "sales_brokerage",
    evolution_path_title: "Sales / Brokerage Income Evolution",
    evolution_path_steps: [
      "Direct Sales Activity",
      "Account Portfolio",
      "Team Sales Management",
      "Distribution Ownership",
      "Recurring Commission Income",
    ],
    sector_stability_mechanisms: [
      "residual commission structures",
      "account portfolio retention",
      "sales team override income",
      "distribution and channel agreements",
      "sales training and development programs",
    ],
    peer_benchmark_group_key: "sales_brokerage",
    peer_benchmark_group_label: "Sales / Brokerage Professionals",
    peer_benchmark_text:
      "Compared to other sales and brokerage professionals at a similar stage.",
    improvement_guidance:
      "Profiles that move from one-time transactional commissions toward residual commission structures where ongoing account activity generates trailing income tend to show stronger resilience. Income systems that include a managed account portfolio with high retention rates demonstrate renewal revenue that accumulates year over year. Structures with sales team override income or distribution ownership tend to exhibit earnings from the production of others rather than solely from personal selling.",
    avg_score: 40,
    top_20_threshold: 60,
    peer_band_distribution: { limited: 30, developing: 36, established: 24, high: 10 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Commission income depends entirely on closing new deals — profiles with residual commission structures and account portfolios that pay even during periods of reduced personal selling tend to show stronger continuity.",
      recurring_income_proportion: "Most sales compensation is tied to individual transactions — income systems that include products with trailing commissions, renewal fees, or account management retainers tend to demonstrate greater recurring revenue.",
      forward_revenue_visibility: "Sales pipelines are inherently uncertain — structures with contracted accounts, subscription-based products, and distribution agreements tend to exhibit extended revenue predictability.",
      income_concentration: "Reliance on a few large accounts or a single product line concentrates risk — broader distribution across products, territories, and client segments tends to reduce exposure.",
      number_of_income_sources: "A single sales role or territory is a single income source — profiles that include override income, training revenue, or channel distribution tend to show stronger diversification.",
      earnings_variability: "Sales compensation swings with quota attainment and deal timing — residual commissions and account portfolio revenue tend to dampen monthly fluctuations.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures with a sizable account portfolio of auto-renewing contracts tend to show trailing commissions that continue without active selling.",
        "Profiles that include junior sales reps whose production earns override commissions tend to demonstrate income from the output of others.",
        "Income systems with residual commission structures on key accounts tend to exhibit renewal income without re-selling.",
      ],
      recurring_income_proportion: [
        "Structures that convert one-time buyers to annual subscription or supply agreements with automatic reorders tend to show increased recurring revenue.",
        "Income systems with trailing commission rates on new contracts tend to demonstrate compounding recurring income over time.",
        "Profiles with managed account relationships featuring monthly service fees beyond transaction commissions tend to exhibit stronger recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-month purchase commitments or blanket orders featuring scheduled deliveries tend to show extended forward visibility.",
        "Income systems with rolling pipelines containing committed proposals at multiples of monthly targets tend to demonstrate stronger predictability.",
        "Profiles with multi-year distribution agreements guaranteeing minimum annual purchase volumes tend to exhibit locked-in forward revenue.",
      ],
      income_concentration: [
        "Structures where no single account exceeds 20% of total commission tend to show reduced concentration risk.",
        "Profiles that include a second product line or territory tend to demonstrate diversified commission sources.",
        "Income systems with multiple referral channels across trade associations, complementary vendors, and networks tend to exhibit broader client acquisition.",
      ],
      number_of_income_sources: [
        "Structures that include sales training or coaching practices tend to show separate consulting revenue streams.",
        "Income systems with channel partnerships or distribution agreements tend to demonstrate commission income from partner sales.",
        "Profiles that include paid industry newsletters or communities tend to exhibit sponsorship-based diversification.",
      ],
      earnings_variability: [
        "Structures where residual commission income covers a significant share of monthly expenses tend to show reduced variability.",
        "Income systems with deal closings spread evenly across periods through managed pipeline velocity tend to demonstrate smoother commission timing.",
        "Profiles with monthly draw arrangements against future commissions tend to exhibit stabilized month-to-month cash flow.",
      ],
    },
  },

  media_entertainment: {
    evolution_path_key: "media_entertainment",
    evolution_path_title: "Media / Entertainment Income Evolution",
    evolution_path_steps: [
      "Project-Based Production",
      "Content Library Development",
      "Distribution Channel Access",
      "Catalog Ownership",
      "Recurring Royalty Income",
    ],
    sector_stability_mechanisms: [
      "royalty and residual income streams",
      "content licensing agreements",
      "catalog and intellectual property ownership",
      "syndication and distribution contracts",
      "media production training programs",
    ],
    peer_benchmark_group_key: "media_entertainment",
    peer_benchmark_group_label: "Media / Entertainment Professionals",
    peer_benchmark_text:
      "Compared to other media and entertainment professionals at a similar stage.",
    improvement_guidance:
      "Profiles that shift from project-based production work toward a content library that generates ongoing royalty and licensing income tend to show stronger resilience. Structures with retained ownership of creative intellectual property rather than outright rights assignment demonstrate syndication and distribution income over time. Income systems that include catalog-level content assets — music catalogs, film libraries, or media franchises — tend to exhibit recurring revenue independent of new production activity.",
    avg_score: 38,
    top_20_threshold: 58,
    peer_band_distribution: { limited: 32, developing: 37, established: 22, high: 9 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Production-based income stops between projects — profiles with a content catalog including licensing and royalty agreements that generate revenue during production gaps tend to show stronger continuity.",
      recurring_income_proportion: "Most media income is project-fee or gig-based — income systems that include retained IP ownership with residual, royalty, and syndication agreements tend to demonstrate greater ongoing revenue.",
      forward_revenue_visibility: "Entertainment projects are sporadic and unpredictable — structures with multi-year distribution deals and licensing contracts tend to exhibit forward revenue certainty.",
      income_concentration: "Dependence on a single production company, platform, or franchise concentrates risk — broader distribution of content across multiple platforms and revenue channels tends to reduce exposure.",
      number_of_income_sources: "A single production role or content type limits stability — profiles that include licensing, training, live events, and merchandise tend to show stronger diversification.",
      earnings_variability: "Media income is highly cyclical around project release dates — catalog royalties and distribution residuals tend to create a steadier monthly baseline.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that include evergreen content on licensing platforms tend to show passive download and licensing revenue.",
        "Profiles with backend royalty or residual clauses in production contracts tend to demonstrate ongoing income from completed work.",
        "Income systems with a sizable content catalog of licensable assets tend to exhibit passive download or streaming income.",
      ],
      recurring_income_proportion: [
        "Structures with multi-year syndication or distribution deals featuring recurring quarterly royalty payments tend to show stronger recurring revenue.",
        "Income systems that include membership or subscription channels with paying monthly subscribers tend to demonstrate predictable recurring income.",
        "Profiles that license existing content libraries to multiple platforms for per-stream or per-use revenue tend to exhibit ongoing recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-month content creation contracts with brands, networks, or platforms tend to show extended forward visibility.",
        "Income systems where upcoming projects are pre-sold to distributors with advance payments tend to demonstrate committed forward revenue.",
        "Profiles with multi-season or multi-episode deals tend to exhibit extended guaranteed production revenue.",
      ],
      income_concentration: [
        "Structures that distribute content across multiple platforms tend to show reduced dependence on any single distributor.",
        "Profiles that include multiple content formats tend to demonstrate diversified revenue beyond a single core medium.",
        "Income systems with relationships across multiple production companies or brands tend to exhibit varied project sources.",
      ],
      number_of_income_sources: [
        "Structures that include masterclasses or workshops teaching creative processes tend to show separate education revenue.",
        "Income systems with merchandise lines tied to brand or content tend to demonstrate physical product income diversification.",
        "Profiles that include production consulting or creative direction services tend to exhibit fee-based sideline income.",
      ],
      earnings_variability: [
        "Structures where catalog royalty income covers a meaningful share of monthly living expenses tend to show reduced variability.",
        "Income systems with production contracts structured around monthly milestone payments tend to demonstrate smoother revenue than lump-sum completion fees.",
        "Profiles that maintain multiple active revenue streams across production, licensing, and membership tend to exhibit buffered overall volatility.",
      ],
    },
  },

  construction_trades: {
    evolution_path_key: "construction_trades",
    evolution_path_title: "Construction / Trades Income Evolution",
    evolution_path_steps: [
      "Job-Based Labor",
      "Contractor Operations",
      "Multi-Crew Management",
      "Property Development",
      "Recurring Contract Income",
    ],
    sector_stability_mechanisms: [
      "maintenance and service contract revenue",
      "multi-project pipeline management",
      "equipment leasing and ownership",
      "general contracting and subcontractor structures",
      "trade certification and apprenticeship programs",
    ],
    peer_benchmark_group_key: "construction_trades",
    peer_benchmark_group_label: "Construction / Trades Professionals",
    peer_benchmark_text:
      "Compared to other construction and trades professionals at a similar stage.",
    improvement_guidance:
      "Profiles that transition from job-by-job labor toward recurring maintenance and service contracts tend to show more predictable monthly revenue between construction projects. Income systems that include multi-crew operations where income is generated from the output of multiple teams demonstrate less dependence on personal labor. Structures with equipment ownership and leasing arrangements tend to exhibit asset-based income independent of active jobsite work.",
    avg_score: 41,
    top_20_threshold: 61,
    peer_band_distribution: { limited: 29, developing: 37, established: 24, high: 10 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Trade income stops when you stop working on the jobsite — profiles with maintenance contracts and crew management structures that earn without daily physical presence tend to show stronger continuity.",
      recurring_income_proportion: "Construction income is project-based and non-recurring — income systems that include recurring maintenance, inspection, and service contracts tend to demonstrate a more predictable revenue baseline.",
      forward_revenue_visibility: "Construction work is bid-based with uncertain timelines — structures that include multi-phase contracts and annual maintenance agreements tend to exhibit stronger forward visibility.",
      income_concentration: "Reliance on a single general contractor or project type creates vulnerability — broader distribution across residential, commercial, and municipal work tends to reduce exposure.",
      number_of_income_sources: "A single trade specialty or contractor relationship limits resilience — profiles that include equipment leasing, training, or property development tend to show stronger diversification.",
      earnings_variability: "Construction income varies with weather, permitting, and project schedules — maintenance contracts and multi-crew operations tend to reduce seasonal swings.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that include a lead foreman capable of running job sites independently tend to show income continuity while the owner manages operations.",
        "Income systems with annual maintenance or inspection contracts billed monthly tend to demonstrate recurring revenue independent of active project work.",
        "Profiles with specialty equipment leased to other contractors tend to exhibit asset-based income at regular intervals.",
      ],
      recurring_income_proportion: [
        "Structures that convert past project clients to annual preventive maintenance agreements billed monthly tend to show increased recurring revenue.",
        "Income systems that include seasonal service programs with auto-renewal tend to demonstrate predictable recurring income.",
        "Profiles with facilities maintenance contracts for commercial property managers tend to exhibit recurring monthly work revenue.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-phase construction contracts spanning extended periods with scheduled milestone payments tend to show extended forward visibility.",
        "Income systems with multi-month municipal or HOA maintenance contracts tend to demonstrate locked-in forward revenue.",
        "Profiles where seasonal project slots are pre-booked with advance deposits tend to exhibit committed forward pipeline.",
      ],
      income_concentration: [
        "Structures that include a second trade specialty tend to show reduced reliance on a single primary service.",
        "Profiles with a client mix spanning both residential and commercial work across multiple geographic areas tend to demonstrate broader revenue distribution.",
        "Income systems with multiple general contractor relationships tend to exhibit reduced dependence on any single project source.",
      ],
      number_of_income_sources: [
        "Structures that include paid trade apprenticeship or skills training workshops tend to show separate education revenue streams.",
        "Income systems with equipment rental operations for small tools and specialty equipment tend to demonstrate asset-based diversification.",
        "Profiles that include a handyman or small-job service division targeting a different client segment tend to exhibit additional income sources.",
      ],
      earnings_variability: [
        "Structures where maintenance contract revenue covers fixed overhead costs tend to show resilience during seasonal slowdowns.",
        "Income systems with staggered project scheduling across all periods tend to demonstrate smoother revenue distribution.",
        "Profiles that include winter services offerings tend to exhibit reduced seasonal income gaps.",
      ],
    },
  },

  retail_ecommerce: {
    evolution_path_key: "retail_ecommerce",
    evolution_path_title: "Retail / E-Commerce Income Evolution",
    evolution_path_steps: [
      "Direct Sales Operations",
      "Multi-Channel Presence",
      "Brand Development",
      "Wholesale Distribution",
      "Recurring Subscription Revenue",
    ],
    sector_stability_mechanisms: [
      "subscription and membership revenue",
      "wholesale and distribution agreements",
      "private label and brand licensing",
      "multi-channel fulfillment structures",
      "retail operations training programs",
    ],
    peer_benchmark_group_key: "retail_ecommerce",
    peer_benchmark_group_label: "Retail / E-Commerce Professionals",
    peer_benchmark_text:
      "Compared to other retail and e-commerce professionals at a similar stage.",
    improvement_guidance:
      "Profiles that move from one-time product sales toward subscription box, membership, or auto-replenishment models tend to show stronger recurring monthly revenue. Income systems that include wholesale and distribution agreements providing bulk purchase commitments independent of daily retail traffic demonstrate greater stability. Structures with private-label brands and licensing arrangements tend to exhibit margin and royalty income beyond individual storefront transactions.",
    avg_score: 44,
    top_20_threshold: 63,
    peer_band_distribution: { limited: 25, developing: 36, established: 27, high: 12 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Retail sales require constant inventory management and customer acquisition — profiles with subscription models and automated fulfillment that generate revenue without daily operational involvement tend to show stronger continuity.",
      recurring_income_proportion: "Most retail revenue comes from individual purchase transactions — income systems that include subscription, membership, and auto-replenishment programs tend to demonstrate stronger recurring income.",
      forward_revenue_visibility: "Retail demand is seasonal and trend-driven — structures with wholesale commitments, subscription pre-orders, and long-term distribution contracts tend to exhibit improved predictability.",
      income_concentration: "Dependence on a single storefront, marketplace, or product category concentrates risk — broader distribution across multiple channels and diversified product lines tends to reduce exposure.",
      number_of_income_sources: "A single retail channel is inherently fragile — profiles that include wholesale, licensing, affiliate, and subscription revenue tend to show stronger diversification.",
      earnings_variability: "Retail revenue fluctuates with seasons, trends, and promotions — subscriptions and wholesale contracts tend to create a more stable monthly baseline.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures with automated fulfillment (3PL or dropshipping) for top SKUs tend to show orders shipping without manual processing.",
        "Income systems that include subscription box or auto-replenishment programs tend to demonstrate recurring customer revenue with reduced operational involvement.",
        "Profiles with operations managers handling daily order processing and customer service tend to exhibit income continuity independent of personal involvement.",
      ],
      recurring_income_proportion: [
        "Structures that convert one-time buyers to subscribe-and-save programs tend to show increased recurring revenue.",
        "Income systems that include paid membership or loyalty programs with exclusive access tend to demonstrate predictable monthly revenue.",
        "Profiles with wholesale accounts featuring monthly standing orders for best-selling products tend to exhibit stronger recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures with pre-sold seasonal collections or limited releases via advance orders tend to show committed forward revenue.",
        "Income systems with wholesale accounts on multi-month purchase commitments with scheduled deliveries tend to demonstrate extended forward visibility.",
        "Profiles with subscription waitlists converting to paid subscriptions tend to exhibit growing committed subscriber bases.",
      ],
      income_concentration: [
        "Structures that include a second sales channel alongside the primary platform tend to show reduced channel concentration.",
        "Profiles with multiple product categories tend to demonstrate reduced dependence on any single bestseller.",
        "Income systems with wholesale relationships across multiple retailers tend to exhibit diversification beyond direct-to-consumer sales.",
      ],
      number_of_income_sources: [
        "Structures that include private-label or white-label product lines sold through different channels tend to show additional revenue streams.",
        "Income systems that include paid content or educational offerings related to the product niche tend to demonstrate education-based diversification.",
        "Profiles with affiliate marketing programs earning commissions on complementary products tend to exhibit commission-based income diversification.",
      ],
      earnings_variability: [
        "Structures where subscription and wholesale revenue covers a significant share of monthly fixed costs tend to show reduced variability.",
        "Income systems with promotional calendars spreading major sales events evenly across quarters tend to demonstrate smoother revenue distribution.",
        "Profiles that maintain rolling inventory and cash flow forecasts tend to exhibit better anticipation and smoothing of seasonal dips.",
      ],
    },
  },

  hospitality_food_service: {
    evolution_path_key: "hospitality_food_service",
    evolution_path_title: "Hospitality / Food Service Income Evolution",
    evolution_path_steps: [
      "Single-Location Operations",
      "Multi-Unit Management",
      "Brand Franchise Development",
      "Portfolio Ownership",
      "Recurring Franchise Income",
    ],
    sector_stability_mechanisms: [
      "franchise and licensing fee structures",
      "catering and event contract revenue",
      "multi-unit management systems",
      "supply chain and procurement agreements",
      "hospitality management training programs",
    ],
    peer_benchmark_group_key: "hospitality_food_service",
    peer_benchmark_group_label: "Hospitality / Food Service Professionals",
    peer_benchmark_text:
      "Compared to other hospitality and food service professionals at a similar stage.",
    improvement_guidance:
      "Profiles that expand beyond single-location daily operations toward multi-unit management structures tend to show diversified revenue across locations. Income systems that include franchise or licensing models where brand fees and royalties provide recurring income demonstrate less dependence on any single unit's daily performance. Structures that include catering contracts, event agreements, and institutional food service arrangements tend to exhibit locked-in forward revenue with reduced dependence on walk-in traffic.",
    avg_score: 39,
    top_20_threshold: 59,
    peer_band_distribution: { limited: 31, developing: 37, established: 23, high: 9 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Hospitality income requires daily operational presence — profiles with management teams and franchise structures where revenue flows without personal involvement in daily service tend to show stronger continuity.",
      recurring_income_proportion: "Food service revenue is earned transaction by transaction — income systems that include catering contracts, franchise royalties, and institutional agreements tend to demonstrate recurring revenue streams.",
      forward_revenue_visibility: "Walk-in traffic and seasonal tourism are unpredictable — structures that include event bookings, corporate contracts, and franchise commitments tend to exhibit stronger forward visibility.",
      income_concentration: "A single location or concept creates geographic and market concentration — broader distribution across locations, service formats, and revenue channels tends to reduce exposure.",
      number_of_income_sources: "Operating a single restaurant or venue is a single income source — profiles that include catering, franchise fees, packaged goods, or consulting tend to show stronger diversification.",
      earnings_variability: "Hospitality revenue swings with seasons, weather, and local events — contracted catering and franchise royalties tend to stabilize monthly income.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures with a floor manager handling daily operations tend to show income continuity independent of personal on-site service shifts.",
        "Income systems with recurring weekly catering contracts tend to demonstrate guaranteed weekly revenue from local businesses.",
        "Profiles with franchise operations manuals and licensed concepts tend to exhibit income from additional operators.",
      ],
      recurring_income_proportion: [
        "Structures that include corporate meal plans or weekly lunch delivery subscriptions tend to show predictable recurring revenue from local offices.",
        "Income systems with monthly event hosting contracts tend to demonstrate recurring income from organizational partnerships.",
        "Profiles with VIP dining membership programs featuring monthly dues tend to exhibit stronger recurring revenue.",
      ],
      forward_revenue_visibility: [
        "Structures with booked private events or catering contracts extending months forward with signed deposits tend to show committed forward revenue.",
        "Income systems with multi-month food service contracts for corporate campuses, schools, or institutions tend to demonstrate extended forward visibility.",
        "Profiles where holiday and seasonal event packages are pre-sold in advance tend to exhibit locked-in committed revenue.",
      ],
      income_concentration: [
        "Structures that include a second revenue format such as food trucks, ghost kitchens, or packaged retail products tend to show diversification beyond dine-in.",
        "Income systems with delivery coverage across multiple platforms or neighborhoods tend to demonstrate broader distribution.",
        "Profiles with private event or banquet offerings tend to exhibit reduced dependence on daily walk-in traffic.",
      ],
      number_of_income_sources: [
        "Structures that include branded packaged food products sold through retail channels tend to show separate product revenue streams.",
        "Income systems that include paid cooking classes or hospitality training programs tend to demonstrate education-based diversification.",
        "Profiles that include kitchen commissary or shared kitchen rental tend to exhibit asset-based income from other food entrepreneurs.",
      ],
      earnings_variability: [
        "Structures where catering and event contract revenue covers a significant share of monthly rent and labor costs tend to show reduced variability.",
        "Income systems with slow-season promotion calendars tend to demonstrate sustained traffic during off-peak months.",
        "Profiles with monthly payment terms from top suppliers tend to exhibit smoother cash outflows during slow periods.",
      ],
    },
  },

  transportation_logistics: {
    evolution_path_key: "transportation_logistics",
    evolution_path_title: "Transportation / Logistics Income Evolution",
    evolution_path_steps: [
      "Owner-Operator Activity",
      "Fleet Development",
      "Route and Contract Management",
      "Logistics Infrastructure",
      "Recurring Freight Income",
    ],
    sector_stability_mechanisms: [
      "long-term freight and shipping contracts",
      "fleet leasing and asset ownership",
      "route and territory agreements",
      "warehousing and distribution center operations",
      "transportation safety and compliance programs",
    ],
    peer_benchmark_group_key: "transportation_logistics",
    peer_benchmark_group_label: "Transportation / Logistics Professionals",
    peer_benchmark_text:
      "Compared to other transportation and logistics professionals at a similar stage.",
    improvement_guidance:
      "Profiles that move from owner-operator hauling toward fleet development and long-term freight contracts tend to show revenue from multiple vehicles and routes simultaneously. Structures that include multi-year shipping and logistics agreements with shippers who commit volume demonstrate more predictable lane-based income. Income systems that include logistics infrastructure — warehousing, distribution centers, or brokerage platforms — tend to exhibit income from asset utilization rather than personal driving hours.",
    avg_score: 46,
    top_20_threshold: 64,
    peer_band_distribution: { limited: 23, developing: 36, established: 28, high: 13 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Owner-operator income stops when the truck stops — profiles with a fleet and contract portfolio that generates freight revenue without personal driving hours tend to show stronger continuity.",
      recurring_income_proportion: "Spot-market loads are one-time transactions — income systems that include dedicated lane contracts and long-term shipping agreements tend to demonstrate recurring freight revenue.",
      forward_revenue_visibility: "Spot freight rates and load availability change daily — structures with multi-year contracts and dedicated lanes tend to exhibit locked-in forward revenue and volume.",
      income_concentration: "Dependence on a single shipper or lane creates route risk — broader distribution across shippers, routes, and freight types tends to reduce exposure.",
      number_of_income_sources: "A single truck or route is a single income source — profiles that include fleet leasing, brokerage commissions, warehousing, or training tend to show stronger diversification.",
      earnings_variability: "Freight rates and fuel costs cause significant monthly income swings — contracted rates and diversified routes tend to reduce variability.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that include additional drivers or owner-operators running primary routes tend to show income continuity while the owner manages dispatch and contracts.",
        "Income systems with dedicated lane contracts where shippers commit loads regardless of personal driving schedule tend to demonstrate revenue independent of active driving.",
        "Profiles with trailers or containers that generate lease income when parked or between loads tend to exhibit asset-based passive income.",
      ],
      recurring_income_proportion: [
        "Structures that convert spot-market shippers to multi-month dedicated lane contracts with fixed weekly loads tend to show increased recurring revenue.",
        "Income systems with monthly warehousing or cross-docking agreements tend to demonstrate recurring storage fee revenue.",
        "Profiles with freight brokerage arrangements earning recurring commissions on dispatched loads tend to exhibit commission-based recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures with shippers on multi-month minimum volume commitments at contracted rates tend to show extended forward visibility.",
        "Income systems with fuel surcharge escalation clauses in top contracts tend to demonstrate protection against rate uncertainty.",
        "Profiles with load forecasts based on committed lanes covering a significant share of fleet capacity tend to exhibit stronger pipeline predictability.",
      ],
      income_concentration: [
        "Structures where no single shipper exceeds 30% of revenue tend to show reduced concentration risk.",
        "Profiles that include multiple freight categories tend to demonstrate diversified service-based revenue.",
        "Income systems with multiple broker relationships accessing loads from different industries and regions tend to exhibit broader sourcing distribution.",
      ],
      number_of_income_sources: [
        "Structures that include freight brokerage desks dispatching loads for other owner-operators tend to show separate commission income streams.",
        "Income systems that include CDL training or safety compliance consulting tend to demonstrate fee-based diversification.",
        "Profiles that lease idle equipment to other operators during off-peak periods tend to exhibit asset-based income diversification.",
      ],
      earnings_variability: [
        "Structures with contracted rates on a majority of lanes tend to show buffered spot-market volatility.",
        "Income systems that maintain fuel hedging reserves tend to demonstrate smoother cost management during price fluctuations.",
        "Profiles with a diversified mix of contract and spot loads tend to exhibit reduced impact from rate swings in either market.",
      ],
    },
  },

  manufacturing: {
    evolution_path_key: "manufacturing",
    evolution_path_title: "Manufacturing Income Evolution",
    evolution_path_steps: [
      "Job Shop Production",
      "Contract Manufacturing",
      "Product Line Development",
      "Facility Expansion",
      "Recurring Supply Agreement Income",
    ],
    sector_stability_mechanisms: [
      "long-term supply and purchase agreements",
      "contract manufacturing arrangements",
      "equipment and tooling licensing",
      "private label production contracts",
      "manufacturing process certification programs",
    ],
    peer_benchmark_group_key: "manufacturing",
    peer_benchmark_group_label: "Manufacturing Professionals",
    peer_benchmark_text:
      "Compared to other manufacturing professionals at a similar stage.",
    improvement_guidance:
      "Profiles that transition from job-shop production toward long-term supply agreements and contract manufacturing arrangements tend to show buyers committed to recurring purchase volumes. Income systems that include proprietary product lines and private-label manufacturing contracts demonstrate margin beyond raw production fees. Structures with equipment and tooling that can be licensed or leased to other manufacturers tend to exhibit asset-based income independent of personal production runs.",
    avg_score: 51,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 17, developing: 34, established: 32, high: 17 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Job-shop production income requires constant operational involvement — profiles with contract manufacturing agreements and automated production lines that generate revenue with reduced personal oversight tend to show stronger continuity.",
      recurring_income_proportion: "Custom manufacturing orders are one-off — income systems that include long-term supply agreements and blanket purchase orders tend to demonstrate recurring production revenue.",
      forward_revenue_visibility: "Manufacturing order books can be volatile — structures with multi-year supply contracts and forecasted purchase commitments tend to exhibit extended revenue visibility.",
      income_concentration: "Dependence on a single buyer or product type creates significant risk — broader distribution across customers, industries, and product categories tends to reduce exposure.",
      number_of_income_sources: "A single production facility or product line limits resilience — profiles that include tooling licensing, private-label contracts, and consulting tend to show stronger diversification.",
      earnings_variability: "Manufacturing revenue fluctuates with order timing and raw material costs — blanket purchase agreements and fixed-price contracts tend to stabilize monthly income.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures with automated production lines that run with technicians rather than requiring direct supervision tend to show income continuity independent of personal oversight.",
        "Profiles with cross-trained operators capable of managing production independently tend to demonstrate continuity during absence periods.",
        "Income systems that license proprietary tooling or manufacturing processes to other shops tend to exhibit passive royalty income.",
      ],
      recurring_income_proportion: [
        "Structures that convert one-off custom orders into blanket purchase agreements with monthly release schedules tend to show increased recurring revenue.",
        "Income systems with multi-month supply contracts at guaranteed monthly volumes tend to demonstrate predictable recurring production income.",
        "Profiles with private-label manufacturing agreements for recurring monthly production runs tend to exhibit stronger recurring revenue.",
      ],
      forward_revenue_visibility: [
        "Structures with customers on multi-month minimum order commitments with quarterly price reviews tend to show extended forward visibility.",
        "Income systems with multi-year supply agreements with OEMs or distributors for primary product lines tend to demonstrate locked-in forward revenue.",
        "Profiles with production forecasts based on signed purchase orders covering a significant share of capacity tend to exhibit stronger pipeline predictability.",
      ],
      income_concentration: [
        "Structures where no single customer exceeds 30% of revenue tend to show reduced concentration risk across industries.",
        "Profiles that include a second product line or material capability serving a new market segment tend to demonstrate broader revenue distribution.",
        "Income systems with distribution partnerships accessing customers beyond direct sales reach tend to exhibit diversified client acquisition.",
      ],
      number_of_income_sources: [
        "Structures that include subcontract services such as machining, finishing, or assembly for other manufacturers tend to show additional revenue streams.",
        "Income systems that lease idle production capacity or equipment time to smaller shops tend to demonstrate asset-based diversification.",
        "Profiles that include paid manufacturing process training programs tend to exhibit education-based income diversification.",
      ],
      earnings_variability: [
        "Structures where blanket order revenue covers a significant share of monthly fixed costs tend to show reduced variability.",
        "Income systems with fixed-price raw material supply agreements over extended terms tend to demonstrate cost stability.",
        "Profiles with staggered production schedules spreading revenue recognition evenly tend to exhibit smoother monthly income.",
      ],
    },
  },

  education: {
    evolution_path_key: "education",
    evolution_path_title: "Education Income Evolution",
    evolution_path_steps: [
      "Direct Instruction",
      "Curriculum Development",
      "Program Administration",
      "Institutional Partnership",
      "Recurring Enrollment Income",
    ],
    sector_stability_mechanisms: [
      "tuition and enrollment revenue structures",
      "curriculum licensing and publishing",
      "institutional grant and endowment income",
      "continuing education and certification programs",
      "educational technology platform subscriptions",
    ],
    peer_benchmark_group_key: "education",
    peer_benchmark_group_label: "Education Professionals",
    peer_benchmark_text:
      "Compared to other education professionals at a similar stage.",
    improvement_guidance:
      "Profiles that move beyond per-session instruction toward curriculum licensing and publishing arrangements tend to show royalty income from materials used by others. Income systems that include online courses or educational technology platforms with subscription-based access demonstrate enrollment that scales without proportional teaching hours. Structures with institutional partnerships and certification programs tend to exhibit multi-year contracted revenue from organizations rather than individual students.",
    avg_score: 53,
    top_20_threshold: 69,
    peer_band_distribution: { limited: 16, developing: 33, established: 33, high: 18 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Teaching income stops during breaks and between terms — profiles with curriculum licensing, online courses, and certification programs that generate revenue without active instruction tend to show stronger continuity.",
      recurring_income_proportion: "Per-session and per-semester teaching is non-recurring — income systems that include subscription course platforms and institutional contracts tend to demonstrate more predictable recurring revenue.",
      forward_revenue_visibility: "Enrollment is uncertain until registration closes — structures with multi-year institutional contracts and subscription models tend to exhibit forward revenue certainty.",
      income_concentration: "Dependence on a single institution or enrollment cohort concentrates risk — broader distribution across institutions, online platforms, and corporate training clients tends to reduce exposure.",
      number_of_income_sources: "A single teaching position is a single income source — profiles that include publishing, consulting, online courses, and certification programs tend to show stronger diversification.",
      earnings_variability: "Education income follows academic cycles with predictable gaps — year-round online offerings and corporate training contracts tend to fill seasonal troughs.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that include self-paced online courses tend to show enrollment revenue without requiring live instruction.",
        "Income systems that license curriculum to other institutions or training organizations tend to demonstrate royalty payment income.",
        "Profiles with certification programs featuring automated assessments tend to exhibit income from students completing work independently.",
      ],
      recurring_income_proportion: [
        "Structures that include subscription-based online learning platforms with monthly access fees tend to show stronger recurring revenue.",
        "Income systems with corporate training contracts featuring annual commitments and monthly billing tend to demonstrate predictable recurring income.",
        "Profiles with continuing education programs featuring annual enrollment renewal for professional recertification tend to exhibit increased recurring revenue.",
      ],
      forward_revenue_visibility: [
        "Structures where upcoming courses are pre-sold with early registration discounts and deposits tend to show committed forward enrollment.",
        "Income systems with multi-year corporate training agreements for quarterly workshop delivery tend to demonstrate extended forward visibility.",
        "Profiles with multi-year curriculum licensing deals tend to exhibit locked-in forward revenue.",
      ],
      income_concentration: [
        "Structures that include teaching or consulting across multiple organizations tend to show reduced institutional concentration.",
        "Profiles with courses in multiple subject areas attracting different student demographics tend to demonstrate broader revenue distribution.",
        "Income systems that include corporate training client bases complementing academic teaching income tend to exhibit diversified revenue sources.",
      ],
      number_of_income_sources: [
        "Structures that include published textbooks or workbooks tend to show ongoing royalty income from sales.",
        "Income systems that include educational content channels monetized through sponsorships tend to demonstrate media-based diversification.",
        "Profiles that include educational consulting or curriculum design as a fee-based service tend to exhibit additional income streams.",
      ],
      earnings_variability: [
        "Structures where online course revenue covers living expenses during academic breaks tend to show reduced seasonal variability.",
        "Income systems with corporate training contracts billed monthly tend to demonstrate filled academic off-months.",
        "Profiles with year-round revenue calendars blending academic terms, online courses, and summer programs tend to exhibit smoother annual income.",
      ],
    },
  },

  nonprofit_public_sector: {
    evolution_path_key: "nonprofit_public_sector",
    evolution_path_title: "Nonprofit / Public Sector Income Evolution",
    evolution_path_steps: [
      "Grant-Funded Operations",
      "Donor Development",
      "Program Revenue Diversification",
      "Endowment Building",
      "Recurring Institutional Funding",
    ],
    sector_stability_mechanisms: [
      "multi-year grant and contract agreements",
      "recurring donor and membership revenue",
      "program service fee structures",
      "endowment and reserve fund income",
      "public sector compliance and reporting programs",
    ],
    peer_benchmark_group_key: "nonprofit_public_sector",
    peer_benchmark_group_label: "Nonprofit / Public Sector Professionals",
    peer_benchmark_text:
      "Compared to other nonprofit and public sector professionals at a similar stage.",
    improvement_guidance:
      "Profiles that shift from single-year competitive grants toward multi-year government contracts and institutional funding agreements tend to show guaranteed revenue over extended periods. Income systems that include a recurring donor and membership base where annual giving provides a predictable revenue floor demonstrate stronger stability. Structures with earned-revenue program service fees and endowment reserves tend to exhibit investment income independent of fundraising cycles.",
    avg_score: 47,
    top_20_threshold: 65,
    peer_band_distribution: { limited: 22, developing: 36, established: 29, high: 13 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Grant-funded positions depend on active program delivery and reporting — profiles with endowment income and recurring donor revenue that continues regardless of specific program activity tend to show stronger continuity.",
      recurring_income_proportion: "Most grants are one-time or annual competitive awards — income systems that include recurring memberships, monthly donors, and multi-year contracts tend to demonstrate more predictable revenue.",
      forward_revenue_visibility: "Grant cycles and government budget processes create funding uncertainty — structures with multi-year awards and committed donor pledges tend to exhibit extended revenue visibility.",
      income_concentration: "Heavy dependence on a single grant, funder, or government agency concentrates risk — broader distribution across funders, program revenue, and earned income tends to reduce exposure.",
      number_of_income_sources: "A single grant or government contract is fragile — profiles that include membership revenue, program fees, consulting, and endowment income tend to show stronger diversification.",
      earnings_variability: "Grant funding arrives in irregular disbursements — monthly donor programs and program service fees tend to create a steadier cash flow.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures with monthly donor programs featuring a large base of recurring contributors tend to show passive revenue continuity.",
        "Income systems with program service fees on top offerings tend to demonstrate earned income without ongoing fundraising.",
        "Profiles with endowment or reserve funds in invested assets tend to exhibit interest income independent of active program delivery.",
      ],
      recurring_income_proportion: [
        "Structures that convert one-time donors to monthly giving commitments through automated recurring gift campaigns tend to show increased recurring revenue.",
        "Income systems that include paid membership programs with monthly dues tend to demonstrate predictable recurring income.",
        "Profiles with annual corporate sponsorship agreements featuring automatic renewal clauses tend to exhibit stronger recurring revenue.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-year government contracts or multi-year foundation grants for core programs tend to show extended forward visibility.",
        "Income systems with written annual pledges from top donors committing gifts in advance tend to demonstrate committed forward revenue.",
        "Profiles with multi-year corporate sponsorships featuring committed annual funding amounts tend to exhibit locked-in forward revenue.",
      ],
      income_concentration: [
        "Structures where no single funder exceeds 25% of total revenue tend to show reduced concentration risk across grant sources.",
        "Profiles that include earned-revenue program lines such as workshops, consulting, or publications tend to demonstrate reduced grant dependence.",
        "Income systems where individual donor revenue represents a significant share of total income tend to exhibit broader funding diversification.",
      ],
      number_of_income_sources: [
        "Structures that include fee-for-service consulting offerings based on program expertise tend to show separate earned revenue streams.",
        "Income systems that include paid training or certification programs tend to demonstrate education-based diversification.",
        "Profiles with social enterprise arms selling mission-aligned products or services tend to exhibit additional income sources.",
      ],
      earnings_variability: [
        "Structures where monthly donor revenue covers a significant share of monthly payroll and operating costs tend to show reduced variability.",
        "Income systems with quarterly disbursement schedules on grants aligned with monthly expense timing tend to demonstrate smoother cash flow.",
        "Profiles that maintain multi-month cash reserves from unrestricted revenue tend to exhibit buffered grant disbursement delays.",
      ],
    },
  },

  agriculture: {
    evolution_path_key: "agriculture",
    evolution_path_title: "Agriculture Income Evolution",
    evolution_path_steps: [
      "Seasonal Crop Production",
      "Multi-Crop Diversification",
      "Value-Added Processing",
      "Land and Asset Portfolio",
      "Recurring Agricultural Revenue",
    ],
    sector_stability_mechanisms: [
      "forward contract and commodity agreements",
      "crop insurance and risk management structures",
      "land lease and rental income",
      "cooperative and marketing association participation",
      "agricultural certification and sustainability programs",
    ],
    peer_benchmark_group_key: "agriculture",
    peer_benchmark_group_label: "Agriculture Professionals",
    peer_benchmark_text:
      "Compared to other agriculture professionals at a similar stage.",
    improvement_guidance:
      "Profiles that move beyond single-season crop sales toward forward contracts and commodity agreements that lock in prices and volumes before harvest tend to show stronger stability. Income systems that include value-added processing — milling, packaging, or direct-to-consumer sales — demonstrate increased margin and extended revenue beyond raw commodity timing. Structures with a land and asset portfolio that generates lease income, rental revenue, and conservation program payments tend to exhibit income independent of active farming operations.",
    avg_score: 43,
    top_20_threshold: 62,
    peer_band_distribution: { limited: 27, developing: 36, established: 26, high: 11 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Farming income requires active seasonal labor — profiles with land leases, equipment rental, and conservation program payments that generate revenue during off-seasons and without personal fieldwork tend to show stronger continuity.",
      recurring_income_proportion: "Crop sales are seasonal one-time events — income systems that include forward contracts, subscription CSA programs, and land lease income tend to demonstrate recurring revenue.",
      forward_revenue_visibility: "Agriculture is subject to weather, commodity prices, and policy changes — structures with forward contracts and crop insurance tend to exhibit extended revenue predictability.",
      income_concentration: "Reliance on a single crop or commodity concentrates risk — broader distribution across crops, livestock, value-added products, and land-based income tends to reduce exposure.",
      number_of_income_sources: "A single farming operation is a single income source — profiles that include equipment rental, agritourism, consulting, or cooperative distributions tend to show stronger diversification.",
      earnings_variability: "Agricultural income varies dramatically with harvests and commodity markets — forward contracts, crop insurance, and diversified operations tend to smooth annual cash flow.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that lease a portion of acreage to other operators for annual cash rent payments tend to show passive land-based income.",
        "Income systems with acreage enrolled in conservation programs generating annual per-acre payments tend to demonstrate income independent of active farming.",
        "Profiles with automated irrigation or feeding systems tend to exhibit reduced daily labor requirements while maintaining production revenue.",
      ],
      recurring_income_proportion: [
        "Structures that include CSA (Community Supported Agriculture) subscriptions with members paying monthly tend to show stronger recurring revenue.",
        "Income systems with multi-month forward contracts with regional distributors for primary commodities tend to demonstrate predictable recurring income.",
        "Profiles with farmstand subscription boxes delivering weekly produce to local subscribers tend to exhibit increased recurring revenue.",
      ],
      forward_revenue_visibility: [
        "Structures with forward contracts covering a significant share of expected harvest volume at current prices tend to show locked-in forward revenue.",
        "Income systems with crop insurance coverage for all planted acreage tend to demonstrate a guaranteed minimum revenue floor.",
        "Profiles with multi-year supply agreements with restaurant groups or institutional buyers tend to exhibit extended forward visibility.",
      ],
      income_concentration: [
        "Structures that include a second crop or livestock species tend to show reduced dependence on a single primary commodity.",
        "Profiles with multiple direct-to-consumer sales channels beyond wholesale tend to demonstrate broader revenue distribution.",
        "Income systems with relationships across multiple commodity buyers or cooperatives tend to exhibit diversified buyer concentration.",
      ],
      number_of_income_sources: [
        "Structures that include agritourism offerings such as farm tours, U-pick, or farm dinners tend to show visitor-based revenue diversification.",
        "Income systems that rent idle equipment or barn space to neighboring operations tend to demonstrate asset-based income during off-seasons.",
        "Profiles with value-added product lines for retail sale tend to exhibit additional income beyond raw commodity sales.",
      ],
      earnings_variability: [
        "Structures with forward contracts on a majority of expected production tend to show locked-in prices before harvest, reducing price variability.",
        "Profiles that maintain multi-month operating reserves tend to demonstrate smoother coverage of planting and pre-harvest expenses.",
        "Income systems with diversified planting across early, mid, and late-season varieties tend to exhibit staggered harvest revenue.",
      ],
    },
  },

  energy_utilities: {
    evolution_path_key: "energy_utilities",
    evolution_path_title: "Energy / Utilities Income Evolution",
    evolution_path_steps: [
      "Project-Based Installation",
      "Service Territory Development",
      "Infrastructure Ownership",
      "Power Purchase Agreements",
      "Recurring Utility Revenue",
    ],
    sector_stability_mechanisms: [
      "power purchase and offtake agreements",
      "rate-regulated utility revenue structures",
      "infrastructure lease and easement income",
      "renewable energy credit and incentive programs",
      "energy compliance and safety certification programs",
    ],
    peer_benchmark_group_key: "energy_utilities",
    peer_benchmark_group_label: "Energy / Utilities Professionals",
    peer_benchmark_text:
      "Compared to other energy and utilities professionals at a similar stage.",
    improvement_guidance:
      "Profiles that transition from project-based installation work toward long-term power purchase agreements and offtake contracts tend to show guaranteed revenue over 10-25 year periods. Structures with energy infrastructure ownership — solar arrays, wind installations, or distribution assets — demonstrate rate-regulated or contracted revenue streams. Income systems that include renewable energy credits, capacity payments, and government incentive programs tend to exhibit supplementary income tied to infrastructure assets rather than active project labor.",
    avg_score: 56,
    top_20_threshold: 73,
    peer_band_distribution: { limited: 13, developing: 31, established: 35, high: 21 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Installation and project work stops between contracts — profiles with infrastructure ownership positions and power purchase agreements that generate revenue continuously from energy production tend to show stronger continuity.",
      recurring_income_proportion: "Project-based energy work is non-recurring — income systems that include power purchase agreements, maintenance contracts, and utility rate structures tend to demonstrate long-term recurring revenue.",
      forward_revenue_visibility: "Energy project pipelines depend on policy and permitting — structures with long-term PPAs and rate-regulated arrangements tend to exhibit decades of forward revenue visibility.",
      income_concentration: "Dependence on a single utility, developer, or project site concentrates risk — broader distribution across energy types, geographies, and contract structures tends to reduce exposure.",
      number_of_income_sources: "A single project or installation contract is a single source — profiles that include maintenance services, energy credits, consulting, and equipment leasing tend to show stronger diversification.",
      earnings_variability: "Energy project revenue is lumpy and milestone-driven — contracted utility revenue and PPA payments tend to create more predictable monthly cash flow.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures with ownership interest in solar or wind installations tend to show monthly power purchase revenue independent of active labor.",
        "Income systems with long-term power purchase agreements (PPAs) producing revenue from energy output tend to demonstrate income decoupled from personal labor.",
        "Profiles with recurring maintenance and monitoring contracts for installed energy systems tend to exhibit ongoing service-based revenue.",
      ],
      recurring_income_proportion: [
        "Structures that convert project-based installation clients to annual maintenance and monitoring service agreements tend to show increased recurring revenue.",
        "Income systems with long-term PPAs with commercial off-takers for primary generation assets tend to demonstrate decades of recurring income.",
        "Profiles enrolled in renewable energy credit (REC) programs generating monthly credit revenue from existing assets tend to exhibit supplementary recurring income.",
      ],
      forward_revenue_visibility: [
        "Structures with multi-year PPAs with creditworthy utilities or corporate buyers tend to show extended forward visibility.",
        "Income systems with multi-year government incentive or production tax credit commitments tend to demonstrate locked-in forward revenue.",
        "Profiles with multi-year energy services contracts for efficiency and monitoring tend to exhibit extended committed revenue.",
      ],
      income_concentration: [
        "Structures that include multiple energy types tend to show reduced technology concentration.",
        "Income systems with off-take agreements across multiple buyers tend to demonstrate reduced dependence on any single utility.",
        "Profiles that serve multiple geographic markets or service territories tend to exhibit broader distribution.",
      ],
      number_of_income_sources: [
        "Structures that include energy auditing and compliance consulting as a fee-based service tend to show professional service diversification.",
        "Income systems that lease roof space or land rights for third-party renewable installations tend to demonstrate passive lease income.",
        "Profiles that include paid certification or training programs for energy technicians and installers tend to exhibit education-based diversification.",
      ],
      earnings_variability: [
        "Structures with project contracts featuring monthly progress billing instead of milestone-based lump payments tend to show smoother revenue.",
        "Income systems where PPA and maintenance revenue covers a significant share of monthly operating costs tend to demonstrate reduced variability.",
        "Profiles that maintain multiple concurrent project or service contracts tend to exhibit fewer gaps between project completions.",
      ],
    },
  },

  other: {
    evolution_path_key: "other",
    evolution_path_title: "General Income Evolution",
    evolution_path_steps: [
      "Activity-Based Income",
      "Client Development",
      "Operational Scaling",
      "Asset Acquisition",
      "Recurring Revenue Streams",
    ],
    sector_stability_mechanisms: [
      "contract and retainer-based revenue",
      "recurring service agreements",
      "intellectual property and licensing income",
      "partnership and equity participation structures",
      "professional development and certification programs",
    ],
    peer_benchmark_group_key: "other",
    peer_benchmark_group_label: "General Professionals",
    peer_benchmark_text:
      "Compared to other professionals at a similar stage.",
    improvement_guidance:
      "Profiles that shift from activity-based and project-driven income toward retainer agreements and service contracts tend to show more predictable recurring revenue. Income systems that include scalable offerings — productized services, digital products, or licensing arrangements — demonstrate income without proportional increases in personal labor. Structures with equity positions, asset ownership, or partnership arrangements tend to exhibit passive income from capital rather than time.",
    avg_score: 46,
    top_20_threshold: 64,
    peer_band_distribution: { limited: 24, developing: 36, established: 28, high: 12 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Activity-based income stops when active work stops — profiles with retainer contracts, licensing income, or asset-based revenue that continues during periods of reduced personal activity tend to show stronger continuity.",
      recurring_income_proportion: "Most project-based and freelance income is non-recurring — income systems that include service agreements, subscriptions, or licensing deals that renew automatically tend to demonstrate greater recurring revenue.",
      forward_revenue_visibility: "Without contracts or commitments, future revenue is uncertain — structures with multi-month agreements and subscription arrangements tend to exhibit stronger forward visibility.",
      income_concentration: "Reliance on a few clients or a single service offering concentrates risk — broader distribution across client segments, services, and revenue types tends to reduce exposure.",
      number_of_income_sources: "A single service or client relationship limits resilience — profiles that include licensing, training, partnerships, or investment income tend to show stronger diversification.",
      earnings_variability: "Freelance and project income fluctuates unpredictably — retainers and subscription-based revenue tend to create a more consistent monthly income pattern.",
    },
    action_plan: {
      income_continuity_without_active_labor: [
        "Structures that package core services into digital products or templates tend to show client purchases without direct involvement.",
        "Profiles that convert active clients to monthly retainer agreements with asynchronous deliverables tend to demonstrate income continuity between engagements.",
        "Income systems with licensing arrangements for intellectual property tend to exhibit passive royalty income.",
      ],
      recurring_income_proportion: [
        "Structures with clients on multi-month service agreements with fixed monthly billing tend to show stronger recurring revenue.",
        "Income systems that include subscription communities or membership programs with paying monthly members tend to demonstrate predictable recurring income.",
        "Profiles with annual contracts featuring auto-renewal clauses tend to exhibit increased recurring revenue.",
      ],
      forward_revenue_visibility: [
        "Structures with signed contracts or engagement letters covering multiple months of work tend to show extended forward visibility.",
        "Income systems where quarterly service packages are pre-sold with advance payment tend to demonstrate committed forward revenue.",
        "Profiles with multi-year consulting or service agreements with institutional clients tend to exhibit locked-in forward revenue.",
      ],
      income_concentration: [
        "Structures where no single client exceeds 25% of total revenue tend to show reduced concentration risk.",
        "Profiles that include a second service offering or industry vertical tend to demonstrate broader revenue distribution.",
        "Income systems with referral partnerships tend to exhibit broadened client acquisition channels.",
      ],
      number_of_income_sources: [
        "Structures that include paid online courses or workshops teaching professional expertise tend to show separate education revenue streams.",
        "Profiles with compensated advisory roles or fractional executive positions tend to demonstrate distinct income streams.",
        "Income systems that include content channels monetized through sponsorships tend to exhibit media-based diversification.",
      ],
      earnings_variability: [
        "Structures where retainer and subscription revenue covers a significant share of monthly living expenses tend to show reduced variability.",
        "Income systems with quarterly billing for larger clients tend to demonstrate smoother monthly cash flow.",
        "Profiles that maintain multi-month cash reserves tend to exhibit buffered irregular project timing.",
      ],
    },
  },
};

// Map display names (from canonical enumerations) to internal keys
const SECTOR_KEY_MAP: Record<string, string> = {
  "Real Estate": "real_estate",
  "Finance / Banking": "finance_banking",
  "Insurance": "insurance",
  "Technology": "technology",
  "Healthcare": "healthcare",
  "Legal Services": "legal_services",
  "Consulting / Professional Services": "consulting_professional_services",
  "Sales / Brokerage": "sales_brokerage",
  "Media / Entertainment": "media_entertainment",
  "Construction / Trades": "construction_trades",
  "Retail / E-Commerce": "retail_ecommerce",
  "Hospitality / Food Service": "hospitality_food_service",
  "Transportation / Logistics": "transportation_logistics",
  "Manufacturing": "manufacturing",
  "Education": "education",
  "Nonprofit / Public Sector": "nonprofit_public_sector",
  "Agriculture": "agriculture",
  "Energy / Utilities": "energy_utilities",
  "Other": "other",
};

export function getSectorData(industrySector: string): SectorData {
  const key = SECTOR_KEY_MAP[industrySector] || "other";
  return SECTOR_DATA[key];
}
