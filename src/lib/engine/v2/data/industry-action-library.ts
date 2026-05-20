// ═══════════════════════════════════════════════════════════════
// Industry-Specific Action Translation Library
// Maps constraints to buyer-facing action guidance by sector
// ═══════════════════════════════════════════════════════════════

import type {
  IndustrySector,
  PrimaryIncomeModel,
  RevenueStructure,
  ConstraintKey,
} from "../types";

export interface IndustryActionTemplate {
  industry_sector: IndustrySector | "other";
  primary_income_model?: PrimaryIncomeModel;
  revenue_structure?: RevenueStructure;
  constraint_key: ConstraintKey;
  action_title: string;
  selected_because_template: string;
  target_metric_template: string;
  first_step_template: string;
  avoid_first_template: string;
  reassess_when_template: string;
}

// ─── HEALTHCARE ───────────────────────────────────────────────

const HEALTHCARE_TEMPLATES: IndustryActionTemplate[] = [
  {
    industry_sector: "healthcare",
    primary_income_model: "commission",
    constraint_key: "weak_forward_visibility",
    action_title: "Lock in Referral Commitments",
    selected_because_template:
      "Your referral pipeline is unpredictable. Healthcare networks value predictable partnerships. A formal referral agreement gives both sides certainty.",
    target_metric_template:
      "Convert your top 2–3 referral relationships into written agreements with quarterly volume targets, increasing forward visibility from {{forward_secured_pct}}% to {{target_forward}}%",
    first_step_template:
      "Schedule quarterly planning calls with your top referral sources. Propose a minimum volume commitment with performance reviews each quarter.",
    avoid_first_template:
      "Do not try to onboard 5+ new referrers before stabilizing existing ones. Deep relationships with 2–3 committed partners beat shallow ones with many.",
    reassess_when_template:
      "Reassess in 90 days. If written agreements increase visibility to 50%+, you can expand to new referrers. If not, go deeper with existing partners.",
  },
  {
    industry_sector: "healthcare",
    primary_income_model: "retainer",
    constraint_key: "high_concentration",
    action_title: "Expand Into New Healthcare Verticals",
    selected_because_template:
      "You are overly dependent on one healthcare setting or patient population. Diversifying across 2–3 verticals (e.g., primary care + urgent care + telehealth) reduces catastrophic risk.",
    target_metric_template:
      "Move your largest client from {{largest_source_pct}}% to under 40% by adding 1–2 new health system or practice contracts in a different setting within 120 days",
    first_step_template:
      "Map the healthcare verticals in your region: primary care networks, urgent care centers, telemedicine platforms, or specialty practices. Identify 3 that align with your expertise.",
    avoid_first_template:
      "Do not spread too thin. Focus on 1–2 new verticals, not 5. Each requires relationship building and contract negotiation.",
    reassess_when_template:
      "Reassess in 120 days. If your largest source drops to 40%+ revenue, diversification is working. If not, deepen existing contracts before adding new verticals.",
  },
  {
    industry_sector: "healthcare",
    constraint_key: "low_persistence",
    action_title: "Convert Ad-Hoc Work to Care Partnerships",
    selected_because_template:
      "Your income is project-based, but healthcare networks need stability. Replacing episodic contracts with standing care partnerships converts uncertainty into repeating revenue.",
    target_metric_template:
      "Convert at least 2 episodic contracts into annual care agreements, moving recurring revenue from {{income_persistence_pct}}% to {{target_persistence}}%",
    first_step_template:
      "Review your last 6 months of ad-hoc work. Identify 2–3 health systems or practices you served repeatedly. Propose an annual retainer for standing services.",
    avoid_first_template:
      "Do not renegotiate existing one-off contracts downward. Instead, propose new standing arrangements at fair retainer rates beside existing projects.",
    reassess_when_template:
      "Reassess in 90 days. Each annual agreement you sign frees capacity from constant re-prospecting. After 2–3 conversions, you should feel measurable revenue stability.",
  },
];

// ─── REAL ESTATE ──────────────────────────────────────────────

