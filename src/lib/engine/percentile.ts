// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Peer Stability Percentile (Deterministic)

// Locked band distribution (same as PEER_DISTRIBUTION in report)
// Limited: 22%, Developing: 38%, Established: 28%, High: 12%
// Percentile = percentage of distribution scoring <= subject score

export function computePeerPercentile(finalScore: number): number {
  let percentile: number;

  if (finalScore <= 39) {
    // Limited band: 0–39 maps to 0–22nd percentile
    percentile = (finalScore / 40) * 22;
  } else if (finalScore <= 59) {
    // Developing band: 40–59 maps to 22–60th percentile
    percentile = 22 + ((finalScore - 40) / 20) * 38;
  } else if (finalScore <= 79) {
    // Established band: 60–79 maps to 60–88th percentile
    percentile = 60 + ((finalScore - 60) / 20) * 28;
  } else {
    // High band: 80–100 maps to 88–100th percentile
    percentile = 88 + ((finalScore - 80) / 21) * 12;
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
