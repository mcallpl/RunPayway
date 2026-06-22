import { z } from "zod";
import {
  IncomeSourceType,
  IncomeFrequency,
  VolatilityBand,
  DecisionContextType,
  ProductType,
  ObligationType,
  FrequencyType,
} from "../domain/types";

const IncomeSourceSchema = z.object({
  source_id: z.string().min(1),
  type: z.nativeEnum(IncomeSourceType),
  amount_cents: z.number().int().nonnegative(),
  frequency: z.nativeEnum(IncomeFrequency),
  duration_months_observed: z.number().int().positive().optional(),
  concentration_percent: z.number().min(0).max(100).optional(),
  volatility_band: z.nativeEnum(VolatilityBand).optional(),
});

const IncomeStructureSchema = z.object({
  income_sources: z.array(IncomeSourceSchema).min(1),
});

const RecurringObligationSchema = z.object({
  obligation_id: z.string().min(1),
  type: z.nativeEnum(ObligationType),
  amount_cents: z.number().int().nonnegative(),
  frequency: z.nativeEnum(FrequencyType),
});

const ObligationsSchema = z.object({
  recurring_obligations: z.array(RecurringObligationSchema),
});

const DecisionContextSchema = z.object({
  type: z.nativeEnum(DecisionContextType),
  product: z.nativeEnum(ProductType),
  commitment_amount_cents: z.number().int().nonnegative().optional(),
  commitment_duration_months: z.number().int().positive().optional(),
});

export const StructuredFinancialPayloadSchema = z.object({
  subject_id: z.string().min(1),
  cohort_key: z.string().min(1),
  decision_context: DecisionContextSchema,
  income_structure: IncomeStructureSchema,
  obligations: ObligationsSchema.optional(),
});

export const EvaluationRequestSchema = z.object({
  organization_id: z.string().min(1),
  cohort_key: z.string().min(1),
  payload: StructuredFinancialPayloadSchema,
});

export const ReplayRequestSchema = z.object({
  audit_id: z.string().min(1),
});

export function validatePayload(
  data: unknown
): { success: true; data: z.infer<typeof StructuredFinancialPayloadSchema> } | { success: false; error: string } {
  const result = StructuredFinancialPayloadSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }
  return { success: true, data: result.data };
}

export function validateEvaluationRequest(
  data: unknown
): { success: true; data: z.infer<typeof EvaluationRequestSchema> } | { success: false; error: string } {
  const result = EvaluationRequestSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }
  return { success: true, data: result.data };
}

export function validateReplayRequest(
  data: unknown
): { success: true; data: z.infer<typeof ReplayRequestSchema> } | { success: false; error: string } {
  const result = ReplayRequestSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }
  return { success: true, data: result.data };
}
