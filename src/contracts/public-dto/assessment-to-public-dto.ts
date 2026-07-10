/**
 * assessment-to-public-dto.ts
 *
 * PURE PUBLIC DTO ADAPTER (B1f-impl-1)
 *
 * Converts a full internal assessment record into the locked public DTO shape,
 * using only the locked foundations and source decisions from Acceptance Log
 * Entries 12 through 15.
 *
 * This module is PURE and has NO HTTP surface, NO route, and NO endpoint. It
 * does not read, write, or bypass storage. It is not wired to any existing
 * endpoint. Exposing it publicly is a separate, later, separately-authorized
 * gate (S-C).
 *
 * Governance (locked):
 * - Whitelist projection ONLY. The adapter constructs a fresh object with the
 *   allowlisted public fields; it never spreads the internal record. The input
 *   type below exposes only the four fields the adapter is permitted to read,
 *   so denied internal fields are not even reachable here.
 * - classification derives from the internal primary band via the locked
 *   mapping (Entry 13). Interpretation derives ONLY from the locked
 *   classification-keyed templates (Entry 15). segment_label derives ONLY from
 *   the locked allowlisted sector map (Entry 15, Strategy L2); mechanical
 *   transformation is rejected; unknown / missing / unapproved / non-allowlisted
 *   sectors and `other` fail closed.
 * - primary_drivers is the empty-array interim (Entry 15).
 * - compared_with.size is omitted entirely (Entry 14).
 * - The result is passed through toPublicDto(), which enforces the required
 *   segment_label and runs assertNoDeniedFields() as a final backstop.
 */

import {
  toPublicDto,
  classificationFromPrimaryBand,
  type PublicClassification,
  type PublicDto,
  type PublicDtoSource,
} from "./public-dto-enforcer";

/**
 * The ONLY fields of an internal assessment record the public adapter is
 * permitted to read. A full AssessmentRecord structurally satisfies this view
 * (primary_band and industry_sector are assignable to string), while denied
 * internal fields (scores, bands details, reason_codes, integrity, etc.) are
 * intentionally not exposed to this adapter.
 */
export interface AssessmentRecordPublicView {
  assessment_id: string;
  created_at: string;
  bands: { primary_band: string };
  profile_context: { industry_sector: string };
}

/**
 * LOCKED interpretation templates (Entry 15). Emitted ONLY by keyed lookup on
 * the public classification value. Verbatim as accepted and locked. No numeric
 * score, no advice, no CPC, no em dashes.
 */
export const INTERPRETATION_TEMPLATES: Readonly<
  Record<PublicClassification, string>
> = {
  Stable:
    "The measured commitment shows a lower level of dependence on continued " +
    "support-structure strength. Based on the available inputs, the commitment " +
    "appears less sensitive to ordinary changes in the supporting income structure.",
  Moderate:
    "The measured commitment shows a moderate level of dependence on continued " +
    "support-structure strength. Based on the available inputs, the commitment " +
    "remains meaningfully connected to the continued stability of the supporting " +
    "income structure.",
  Volatile:
    "The measured commitment shows a higher level of dependence on continued " +
    "support-structure strength. Based on the available inputs, the commitment " +
    "appears more sensitive to changes in the supporting income structure.",
};

/**
 * LOCKED allowlisted sector-to-public-label map (Entry 15, Strategy L2).
 *
 * Explicit, curated public segment labels for the 18 named industry sectors.
 * `other` is DELIBERATELY OMITTED so that lookup fails closed until a public-safe
 * label is separately approved through future formal governance. Any sector not
 * present here (unknown / missing / unapproved / `other`) fails closed.
 *
 * These labels are public-facing consumer copy and are recommended for Human
 * Administrator ratification (Entry 15 locked the strategy and structure; the
 * exact label strings are proposed by this implementation).
 */
export const PUBLIC_SEGMENT_LABEL_BY_SECTOR: Readonly<Record<string, string>> = {
  real_estate: "Real Estate",
  finance_banking: "Finance and Banking",
  insurance: "Insurance",
  technology: "Technology",
  healthcare: "Healthcare",
  legal_services: "Legal Services",
  consulting_professional_services: "Consulting and Professional Services",
  sales_brokerage: "Sales and Brokerage",
  media_entertainment: "Media and Entertainment",
  construction_trades: "Construction and Trades",
  retail_ecommerce: "Retail and E-Commerce",
  hospitality_food_service: "Hospitality and Food Service",
  transportation_logistics: "Transportation and Logistics",
  manufacturing: "Manufacturing",
  education: "Education",
  nonprofit_public_sector: "Nonprofit and Public Sector",
  agriculture: "Agriculture",
  energy_utilities: "Energy and Utilities",
  // `other` intentionally omitted -> fails closed (Entry 15 decision).
};

/**
 * Resolve the locked interpretation string for a public classification.
 */
export function interpretationForClassification(
  classification: PublicClassification,
): string {
  return INTERPRETATION_TEMPLATES[classification];
}

/**
 * Resolve the locked public segment label for an internal industry_sector.
 * Fails closed for unknown / missing / unapproved / non-allowlisted values and
 * for `other`. No mechanical string transformation is performed.
 */
export function publicSegmentLabelFromSector(sector: string): string {
  const label = PUBLIC_SEGMENT_LABEL_BY_SECTOR[sector];
  if (typeof label !== "string" || label.length === 0) {
    throw new Error(
      `Public DTO adapter violation: no allowlisted public segment label for ` +
        `sector "${String(sector)}" (unknown, missing, unapproved, non-` +
        `allowlisted, or 'other' values fail closed)`,
    );
  }
  return label;
}

/**
 * Convert a full internal assessment record into the locked public DTO.
 *
 * Pure whitelist projection: builds a fresh public object, never spreads the
 * record, and passes it through toPublicDto() for final enforcement.
 */
export function assessmentRecordToPublicDto(
  record: AssessmentRecordPublicView,
): PublicDto {
  // classification: locked internal-band -> public mapping; fails closed on
  // any unknown primary_band value (Entry 13).
  const classification = classificationFromPrimaryBand(record.bands.primary_band);

  // interpretation: keyed lookup only from the locked templates (Entry 15).
  const interpretation = interpretationForClassification(classification);

  // segment_label: locked allowlisted sector map only; fails closed (Entry 15).
  const segment_label = publicSegmentLabelFromSector(
    record.profile_context.industry_sector,
  );

  const source: PublicDtoSource = {
    assessment_id: record.assessment_id,
    assessment_date: record.created_at,
    classification,
    primary_drivers: [], // empty-array interim (Entry 15)
    interpretation,
    compared_with: {
      segment_label,
      // compared_with.size omitted entirely (Entry 14): no truthful source.
    },
  };

  // Final backstop: requires non-empty segment_label and runs
  // assertNoDeniedFields() on the projected output.
  return toPublicDto(source);
}
