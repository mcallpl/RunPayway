// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Input Validation

import {
  CANONICAL_KEYS,
  ALLOWED_VALUES,
  type DiagnosticInput,
  type CanonicalKey,
  type AllowedValue,
  type ProfileContext,
} from "./types";
import {
  CLASSIFICATIONS,
  OPERATING_STRUCTURES,
  PRIMARY_INCOME_MODELS,
  REVENUE_STRUCTURES,
  INDUSTRY_SECTORS,
} from "./constants";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateDiagnosticInput(input: unknown): DiagnosticInput {
  if (!input || typeof input !== "object") {
    throw new ValidationError("Diagnostic input must be a non-null object");
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj);

  // Must have exactly 6 keys
  if (keys.length !== CANONICAL_KEYS.length) {
    throw new ValidationError(
      `Input must have exactly ${CANONICAL_KEYS.length} fields, got ${keys.length}`
    );
  }

  // Must have exactly the canonical keys
  for (const key of CANONICAL_KEYS) {
    if (!(key in obj)) {
      throw new ValidationError(`Missing required field: ${key}`);
    }
  }

  // Each value must be an allowed integer
  const validated: Partial<DiagnosticInput> = {};
  for (const key of CANONICAL_KEYS) {
    const value = obj[key];
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new ValidationError(
        `Field ${key} must be an integer, got ${typeof value}`
      );
    }
    if (!(ALLOWED_VALUES as readonly number[]).includes(value)) {
      throw new ValidationError(
        `Field ${key} must be one of [${ALLOWED_VALUES.join(", ")}], got ${value}`
      );
    }
    validated[key as CanonicalKey] = value as AllowedValue;
  }

  return validated as DiagnosticInput;
}

export function validateProfileContext(profile: unknown): ProfileContext {
  if (!profile || typeof profile !== "object") {
    throw new ValidationError("Profile context must be a non-null object");
  }

  const obj = profile as Record<string, unknown>;

  // Required fields
  const required = [
    "classification",
    "operating_structure",
    "primary_income_model",
    "revenue_structure",
    "industry_sector",
  ];

  for (const field of required) {
    if (!obj[field] || typeof obj[field] !== "string") {
      throw new ValidationError(`Missing or invalid profile field: ${field}`);
    }
  }

  // Validate against canonical enumerations
  if (
    !(CLASSIFICATIONS as readonly string[]).includes(obj.classification as string)
  ) {
    throw new ValidationError(`Invalid classification: ${obj.classification}`);
  }
  if (
    !(OPERATING_STRUCTURES as readonly string[]).includes(
      obj.operating_structure as string
    )
  ) {
    throw new ValidationError(
      `Invalid operating_structure: ${obj.operating_structure}`
    );
  }
  if (
    !(PRIMARY_INCOME_MODELS as readonly string[]).includes(
      obj.primary_income_model as string
    )
  ) {
    throw new ValidationError(
      `Invalid primary_income_model: ${obj.primary_income_model}`
    );
  }
  if (
    !(REVENUE_STRUCTURES as readonly string[]).includes(
      obj.revenue_structure as string
    )
  ) {
    throw new ValidationError(
      `Invalid revenue_structure: ${obj.revenue_structure}`
    );
  }
  if (
    !(INDUSTRY_SECTORS as readonly string[]).includes(
      obj.industry_sector as string
    )
  ) {
    throw new ValidationError(`Invalid industry_sector: ${obj.industry_sector}`);
  }

  // Email validation — optional (comes from Stripe checkout, not user input)
  const email = typeof obj.recipient_email === "string" ? obj.recipient_email : "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw new ValidationError(`Invalid recipient_email: ${email}`);
  }

  return {
    assessment_title:
      typeof obj.assessment_title === "string" ? obj.assessment_title : undefined,
    classification: obj.classification as string,
    operating_structure: obj.operating_structure as string,
    primary_income_model: obj.primary_income_model as string,
    revenue_structure: obj.revenue_structure as string,
    industry_sector: obj.industry_sector as string,
    recipient_email: email || undefined,
  };
}
