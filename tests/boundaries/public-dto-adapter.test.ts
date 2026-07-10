/**
 * Public DTO Adapter Boundary Tests — Segment B1f-impl-1
 *
 * Verifies the pure record -> public DTO adapter and its locked maps:
 *   - each internal primary_band maps to the correct public classification
 *   - interpretation matches the locked Entry 15 templates exactly
 *   - allowlisted industry_sector values map to approved public labels
 *   - unknown / missing / `other` sectors fail closed
 *   - primary_drivers is exactly []
 *   - compared_with.size is absent (not null, not 0, not placeholder)
 *   - no denied / internal fields are emitted
 *
 * The adapter has NO HTTP surface and is not wired to any endpoint.
 *
 * Reference: Acceptance Log Entries 12-15.
 */

import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { assertNoDeniedFields } from "../../src/contracts/public-dto/public-dto-enforcer";
import {
  assessmentRecordToPublicDto,
  interpretationForClassification,
  publicSegmentLabelFromSector,
  INTERPRETATION_TEMPLATES,
  PUBLIC_SEGMENT_LABEL_BY_SECTOR,
  type AssessmentRecordPublicView,
} from "../../src/contracts/public-dto/assessment-to-public-dto";

function record(
  primary_band: string,
  industry_sector: string,
): AssessmentRecordPublicView {
  return {
    assessment_id: "a1b2c3d4-e5f6-4789-abcd-ef0123456789",
    created_at: "2026-07-02T00:00:00.000Z",
    bands: { primary_band },
    profile_context: { industry_sector },
  };
}

// The three interpretation strings exactly as locked in Entry 15.
const LOCKED_INTERPRETATIONS = {
  Stable:
    "The measured commitment shows a lower level of dependence on continued support-structure strength. Based on the available inputs, the commitment appears less sensitive to ordinary changes in the supporting income structure.",
  Moderate:
    "The measured commitment shows a moderate level of dependence on continued support-structure strength. Based on the available inputs, the commitment remains meaningfully connected to the continued stability of the supporting income structure.",
  Volatile:
    "The measured commitment shows a higher level of dependence on continued support-structure strength. Based on the available inputs, the commitment appears more sensitive to changes in the supporting income structure.",
} as const;

describe("B1f adapter — primary_band -> public classification", () => {
  test.each([
    ["High Stability", "Stable"],
    ["Established Stability", "Moderate"],
    ["Developing Stability", "Moderate"],
    ["Limited Stability", "Volatile"],
  ])("%s -> %s", (band, expected) => {
    const dto = assessmentRecordToPublicDto(record(band, "technology"));
    expect(dto.classification).toBe(expected);
  });

  test("unknown primary_band fails closed", () => {
    expect(() =>
      assessmentRecordToPublicDto(record("Extreme Stability", "technology")),
    ).toThrow();
  });
});

describe("B1f adapter — interpretation matches locked Entry 15 templates", () => {
  test.each(["Stable", "Moderate", "Volatile"] as const)(
    "%s interpretation is verbatim",
    (classification) => {
      expect(interpretationForClassification(classification)).toBe(
        LOCKED_INTERPRETATIONS[classification],
      );
      expect(INTERPRETATION_TEMPLATES[classification]).toBe(
        LOCKED_INTERPRETATIONS[classification],
      );
    },
  );

  test.each([
    ["High Stability", "Stable"],
    ["Established Stability", "Moderate"],
    ["Limited Stability", "Volatile"],
  ])("adapter emits the locked interpretation for %s", (band, cls) => {
    const dto = assessmentRecordToPublicDto(record(band, "healthcare"));
    expect(dto.interpretation).toBe(
      LOCKED_INTERPRETATIONS[cls as keyof typeof LOCKED_INTERPRETATIONS],
    );
  });

  test("no interpretation template contains an em dash or a numeric score", () => {
    for (const value of Object.values(INTERPRETATION_TEMPLATES)) {
      expect(value).not.toMatch(/—/); // em dash
      expect(value).not.toMatch(/\d/); // no digits / numeric score
    }
  });
});

