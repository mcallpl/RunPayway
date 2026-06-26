import { describe, it, expect } from "vitest";
import type { AssessmentRecord } from "../../src/lib/engine/v2/types";
import type { CPCInput } from "../../src/lib/cpc/formula";
import {
  computeInternalCPC,
  computeInternalCPCFromInput,
  type InternalCPCComputationResult,
} from "../../src/lib/cpc/internal-computation-service";

// ─── ASSESSMENT RECORD FIXTURES ──────────────────────────────────────────

/**
 * Create a minimal valid AssessmentRecord fixture.
 */
function createBaseAssessmentRecord(
  overrides: Partial<AssessmentRecord> = {}
): AssessmentRecord {
  return {
    assessment_id: "test-assessment-1",
    created_at: new Date(),
    updated_at: new Date(),

    // Structural inputs for CPC adapter
    fragility: {
      fragility_score: 0.5,
    },
    constraints: {
      root_constraint: { id: "c1", type: "root", description: "Root" },
      primary_constraint: { id: "c2", type: "primary", description: "Primary" },
      secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
      dependent_constraint: null,
      hidden_unlock: null,
    },
    normalized_inputs: {
      largest_source_pct: 0.5,
    },

    // Score fields (for independence testing, not used by CPC)
    final_score: 50,
    stability_band: "moderate" as any,
    scores: {
      financial_health: 50,
      commitment_resilience: 50,
    },

    // Scenario fields (should be ignored by CPC, amplification = 1.0)
    scenarios: [
      { id: "s1", description: "Scenario 1", score_drop: 5 },
    ],
    score_lift_projection: 10,

    ...overrides,
  } as any;
}

/**
 * Create a minimal valid CPCInput.
 */
function createBaseCPCInput(overrides: Partial<CPCInput> = {}): CPCInput {
  return {
    fragility_score: 0.5,
    constraint_count: 3,
    concentration_factor: 0.5,
    scenario_amplification: 0.9,
    ...overrides,
  };
}

// ─── TEST SUITE: computeInternalCPC(record) ──────────────────────────────

describe("internal-computation-service: computeInternalCPC(record)", () => {
  it("returns result with required fields", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);

    expect(result).toHaveProperty("assessment_id");
    expect(result).toHaveProperty("cpc_input");
    expect(result).toHaveProperty("cpc_result");
    expect(result).toHaveProperty("model_version");
    expect(result).toHaveProperty("threshold_version");
  });

  it("assessment_id equals record.assessment_id", () => {
    const record = createBaseAssessmentRecord({
      assessment_id: "custom-id-12345",
    });
    const result = computeInternalCPC(record);
    expect(result.assessment_id).toBe("custom-id-12345");
  });

  it("cpc_input contains extracted fragility_score", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.75 },
    });
    const result = computeInternalCPC(record);
    expect(result.cpc_input.fragility_score).toBe(0.75);
  });

  it("cpc_input contains extracted constraint_count", () => {
    const record = createBaseAssessmentRecord({
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: { id: "c4", type: "dependent", description: "Dependent" },
        hidden_unlock: null,
      },
    });
    const result = computeInternalCPC(record);
    expect(result.cpc_input.constraint_count).toBe(4);
  });

  it("cpc_input contains extracted concentration_factor", () => {
    const record = createBaseAssessmentRecord({
      normalized_inputs: { largest_source_pct: 0.6 },
    });
    const result = computeInternalCPC(record);
    expect(result.cpc_input.concentration_factor).toBe(0.6);
  });

  it("cpc_input scenario_amplification equals 1.0 (v1 baseline)", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result.cpc_input.scenario_amplification).toBe(1.0);
  });

  it("cpc_result contains classification (one of CPL/CPM/CPE/CPH/CPC)", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(["CPL", "CPM", "CPE", "CPH", "CPC"]).toContain(result.cpc_result.classification);
  });

  it("cpc_result contains cpi_internal (0-100)", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result.cpc_result.cpi_internal).toBeGreaterThanOrEqual(0);
    expect(result.cpc_result.cpi_internal).toBeLessThanOrEqual(100);
  });

  it("cpc_result contains normalized_inputs", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result.cpc_result.normalized_inputs).toHaveProperty("fragility_norm");
    expect(result.cpc_result.normalized_inputs).toHaveProperty("constraints_norm");
    expect(result.cpc_result.normalized_inputs).toHaveProperty("concentration_norm");
    expect(result.cpc_result.normalized_inputs).toHaveProperty("amplification_norm");
  });

  it("cpc_result contains threshold_trace", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result.cpc_result.threshold_trace).toHaveProperty("cpi_final");
    expect(result.cpc_result.threshold_trace).toHaveProperty("threshold_applied");
    expect(result.cpc_result.threshold_trace).toHaveProperty("rule_matched");
  });

  it("model_version equals 'cpc_v1_baseline'", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result.model_version).toBe("cpc_v1_baseline");
  });

  it("threshold_version equals 'cpc_thresholds_v1'", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result.threshold_version).toBe("cpc_thresholds_v1");
  });
});

