import { ASTNode, BinaryOp, UnaryOp, TerminalNode, AggregateOp, ClassifyOp, ClassifyRange, isBinaryOp, isUnaryOp, isTerminal, isAggregate, isClassify, isReason } from "./ast";
import { executeOperator, Operator } from "./operators";
import { StructuredFinancialPayload } from "../domain/types";

export interface ExecutionContext {
  payload: StructuredFinancialPayload;
  variables: Record<string, any>;
}

export interface ExecutionResult {
  value: any;
  type: "boolean" | "number" | "string" | "array";
}

export class Executor {
  private context: ExecutionContext;
  private maxDepth: number = 16;
  private currentDepth: number = 0;

  constructor(context: ExecutionContext) {
    this.context = context;
  }

  execute(node: ASTNode): ExecutionResult {
    this.currentDepth = 0;
    return this.evaluateNode(node);
  }

  private evaluateNode(node: ASTNode): ExecutionResult {
    this.currentDepth++;

    if (this.currentDepth > this.maxDepth) {
      throw new Error(`Execution depth exceeded maximum of ${this.maxDepth}`);
    }

    if (isTerminal(node)) {
      return this.evaluateTerminal(node);
    }

    if (isBinaryOp(node)) {
      return this.evaluateBinaryOp(node);
    }

    if (isUnaryOp(node)) {
      return this.evaluateUnaryOp(node);
    }

    if (isAggregate(node)) {
      return this.evaluateAggregate(node);
    }

    if (isClassify(node)) {
      return this.evaluateClassify(node);
    }

    throw new Error(`Unknown node type`);
  }

  private evaluateTerminal(node: TerminalNode): ExecutionResult {
    if (node.kind === "literal") {
      return { value: node.value, type: typeof node.value as any };
    }

    if (node.kind === "path") {
      const value = this.resolvePath(node.path!);
      return { value, type: typeof value as any };
    }

    if (node.kind === "constant") {
      return { value: node.value, type: typeof node.value as any };
    }

    throw new Error(`Unknown terminal kind: ${node.kind}`);
  }

  private evaluateBinaryOp(node: BinaryOp): ExecutionResult {
    const left = this.evaluateNode(node.left);
    const right = this.evaluateNode(node.right);

    const result = executeOperator(node.operator, [left.value, right.value]);

    return {
      value: result,
      type: typeof result as any,
    };
  }

  private evaluateUnaryOp(node: UnaryOp): ExecutionResult {
    const operand = this.evaluateNode(node.operand);
    const result = executeOperator(node.operator, [operand.value]);

    return {
      value: result,
      type: typeof result as any,
    };
  }

  private evaluateAggregate(node: AggregateOp): ExecutionResult {
    const operands = node.inputs.map((input) => this.evaluateNode(input).value);
    const result = executeOperator(node.operator, [operands]);

    return {
      value: result,
      type: typeof result as any,
    };
  }

  private evaluateClassify(node: ClassifyOp): ExecutionResult {
    throw new Error("CLASSIFY evaluation not supported in executor");
  }

  private resolvePath(path: string): any {
    let current: any = this.context.payload;
    let remaining = path;

    while (remaining.length > 0) {
      // Check for array index notation (e.g., "[0]")
      const arrayMatch = remaining.match(/^\[(\d+)\]/);
      if (arrayMatch) {
        const index = parseInt(arrayMatch[1], 10);
        current = current[index];
        remaining = remaining.slice(arrayMatch[0].length);
        if (remaining.startsWith(".")) {
          remaining = remaining.slice(1);
        }
        continue;
      }

      // Get the next property name
      const propMatch = remaining.match(/^([^.\[]+)/);
      if (!propMatch) {
        break;
      }

      const prop = propMatch[1];
      current = current[prop];
      remaining = remaining.slice(prop.length);

      // Skip the dot if present
      if (remaining.startsWith(".")) {
        remaining = remaining.slice(1);
      }

      if (current === null || current === undefined) {
        return undefined;
      }
    }

    return current;
  }
}

export function classifyScore(score: number, ranges: ClassifyRange[]): string {
  const sorted = [...ranges].sort((a, b) => a.min - b.min);

  for (const range of sorted) {
    if (score >= range.min && score <= range.max) {
      return range.classification;
    }
  }

  throw new Error(`Score ${score} does not match any classification range`);
}