describe("B1f adapter — segment_label from locked allowlisted sector map", () => {
  test("all 18 named sectors resolve to an approved non-empty label", () => {
    const named = [
      "real_estate",
      "finance_banking",
      "insurance",
      "technology",
      "healthcare",
      "legal_services",
      "consulting_professional_services",
      "sales_brokerage",
      "media_entertainment",
      "construction_trades",
      "retail_ecommerce",
      "hospitality_food_service",
      "transportation_logistics",
      "manufacturing",
      "education",
      "nonprofit_public_sector",
      "agriculture",
      "energy_utilities",
    ];
    for (const sector of named) {
      const label = publicSegmentLabelFromSector(sector);
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
      const dto = assessmentRecordToPublicDto(record("High Stability", sector));
      expect(dto.compared_with.segment_label).toBe(label);
    }
  });

  test("map does not contain an `other` entry", () => {
    expect(PUBLIC_SEGMENT_LABEL_BY_SECTOR).not.toHaveProperty("other");
  });

  test.each([
    ["other", "other"],
    ["unknown sector", "space_mining"],
    ["empty string", ""],
    ["internal-looking value", "cohort_42"],
  ])("segment source fails closed: %s", (_label, sector) => {
    expect(() => publicSegmentLabelFromSector(sector)).toThrow();
    expect(() =>
      assessmentRecordToPublicDto(record("High Stability", sector)),
    ).toThrow();
  });

  test("segment labels contain no em dash, digit, or denied token", () => {
    for (const label of Object.values(PUBLIC_SEGMENT_LABEL_BY_SECTOR)) {
      expect(label).not.toMatch(/—/);
      expect(label).not.toMatch(/\d/);
      expect(label).not.toMatch(/\b(cpc|score|percentile|record_id)\b/i);
    }
  });

  test("sector-only labels: no 'professionals' suffix / personal-status claim", () => {
    for (const label of Object.values(PUBLIC_SEGMENT_LABEL_BY_SECTOR)) {
      expect(label).not.toMatch(/professionals\b/i);
    }
  });
});

describe("B1f adapter — deferred / interim field behavior", () => {
  const dto = assessmentRecordToPublicDto(record("Developing Stability", "manufacturing"));

  test("primary_drivers is exactly an empty array", () => {
    expect(dto.primary_drivers).toEqual([]);
  });

  test("compared_with.size is absent (not null, not 0, not placeholder)", () => {
    expect(dto.compared_with).not.toHaveProperty("size");
    expect(Object.keys(dto.compared_with)).toEqual(["segment_label"]);
  });

  test("compared_with is present with only segment_label", () => {
    expect(dto.compared_with.segment_label).toBe("Manufacturing");
  });
});

describe("B1f adapter — output is public-safe (no denied / internal fields)", () => {
  const dto = assessmentRecordToPublicDto(record("Established Stability", "finance_banking"));

  test("output has exactly the six required top-level keys", () => {
    expect(Object.keys(dto).sort()).toEqual(
      [
        "assessment_id",
        "assessment_date",
        "classification",
        "primary_drivers",
        "interpretation",
        "compared_with",
      ].sort(),
    );
  });

  test("output passes assertNoDeniedFields()", () => {
    expect(() => assertNoDeniedFields(dto)).not.toThrow();
  });

  test.each([
    "final_score",
    "stability_band",
    "model_version",
    "record_id",
    "reason_codes",
    "integrity",
    "_v2",
    "percentile",
    "benchmarks",
    "scores",
  ])("output does not expose %s", (denied) => {
    expect(JSON.stringify(dto)).not.toContain(denied);
  });

  test("output JSON contains no digits outside the id/date fields", () => {
    // classification, interpretation, primary_drivers, segment_label carry no
    // numeric score. Only assessment_id and assessment_date legitimately hold
    // digits, so strip them before asserting no stray numbers leak.
    const { assessment_id, assessment_date, ...rest } = dto as Record<string, unknown>;
    void assessment_id;
    void assessment_date;
    expect(JSON.stringify(rest)).not.toMatch(/\d/);
  });
});

describe("B1f adapter — pure module, no HTTP surface (static guard)", () => {
  const source = readFileSync(
    join(__dirname, "../../src/contracts/public-dto/assessment-to-public-dto.ts"),
    "utf-8",
  );

  test("adapter module defines no route handler and imports no server runtime", () => {
    expect(source).not.toMatch(/next\/server/);
    expect(source).not.toMatch(/export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)/);
    expect(source).not.toMatch(/NextResponse/);
  });

  test("adapter never spreads the record (no `...record`)", () => {
    expect(source).not.toMatch(/\.\.\.record/);
  });
});
