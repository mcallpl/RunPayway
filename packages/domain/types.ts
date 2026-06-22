export enum IncomeSourceType {
  SALARY = "SALARY",
  COMMISSION = "COMMISSION",
  BONUS = "BONUS",
  CONTRACT = "CONTRACT",
  BUSINESS = "BUSINESS",
  OTHER = "OTHER",
}

export enum IncomeFrequency {
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUAL",
}

export enum VolatilityBand {
  LOW = "LOW",
  MODERATE = "MODERATE",
  ELEVATED = "ELEVATED",
  HIGH = "HIGH",
}

export enum DecisionContextType {
  LENDING = "LENDING",
  UNDERWRITING = "UNDERWRITING",
  COMPLIANCE_REVIEW = "COMPLIANCE_REVIEW",
}

export enum ProductType {
  HOME_PURCHASE = "HOME_PURCHASE",
  AUTO_LOAN = "AUTO_LOAN",
  PERSONAL_LOAN = "PERSONAL_LOAN",
  OTHER = "OTHER",
}

export enum ObligationType {
  HOUSING = "HOUSING",
  AUTO = "AUTO",
  CREDIT = "CREDIT",
  OTHER = "OTHER",
}

export enum FrequencyType {
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUAL",
}

export interface IncomeSource {
  source_id: string;
  type: IncomeSourceType;
  amount_cents: number;
  frequency: IncomeFrequency;
  duration_months_observed?: number;
  concentration_percent?: number;
  volatility_band?: VolatilityBand;
}

export interface IncomeStructure {
  income_sources: IncomeSource[];
}

export interface RecurringObligation {
  obligation_id: string;
  type: ObligationType;
  amount_cents: number;
  frequency: FrequencyType;
}

export interface Obligations {
  recurring_obligations: RecurringObligation[];
}

export interface DecisionContext {
  type: DecisionContextType;
  product: ProductType;
  commitment_amount_cents?: number;
  commitment_duration_months?: number;
}

export interface StructuredFinancialPayload {
  subject_id: string;
  cohort_key: string;
  decision_context: DecisionContext;
  income_structure: IncomeStructure;
  obligations?: Obligations;
}

export interface EvaluationRequest {
  organization_id: string;
  cohort_key: string;
  payload: StructuredFinancialPayload;
}

export enum EvaluationStatus {
  PASS = "PASS",
  FAIL = "FAIL",
  REVIEW = "REVIEW",
  INPUT_ERROR = "INPUT_ERROR",
  ASNC = "ASNC",
  POLICY_BINDING_ERROR = "POLICY_BINDING_ERROR",
  EXECUTION_TIMEOUT = "EXECUTION_TIMEOUT",
}

export interface ReasonCode {
  code: string;
  label: string;
  severity: "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL";
}

export interface RuleResult {
  operator: string;
  operands: string[];
  condition_met: boolean;
  violation_contribution: number;
}

export interface AuditRecord {
  audit_id: string;
  input_hash: string;
  policy_hash: string;
  result_hash: string;
  evaluator_version: string;
  replayable: boolean;
  timestamp: string;
}

export interface EvaluationResult {
  evaluation_id: string;
  status: EvaluationStatus;
  compliance_classification: string;
  violation_score: number;
  reason_codes: string[];
  rule_results: RuleResult[];
  audit: AuditRecord;
}

export interface PolicyVersion {
  policy_id: string;
  policy_version: string;
  policy_hash: string;
  cohort_key: string;
  rules: any[];
  created_at: string;
}
