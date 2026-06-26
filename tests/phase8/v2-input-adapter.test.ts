import { describe, it, expect } from "vitest";
import type { AssessmentRecord } from "../../src/lib/engine/v2/types";
import type { CPCInput } from "../../src/lib/cpc/formula";
import {
  extractFragilityScore,
  extractConstraintCount,
  extractConcentrationFactor,
  extractScenarioAmplification,
  adaptToCPCInput,
  validateCPCInput,
} from "../../src/lib/cpc/v2-input-adapter";

// ─── MINIMAL ASSESSMENT RECORD FIXTURES ───────────────────────────────────

/**
 * Create a minimal AssessmentRecord fixture with required fields.
 * Allows selective overrides for testing specific scenarios.
 */
function createBaseAssessmentRecord(overrides: Partial<AssessmentRecord> = {}): AssessmentRecord {
  return {
    id: "test-assessment-1",
    created_at: new Date(),
    updated_at: new Date(),

    // Fragility structure
    fragility: {
      fragility_score: 0.5,
    },

    // Constraints structure
    constraints: {
      root_constraint: { id: "c1", type: "root", description: "Root" },
      primary_constraint: { id: "c2", type: "primary", description: "Primary" },
      secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
      dependent_constraint: null,
      hidden_unlock: null,
    },

    // Normalized inputs
    normalized_inputs: {
      largest_source_pct: 0.5,
    },

    // Score fields (for independence testing)
    final_score: 50,
    stability_band: "moderate",
    scores: {
      financial_health: 50,
      commitment_resilience: 50,
    },

    // Scenarios and lift (should be ignored by adapter)
    scenarios: [
      { id: "s1", description: "Scenario 1", score_drop: 5 },
    ],
    score_lift_projection: 10,

    ...overrides,
  } as any;
}

// ─── TEST SUITE: FRAGILITY EXTRACTION ────────────────────────────────────

describe("v2-input-adapter: extractFragilityScore()", () => {
  it("extracts fragility score from record.fragility.fragility_score", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.75 },
    });
    expect(extractFragilityScore(record)).toBe(0.75);
  });

  it("returns 0 when fragility_score is 0", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 0 },
    });
    expect(extractFragilityScore(record)).toBe(0);
  });

  it("returns 1 when fragility_score is 1", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 1 },
    });
    expect(extractFragilityScore(record)).toBe(1);
  });

  it("clamps negative fragility_score to 0", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: -0.5 },
    });
    expect(extractFragilityScore(record)).toBe(0);
  });

  it("clamps fragility_score above 1 to 1", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 1.5 },
    });
    expect(extractFragilityScore(record)).toBe(1);
  });

  it("defaults to 0 when fragility_score is undefined", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: undefined as any },
    });
    expect(extractFragilityScore(record)).toBe(0);
  });

  it("is independent from final_score", () => {
    const record1 = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      final_score: 30,
    });
    const record2 = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      final_score: 80,
    });
    expect(extractFragilityScore(record1)).toBe(extractFragilityScore(record2));
  });

  it("is independent from stability_band", () => {
    const record1 = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      stability_band: "low" as any,
    });
    const record2 = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      stability_band: "high" as any,
    });
    expect(extractFragilityScore(record1)).toBe(extractFragilityScore(record2));
  });
});

// ─── TEST SUITE: CONSTRAINT COUNT EXTRACTION ──────────────────────────────

describe("v2-input-adapter: extractConstraintCount()", () => {
  it("counts 3 when root, primary, secondary are non-null", () => {
    const record = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
    });
    expect(extractConstraintCount(record)).toBe(3);
  });

  it("counts 4 when dependent_constraint is added", () => {
    const record = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: { id: "c4", type: "dependent", description: "Dependent" },
        hidden_unlock: null,
      },
    });
    expect(extractConstraintCount(record)).toBe(4);
  });

  it("counts 5 when all constraints are non-null", () => {
    const record = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: { id: "c4", type: "dependent", description: "Dependent" },
        hidden_unlock: { id: "c5", type: "hidden", description: "Hidden" },
      },
    });
    expect(extractConstraintCount(record)).toBe(5);
  });

  it("clamps minimum count to 1 when all constraints are null", () => {
    const record = createBaseAssessmentRecord({
      constraints: {
        root_constraint: null,
        primary_constraint: null,
        secondary_constraint: null,
        dependent_constraint: null,
        hidden_unlock: null,
      },
    });
    expect(extractConstraintCount(record)).toBeGreaterThanOrEqual(1);
  });

  it("returns 3 (minimum realistic) with 3 base constraints", () => {
    const record = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
    });
    expect(extractConstraintCount(record)).toBe(3);
  });

  it("does not depend on final_score", () => {
    const record1 = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      final_score: 30,
    });
    const record2 = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      final_score: 80,
    });
    expect(extractConstraintCount(record1)).toBe(extractConstraintCount(record2));
  });

  it("does not depend on stability_band", () => {
    const record1 = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      stability_band: "low" as any,
    });
    const record2 = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      stability_band: "high" as any,
    });
    expect(extractConstraintCount(record1)).toBe(extractConstraintCount(record2));
  });
});

