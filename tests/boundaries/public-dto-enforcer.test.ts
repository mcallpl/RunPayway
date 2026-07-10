/**
 * Public DTO Enforcement Boundary Tests — Segment B1a / B2a
 *
 * Verifies the runtime enforcement foundation for the locked seven-field
 * public DTO:
 *   - toPublicDto() projects only the seven allowlisted fields
 *   - assertNoDeniedFields() fails closed on prohibited fields
 *   - stripDeniedFields() subtractively removes prohibited fields
 *   - classification is constrained to Stable | Volatile | Moderate
 *
 * Also statically verifies that /api/verify-public no longer emits prohibited
 * fields or retired Income Stability model language (B2a leakage removal).
 *
 * Reference: Step 9H DTO Contract (CLOSED AND LOCKED).
 */

import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import {
  toPublicDto,
  assertNoDeniedFields,
  stripDeniedFields,
  isDeniedKey,
  isPublicClassification,
  classificationFromPrimaryBand,
  isTruthfulSegmentSize,
  type PublicDtoSource,
} from "../../src/contracts/public-dto/public-dto-enforcer";

const validSource: PublicDtoSource = {
  assessment_id: "a1b2c3d4-e5f6-4789-abcd-ef0123456789",
  assessment_date: "2026-07-02",
  classification: "Stable",
  primary_drivers: ["Recurring revenue base", "Diversified income sources"],
  interpretation: "Income structure shows durable, recurring characteristics.",
  compared_with: { segment_label: "Independent consultants", size: 1200 },
};

describe("Public DTO Enforcement — toPublicDto", () => {
  test("projects exactly the seven locked fields", () => {
    const dto = toPublicDto(validSource);
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
    expect(Object.keys(dto.compared_with).sort()).toEqual(
      ["segment_label", "size"].sort(),
    );
  });

  test("drops any extra/prohibited fields present on the source", () => {
    const dirty = {
      ...validSource,
      final_score: 87,
      stability_band: "High",
      record_id: "raw-db-id",
      _v2: { reason_codes: ["X"] },
    } as unknown as PublicDtoSource;

    const dto = toPublicDto(dirty);
    expect(dto).not.toHaveProperty("final_score");
    expect(dto).not.toHaveProperty("stability_band");
    expect(dto).not.toHaveProperty("record_id");
    expect(dto).not.toHaveProperty("_v2");
  });

  test("rejects a classification outside the locked value set", () => {
    const bad = { ...validSource, classification: "High" } as unknown as PublicDtoSource;
    expect(() => toPublicDto(bad)).toThrow();
  });

  test("accepts each locked classification value", () => {
    for (const value of ["Stable", "Volatile", "Moderate"] as const) {
      expect(() => toPublicDto({ ...validSource, classification: value })).not.toThrow();
    }
  });

  test("normalizes a missing primary_drivers to an empty array", () => {
    const src = { ...validSource, primary_drivers: undefined } as unknown as PublicDtoSource;
    const dto = toPublicDto(src);
    expect(Array.isArray(dto.primary_drivers)).toBe(true);
    expect(dto.primary_drivers).toEqual([]);
  });
});

