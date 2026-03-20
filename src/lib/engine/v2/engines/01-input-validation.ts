// Engine 01 — Input Validation
// Validates raw diagnostic inputs, profile context, and extended inputs using Zod schemas.

import type { RawDiagnosticInput, ProfileContext, ExtendedInputs } from "../types";
import {
  RawDiagnosticInputSchema,
  ProfileContextSchema,
  ExtendedInputsSchema,
} from "../schemas/input.schema";

export function validateInputs(raw: unknown): RawDiagnosticInput {
  return RawDiagnosticInputSchema.parse(raw);
}

export function validateProfile(raw: unknown): ProfileContext {
  return ProfileContextSchema.parse(raw);
}

export function validateExtendedInputs(raw: unknown): ExtendedInputs | null {
  if (raw === undefined || raw === null) return null;
  return ExtendedInputsSchema.parse(raw);
}