const REAL_ESTATE_TEMPLATES: IndustryActionTemplate[] = [
  {
    industry_sector: "real_estate",
    primary_income_model: "commission",
    constraint_key: "weak_forward_visibility",
    action_title: "Build Listing Pipeline Depth",
    selected_because_template:
      "Real estate commission income is lumpy without a deep pipeline. Listing agreements give you forward visibility. Your current visibility is {{forward_secured_pct}}%.",
    target_metric_template:
      "Secure written listing agreements or repeat-client commitments representing {{target_forward}}%+ of projected 90-day revenue",
    first_step_template:
      "Identify your 5–10 best seller relationships. Schedule quarterly reviews to discuss upcoming listings. Commit to co-listing or exclusive relationships.",
    avoid_first_template:
      "Do not pursue cold listings while ignoring repeat clients. Existing relationships yield predictable pipeline faster than new prospecting.",
    reassess_when_template:
      "Reassess in 90 days. If your pipeline agreements cover 60%+ of projected revenue, visibility is solid. Otherwise, deepen repeat-client relationships further.",
  },
  {
    industry_sector: "real_estate",
    primary_income_model: "commission",
    constraint_key: "high_concentration",
    action_title: "Diversify Across Property Types or Markets",
    selected_because_template:
      "You are heavily concentrated in one property type or market. Real estate agents who serve residential + commercial, or multiple submarkets, reduce single-market risk.",
    target_metric_template:
      "Reduce your largest market/property type from {{largest_source_pct}}% to under 45% by closing deals in 1–2 new segments within 120 days",
    first_step_template:
      "List the segments you currently serve (residential, commercial, industrial, luxury, etc.). Pick 1–2 adjacent segments where you can leverage existing expertise.",
    avoid_first_template:
      "Do not try to master 5 segments at once. Add 1–2 new segments and develop expertise there before expanding further.",
    reassess_when_template:
      "Reassess in 120 days. Track your top 3 revenue sources. If no single source exceeds 45%, concentration risk has decreased meaningfully.",
  },
];

// ─── FINANCE & BANKING ─────────────────────────────────────────

const FINANCE_BANKING_TEMPLATES: IndustryActionTemplate[] = [
  {
    industry_sector: "finance_banking",
    primary_income_model: "commission",
    constraint_key: "high_labor_dependence",
    action_title: "Build Automated Client Service Streams",
    selected_because_template:
      "Your {{labor_dependence_pct}}% labor dependence ties you to constant prospecting and client service. Finance professionals who build automated advisory or recurring fee streams unlock capacity.",
    target_metric_template:
      "Create 1 recurring fee product or managed service that generates 10%+ of revenue without daily labor (e.g., automated portfolio reviews, recurring advisory retainers)",
    first_step_template:
      "Identify your most common advice or service. Standardize it into a fixed-scope retainer or service tier. Market it as 'managed advisory' or 'VIP portfolio reviews.'",
    avoid_first_template:
      "Do not try to build a fully passive product on first attempt. A semi-passive service (quarterly reviews, monthly check-ins) is a fast win.",
    reassess_when_template:
      "Reassess in 120 days. If your recurring fee streams are 10%+ of revenue, labor dependence has loosened. You can then scale it or build a second stream.",
  },
  {
    industry_sector: "finance_banking",
    primary_income_model: "retainer",
    constraint_key: "weak_durability",
    action_title: "Extend Client Lock-In Terms",
    selected_because_template:
      "Your retainer clients can cancel month-to-month. Finance relationships need durability. Annual or multi-year contracts reduce client churn and revenue fragility.",
    target_metric_template:
      "Convert 3–5 of your month-to-month clients to annual or multi-year agreements, improving durability grade and reducing quarterly termination risk",
    first_step_template:
      "Review your current client roster. Identify 5 stable, long-term clients. Propose switching to annual billing with a 5–10% discount for commitment.",
    avoid_first_template:
      "Do not raise prices when moving to longer terms. Offer a discount for commitment. The longer lock-in is more valuable than the rate cut.",
    reassess_when_template:
      "Reassess in 90 days. Count your clients on month-to-month vs. annual+ terms. If 60%+ are on annual agreements, durability has improved measurably.",
  },
];

// ─── INSURANCE ────────────────────────────────────────────────

