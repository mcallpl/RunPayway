// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Industry Refinement Profiles (OL-1.0 Phase 2)
// 8 priority industries with override logic
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
};
