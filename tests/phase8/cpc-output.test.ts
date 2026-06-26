import { describe, it, expect } from "vitest";
import {
  getLabelForClass,
  getMeasurementString,
  getInterpretationForClass,
  getPrimaryDrivers,
  getImplicationsForClass,
  generateCommitmentPressureOutput,
  type CommitmentPressureOutput,
} from "../../src/lib/cpc/output";
import {
  computeCPCFromInputs,
  type CPCInput,
  type CPCResult,
} from "../../src/lib/cpc/formula";

function createCPCResultFixture(input: CPCInput): CPCResult {
  return computeCPCFromInputs(input);
}

describe("CPC Output Module - Label Mapping Tests", () => {
  it("getLabelForClass CPL returns 'Low Pressure'", () => {
    expect(getLabelForClass("CPL")).toBe("Low Pressure");
  });

  it("getLabelForClass CPM returns 'Moderate Pressure'", () => {
    expect(getLabelForClass("CPM")).toBe("Moderate Pressure");
  });

  it("getLabelForClass CPE returns 'Elevated Pressure'", () => {
    expect(getLabelForClass("CPE")).toBe("Elevated Pressure");
  });

  it("getLabelForClass CPH returns 'High Pressure'", () => {
    expect(getLabelForClass("CPH")).toBe("High Pressure");
  });

  it("getLabelForClass CPC returns 'Critical Pressure'", () => {
    expect(getLabelForClass("CPC")).toBe("Critical Pressure");
  });
});

describe("CPC Output Module - Measurement String Tests", () => {
  it("getMeasurementString CPL produces correct format", () => {
    const result = getMeasurementString("CPL", "Low Pressure");
    expect(result).toBe("Commitment Pressure Classification: Low Pressure (CPL)");
  });

  it("getMeasurementString CPM produces correct format", () => {
    const result = getMeasurementString("CPM", "Moderate Pressure");
    expect(result).toBe("Commitment Pressure Classification: Moderate Pressure (CPM)");
  });

  it("getMeasurementString CPE produces correct format", () => {
    const result = getMeasurementString("CPE", "Elevated Pressure");
    expect(result).toBe("Commitment Pressure Classification: Elevated Pressure (CPE)");
  });

  it("getMeasurementString CPH produces correct format", () => {
    const result = getMeasurementString("CPH", "High Pressure");
    expect(result).toBe("Commitment Pressure Classification: High Pressure (CPH)");
  });

  it("getMeasurementString CPC produces correct format", () => {
    const result = getMeasurementString("CPC", "Critical Pressure");
    expect(result).toBe("Commitment Pressure Classification: Critical Pressure (CPC)");
  });

  it("measurement string does not contain CPI", () => {
    const result = getMeasurementString("CPE", "Elevated Pressure");
    expect(result).not.toContain("CPI");
    expect(result).not.toMatch(/\d+-100/);
  });
});

describe("CPC Output Module - Interpretation Tests", () => {
  it("getInterpretationForClass CPL returns locked sentence", () => {
    const result = getInterpretationForClass("CPL");
    expect(result).toBe(
      "The classification reflects low reliance on the support structure sustaining the commitment."
    );
  });

  it("getInterpretationForClass CPM returns locked sentence", () => {
    const result = getInterpretationForClass("CPM");
    expect(result).toBe(
      "The classification reflects moderate reliance on the support structure sustaining the commitment."
    );
  });

  it("getInterpretationForClass CPE returns locked sentence", () => {
    const result = getInterpretationForClass("CPE");
    expect(result).toBe(
      "The classification reflects elevated reliance on the support structure sustaining the commitment."
    );
  });

  it("getInterpretationForClass CPH returns locked sentence", () => {
    const result = getInterpretationForClass("CPH");
    expect(result).toBe(
      "The classification reflects high reliance on the support structure sustaining the commitment."
    );
  });

  it("getInterpretationForClass CPC returns locked sentence", () => {
    const result = getInterpretationForClass("CPC");
    expect(result).toBe(
      "The classification reflects critical reliance on the support structure sustaining the commitment."
    );
  });

  it("interpretation does not contain prohibited terms", () => {
    const interpretations = ["CPL", "CPM", "CPE", "CPH", "CPC"] as const;
    const prohibited = [
      "CPI",
      "must",
      "should",
      "stable",
      "stability",
      "sustainable",
      "sustainability",
    ];
    for (const classification of interpretations) {
      const result = getInterpretationForClass(classification);
      for (const term of prohibited) {
        expect(result).not.toContain(term);
      }
    }
  });
});