const INSURANCE_TEMPLATES: IndustryActionTemplate[] = [
  {
    industry_sector: "insurance",
    primary_income_model: "commission",
    constraint_key: "high_variability",
    action_title: "Build Recurring Policy Review Income",
    selected_because_template:
      "Insurance commission income is lumpy and seasonal. Agents and brokers who create recurring review agreements smooth monthly cash flow and reduce variance from {{income_persistence_pct}}%.",
    target_metric_template:
      "Establish annual policy review retainers with 5–10 clients, creating predictable recurring revenue of {{target_persistence}}%+ per month",
    first_step_template:
      "Contact your 10 longest-term clients. Offer 'annual policy reviews' as a retainer service ($X/month for quarterly or annual reviews). Position it as 'ensuring your coverage stays current.'",
    avoid_first_template:
      "Do not tie review retainers to commission-earning policy changes. Make them fixed retainers. If the review uncovers new coverage, that's a separate commission event.",
    reassess_when_template:
      "Reassess in 180 days. If you have 5+ review retainers, monthly revenue should be smoother. Variability should decline noticeably.",
  },
  {
    industry_sector: "insurance",
    constraint_key: "shallow_continuity",
    action_title: "Establish Automatic Renewal Continuity",
    selected_because_template:
      "Your policies renew but you are not accruing renewal income predictably. Creating renewal continuity streams (ongoing access to renewal commissions, agency networks) gives income that persists without active work.",
    target_metric_template:
      "Lock in renewal agreements or agency affiliations that guarantee renewal income for 12+ months, creating continuity of at least {{target_continuity_months}} months",
    first_step_template:
      "Map your book of business: which clients renew? Which are agency renewals vs. direct? Negotiate renewal agreements with top clients; join agency networks that pay renewal residuals.",
    avoid_first_template:
      "Do not onboard dozens of new clients at the expense of renewal agreements with existing ones. Renewals are cheaper income to maintain.",
    reassess_when_template:
      "Reassess in 120 days. Calculate your renewal income base: if it covers 2–3 months of operating costs, continuity is solid.",
  },
];

// ─── CONSULTING & PROFESSIONAL SERVICES ───────────────────────

const CONSULTING_TEMPLATES: IndustryActionTemplate[] = [
  {
    industry_sector: "consulting_professional_services",
    primary_income_model: "project_fee",
    constraint_key: "low_persistence",
    action_title: "Convert Projects to Retainer Advisory",
    selected_because_template:
      "Consultants with project-based revenue ({{income_persistence_pct}}% recurring) face gaps between engagements. Moving 2–3 project clients to monthly retainers fills gaps and creates predictable income.",
    target_metric_template:
      "Convert {{num_projects_to_convert}} project-based clients to monthly advisory retainers, lifting recurring revenue to {{target_persistence}}%+",
    first_step_template:
      "Identify 2–3 project clients you have worked with 3+ times. Propose a monthly 'advisory retainer' (10–20 hours/month) covering strategy, reviews, and ad-hoc guidance.",
    avoid_first_template:
      "Do not drop project fees when proposing retainers. Retainers should be attractive because they free your time, not because they cost less per hour.",
    reassess_when_template:
      "Reassess in 90 days. If 2–3 retainers are active, you should see measurable recurring revenue growth. Each conversion locks in ~{{retainer_monthly_value}} monthly revenue.",
  },
  {
    industry_sector: "consulting_professional_services",
    primary_income_model: "retainer",
    constraint_key: "high_concentration",
    action_title: "Acquire Complementary Clients in Your Niche",
    selected_because_template:
      "Your largest retainer is {{largest_source_pct}}% of income. Consultants who add 1–2 clients in the same niche (not new niches) reduce concentration without learning new domains.",
    target_metric_template:
      "Land 1–2 new retainer clients in your same vertical/niche, reducing your largest source to under 50% of revenue within 120 days",
    first_step_template:
      "List 5–10 companies similar to your largest retainer (same industry, size, problem set). Research their recent news. Pitch a 'strategic advisory retainer' as a fit.",
    avoid_first_template:
      "Do not chase entirely new verticals. Stay in your domain of expertise. Selling a new vertical costs 2–3x the effort and has 1/3 the conversion rate.",
    reassess_when_template:
      "Reassess in 120 days. If you have signed 1–2 new retainers in your niche, concentration should drop and revenue predictability should improve.",
  },
];

// ─── GENERIC / FALLBACK TEMPLATES ──────────────────────────

