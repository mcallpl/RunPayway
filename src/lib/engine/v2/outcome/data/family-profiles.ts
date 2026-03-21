// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Income Model Family Profiles (OL-1.0)
// 12 complete family profiles with deterministic outcomes
// ═══════════════════════════════════════════════════════════════

import type { IncomeModelFamily, IncomeModelFamilyId } from "../types";

export const FAMILY_PROFILES: Record<IncomeModelFamilyId, IncomeModelFamily> = {

  // ─── 1. Employment-Led ────────────────────────────────
  employment_led: {
    family_id: "employment_led",
    family_label: "Employment-Led",
    income_models: ["Employee Salary"],
    common_weak_points: [
      "Single employer concentration",
      "Income stops immediately if employment ends",
      "No forward visibility beyond pay period",
      "Zero continuity without active work",
    ],
    supportive_patterns: [
      "Predictable pay cycle",
      "Employer-provided benefits buffer",
      "Low variability month-to-month",
    ],
    primary_risk_scenarios: ["RS-JOB-LOSS", "RS-EMPLOYER-DOWNSIZE", "RS-INDUSTRY-CONTRACTION"],
    stronger_structure_signals: [
      "Supplemental income source established",
      "Side revenue stream producing recurring income",
      "Emergency continuity from non-employment source",
    ],
    default_action_priorities: [
      { action_id: "ACT-EMP-01", label: "Build one income source outside employment", description: "Create a supplemental revenue stream that does not depend on your employer.", why_now: "100% employer concentration creates maximum single-source risk", expected_effect: "Reduces concentration and adds continuity outside employment" },
      { action_id: "ACT-EMP-02", label: "Create forward-committed supplemental revenue", description: "Develop income that is committed in advance — retainers, subscriptions, or recurring arrangements.", why_now: "Forward visibility is limited to next paycheck", expected_effect: "Extends visibility beyond employment pay cycle" },
      { action_id: "ACT-EMP-03", label: "Reduce single-employer concentration", description: "Diversify income sources so employment represents less than 80% of total.", why_now: "Single-employer dependency is the highest structural risk", expected_effect: "Creates fallback income if employment ends" },
    ],
    default_avoid_priorities: [
      "Do not over-invest in single-employer career advancement without structural backup",
      "Do not treat bonuses or raises as structural improvement",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-EMP-01", condition: "Non-employment income source established", display_text: "Reassess after establishing a new income source outside your employer." },
      { trigger_id: "RT-EMP-02", condition: "Supplemental recurring revenue reaches 10%+", display_text: "Reassess when supplemental recurring revenue reaches 10% or more of total income." },
      { trigger_id: "RT-EMP-03", condition: "Forward-committed income extends beyond pay period", display_text: "Reassess when you have committed income extending beyond your next pay period." },
    ],
    explanation_translation_map: {
      low_forward_secured: "Your income visibility extends only to the next pay period. There is no committed income beyond your current employment arrangement.",
      high_concentration: "Your income depends entirely on one employer. If that employment ends, 100% of income stops.",
      high_labor_dependence: "Your income requires your continued active employment. There is no passive or recurring component.",
      short_continuity: "If employment ends, income stops immediately. There is no continuity window.",
      high_variability: "While base salary is stable, overall income may vary with bonuses, overtime, or commission components.",
    },
    benchmark_cluster_key: "employment_benchmark",
  },

  // ─── 2. Commission-Led ────────────────────────────────
  commission_led: {
    family_id: "commission_led",
    family_label: "Commission-Led",
    income_models: ["Commission-Based", "Real Estate Brokerage Income"],
    common_weak_points: [
      "Income arrives in uneven bursts",
      "Forward visibility limited to active pipeline",
      "High variability between strong and weak months",
      "Income stops when active selling stops",
    ],
    supportive_patterns: [
      "Large deal pipeline in progress",
      "Repeat client relationships generating referrals",
      "Multiple concurrent deal tracks",
    ],
    primary_risk_scenarios: ["RS-PIPELINE-DRY", "RS-TOP-CLIENT-LOST", "RS-MARKET-SLOWDOWN", "RS-DEAL-DELAYED"],
    stronger_structure_signals: [
      "Recurring referral income layer established",
      "Property management or passive income stream added",
      "Team structure sharing deal flow",
      "Forward bookings or listings under contract",
    ],
    default_action_priorities: [
      { action_id: "ACT-COM-01", label: "Build a recurring income layer alongside commission work", description: "Create retainer, management fee, or residual income that does not depend on new deals closing.", why_now: "Commission-only income has no floor when deals slow", expected_effect: "Creates baseline income that persists between deal closings" },
      { action_id: "ACT-COM-02", label: "Extend pipeline visibility to 3+ months", description: "Maintain a pipeline of committed or advanced-stage deals extending at least 3 months ahead.", why_now: "Forward visibility is limited to currently active deals", expected_effect: "Reduces gap risk and improves forward security" },
      { action_id: "ACT-COM-03", label: "Reduce dependence on top referral source", description: "Diversify referral and lead sources so no single channel drives more than 40% of deal flow.", why_now: "Top referral source concentration creates channel dependency", expected_effect: "Protects pipeline from single-channel disruption" },
    ],
    default_avoid_priorities: [
      "Do not treat a single large closing as structural improvement",
      "Do not ignore forward pipeline while current deals are strong",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-COM-01", condition: "Recurring income component reaches 15%+", display_text: "Reassess when recurring or residual income reaches 15% or more of total." },
      { trigger_id: "RT-COM-02", condition: "Forward committed pipeline extends to 3+ months", display_text: "Reassess when your committed pipeline extends 3 or more months ahead." },
      { trigger_id: "RT-COM-03", condition: "Top source concentration drops below 40%", display_text: "Reassess when no single referral source or client drives more than 40% of income." },
    ],
    explanation_translation_map: {
      low_forward_secured: "Most upcoming income depends on deals that have not yet closed. There is limited revenue already committed before the month begins.",
      high_variability: "Commission income naturally swings between strong and weak months. The structure has not yet smoothed this with recurring revenue.",
      high_labor_dependence: "Income depends on your continued active selling, prospecting, and deal management.",
      high_concentration: "Too much deal flow depends on a single referral source, client relationship, or market segment.",
      short_continuity: "If active selling stops, income dries up quickly. There is minimal residual or trailing income.",
    },
    benchmark_cluster_key: "commission_benchmark",
  },

  // ─── 3. Contract / Project-Led ────────────────────────
  contract_project_led: {
    family_id: "contract_project_led",
    family_label: "Contract / Project-Led",
    income_models: ["Contract-Based", "Independent Contractor", "Project-Based Work"],
    common_weak_points: [
      "Income tied to project start and end dates",
      "Gap risk between engagements",
      "Forward visibility limited to current contracts",
      "Concentration on a few active clients",
    ],
    supportive_patterns: [
      "Overlapping project timelines",
      "Repeat client history",
      "Milestone-based payment schedules",
    ],
    primary_risk_scenarios: ["RS-CONTRACT-END", "RS-GAP-PERIOD", "RS-CLIENT-BUDGET-CUT", "RS-SCOPE-REDUCTION"],
    stronger_structure_signals: [
      "Multi-month contracts with committed payment schedules",
      "Retainer component alongside project work",
      "3+ active clients at any given time",
      "Pipeline of signed next engagements",
    ],
    default_action_priorities: [
      { action_id: "ACT-CON-01", label: "Convert at least one project relationship into a retainer", description: "Move a project-based client to a recurring retainer or ongoing engagement.", why_now: "Project-only income creates gap risk when engagements end", expected_effect: "Creates recurring baseline income between projects" },
      { action_id: "ACT-CON-02", label: "Maintain overlapping contract timelines", description: "Ensure new engagements are signed before current ones end to eliminate income gaps.", why_now: "Gap periods between contracts are the primary income risk", expected_effect: "Eliminates zero-income periods between projects" },
      { action_id: "ACT-CON-03", label: "Secure next engagement before current contract ends", description: "Build a pipeline habit of signing next work while current work is active.", why_now: "Forward visibility drops to zero when current contracts end", expected_effect: "Extends forward visibility continuously" },
    ],
    default_avoid_priorities: [
      "Do not wait until a contract ends to seek the next one",
      "Do not treat a single large project as income stability",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-CON-01", condition: "Retainer or recurring component reaches 20%+", display_text: "Reassess when retainer or recurring income reaches 20% or more of total." },
      { trigger_id: "RT-CON-02", condition: "Next engagement signed before current one ends", display_text: "Reassess when you have the next engagement signed before the current one completes." },
      { trigger_id: "RT-CON-03", condition: "Active client count reaches 3+ simultaneous", display_text: "Reassess when you maintain 3 or more active clients simultaneously." },
    ],
    explanation_translation_map: {
      low_forward_secured: "Your income visibility is tied to current contract timelines. Once active contracts end, no committed income follows unless new work is already signed.",
      high_concentration: "A small number of clients account for most contract revenue. Losing one would create a meaningful income gap.",
      short_continuity: "Contract income stops when the engagement ends. There is limited passive or continuing income between projects.",
      high_labor_dependence: "Each project requires your direct involvement. Income generation is directly tied to your working hours.",
      high_variability: "Income fluctuates based on project timing, starts, and completions. Gaps between projects create uneven months.",
    },
    benchmark_cluster_key: "contract_benchmark",
  },

  // ─── 4. Retainer / Subscription-Led ───────────────────
  retainer_subscription_led: {
    family_id: "retainer_subscription_led",
    family_label: "Retainer / Subscription-Led",
    income_models: ["Subscription / Retainer Services", "Consulting / Client Services"],
    common_weak_points: [
      "Cancellation or non-renewal risk",
      "Client concentration within recurring base",
      "Revenue ceiling without new acquisition",
      "Platform or billing dependency",
    ],
    supportive_patterns: [
      "Monthly recurring revenue base",
      "Multi-month or annual contracts",
      "Low historical churn rate",
      "Diversified subscriber or retainer base",
    ],
    primary_risk_scenarios: ["RS-CHURN-SPIKE", "RS-TOP-RETAINER-LOST", "RS-RENEWAL-DECLINE", "RS-PRICING-PRESSURE"],
    stronger_structure_signals: [
      "Annual contract terms replacing monthly",
      "Diversified retainer base — no client exceeding 25%",
      "Net revenue retention above 90%",
      "Forward visibility extending 6+ months",
    ],
    default_action_priorities: [
      { action_id: "ACT-RET-01", label: "Extend contract terms from monthly to quarterly or annual", description: "Convert month-to-month retainers into longer committed terms.", why_now: "Short terms create continuous renewal risk", expected_effect: "Extends forward visibility and reduces churn exposure" },
      { action_id: "ACT-RET-02", label: "Reduce top-client concentration within recurring base", description: "Ensure no single retainer client exceeds 25% of recurring revenue.", why_now: "Losing one large retainer would disproportionately affect income", expected_effect: "Distributes risk across more clients" },
      { action_id: "ACT-RET-03", label: "Improve renewal and retention processes", description: "Build systematic renewal workflows to maintain retention above 90%.", why_now: "Churn compounds — small retention improvements have large revenue effects", expected_effect: "Stabilizes the recurring base and improves continuity" },
    ],
    default_avoid_priorities: [
      "Do not chase new acquisition at the expense of retention",
      "Do not treat month-to-month retainers as durable forward security",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-RET-01", condition: "Average contract term extends to 6+ months", display_text: "Reassess when your average contract term reaches 6 months or longer." },
      { trigger_id: "RT-RET-02", condition: "No single retainer client exceeds 25%", display_text: "Reassess when no single retainer client exceeds 25% of recurring revenue." },
      { trigger_id: "RT-RET-03", condition: "Net retention rate exceeds 90%", display_text: "Reassess when your net retention rate exceeds 90% over a trailing 6-month period." },
    ],
    explanation_translation_map: {
      low_forward_secured: "While retainer or subscription revenue provides some forward visibility, short contract terms or high cancellation risk reduce the effective security of that income.",
      high_concentration: "Too much recurring revenue depends on a small number of retainer clients. Losing one would meaningfully reduce the recurring base.",
      high_labor_dependence: "Even with retainers, the income still requires your active service delivery. The retainer creates forward visibility but not labor independence.",
      short_continuity: "Retainer terms are short enough that income continuity depends on continuous renewal rather than committed forward agreements.",
      high_variability: "Revenue fluctuates as retainers are added and lost. The churn rate creates month-to-month unpredictability.",
    },
    benchmark_cluster_key: "retainer_benchmark",
  },

  // ─── 5. Practice-Led ──────────────────────────────────
  practice_led: {
    family_id: "practice_led",
    family_label: "Practice-Led",
    income_models: ["Professional Practice"],
    common_weak_points: [
      "Income tied to practitioner availability",
      "Interruption sensitivity — illness, burnout, leave",
      "Limited scalability without associates",
      "Client concentration if caseload is small",
    ],
    supportive_patterns: [
      "Established referral network",
      "Recurring client base requiring ongoing services",
      "Booked appointment schedule extending weeks ahead",
    ],
    primary_risk_scenarios: ["RS-PRACTITIONER-UNAVAILABLE", "RS-REFERRAL-SOURCE-LOST", "RS-CASELOAD-DECLINE", "RS-REGULATORY-CHANGE"],
    stronger_structure_signals: [
      "Associate or partner carrying part of caseload",
      "Recurring service plans or memberships",
      "Booked schedule extending 4+ weeks ahead",
      "Multiple active referral sources",
    ],
    default_action_priorities: [
      { action_id: "ACT-PRA-01", label: "Add an associate or contractor to reduce founder dependence", description: "Bring on a practitioner who can serve clients without your direct involvement.", why_now: "All income stops if you are unavailable", expected_effect: "Creates income continuity during absence" },
      { action_id: "ACT-PRA-02", label: "Create a recurring service plan or membership tier", description: "Offer ongoing service plans that generate predictable monthly revenue.", why_now: "Appointment-only income has no recurring floor", expected_effect: "Adds a recurring revenue baseline" },
      { action_id: "ACT-PRA-03", label: "Extend forward-booked schedule to 4+ weeks", description: "Maintain a booked appointment calendar extending at least one month ahead.", why_now: "Short booking windows reduce forward visibility", expected_effect: "Improves forward-secured income and planning confidence" },
    ],
    default_avoid_priorities: [
      "Do not rely solely on increasing personal hours to improve the score",
      "Do not treat short-term caseload spikes as structural improvement",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-PRA-01", condition: "Associate absorbing 20%+ of service delivery", display_text: "Reassess when an associate or partner handles 20% or more of service delivery." },
      { trigger_id: "RT-PRA-02", condition: "Recurring service plan revenue reaches 15%+", display_text: "Reassess when recurring service plan revenue reaches 15% or more of total." },
      { trigger_id: "RT-PRA-03", condition: "Forward-booked schedule extends to 6+ weeks", display_text: "Reassess when your forward-booked schedule extends 6 or more weeks ahead." },
    ],
    explanation_translation_map: {
      high_labor_dependence: "Your income depends almost entirely on your personal availability to see clients or perform services. If you are unavailable, income stops.",
      low_forward_secured: "Forward visibility is limited to your currently booked appointments. There is limited committed income beyond the near-term schedule.",
      high_concentration: "Your practice depends heavily on a small number of referral sources or a concentrated client base.",
      short_continuity: "If you stop seeing clients, income stops almost immediately. There is no passive income component.",
      high_variability: "Income varies based on appointment volume, cancellations, and seasonal client demand patterns.",
    },
    benchmark_cluster_key: "practice_benchmark",
  },

  // ─── 6. Agency-Led ────────────────────────────────────
  agency_led: {
    family_id: "agency_led",
    family_label: "Agency-Led",
    income_models: ["Agency / Brokerage Income", "Team / Partnership Income"],
    common_weak_points: [
      "Concentration on a few large accounts",
      "Founder or key-person dependence for client relationships",
      "Scope creep reducing effective margins",
      "Renewal risk on annual contracts",
    ],
    supportive_patterns: [
      "Retainer-based client relationships",
      "Multi-year contracts",
      "Diversified client portfolio",
      "Team-based delivery",
    ],
    primary_risk_scenarios: ["RS-TOP-ACCOUNT-LOST", "RS-FOUNDER-UNAVAILABLE", "RS-SCOPE-CREEP", "RS-BUDGET-SEASON-CUT"],
    stronger_structure_signals: [
      "No single client exceeds 20% of revenue",
      "Team delivers without founder on every account",
      "Average contract term exceeds 12 months",
      "Pipeline of signed new business extending 3+ months",
    ],
    default_action_priorities: [
      { action_id: "ACT-AGN-01", label: "Reduce largest client to under 25% of total revenue", description: "Grow other accounts or add new clients to reduce top-account concentration.", why_now: "Account concentration creates outsized fragility", expected_effect: "Reduces impact of losing the largest account" },
      { action_id: "ACT-AGN-02", label: "Transition client delivery to team members", description: "Ensure the founder is not required on every account for day-to-day delivery.", why_now: "Founder dependency limits scalability and creates interruption risk", expected_effect: "Income continues when the founder is unavailable" },
      { action_id: "ACT-AGN-03", label: "Extend average contract length to 12+ months", description: "Negotiate longer terms with clients to improve forward visibility.", why_now: "Short contracts create continuous renewal anxiety", expected_effect: "Locks in forward revenue for longer periods" },
    ],
    default_avoid_priorities: [
      "Do not take on a new large client that increases concentration",
      "Do not treat project-based wins as recurring unless contracted",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-AGN-01", condition: "Top client concentration drops below 25%", display_text: "Reassess when no single client accounts for more than 25% of revenue." },
      { trigger_id: "RT-AGN-02", condition: "Team delivers 50%+ of revenue without founder", display_text: "Reassess when team members deliver 50% or more of revenue independently." },
      { trigger_id: "RT-AGN-03", condition: "Average contract term extends to 12+ months", display_text: "Reassess when your average client contract term reaches 12 months or longer." },
    ],
    explanation_translation_map: {
      high_concentration: "A small number of clients drive most of the agency's revenue. Losing the largest account would create a significant revenue gap.",
      high_labor_dependence: "Key client relationships still depend on the founder or a small number of individuals.",
      low_forward_secured: "Too little of the agency's future revenue is protected by signed retainers, renewals, or committed forward contracts.",
      short_continuity: "If key personnel become unavailable, client relationships and revenue may erode quickly.",
      high_variability: "Revenue fluctuates with client wins, losses, and scope changes across the portfolio.",
    },
    benchmark_cluster_key: "agency_benchmark",
  },

  // ─── 7. Product-Led ───────────────────────────────────
  product_led: {
    family_id: "product_led",
    family_label: "Product-Led",
    income_models: ["Product Sales", "Digital Product Sales", "Franchise Ownership"],
    common_weak_points: [
      "Revenue depends on ongoing sales volume",
      "Seasonal or trend-driven demand",
      "Channel or platform dependency",
      "Inventory or supply chain exposure",
    ],
    supportive_patterns: [
      "Repeat customer base",
      "Multiple sales channels",
      "Subscription or auto-replenishment component",
      "Diversified product catalog",
    ],
    primary_risk_scenarios: ["RS-DEMAND-DROP", "RS-CHANNEL-DISRUPTION", "RS-INVENTORY-DELAY", "RS-COMPETITOR-ENTRY"],
    stronger_structure_signals: [
      "Subscription or auto-reorder revenue layer",
      "3+ active sales channels",
      "Repeat customer rate above 40%",
      "No single product exceeding 40% of revenue",
    ],
    default_action_priorities: [
      { action_id: "ACT-PRD-01", label: "Add a subscription or auto-reorder layer", description: "Create a recurring purchase or membership component for existing customers.", why_now: "One-time sales have no forward visibility", expected_effect: "Creates predictable recurring revenue alongside one-time sales" },
      { action_id: "ACT-PRD-02", label: "Diversify beyond the primary sales channel", description: "Sell through 3 or more independent channels to reduce platform dependency.", why_now: "Single-channel dependency exposes all revenue to platform changes", expected_effect: "Protects against channel-specific disruptions" },
      { action_id: "ACT-PRD-03", label: "Increase repeat customer rate through retention programs", description: "Build loyalty, reorder, or replenishment programs to drive repeat purchases.", why_now: "Low repeat rates mean constant acquisition pressure", expected_effect: "Reduces acquisition dependency and improves revenue stability" },
    ],
    default_avoid_priorities: [
      "Do not rely on a single product launch to improve stability",
      "Do not count inventory value as forward-secured income",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-PRD-01", condition: "Subscription or recurring component reaches 20%+", display_text: "Reassess when subscription or recurring revenue reaches 20% or more of total." },
      { trigger_id: "RT-PRD-02", condition: "Active sales channels reach 3+", display_text: "Reassess when you sell through 3 or more independent channels." },
      { trigger_id: "RT-PRD-03", condition: "Repeat customer rate exceeds 40%", display_text: "Reassess when your repeat customer rate exceeds 40%." },
    ],
    explanation_translation_map: {
      low_forward_secured: "Product revenue depends on ongoing sales. There is limited committed or pre-sold income before the month begins.",
      high_concentration: "Revenue is concentrated in a single product line or sales channel. A disruption would disproportionately affect total income.",
      high_variability: "Sales volume fluctuates based on demand, seasonality, or marketing performance.",
      high_labor_dependence: "Even product-based income requires active marketing, fulfillment, and operations effort.",
      short_continuity: "Without active selling and fulfillment, product revenue declines quickly.",
    },
    benchmark_cluster_key: "product_benchmark",
  },

  // ─── 8. Creator / Audience-Led ────────────────────────
  creator_audience_led: {
    family_id: "creator_audience_led",
    family_label: "Creator / Audience-Led",
    income_models: ["Creator / Media Income"],
    common_weak_points: [
      "Platform dependency for distribution and monetization",
      "Audience attention is volatile",
      "Sponsorship and brand deal income is episodic",
      "Limited forward visibility beyond current deals",
    ],
    supportive_patterns: [
      "Direct audience relationship via email or membership",
      "Multiple monetization channels",
      "Evergreen content generating passive income",
      "Recurring membership or community income",
    ],
    primary_risk_scenarios: ["RS-PLATFORM-ALGO-CHANGE", "RS-SPONSOR-PULLBACK", "RS-AUDIENCE-DECLINE", "RS-CONTENT-BURNOUT"],
    stronger_structure_signals: [
      "Recurring membership or community revenue",
      "Evergreen content producing passive royalties",
      "Direct audience channel you control",
      "3+ monetization methods active simultaneously",
    ],
    default_action_priorities: [
      { action_id: "ACT-CRE-01", label: "Build a recurring membership or subscription", description: "Create a community, membership, or subscription that generates monthly recurring revenue.", why_now: "Episodic sponsorship and ad revenue has no floor", expected_effect: "Creates predictable baseline income independent of content performance" },
      { action_id: "ACT-CRE-02", label: "Develop a direct audience channel you control", description: "Build an email list, owned site, or direct community — not dependent on a platform.", why_now: "Platform algorithms can change without warning", expected_effect: "Protects audience access from platform dependency" },
      { action_id: "ACT-CRE-03", label: "Create evergreen products generating passive income", description: "Develop courses, templates, books, or tools that sell continuously.", why_now: "Active content creation is required for all current income", expected_effect: "Adds income that continues without daily production" },
    ],
    default_avoid_priorities: [
      "Do not rely on a single platform for all income",
      "Do not treat viral content performance as structural improvement",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-CRE-01", condition: "Recurring membership revenue reaches 20%+", display_text: "Reassess when recurring membership or subscription revenue reaches 20% or more of total." },
      { trigger_id: "RT-CRE-02", condition: "Direct audience channel with 1,000+ contacts", display_text: "Reassess when your direct audience channel (email list, owned community) reaches 1,000 or more engaged contacts." },
      { trigger_id: "RT-CRE-03", condition: "Evergreen or passive income reaches 15%+", display_text: "Reassess when evergreen or passive income reaches 15% or more of total." },
    ],
    explanation_translation_map: {
      high_labor_dependence: "Your income depends on your continued content creation, audience engagement, and active production. If you stop creating, income declines.",
      low_forward_secured: "Most income arrives through episodic deals, ad revenue, or sponsorships that are not committed in advance.",
      high_concentration: "Too much income depends on a single platform, sponsor, or monetization channel.",
      short_continuity: "If you stop producing content, most income declines within weeks.",
      high_variability: "Creator income fluctuates with content performance, algorithm changes, and sponsor timing.",
    },
    benchmark_cluster_key: "creator_benchmark",
  },

  // ─── 9. Referral / Affiliate-Led ──────────────────────
  referral_affiliate_led: {
    family_id: "referral_affiliate_led",
    family_label: "Referral / Affiliate-Led",
    income_models: ["Affiliate / Referral Income"],
    common_weak_points: [
      "Income depends on traffic or referral volume",
      "Platform or program terms can change unilaterally",
      "Revenue tied to third-party product performance",
      "Limited forward visibility",
    ],
    supportive_patterns: [
      "Multiple affiliate programs or referral partners",
      "Evergreen content driving consistent referral traffic",
      "Recurring commission structures",
    ],
    primary_risk_scenarios: ["RS-PROGRAM-TERMS-CHANGE", "RS-TRAFFIC-DECLINE", "RS-PARTNER-DISCONTINUE", "RS-COMMISSION-RATE-CUT"],
    stronger_structure_signals: [
      "Recurring affiliate commissions (not one-time)",
      "5+ active affiliate or referral programs",
      "Owned traffic source (email, SEO) vs paid traffic",
      "Direct partnership agreements with committed terms",
    ],
    default_action_priorities: [
      { action_id: "ACT-AFF-01", label: "Prioritize programs with recurring commissions", description: "Focus on affiliate programs that pay recurring commissions, not just one-time referral fees.", why_now: "One-time commissions require constant new referrals", expected_effect: "Builds a compounding base of recurring commission income" },
      { action_id: "ACT-AFF-02", label: "Build owned traffic sources", description: "Develop SEO, email, or community-driven traffic instead of relying on paid or platform traffic.", why_now: "Paid traffic disappears when spending stops", expected_effect: "Creates sustainable referral volume independent of ad spend" },
      { action_id: "ACT-AFF-03", label: "Expand to 5+ active referral programs", description: "Diversify across programs so no single one exceeds 30% of affiliate income.", why_now: "Program terms can change without warning", expected_effect: "Protects against single-program dependency" },
    ],
    default_avoid_priorities: [
      "Do not treat a single affiliate program as a stable income source",
      "Do not count one-time referral bonuses as recurring income",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-AFF-01", condition: "Recurring commissions reach 30%+", display_text: "Reassess when recurring affiliate commissions reach 30% or more of total affiliate income." },
      { trigger_id: "RT-AFF-02", condition: "Active programs reach 5+", display_text: "Reassess when you have 5 or more active referral programs with no single one exceeding 30%." },
      { trigger_id: "RT-AFF-03", condition: "Owned traffic drives 50%+ of referral volume", display_text: "Reassess when your owned traffic sources drive 50% or more of referral volume." },
    ],
    explanation_translation_map: {
      low_forward_secured: "Affiliate and referral income arrives based on ongoing traffic and conversion. Very little is committed or guaranteed before the month begins.",
      high_concentration: "Too much referral income depends on a single program, partner, or traffic source.",
      high_labor_dependence: "Your current structure still depends on active content creation or traffic generation to maintain referral volume.",
      short_continuity: "If traffic or content production stops, referral income declines within weeks.",
      high_variability: "Affiliate income fluctuates with traffic patterns, conversion rates, and program changes.",
    },
    benchmark_cluster_key: "affiliate_benchmark",
  },

  // ─── 10. Asset / Rental-Led ───────────────────────────
  asset_rental_led: {
    family_id: "asset_rental_led",
    family_label: "Asset / Rental-Led",
    income_models: ["Real Estate Rental Income"],
    common_weak_points: [
      "Vacancy risk",
      "Tenant concentration if few units",
      "Maintenance and capital expenditure exposure",
      "Market-rate sensitivity",
    ],
    supportive_patterns: [
      "Long-term lease agreements",
      "Multiple properties or units",
      "Low historical vacancy rate",
      "Property management delegation",
    ],
    primary_risk_scenarios: ["RS-VACANCY", "RS-TENANT-DEFAULT", "RS-MAJOR-REPAIR", "RS-MARKET-RATE-DECLINE"],
    stronger_structure_signals: [
      "Average lease term exceeding 12 months",
      "Vacancy rate below 5%",
      "5+ rental units diversifying tenant risk",
      "Professional property management in place",
    ],
    default_action_priorities: [
      { action_id: "ACT-RNT-01", label: "Extend average lease terms to 12+ months", description: "Negotiate longer leases to improve forward visibility and reduce turnover costs.", why_now: "Short leases create continuous renewal risk and vacancy exposure", expected_effect: "Locks in rental income for longer periods" },
      { action_id: "ACT-RNT-02", label: "Add rental units to diversify tenant concentration", description: "Expand the portfolio so no single tenant accounts for more than 20% of rental income.", why_now: "Few-unit concentration means one vacancy has outsized impact", expected_effect: "Distributes vacancy risk across more tenants" },
      { action_id: "ACT-RNT-03", label: "Build capital reserve for vacancy and maintenance", description: "Maintain a reserve covering 3+ months of vacancy and major maintenance costs.", why_now: "Unexpected vacancy or repair can interrupt income without reserves", expected_effect: "Buffers against income interruption from vacancy or repairs" },
    ],
    default_avoid_priorities: [
      "Do not treat property appreciation as income stability",
      "Do not over-leverage to acquire additional units",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-RNT-01", condition: "Average lease term extends to 12+ months", display_text: "Reassess when your average lease term reaches 12 months or longer." },
      { trigger_id: "RT-RNT-02", condition: "Vacancy rate drops below 5%", display_text: "Reassess when your vacancy rate drops below 5%." },
      { trigger_id: "RT-RNT-03", condition: "Rental units reach 5+ with diversified tenants", display_text: "Reassess when you have 5 or more units with no single tenant exceeding 20% of rental income." },
    ],
    explanation_translation_map: {
      low_forward_secured: "While leases provide some forward visibility, short lease terms or upcoming vacancies reduce the certainty of future rental income.",
      high_concentration: "Too much rental income depends on a small number of tenants or a single property.",
      high_labor_dependence: "If you are personally managing properties, your availability directly affects income operations.",
      short_continuity: "Rental income continues during leases but vacancy between tenants creates income gaps.",
      high_variability: "Rental income varies with vacancy rates, maintenance timing, and market rate changes.",
    },
    benchmark_cluster_key: "rental_benchmark",
  },

  // ─── 11. Investment-Led ───────────────────────────────
  investment_led: {
    family_id: "investment_led",
    family_label: "Investment-Led",
    income_models: ["Investment / Dividend Income", "Licensing / Royalty Income"],
    common_weak_points: [
      "Market volatility affecting distribution levels",
      "Concentration in a single asset class or issuer",
      "Licensing terms subject to renewal or renegotiation",
      "Income sensitive to interest rate or policy changes",
    ],
    supportive_patterns: [
      "Diversified portfolio across asset classes",
      "Long-term licensing agreements",
      "Consistent or growing dividend history",
      "Multiple income-producing assets",
    ],
    primary_risk_scenarios: ["RS-DIVIDEND-CUT", "RS-MARKET-CORRECTION", "RS-LICENSE-NON-RENEWAL", "RS-INTEREST-RATE-SHIFT"],
    stronger_structure_signals: [
      "No single position exceeding 15% of investment income",
      "5+ income-producing positions or licenses",
      "10+ year track record of consistent distributions",
      "Multi-year licensing agreements with renewal options",
    ],
    default_action_priorities: [
      { action_id: "ACT-INV-01", label: "Reduce single-issuer or single-asset concentration", description: "Ensure no single investment or license accounts for more than 15% of income.", why_now: "Concentrated positions amplify the impact of a single cut or change", expected_effect: "Distributes risk across more income-producing positions" },
      { action_id: "ACT-INV-02", label: "Extend licensing or royalty agreement terms", description: "Negotiate longer terms with renewal options on licensing and royalty agreements.", why_now: "Short-term agreements create renewal risk at each expiration", expected_effect: "Extends forward visibility and reduces renegotiation exposure" },
      { action_id: "ACT-INV-03", label: "Shift toward consistent-payout investments", description: "Favor investments with long track records of stable or growing distributions.", why_now: "Volatile distributions reduce income predictability", expected_effect: "Smooths income and improves month-to-month consistency" },
    ],
    default_avoid_priorities: [
      "Do not treat capital gains as income stability",
      "Do not count unrealized appreciation as forward-secured income",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-INV-01", condition: "No single position exceeds 15%", display_text: "Reassess when no single investment position exceeds 15% of total investment income." },
      { trigger_id: "RT-INV-02", condition: "Income-producing positions reach 5+ across asset classes", display_text: "Reassess when you hold 5 or more income-producing positions across different asset classes." },
      { trigger_id: "RT-INV-03", condition: "Licensing agreement extended to 3+ years", display_text: "Reassess when a licensing or royalty agreement is extended to 3 or more years with a renewal option." },
    ],
    explanation_translation_map: {
      low_forward_secured: "Investment income depends on dividend declarations, distribution schedules, and licensing terms that can change. Forward certainty is moderate but not fully committed.",
      high_concentration: "Too much investment income depends on a single issuer, asset, or licensing arrangement.",
      high_variability: "Investment income varies based on market conditions, dividend policies, or royalty volumes.",
      high_labor_dependence: "Investment and licensing income should be labor-independent. If active management is still required, the passive benefit is limited.",
      short_continuity: "If dividends are cut or a license expires, the income stream stops without automatic replacement.",
    },
    benchmark_cluster_key: "investment_benchmark",
  },

  // ─── 12. Hybrid / Multi-Source ────────────────────────
  hybrid_multi: {
    family_id: "hybrid_multi",
    family_label: "Hybrid / Multi-Source",
    income_models: ["Hybrid Multiple Income Sources", "Business Ownership"],
    common_weak_points: [
      "Complexity of managing multiple income streams",
      "Risk of one dominant stream masking structural weakness",
      "Forward visibility varies by stream",
      "Difficulty tracking true concentration",
    ],
    supportive_patterns: [
      "Multiple independent income sources active simultaneously",
      "Mix of active and passive income",
      "At least one recurring component",
      "No single source exceeding 40% of total",
    ],
    primary_risk_scenarios: ["RS-DOMINANT-SOURCE-LOST", "RS-MANAGEMENT-OVERLOAD", "RS-CROSS-STREAM-CORRELATION", "RS-WEAKEST-STREAM-DRAG"],
    stronger_structure_signals: [
      "3+ truly independent income sources",
      "At least one passive or recurring stream",
      "No single source exceeding 30% of total",
      "Each source has its own forward visibility",
    ],
    default_action_priorities: [
      { action_id: "ACT-HYB-01", label: "Ensure no single source exceeds 30% of total income", description: "Rebalance income streams so no one source dominates the structure.", why_now: "A dominant source creates hidden concentration despite apparent diversity", expected_effect: "True structural diversification across income streams" },
      { action_id: "ACT-HYB-02", label: "Strengthen the passive or recurring component to 25%+", description: "Build recurring or passive income to at least 25% of total.", why_now: "Without a recurring floor, all streams depend on active effort", expected_effect: "Creates a baseline that continues without daily work" },
      { action_id: "ACT-HYB-03", label: "Verify income sources are truly independent", description: "Confirm that your income sources do not share the same clients, platforms, or market conditions.", why_now: "Correlated sources provide false diversification", expected_effect: "Ensures diversification benefit is real, not illusory" },
    ],
    default_avoid_priorities: [
      "Do not add more sources without strengthening existing ones first",
      "Do not treat complexity as diversification",
    ],
    reassessment_trigger_templates: [
      { trigger_id: "RT-HYB-01", condition: "No single source exceeds 30%", display_text: "Reassess when no single income source exceeds 30% of total." },
      { trigger_id: "RT-HYB-02", condition: "Passive or recurring component reaches 25%+", display_text: "Reassess when passive or recurring income reaches 25% or more of total." },
      { trigger_id: "RT-HYB-03", condition: "All major sources have independent forward visibility", display_text: "Reassess when each major income source has its own independent forward visibility." },
    ],
    explanation_translation_map: {
      low_forward_secured: "While multiple income streams exist, overall forward visibility depends on the weakest stream. Some components have limited committed income ahead.",
      high_concentration: "Despite multiple streams, one source still dominates. The diversification benefit is limited until the largest source is reduced.",
      high_labor_dependence: "Even with multiple streams, most still require your active involvement. The structure needs at least one stream that continues without daily effort.",
      short_continuity: "Continuity varies by stream. The overall continuity window is limited by the shortest-duration component.",
      high_variability: "Income fluctuates as different streams perform unevenly. The overall pattern reflects the most volatile component.",
    },
    benchmark_cluster_key: "hybrid_benchmark",
  },
};
