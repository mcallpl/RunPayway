/**
 * base-public-dto.denylist.ts
 *
 * STATIC REFERENCE ARTIFACT — Stage A (Corrected Implementation)
 *
 * This file contains ONLY static prohibited-field categories and prohibited
 * pattern strings. It contains NO enforcement logic, NO validation, NO
 * serializer logic, NO runtime functions, NO test helpers, NO public copy,
 * NO example API responses, NO route references, and NO DTO implementation.
 * It imports nothing from application code.
 *
 * IMPORTANT CPC RULE:
 * Terms such as "cpc" and "commitment_pressure_classification" appear in this
 * file ONLY as prohibited denylist pattern strings. Their presence here is the
 * declaration that they are forbidden from public output. They are not field
 * names, not labels, not enum values, and not public terms.
 *
 * Any field name, path, or token matching a category below is NOT public-safe
 * and must never appear in a public DTO, report, dashboard, PDF, or API response.
 */

/**
 * Prohibited pattern strings, grouped by static category.
 * Each entry is a plain string token or fragment that marks a field as non-public.
 * These are reference patterns only — this file performs no matching itself.
 */
export const PUBLIC_DTO_DENYLIST = {
  /**
   * Commitment Pressure Classification internals.
   * These terms are internal-only, compute-only, and must never be public.
   * Listed here strictly as prohibited pattern strings.
   */
  cpc_patterns: [
    "cpc",
    "CPC",
    "commitment_pressure_classification",
    "CommitmentPressureClassification",
    "commitmentPressureClassification",
  ],

  /** Version internals and _v2 surfaces. */
  version_internals: [
    "_v2",
    "v2_internal",
    "version_internal",
    "internal_version",
  ],

  /** Raw database identifiers and primary/foreign keys. */
  raw_database_ids: [
    "id",
    "db_id",
    "database_id",
    "record_id",
    "row_id",
    "pk",
    "primary_key",
    "fk",
    "foreign_key",
  ],

  /** AssessmentRecord internal fields. */
  assessment_record_internals: [
    "AssessmentRecord",
    "assessment_record",
    "assessmentRecord",
    "assessment_record_id",
    "record_internal",
  ],

  /** Audit fields. */
  audit_fields: [
    "audit",
    "audit_log",
    "audit_trail",
    "created_by",
    "updated_by",
    "audited_at",
  ],

  /** Replay fields. */
  replay_fields: [
    "replay",
    "replay_id",
    "replay_state",
    "replay_token",
  ],

  /** Persistence fields. */
  persistence_fields: [
    "created_at",
    "updated_at",
    "deleted_at",
    "persisted",
    "persistence",
    "stored_at",
  ],

  /** Debug fields. */
  debug_fields: [
    "debug",
    "debug_info",
    "trace",
    "stack",
    "internal_notes",
  ],

  /** Engine internals. */
  engine_internals: [
    "engine",
    "engine_internal",
    "engine_state",
    "compute_internal",
  ],

  /** Raw calculation internals. */
  raw_calculation_internals: [
    "raw_calc",
    "raw_calculation",
    "calc_internal",
    "intermediate_value",
    "raw_value",
  ],

  /** Policy executor internals. */
  policy_executor_internals: [
    "policy_executor",
    "policyExecutor",
    "executor_state",
    "policy_internal",
  ],

  /** AST / RP-DSL internals. */
  ast_rp_dsl_internals: [
    "ast",
    "AST",
    "rp_dsl",
    "rpdsl",
    "dsl_node",
    "parse_tree",
  ],

  /** Schema / ORM fields. */
  schema_orm_fields: [
    "prisma",
    "orm",
    "schema_internal",
    "model_internal",
    "select",
    "include",
  ],

  /** Database relation fields. */
  database_relation_fields: [
    "relation",
    "join",
    "foreign_relation",
    "related_records",
  ],

  /** Report-only fields (not public DTO surface). */
  report_only_fields: [
    "report_internal",
    "pdf_internal",
    "report_only",
    "internal_report_field",
  ],

  /** Numeric score-like fields. */
  numeric_score_like_fields: [
    "score",
    "numeric_score",
    "commitment_pressure_score",
    "pressure_score",
    "points",
  ],

  /** Percentile fields. */
  percentile_fields: [
    "percentile",
    "percentile_rank",
    "pct",
    "rank_percentile",
  ],

  /** Stability metrics fields. */
  stability_metrics_fields: [
    "stability_metrics",
    "stabilityMetrics",
    "stability_metric",
    "stability_index",
  ],

  /** Typical range fields. */
  typical_range_fields: [
    "typical_range",
    "typicalRange",
    "range_low",
    "range_high",
    "typical_band",
  ],

  /** Technical classification fields. */
  technical_classification_fields: [
    "technical_classification",
    "technicalClassification",
    "internal_classification",
    "classification_internal",
  ],
} as const;

/**
 * Static metadata describing the denylist artifact.
 * Declarative only — no runtime behavior derives from these values.
 */
export const PUBLIC_DTO_DENYLIST_METADATA = {
  source_of_truth: "Step 9H DTO Contract (CLOSED AND LOCKED)",
  purpose: "Static reference list of prohibited public-output patterns.",
  cpc_terms_are_pattern_strings_only: true,
  performs_matching: false,
  performs_enforcement: false,
} as const;