describe("Step 9H revision — compared_with.size optional / deferred", () => {
  // Source without any `size` (the truthful default until a cohort source exists)
  const sourceNoSize: PublicDtoSource = {
    assessment_id: "a1b2c3d4-e5f6-4789-abcd-ef0123456789",
    assessment_date: "2026-07-02",
    classification: "Moderate",
    primary_drivers: [],
    interpretation: "Income structure is moderately durable.",
    compared_with: { segment_label: "Independent consultants" },
  };

  test("DTO without compared_with.size passes and omits the field entirely", () => {
    const dto = toPublicDto(sourceNoSize);
    expect(dto.compared_with).toEqual({ segment_label: "Independent consultants" });
    expect(dto.compared_with).not.toHaveProperty("size");
    expect(Object.keys(dto.compared_with)).toEqual(["segment_label"]);
  });

  test("compared_with.segment_label remains required (missing → throws)", () => {
    const bad = {
      ...sourceNoSize,
      compared_with: {} as unknown as PublicDtoSource["compared_with"],
    };
    expect(() => toPublicDto(bad)).toThrow();
  });

  test("empty-string segment_label fails closed", () => {
    const bad = { ...sourceNoSize, compared_with: { segment_label: "" } };
    expect(() => toPublicDto(bad)).toThrow();
  });

  test("valid positive-integer size passes when supplied", () => {
    const dto = toPublicDto({
      ...sourceNoSize,
      compared_with: { segment_label: "Independent consultants", size: 1200 },
    });
    expect(dto.compared_with.size).toBe(1200);
  });

  test.each([
    ["null", null],
    ["zero", 0],
    ["negative", -5],
    ["decimal", 12.5],
    ["numeric string", "1200"],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["placeholder object", { toString: () => "1200" }],
    ["boolean", true],
  ])("present-but-invalid size fails closed: %s", (_label, size) => {
    const bad = {
      ...sourceNoSize,
      compared_with: {
        segment_label: "Independent consultants",
        size: size as unknown as number,
      },
    };
    expect(() => toPublicDto(bad)).toThrow();
  });

  test("isTruthfulSegmentSize accepts only positive integers", () => {
    expect(isTruthfulSegmentSize(1)).toBe(true);
    expect(isTruthfulSegmentSize(1200)).toBe(true);
    expect(isTruthfulSegmentSize(0)).toBe(false);
    expect(isTruthfulSegmentSize(-1)).toBe(false);
    expect(isTruthfulSegmentSize(12.5)).toBe(false);
    expect(isTruthfulSegmentSize(Number.NaN)).toBe(false);
    expect(isTruthfulSegmentSize("1200")).toBe(false);
    expect(isTruthfulSegmentSize(null)).toBe(false);
    expect(isTruthfulSegmentSize(undefined)).toBe(false);
  });

  test("a size-less DTO still passes the denied-field guard", () => {
    expect(() => assertNoDeniedFields(toPublicDto(sourceNoSize))).not.toThrow();
  });
});

describe("Public DTO Enforcement — assertNoDeniedFields", () => {
  test("passes for a clean seven-field DTO", () => {
    expect(() => assertNoDeniedFields(toPublicDto(validSource))).not.toThrow();
  });

  test.each([
    ["final_score", { final_score: 87 }],
    ["stability_band", { stability_band: "High" }],
    ["model_version", { model_version: "RP-2.0" }],
    ["record_id", { record_id: "x" }],
    ["reason_codes", { reason_codes: ["A"] }],
    ["integrity", { integrity: { record_hash: "h" } }],
    ["_v2", { _v2: { scores: {} } }],
    ["percentile", { percentile: 90 }],
    ["typical_range", { typical_range: [1, 2] }],
    ["nested denied field", { compared_with: { segment_label: "x", size: 1, audit_trail: [] } }],
  ])("throws on prohibited field: %s", (_label, payload) => {
    expect(() => assertNoDeniedFields(payload)).toThrow();
  });

  test("throws when a CPC token appears inside a string value", () => {
    expect(() =>
      assertNoDeniedFields({ interpretation: "internal CPC note" }),
    ).toThrow();
  });

  test("does not false-positive on allowlisted keys containing denied word segments", () => {
    // assessment_id contains the segment "id" which is a denied token in
    // isolation; it must NOT be flagged because it is allowlisted.
    expect(isDeniedKey("assessment_id")).toBe(false);
    expect(isDeniedKey("record_id")).toBe(true);
  });
});

describe("Public DTO Enforcement — stripDeniedFields", () => {
  test("removes denied fields while preserving allowed ones", () => {
    const input = {
      valid_record: true,
      assessment_date: "2026-07-02",
      final_score: 87,
      stability_band: "High",
      record_id: "raw",
      nested: { keep: 1, reason_codes: ["A"] },
    };
    const cleaned = stripDeniedFields(input) as Record<string, unknown>;
    expect(cleaned).toHaveProperty("valid_record", true);
    expect(cleaned).toHaveProperty("assessment_date", "2026-07-02");
    expect(cleaned).not.toHaveProperty("final_score");
    expect(cleaned).not.toHaveProperty("stability_band");
    expect(cleaned).not.toHaveProperty("record_id");
    expect((cleaned.nested as Record<string, unknown>)).toEqual({ keep: 1 });
  });
});

