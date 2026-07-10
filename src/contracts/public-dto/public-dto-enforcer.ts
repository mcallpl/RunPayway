/**
 * public-dto-enforcer.ts
 *
 * RUNTIME PUBLIC DTO ENFORCEMENT FOUNDATION — Segment B1a
 *
 * This is the runtime counterpart to the static reference manifests
 * `base-public-dto.allowlist.ts` and `base-public-dto.denylist.ts`.
 *
 * Those two files are declarative only (they perform no matching and no
 * enforcement). This module is the first place in the codebase that actually
 * *consumes* them at runtime to:
 *
 *   1. Project internal data down to the locked seven-field public DTO
 *      (`toPublicDto`) — a strict allowlist projection.
 *   2. Reject any object that carries a prohibited/denied field
 *      (`assertNoDeniedFields`) — a defense-in-depth guard.
 *   3. Subtractively strip prohibited fields from an arbitrary object
 *      (`stripDeniedFields`) — used for bounded leakage removal.
 *
 * Scope note (governed build):
 * - This module does NOT define or invent any internal-band → public
 *   classification mapping. `toPublicDto` requires the caller to supply an
 *   already-public classification value; it validates but never derives it.
 * - This module introduces no schema change, no new endpoint, and no CPC
 *   exposure. CPC terms appear here only as denied pattern strings.
 *
 * Source of truth: Step 9H DTO Contract (CLOSED AND LOCKED) via the two
 * static manifests in this directory.
 */

import {
  PUBLIC_DTO_ALLOWLIST,
  PUBLIC_CLASSIFICATION_VALUES,
} from "./base-public-dto.allowlist";
import { PUBLIC_DTO_DENYLIST } from "./base-public-dto.denylist";

// ─── Public DTO shape ───────────────────────────────────────────────────────

export type PublicClassification = (typeof PUBLIC_CLASSIFICATION_VALUES)[number];

// ─── Internal-band → public-classification mapping (B1b — LOCKED table) ──────

/**
 * Locked mapping from the internal engine primary band to the public
 * classification. Approved and locked by the Human Administrator
 * (conservative / honesty-first table).
 *
 * Governance rules (locked):
 * - Mapping input is the internal `primary_band` value ONLY.
 * - `sub_band`, `warning_overlays`, numeric score, and CPC are NEVER used.
 * - This is the SOLE public classification source; no numeric-threshold path.
 * - Unknown band values fail closed (throw), never default.
 *
 * Approved table:
 *   High Stability        → Stable
 *   Established Stability  → Moderate
 *   Developing Stability   → Moderate
 *   Limited Stability      → Volatile
 */
const PRIMARY_BAND_TO_PUBLIC_CLASSIFICATION: Readonly<
  Record<string, PublicClassification>
> = {
  "High Stability": "Stable",
  "Established Stability": "Moderate",
  "Developing Stability": "Moderate",
  "Limited Stability": "Volatile",
};

/**
 * Map an internal `primary_band` value to the locked public classification.
 *
 * Fails closed: any value not present in the approved table throws. Callers
 * must pass the internal primary band string and nothing else — no sub-band,
 * no overlay, no score.
 */
export function classificationFromPrimaryBand(
  primaryBand: string,
): PublicClassification {
  const mapped = PRIMARY_BAND_TO_PUBLIC_CLASSIFICATION[primaryBand];
  if (mapped === undefined) {
    throw new Error(
      `Public classification mapping violation: unknown primary_band "${String(
        primaryBand,
      )}"`,
    );
  }
  return mapped;
}

export interface PublicComparedWith {
  segment_label: string;
  /**
   * OPTIONAL / DEFERRED (Step 9H boundary revised by formal change control).
   * A positive-integer public segment size. Omitted entirely when no truthful
   * segment-population / cohort-size source exists — never null, 0, or a
   * placeholder. Must never be fabricated or derived from percentages,
   * percentiles, scores, peer_band_distribution, or methodology data.
   */
  size?: number;
}

/**
 * The public DTO. Six required fields plus the optional/deferred
 * `compared_with.size`. No other fields may ever be public.
 */
export interface PublicDto {
  assessment_id: string;
  assessment_date: string;
  classification: PublicClassification;
  primary_drivers: string[];
  interpretation: string;
  compared_with: PublicComparedWith;
}

/**
 * Source for `toPublicDto`. Every value here must ALREADY be public-safe.
 * This type intentionally mirrors the DTO 1:1 — the caller is responsible for
 * having produced public-safe values through separately authorized work; this
 * module does not transform, map, or invent them.
 */
export type PublicDtoSource = PublicDto;

// ─── Derived allow / deny structures (built from the static manifests) ───────

const ALLOWED_TOP_LEVEL = new Set<string>();
const ALLOWED_NESTED: Record<string, Set<string>> = {};

for (const field of PUBLIC_DTO_ALLOWLIST) {
  const [head, child] = field.field_name.split(".");
  ALLOWED_TOP_LEVEL.add(head);
  if (child) {
    (ALLOWED_NESTED[head] ??= new Set<string>()).add(child);
  }
}

/**
 * Keys that must never be flagged as denied, because they ARE the locked
 * public surface (top-level + nested allowlisted field names).
 */
const NEVER_DENY = new Set<string>(ALLOWED_TOP_LEVEL);
for (const children of Object.values(ALLOWED_NESTED)) {
  for (const child of children) NEVER_DENY.add(child);
}

/**
 * Flatten every denylist pattern string into a lowercased token set.
 */
const DENIED_TOKENS = new Set<string>();
for (const group of Object.values(PUBLIC_DTO_DENYLIST)) {
  for (const token of group as readonly string[]) {
    DENIED_TOKENS.add(token.toLowerCase());
  }
}

