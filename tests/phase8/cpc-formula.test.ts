import { describe, it, expect } from "vitest";
import {
  clampNormalized,
  clampCPI,
  normalizeConstraintCount,
  normalizeScenarioAmplification,
  computeCPI,
  classifyCPC,
  computeCPCFromInputs,
  type CPCInput,
  type CPCNormalizedInputs,
} from "../../src/lib/cpc/formula";

describe("CPC Formula Module - Normalization Tests", () => {
  describe("normalizeConstraintCount()", () => {
    it("maps 1 constraint to 0.00", () => {
      expect(normalizeConstraintCount(1)).toBe(0);
    });

    it("maps 2 constraints to 0.25", () => {
      expect(normalizeConstraintCount(2)).toBe(0.25);
    });

    it("maps 3 constraints to 0.50", () => {
      expect(normalizeConstraintCount(3)).toBe(0.5);
    });

    it("maps 4 constraints to 0.75", () => {
      expect(normalizeConstraintCount(4)).toBe(0.75);
    });

    it("maps 5 constraints to 1.00", () => {
      expect(normalizeConstraintCount(5)).toBe(1);
    });
  });

  describe("normalizeScenarioAmplification()", () => {
    it("maps 0.3 to 0.00", () => {
      expect(normalizeScenarioAmplification(0.3)).toBe(0);
    });

    it("maps 0.9 to 0.50", () => {
      const result = normalizeScenarioAmplification(0.9);
      expect(result).toBeCloseTo(0.5, 5);
    });

    it("maps 1.5 to 1.00", () => {
      expect(normalizeScenarioAmplification(1.5)).toBe(1);
    });
  });

  describe("clampNormalized()", () => {
    it("clamps -1 to 0", () => {
      expect(clampNormalized(-1)).toBe(0);
    });

    it("passes through 0.5", () => {
      expect(clampNormalized(0.5)).toBe(0.5);
    });

    it("clamps 2 to 1", () => {
      expect(clampNormalized(2)).toBe(1);
    });

    it("passes through boundary 0", () => {
      expect(clampNormalized(0)).toBe(0);
    });

    it("passes through boundary 1", () => {
      expect(clampNormalized(1)).toBe(1);
    });
  });

  describe("clampCPI()", () => {
    it("clamps -10 to 0", () => {
      expect(clampCPI(-10)).toBe(0);
    });

    it("passes through 50", () => {
      expect(clampCPI(50)).toBe(50);
    });

    it("clamps 110 to 100", () => {
      expect(clampCPI(110)).toBe(100);
    });

    it("passes through boundary 0", () => {
      expect(clampCPI(0)).toBe(0);
    });

    it("passes through boundary 100", () => {
      expect(clampCPI(100)).toBe(100);
    });
  });
});