describe("CPC Output Module - Primary Driver Tests", () => {
  it("getPrimaryDrivers returns at least 2 drivers", () => {
    const normalized = {
      fragility_norm: 0.3,
      constraints_norm: 0.2,
      concentration_norm: 0.1,
      amplification_norm: 0.05,
    };
    const result = getPrimaryDrivers(normalized);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it("getPrimaryDrivers returns no more than 3 drivers", () => {
    const normalized = {
      fragility_norm: 0.9,
      constraints_norm: 0.8,
      concentration_norm: 0.7,
      amplification_norm: 0.6,
    };
    const result = getPrimaryDrivers(normalized);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("getPrimaryDrivers selects highest normalized dimensions first", () => {
    const normalized = {
      fragility_norm: 0.1,
      constraints_norm: 0.9,
      concentration_norm: 0.2,
      amplification_norm: 0.3,
    };
    const result = getPrimaryDrivers(normalized);
    expect(result[0]).toContain("constraint");
  });

  it("getPrimaryDrivers uses deterministic tie-break (fragility > constraints)", () => {
    const normalized = {
      fragility_norm: 0.5,
      constraints_norm: 0.5,
      concentration_norm: 0.2,
      amplification_norm: 0.1,
    };
    const result = getPrimaryDrivers(normalized);
    expect(result[0]).toContain("fragility");
    expect(result[1]).toContain("constraint");
  });

  it("getPrimaryDrivers uses approved level labels", () => {
    const normalized = {
      fragility_norm: 0.9,
      constraints_norm: 0.7,
      concentration_norm: 0.5,
      amplification_norm: 0.3,
    };
    const result = getPrimaryDrivers(normalized);
    const approvedLabels = ["Lower", "Moderate", "Elevated", "High", "Highest"];
    for (const driver of result) {
      const hasApprovedLabel = approvedLabels.some((label) =>
        driver.startsWith(label)
      );
      expect(hasApprovedLabel).toBe(true);
    }
  });

  it("getPrimaryDrivers does not use 'Critical' in driver labels", () => {
    const normalized = {
      fragility_norm: 0.95,
      constraints_norm: 0.9,
      concentration_norm: 0.85,
      amplification_norm: 0.8,
    };
    const result = getPrimaryDrivers(normalized);
    for (const driver of result) {
      expect(driver).not.toContain("Critical");
    }
  });

  it("getPrimaryDrivers returns dimension-specific contribution labels", () => {
    const normalized = {
      fragility_norm: 0.8,
      constraints_norm: 0.6,
      concentration_norm: 0.3,
      amplification_norm: 0.1,
    };
    const result = getPrimaryDrivers(normalized);
    expect(result.some((d) => d.includes("fragility"))).toBe(true);
    expect(result.some((d) => d.includes("constraint"))).toBe(true);
  });
});

describe("CPC Output Module - Implications Tests", () => {
  it("getImplicationsForClass CPL returns neutral structural language", () => {
    const result = getImplicationsForClass("CPL");
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((i) => i.includes("dependent"))).toBe(true);
    expect(result.some((i) => i.includes("condition"))).toBe(true);
  });

  it("getImplicationsForClass CPM returns neutral structural language", () => {
    const result = getImplicationsForClass("CPM");
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((i) => i.includes("depends on"))).toBe(true);
  });

  it("getImplicationsForClass CPE returns neutral structural language", () => {
    const result = getImplicationsForClass("CPE");
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((i) => i.includes("exposure"))).toBe(true);
  });

  it("getImplicationsForClass CPH returns neutral structural language", () => {
    const result = getImplicationsForClass("CPH");
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((i) => i.includes("absorption capacity"))).toBe(true);
  });

  it("getImplicationsForClass CPC returns neutral structural language", () => {
    const result = getImplicationsForClass("CPC");
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((i) => i.includes("dependent"))).toBe(true);
  });

  it("implications do not contain advisory language", () => {
    const implications = ["CPL", "CPM", "CPE", "CPH", "CPC"] as const;
    const advisoryTerms = ["should", "must", "recommend", "action plan"];
    for (const classification of implications) {
      const result = getImplicationsForClass(classification);
      for (const item of result) {
        for (const term of advisoryTerms) {
          expect(item).not.toContain(term);
        }
      }
    }
  });

  it("implications do not contain fear language", () => {
    const implications = ["CPL", "CPM", "CPE", "CPH", "CPC"] as const;
    const fearTerms = ["risky", "unsafe", "concerning", "severe"];
    for (const classification of implications) {
      const result = getImplicationsForClass(classification);
      for (const item of result) {
        for (const term of fearTerms) {
          expect(item).not.toContain(term);
        }
      }
    }
  });

  it("implications do not contain stability language", () => {
    const implications = ["CPL", "CPM", "CPE", "CPH", "CPC"] as const;
    const stabilityTerms = ["stable", "stability", "sustainable", "sustainability"];
    for (const classification of implications) {
      const result = getImplicationsForClass(classification);
      for (const item of result) {
        for (const term of stabilityTerms) {
          expect(item).not.toContain(term);
        }
      }
    }
  });
});