const GENERIC_TEMPLATES: IndustryActionTemplate[] = [
  {
    industry_sector: "other",
    constraint_key: "weak_forward_visibility",
    action_title: "Secure Forward Revenue Commitments",
    selected_because_template:
      "Your forward visibility is only {{forward_secured_pct}}%. Earning predictably requires converting pipeline or prospects into signed commitments.",
    target_metric_template:
      "Increase forward-secured revenue to {{target_forward}}% by converting 2–3 prospects into signed agreements or retainers within 30 days",
    first_step_template:
      "List every prospect or opportunity you expect to close in the next 60 days. For each, set a target close date. Follow up weekly until committed or rejected.",
    avoid_first_template:
      "Do not over-discount to close pipeline. A slightly smaller deal with commitment beats a steep discount that erodes margins.",
    reassess_when_template:
      "Reassess in 30 days. If signed commitments cover 50%+ of your target next-month revenue, forward visibility is solid.",
  },
  {
    industry_sector: "other",
    constraint_key: "high_concentration",
    action_title: "Reduce Single-Source Concentration Risk",
    selected_because_template:
      "Your largest revenue source is {{largest_source_pct}}% of income. Diversification into 2–3 additional sources cuts your risk of catastrophic loss if one relationship fails.",
    target_metric_template:
      "Bring your largest source below 50% by acquiring 1–2 new clients or revenue lines that each contribute 10%+, within 90 days",
    first_step_template:
      "Define who your 'ideal next client' is. Spend 2 weeks finding 5–10 prospects who match. Pitch them within the next 2 weeks.",
    avoid_first_template:
      "Do not abandon your largest client to diversify. Add new sources while keeping your top client. Firing them to focus on growth is rarely the answer.",
    reassess_when_template:
      "Reassess in 90 days. Track your top 3 sources. If none exceeds 50%, you have materially reduced concentration risk.",
  },
  {
    industry_sector: "other",
    constraint_key: "high_labor_dependence",
    action_title: "Build Non-Labor Revenue Streams",
    selected_because_template:
      "You depend on active work for {{labor_dependence_pct}}% of income. Creating even one stream (retainer, product, licensing) that generates 10%+ without daily labor is transformative.",
    target_metric_template:
      "Launch 1 non-labor revenue stream (retainer, digital product, licensing, affiliate, etc.) generating {{target_passive_pct}}%+ of monthly income within 60 days",
    first_step_template:
      "Identify your most repeated deliverable or expertise. Package it as a fixed-price service, digital product, or licensing arrangement. Offer it to 5 existing clients first.",
    avoid_first_template:
      "Do not expect passive income day 1. The first 60 days are building phase. Revenue grows weeks 4–12. Patience is essential.",
    reassess_when_template:
      "Reassess in 90 days. If your non-labor stream is 10%+ revenue, you have unlocked leverage. Consider scaling it or building a second stream.",
  },
  {
    industry_sector: "other",
    constraint_key: "low_persistence",
    action_title: "Convert Active Revenue to Recurring Income",
    selected_because_template:
      "Your recurring revenue is only {{income_persistence_pct}}%. Moving even 1–2 project clients to monthly retainers can double your predictable income base.",
    target_metric_template:
      "Convert {{num_projects_to_convert}} project or transactional clients to monthly retainers, lifting recurring revenue from {{income_persistence_pct}}% to {{target_persistence}}%",
    first_step_template:
      "Review last 12 months of clients. List every client you served 2+ times (repeat work = conversion opportunity). Propose a monthly retainer to the best 2–3.",
    avoid_first_template:
      "Do not convert to lower-margin retainers. Price retainers fairly. You are trading project flexibility for predictability; the margin should be similar.",
    reassess_when_template:
      "Reassess in 90 days. Each converted client should be locked in for 3+ months. Your recurring revenue baseline should show clear upward shift.",
  },
  {
    industry_sector: "other",
    constraint_key: "high_variability",
    action_title: "Stabilize Monthly Cash Flow",
    selected_because_template:
      "Your monthly earnings swing too much ({{income_variability_level}}). Smoothing through retainers, payment plans, or consistent delivery reduces stress and improves planning.",
    target_metric_template:
      "Reduce month-to-month income swings by 20%+ by converting your most volatile clients to fixed monthly payments or splitting invoices into installments",
    first_step_template:
      "List your last 6 months of revenue. Identify the 2–3 most variable clients. Propose fixed monthly fees or payment plans to them.",
    avoid_first_template:
      "Do not sacrifice upside peaks to smooth lows. Aim for a stable baseline with upside optionality, not a hard ceiling.",
    reassess_when_template:
      "Reassess in 90 days. Calculate month-to-month variance. If swings are 20%+ smaller, cash flow stability is improving.",
  },
  {
    industry_sector: "other",
    constraint_key: "weak_durability",
    action_title: "Strengthen Revenue Durability and Lock-In",
    selected_because_template:
      "Your revenue is fragile: high cancellation risk or short notice terms. Extending contract terms and reducing platform dependency hardens your foundation.",
    target_metric_template:
      "Lock in 2–3 major contracts with 6+ month terms or cancellation notice requirements, reducing quarterly revenue churn risk",
    first_step_template:
      "List your 5 largest revenue sources. For each, check the contract term and cancellation terms. Propose renegotiation to 6+ months with notice requirements.",
    avoid_first_template:
      "Do not give away margin to get longer terms. Frame longer terms as 'mutual commitment' that benefits both sides equally.",
    reassess_when_template:
      "Reassess in 90 days. Check how much of your quarterly revenue is locked in 6+ month contracts. Target 60%+ for durability.",
  },
  {
    industry_sector: "other",
    constraint_key: "shallow_continuity",
    action_title: "Build Income That Continues Without Active Work",
    selected_because_template:
      "Your income continuity is only {{continuity_months}} months: if work stops, income dries up within weeks. Building continuity of 90+ days creates a real buffer.",
    target_metric_template:
      "Create {{continuity_streams_needed}} income stream(s) that would generate revenue for 90+ days if all active work stopped, securing {{target_continuity_months}} months of continuity",
    first_step_template:
      "List every retainer, subscription, renewal, or backend commission you have. How long would these pay if you stopped prospecting? Target 3+ months.",
    avoid_first_template:
      "Do not ignore backward-looking continuity (renewals, retainers). Focus on what already exists before building new passive streams.",
    reassess_when_template:
      "Reassess in 120 days. Calculate true continuity: months of locked revenue if all active work stopped. Target 90+ days.",
  },
];

