// Sector benchmark data — seeded estimates, marked B-2.0
// These will be refined as real assessment data accumulates.

import type { IndustrySector } from "../types";

export interface SectorBenchmarkEntry {
  avg_score: number;
  top_20_threshold: number;
  peer_band_distribution: {
    limited: number;
    developing: number;
    established: number;
    high: number;
  };
  indicator_averages?: Record<string, number>;
}

export const SECTOR_BENCHMARKS: Record<IndustrySector, SectorBenchmarkEntry> = {
  real_estate: {
    avg_score: 38,
    top_20_threshold: 62,
    peer_band_distribution: { limited: 30, developing: 35, established: 25, high: 10 },
    indicator_averages: { income_persistence: 35, source_diversification: 30, forward_visibility: 25, concentration_resilience: 40, labor_independence: 25, earnings_stability: 35 },
  },
  finance_banking: {
    avg_score: 48,
    top_20_threshold: 70,
    peer_band_distribution: { limited: 18, developing: 35, established: 32, high: 15 },
    indicator_averages: { income_persistence: 50, source_diversification: 40, forward_visibility: 45, concentration_resilience: 45, labor_independence: 40, earnings_stability: 50 },
  },
  insurance: {
    avg_score: 52,
    top_20_threshold: 72,
    peer_band_distribution: { limited: 15, developing: 30, established: 35, high: 20 },
    indicator_averages: { income_persistence: 55, source_diversification: 45, forward_visibility: 50, concentration_resilience: 50, labor_independence: 35, earnings_stability: 55 },
  },
  technology: {
    avg_score: 45,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 20, developing: 35, established: 30, high: 15 },
    indicator_averages: { income_persistence: 45, source_diversification: 40, forward_visibility: 40, concentration_resilience: 45, labor_independence: 35, earnings_stability: 45 },
  },
  healthcare: {
    avg_score: 50,
    top_20_threshold: 70,
    peer_band_distribution: { limited: 15, developing: 32, established: 35, high: 18 },
    indicator_averages: { income_persistence: 50, source_diversification: 35, forward_visibility: 45, concentration_resilience: 40, labor_independence: 40, earnings_stability: 55 },
  },
  legal_services: {
    avg_score: 46,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 18, developing: 35, established: 32, high: 15 },
    indicator_averages: { income_persistence: 45, source_diversification: 35, forward_visibility: 40, concentration_resilience: 40, labor_independence: 30, earnings_stability: 45 },
  },
  consulting_professional_services: {
    avg_score: 42,
    top_20_threshold: 65,
    peer_band_distribution: { limited: 22, developing: 38, established: 28, high: 12 },
    indicator_averages: { income_persistence: 40, source_diversification: 40, forward_visibility: 35, concentration_resilience: 40, labor_independence: 30, earnings_stability: 40 },
  },
  sales_brokerage: {
    avg_score: 36,
    top_20_threshold: 58,
    peer_band_distribution: { limited: 32, developing: 35, established: 23, high: 10 },
    indicator_averages: { income_persistence: 30, source_diversification: 30, forward_visibility: 20, concentration_resilience: 35, labor_independence: 20, earnings_stability: 30 },
  },
  media_entertainment: {
    avg_score: 34,
    top_20_threshold: 55,
    peer_band_distribution: { limited: 35, developing: 33, established: 22, high: 10 },
    indicator_averages: { income_persistence: 30, source_diversification: 35, forward_visibility: 20, concentration_resilience: 40, labor_independence: 25, earnings_stability: 25 },
  },
  construction_trades: {
    avg_score: 40,
    top_20_threshold: 60,
    peer_band_distribution: { limited: 25, developing: 38, established: 27, high: 10 },
    indicator_averages: { income_persistence: 30, source_diversification: 35, forward_visibility: 35, concentration_resilience: 40, labor_independence: 20, earnings_stability: 35 },
  },
  retail_ecommerce: {
    avg_score: 42,
    top_20_threshold: 62,
    peer_band_distribution: { limited: 22, developing: 38, established: 28, high: 12 },
    indicator_averages: { income_persistence: 40, source_diversification: 35, forward_visibility: 30, concentration_resilience: 45, labor_independence: 35, earnings_stability: 35 },
  },
  hospitality_food_service: {
    avg_score: 35,
    top_20_threshold: 55,
    peer_band_distribution: { limited: 32, developing: 38, established: 22, high: 8 },
    indicator_averages: { income_persistence: 30, source_diversification: 30, forward_visibility: 20, concentration_resilience: 35, labor_independence: 20, earnings_stability: 30 },
  },
  transportation_logistics: {
    avg_score: 40,
    top_20_threshold: 60,
    peer_band_distribution: { limited: 25, developing: 38, established: 27, high: 10 },
    indicator_averages: { income_persistence: 35, source_diversification: 30, forward_visibility: 35, concentration_resilience: 35, labor_independence: 25, earnings_stability: 40 },
  },
  manufacturing: {
    avg_score: 48,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 18, developing: 35, established: 32, high: 15 },
    indicator_averages: { income_persistence: 45, source_diversification: 35, forward_visibility: 45, concentration_resilience: 40, labor_independence: 35, earnings_stability: 50 },
  },
  education: {
    avg_score: 52,
    top_20_threshold: 70,
    peer_band_distribution: { limited: 12, developing: 30, established: 38, high: 20 },
    indicator_averages: { income_persistence: 55, source_diversification: 30, forward_visibility: 55, concentration_resilience: 35, labor_independence: 40, earnings_stability: 60 },
  },
  nonprofit_public_sector: {
    avg_score: 50,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 15, developing: 32, established: 35, high: 18 },
    indicator_averages: { income_persistence: 50, source_diversification: 30, forward_visibility: 50, concentration_resilience: 35, labor_independence: 35, earnings_stability: 55 },
  },
  agriculture: {
    avg_score: 35,
    top_20_threshold: 55,
    peer_band_distribution: { limited: 30, developing: 38, established: 24, high: 8 },
    indicator_averages: { income_persistence: 30, source_diversification: 30, forward_visibility: 25, concentration_resilience: 35, labor_independence: 20, earnings_stability: 25 },
  },
  energy_utilities: {
    avg_score: 50,
    top_20_threshold: 70,
    peer_band_distribution: { limited: 15, developing: 30, established: 35, high: 20 },
    indicator_averages: { income_persistence: 50, source_diversification: 35, forward_visibility: 50, concentration_resilience: 40, labor_independence: 40, earnings_stability: 55 },
  },
  other: {
    avg_score: 42,
    top_20_threshold: 65,
    peer_band_distribution: { limited: 22, developing: 38, established: 28, high: 12 },
    indicator_averages: { income_persistence: 40, source_diversification: 35, forward_visibility: 35, concentration_resilience: 40, labor_independence: 30, earnings_stability: 40 },
  },
};
