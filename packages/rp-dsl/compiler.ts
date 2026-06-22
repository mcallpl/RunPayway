import { ASTNode, isBinaryOp, isUnaryOp, isTerminal, isAggregate, isClassify } from "./ast";
import { Operator, operatorRegistry } from "./operators";
import { validateReasonCode } from "../reason-codes/registry";
import { hashPolicy } from "../audit/hash";

export interface CompilerResult {
  valid: boolean;
  policy_hash: string;
  errors: string[];
  warnings: string[];
}

export class SafetyCompiler {
  private maxDepth: number = 16;
  private currentDepth: number = 0;
  private errors: string[] = [];
  private warnings: string[] = [];
  private visitedNodes: Set<ASTNode> = new Set();

  compile(policyJson: string): CompilerResult {
    this.errors = [];
    this.warnings = [];
    this.visitedNodes = new Set();
    this.currentDepth = 0;

    try {
      const policy = JSON.parse(policyJson);
      this.validatePolicy(policy);
    } catch (err) {
      if (err instanceof SyntaxError) {
        this.errors.push(`Invalid JSON: ${err.message}`);
      } else {
        this.errors.push(`Compilation error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const policy_hash = this.errors.length === 0 ? hashPolicy(policyJson) : "invalid";

    return {
      valid: this.errors.length === 0,
      policy_hash,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  private validatePolicy(policy: any): void {
    if (!policy.policy_id) {
      this.errors.push("Policy missing required field: policy_id");
    }

    if (!policy.policy_version) {
      this.errors.push("Policy missing required field: policy_version");
    }

    if (!policy.cohort_key) {
      this.errors.push("Policy missing required field: cohort_key");
    }

    if (!Array.isArray(policy.rules)) {
      this.errors.push("Policy rules must be an array");
      return;
    }

    for (const rule of policy.rules) {
      this.validateRule(rule);
    }

    if (policy.classification_rules) {
      this.validateClassificationRules(policy.classification_rules);
    }
  }

  private validateRule(rule: any): void {
    if (!rule.rule_id) {
      this.errors.push("Rule missing required field: rule_id");
    }

    if (!rule.reason_code) {
      this.errors.push(`Rule ${rule.rule_id || "unknown"} missing required field: reason_code`);
    } else if (!validateReasonCode(rule.reason_code)) {
      this.errors.push(`Rule ${rule.rule_id}: unknown reason code: ${rule.reason_code}`);
    }

    if (rule.violation_contribution === undefined || rule.violation_contribution === null) {
      this.errors.push(`Rule ${rule.rule_id}: missing violation_contribution`);
    } else if (typeof rule.violation_contribution !== "number") {
      this.errors.push(`Rule ${rule.rule_id}: violation_contribution must be numeric`);
    } else if (rule.violation_contribution < 0) {
      this.errors.push(`Rule ${rule.rule_id}: violation_contribution must be non-negative`);
    }

    if (!rule.condition) {
      this.errors.push(`Rule ${rule.rule_id}: missing condition AST`);
    } else {
      this.visitedNodes.clear();
      this.currentDepth = 0;
      this.validateAST(rule.condition);
    }
  }

  private validateClassificationRules(classifyOp: any): void {
    if (!Array.isArray(classifyOp.ranges)) {
      this.errors.push("Classification rules must have ranges array");
      return;
    }

    for (const range of classifyOp.ranges) {
      if (typeof range.min !== "number" || typeof range.max !== "number") {
        this.errors.push("Classification range must have numeric min and max");
      }
      if (range.min > range.max) {
        this.errors.push(`Classification range invalid: min (${range.min}) > max (${range.max})`);
      }
      if (!range.classification) {
        this.errors.push("Classification range missing classification field");
      }
    }
  }

  private validateAST(node: any): void {
    this.currentDepth++;

    if (this.currentDepth > this.maxDepth) {
      this.errors.push(`AST depth exceeded maximum of ${this.maxDepth}`);
      return;
    }

    if (!node || typeof node !== "object") {
      this.errors.push("AST node must be an object");
      return;
    }

    if (!node.type) {
      this.errors.push("AST node missing type field");
      return;
    }

    switch (node.type) {
      case "binary":
        this.validateBinaryOp(node);
        break;
      case "unary":
        this.validateUnaryOp(node);
        break;
      case "terminal":
        this.validateTerminal(node);
        break;
      case "aggregate":
        this.validateAggregate(node);
        break;
      case "classify":
        this.validateClassify(node);
        break;
      default:
        this.errors.push(`Unknown AST node type: ${node.type}`);
    }

    this.currentDepth--;
  }

  private validateBinaryOp(node: any): void {
    if (!node.operator || !(node.operator in Operator)) {
      this.errors.push(`Binary operator invalid or unknown: ${node.operator}`);
      return;
    }

    if (!node.left || !node.right) {
      this.errors.push(`Binary operator missing operands: ${node.operator}`);
      return;
    }

    this.validateAST(node.left);
    this.validateAST(node.right);
  }

  private validateUnaryOp(node: any): void {
    if (!node.operator || !(node.operator in Operator)) {
      this.errors.push(`Unary operator invalid or unknown: ${node.operator}`);
      return;
    }

    if (!node.operand) {
      this.errors.push(`Unary operator missing operand: ${node.operator}`);
      return;
    }

    this.validateAST(node.operand);
  }

  private validateTerminal(node: any): void {
    if (!node.kind || !["literal", "path", "constant"].includes(node.kind)) {
      this.errors.push(`Terminal node has invalid kind: ${node.kind}`);
      return;
    }

    if (node.kind === "path" && !node.path) {
      this.errors.push("Terminal path node missing path field");
    }

    if (node.kind === "literal" && node.value === undefined) {
      this.errors.push("Terminal literal node missing value field");
    }
  }

  private validateAggregate(node: any): void {
    if (!node.operator || !(node.operator in Operator)) {
      this.errors.push(`Aggregate operator invalid or unknown: ${node.operator}`);
      return;
    }

    // New style: source_path and value_path extraction
    if (node.source_path && node.value_path) {
      if (typeof node.source_path !== "string") {
        this.errors.push("Aggregate source_path must be string");
      }
      if (typeof node.value_path !== "string") {
        this.errors.push("Aggregate value_path must be string");
      }
      return;
    }

    // Legacy style: inputs array
    if (!Array.isArray(node.inputs)) {
      this.errors.push(`Aggregate operator must have inputs array or source_path/value_path: ${node.operator}`);
      return;
    }

    for (const input of node.inputs) {
      this.validateAST(input);
    }
  }

  private validateClassify(node: any): void {
    if (!Array.isArray(node.ranges)) {
      this.errors.push("Classify node missing ranges array");
      return;
    }

    this.validateClassificationRules(node);
  }
}

export function compilePolicy(policyJson: string): CompilerResult {
  const compiler = new SafetyCompiler();
  return compiler.compile(policyJson);
}