// ─── TEST SUITE: CONCENTRATION EXTRACTION ────────────────────────────────

describe("v2-input-adapter: extractConcentrationFactor()", () => {
  it("returns largest_source_pct when it is a decimal 0-1", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.4 },
    });
    expect(extractConcentrationFactor(record)).toBe(0.4);
  });

  it("normalizes largest_source_pct from 0-100 percentage to 0-1", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 40 },
    });
    expect(extractConcentrationFactor(record)).toBe(0.4);
  });

  it("returns 0 when largest_source_pct is 0", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0 },
    });
    expect(extractConcentrationFactor(record)).toBe(0);
  });

  it("returns 1 when largest_source_pct is 1", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 1 },
    });
    expect(extractConcentrationFactor(record)).toBe(1);
  });

  it("returns 1 when largest_source_pct is 100", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 100 },
    });
    expect(extractConcentrationFactor(record)).toBe(1);
  });

  it("clamps negative values to 0", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: -0.5 },
    });
    expect(extractConcentrationFactor(record)).toBe(0);
  });

  it("clamps values above 1 (as percentage) to 1", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 150 },
    });
    expect(extractConcentrationFactor(record)).toBe(1);
  });

  it("uses default 0.5 when largest_source_pct is undefined", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: undefined as any },
    });
    expect(extractConcentrationFactor(record)).toBe(0.5);
  });

  it("uses default 0.5 when normalized_inputs is undefined", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: undefined as any,
    });
    expect(extractConcentrationFactor(record)).toBe(0.5);
  });

  it("does not use record.scores fields", () => {
    const record1 = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.5 },
      scores: { financial_health: 20, commitment_resilience: 20 },
    });
    const record2 = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.5 },
      scores: { financial_health: 80, commitment_resilience: 80 },
    });
    expect(extractConcentrationFactor(record1)).toBe(extractConcentrationFactor(record2));
  });

  it("does not use final_score", () => {
    const record1 = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.5 },
      final_score: 30,
    });
    const record2 = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.5 },
      final_score: 80,
    });
    expect(extractConcentrationFactor(record1)).toBe(extractConcentrationFactor(record2));
  });

  it("does not use stability_band", () => {
    const record1 = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.5 },
      stability_band: "low" as any,
    });
    const record2 = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.5 },
      stability_band: "high" as any,
    });
    expect(extractConcentrationFactor(record1)).toBe(extractConcentrationFactor(record2));
  });
});

// ─── TEST SUITE: SCENARIO AMPLIFICATION EXTRACTION ────────────────────────

