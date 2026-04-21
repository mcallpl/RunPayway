// RUNPAYWAY™ — Plan Validation Utility
// Single source of truth for all plan_key validation

import { PLANS, ADVISOR_PLANS } from "./config";

export type PlanKey = keyof typeof PLANS;
export type AdvisorPlanKey = keyof typeof ADVISOR_PLANS;
export type AllPlanKey = PlanKey | AdvisorPlanKey;

// Validation functions
export function isValidPlanKey(key: unknown): key is PlanKey {
  return key !== null && key !== undefined && key in PLANS;
}

export function isValidAdvisorPlanKey(key: unknown): key is AdvisorPlanKey {
  return key !== null && key !== undefined && key in ADVISOR_PLANS;
}

export function isValidPaymentPlanKey(key: unknown): key is "single_assessment" | "annual_monitoring" {
  return key === "single_assessment" || key === "annual_monitoring";
}

// Get plan details safely
export function getPlanDetails(planKey: unknown) {
  if (!isValidPlanKey(planKey)) return null;
  return PLANS[planKey];
}

export function getAdvisorPlanDetails(planKey: unknown) {
  if (!isValidAdvisorPlanKey(planKey)) return null;
  return ADVISOR_PLANS[planKey];
}

// Check plan features
export function getAssessmentCount(planKey: unknown): number {
  const plan = getPlanDetails(planKey);
  return plan?.assessments ?? 1;
}

export function getPriceCents(planKey: unknown): number {
  const plan = getPlanDetails(planKey);
  return plan?.price_cents ?? 0;
}

export function getDurationMonths(planKey: unknown): number | null {
  const plan = getPlanDetails(planKey);
  return plan?.duration_months ?? null;
}

// Check plan capabilities
export function isFreePlan(planKey: unknown): boolean {
  return planKey === "free";
}

export function isPaidPlan(planKey: unknown): boolean {
  return isValidPlanKey(planKey) && !isFreePlan(planKey);
}

export function isMonitoringPlan(planKey: unknown): boolean {
  return planKey === "annual_monitoring";
}

export function isSingleAssessmentPlan(planKey: unknown): boolean {
  return planKey === "single_assessment";
}

export function supportsRetakes(planKey: unknown): boolean {
  return isMonitoringPlan(planKey);
}

export function supportsMultipleAssessments(planKey: unknown): boolean {
  const count = getAssessmentCount(planKey);
  return count > 1;
}
