/**
 * base-public-dto.allowlist.ts
 *
 * STATIC REFERENCE ARTIFACT — Stage A (Corrected Implementation)
 *
 * This file contains ONLY static constants and static metadata describing the
 * locked public DTO allowlist from Step 9H (CLOSED AND LOCKED).
 *
 * It contains NO DTO class, NO interface, NO serializer, NO transformation,
 * NO validation, and NO runtime behavior. It imports nothing from application
 * code. It is a declarative allowlist manifest only.
 *
 * Step 9H base public DTO contract, revised by formal change control so that
 * `compared_with.size` is OPTIONAL / DEFERRED (no truthful segment-population
 * source exists today):
 *
 *   {
 *     assessment_id: string,
 *     assessment_date: string,
 *     classification: "Stable" | "Volatile" | "Moderate",
 *     primary_drivers: string[],
 *     interpretation: string,
 *     compared_with: {
 *       segment_label: string,
 *       size?: number   // OPTIONAL / DEFERRED — omit when no truthful source
 *     }
 *   }
 *
 * The public DTO may expose ONLY these seven fields (six required + the
 * optional/deferred `compared_with.size`). Any field not present in
 * PUBLIC_DTO_ALLOWLIST is, by definition, not public-safe.
 */

/**
 * The exact and only classification values permitted in any public DTO.
 * These are the sole public expression of the internal measurement.
 * No other classification labels, enum names, or internal terms are public.
 */
export const PUBLIC_CLASSIFICATION_VALUES = [
  "Stable",
  "Volatile",
  "Moderate",
] as const;

/**
 * Static metadata describing each allowed public DTO field.
 *
 * field_name   — the exact public field name (or dotted path for nested fields)
 * field_type   — the declared shape of the public value
 * required     — whether the field must be present in the public DTO
 * public_safe  — always true for allowlisted fields (this file lists only safe fields)
 * notes        — static clarifications; format/status where the format remains TBD
 */
export const PUBLIC_DTO_ALLOWLIST = [
  {
    field_name: "assessment_id",
    field_type: "string",
    required: true,
    public_safe: true,
    notes:
      "UUID or opaque public reference ID. Exact format TBD (not yet locked). " +
      "Must never be a raw database ID or internal primary key.",
  },
  {
    field_name: "assessment_date",
    field_type: "string",
    required: true,
    public_safe: true,
    notes: "Public date field as a string. Exact string format TBD unless separately locked.",
  },
  {
    field_name: "classification",
    field_type: 'enum: "Stable" | "Volatile" | "Moderate"',
    required: true,
    public_safe: true,
    notes:
      "Sole public classification field. Value must be exactly one of " +
      "PUBLIC_CLASSIFICATION_VALUES. No other enum names or internal terms are permitted.",
  },
  {
    field_name: "primary_drivers",
    field_type: "string[]",
    required: true,
    public_safe: true,
    notes: "Must be present. May be an empty array. Contains public-safe driver strings only.",
  },
  {
    field_name: "interpretation",
    field_type: "string",
    required: true,
    public_safe: true,
    notes:
      "Public interpretation text. Interpretation language rules are TBD and remain future " +
      "work requiring separate authorization. No public copy examples are approved here.",
  },
  {
    field_name: "compared_with.segment_label",
    field_type: "string",
    required: true,
    public_safe: true,
    notes: "Nested under compared_with. Public segment label string.",
  },
  {
    field_name: "compared_with.size",
    field_type: "number",
    required: false,
    public_safe: true,
    notes:
      "OPTIONAL / DEFERRED (change-control revision to the Step 9H boundary). " +
      "Nested under compared_with. A positive-integer public segment size. " +
      "May be OMITTED when no truthful source exists; when omitted it must be " +
      "absent (not null, not 0, not a placeholder). May be populated ONLY from " +
      "a genuine segment-population / cohort-size source. Must NEVER be " +
      "fabricated or derived from percentages, percentiles, score thresholds, " +
      "peer_band_distribution, peer_percentile, cluster_average_score, " +
      "top_20_threshold, benchmark_note, synthetic constants, methodology " +
      "notes, or guessed values.",
  },
] as const;

/**
 * Static field-level clarifications carried alongside the allowlist.
 * Declarative only — no runtime behavior derives from these values.
 */
export const PUBLIC_DTO_ALLOWLIST_METADATA = {
  source_of_truth:
    "Step 9H DTO Contract (CLOSED AND LOCKED), revised by formal change control " +
    "to make compared_with.size optional/deferred.",
  allowed_field_count: 7,
  required_field_count: 6,
  optional_deferred_fields: ["compared_with.size"],
  classification_values: PUBLIC_CLASSIFICATION_VALUES,
  primary_drivers_empty_array_allowed: true,
  assessment_id_format: "UUID or opaque public reference ID; exact format TBD",
  assessment_date_format: "string; exact format TBD unless separately locked",
  interpretation_language_rules: "TBD; requires separate authorization",
  compared_with_size_status: "optional / deferred until a truthful source exists",
  compared_with_size_source_rule:
    "Populate ONLY from a genuine segment-population / cohort-size source " +
    "(positive integer). When omitted, the field must be absent (not null, not " +
    "0, not a placeholder). Never fabricate; never derive from percentages, " +
    "percentiles, score thresholds, peer_band_distribution, peer_percentile, " +
    "cluster_average_score, top_20_threshold, benchmark_note, synthetic " +
    "constants, methodology notes, or guessed values.",
  compared_with_segment_label_status: "required",
} as const;
