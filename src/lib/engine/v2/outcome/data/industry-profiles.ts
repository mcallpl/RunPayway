// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Industry Refinement Profiles (OL-1.0 Phase 2)
// 19 industries with override logic — full sector coverage
// ═══════════════════════════════════════════════════════════════

import type { IndustryProfile } from "../types";

export const INDUSTRY_PROFILES: Record<string, IndustryProfile> = {

  // ─── 1. Real Estate ───────────────────────────────────
  real_estate: {
    industry_id: "real_estate",
    industry_label: "Real Estate",
    applicable_income_models: [
      "Commission-Based", "Real Estate Brokerage Income", "Real Estate Rental Income",
      "Agency / Brokerage Income", "Investment / Dividend Income",
    ],
    scenario_emphasis: ["RS-PIPELINE-DRY", "RS-DEAL-DELAYED", "RS-MARKET-SLOWDOWN", "RS-VACANCY"],
    stronger_structure_overrides: [
      "Property management income alongside transactional brokerage",
      "Recurring referral fee arrangements with past clients",
      "Team structure sharing listings and deal flow",
      "Rental portfolio generating lease-based income",
      "Forward pipeline of listings or closings under contract",
    ],
    action_priority_overrides: [
      { action_id: "ACT-RE-01", label: "Build a property management or recurring income layer", description: "Add management fees, referral residuals, or rental income alongside brokerage commissions.", why_now: "Transaction-only income has no floor between closings", expected_effect: "Creates baseline income that persists between deal cycles" },
      { action_id: "ACT-RE-02", label: "Extend pipeline to 3+ months of active listings or committed deals", description: "Maintain a pipeline of signed listings, active buyers, or committed closings extending at least 90 days.", why_now: "Real estate pipeline gaps create unpredictable income droughts", expected_effect: "Smooths income across market cycles" },
      { action_id: "ACT-RE-03", label: "Diversify beyond single transaction type", description: "Add a secondary revenue line — rentals, property management, referral partnerships, or advisory services.", why_now: "Single-transaction-type income concentrates market risk", expected_effect: "Reduces sensitivity to any single market segment" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-RE-01", condition: "Recurring management or rental income reaches 15%+", display_text: "Reassess when recurring real estate income reaches 15% or more of total." },
      { trigger_id: "RT-RE-02", condition: "Pipeline extends to 90+ days of signed activity", display_text: "Reassess when your pipeline of signed listings or committed deals extends 90 or more days." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too little of your pipeline is already tied to active closings, signed listings, or committed future business. Income depends on deals that have not yet materialized.",
      high_concentration: "Your real estate income depends too heavily on a single transaction type, market segment, or referral source.",
      high_labor_dependence: "Your income requires your continued active selling, listing, and deal management. There is no income that continues if you step away from transactions.",
      high_variability: "Real estate income naturally fluctuates with deal timing, market cycles, and seasonal patterns. The structure has not yet smoothed this with recurring revenue.",
      short_continuity: "If you stop active real estate work, income from closings stops quickly. There is limited trailing or residual income.",
    },
    benchmark_framing: {
      framing_text: "Among real estate professionals in your market tier",
      peer_group_label: "Real Estate",
    },
  },

  // ─── 2. Professional Services ─────────────────────────
  consulting_professional_services: {
    industry_id: "consulting_professional_services",
    industry_label: "Professional Services",
    applicable_income_models: [
      "Consulting / Client Services", "Professional Practice",
      "Contract-Based", "Independent Contractor",
    ],
    scenario_emphasis: ["RS-TOP-CLIENT-LOST", "RS-GAP-PERIOD", "RS-TOP-RETAINER-LOST", "RS-PRICING-PRESSURE"],
    stronger_structure_overrides: [
      "Advisory retainers replacing project-only engagements",
      "Fractional or board-level roles providing baseline income",
      "Multi-year advisory agreements with renewal provisions",
      "Diversified client base with no single client exceeding 25%",
      "Associate or partner carrying part of the service delivery load",
    ],
    action_priority_overrides: [
      { action_id: "ACT-PS-01", label: "Convert project engagements into advisory retainers", description: "Move at least one client from project-based to a monthly or quarterly retainer.", why_now: "Project-only work creates gap risk between engagements", expected_effect: "Creates recurring baseline income between projects" },
      { action_id: "ACT-PS-02", label: "Secure next engagement before current one ends", description: "Build a pipeline habit so the next project is signed before the current one concludes.", why_now: "Gap periods are the primary income risk for professional services", expected_effect: "Eliminates zero-income periods between engagements" },
      { action_id: "ACT-PS-03", label: "Diversify client base to reduce top-client risk", description: "Ensure no single client accounts for more than 25% of total revenue.", why_now: "Client concentration amplifies the impact of losing any one relationship", expected_effect: "Distributes risk across a broader client base" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-PS-01", condition: "Retainer revenue reaches 25%+ of total", display_text: "Reassess when retainer or recurring advisory revenue reaches 25% or more of total." },
      { trigger_id: "RT-PS-02", condition: "No engagement gap exceeding 30 days in trailing 6 months", display_text: "Reassess after maintaining continuous engagements with no gap exceeding 30 days for 6 months." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too little future professional services revenue is already committed through retainers, signed engagements, or forward-booked advisory work.",
      high_concentration: "Your professional services revenue depends too heavily on a small number of clients. Losing the top client would create a significant revenue gap.",
      high_labor_dependence: "Your income depends on your continued personal delivery of services. There is limited income that continues without your direct involvement.",
      short_continuity: "Between engagements, income drops to zero unless retainers or forward-committed work is in place.",
    },
    benchmark_framing: {
      framing_text: "Among professional services providers in your practice area",
      peer_group_label: "Professional Services",
    },
  },

  // ─── 3. Agency / Client Services ──────────────────────
  agency_client_services: {
    industry_id: "agency_client_services",
    industry_label: "Agency / Client Services",
    applicable_income_models: [
      "Agency / Brokerage Income", "Team / Partnership Income",
      "Consulting / Client Services",
    ],
    scenario_emphasis: ["RS-TOP-ACCOUNT-LOST", "RS-FOUNDER-UNAVAILABLE", "RS-BUDGET-SEASON-CUT", "RS-SCOPE-CREEP"],
    stronger_structure_overrides: [
      "Retainer base covering 60%+ of fixed operating costs",
      "No single client exceeding 20% of agency revenue",
      "Team-based delivery — founder not required on every account",
      "Multi-year contracts with annual renewal provisions",
      "New business pipeline extending 3+ months of committed revenue",
    ],
    action_priority_overrides: [
      { action_id: "ACT-AG-01", label: "Build retainer base to cover 60%+ of fixed costs", description: "Grow the retainer revenue base until it covers the majority of fixed operating expenses.", why_now: "Without retainer coverage, every lost project threatens payroll and operations", expected_effect: "Creates operational stability independent of project wins" },
      { action_id: "ACT-AG-02", label: "Reduce top-account concentration below 20%", description: "Grow the client portfolio so no single account drives more than 20% of total revenue.", why_now: "Agency account concentration creates existential risk from a single client loss", expected_effect: "Protects the agency from catastrophic revenue loss" },
      { action_id: "ACT-AG-03", label: "Remove founder from day-to-day delivery on all accounts", description: "Ensure team members can deliver on every account without the founder's direct involvement.", why_now: "Founder dependency limits growth and creates interruption risk", expected_effect: "Agency revenue continues when the founder is unavailable" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-AG-01", condition: "Retainer base covers 60%+ of fixed costs", display_text: "Reassess when your retainer revenue base covers 60% or more of fixed operating costs." },
      { trigger_id: "RT-AG-02", condition: "No single account exceeds 20% of revenue", display_text: "Reassess when no single client account exceeds 20% of total agency revenue." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too little of the agency's future revenue is protected by signed retainers, renewal commitments, or forward-contracted work.",
      high_concentration: "A small number of accounts drive most agency revenue. Losing the largest would create a gap that threatens operations and payroll.",
      high_labor_dependence: "Key client relationships and delivery still depend on the founder or a small number of individuals rather than the team.",
    },
    benchmark_framing: {
      framing_text: "Among agencies and client services firms in your size range",
      peer_group_label: "Agency / Client Services",
    },
  },

  // ─── 4. Private Practice / Coaching ───────────────────
  private_practice_coaching: {
    industry_id: "private_practice_coaching",
    industry_label: "Private Practice / Coaching",
    applicable_income_models: [
      "Professional Practice", "Consulting / Client Services",
    ],
    scenario_emphasis: ["RS-PRACTITIONER-UNAVAILABLE", "RS-CASELOAD-DECLINE", "RS-REFERRAL-SOURCE-LOST"],
    stronger_structure_overrides: [
      "Associate or contractor carrying 20%+ of caseload",
      "Recurring membership or group program revenue",
      "Forward-booked schedule extending 6+ weeks",
      "Multiple active referral sources — no single source exceeding 30%",
      "Digital products or courses generating passive income alongside practice",
    ],
    action_priority_overrides: [
      { action_id: "ACT-PP-01", label: "Add an associate to carry part of the caseload", description: "Bring on a practitioner who can serve clients independently, reducing your personal delivery burden.", why_now: "If you are unavailable, 100% of practice income stops", expected_effect: "Creates income continuity during illness, leave, or burnout" },
      { action_id: "ACT-PP-02", label: "Create a group program or membership tier", description: "Offer group sessions, memberships, or programs that serve more clients with less one-on-one time.", why_now: "One-on-one appointment income has no leverage and no floor", expected_effect: "Adds scalable recurring revenue alongside individual practice" },
      { action_id: "ACT-PP-03", label: "Extend forward-booked schedule to 6+ weeks", description: "Maintain a booking calendar that shows committed appointments extending at least 6 weeks ahead.", why_now: "Short booking windows mean income visibility is limited to days or weeks", expected_effect: "Improves forward security and planning confidence" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-PP-01", condition: "Associate carrying 20%+ of caseload", display_text: "Reassess when an associate or contractor handles 20% or more of your caseload." },
      { trigger_id: "RT-PP-02", condition: "Group or membership revenue reaches 15%+", display_text: "Reassess when group program or membership revenue reaches 15% or more of total." },
    ],
    explanation_language_overrides: {
      high_labor_dependence: "Your practice income depends entirely on your personal availability to see clients. If you are unavailable for any reason, income stops immediately.",
      low_forward_secured: "Forward visibility is limited to your current booking calendar. Beyond scheduled appointments, there is no committed income.",
      short_continuity: "Practice income stops when you stop seeing clients. There is no passive, digital, or recurring component to bridge an absence.",
    },
    benchmark_framing: {
      framing_text: "Among private practitioners and coaches in your specialty",
      peer_group_label: "Private Practice / Coaching",
    },
  },

  // ─── 5. Creator / Media ───────────────────────────────
  creator_media: {
    industry_id: "creator_media",
    industry_label: "Creator / Media",
    applicable_income_models: [
      "Creator / Media Income", "Digital Product Sales",
      "Affiliate / Referral Income", "Licensing / Royalty Income",
    ],
    scenario_emphasis: ["RS-PLATFORM-ALGO-CHANGE", "RS-SPONSOR-PULLBACK", "RS-AUDIENCE-DECLINE", "RS-CONTENT-BURNOUT"],
    stronger_structure_overrides: [
      "Recurring community or membership revenue at 25%+",
      "Direct audience channel (email list) with 5,000+ subscribers",
      "Evergreen digital products generating sales without active promotion",
      "3+ monetization methods active — sponsors, products, memberships, licensing",
      "Owned platform or distribution channel independent of social algorithms",
    ],
    action_priority_overrides: [
      { action_id: "ACT-CR-01", label: "Build recurring community or membership revenue to 25%+", description: "Create a paid community, membership, or subscription that generates predictable monthly income.", why_now: "Ad and sponsor revenue is episodic with no guaranteed floor", expected_effect: "Creates a recurring base that persists independent of content performance" },
      { action_id: "ACT-CR-02", label: "Build a direct audience channel you own", description: "Grow an email list, owned community, or direct subscriber base that is not dependent on any social platform.", why_now: "Platform algorithms can change without notice and reduce your reach overnight", expected_effect: "Protects audience access and monetization from platform dependency" },
      { action_id: "ACT-CR-03", label: "Launch evergreen products that sell without active promotion", description: "Create courses, templates, tools, or digital products that generate revenue continuously.", why_now: "All current income requires active content creation", expected_effect: "Adds passive revenue that continues during creative breaks" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-CR-01", condition: "Membership or community revenue reaches 25%+", display_text: "Reassess when recurring community or membership income reaches 25% or more of total." },
      { trigger_id: "RT-CR-02", condition: "Email list or owned channel reaches 5,000+ engaged contacts", display_text: "Reassess when your direct audience channel reaches 5,000 or more engaged subscribers." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too little future income is supported by recurring members, retained sponsors, or evergreen monetization. Most income depends on ongoing content performance.",
      high_concentration: "Too much income flows through a single platform, sponsor, or monetization method. A change in any one of them would significantly reduce total income.",
      high_labor_dependence: "Income depends on your continued content production. If you take a creative break, income declines within weeks.",
      high_variability: "Creator income fluctuates with content performance, algorithm changes, and sponsor timing. There is no floor to stabilize weak months.",
    },
    benchmark_framing: {
      framing_text: "Among creators and media professionals in your content category",
      peer_group_label: "Creator / Media",
    },
  },

  // ─── 6. E-commerce / Product ──────────────────────────
  ecommerce_product: {
    industry_id: "ecommerce_product",
    industry_label: "E-commerce / Product",
    applicable_income_models: [
      "Product Sales", "Digital Product Sales", "Franchise Ownership",
    ],
    scenario_emphasis: ["RS-DEMAND-DROP", "RS-CHANNEL-DISRUPTION", "RS-INVENTORY-DELAY", "RS-PLATFORM-ALGO-CHANGE"],
    stronger_structure_overrides: [
      "Subscription or auto-reorder revenue covering 25%+ of sales",
      "3+ independent sales channels — no single channel exceeding 40%",
      "Repeat customer rate above 40% driven by retention programs",
      "Diversified product catalog — no single SKU exceeding 30% of revenue",
      "Direct-to-consumer channel reducing marketplace dependency",
    ],
    action_priority_overrides: [
      { action_id: "ACT-EC-01", label: "Build subscription or auto-reorder revenue to 25%+", description: "Create a recurring purchase program — subscriptions, refill plans, or membership boxes.", why_now: "One-time sales require constant acquisition with no predictable baseline", expected_effect: "Creates predictable recurring revenue alongside one-time sales" },
      { action_id: "ACT-EC-02", label: "Sell through 3+ independent channels", description: "Distribute products across your own site, marketplaces, wholesale, and retail — no single channel exceeding 40%.", why_now: "Single-channel dependency exposes all revenue to platform policy changes", expected_effect: "Protects against channel-specific disruptions or fee changes" },
      { action_id: "ACT-EC-03", label: "Increase repeat customer rate above 40%", description: "Build loyalty programs, email flows, and replenishment reminders that drive repeat purchases.", why_now: "Low repeat rates mean continuous acquisition pressure and unpredictable revenue", expected_effect: "Reduces acquisition dependency and creates more predictable revenue patterns" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-EC-01", condition: "Subscription revenue reaches 25%+ of total sales", display_text: "Reassess when subscription or auto-reorder revenue reaches 25% or more of total sales." },
      { trigger_id: "RT-EC-02", condition: "Sales channels reach 3+ with no single channel exceeding 40%", display_text: "Reassess when you sell through 3 or more independent channels with no single one exceeding 40%." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Product revenue depends on ongoing customer demand. There is limited pre-sold, subscribed, or committed revenue before the month begins.",
      high_concentration: "Revenue is concentrated in a single product line, sales channel, or marketplace. A disruption to that channel would disproportionately affect total income.",
      high_variability: "Sales fluctuate with demand cycles, marketing spend, seasonal trends, and competitive dynamics.",
    },
    benchmark_framing: {
      framing_text: "Among e-commerce and product businesses in your revenue range",
      peer_group_label: "E-commerce / Product",
    },
  },

  // ─── 7. Investing / Asset Income ──────────────────────
  investing_asset: {
    industry_id: "investing_asset",
    industry_label: "Investing / Asset Income",
    applicable_income_models: [
      "Investment / Dividend Income", "Real Estate Rental Income",
      "Licensing / Royalty Income",
    ],
    scenario_emphasis: ["RS-DIVIDEND-CUT", "RS-MARKET-CORRECTION", "RS-VACANCY", "RS-LICENSE-NON-RENEWAL"],
    stronger_structure_overrides: [
      "No single asset or position exceeding 15% of income",
      "Diversified across 3+ asset classes or property types",
      "10+ year track record of consistent distributions",
      "Long-term lease or licensing agreements with renewal provisions",
      "Capital reserves covering 6+ months of income disruption",
    ],
    action_priority_overrides: [
      { action_id: "ACT-IA-01", label: "Reduce single-position concentration below 15%", description: "Ensure no single investment, property, or license accounts for more than 15% of total income.", why_now: "Concentrated positions amplify the impact of any single cut, vacancy, or non-renewal", expected_effect: "Distributes risk across more income-producing assets" },
      { action_id: "ACT-IA-02", label: "Diversify across 3+ asset classes", description: "Hold income-producing positions across different asset types — equities, real estate, fixed income, royalties.", why_now: "Single-asset-class concentration creates correlated risk", expected_effect: "Reduces exposure to any single market or sector downturn" },
      { action_id: "ACT-IA-03", label: "Extend agreement terms with renewal options", description: "Negotiate longer lease, licensing, or distribution terms with built-in renewal provisions.", why_now: "Short terms create continuous renegotiation risk", expected_effect: "Extends forward visibility and reduces renewal anxiety" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-IA-01", condition: "No single position exceeds 15% of income", display_text: "Reassess when no single investment or asset position exceeds 15% of total income." },
      { trigger_id: "RT-IA-02", condition: "Income spans 3+ asset classes", display_text: "Reassess when your income-producing positions span 3 or more different asset classes." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Investment and asset income depends on dividend declarations, lease terms, and licensing agreements that can be changed or not renewed.",
      high_concentration: "Too much passive income depends on a single asset, issuer, tenant, or licensing arrangement.",
      high_variability: "Income from investments and assets varies with market conditions, occupancy rates, and distribution policies.",
    },
    benchmark_framing: {
      framing_text: "Among investment and asset income earners in your portfolio tier",
      peer_group_label: "Investing / Asset Income",
    },
  },

  // ─── 8. Sales / Brokerage ─────────────────────────────
  sales_brokerage: {
    industry_id: "sales_brokerage",
    industry_label: "Sales / Brokerage",
    applicable_income_models: [
      "Commission-Based", "Agency / Brokerage Income",
    ],
    scenario_emphasis: ["RS-PIPELINE-DRY", "RS-TOP-CLIENT-LOST", "RS-MARKET-SLOWDOWN", "RS-DEAL-DELAYED"],
    stronger_structure_overrides: [
      "Trailing commissions or residual income from past sales",
      "Diversified deal pipeline across 3+ market segments",
      "Recurring service revenue alongside transactional commissions",
      "Team sales structure sharing pipeline and deal flow",
    ],
    action_priority_overrides: [
      { action_id: "ACT-SB-01", label: "Build trailing or residual commission income", description: "Prioritize products or services that pay ongoing commissions, not just one-time transaction fees.", why_now: "One-time commissions require constant new deal flow with no baseline", expected_effect: "Creates compounding residual income alongside new sales" },
      { action_id: "ACT-SB-02", label: "Diversify pipeline across 3+ market segments", description: "Avoid concentrating all deals in a single product line, geography, or client segment.", why_now: "Concentrated pipeline amplifies market-specific slowdowns", expected_effect: "Reduces sensitivity to any single market segment decline" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-SB-01", condition: "Trailing or residual commissions reach 20%+", display_text: "Reassess when trailing or residual commission income reaches 20% or more of total." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Sales and brokerage income depends on deals that have not yet closed. There is limited committed income before transactions complete.",
      high_concentration: "Too much deal flow depends on a single product line, market segment, or referral source.",
      high_variability: "Commission income swings between strong closing months and slow periods. The pattern is not yet smoothed with trailing or residual income.",
    },
    benchmark_framing: {
      framing_text: "Among sales and brokerage professionals in your market",
      peer_group_label: "Sales / Brokerage",
    },
  },

  // ─── 9. Technology ─────────────────────────────────────
  technology: {
    industry_id: "technology",
    industry_label: "Technology",
    applicable_income_models: [
      "Employee Salary", "Contract-Based", "Independent Contractor",
      "Consulting / Client Services", "Subscription / Retainer Services",
      "Digital Product Sales", "Licensing / Royalty Income",
    ],
    scenario_emphasis: ["RS-CONTRACT-END", "RS-LAYOFF", "RS-PLATFORM-ALGO-CHANGE", "RS-PRICING-PRESSURE", "RS-MARKET-CONTRACTION"],
    stronger_structure_overrides: [
      "SaaS or recurring product revenue alongside services",
      "Multiple client contracts with staggered end dates",
      "Intellectual property generating licensing or royalty income",
      "Advisory or fractional CTO roles providing retainer income",
      "Diversified across consulting, products, and employment income",
    ],
    action_priority_overrides: [
      { action_id: "ACT-TH-01", label: "Build recurring product or SaaS revenue alongside services", description: "Create a software product, tool, or subscription that generates income independent of your hourly delivery.", why_now: "Service-only tech income has a hard ceiling tied to your available hours", expected_effect: "Creates scalable income that compounds without additional labor" },
      { action_id: "ACT-TH-02", label: "Stagger contract end dates across quarters", description: "Ensure no more than 30% of contracts renew in the same month to avoid simultaneous gap risk.", why_now: "Clustered contract renewals create cliff risk", expected_effect: "Smooths revenue transitions and reduces gap exposure" },
      { action_id: "ACT-TH-03", label: "Diversify across 3+ clients or revenue streams", description: "Avoid dependence on a single employer, client, or platform for the majority of income.", why_now: "Tech industry layoffs and contract cancellations happen without warning", expected_effect: "Protects against sudden loss of any single income source" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-TH-01", condition: "Product or recurring revenue reaches 20%+ of total", display_text: "Reassess when product or recurring revenue reaches 20% or more of total income." },
      { trigger_id: "RT-TH-02", condition: "No single client or employer exceeds 40% of income", display_text: "Reassess when no single client or employer accounts for more than 40% of total income." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too little of your tech income is secured beyond the current contract or pay period. In a fast-moving industry, forward visibility is critical.",
      high_concentration: "Your tech income depends too heavily on a single employer, client, or platform. The industry moves fast — a single layoff or contract end could eliminate most income.",
      high_labor_dependence: "Your income stops when you stop coding, consulting, or delivering. Build products, licensing, or residual income alongside active work.",
      short_continuity: "If you stopped working today, tech income would end quickly. There is no product revenue, licensing, or recurring stream to bridge the gap.",
      high_variability: "Tech income fluctuates with contract cycles, project timelines, and market demand for your specific skills.",
    },
    benchmark_framing: {
      framing_text: "Among technology professionals in your specialization",
      peer_group_label: "Technology",
    },
  },

  // ─── 10. Finance / Banking ─────────────────────────────
  finance_banking: {
    industry_id: "finance_banking",
    industry_label: "Finance / Banking",
    applicable_income_models: [
      "Employee Salary", "Commission-Based", "Consulting / Client Services",
      "Investment / Dividend Income", "Contract-Based",
    ],
    scenario_emphasis: ["RS-REGULATORY-CHANGE", "RS-MARKET-CORRECTION", "RS-BONUS-CUT", "RS-LAYOFF", "RS-CLIENT-ATTRITION"],
    stronger_structure_overrides: [
      "Fee-based advisory revenue alongside transaction commissions",
      "Assets under management generating recurring fees",
      "Diversified across advisory, brokerage, and product income",
      "Regulatory compliance positioning as a competitive moat",
      "Long-term client relationships with annual retainers",
    ],
    action_priority_overrides: [
      { action_id: "ACT-FB-01", label: "Build fee-based or AUM-based recurring revenue", description: "Shift from transaction-based commissions to recurring advisory fees or assets under management.", why_now: "Transaction-only income has no baseline and is subject to market timing", expected_effect: "Creates predictable income that grows with client assets" },
      { action_id: "ACT-FB-02", label: "Diversify across advisory, compliance, and product channels", description: "Add revenue lines beyond a single financial product or service type.", why_now: "Regulatory changes can eliminate entire product lines overnight", expected_effect: "Reduces exposure to any single regulatory or market shift" },
      { action_id: "ACT-FB-03", label: "Secure long-term client retainer agreements", description: "Move key client relationships from transactional to annual retainer or advisory agreements.", why_now: "Transactional finance relationships are easily replaced by competitors or technology", expected_effect: "Locks in revenue and increases switching costs" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-FB-01", condition: "Recurring advisory or AUM fees reach 30%+ of income", display_text: "Reassess when recurring advisory or AUM-based fees reach 30% or more of total income." },
      { trigger_id: "RT-FB-02", condition: "No single product line exceeds 40% of revenue", display_text: "Reassess when no single financial product or service line exceeds 40% of total revenue." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Finance income depends on market conditions, deal flow, and bonus structures that are not guaranteed forward. Too little is committed before the period begins.",
      high_concentration: "Your finance income depends too heavily on a single product line, employer, or client segment. Regulatory or market shifts could eliminate that concentration.",
      high_labor_dependence: "Income stops when you stop advising, trading, or managing. There is limited residual or AUM-based income to sustain during gaps.",
      high_variability: "Finance income fluctuates with market cycles, bonus structures, and deal timing. The structure has not yet been smoothed with recurring fees.",
    },
    benchmark_framing: {
      framing_text: "Among finance and banking professionals in your specialization",
      peer_group_label: "Finance / Banking",
    },
  },

  // ─── 11. Insurance ─────────────────────────────────────
  insurance: {
    industry_id: "insurance",
    industry_label: "Insurance",
    applicable_income_models: [
      "Commission-Based", "Agency / Brokerage Income",
      "Employee Salary", "Business Ownership",
    ],
    scenario_emphasis: ["RS-RENEWAL-LOSS", "RS-CARRIER-CHANGE", "RS-REGULATORY-CHANGE", "RS-MARKET-SOFTENING"],
    stronger_structure_overrides: [
      "Renewal commission book generating 50%+ of income",
      "Multi-carrier appointments reducing carrier concentration",
      "Diversified lines of business — personal, commercial, life, benefits",
      "Service revenue or consulting fees alongside commissions",
      "Book of business with 200+ policies and low lapse rates",
    ],
    action_priority_overrides: [
      { action_id: "ACT-IN-01", label: "Build renewal commission book to 50%+ of income", description: "Focus on policy types with strong renewal commissions that compound year over year.", why_now: "New-business-only income requires constant prospecting with no baseline", expected_effect: "Creates compounding residual income that grows annually" },
      { action_id: "ACT-IN-02", label: "Diversify across 3+ lines of business", description: "Write personal, commercial, life, and benefits to reduce exposure to any single market segment.", why_now: "Single-line concentration amplifies regulatory and market risk", expected_effect: "Protects against market-specific downturns or carrier changes" },
      { action_id: "ACT-IN-03", label: "Reduce single-carrier dependency below 40%", description: "Maintain appointments with multiple carriers so no single carrier drives more than 40% of commissions.", why_now: "Carrier commission changes or terminations can eliminate income overnight", expected_effect: "Distributes risk across multiple carrier relationships" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-IN-01", condition: "Renewal commissions reach 50%+ of income", display_text: "Reassess when renewal commission income reaches 50% or more of total." },
      { trigger_id: "RT-IN-02", condition: "No single carrier exceeds 40% of commission income", display_text: "Reassess when no single insurance carrier accounts for more than 40% of commission income." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too little income comes from renewal commissions or pre-committed policies. Most revenue depends on closing new business each month.",
      high_concentration: "Your insurance income is concentrated in too few carriers, product lines, or client segments. A carrier change could eliminate a large portion of income.",
      high_labor_dependence: "Income depends on your continued prospecting and client management. The renewal book is not yet large enough to sustain income during a pause.",
      high_variability: "Insurance income fluctuates with new business closing rates, seasonal enrollment periods, and carrier commission changes.",
    },
    benchmark_framing: {
      framing_text: "Among insurance professionals in your market and lines of business",
      peer_group_label: "Insurance",
    },
  },

  // ─── 12. Healthcare ────────────────────────────────────
  healthcare: {
    industry_id: "healthcare",
    industry_label: "Healthcare",
    applicable_income_models: [
      "Employee Salary", "Professional Practice", "Contract-Based",
      "Consulting / Client Services", "Business Ownership",
    ],
    scenario_emphasis: ["RS-PRACTITIONER-UNAVAILABLE", "RS-REIMBURSEMENT-CUT", "RS-REGULATORY-CHANGE", "RS-CASELOAD-DECLINE"],
    stronger_structure_overrides: [
      "Multiple revenue streams — clinical, consulting, teaching, telehealth",
      "Associate or partner practitioners carrying caseload",
      "Recurring wellness or membership programs alongside fee-for-service",
      "Diversified payer mix — private pay, insurance, Medicare, cash-pay",
      "Locum or contract work creating schedule flexibility",
    ],
    action_priority_overrides: [
      { action_id: "ACT-HC-01", label: "Add associate practitioners to carry caseload", description: "Bring on providers who can see patients independently, reducing personal delivery dependency.", why_now: "If you are unavailable, clinical income stops entirely", expected_effect: "Creates income continuity during leave, illness, or burnout" },
      { action_id: "ACT-HC-02", label: "Build a recurring wellness or membership program", description: "Create a cash-pay membership, wellness program, or concierge tier alongside insurance-based care.", why_now: "Fee-for-service income has no baseline between patient visits", expected_effect: "Adds predictable monthly revenue independent of patient volume" },
      { action_id: "ACT-HC-03", label: "Diversify payer mix across 3+ sources", description: "Avoid depending on a single insurance carrier, employer, or referral source for the majority of patients.", why_now: "Reimbursement cuts from a dominant payer can eliminate margins overnight", expected_effect: "Protects against any single payer reducing rates or access" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-HC-01", condition: "Associate covering 20%+ of caseload", display_text: "Reassess when associate providers handle 20% or more of your caseload." },
      { trigger_id: "RT-HC-02", condition: "Recurring or membership revenue reaches 15%+", display_text: "Reassess when recurring wellness or membership revenue reaches 15% or more of total." },
    ],
    explanation_language_overrides: {
      high_labor_dependence: "Your healthcare income depends entirely on your personal availability to see patients. If you are unable to practice, income stops immediately.",
      low_forward_secured: "Forward visibility is limited to scheduled appointments. Beyond your current booking calendar, there is no committed income.",
      high_concentration: "Your healthcare income is concentrated in too few payers, referral sources, or clinical settings. A single change could significantly reduce patient volume.",
      short_continuity: "Clinical income stops when you stop seeing patients. There is no passive, digital, or recurring component to bridge an absence.",
    },
    benchmark_framing: {
      framing_text: "Among healthcare professionals in your specialty",
      peer_group_label: "Healthcare",
    },
  },

  // ─── 13. Legal Services ────────────────────────────────
  legal_services: {
    industry_id: "legal_services",
    industry_label: "Legal Services",
    applicable_income_models: [
      "Professional Practice", "Consulting / Client Services",
      "Contract-Based", "Employee Salary", "Business Ownership",
    ],
    scenario_emphasis: ["RS-TOP-CLIENT-LOST", "RS-PRACTITIONER-UNAVAILABLE", "RS-CASELOAD-DECLINE", "RS-REFERRAL-SOURCE-LOST"],
    stronger_structure_overrides: [
      "Monthly retainer agreements with ongoing clients",
      "Associate attorneys carrying 20%+ of billable hours",
      "Diversified practice areas reducing single-area dependency",
      "Recurring compliance or advisory services alongside litigation",
      "Multiple referral sources — no single source exceeding 25%",
    ],
    action_priority_overrides: [
      { action_id: "ACT-LG-01", label: "Convert hourly clients to monthly retainer agreements", description: "Move key client relationships from hourly billing to monthly retainers for ongoing legal services.", why_now: "Hourly billing creates unpredictable income tied to active casework", expected_effect: "Creates predictable monthly baseline revenue" },
      { action_id: "ACT-LG-02", label: "Add associate capacity to reduce personal billable dependency", description: "Bring on associates who can handle matters independently, freeing your time and reducing interruption risk.", why_now: "If you are unavailable, all billable hours and revenue stop", expected_effect: "Income continues when you are in court, on leave, or unavailable" },
      { action_id: "ACT-LG-03", label: "Diversify across 2+ practice areas or service lines", description: "Add a secondary practice area or advisory service to reduce dependence on a single type of legal work.", why_now: "Single-practice concentration amplifies market and regulatory risk", expected_effect: "Reduces sensitivity to any single practice area decline" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-LG-01", condition: "Retainer revenue reaches 30%+ of total", display_text: "Reassess when retainer revenue reaches 30% or more of total legal income." },
      { trigger_id: "RT-LG-02", condition: "Associate handling 20%+ of billable hours", display_text: "Reassess when associates handle 20% or more of total billable hours." },
    ],
    explanation_language_overrides: {
      high_labor_dependence: "Your legal income depends on your personal billable hours. If you stop practicing, income stops immediately.",
      low_forward_secured: "Legal income depends on active cases and hourly billing. There is limited committed revenue beyond current engagements.",
      high_concentration: "Too much revenue comes from a small number of clients or a single practice area. Losing the top client would create a significant revenue gap.",
      short_continuity: "If you stopped taking cases, legal income would end quickly. There are no passive or recurring streams to bridge a gap.",
    },
    benchmark_framing: {
      framing_text: "Among legal professionals in your practice area",
      peer_group_label: "Legal Services",
    },
  },

  // ─── 14. Construction / Trades ─────────────────────────
  construction_trades: {
    industry_id: "construction_trades",
    industry_label: "Construction / Trades",
    applicable_income_models: [
      "Contract-Based", "Business Ownership", "Independent Contractor",
      "Project-Based Work", "Employee Salary",
    ],
    scenario_emphasis: ["RS-PROJECT-DELAY", "RS-WEATHER-SEASONAL", "RS-MATERIAL-COST", "RS-TOP-CLIENT-LOST", "RS-PERMIT-REGULATORY"],
    stronger_structure_overrides: [
      "Recurring maintenance or service contracts alongside project work",
      "3+ active projects with staggered completion dates",
      "Property management or facility maintenance revenue",
      "Diversified across residential, commercial, and government work",
      "Forward-committed backlog extending 3+ months",
    ],
    action_priority_overrides: [
      { action_id: "ACT-CT-01", label: "Build recurring maintenance or service contract revenue", description: "Add HVAC maintenance, property management, or facility service contracts that generate monthly income.", why_now: "Project-only revenue creates zero-income gaps between jobs", expected_effect: "Creates baseline income that persists between construction projects" },
      { action_id: "ACT-CT-02", label: "Maintain 3+ months of forward-committed backlog", description: "Keep a pipeline of signed contracts or committed projects extending at least 90 days.", why_now: "Short backlogs create unpredictable income and crew utilization gaps", expected_effect: "Smooths income across seasonal and market cycles" },
      { action_id: "ACT-CT-03", label: "Diversify across residential, commercial, and service work", description: "Avoid concentrating all revenue in a single project type or client segment.", why_now: "Single-sector construction work is highly cyclical", expected_effect: "Reduces sensitivity to any single market segment downturn" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-CT-01", condition: "Recurring service revenue reaches 20%+ of total", display_text: "Reassess when recurring maintenance or service contract revenue reaches 20% or more of total." },
      { trigger_id: "RT-CT-02", condition: "Forward backlog extends 90+ days", display_text: "Reassess when your signed project backlog extends 90 or more days." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too little of your construction income is committed through signed contracts or forward-booked projects. Income depends on winning the next job.",
      high_concentration: "Revenue depends too heavily on a single general contractor, client, or project type. Losing the top client would create a significant revenue gap.",
      high_labor_dependence: "Your income requires your personal presence on job sites. There is limited income that continues if you are unable to work.",
      high_variability: "Construction income fluctuates with weather, permit timelines, material costs, and project scheduling.",
      short_continuity: "Between projects, income drops to zero unless maintenance contracts or forward-committed work is in place.",
    },
    benchmark_framing: {
      framing_text: "Among construction and trades professionals in your market",
      peer_group_label: "Construction / Trades",
    },
  },

  // ─── 15. Hospitality / Food Service ────────────────────
  hospitality_food_service: {
    industry_id: "hospitality_food_service",
    industry_label: "Hospitality / Food Service",
    applicable_income_models: [
      "Business Ownership", "Employee Salary", "Franchise Ownership",
      "Partnership", "Commission-Based",
    ],
    scenario_emphasis: ["RS-SEASONAL-GAP", "RS-DEMAND-DROP", "RS-HEALTH-CLOSURE", "RS-STAFF-SHORTAGE", "RS-COST-INCREASE"],
    stronger_structure_overrides: [
      "Catering or event revenue alongside daily operations",
      "Multiple locations or revenue streams reducing single-unit dependency",
      "Subscription or membership programs — meal plans, loyalty clubs",
      "Off-premise revenue — delivery, retail products, licensing",
      "Forward-booked events or catering extending 60+ days",
    ],
    action_priority_overrides: [
      { action_id: "ACT-HF-01", label: "Build catering, events, or off-premise revenue to 20%+", description: "Add revenue lines that do not depend on walk-in traffic — catering, delivery, meal plans, or retail.", why_now: "Walk-in-only revenue has no floor during slow periods, closures, or weather events", expected_effect: "Creates diversified revenue that continues when dine-in traffic drops" },
      { action_id: "ACT-HF-02", label: "Launch a subscription or membership loyalty program", description: "Create meal plans, prepaid visit cards, or membership clubs that generate committed monthly revenue.", why_now: "Daily revenue is unpredictable and entirely dependent on foot traffic", expected_effect: "Adds recurring baseline revenue independent of daily traffic" },
      { action_id: "ACT-HF-03", label: "Forward-book events and catering 60+ days out", description: "Build a pipeline of committed events, catering orders, or group bookings extending 2+ months.", why_now: "Without forward bookings, income visibility is limited to days", expected_effect: "Improves forward security and cash flow planning" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-HF-01", condition: "Off-premise or catering revenue reaches 20%+ of total", display_text: "Reassess when catering, delivery, or off-premise revenue reaches 20% or more of total." },
      { trigger_id: "RT-HF-02", condition: "Forward-booked events extend 60+ days", display_text: "Reassess when forward-booked events or catering extends 60 or more days." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Hospitality income depends on daily traffic and walk-in volume. There is limited pre-committed revenue before the week begins.",
      high_concentration: "Revenue is concentrated in a single location, daypart, or customer segment. Any disruption to that channel affects most of the income.",
      high_labor_dependence: "Your presence is required for operations to run. If you are unavailable, revenue drops or stops.",
      high_variability: "Hospitality income fluctuates with seasons, weather, events, and economic conditions.",
    },
    benchmark_framing: {
      framing_text: "Among hospitality and food service operators in your market",
      peer_group_label: "Hospitality / Food Service",
    },
  },

  // ─── 16. Transportation / Logistics ────────────────────
  transportation_logistics: {
    industry_id: "transportation_logistics",
    industry_label: "Transportation / Logistics",
    applicable_income_models: [
      "Business Ownership", "Independent Contractor", "Contract-Based",
      "Employee Salary", "Commission-Based",
    ],
    scenario_emphasis: ["RS-FUEL-COST", "RS-CONTRACT-LOSS", "RS-REGULATORY-CHANGE", "RS-EQUIPMENT-FAILURE", "RS-DEMAND-DROP"],
    stronger_structure_overrides: [
      "Long-term freight or logistics contracts with renewal provisions",
      "Diversified client base — no single shipper exceeding 25% of revenue",
      "Multiple service lines — freight, warehousing, last-mile, brokerage",
      "Equipment paid off or leased with manageable terms",
      "Recurring route or dedicated lane agreements",
    ],
    action_priority_overrides: [
      { action_id: "ACT-TL-01", label: "Secure long-term contracts with dedicated lanes or routes", description: "Lock in 6-12 month freight or logistics contracts with committed volumes.", why_now: "Spot-market-only revenue fluctuates daily with no guaranteed floor", expected_effect: "Creates predictable baseline revenue independent of spot rates" },
      { action_id: "ACT-TL-02", label: "Diversify shipper base so no client exceeds 25%", description: "Grow the client portfolio so no single shipper or account drives more than 25% of revenue.", why_now: "Losing a dominant shipper could eliminate most revenue overnight", expected_effect: "Distributes risk and reduces catastrophic loss potential" },
      { action_id: "ACT-TL-03", label: "Add brokerage or warehousing revenue alongside hauling", description: "Build a revenue line that does not require your personal driving or equipment usage.", why_now: "Owner-operator income stops when you stop driving", expected_effect: "Creates income that continues during equipment downtime or personal breaks" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-TL-01", condition: "Contract revenue reaches 50%+ of total", display_text: "Reassess when contracted or dedicated-lane revenue reaches 50% or more of total." },
      { trigger_id: "RT-TL-02", condition: "No single shipper exceeds 25% of revenue", display_text: "Reassess when no single shipper or client exceeds 25% of total revenue." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too much transportation income depends on spot market rates or loads that are not committed in advance.",
      high_concentration: "Revenue depends too heavily on a single shipper, broker, or lane. A single contract loss could eliminate most income.",
      high_labor_dependence: "As an owner-operator, income stops when you stop driving. There is no revenue that continues during downtime.",
      high_variability: "Transportation income fluctuates with fuel costs, seasonal freight demand, and spot market rates.",
    },
    benchmark_framing: {
      framing_text: "Among transportation and logistics operators in your market",
      peer_group_label: "Transportation / Logistics",
    },
  },

  // ─── 17. Manufacturing ─────────────────────────────────
  manufacturing: {
    industry_id: "manufacturing",
    industry_label: "Manufacturing",
    applicable_income_models: [
      "Business Ownership", "Product Sales", "Contract-Based",
      "Employee Salary", "Licensing / Royalty Income",
    ],
    scenario_emphasis: ["RS-ORDER-CANCELLATION", "RS-SUPPLY-CHAIN", "RS-DEMAND-DROP", "RS-TOP-CLIENT-LOST", "RS-COST-INCREASE"],
    stronger_structure_overrides: [
      "Long-term supply agreements with committed minimum volumes",
      "Diversified customer base — no single buyer exceeding 20% of output",
      "Multiple product lines reducing single-product dependency",
      "Recurring blanket purchase orders or annual contracts",
      "Private-label or contract manufacturing for multiple brands",
    ],
    action_priority_overrides: [
      { action_id: "ACT-MF-01", label: "Secure long-term supply agreements with minimum volumes", description: "Lock in annual or multi-year contracts with committed purchase minimums.", why_now: "Order-by-order revenue creates unpredictable production schedules and cash flow", expected_effect: "Creates baseline revenue and enables capacity planning" },
      { action_id: "ACT-MF-02", label: "Diversify customer base so no buyer exceeds 20%", description: "Grow the customer portfolio to reduce dependence on any single buyer.", why_now: "Losing a dominant buyer could idle production capacity and eliminate margins", expected_effect: "Distributes risk and stabilizes production utilization" },
      { action_id: "ACT-MF-03", label: "Add recurring revenue through blanket POs or subscriptions", description: "Convert one-time orders into blanket purchase orders, auto-replenishment, or subscription models.", why_now: "One-time orders require constant re-selling with no guaranteed baseline", expected_effect: "Creates predictable recurring revenue from existing customers" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-MF-01", condition: "Contract or blanket-PO revenue reaches 40%+ of total", display_text: "Reassess when contracted or blanket purchase order revenue reaches 40% or more of total." },
      { trigger_id: "RT-MF-02", condition: "No single customer exceeds 20% of revenue", display_text: "Reassess when no single customer exceeds 20% of total manufacturing revenue." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Too much manufacturing revenue depends on incoming orders rather than committed supply agreements or blanket purchase orders.",
      high_concentration: "Revenue depends too heavily on a single buyer, product line, or distribution channel.",
      high_variability: "Manufacturing income fluctuates with order volumes, raw material costs, and economic cycles.",
      high_labor_dependence: "Production revenue requires your continued operational management. There is limited income that continues if operations pause.",
    },
    benchmark_framing: {
      framing_text: "Among manufacturing operators in your product category",
      peer_group_label: "Manufacturing",
    },
  },

  // ─── 18. Education ─────────────────────────────────────
  education: {
    industry_id: "education",
    industry_label: "Education",
    applicable_income_models: [
      "Employee Salary", "Professional Practice", "Consulting / Client Services",
      "Digital Product Sales", "Subscription / Retainer Services",
    ],
    scenario_emphasis: ["RS-ENROLLMENT-DROP", "RS-FUNDING-CUT", "RS-CONTRACT-NON-RENEWAL", "RS-PRACTITIONER-UNAVAILABLE"],
    stronger_structure_overrides: [
      "Online courses or digital products generating passive income",
      "Multi-semester or annual employment contracts",
      "Tutoring or coaching retainers alongside institutional employment",
      "Published curriculum, textbooks, or training materials earning royalties",
      "Diversified across institutional, private, and digital education",
    ],
    action_priority_overrides: [
      { action_id: "ACT-ED-01", label: "Build digital course or content revenue alongside teaching", description: "Create online courses, training programs, or educational products that sell without your live presence.", why_now: "Teaching-only income stops during breaks, layoffs, or contract gaps", expected_effect: "Creates passive income that continues during non-teaching periods" },
      { action_id: "ACT-ED-02", label: "Diversify across institutional and private income", description: "Add private tutoring, consulting, or coaching alongside institutional employment.", why_now: "Single-employer education income is vulnerable to budget cuts and non-renewal", expected_effect: "Reduces dependence on any single institution" },
      { action_id: "ACT-ED-03", label: "Secure multi-year or recurring contract terms", description: "Negotiate multi-semester contracts, annual agreements, or tenure-track positions.", why_now: "Semester-by-semester contracts create recurring renewal anxiety", expected_effect: "Extends forward visibility and reduces gap risk" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-ED-01", condition: "Digital or passive education income reaches 15%+ of total", display_text: "Reassess when digital course, content, or royalty income reaches 15% or more of total." },
      { trigger_id: "RT-ED-02", condition: "Income diversified across 2+ education channels", display_text: "Reassess when income comes from 2 or more independent education sources." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Education income is often committed only semester-by-semester or contract-by-contract. There is limited visibility beyond the current term.",
      high_concentration: "Income depends too heavily on a single institution, school, or client. Budget cuts or non-renewal could eliminate most revenue.",
      high_labor_dependence: "Your income requires your personal presence to teach, tutor, or coach. There is no income that continues during breaks or leave.",
      short_continuity: "Between semesters or contracts, education income drops to zero unless digital products or private clients provide a bridge.",
    },
    benchmark_framing: {
      framing_text: "Among education professionals in your teaching area",
      peer_group_label: "Education",
    },
  },

  // ─── 19. Nonprofit / Public Sector ─────────────────────
  nonprofit_public_sector: {
    industry_id: "nonprofit_public_sector",
    industry_label: "Nonprofit / Public Sector",
    applicable_income_models: [
      "Employee Salary", "Contract-Based", "Consulting / Client Services",
      "Business Ownership",
    ],
    scenario_emphasis: ["RS-FUNDING-CUT", "RS-GRANT-NON-RENEWAL", "RS-BUDGET-CYCLE", "RS-POLITICAL-CHANGE"],
    stronger_structure_overrides: [
      "Multi-year grants or contracts with renewal provisions",
      "Diversified funding across 3+ sources — grants, contracts, donors, earned revenue",
      "Earned revenue stream alongside grant funding",
      "Individual donor base providing unrestricted recurring gifts",
      "Government contracts with multi-year terms",
    ],
    action_priority_overrides: [
      { action_id: "ACT-NP-01", label: "Diversify funding across 3+ sources", description: "Reduce dependence on any single grant, funder, or contract by building multiple revenue streams.", why_now: "Single-funder dependency creates existential risk from one budget decision", expected_effect: "Protects against any single funding source being cut or not renewed" },
      { action_id: "ACT-NP-02", label: "Build earned revenue or fee-for-service income", description: "Create a revenue stream from services, products, or programs that is not dependent on grants or donations.", why_now: "Grant-only funding has no guaranteed floor and comes with restrictive timelines", expected_effect: "Creates unrestricted income that can sustain operations during funding gaps" },
      { action_id: "ACT-NP-03", label: "Secure multi-year grant or contract commitments", description: "Pursue multi-year grants, contracts, or funding agreements to extend forward visibility.", why_now: "Annual grant cycles create constant renewal anxiety and planning gaps", expected_effect: "Extends forward visibility and enables longer-term planning" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-NP-01", condition: "No single funder exceeds 30% of revenue", display_text: "Reassess when no single grant, funder, or contract exceeds 30% of total revenue." },
      { trigger_id: "RT-NP-02", condition: "Earned revenue reaches 20%+ of total", display_text: "Reassess when earned revenue or fee-for-service income reaches 20% or more of total." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Nonprofit revenue depends on grant cycles, donor decisions, and contract renewals. Too little is committed beyond the current funding period.",
      high_concentration: "Revenue depends too heavily on a single funder, grant, or government contract. A single non-renewal could threaten operations.",
      high_variability: "Nonprofit income fluctuates with grant cycles, fundraising campaigns, and political budget decisions.",
      high_labor_dependence: "Your personal involvement is required for fundraising, grant writing, and program delivery. Revenue depends on your continued effort.",
    },
    benchmark_framing: {
      framing_text: "Among nonprofit and public sector professionals in your area",
      peer_group_label: "Nonprofit / Public Sector",
    },
  },

  // ─── 20. Agriculture ───────────────────────────────────
  agriculture: {
    industry_id: "agriculture",
    industry_label: "Agriculture",
    applicable_income_models: [
      "Business Ownership", "Product Sales", "Contract-Based",
      "Independent Contractor",
    ],
    scenario_emphasis: ["RS-CROP-FAILURE", "RS-PRICE-DROP", "RS-WEATHER-SEASONAL", "RS-SUPPLY-CHAIN", "RS-REGULATORY-CHANGE"],
    stronger_structure_overrides: [
      "Forward contracts or futures locking in commodity prices",
      "Diversified across 3+ crops, livestock, or product lines",
      "Value-added processing — direct-to-consumer, organic premium, branded products",
      "Agritourism, education, or rental income alongside farming",
      "Government program payments or crop insurance providing a floor",
    ],
    action_priority_overrides: [
      { action_id: "ACT-AG-01", label: "Lock in forward contracts for 50%+ of expected production", description: "Use forward contracts, futures, or pre-sale agreements to commit at least half of production at known prices.", why_now: "Spot-market-only pricing creates total revenue uncertainty until harvest", expected_effect: "Creates forward visibility and price protection for the majority of production" },
      { action_id: "ACT-AG-02", label: "Diversify across 3+ product lines or revenue streams", description: "Add crops, livestock, value-added products, or non-farm income to reduce single-crop dependency.", why_now: "Single-crop operations are fully exposed to weather, disease, and commodity price swings", expected_effect: "Reduces catastrophic loss risk from any single crop or product failure" },
      { action_id: "ACT-AG-03", label: "Build direct-to-consumer or value-added revenue", description: "Sell farm products directly through CSA programs, farm stands, online sales, or branded products.", why_now: "Commodity pricing leaves no margin for weather or cost setbacks", expected_effect: "Adds higher-margin revenue with more stable pricing" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-AG-01", condition: "Forward-contracted revenue reaches 50%+ of expected production", display_text: "Reassess when forward contracts or pre-sales cover 50% or more of expected production." },
      { trigger_id: "RT-AG-02", condition: "Non-commodity revenue reaches 20%+ of total", display_text: "Reassess when direct-to-consumer, value-added, or diversified revenue reaches 20% or more." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Agricultural income depends on harvest outcomes and commodity prices that are not known in advance. Too little is locked in through forward contracts.",
      high_concentration: "Revenue is concentrated in a single crop, livestock type, or commodity. A single weather event or price drop could eliminate most income.",
      high_variability: "Farm income fluctuates with weather, commodity prices, input costs, and seasonal cycles.",
      high_labor_dependence: "Your personal involvement is required for planting, harvesting, and operations. Revenue depends on your continued physical effort.",
    },
    benchmark_framing: {
      framing_text: "Among agricultural operators in your production category",
      peer_group_label: "Agriculture",
    },
  },

  // ─── 21. Energy / Utilities ────────────────────────────
  energy_utilities: {
    industry_id: "energy_utilities",
    industry_label: "Energy / Utilities",
    applicable_income_models: [
      "Business Ownership", "Contract-Based", "Employee Salary",
      "Investment / Dividend Income", "Consulting / Client Services",
    ],
    scenario_emphasis: ["RS-REGULATORY-CHANGE", "RS-COMMODITY-PRICE", "RS-CONTRACT-LOSS", "RS-MARKET-CONTRACTION"],
    stronger_structure_overrides: [
      "Long-term power purchase agreements or utility contracts",
      "Diversified across generation, distribution, services, and consulting",
      "Government or utility contracts with multi-year terms",
      "Renewable energy credits or incentive payments providing a floor",
      "Recurring maintenance or inspection service contracts",
    ],
    action_priority_overrides: [
      { action_id: "ACT-EU-01", label: "Secure long-term contracts or power purchase agreements", description: "Lock in multi-year agreements for energy delivery, services, or consulting.", why_now: "Spot-market or short-term energy pricing creates volatile revenue", expected_effect: "Creates predictable baseline revenue across commodity cycles" },
      { action_id: "ACT-EU-02", label: "Diversify across 3+ revenue streams", description: "Add consulting, maintenance, inspection, or renewable energy credits alongside core operations.", why_now: "Single-service concentration exposes all revenue to regulatory or market shifts", expected_effect: "Reduces sensitivity to any single regulatory or commodity change" },
    ],
    reassessment_trigger_overrides: [
      { trigger_id: "RT-EU-01", condition: "Long-term contract revenue reaches 50%+ of total", display_text: "Reassess when long-term contract or PPA revenue reaches 50% or more of total." },
    ],
    explanation_language_overrides: {
      low_forward_secured: "Energy income depends on commodity prices and contract terms that may not be committed beyond the near term.",
      high_concentration: "Revenue is concentrated in a single energy type, client, or contract. A regulatory change could significantly reduce income.",
      high_variability: "Energy income fluctuates with commodity prices, seasonal demand, and regulatory incentive changes.",
    },
    benchmark_framing: {
      framing_text: "Among energy and utility professionals in your sector",
      peer_group_label: "Energy / Utilities",
    },
  },
};