// ─── LIBRARY ASSEMBLY ──────────────────────────────────────────

export const INDUSTRY_ACTION_LIBRARY: IndustryActionTemplate[] = [
  ...HEALTHCARE_TEMPLATES,
  ...REAL_ESTATE_TEMPLATES,
  ...FINANCE_BANKING_TEMPLATES,
  ...INSURANCE_TEMPLATES,
  ...CONSULTING_TEMPLATES,
  ...GENERIC_TEMPLATES,
];

export function findActionTemplate(
  sector: IndustrySector | "other",
  incomeModel: string | undefined,
  revenueStructure: string | undefined,
  constraintKey: ConstraintKey,
): IndustryActionTemplate | undefined {
  // Fallback order:
  // 1. exact industry + income model + revenue structure + constraint
  // 2. industry + income model + constraint
  // 3. industry + constraint
  // 4. other + constraint
  // 5. generic root action fallback

  if (sector !== "other" && incomeModel && revenueStructure) {
    const exact = INDUSTRY_ACTION_LIBRARY.find(
      (t) =>
        t.industry_sector === sector &&
        t.primary_income_model === incomeModel &&
        t.revenue_structure === revenueStructure &&
        t.constraint_key === constraintKey,
    );
    if (exact) return exact;
  }

  if (sector !== "other" && incomeModel) {
    const incomeMatch = INDUSTRY_ACTION_LIBRARY.find(
      (t) =>
        t.industry_sector === sector &&
        t.primary_income_model === incomeModel &&
        !t.revenue_structure &&
        t.constraint_key === constraintKey,
    );
    if (incomeMatch) return incomeMatch;
  }

  if (sector !== "other") {
    const sectorMatch = INDUSTRY_ACTION_LIBRARY.find(
      (t) =>
        t.industry_sector === sector &&
        !t.primary_income_model &&
        !t.revenue_structure &&
        t.constraint_key === constraintKey,
    );
    if (sectorMatch) return sectorMatch;
  }

  const genericMatch = INDUSTRY_ACTION_LIBRARY.find(
    (t) =>
      t.industry_sector === "other" &&
      !t.primary_income_model &&
      t.constraint_key === constraintKey,
  );
  if (genericMatch) return genericMatch;

  return undefined;
}
