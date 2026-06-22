import { ReasonCode } from "../domain/types";

export const reasonCodeRegistry: Record<string, ReasonCode> = {
  "RP-INC-001": {
    code: "RP-INC-001",
    label: "Commission income concentration threshold triggered",
    severity: "ELEVATED",
  },
  "RP-INC-002": {
    code: "RP-INC-002",
    label: "Commission income volatility band threshold triggered",
    severity: "ELEVATED",
  },
  "RP-OBL-001": {
    code: "RP-OBL-001",
    label: "Recurring obligation ratio threshold triggered",
    severity: "ELEVATED",
  },
};

export function getReasonCode(code: string): ReasonCode | undefined {
  return reasonCodeRegistry[code];
}

export function validateReasonCode(code: string): boolean {
  return code in reasonCodeRegistry;
}

export function listReasonCodes(): ReasonCode[] {
  return Object.values(reasonCodeRegistry);
}