/**
 * Explicit critical denied keys. Some of the most dangerous internal fields
 * (e.g. `final_score`, `stability_band`, `model_version`) are prohibited by
 * governance but are not literal tokens in the static denylist. We enumerate
 * them here so enforcement fails closed regardless of manifest token coverage.
 */
const CRITICAL_DENIED_KEYS = new Set<string>(
  [
    "final_score",
    "stability_band",
    "model_version",
    "record_id",
    "record_hash",
    "authorization_code",
    "reason_codes",
    "integrity",
    "model_manifest",
    "issued_timestamp",
    "issued_timestamp_utc",
    "assessment_date_utc",
    "_v2",
  ].map((s) => s.toLowerCase()),
);

/**
 * Absolute-prohibition string patterns that must not appear anywhere in a
 * public payload — not even inside a string VALUE. Kept deliberately narrow to
 * avoid false positives on legitimate public copy.
 */
const ABSOLUTE_VALUE_PATTERNS: RegExp[] = [
  /commitment_pressure_classification/i,
  /\bcpc\b/i,
];

// ─── Key classification helpers ──────────────────────────────────────────────

function tokenize(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

/**
 * A key is denied if it is not an allowlisted public field AND it matches a
 * critical denied key, a full denied token, or contains a denied token as one
 * of its word segments.
 */
export function isDeniedKey(key: string): boolean {
  if (NEVER_DENY.has(key)) return false;

  const lower = key.toLowerCase();
  if (CRITICAL_DENIED_KEYS.has(lower)) return true;
  if (DENIED_TOKENS.has(lower)) return true;

  for (const segment of tokenize(key)) {
    if (DENIED_TOKENS.has(segment)) return true;
  }
  return false;
}

export function isPublicClassification(v: unknown): v is PublicClassification {
  return (
    typeof v === "string" &&
    (PUBLIC_CLASSIFICATION_VALUES as readonly string[]).includes(v)
  );
}

// ─── Enforcement primitives ──────────────────────────────────────────────────

/**
 * Recursively assert that `value` carries no denied field and no
 * absolutely-prohibited token in any string value. Throws on the first
 * violation. Returns void when the payload is clean.
 */
export function assertNoDeniedFields(value: unknown, path = "$"): void {
  if (typeof value === "string") {
    for (const pattern of ABSOLUTE_VALUE_PATTERNS) {
      if (pattern.test(value)) {
        throw new Error(
          `Public DTO enforcement violation: prohibited token matched at ${path} (value)`,
        );
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => assertNoDeniedFields(item, `${path}[${i}]`));
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (isDeniedKey(key)) {
        throw new Error(
          `Public DTO enforcement violation: denied field "${key}" at ${path}`,
        );
      }
      assertNoDeniedFields(child, `${path}.${key}`);
    }
  }
}

/**
 * Return a deep copy of `value` with every denied field removed. Used for
 * bounded, subtractive leakage removal where a full projection is not yet
 * possible.
 */
export function stripDeniedFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripDeniedFields(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (isDeniedKey(key)) continue;
      out[key] = stripDeniedFields(child);
    }
    return out as unknown as T;
  }
  return value;
}

/**
 * Strict allowlist projection to the locked seven-field public DTO.
 *
 * The caller MUST supply already-public values. This function:
 * - copies only the seven allowlisted fields,
 * - validates the classification against the locked value set,
 * - runs the denied-field guard on its own output,
 * and never derives, maps, or invents any value.
 */
export function toPublicDto(source: PublicDtoSource): PublicDto {
  if (!isPublicClassification(source.classification)) {
    throw new Error(
      `Public DTO enforcement violation: classification must be one of ${PUBLIC_CLASSIFICATION_VALUES.join(
        " | ",
      )}`,
    );
  }

  // `compared_with.segment_label` remains REQUIRED after the Step 9H revision.
  if (
    typeof source.compared_with?.segment_label !== "string" ||
    source.compared_with.segment_label.length === 0
  ) {
    throw new Error(
      "Public DTO enforcement violation: compared_with.segment_label is required " +
        "and must be a non-empty string",
    );
  }

  const compared_with: PublicComparedWith = {
    segment_label: source.compared_with.segment_label,
  };

  // `compared_with.size` is optional / deferred. Include it ONLY when a
  // truthful value is supplied and it is a valid positive integer. If it is
  // absent/undefined, omit the field entirely. Any present-but-invalid value
  // (null, 0, negative, non-integer, non-number) fails closed — this prevents
  // placeholder or fabricated sizes from ever reaching a public DTO.
  const rawSize = source.compared_with.size;
  if (rawSize !== undefined) {
    if (!isTruthfulSegmentSize(rawSize)) {
      throw new Error(
        "Public DTO enforcement violation: compared_with.size, when present, " +
          "must be a positive integer from a truthful segment-population source " +
          "(null, 0, negative, decimal, and non-number values are rejected)",
      );
    }
    compared_with.size = rawSize;
  }

  const dto: PublicDto = {
    assessment_id: source.assessment_id,
    assessment_date: source.assessment_date,
    classification: source.classification,
    primary_drivers: Array.isArray(source.primary_drivers)
      ? [...source.primary_drivers]
      : [],
    interpretation: source.interpretation,
    compared_with,
  };

  assertNoDeniedFields(dto);
  return dto;
}

/**
 * A public `compared_with.size`, when present, must be a positive integer.
 * This rejects null, 0, negatives, decimals, NaN/Infinity, and non-numbers —
 * the structural guard against placeholder or fabricated sizes. It does NOT and
 * cannot verify provenance; the truthful-source rule is enforced by governance
 * and by the caller supplying only genuine cohort-size values.
 */
export function isTruthfulSegmentSize(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0
  );
}