// ─── TEST SUITE: computeInternalCPCFromInput(input, assessmentId?) ─────────

describe("internal-computation-service: computeInternalCPCFromInput(input, assessmentId?)", () => {
  it("computes CPC from valid CPCInput", () => {
    const input = createBaseCPCInput();
    const result = computeInternalCPCFromInput(input);
    expect(result.cpc_result).toBeDefined();
    expect(result.cpc_result.classification).toBeDefined();
  });

  it("includes provided assessmentId in result", () => {
    const input = createBaseCPCInput();
    const result = computeInternalCPCFromInput(input, "custom-assessment-id");
    expect(result.assessment_id).toBe("custom-assessment-id");
  });

  it("omits assessment_id when not provided", () => {
    const input = createBaseCPCInput();
    const result = computeInternalCPCFromInput(input);
    expect(result.assessment_id).toBeUndefined();
  });

  it("includes assessment_id as undefined when explicitly undefined", () => {
    const input = createBaseCPCInput();
    const result = computeInternalCPCFromInput(input, undefined);
    expect(result.assessment_id).toBeUndefined();
  });

  it("cpc_input matches provided input exactly", () => {
    const input = createBaseCPCInput({
      fragility_score: 0.7,
      constraint_count: 4,
      concentration_factor: 0.6,
      scenario_amplification: 1.1,
    });
    const result = computeInternalCPCFromInput(input);
    expect(result.cpc_input).toEqual(input);
  });

  it("model_version equals 'cpc_v1_baseline'", () => {
    const input = createBaseCPCInput();
    const result = computeInternalCPCFromInput(input);
    expect(result.model_version).toBe("cpc_v1_baseline");
  });

  it("threshold_version equals 'cpc_thresholds_v1'", () => {
    const input = createBaseCPCInput();
    const result = computeInternalCPCFromInput(input);
    expect(result.threshold_version).toBe("cpc_thresholds_v1");
  });
});

// ─── TEST SUITE: VALIDATION ERROR BEHAVIOR ──────────────────────────────

