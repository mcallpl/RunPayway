export type Band = "Foundation" | "Developing" | "Strong" | "Elite";
export type ExposureTier = "Severe" | "Elevated" | "Moderate" | "Low";

export interface ScoringResult {
  finalScore: number;
  band: Band;
  stabilityInternal: number;
  diversityInternal: number;
  independenceInternal: number;
  stabilityWeighted: number;
  diversityWeighted: number;
  independenceWeighted: number;
}

export interface SimulationScenario {
  adjustedScore: number;
  delta: number;
}

export interface Simulations {
  scenarioA: SimulationScenario;
  scenarioB: SimulationScenario;
  scenarioC: SimulationScenario;
}

export interface EngineOutput {
  referenceId: string;
  timestampUTC: string;
  model: "RP-1.0";
  version: "1.0";
  finalScore: number;
  band: Band;
  stabilityInternal: number;
  diversityInternal: number;
  independenceInternal: number;
  stabilityWeighted: number;
  diversityWeighted: number;
  independenceWeighted: number;
  responses: number[];
  simulations: Simulations;
  authenticationCode: string | null;
}

export interface SetupData {
  firstName: string;
  email: string;
  role: string;
  revenueModels: string[];
  revenueRange: string;
  quarter: string;
}

export interface SubmissionRecord {
  referenceId: string;
  timestampUTC: string;
  setup: SetupData;
  responses: number[];
  finalScore: number;
  band: Band;
  stabilityInternal: number;
  diversityInternal: number;
  independenceInternal: number;
  model: "RP-1.0";
  version: "1.0";
  engineOutput: EngineOutput;
}

export interface Question {
  id: number;
  key: string;
  pillar: "Stability Base" | "Revenue Diversity" | "System Independence";
  text: string;
  options: string[];
}