describe("CPC Output Module - Full Output Generation Tests", () => {
  it("generateCommitmentPressureOutput CPL produces complete output", () => {
    const input: CPCInput = {
      fragility_score: 0.05,
      constraint_count: 1,
      concentration_factor: 0.05,
      scenario_amplification: 0.3,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output.classification).toBe("CPL");
    expect(output.label).toBe("Low Pressure");
    expect(output.measurement).toContain("Commitment Pressure Classification");
    expect(output.interpretation).toBeDefined();
    expect(output.primary_drivers.length).toBeGreaterThanOrEqual(2);
    expect(output.implications.length).toBeGreaterThanOrEqual(2);
  });

  it("generateCommitmentPressureOutput CPE produces complete output", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output.classification).toBe("CPE");
    expect(output.label).toBe("Elevated Pressure");
    expect(output.measurement).toContain("Commitment Pressure Classification");
    expect(output.interpretation).toBeDefined();
    expect(output.primary_drivers.length).toBeGreaterThanOrEqual(2);
    expect(output.implications.length).toBeGreaterThanOrEqual(2);
  });

  it("generateCommitmentPressureOutput CPC produces complete output", () => {
    const input: CPCInput = {
      fragility_score: 0.9,
      constraint_count: 5,
      concentration_factor: 0.9,
      scenario_amplification: 1.38,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output.classification).toBe("CPC");
    expect(output.label).toBe("Critical Pressure");
    expect(output.measurement).toContain("Commitment Pressure Classification");
    expect(output.interpretation).toBeDefined();
    expect(output.primary_drivers.length).toBeGreaterThanOrEqual(2);
    expect(output.implications.length).toBeGreaterThanOrEqual(2);
  });
});

describe("CPC Output Module - CPI Exposure Tests", () => {
  it("CPI does not appear in measurement field", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output.measurement).not.toContain("CPI");
    expect(output.measurement).not.toMatch(/\d+-100/);
  });

  it("CPI does not appear in interpretation field", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output.interpretation).not.toContain("CPI");
  });

  it("CPI does not appear in primary_drivers array", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    for (const driver of output.primary_drivers) {
      expect(driver).not.toContain("CPI");
    }
  });

  it("CPI does not appear in implications array", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    for (const implication of output.implications) {
      expect(implication).not.toContain("CPI");
    }
  });

  it("CPI appears only in _internal.cpi_internal", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output._internal.cpi_internal).toBeDefined();
    expect(typeof output._internal.cpi_internal).toBe("number");
    expect(output._internal.cpi_internal).toBeGreaterThanOrEqual(0);
    expect(output._internal.cpi_internal).toBeLessThanOrEqual(100);
  });
});

