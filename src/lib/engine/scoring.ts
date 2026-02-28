import { QUESTION_WEIGHTS, BAND_THRESHOLDS } from "./constants";
import type { Band, ScoringResult } from "./types";

const ELITE_MIN_SCORE = 88;
const ELITE_MIN_PILLAR = 80;
const ELITE_MIN_RESPONSE = 50;

function getBand(score: number): Band {
  for (const { min, max, band } of BAND_THRESHOLDS) {
    if (score >= min && score <= max) {
      return band as Band;
    }
  }
  return "Foundation";
}

export function calculateScore(responses: number[]): ScoringResult {
  if (responses.length !== 7) {
    throw new Error("Exactly 7 responses required.");
  }

  const contributions = responses.map(
    (value, i) => value * QUESTION_WEIGHTS[i]
  );
  const totalRaw = contributions.reduce((sum, c) => sum + c, 0);
  const finalScore = Math.round(totalRaw);

  const stabilityInternal = (responses[0] + responses[3] + responses[4]) / 3;
  const diversityInternal = (responses[1] + responses[2]) / 2;
  const independenceInternal = (responses[5] + responses[6]) / 2;

  const stabilityWeighted = contributions[0] + contributions[3] + contributions[4];
  const diversityWeighted = contributions[1] + contributions[2];
  const independenceWeighted = contributions[5] + contributions[6];

  let band = getBand(finalScore);

  if (band === "Elite") {
    const guardrailPass =
      finalScore >= ELITE_MIN_SCORE &&
      stabilityInternal >= ELITE_MIN_PILLAR &&
      diversityInternal >= ELITE_MIN_PILLAR &&
      independenceInternal >= ELITE_MIN_PILLAR &&
      responses.every((r) => r >= ELITE_MIN_RESPONSE);

    if (!guardrailPass) {
      band = "Strong";
    }
  }

  return {
    finalScore,
    band,
    stabilityInternal,
    diversityInternal,
    independenceInternal,
    stabilityWeighted,
    diversityWeighted,
    independenceWeighted,
  };
}
