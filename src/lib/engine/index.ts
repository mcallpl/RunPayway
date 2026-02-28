import { calculateScore } from "./scoring";
import { runSimulations } from "./simulations";
import { generateReference } from "./reference";
import { generateAuthenticationCode } from "./authentication";
import { MODEL, VERSION } from "./constants";
import type { EngineOutput } from "./types";

export function runDiagnostic(responses: number[]): EngineOutput {
  const scoring = calculateScore(responses);
  const simulations = runSimulations(responses);
  const referenceId = generateReference();
  const timestampUTC = new Date().toISOString();
  const authenticationCode = generateAuthenticationCode(
    referenceId,
    timestampUTC,
    scoring.finalScore
  );

  return {
    referenceId,
    timestampUTC,
    model: MODEL,
    version: VERSION,
    finalScore: scoring.finalScore,
    band: scoring.band,
    stabilityInternal: scoring.stabilityInternal,
    diversityInternal: scoring.diversityInternal,
    independenceInternal: scoring.independenceInternal,
    stabilityWeighted: scoring.stabilityWeighted,
    diversityWeighted: scoring.diversityWeighted,
    independenceWeighted: scoring.independenceWeighted,
    responses,
    simulations,
    authenticationCode,
  };
}

export { calculateScore } from "./scoring";
export { runSimulations } from "./simulations";
export { generateReference } from "./reference";
export { generateAuthenticationCode } from "./authentication";
export { QUESTIONS } from "./questions";
export * from "./types";
export * from "./constants";