describe("CPC Output Module - Prohibited Terminology Tests", () => {
  it("public fields do not contain any prohibited terminology", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    const publicOutput = {
      classification: output.classification,
      label: output.label,
      measurement: output.measurement,
      interpretation: output.interpretation,
      primary_drivers: output.primary_drivers,
      implications: output.implications,
      model_version: output.model_version,
      threshold_version: output.threshold_version,
    };

    const publicText = JSON.stringify(publicOutput).toLowerCase();

    const prohibitedTerms = [
      "cpi",
      "final_score",
      "stability_band",
      "income stability",
      "stability level",
      "assessmentrecord",
      "_v2",
      "stable",
      "sustainability",
      "must ",
      "should ",
      "recommend",
      "action plan",
      "financial advice",
      "safe ",
      "unsafe",
      "risky",
      "concerning",
      "severe",
      "good ",
      "bad ",
      "strong ",
      "weak ",
    ];

    for (const term of prohibitedTerms) {
      expect(publicText).not.toContain(term);
    }
  });
});

describe("CPC Output Module - Internal Data Integrity Tests", () => {
  it("_internal.cpi_internal matches input cpi", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output._internal.cpi_internal).toBe(cpcResult.cpi_internal);
  });

  it("_internal.normalized_inputs matches input normalized_inputs", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(JSON.stringify(output._internal.normalized_inputs)).toBe(
      JSON.stringify(cpcResult.normalized_inputs)
    );
  });

  it("_internal.threshold_trace matches input threshold_trace", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(JSON.stringify(output._internal.threshold_trace)).toBe(
      JSON.stringify(cpcResult.threshold_trace)
    );
  });

  it("model_version equals cpc_v1_baseline", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output.model_version).toBe("cpc_v1_baseline");
  });

  it("threshold_version equals cpc_thresholds_v1", () => {
    const input: CPCInput = {
      fragility_score: 0.5,
      constraint_count: 3,
      concentration_factor: 0.5,
      scenario_amplification: 0.9,
    };
    const cpcResult = createCPCResultFixture(input);
    const output = generateCommitmentPressureOutput(cpcResult);

    expect(output.threshold_version).toBe("cpc_thresholds_v1");
  });
});

describe("CPC Output Module - Determinism Test", () => {
  it("generateCommitmentPressureOutput produces identical outputs for identical inputs", () => {
    const input: CPCInput = {
      fragility_score: 0.73,
      constraint_count: 3,
      concentration_factor: 0.62,
      scenario_amplification: 1.05,
    };
    const cpcResult = createCPCResultFixture(input);

    const output1 = generateCommitmentPressureOutput(cpcResult);
    const output2 = generateCommitmentPressureOutput(cpcResult);
    const output3 = generateCommitmentPressureOutput(cpcResult);

    expect(JSON.stringify(output1)).toBe(JSON.stringify(output2));
    expect(JSON.stringify(output2)).toBe(JSON.stringify(output3));

    expect(output1.classification).toBe(output2.classification);
    expect(output1.classification).toBe(output3.classification);
    expect(output1.measurement).toBe(output2.measurement);
    expect(output1.measurement).toBe(output3.measurement);
  });
});

describe("CPC Output Module - Integration Quarantine Test", () => {
  it("test file imports only from output and formula modules", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const testPath = path.resolve(__dirname, "cpc-output.test.ts");
    const content = fs.readFileSync(testPath, "utf-8");

    const forbiddenImports = [
      "from \"../../src/lib/engine/v2",
      "from \"../../src/lib/types",
      "from \"../../src/app/api",
      "from \"../../src/components",
      "from \"../../src/lib/pdf",
      "from \"../../src/lib/prisma",
      "from \"../../src/lib/phase6",
    ];

    for (const forbidden of forbiddenImports) {
      expect(content).not.toContain(forbidden);
    }

    expect(content).toContain('from "../../src/lib/cpc/output"');
    expect(content).toContain('from "../../src/lib/cpc/formula"');
  });
});
