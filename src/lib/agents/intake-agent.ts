/**
 * RunPayway™ Intake Agent v1.0
 *
 * A state machine that guides the advisor through client classification
 * before scoring. Not a chatbot — a deterministic step-by-step flow.
 *
 * Responsibilities:
 * - Validate each input against permitted values
 * - Flag ambiguity when field combinations are unusual
 * - Advance to the next required step
 * - Produce a complete profile + raw inputs when done
 */

import type {
  ProfileContext,
  RawDiagnosticInput,
  AnswerChoice,
  OperatingStructure,
  PrimaryIncomeModel,
  RevenueStructure,
  IndustrySector,
} from "@/lib/engine/v2/types";

export const INTAKE_AGENT_VERSION = "1.0.0";

/* ── Step definitions ── */
export type IntakeStep =
  | "operating_structure"
  | "primary_income_model"
  | "revenue_structure"
  | "years_in_structure"
  | "q1" | "q2" | "q3" | "q4" | "q5" | "q6"
  | "review"
  | "complete";

const STEP_ORDER: IntakeStep[] = [
  "operating_structure",
  "primary_income_model",
  "revenue_structure",
  "years_in_structure",
  "q1", "q2", "q3", "q4", "q5", "q6",
  "review",
  "complete",
];

/* ── Permitted values ── */
const VALID_STRUCTURES: OperatingStructure[] = ["solo_service", "small_agency", "commissioned_operator", "retained_advisor", "creator_operator", "productized_service", "portfolio_operator", "asset_supported"];
const VALID_MODELS: PrimaryIncomeModel[] = ["commission", "retainer", "project_fee", "subscription", "salary", "mixed_services", "licensing", "rental", "ecommerce", "digital_products", "other"];
const VALID_REVENUE: RevenueStructure[] = ["active_heavy", "hybrid", "recurring_heavy", "asset_heavy", "mixed"];
const VALID_ANSWERS: AnswerChoice[] = ["A", "B", "C", "D", "E"];

/* ── State ── */
export interface IntakeState {
  currentStep: IntakeStep;
  industrySector: IndustrySector;
  operatingStructure: string;
  primaryIncomeModel: string;
  revenueStructure: string;
  yearsInStructure: string;
  answers: (AnswerChoice | null)[];  // 6 slots
  errors: string[];
  warnings: string[];
  ambiguityFlags: string[];
}

export function createInitialState(industrySector: IndustrySector): IntakeState {
  return {
    currentStep: "operating_structure",
    industrySector,
    operatingStructure: "",
    primaryIncomeModel: "",
    revenueStructure: "",
    yearsInStructure: "",
    answers: [null, null, null, null, null, null],
    errors: [],
    warnings: [],
    ambiguityFlags: [],
  };
}

/* ── Ambiguity rules ── */
function checkAmbiguity(state: IntakeState): string[] {
  const flags: string[] = [];

  // Solo service + subscription model is unusual
  if (state.operatingStructure === "solo_service" && state.primaryIncomeModel === "subscription") {
    flags.push("Solo service operators rarely have subscription revenue. Confirm your client runs a subscription-based business.");
  }

  // Salary + asset_heavy revenue is contradictory
  if (state.primaryIncomeModel === "salary" && state.revenueStructure === "asset_heavy") {
    flags.push("Salaried income with asset-heavy revenue structure is unusual. Confirm your client has significant passive income alongside salary.");
  }

  // Commission + recurring_heavy is unusual
  if (state.primaryIncomeModel === "commission" && state.revenueStructure === "recurring_heavy") {
    flags.push("Commission-based income is typically not recurring. Confirm your client has residual or trailing commissions.");
  }

  // Rental income + solo_service structure
  if (state.primaryIncomeModel === "rental" && state.operatingStructure === "solo_service") {
    flags.push("Rental income is typically classified under portfolio operator or asset supported structure.");
  }

  return flags;
}

/* ── Advance the state machine ── */
export function advanceIntake(
  state: IntakeState,
  input: { field: string; value: string }
): IntakeState {
  const next = { ...state, errors: [], warnings: [] };

  switch (state.currentStep) {
    case "operating_structure": {
      if (!VALID_STRUCTURES.includes(input.value as OperatingStructure)) {
        return { ...next, errors: ["Invalid operating structure."] };
      }
      next.operatingStructure = input.value;
      next.currentStep = "primary_income_model";
      break;
    }
    case "primary_income_model": {
      if (!VALID_MODELS.includes(input.value as PrimaryIncomeModel)) {
        return { ...next, errors: ["Invalid income model."] };
      }
      next.primaryIncomeModel = input.value;
      next.ambiguityFlags = checkAmbiguity(next);
      next.currentStep = "revenue_structure";
      break;
    }
    case "revenue_structure": {
      if (!VALID_REVENUE.includes(input.value as RevenueStructure)) {
        return { ...next, errors: ["Invalid revenue structure."] };
      }
      next.revenueStructure = input.value;
      next.ambiguityFlags = checkAmbiguity(next);
      next.currentStep = "years_in_structure";
      break;
    }
    case "years_in_structure": {
      if (!input.value) {
        return { ...next, errors: ["Years in structure is required."] };
      }
      next.yearsInStructure = input.value;
      next.currentStep = "q1";
      break;
    }
    case "q1": case "q2": case "q3": case "q4": case "q5": case "q6": {
      if (!VALID_ANSWERS.includes(input.value as AnswerChoice)) {
        return { ...next, errors: ["Select an answer A through E."] };
      }
      const qIndex = parseInt(state.currentStep.slice(1)) - 1;
      const newAnswers = [...next.answers] as (AnswerChoice | null)[];
      newAnswers[qIndex] = input.value as AnswerChoice;
      next.answers = newAnswers;

      const stepIdx = STEP_ORDER.indexOf(state.currentStep);
      next.currentStep = STEP_ORDER[stepIdx + 1];
      break;
    }
    case "review": {
      next.currentStep = "complete";
      break;
    }
    default:
      break;
  }

  return next;
}

/* ── Extract finalized inputs from complete state ── */
export function extractInputs(state: IntakeState): {
  profile: ProfileContext;
  rawInputs: RawDiagnosticInput;
} | null {
  if (state.currentStep !== "complete" && state.currentStep !== "review") return null;
  if (state.answers.some(a => a === null)) return null;

  const answers = state.answers as AnswerChoice[];

  return {
    profile: {
      profile_class: "individual",
      operating_structure: state.operatingStructure as ProfileContext["operating_structure"],
      primary_income_model: state.primaryIncomeModel as ProfileContext["primary_income_model"],
      revenue_structure: state.revenueStructure as ProfileContext["revenue_structure"],
      industry_sector: state.industrySector,
      maturity_stage: "developing",
    },
    rawInputs: {
      q1_recurring_revenue_base: answers[0],
      q2_income_concentration: answers[1],
      q3_income_source_diversity: answers[2],
      q4_forward_revenue_visibility: answers[3],
      q5_earnings_variability: answers[4],
      q6_income_continuity_without_labor: answers[5],
    },
  };
}

/* ── Step index for progress tracking ── */
export function getStepIndex(step: IntakeStep): number {
  return STEP_ORDER.indexOf(step);
}

export const TOTAL_STEPS = STEP_ORDER.length - 1; // exclude "complete"
