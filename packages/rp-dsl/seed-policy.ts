import { Policy } from "./ast";
import { Operator } from "./operators";

export const MORTGAGE_MIXED_INCOME_POLICY_V1: Policy = {
  policy_id: "policy_mortgage_mixed_income",
  policy_version: "1.0.0",
  cohort_key: "mortgage_software_sales_mixed_income",
  rules: [
    {
      rule_id: "commission-concentration",
      condition: {
        type: "binary",
        operator: Operator.GTE,
        left: {
          type: "terminal",
          kind: "path",
          path: "income_structure.income_sources[1].concentration_percent",
        },
        right: {
          type: "terminal",
          kind: "literal",
          value: 35,
        },
      },
      reason_code: "RP-INC-001",
      violation_contribution: 25,
    },
    {
      rule_id: "commission-volatility",
      condition: {
        type: "binary",
        operator: Operator.IN,
        left: {
          type: "terminal",
          kind: "path",
          path: "income_structure.income_sources[1].volatility_band",
        },
        right: {
          type: "terminal",
          kind: "literal",
          value: ["ELEVATED", "HIGH"],
        },
      },
      reason_code: "RP-INC-002",
      violation_contribution: 20,
    },
    {
      rule_id: "obligation-ratio",
      condition: {
        type: "binary",
        operator: Operator.GT,
        left: {
          type: "binary",
          operator: Operator.RATIO,
          left: {
            type: "aggregate",
            operator: Operator.SUM,
            source_path: "obligations.recurring_obligations",
            value_path: "amount_cents",
          },
          right: {
            type: "aggregate",
            operator: Operator.SUM,
            source_path: "income_structure.income_sources",
            value_path: "amount_cents",
          },
        },
        right: {
          type: "terminal",
          kind: "literal",
          value: 0.45,
        },
      },
      reason_code: "RP-OBL-001",
      violation_contribution: 30,
    },
  ],
  classification_rules: {
    type: "classify",
    operator: "CLASSIFY",
    ranges: [
      {
        min: 0,
        max: 19,
        classification: "PASS",
      },
      {
        min: 20,
        max: 49,
        classification: "REVIEW",
      },
      {
        min: 50,
        max: 1000,
        classification: "FAIL",
      },
    ],
  },
  created_at: new Date().toISOString(),
};

export function getMortgageMixedIncomePolicy(): Policy {
  return JSON.parse(JSON.stringify(MORTGAGE_MIXED_INCOME_POLICY_V1));
}

export function getPolicySeedData() {
  return {
    policy_id: MORTGAGE_MIXED_INCOME_POLICY_V1.policy_id,
    policy_version: MORTGAGE_MIXED_INCOME_POLICY_V1.policy_version,
    cohort_key: MORTGAGE_MIXED_INCOME_POLICY_V1.cohort_key,
    rules: JSON.stringify(MORTGAGE_MIXED_INCOME_POLICY_V1.rules),
  };
}
