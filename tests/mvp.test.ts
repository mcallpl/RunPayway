import { describe, it, expect } from "vitest";
import { validatePayload, validateEvaluationRequest } from "../packages/ingestion/schemas";
import { Executor } from "../packages/rp-dsl/executor";
import { compilePolicy } from "../packages/rp-dsl/compiler";
import { MORTGAGE_MIXED_INCOME_POLICY_V1 } from "../packages/rp-dsl/seed-policy";
import { classifyScore } from "../packages/rp-dsl/executor";
import { computeAuditHashes, hashPayload, hashPolicy, hashResult } from "../packages/audit/hash";
import { operatorRegistry } from "../packages/rp-dsl/operators";
import { reasonCodeRegistry, validateReasonCode } from "../packages/reason-codes/registry";
import { StructuredFinancialPayload, IncomeSourceType, IncomeFrequency, DecisionContextType, ProductType, VolatilityBand, ObligationType, FrequencyType } from "../packages/domain/types";

// ============================================================================
// REQUIREMENT: REQ-006 - Strict Input Validation
// ============================================================================

describe("REQ-006: Strict Input Validation (Zod)", () => {
  it("should accept valid payload", () => {
    const payload: StructuredFinancialPayload = {
      subject_id: "subj_001",
      cohort_key: "mortgage_software_sales_mixed_income",
      decision_context: {
        type: DecisionContextType.LENDING,
        product: ProductType.HOME_PURCHASE,
        commitment_amount_cents: 30000000,
      },
      income_structure: {
        income_sources: [
          {
            source_id: "salary_1",
            type: IncomeSourceType.SALARY,
            amount_cents: 500000,
            frequency: IncomeFrequency.MONTHLY,
          },
          {
            source_id: "commission_1",
            type: IncomeSourceType.COMMISSION,
            amount_cents: 250000,
            frequency: IncomeFrequency.MONTHLY,
            concentration_percent: 33.33,
            volatility_band: VolatilityBand.MODERATE,
          },
        ],
      },
      obligations: {
        recurring_obligations: [
          {
            obligation_id: "housing_1",
            type: ObligationType.HOUSING,
            amount_cents: 200000,
            frequency: FrequencyType.MONTHLY,
          },
        ],
      },
    };

    const result = validatePayload(payload);
    expect(result.success).toBe(true);
  });

  it("should reject invalid payload (missing required field)", () => {
    const invalidPayload: any = {
      subject_id: "subj_001",
      // missing cohort_key
      decision_context: { type: "LENDING", product: "HOME_PURCHASE" },
      income_structure: { income_sources: [] },
    };

    const result = validatePayload(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("should reject invalid payload (wrong enum value)", () => {
    const invalidPayload: any = {
      subject_id: "subj_001",
      cohort_key: "mortgage",
      decision_context: { type: "INVALID_TYPE", product: "HOME_PURCHASE" },
      income_structure: { income_sources: [] },
    };

    const result = validatePayload(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("should reject empty income sources", () => {
    const invalidPayload: any = {
      subject_id: "subj_001",
      cohort_key: "mortgage",
      decision_context: { type: "LENDING", product: "HOME_PURCHASE" },
      income_structure: { income_sources: [] }, // Empty array not allowed
    };

    const result = validatePayload(invalidPayload);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// REQUIREMENT: REQ-001 - Commission Concentration Threshold
// ============================================================================

describe("REQ-001: Commission Concentration Threshold", () => {
  it("should trigger violation when commission >= 35%", () => {
    const policy = MORTGAGE_MIXED_INCOME_POLICY_V1;
    const compiler = compilePolicy(JSON.stringify(policy));
    expect(compiler.valid).toBe(true);

    const payload: StructuredFinancialPayload = {
      subject_id: "subj_001",
      cohort_key: "mortgage_software_sales_mixed_income",
      decision_context: {
        type: DecisionContextType.LENDING,
        product: ProductType.HOME_PURCHASE,
      },
      income_structure: {
        income_sources: [
          {
            source_id: "salary",
            type: IncomeSourceType.SALARY,
            amount_cents: 650000,
            frequency: IncomeFrequency.MONTHLY,
          },
          {
            source_id: "commission",
            type: IncomeSourceType.COMMISSION,
            amount_cents: 350000,
            frequency: IncomeFrequency.MONTHLY,
            concentration_percent: 35,
          },
        ],
      },
    };

    const rule = policy.rules[0]; // Commission concentration rule
    const executor = new Executor({ payload, variables: {} });
    const result = executor.execute(rule.condition);
    expect(result.value).toBe(true);
  });

  it("should NOT trigger violation when commission < 35%", () => {
    const policy = MORTGAGE_MIXED_INCOME_POLICY_V1;
    const payload: StructuredFinancialPayload = {
      subject_id: "subj_001",
      cohort_key: "mortgage_software_sales_mixed_income",
      decision_context: {
        type: DecisionContextType.LENDING,
        product: ProductType.HOME_PURCHASE,
      },
      income_structure: {
        income_sources: [
          {
            source_id: "salary",
            type: IncomeSourceType.SALARY,
            amount_cents: 700000,
            frequency: IncomeFrequency.MONTHLY,
          },
          {
            source_id: "commission",
            type: IncomeSourceType.COMMISSION,
            amount_cents: 300000,
            frequency: IncomeFrequency.MONTHLY,
            concentration_percent: 30,
          },
        ],
      },
    };

    const rule = policy.rules[0];
    const executor = new Executor({ payload, variables: {} });
    const result = executor.execute(rule.condition);
    expect(result.value).toBe(false);
  });

  it("should trigger at boundary 35.00%", () => {
    const policy = MORTGAGE_MIXED_INCOME_POLICY_V1;
    const payload: StructuredFinancialPayload = {
      subject_id: "subj_001",
      cohort_key: "mortgage_software_sales_mixed_income",
      decision_context: {
        type: DecisionContextType.LENDING,
        product: ProductType.HOME_PURCHASE,
      },
      income_structure: {
        income_sources: [
          {
            source_id: "salary",
            type: IncomeSourceType.SALARY,
            amount_cents: 650000,
            frequency: IncomeFrequency.MONTHLY,
          },
          {
            source_id: "commission",
            type: IncomeSourceType.COMMISSION,
            amount_cents: 350000,
            frequency: IncomeFrequency.MONTHLY,
            concentration_percent: 35.0,
          },
        ],
      },
    };

    const rule = policy.rules[0];
    const executor = new Executor({ payload, variables: {} });
    const result = executor.execute(rule.condition);
    expect(result.value).toBe(true);
  });
});

// ============================================================================
// REQUIREMENT: REQ-007 - AST Execution Operators
// ============================================================================

describe("REQ-007: AST-Based Operators", () => {
  it("should execute GT operator", () => {
    const result = operatorRegistry.GT([42, 40]);
    expect(result).toBe(true);

    const result2 = operatorRegistry.GT([40, 40]);
    expect(result2).toBe(false);
  });

  it("should execute GTE operator", () => {
    const result = operatorRegistry.GTE([40, 40]);
    expect(result).toBe(true);

    const result2 = operatorRegistry.GTE([39, 40]);
    expect(result2).toBe(false);
  });

  it("should execute AND operator", () => {
    const result = operatorRegistry.AND([true, true, true]);
    expect(result).toBe(true);

    const result2 = operatorRegistry.AND([true, false, true]);
    expect(result2).toBe(false);
  });

  it("should execute OR operator", () => {
    const result = operatorRegistry.OR([false, false, true]);
    expect(result).toBe(true);

    const result2 = operatorRegistry.OR([false, false, false]);
    expect(result2).toBe(false);
  });

  it("should execute NOT operator", () => {
    const result = operatorRegistry.NOT([true]);
    expect(result).toBe(false);

    const result2 = operatorRegistry.NOT([false]);
    expect(result2).toBe(true);
  });

  it("should execute IN operator", () => {
    const result = operatorRegistry.IN(["ELEVATED", "ELEVATED", "HIGH"]);
    expect(result).toBe(true);

    const result2 = operatorRegistry.IN(["LOW", "ELEVATED", "HIGH"]);
    expect(result2).toBe(false);
  });

  it("should execute SUM operator", () => {
    const result = operatorRegistry.SUM([[10, 20, 30]]);
    expect(result).toBe(60);
  });

  it("should execute COUNT operator", () => {
    const result = operatorRegistry.COUNT([[1, 2, 3, 4, 5]]);
    expect(result).toBe(5);
  });

  it("should execute RATIO operator", () => {
    const result = operatorRegistry.RATIO([100, 200]);
    expect(result).toBe(0.5);
  });
});

// ============================================================================
// REQUIREMENT: REQ-008 - Policy Compilation
// ============================================================================

describe("REQ-008: Policy Safety Compiler", () => {
  it("should compile valid policy", () => {
    const policy = MORTGAGE_MIXED_INCOME_POLICY_V1;
    const result = compilePolicy(JSON.stringify(policy));

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("should reject policy with missing reason code", () => {
    const badPolicy: any = {
      policy_id: "test",
      policy_version: "1.0.0",
      cohort_key: "test",
      rules: [
        {
          rule_id: "test_rule",
          reason_code: "RP-INVALID-999",
          violation_contribution: 10,
          condition: {
            type: "terminal",
            kind: "literal",
            value: true,
          },
        },
      ],
    };

    const result = compilePolicy(JSON.stringify(badPolicy));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("reason code"))).toBe(true);
  });

  it("should reject policy with excessive depth", () => {
    // Build deeply nested policy (depth > 16)
    let deepNode: any = { type: "terminal", kind: "literal", value: true };
    for (let i = 0; i < 20; i++) {
      deepNode = {
        type: "binary",
        operator: "AND",
        left: deepNode,
        right: { type: "terminal", kind: "literal", value: true },
      };
    }

    const badPolicy: any = {
      policy_id: "test",
      policy_version: "1.0.0",
      cohort_key: "test",
      rules: [
        {
          rule_id: "deep_rule",
          reason_code: "RP-INC-001",
          violation_contribution: 10,
          condition: deepNode,
        },
      ],
    };

    const result = compilePolicy(JSON.stringify(badPolicy));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("depth"))).toBe(true);
  });
});

// ============================================================================
// REQUIREMENT: REQ-009 - Reason Code Governance
// ============================================================================

describe("REQ-009: Reason Code Governance", () => {
  it("should have RP-INC-001 defined", () => {
    const code = reasonCodeRegistry["RP-INC-001"];
    expect(code).toBeDefined();
    expect(code.code).toBe("RP-INC-001");
    expect(code.severity).toBe("ELEVATED");
  });

  it("should have RP-INC-002 defined", () => {
    const code = reasonCodeRegistry["RP-INC-002"];
    expect(code).toBeDefined();
    expect(code.code).toBe("RP-INC-002");
  });

  it("should have RP-OBL-001 defined", () => {
    const code = reasonCodeRegistry["RP-OBL-001"];
    expect(code).toBeDefined();
    expect(code.code).toBe("RP-OBL-001");
  });

  it("should validate only known codes", () => {
    expect(validateReasonCode("RP-INC-001")).toBe(true);
    expect(validateReasonCode("RP-INVALID-999")).toBe(false);
  });
});

// ============================================================================
// REQUIREMENT: REQ-010 - Classification
// ============================================================================

describe("REQ-010: Deterministic Classification", () => {
  it("should classify 0-19 as PASS", () => {
    const ranges = MORTGAGE_MIXED_INCOME_POLICY_V1.classification_rules.ranges;
    expect(classifyScore(0, ranges)).toBe("PASS");
    expect(classifyScore(10, ranges)).toBe("PASS");
    expect(classifyScore(19, ranges)).toBe("PASS");
  });

  it("should classify 20-49 as REVIEW", () => {
    const ranges = MORTGAGE_MIXED_INCOME_POLICY_V1.classification_rules.ranges;
    expect(classifyScore(20, ranges)).toBe("REVIEW");
    expect(classifyScore(35, ranges)).toBe("REVIEW");
    expect(classifyScore(49, ranges)).toBe("REVIEW");
  });

  it("should classify 50+ as FAIL", () => {
    const ranges = MORTGAGE_MIXED_INCOME_POLICY_V1.classification_rules.ranges;
    expect(classifyScore(50, ranges)).toBe("FAIL");
    expect(classifyScore(100, ranges)).toBe("FAIL");
  });
});

// ============================================================================
// REQUIREMENT: REQ-002 - Immutable Audit Trail (Hashing)
// ============================================================================

describe("REQ-002: Immutable Audit Trail", () => {
  it("should compute deterministic input hash", () => {
    const payload: StructuredFinancialPayload = {
      subject_id: "subj_001",
      cohort_key: "mortgage",
      decision_context: { type: DecisionContextType.LENDING, product: ProductType.HOME_PURCHASE },
      income_structure: { income_sources: [{ source_id: "s1", type: IncomeSourceType.SALARY, amount_cents: 100000, frequency: IncomeFrequency.MONTHLY }] },
    };

    const hash1 = hashPayload(payload);
    const hash2 = hashPayload(payload);

    expect(hash1).toBe(hash2); // Deterministic
    expect(hash1.length).toBe(64); // SHA256 hex
  });

  it("should compute deterministic policy hash", () => {
    const policyJson = JSON.stringify(MORTGAGE_MIXED_INCOME_POLICY_V1);
    const hash1 = hashPolicy(policyJson);
    const hash2 = hashPolicy(policyJson);

    expect(hash1).toBe(hash2);
  });

  it("should compute deterministic result hash", () => {
    const result = {
      status: "REVIEW",
      violation_score: 25,
      reason_codes: ["RP-INC-001"],
    };

    const hash1 = hashResult(result);
    const hash2 = hashResult(result);

    expect(hash1).toBe(hash2);
  });

  it("should produce different hashes for different payloads", () => {
    const payload1 = { subject_id: "subj_001", cohort_key: "m1", decision_context: { type: "LENDING", product: "HOME_PURCHASE" }, income_structure: { income_sources: [] } };
    const payload2 = { subject_id: "subj_002", cohort_key: "m2", decision_context: { type: "LENDING", product: "HOME_PURCHASE" }, income_structure: { income_sources: [] } };

    const hash1 = hashPayload(payload1 as any);
    const hash2 = hashPayload(payload2 as any);

    expect(hash1).not.toBe(hash2);
  });
});

// ============================================================================
// REQUIREMENT: REQ-001 - Determinism (Same input + policy = same output)
// ============================================================================

describe("REQ-001: Determinism Guarantee", () => {
  it("should produce identical results for identical input + policy", () => {
    const payload: StructuredFinancialPayload = {
      subject_id: "subj_001",
      cohort_key: "mortgage_software_sales_mixed_income",
      decision_context: {
        type: DecisionContextType.LENDING,
        product: ProductType.HOME_PURCHASE,
      },
      income_structure: {
        income_sources: [
          {
            source_id: "salary",
            type: IncomeSourceType.SALARY,
            amount_cents: 650000,
            frequency: IncomeFrequency.MONTHLY,
          },
          {
            source_id: "commission",
            type: IncomeSourceType.COMMISSION,
            amount_cents: 350000,
            frequency: IncomeFrequency.MONTHLY,
            concentration_percent: 35,
            volatility_band: VolatilityBand.MODERATE,
          },
        ],
      },
      obligations: {
        recurring_obligations: [
          {
            obligation_id: "housing",
            type: ObligationType.HOUSING,
            amount_cents: 200000,
            frequency: FrequencyType.MONTHLY,
          },
        ],
      },
    };

    const policy = MORTGAGE_MIXED_INCOME_POLICY_V1;
    const policyJson = JSON.stringify(policy);

    // Execute twice
    let violations1 = 0;
    for (const rule of policy.rules) {
      const executor = new Executor({ payload, variables: {} });
      const result = executor.execute(rule.condition);
      if (result.value === true) violations1 += rule.violation_contribution;
    }

    let violations2 = 0;
    for (const rule of policy.rules) {
      const executor = new Executor({ payload, variables: {} });
      const result = executor.execute(rule.condition);
      if (result.value === true) violations2 += rule.violation_contribution;
    }

    expect(violations1).toBe(violations2); // Deterministic
    expect(violations1).toBe(45); // Expected: RP-INC-001 (25) + RP-INC-002 (20)
  });
});