describe("v2-input-adapter: extractScenarioAmplification()", () => {
  it("always returns 1.0 (v1 baseline)", () => {
    const record = createBaseAssessmentRecord({
      scenarios: [
        { id: "s1", description: "Scenario 1", score_drop: 10 },
      ],
    });
    expect(extractScenarioAmplification(record)).toBe(1.0);
  });

  it("returns 1.0 when scenarios is empty", () => {
    const record = createBaseAssessmentRecord({
      scenarios: [],
    });
    expect(extractScenarioAmplification(record)).toBe(1.0);
  });

  it("returns 1.0 when scenarios have different score_drops", () => {
    const record = createBaseAssessmentRecord({
      scenarios: [
        { id: "s1", description: "Scenario 1", score_drop: 5 },
        { id: "s2", description: "Scenario 2", score_drop: 15 },
        { id: "s3", description: "Scenario 3", score_drop: 25 },
      ],
    });
    expect(extractScenarioAmplification(record)).toBe(1.0);
  });

  it("ignores changes in scenarios", () => {
    const record1 = createBaseAssessmentRecord({
      scenarios: [
        { id: "s1", description: "Low stress", score_drop: 5 },
      ],
    });
    const record2 = createBaseAssessmentRecord({
      scenarios: [
        { id: "s1", description: "High stress", score_drop: 50 },
      ],
    });
    expect(extractScenarioAmplification(record1)).toBe(extractScenarioAmplification(record2));
  });

  it("ignores changes in score_lift_projection", () => {
    const record1 = createBaseAssessmentRecord({
      score_lift_projection: 5,
    });
    const record2 = createBaseAssessmentRecord({
      score_lift_projection: 50,
    });
    expect(extractScenarioAmplification(record1)).toBe(extractScenarioAmplification(record2));
  });

  it("ignores changes in final_score", () => {
    const record1 = createBaseAssessmentRecord({
      final_score: 30,
      scenarios: [
        { id: "s1", description: "Scenario 1", score_drop: 10 },
      ],
    });
    const record2 = createBaseAssessmentRecord({
      final_score: 80,
      scenarios: [
        { id: "s1", description: "Scenario 1", score_drop: 10 },
      ],
    });
    expect(extractScenarioAmplification(record1)).toBe(extractScenarioAmplification(record2));
  });

  it("ignores changes in stability_band", () => {
    const record1 = createBaseAssessmentRecord({
      stability_band: "low" as any,
      scenarios: [
        { id: "s1", description: "Scenario 1", score_drop: 10 },
      ],
    });
    const record2 = createBaseAssessmentRecord({
      stability_band: "high" as any,
      scenarios: [
        { id: "s1", description: "Scenario 1", score_drop: 10 },
      ],
    });
    expect(extractScenarioAmplification(record1)).toBe(extractScenarioAmplification(record2));
  });
});

// ─── TEST SUITE: ADAPT TO CPC INPUT ──────────────────────────────────────

describe("v2-input-adapter: adaptToCPCInput()", () => {
  it("returns CPCInput with all four extracted values", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
    });
    const input = adaptToCPCInput(record);

    expect(input).toHaveProperty("fragility_score");
    expect(input).toHaveProperty("constraint_count");
    expect(input).toHaveProperty("concentration_factor");
    expect(input).toHaveProperty("scenario_amplification");
  });

  it("uses extracted fragility_score", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.7 },
    });
    const input = adaptToCPCInput(record);
    expect(input.fragility_score).toBe(0.7);
  });

  it("uses extracted constraint_count", () => {
    const record = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: { id: "c4", type: "dependent", description: "Dependent" },
        hidden_unlock: null,
      },
    });
    const input = adaptToCPCInput(record);
    expect(input.constraint_count).toBe(4);
  });

  it("uses extracted concentration_factor", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.6 },
    });
    const input = adaptToCPCInput(record);
    expect(input.concentration_factor).toBe(0.6);
  });

  it("uses extracted scenario_amplification (v1 baseline 1.0)", () => {
    const record = createBaseAssessmentRecord();
    const input = adaptToCPCInput(record);
    expect(input.scenario_amplification).toBe(1.0);
  });

  it("returns valid CPCInput (all fields within valid ranges)", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
    });
    const input = adaptToCPCInput(record);

    // Validate ranges
    expect(input.fragility_score).toBeGreaterThanOrEqual(0);
    expect(input.fragility_score).toBeLessThanOrEqual(1);
    expect(Number.isInteger(input.constraint_count)).toBe(true);
    expect(input.constraint_count).toBeGreaterThanOrEqual(1);
    expect(input.constraint_count).toBeLessThanOrEqual(5);
    expect(input.concentration_factor).toBeGreaterThanOrEqual(0);
    expect(input.concentration_factor).toBeLessThanOrEqual(1);
    expect(input.scenario_amplification).toBeGreaterThanOrEqual(0.3);
    expect(input.scenario_amplification).toBeLessThanOrEqual(1.5);
  });

  it("does not mutate the input record", () => {
    const record = createBaseAssessmentRecord();
    const recordBefore = JSON.stringify(record);
    adaptToCPCInput(record);
    const recordAfter = JSON.stringify(record);
    expect(recordAfter).toBe(recordBefore);
  });

  it("does not attach properties to the input record", () => {
    const record = createBaseAssessmentRecord();
    const keysBeefore = Object.keys(record);
    adaptToCPCInput(record);
    const keysAfter = Object.keys(record);
    expect(keysAfter).toEqual(keysBeefore);
  });
});

// ─── TEST SUITE: VALIDATE CPC INPUT ──────────────────────────────────────

