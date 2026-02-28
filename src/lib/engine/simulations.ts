import { calculateScore } from "./scoring";
import { RESPONSE_VALUES } from "./constants";
import type { Simulations } from "./types";

function reduceTier(value: number): number {
  const idx = RESPONSE_VALUES.indexOf(value as (typeof RESPONSE_VALUES)[number]);
  if (idx <= 0) return 0;
  return RESPONSE_VALUES[idx - 1];
}

export function runSimulations(responses: number[]): Simulations {
  const original = calculateScore(responses);

  const responsesA = [...responses];
  responsesA[1] = 0;
  const scenarioA = calculateScore(responsesA);

  const responsesB = [...responses];
  responsesB[5] = 0;
  const scenarioB = calculateScore(responsesB);

  const responsesC = [...responses];
  responsesC[4] = reduceTier(responses[4]);
  const scenarioC = calculateScore(responsesC);

  return {
    scenarioA: {
      adjustedScore: scenarioA.finalScore,
      delta: scenarioA.finalScore - original.finalScore,
    },
    scenarioB: {
      adjustedScore: scenarioB.finalScore,
      delta: scenarioB.finalScore - original.finalScore,
    },
    scenarioC: {
      adjustedScore: scenarioC.finalScore,
      delta: scenarioC.finalScore - original.finalScore,
    },
  };
}
