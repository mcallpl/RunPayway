// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Deterministic Scenario Registry (OL-1.0)
// 24 scenarios across all income model families
// ═══════════════════════════════════════════════════════════════

import type { DeterministicScenario, IncomeModelFamilyId } from "../types";

export const SCENARIO_REGISTRY: DeterministicScenario[] = [

  // ─── Employment Scenarios ─────────────────────────────
  {
    scenario_id: "RS-JOB-LOSS",
    label: "Job Loss",
    applicable_families: ["employment_led"],
    applicable_industries: ["*"],
    description: "Your employer terminates your position.",
    why_it_matters: "With 100% employer concentration, job loss eliminates all income immediately with no continuity window.",
    severity: "critical",
  },
  {
    scenario_id: "RS-EMPLOYER-DOWNSIZE",
    label: "Employer Downsizing",
    applicable_families: ["employment_led"],
    applicable_industries: ["*"],
    description: "Your employer reduces headcount or restructures.",
    why_it_matters: "Downsizing may reduce income through layoff, reduced hours, or role elimination.",
    severity: "high",
  },
  {
    scenario_id: "RS-INDUSTRY-CONTRACTION",
    label: "Industry Contraction",
    applicable_families: ["employment_led", "commission_led", "contract_project_led"],
    applicable_industries: ["*"],
    description: "Your industry segment contracts, reducing demand for your role or services.",
    why_it_matters: "Industry-wide contraction affects both current employment and the ability to find replacement income.",
    severity: "high",
  },

  // ─── Pipeline / Deal Scenarios ────────────────────────
  {
    scenario_id: "RS-PIPELINE-DRY",
    label: "Pipeline Dries Up",
    applicable_families: ["commission_led", "contract_project_led"],
    applicable_industries: ["real_estate", "professional_services", "consulting_client_services"],
    description: "Your active pipeline of deals or projects drops to near zero.",
    why_it_matters: "Without active pipeline, commission and contract income has no forward visibility and no incoming revenue.",
    severity: "critical",
  },
  {
    scenario_id: "RS-DEAL-DELAYED",
    label: "Major Deal Delayed",
    applicable_families: ["commission_led", "contract_project_led"],
    applicable_industries: ["real_estate", "consulting_client_services"],
    description: "Your largest pending deal or engagement is delayed by 3 or more months.",
    why_it_matters: "Deal delays create unexpected income gaps, especially when the deal represents a significant share of expected revenue.",
    severity: "high",
  },
  {
    scenario_id: "RS-MARKET-SLOWDOWN",
    label: "Market Slowdown",
    applicable_families: ["commission_led", "asset_rental_led", "investment_led", "product_led"],
    applicable_industries: ["real_estate", "investing_asset", "ecommerce_product"],
    description: "The broader market slows, reducing deal flow, demand, or asset values.",
    why_it_matters: "Market slowdowns affect both current income and the pipeline of future opportunities.",
    severity: "high",
  },

  // ─── Client / Account Scenarios ───────────────────────
  {
    scenario_id: "RS-TOP-CLIENT-LOST",
    label: "Top Client Lost",
    applicable_families: ["commission_led", "contract_project_led", "retainer_subscription_led", "agency_led", "practice_led"],
    applicable_industries: ["*"],
    description: "Your single largest client or account ends the relationship.",
    why_it_matters: "When the largest client leaves, the income gap is proportional to their share of total revenue.",
    severity: "critical",
  },
  {
    scenario_id: "RS-TOP-ACCOUNT-LOST",
    label: "Top Agency Account Lost",
    applicable_families: ["agency_led"],
    applicable_industries: ["agency_client_services"],
    description: "Your agency's largest client account terminates.",
    why_it_matters: "Agency account concentration means losing the top account can threaten team payroll and operational viability.",
    severity: "critical",
  },
  {
    scenario_id: "RS-CLIENT-BUDGET-CUT",
    label: "Client Budget Cut",
    applicable_families: ["contract_project_led", "agency_led", "retainer_subscription_led"],
    applicable_industries: ["*"],
    description: "One or more key clients reduce their budget for your services.",
    why_it_matters: "Budget cuts reduce revenue without losing the client entirely, creating partial income erosion.",
    severity: "moderate",
  },
  {
    scenario_id: "RS-TOP-RETAINER-LOST",
    label: "Top Retainer Client Lost",
    applicable_families: ["retainer_subscription_led"],
    applicable_industries: ["consulting_client_services", "professional_services"],
    description: "Your largest retainer client does not renew.",
    why_it_matters: "Losing the top retainer creates a recurring revenue gap that takes months to replace.",
    severity: "critical",
  },

  // ─── Contract / Engagement Scenarios ──────────────────
  {
    scenario_id: "RS-CONTRACT-END",
    label: "Contract Ends Without Renewal",
    applicable_families: ["contract_project_led"],
    applicable_industries: ["*"],
    description: "Your current contract ends and is not renewed or replaced.",
    why_it_matters: "Without a next engagement lined up, income drops to zero after the current contract completes.",
    severity: "high",
  },
  {
    scenario_id: "RS-GAP-PERIOD",
    label: "Gap Between Engagements",
    applicable_families: ["contract_project_led"],
    applicable_industries: ["consulting_client_services", "professional_services"],
    description: "You experience a gap of 2 or more months between engagements.",
    why_it_matters: "Gap periods with zero income erode annual earnings and create financial strain.",
    severity: "high",
  },

  // ─── Retention / Churn Scenarios ──────────────────────
  {
    scenario_id: "RS-CHURN-SPIKE",
    label: "Churn Spike",
    applicable_families: ["retainer_subscription_led", "product_led"],
    applicable_industries: ["*"],
    description: "Your cancellation or non-renewal rate spikes for a quarter.",
    why_it_matters: "A churn spike compounds — each lost subscriber reduces the recurring base that future revenue builds on.",
    severity: "high",
  },
  {
    scenario_id: "RS-RENEWAL-DECLINE",
    label: "Renewal Rate Declines",
    applicable_families: ["retainer_subscription_led"],
    applicable_industries: ["*"],
    description: "Your renewal or retention rate drops below historical norms.",
    why_it_matters: "Declining renewals signal structural erosion in the recurring revenue base.",
    severity: "moderate",
  },
  {
    scenario_id: "RS-PRICING-PRESSURE",
    label: "Pricing Pressure",
    applicable_families: ["retainer_subscription_led", "agency_led", "contract_project_led"],
    applicable_industries: ["*"],
    description: "Competitive or client pressure forces pricing reductions.",
    why_it_matters: "Lower pricing reduces revenue without reducing workload, compressing margins and effective income.",
    severity: "moderate",
  },

  // ─── Founder / Key Person Scenarios ───────────────────
  {
    scenario_id: "RS-FOUNDER-UNAVAILABLE",
    label: "Founder Unavailable",
    applicable_families: ["agency_led", "practice_led", "hybrid_multi"],
    applicable_industries: ["*"],
    description: "The founder or primary operator is unavailable for 90 days.",
    why_it_matters: "If the business depends on the founder, their absence can halt revenue generation entirely.",
    severity: "critical",
  },
  {
    scenario_id: "RS-PRACTITIONER-UNAVAILABLE",
    label: "Practitioner Unavailable",
    applicable_families: ["practice_led"],
    applicable_industries: ["private_practice_coaching"],
    description: "You are unable to see clients or deliver services for 90 days.",
    why_it_matters: "Practice income stops completely when the practitioner is unavailable, with no passive income to bridge the gap.",
    severity: "critical",
  },

  // ─── Platform / Channel Scenarios ─────────────────────
  {
    scenario_id: "RS-PLATFORM-ALGO-CHANGE",
    label: "Platform Algorithm Change",
    applicable_families: ["creator_audience_led", "referral_affiliate_led", "product_led"],
    applicable_industries: ["creator_media", "media_entertainment", "ecommerce_product"],
    description: "A platform you depend on changes its algorithm, terms, or policies.",
    why_it_matters: "Platform changes can reduce visibility, traffic, or monetization without warning.",
    severity: "high",
  },
  {
    scenario_id: "RS-CHANNEL-DISRUPTION",
    label: "Sales Channel Disrupted",
    applicable_families: ["product_led", "referral_affiliate_led"],
    applicable_industries: ["ecommerce_product"],
    description: "Your primary sales or distribution channel is disrupted or suspended.",
    why_it_matters: "Single-channel dependency means a disruption can halt all or most revenue immediately.",
    severity: "high",
  },

  // ─── Audience / Traffic Scenarios ─────────────────────
  {
    scenario_id: "RS-AUDIENCE-DECLINE",
    label: "Audience Decline",
    applicable_families: ["creator_audience_led"],
    applicable_industries: ["creator_media", "media_entertainment"],
    description: "Your audience engagement or reach declines by 40% or more.",
    why_it_matters: "Audience-dependent income scales directly with engagement. A significant decline reduces all monetization channels.",
    severity: "high",
  },
  {
    scenario_id: "RS-SPONSOR-PULLBACK",
    label: "Sponsor Pullback",
    applicable_families: ["creator_audience_led"],
    applicable_industries: ["creator_media", "media_entertainment"],
    description: "Your largest sponsor or brand deal partner pulls back or does not renew.",
    why_it_matters: "Sponsor concentration means losing a key deal creates a revenue gap that takes time to replace.",
    severity: "high",
  },

  // ─── Asset / Rental Scenarios ─────────────────────────
  {
    scenario_id: "RS-VACANCY",
    label: "Vacancy Event",
    applicable_families: ["asset_rental_led"],
    applicable_industries: ["real_estate", "investing_asset"],
    description: "One or more rental units become vacant.",
    why_it_matters: "Vacancy eliminates income from the affected unit while fixed costs continue.",
    severity: "high",
  },
  {
    scenario_id: "RS-TENANT-DEFAULT",
    label: "Tenant Default",
    applicable_families: ["asset_rental_led"],
    applicable_industries: ["real_estate"],
    description: "A major tenant stops paying rent.",
    why_it_matters: "Tenant default creates both an income gap and potential legal and turnover costs.",
    severity: "high",
  },

  // ─── Investment Scenarios ─────────────────────────────
  {
    scenario_id: "RS-DIVIDEND-CUT",
    label: "Dividend or Distribution Cut",
    applicable_families: ["investment_led"],
    applicable_industries: ["investing_asset"],
    description: "A major holding reduces or eliminates its dividend or distribution.",
    why_it_matters: "Dividend cuts directly reduce passive income with no alternative revenue to replace it.",
    severity: "high",
  },
  {
    scenario_id: "RS-MARKET-CORRECTION",
    label: "Market Correction",
    applicable_families: ["investment_led"],
    applicable_industries: ["investing_asset"],
    description: "A broad market correction reduces portfolio income and values.",
    why_it_matters: "Market corrections can reduce distributions across multiple holdings simultaneously.",
    severity: "high",
  },
];