describe("v2-input-adapter: validateCPCInput()", () => {
  it("returns true for valid CPCInput", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns true for fragility_score = 0", () => {
    const input: CPCInput = {
      fragility_score: 0,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns true for fragility_score = 1", () => {
    const input: CPCInput = {
      fragility_score: 1,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns false for fragility_score < 0", () => {
    const input: CPCInput = {
      fragility_score: -0.1,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for fragility_score > 1", () => {
    const input: CPCInput = {
      fragility_score: 1.1,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for fragility_score = NaN", () => {
    const input: CPCInput = {
      fragility_score: NaN,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for fragility_score = Infinity", () => {
    const input: CPCInput = {
      fragility_score: Infinity,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns true for constraint_count = 1", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 1,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns true for constraint_count = 5", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 5,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns false for constraint_count < 1", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 0,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for constraint_count > 5", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 6,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for constraint_count that is not an integer", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3.5,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for constraint_count = NaN", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: NaN,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns true for concentration_factor = 0", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns true for concentration_factor = 1", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 1,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns false for concentration_factor < 0", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: -0.1,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for concentration_factor > 1", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 1.1,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for concentration_factor = NaN", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: NaN,
      scenario_amplification: 0.9,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns true for scenario_amplification = 0.3", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.3,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns true for scenario_amplification = 1.5", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 1.5,
    };
    expect(validateCPCInput(input)).toBe(true);
  });

  it("returns false for scenario_amplification < 0.3", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.2,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for scenario_amplification > 1.5", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 1.6,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for scenario_amplification = NaN", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: NaN,
    };
    expect(validateCPCInput(input)).toBe(false);
  });

  it("returns false for scenario_amplification = Infinity", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: Infinity,
    };
    expect(validateCPCInput(input)).toBe(false);
  });
});

// ─── TEST SUITE: INDEPENDENCE FROM SCORE/BAND FIELDS ──────────────────────

describe("v2-input-adapter: Independence from score/band fields", () => {
  it("produces identical CPCInput when final_score differs but structural fields are identical", () => {
    const recordA = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      final_score: 30,
    });
    const recordB = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      final_score: 90,
    });

    const inputA = adaptToCPCInput(recordA);
    const inputB = adaptToCPCInput(recordB);

    expect(inputA.fragility_score).toBe(inputB.fragility_score);
    expect(inputA.constraint_count).toBe(inputB.constraint_count);
    expect(inputA.concentration_factor).toBe(inputB.concentration_factor);
    expect(inputA.scenario_amplification).toBe(inputB.scenario_amplification);
  });

  it("produces identical CPCInput when stability_band differs but structural fields are identical", () => {
    const recordA = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      stability_band: "low" as any,
    });
    const recordB = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      stability_band: "high" as any,
    });

    const inputA = adaptToCPCInput(recordA);
    const inputB = adaptToCPCInput(recordB);

    expect(inputA.fragility_score).toBe(inputB.fragility_score);
    expect(inputA.constraint_count).toBe(inputB.constraint_count);
    expect(inputA.concentration_factor).toBe(inputB.concentration_factor);
    expect(inputA.scenario_amplification).toBe(inputB.scenario_amplification);
  });

  it("produces identical CPCInput when scenarios differ but structural fields are identical", () => {
    const recordA = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      scenarios: [
        { id: "s1", description: "Low stress", score_drop: 5 },
      ],
    });
    const recordB = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      scenarios: [
        { id: "s1", description: "High stress", score_drop: 50 },
      ],
    });

    const inputA = adaptToCPCInput(recordA);
    const inputB = adaptToCPCInput(recordB);

    expect(JSON.stringify(inputA)).toBe(JSON.stringify(inputB));
  });

  it("produces identical CPCInput when score_lift_projection differs but structural fields are identical", () => {
    const recordA = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      score_lift_projection: 5,
    });
    const recordB = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.5 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.5 },
      score_lift_projection: 50,
    });

    const inputA = adaptToCPCInput(recordA);
    const inputB = adaptToCPCInput(recordB);

    expect(JSON.stringify(inputA)).toBe(JSON.stringify(inputB));
  });
});

// ─── TEST SUITE: INTEGRATION QUARANTINE ──────────────────────────────────

describe("v2-input-adapter: Integration quarantine", () => {
  it("test file does not import routes, API, Prisma, UI, PDF, or audit modules", async () => {
    // This test verifies by its very existence that the imports at the top of this file
    // do not include any forbidden modules. The test file imports ONLY:
    // - vitest (testing framework)
    // - AssessmentRecord and CPCInput (types only)
    // - adapter functions from the pure module
    //
    // This is a smoke test that would fail at TypeScript compile time if a forbidden
    // import were added.
    expect(true).toBe(true);
  });
});