describe("internal-computation-service: Validation error behavior", () => {
  describe("computeInternalCPCFromInput(input) validation errors", () => {
    it("throws 'Invalid CPC input' when fragility_score < 0", () => {
      const input = createBaseCPCInput({ fragility_score: -0.1 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when fragility_score > 1", () => {
      const input = createBaseCPCInput({ fragility_score: 1.1 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when fragility_score is NaN", () => {
      const input = createBaseCPCInput({ fragility_score: NaN });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when fragility_score is Infinity", () => {
      const input = createBaseCPCInput({ fragility_score: Infinity });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when constraint_count < 1", () => {
      const input = createBaseCPCInput({ constraint_count: 0 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when constraint_count > 5", () => {
      const input = createBaseCPCInput({ constraint_count: 6 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when constraint_count is not an integer", () => {
      const input = createBaseCPCInput({ constraint_count: 3.5 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when concentration_factor < 0", () => {
      const input = createBaseCPCInput({ concentration_factor: -0.1 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when concentration_factor > 1", () => {
      const input = createBaseCPCInput({ concentration_factor: 1.1 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when concentration_factor is NaN", () => {
      const input = createBaseCPCInput({ concentration_factor: NaN });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when scenario_amplification < 0.3", () => {
      const input = createBaseCPCInput({ scenario_amplification: 0.2 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when scenario_amplification > 1.5", () => {
      const input = createBaseCPCInput({ scenario_amplification: 1.6 });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when scenario_amplification is NaN", () => {
      const input = createBaseCPCInput({ scenario_amplification: NaN });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });

    it("throws 'Invalid CPC input' when scenario_amplification is Infinity", () => {
      const input = createBaseCPCInput({ scenario_amplification: Infinity });
      expect(() => computeInternalCPCFromInput(input)).toThrow("Invalid CPC input");
    });
  });

  describe("computeInternalCPC(record) validation errors", () => {
    it("adapter defensively clamps fragility_score below 0 to valid 0", () => {
      const record = createBaseAssessmentRecord({
        fragility: { fragility_score: -0.5 }, // Clamped to 0
      });
      // Adapter clamps to valid range, so no error thrown
      const result = computeInternalCPC(record);
      expect(result.cpc_input.fragility_score).toBe(0);
    });

    it("adapter defensively clamps constraint_count to minimum 1 when all constraints are null", () => {
      const record = createBaseAssessmentRecord({
        constraints: {
          root_constraint: null,
          primary_constraint: null,
          secondary_constraint: null,
          dependent_constraint: null,
          hidden_unlock: null,
        },
      });
      // Adapter clamps count to valid range [1,5], so no error thrown
      const result = computeInternalCPC(record);
      expect(result.cpc_input.constraint_count).toBeGreaterThanOrEqual(1);
      expect(result.cpc_input.constraint_count).toBeLessThanOrEqual(5);
    });
  });
});

// ─── TEST SUITE: DETERMINISM ────────────────────────────────────────────

describe("internal-computation-service: Determinism", () => {
  it("computeInternalCPC returns identical output across three calls", () => {
    const record = createBaseAssessmentRecord({
      fragility: { fragility_score: 0.73 },
      constraints: {
        root_constraint: { id: "c1", type: "root", description: "Root" },
        primary_constraint: { id: "c2", type: "primary", description: "Primary" },
        secondary_constraint: { id: "c3", type: "secondary", description: "Secondary" },
        dependent_constraint: null,
        hidden_unlock: null,
      },
      normalized_inputs: { largest_source_pct: 0.62 },
    });

    const result1 = computeInternalCPC(record);
    const result2 = computeInternalCPC(record);
    const result3 = computeInternalCPC(record);

    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
    expect(JSON.stringify(result2)).toBe(JSON.stringify(result3));
  });

  it("computeInternalCPCFromInput returns identical output across three calls", () => {
    const input = createBaseCPCInput({
      fragility_score: 0.73,
      constraint_count: 3,
      concentration_factor: 0.62,
      scenario_amplification: 1.05,
    });

    const result1 = computeInternalCPCFromInput(input);
    const result2 = computeInternalCPCFromInput(input);
    const result3 = computeInternalCPCFromInput(input);

    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
    expect(JSON.stringify(result2)).toBe(JSON.stringify(result3));
  });

  it("result does not include computed_at field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("computed_at");
  });

  it("result does not include timestamp field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("timestamp");
  });

  it("result does not include generated_at field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("generated_at");
  });

  it("result does not include service-generated ID", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    // Should only have assessment_id from record, not a generated one
    expect(result.assessment_id).toBe(record.assessment_id);
    expect(typeof result.assessment_id).toBe("string");
  });
});

// ─── TEST SUITE: NO MUTATION ────────────────────────────────────────────

describe("internal-computation-service: No mutation", () => {
  it("computeInternalCPC does not mutate the record", () => {
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

    const recordBefore = JSON.stringify(record);
    computeInternalCPC(record);
    const recordAfter = JSON.stringify(record);

    expect(recordAfter).toBe(recordBefore);
  });

  it("does not add cpc property to record", () => {
    const record = createBaseAssessmentRecord();
    const keysBefore = Object.keys(record).sort();
    computeInternalCPC(record);
    const keysAfter = Object.keys(record).sort();

    expect(keysAfter).toEqual(keysBefore);
    expect(record).not.toHaveProperty("cpc");
  });

  it("does not add cpc_input property to record", () => {
    const record = createBaseAssessmentRecord();
    computeInternalCPC(record);
    expect(record).not.toHaveProperty("cpc_input");
  });

  it("does not add cpc_result property to record", () => {
    const record = createBaseAssessmentRecord();
    computeInternalCPC(record);
    expect(record).not.toHaveProperty("cpc_result");
  });

  it("does not add commitment_pressure property to record", () => {
    const record = createBaseAssessmentRecord();
    computeInternalCPC(record);
    expect(record).not.toHaveProperty("commitment_pressure");
  });

  it("does not add _cpc property to record", () => {
    const record = createBaseAssessmentRecord();
    computeInternalCPC(record);
    expect(record).not.toHaveProperty("_cpc");
  });

  it("does not modify _v2 field (if present)", () => {
    const record = createBaseAssessmentRecord({
      _v2: { some_field: "value" },
    } as any);
    const _v2Before = JSON.stringify(record._v2);
    computeInternalCPC(record);
    const _v2After = JSON.stringify(record._v2);

    expect(_v2After).toBe(_v2Before);
  });
});

// ─── TEST SUITE: INDEPENDENCE FROM SCORE/BAND FIELDS ─────────────────────

describe("internal-computation-service: Independence from score/band fields", () => {
  it("produces identical result when final_score differs but structural fields are identical", () => {
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

    const resultA = computeInternalCPC(recordA);
    const resultB = computeInternalCPC(recordB);

    expect(resultA.cpc_result.classification).toBe(resultB.cpc_result.classification);
    expect(resultA.cpc_result.cpi_internal).toBe(resultB.cpc_result.cpi_internal);
  });

  it("produces identical result when stability_band differs but structural fields are identical", () => {
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

    const resultA = computeInternalCPC(recordA);
    const resultB = computeInternalCPC(recordB);

    expect(JSON.stringify(resultA.cpc_result)).toBe(JSON.stringify(resultB.cpc_result));
  });

  it("produces identical result when scores field differs but structural fields are identical", () => {
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
      scores: { financial_health: 20, commitment_resilience: 20 },
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
      scores: { financial_health: 80, commitment_resilience: 80 },
    });

    const resultA = computeInternalCPC(recordA);
    const resultB = computeInternalCPC(recordB);

    expect(JSON.stringify(resultA.cpc_result)).toBe(JSON.stringify(resultB.cpc_result));
  });

  it("produces identical result when scenarios differ but structural fields are identical", () => {
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

    const resultA = computeInternalCPC(recordA);
    const resultB = computeInternalCPC(recordB);

    expect(JSON.stringify(resultA.cpc_result)).toBe(JSON.stringify(resultB.cpc_result));
  });

  it("produces identical result when score_lift_projection differs but structural fields are identical", () => {
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

    const resultA = computeInternalCPC(recordA);
    const resultB = computeInternalCPC(recordB);

    expect(JSON.stringify(resultA.cpc_result)).toBe(JSON.stringify(resultB.cpc_result));
  });
});

// ─── TEST SUITE: NO OUTPUT GENERATION ───────────────────────────────────

describe("internal-computation-service: No output generation", () => {
  it("result does not include output field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("output");
  });

  it("result does not include label field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("label");
  });

  it("result does not include measurement field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("measurement");
  });

  it("result does not include interpretation field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("interpretation");
  });

  it("result does not include primary_drivers field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("primary_drivers");
  });

  it("result does not include implications field", () => {
    const record = createBaseAssessmentRecord();
    const result = computeInternalCPC(record);
    expect(result).not.toHaveProperty("implications");
  });

  it("test file does not import from ./output module", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const servicePath = path.resolve(
      __dirname,
      "../../src/lib/cpc/internal-computation-service.ts"
    );
    const content = fs.readFileSync(servicePath, "utf-8");

    expect(content).not.toContain('from "./output"');
    expect(content).not.toContain("generateCommitmentPressureOutput");
    expect(content).not.toContain("CommitmentPressureOutput");
  });
});

// ─── TEST SUITE: IMPORT QUARANTINE ──────────────────────────────────────

describe("internal-computation-service: Import quarantine", () => {
  it("service file contains no forbidden imports", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const servicePath = path.resolve(
      __dirname,
      "../../src/lib/cpc/internal-computation-service.ts"
    );
    const content = fs.readFileSync(servicePath, "utf-8");

    const forbiddenPatterns = [
      'from "../../routes',
      'from "*/routes',
      'from "*/api',
      "prisma",
      "Prisma",
      "import { db }",
      'from "*prisma',
      "auditService",
      "createAuditEvent",
      "persistenceService",
      "dashboard",
      "pdf",
      "report",
      "NextResponse",
      "legacy",
      "IncomeStability",
    ];

    for (const pattern of forbiddenPatterns) {
      expect(content).not.toContain(pattern);
    }
  });
});
