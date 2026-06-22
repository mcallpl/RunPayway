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

export type OperatorFunction = (operands: any[]) => any;

export const operatorRegistry: Record<Operator, OperatorFunction> = {
  [Operator.AND]: (operands: any[]): boolean => {
    if (operands.length < 2) {
      throw new Error("AND requires at least 2 operands");
    }
    return operands.every((op) => op === true);
  },

  [Operator.OR]: (operands: any[]): boolean => {
    if (operands.length < 2) {
      throw new Error("OR requires at least 2 operands");
    }
    return operands.some((op) => op === true);
  },

  [Operator.NOT]: (operands: any[]): boolean => {
    if (operands.length !== 1) {
      throw new Error("NOT requires exactly 1 operand");
    }
    return operands[0] !== true;
  },

  [Operator.GT]: (operands: any[]): boolean => {
    if (operands.length !== 2) {
      throw new Error("GT requires exactly 2 operands");
    }
    const [left, right] = operands;
    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error("GT requires numeric operands");
    }
    return left > right;
  },

  [Operator.GTE]: (operands: any[]): boolean => {
    if (operands.length !== 2) {
      throw new Error("GTE requires exactly 2 operands");
    }
    const [left, right] = operands;
    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error("GTE requires numeric operands");
    }
    return left >= right;
  },

  [Operator.LT]: (operands: any[]): boolean => {
    if (operands.length !== 2) {
      throw new Error("LT requires exactly 2 operands");
    }
    const [left, right] = operands;
    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error("LT requires numeric operands");
    }
    return left < right;
  },

  [Operator.LTE]: (operands: any[]): boolean => {
    if (operands.length !== 2) {
      throw new Error("LTE requires exactly 2 operands");
    }
    const [left, right] = operands;
    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error("LTE requires numeric operands");
    }
    return left <= right;
  },

  [Operator.EQ]: (operands: any[]): boolean => {
    if (operands.length !== 2) {
      throw new Error("EQ requires exactly 2 operands");
    }
    const [left, right] = operands;
    return left === right;
  },

  [Operator.IN]: (operands: any[]): boolean => {
    if (operands.length !== 2) {
      throw new Error("IN requires exactly 2 operands: value and array");
    }
    const [value, list] = operands;
    if (!Array.isArray(list)) {
      throw new Error("IN operator requires second operand to be an array");
    }
    return list.includes(value);
  },

  [Operator.EXISTS]: (operands: any[]): boolean => {
    if (operands.length !== 1) {
      throw new Error("EXISTS requires exactly 1 operand");
    }
    return operands[0] !== null && operands[0] !== undefined;
  },

  [Operator.SUM]: (operands: any[]): number => {
    if (!Array.isArray(operands[0])) {
      throw new Error("SUM requires array operand");
    }
    const values = operands[0] as any[];
    return values.reduce((sum, v) => {
      if (typeof v === "number") {
        return sum + v;
      }
      // If v is an object, try to find a numeric property
      if (typeof v === "object" && v !== null) {
        // Look for amount_cents (financial data) or value properties
        if (typeof v.amount_cents === "number") {
          return sum + v.amount_cents;
        }
        if (typeof v.value === "number") {
          return sum + v.value;
        }
      }
      throw new Error("SUM: cannot extract numeric value from operand");
    }, 0);
  },

  [Operator.RATIO]: (operands: any[]): number => {
    if (operands.length !== 2) {
      throw new Error("RATIO requires exactly 2 operands");
    }
    const [numerator, denominator] = operands;
    if (typeof numerator !== "number" || typeof denominator !== "number") {
      throw new Error("RATIO requires numeric operands");
    }
    if (denominator === 0) {
      throw new Error("RATIO division by zero");
    }
    return numerator / denominator;
  },

  [Operator.COUNT]: (operands: any[]): number => {
    if (!Array.isArray(operands[0])) {
      throw new Error("COUNT requires array operand");
    }
    return (operands[0] as any[]).length;
  },

  [Operator.BAND]: (operands: any[]): boolean => {
    if (operands.length !== 3) {
      throw new Error("BAND requires exactly 3 operands: [value, min, max]");
    }
    const [value, min, max] = operands;
    if (typeof value !== "number" || typeof min !== "number" || typeof max !== "number") {
      throw new Error("BAND requires numeric operands");
    }
    return value >= min && value <= max;
  },

  [Operator.CLASSIFY]: (operands: any[]): string => {
    throw new Error("CLASSIFY is handled separately");
  },

  [Operator.REASON]: (operands: any[]): any => {
    throw new Error("REASON is handled separately");
  },
};

export function executeOperator(operator: Operator, operands: any[]): any {
  const fn = operatorRegistry[operator];
  if (!fn) {
    throw new Error(`Unknown operator: ${operator}`);
  }
  return fn(operands);
}
