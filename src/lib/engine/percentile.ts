// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Peer Stability Percentile (Deterministic)

// Default global band distribution (used when no sector distribution provided)
// Limited: 22%, Developing: 38%, Established: 28%, High: 12%
// Percentile = percentage of distribution scoring <= subject score

const DEFAULT_DISTRIBUTION = {
  limited: 22,
  developing: 38,
  established: 28,
  high: 12,
};

export function computePeerPercentile(
  finalScore: number,
  distribution?: { limited: number; developing: number; established: number; high: number }
): number {
  const dist = distribution || DEFAULT_DISTRIBUTION;

  // Cumulative boundaries based on distribution
  const limitedEnd = dist.limited;
  const developingEnd = limitedEnd + dist.developing;
  const establishedEnd = developingEnd + dist.established;

  let percentile: number;

  if (finalScore <= 39) {
    // Limited band: 0–39 maps to 0–limitedEnd percentile
    percentile = (finalScore / 40) * limitedEnd;
  } else if (finalScore <= 59) {
    // Developing band: 40–59 maps to limitedEnd–developingEnd percentile
    percentile = limitedEnd + ((finalScore - 40) / 20) * dist.developing;
  } else if (finalScore <= 79) {
    // Established band: 60–79 maps to developingEnd–establishedEnd percentile
    percentile = developingEnd + ((finalScore - 60) / 20) * dist.established;
  } else {
    // High band: 80–100 maps to establishedEnd–100 percentile
    percentile = establishedEnd + ((finalScore - 80) / 20) * dist.high;
  }

  return Math.floor(percentile);
}

export function formatPercentileLabel(percentile: number): string {
  const lastDigit = percentile % 10;
  const lastTwoDigits = percentile % 100;

  let suffix: string;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    suffix = "th";
  } else if (lastDigit === 1) {
    suffix = "st";
  } else if (lastDigit === 2) {
    suffix = "nd";
  } else if (lastDigit === 3) {
    suffix = "rd";
  } else {
    suffix = "th";
  }

  return `${percentile}${suffix}`;
}
