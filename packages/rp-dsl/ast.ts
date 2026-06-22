export enum Operator {
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
  GT = "GT",
  GTE = "GTE",
  LT = "LT",
  LTE = "LTE",
  EQ = "EQ",
  IN = "IN",
  EXISTS = "EXISTS",
  SUM = "SUM",
  RATIO = "RATIO",
  COUNT = "COUNT",
  BAND = "BAND",
  CLASSIFY = "CLASSIFY",
  REASON = "REASON",
}

export type ASTNode = BinaryOp | UnaryOp | TerminalNode | AggregateOp | ClassifyOp | ReasonOp;

export interface BinaryOp {
  type: "binary";
  operator: Operator;
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryOp {
  type: "unary";
  operator: Operator;
  operand: ASTNode;
}

export interface TerminalNode {
  type: "terminal";
  kind: "literal" | "path" | "constant";
  value: any;
  path?: string;
}

export interface AggregateOp {
  type: "aggregate";
  operator: Operator;
  inputs: ASTNode[];
}

export interface ClassifyOp {
  type: "classify";
  operator: "CLASSIFY";
  ranges: ClassifyRange[];
}

export interface ClassifyRange {
  min: number;
  max: number;
  classification: string;
}

export interface ReasonOp {
  type: "reason";
  operator: "REASON";
  code: string;
  label: string;
  condition: ASTNode;
  severity: "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL";
  violation_contribution: number;
}

export interface PolicyRule {
  rule_id: string;
  condition: ASTNode;
  reason_code: string;
  violation_contribution: number;
}

export interface Policy {
  policy_id: string;
  policy_version: string;
  cohort_key: string;
  rules: PolicyRule[];
  classification_rules: ClassifyOp;
  created_at: string;
}

export function isPathNode(node: ASTNode): node is TerminalNode {
  return node.type === "terminal" && node.kind === "path";
}

export function isBinaryOp(node: ASTNode): node is BinaryOp {
  return node.type === "binary";
}

export function isUnaryOp(node: ASTNode): node is UnaryOp {
  return node.type === "unary";
}

export function isTerminal(node: ASTNode): node is TerminalNode {
  return node.type === "terminal";
}

export function isAggregate(node: ASTNode): node is AggregateOp {
  return node.type === "aggregate";
}

export function isClassify(node: ASTNode): node is ClassifyOp {
  return node.type === "classify";
}

export function isReason(node: ASTNode): node is ReasonOp {
  return node.type === "reason";
}