describe("Public DTO Enforcement — classification guard", () => {
  test("isPublicClassification accepts only the locked values", () => {
    expect(isPublicClassification("Stable")).toBe(true);
    expect(isPublicClassification("Volatile")).toBe(true);
    expect(isPublicClassification("Moderate")).toBe(true);
    expect(isPublicClassification("High")).toBe(false);
    expect(isPublicClassification("stable")).toBe(false);
    expect(isPublicClassification(42)).toBe(false);
  });
});

describe("B1b — internal-band → public classification mapping", () => {
  test.each([
    ["High Stability", "Stable"],
    ["Established Stability", "Moderate"],
    ["Developing Stability", "Moderate"],
    ["Limited Stability", "Volatile"],
  ])("maps %s → %s (locked table)", (band, expected) => {
    expect(classificationFromPrimaryBand(band)).toBe(expected);
  });

  test("every mapped output is a valid locked public classification", () => {
    for (const band of [
      "High Stability",
      "Established Stability",
      "Developing Stability",
      "Limited Stability",
    ]) {
      expect(isPublicClassification(classificationFromPrimaryBand(band))).toBe(true);
    }
  });

  test.each([
    ["unknown band label", "Extreme Stability"],
    ["empty string", ""],
    ["sub_band composite (must not be accepted)", "High Stability / Fragility Warning"],
    ["numeric-as-string (score must not be used)", "87"],
    ["public value fed back in (not an internal band)", "Stable"],
    ["cpc-ish token", "CPC"],
  ])("fails closed on %s", (_label, value) => {
    expect(() => classificationFromPrimaryBand(value)).toThrow();
  });

  test("mapping does not consult sub_band, warning_overlays, or score", () => {
    // Only the primary_band string is an accepted input; a composite sub_band
    // string or any overlay/score-derived string throws, proving those inputs
    // cannot leak into the public classification.
    expect(() =>
      classificationFromPrimaryBand("Established Stability / Concentration Risk"),
    ).toThrow();
  });

  test("mapping source (enforcer) never derives classification from numeric score or CPC", () => {
    const source = readFileSync(
      join(__dirname, "../../src/contracts/public-dto/public-dto-enforcer.ts"),
      "utf-8",
    );
    const mappingRegion = source.slice(
      source.indexOf("const PRIMARY_BAND_TO_PUBLIC_CLASSIFICATION"),
      source.indexOf("export interface PublicComparedWith"),
    );
    // Strip comments so documentation ("...score/CPC are never used") does not
    // trip the guard — we assert on executable code only.
    const codeOnly = mappingRegion
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    // The mapping is a pure lookup: no numeric threshold comparison operators,
    // no `score` reference, no threshold table, and no CPC term in the code.
    expect(codeOnly).not.toMatch(/[<>]=/); // no >=, <= threshold logic
    expect(codeOnly).not.toMatch(/BAND_THRESHOLDS/);
    expect(codeOnly).not.toMatch(/\bscore\b/i);
    expect(codeOnly).not.toMatch(/\bcpc\b/i);
  });
});

describe("B2a — /api/verify-public leakage removal (static source guard)", () => {
  const source = readFileSync(
    join(__dirname, "../../src/app/api/verify-public/route.ts"),
    "utf-8",
  );
  // Only inspect the success response region (after the record is verified),
  // so documenting comments elsewhere never trip the guard.
  const successRegion = source.slice(source.indexOf("valid_record: true"));

  test.each([
    "record_id:",
    "model_version:",
    "final_score:",
    "stability_band:",
    "issued_timestamp:",
  ])("success response no longer emits %s", (field) => {
    expect(successRegion).not.toContain(field);
  });

  test("no longer emits retired Income Stability Assessment language", () => {
    expect(source).not.toContain("Income Stability Assessment");
  });

  test("applies the runtime denied-field guard before responding", () => {
    expect(source).toContain("assertNoDeniedFields");
  });
});