describe("CPC Formula Module - CPI Formula Tests", () => {
  it("computes CPI from normalized inputs (all 0.5)", () => {
    const normalized: CPCNormalizedInputs = {
      fragility_norm: 0.5,
      constraints_norm: 0.5,
      concentration_norm: 0.5,
      amplification_norm: 0.5,
    };
    const result = computeCPI(normalized);
    expect(result).toBe(50);
  });

  it("computes CPI from normalized inputs (mixed values)", () => {
    // fragility=0.5, constraint_count=3 (norm=0.5), concentration=0.5, amplification=0.9 (norm=0.5)
    const normalized: CPCNormalizedInputs = {
      fragility_norm: 0.5,
      constraints_norm: 0.5,
      concentration_norm: 0.5,
      amplification_norm: 0.5,
    };
    const result = computeCPI(normalized);
    expect(result).toBe(50);
  });

  it("computes CPI 0 when all inputs are 0", () => {
    const normalized: CPCNormalizedInputs = {
      fragility_norm: 0,
      constraints_norm: 0,
      concentration_norm: 0,
      amplification_norm: 0,
    };
    const result = computeCPI(normalized);
    expect(result).toBe(0);
  });

  it("computes CPI 100 when all inputs are 1", () => {
    const normalized: CPCNormalizedInputs = {
      fragility_norm: 1,
      constraints_norm: 1,
      concentration_norm: 1,
      amplification_norm: 1,
    };
    const result = computeCPI(normalized);
    expect(result).toBe(100);
  });

  it("formula weights all dimensions equally (25% each)", () => {
    // Only fragility = 1, others = 0 should give 25
    const normalized1: CPCNormalizedInputs = {
      fragility_norm: 1,
      constraints_norm: 0,
      concentration_norm: 0,
      amplification_norm: 0,
    };
    expect(computeCPI(normalized1)).toBe(25);

    // Only constraints = 1, others = 0 should give 25
    const normalized2: CPCNormalizedInputs = {
      fragility_norm: 0,
      constraints_norm: 1,
      concentration_norm: 0,
      amplification_norm: 0,
    };
    expect(computeCPI(normalized2)).toBe(25);

    // Only concentration = 1, others = 0 should give 25
    const normalized3: CPCNormalizedInputs = {
      fragility_norm: 0,
      constraints_norm: 0,
      concentration_norm: 1,
      amplification_norm: 0,
    };
    expect(computeCPI(normalized3)).toBe(25);

    // Only amplification = 1, others = 0 should give 25
    const normalized4: CPCNormalizedInputs = {
      fragility_norm: 0,
      constraints_norm: 0,
      concentration_norm: 0,
      amplification_norm: 1,
    };
    expect(computeCPI(normalized4)).toBe(25);
  });
});

describe("CPC Formula Module - Classification Tests", () => {
  it("classifies CPI 0 as CPL", () => {
    expect(classifyCPC(0)).toBe("CPL");
  });

  it("classifies CPI 19.99 as CPL", () => {
    expect(classifyCPC(19.99)).toBe("CPL");
  });

  it("classifies CPI 20 as CPM (boundary rule)", () => {
    expect(classifyCPC(20)).toBe("CPM");
  });

  it("classifies CPI 30 as CPM", () => {
    expect(classifyCPC(30)).toBe("CPM");
  });

  it("classifies CPI 39.99 as CPM", () => {
    expect(classifyCPC(39.99)).toBe("CPM");
  });

  it("classifies CPI 40 as CPE (boundary rule)", () => {
    expect(classifyCPC(40)).toBe("CPE");
  });

  it("classifies CPI 50 as CPE", () => {
    expect(classifyCPC(50)).toBe("CPE");
  });

  it("classifies CPI 59.99 as CPE", () => {
    expect(classifyCPC(59.99)).toBe("CPE");
  });

  it("classifies CPI 60 as CPH (boundary rule)", () => {
    expect(classifyCPC(60)).toBe("CPH");
  });

  it("classifies CPI 70 as CPH", () => {
    expect(classifyCPC(70)).toBe("CPH");
  });

  it("classifies CPI 79.99 as CPH", () => {
    expect(classifyCPC(79.99)).toBe("CPH");
  });

  it("classifies CPI 80 as CPC (boundary rule)", () => {
    expect(classifyCPC(80)).toBe("CPC");
  });

  it("classifies CPI 90 as CPC", () => {
    expect(classifyCPC(90)).toBe("CPC");
  });

  it("classifies CPI 100 as CPC", () => {
    expect(classifyCPC(100)).toBe("CPC");
  });
});

