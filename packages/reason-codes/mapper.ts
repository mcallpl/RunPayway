import { ASTNode } from "../rp-dsl/ast";
import { validateReasonCode } from "./registry";

export interface ReasonCodeMapping {
  rule_id: string;
  condition_ast_hash: string;
  reason_code: string;
  violation_contribution: number;
}

export class ReasonCodeMapper {
  private mappings: Map<string, ReasonCodeMapping> = new Map();

  registerMapping(mapping: ReasonCodeMapping): void {
    if (!validateReasonCode(mapping.reason_code)) {
      throw new Error(`Unknown reason code: ${mapping.reason_code}`);
    }
    this.mappings.set(mapping.rule_id, mapping);
  }

  getMapping(ruleId: string): ReasonCodeMapping | undefined {
    return this.mappings.get(ruleId);
  }

  getAllMappings(): ReasonCodeMapping[] {
    const result: ReasonCodeMapping[] = [];
    this.mappings.forEach((mapping) => {
      result.push(mapping);
    });
    return result;
  }

  validateAllMappings(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    this.mappings.forEach((mapping) => {
      if (!validateReasonCode(mapping.reason_code)) {
        errors.push(`Rule ${mapping.rule_id}: unknown reason code ${mapping.reason_code}`);
      }

      if (mapping.violation_contribution < 0) {
        errors.push(`Rule ${mapping.rule_id}: violation contribution must be non-negative`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const defaultReasonCodeMapper = new ReasonCodeMapper();

defaultReasonCodeMapper.registerMapping({
  rule_id: "commission-concentration",
  condition_ast_hash: "hash_1",
  reason_code: "RP-INC-001",
  violation_contribution: 25,
});

defaultReasonCodeMapper.registerMapping({
  rule_id: "commission-volatility",
  condition_ast_hash: "hash_2",
  reason_code: "RP-INC-002",
  violation_contribution: 20,
});

defaultReasonCodeMapper.registerMapping({
  rule_id: "obligation-ratio",
  condition_ast_hash: "hash_3",
  reason_code: "RP-OBL-001",
  violation_contribution: 30,
});
