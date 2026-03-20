// Engine 18 — Benchmarking
// Computes peer percentile, cluster averages, and outlier dimensions.

import type {
  ScoreBreakdown,
  ResolvedProfile,
  StructuralIndicator,
  BenchmarkResult,
  OutlierDimension,
  IndustrySector,
} from "../types";
import { SECTOR_BENCHMARKS } from "../data/sector-benchmarks";

export function computeBenchmarks(
  scores: ScoreBreakdown,
  profile: ResolvedProfile,
  indicators: StructuralIndicator[],
): BenchmarkResult {
  const sectorData =
    SECTOR_BENCHMARKS[profile.industry_sector] ?? SECTOR_BENCHMARKS.other;

  const peer_percentile = computePeerPercentile(
    scores.overall_score,
    sectorData.peer_band_distribution,
  );

  const outlier_dimensions: OutlierDimension[] = [];
  for (const indicator of indicators) {
    const peerAvg =
      sectorData.indicator_averages?.[indicator.key] ?? 50;
    const diff = indicator.normalized_value - peerAvg;
    const absDiff = Math.abs(diff);

    if (absDiff >= 15) {
      outlier_dimensions.push({
        factor: indicator.label,
        user_value: indicator.normalized_value,
        peer_average: peerAvg,
        direction: diff > 0 ? "above" : "below",
        magnitude: absDiff >= 30 ? "significant" : "notable",
      });
    }
  }

  return {
    peer_percentile,
    cluster_average_score: sectorData.avg_score,
    top_20_threshold: sectorData.top_20_threshold,
    peer_band_distribution: sectorData.peer_band_distribution,
    outlier_dimensions,
  };
}

function computePeerPercentile(
  score: number,
  distribution: {
    limited: number;
    developing: number;
    established: number;
    high: number;
  },
): number {
  const bandRanges = [
    { min: 0, max: 29, cumStart: 0, bandPct: distribution.limited },
    {
      min: 30,
      max: 49,
      cumStart: distribution.limited,
      bandPct: distribution.developing,
    },
    {
      min: 50,
      max: 74,
      cumStart: distribution.limited + distribution.developing,
      bandPct: distribution.established,
    },
    {
      min: 75,
      max: 100,
      cumStart:
        distribution.limited +
        distribution.developing +
        distribution.established,
      bandPct: distribution.high,
    },
  ];

  for (const range of bandRanges) {
    if (score >= range.min && score <= range.max) {
      const positionInBand =
        (score - range.min) / (range.max - range.min);
      return Math.round(range.cumStart + positionInBand * range.bandPct);
    }
  }
  return 50;
}