describe("CPC Formula Module - End-to-End Tests by Class", () => {
  it("computes CPL classification (low pressure)", () => {
    const input: CPCInput = {
      fragility_score: 0.05,
      constraint_count: 1,
      concentration_factor: 0.05,
      scenario_amplification: 0.3,
    };
    const result = computeCPCFromInputs(input);
    expect(result.classification).toBe("CPL");
    expect(result.cpi_internal).toBeLessThan(20);
  });

  it("computes CPM classification (moderate pressure)", () => {
    const input: CPCInput = {
      fragility_score: 0.25,
      constraint_count: 2,
      concentration_factor: 0.25,
      scenario_amplification: 0.6,
    };
    const result = computeCPCFromInputs(input);
    expect(result.classification).toBe("CPM");
    expect(result.cpi_internal).toBeGreaterThanOrEqual(20);
    expect(result.cpi_internal).toBeLessThan(40);
  });

  it("computes CPE classification (elevated pressure)", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const result = computeCPCFromInputs(input);
    expect(result.classification).toBe("CPE");
    expect(result.cpi_internal).toBeGreaterThanOrEqual(40);
    expect(result.cpi_internal).toBeLessThan(60);
  });

  it("computes CPH classification (high pressure)", () => {
    const input: CPCInput = {
      fragility_score: 0.7,
      constraint_count: 4,
      concentration_factor: 0.7,
      scenario_amplification: 1.14,
    };
    const result = computeCPCFromInputs(input);
    expect(result.classification).toBe("CPH");
    expect(result.cpi_internal).toBeGreaterThanOrEqual(60);
    expect(result.cpi_internal).toBeLessThan(80);
  });

  it("computes CPC classification (critical pressure)", () => {
    const input: CPCInput = {
      fragility_score: 0.9,
      constraint_count: 5,
      concentration_factor: 0.9,
      scenario_amplification: 1.38,
    };
    const result = computeCPCFromInputs(input);
    expect(result.classification).toBe("CPC");
    expect(result.cpi_internal).toBeGreaterThanOrEqual(80);
  });

  it("returns normalized inputs in result", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const result = computeCPCFromInputs(input);
    expect(result.normalized_inputs.fragility_norm).toBe(0.5);
    expect(result.normalized_inputs.constraints_norm).toBeCloseTo(0.5, 5);
    expect(result.normalized_inputs.concentration_norm).toBe(0.5);
    expect(result.normalized_inputs.amplification_norm).toBeCloseTo(0.5, 5);
  });

  it("captures threshold trace in result", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const result = computeCPCFromInputs(input);
    expect(result.threshold_trace.cpi_final).toBe(50);
    expect(result.threshold_trace.threshold_applied).toBe(40);
    expect(result.threshold_trace.rule_matched).toBe("CPI >= 40");
  });

  it("returns correct model and threshold versions", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const result = computeCPCFromInputs(input);
    expect(result.model_version).toBe("cpc_v1_baseline");
    expect(result.threshold_version).toBe("cpc_thresholds_v1");
  });
});

describe("CPC Formula Module - Determinism Test", () => {
  it("produces identical results for identical inputs", () => {
    const input: CPCInput = {
      fragility_score: 0.73,
      constraint_count: 3,
      concentration_factor: 0.62,
      scenario_amplification: 1.05,
    };

    const result1 = computeCPCFromInputs(input);
    const result2 = computeCPCFromInputs(input);
    const result3 = computeCPCFromInputs(input);

    expect(result1.classification).toBe(result2.classification);
    expect(result1.classification).toBe(result3.classification);
    expect(result1.cpi_internal).toBe(result2.cpi_internal);
    expect(result1.cpi_internal).toBe(result3.cpi_internal);
    expect(JSON.stringify(result1.normalized_inputs)).toBe(
      JSON.stringify(result2.normalized_inputs)
    );
    expect(JSON.stringify(result1.normalized_inputs)).toBe(
      JSON.stringify(result3.normalized_inputs)
    );
  });
});

describe("CPC Formula Module - Legacy Quarantine Test", () => {
  it("formula module does not reference legacy fields", async () => {
    // Read the formula file and verify it contains no references to legacy fields
    const fs = await import("fs");
    const path = await import("path");
    const formulaPath = path.resolve(
      __dirname,
      "../../src/lib/cpc/formula.ts"
    );
    const content = fs.readFileSync(formulaPath, "utf-8");

    const forbiddenStrings = [
      "final_score",
      "stability_band",
      "Income Stability",
      "Stability Level",
      "AssessmentRecord",
      "_v2",
    ];

    for (const forbidden of forbiddenStrings) {
      expect(content).not.toContain(forbidden);
    }
  });
});
