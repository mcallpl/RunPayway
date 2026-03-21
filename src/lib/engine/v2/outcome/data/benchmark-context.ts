// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Benchmark Context Registry (OL-1.0 Phase 3)
// Family-level and industry-level benchmark framing
// ═══════════════════════════════════════════════════════════════

import type { IncomeModelFamilyId } from "../types";

export interface BenchmarkContextEntry {
  cluster_key: string;
  peer_group_label: string;
  framing_text: string;
  typical_score_range: { low: number; mid: number; high: number };
  common_strengths: string[];
  common_weaknesses: string[];
}

export const FAMILY_BENCHMARK_CONTEXT: Record<IncomeModelFamilyId, BenchmarkContextEntry> = {
  employment_led: {
    cluster_key: "employment_benchmark",
    peer_group_label: "Salaried Employees",
    framing_text: "Among salaried employees with similar income structures",
    typical_score_range: { low: 15, mid: 30, high: 45 },
    common_strengths: ["Predictable pay cycle", "Low month-to-month variability"],
    common_weaknesses: ["100% employer concentration", "Zero continuity if employment ends", "No forward visibility beyond pay period"],
  },
  commission_led: {
    cluster_key: "commission_benchmark",
    peer_group_label: "Commission Earners",
    framing_text: "Among commission-based professionals in your market",
    typical_score_range: { low: 18, mid: 35, high: 55 },
    common_strengths: ["Multiple concurrent deal opportunities", "High income ceiling potential"],
    common_weaknesses: ["High earnings variability", "Pipeline-dependent forward visibility", "Income stops when selling stops"],
  },
  contract_project_led: {
    cluster_key: "contract_benchmark",
    peer_group_label: "Contract & Project Professionals",
    framing_text: "Among contract and project-based professionals",
    typical_score_range: { low: 20, mid: 38, high: 58 },
    common_strengths: ["Defined engagement terms", "Milestone-based payment schedules"],
    common_weaknesses: ["Gap risk between engagements", "Client concentration in active contracts", "Limited recurring revenue"],
  },
  retainer_subscription_led: {
    cluster_key: "retainer_benchmark",
    peer_group_label: "Retainer & Subscription Providers",
    framing_text: "Among retainer and subscription-based service providers",
    typical_score_range: { low: 30, mid: 50, high: 72 },
    common_strengths: ["Monthly recurring revenue base", "Forward visibility through committed terms"],
    common_weaknesses: ["Churn and non-renewal risk", "Client concentration within recurring base", "Labor-dependent service delivery"],
  },
  practice_led: {
    cluster_key: "practice_benchmark",
    peer_group_label: "Private Practitioners",
    framing_text: "Among private practitioners and solo service providers",
    typical_score_range: { low: 18, mid: 35, high: 52 },
    common_strengths: ["Established referral relationships", "Recurring client needs"],
    common_weaknesses: ["Practitioner availability dependency", "Limited scalability", "Short forward booking window"],
  },
  agency_led: {
    cluster_key: "agency_benchmark",
    peer_group_label: "Agency Operators",
    framing_text: "Among agency and team-based service businesses",
    typical_score_range: { low: 25, mid: 42, high: 65 },
    common_strengths: ["Team-based delivery capacity", "Retainer client relationships"],
    common_weaknesses: ["Top-account concentration", "Founder dependency", "Scope creep eroding margins"],
  },
  product_led: {
    cluster_key: "product_benchmark",
    peer_group_label: "Product Sellers",
    framing_text: "Among product-based businesses in your revenue range",
    typical_score_range: { low: 22, mid: 40, high: 62 },
    common_strengths: ["Repeat customer potential", "Scalable without direct labor"],
    common_weaknesses: ["Demand volatility", "Channel and platform dependency", "Limited forward-committed revenue"],
  },
  creator_audience_led: {
    cluster_key: "creator_benchmark",
    peer_group_label: "Creators & Media Professionals",
    framing_text: "Among creators and media professionals in your audience tier",
    typical_score_range: { low: 15, mid: 30, high: 50 },
    common_strengths: ["Multiple monetization paths", "Audience leverage for product launches"],
    common_weaknesses: ["Platform algorithm dependency", "Episodic sponsor income", "Content production burnout risk"],
  },
  referral_affiliate_led: {
    cluster_key: "affiliate_benchmark",
    peer_group_label: "Affiliate & Referral Earners",
    framing_text: "Among affiliate and referral-based income earners",
    typical_score_range: { low: 15, mid: 28, high: 48 },
    common_strengths: ["Low overhead", "Potential for passive income through evergreen content"],
    common_weaknesses: ["Program term changes", "Traffic dependency", "One-time commission structures"],
  },
  asset_rental_led: {
    cluster_key: "rental_benchmark",
    peer_group_label: "Rental & Asset Income Earners",
    framing_text: "Among rental and asset-based income earners in your portfolio tier",
    typical_score_range: { low: 35, mid: 55, high: 78 },
    common_strengths: ["Lease-based forward visibility", "Labor-independent income", "Tangible asset backing"],
    common_weaknesses: ["Vacancy risk", "Tenant concentration", "Capital expenditure exposure"],
  },
  investment_led: {
    cluster_key: "investment_benchmark",
    peer_group_label: "Investment & Passive Income Earners",
    framing_text: "Among investment and passive income earners in your portfolio tier",
    typical_score_range: { low: 30, mid: 50, high: 75 },
    common_strengths: ["Labor-independent income", "Diversification across asset classes"],
    common_weaknesses: ["Market volatility", "Dividend policy changes", "Concentration in single positions"],
  },
  hybrid_multi: {
    cluster_key: "hybrid_benchmark",
    peer_group_label: "Multi-Source Income Earners",
    framing_text: "Among professionals with multiple income sources",
    typical_score_range: { low: 25, mid: 42, high: 65 },
    common_strengths: ["Multiple income streams", "Built-in diversification potential"],
    common_weaknesses: ["Hidden dominant-source concentration", "Management complexity", "Weakest-stream drag on overall score"],
  },
};
