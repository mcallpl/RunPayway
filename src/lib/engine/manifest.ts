// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Manifest Loading & Checksum

import { createHash } from "crypto";
import {
  MODEL_CODE,
  MODEL_DISPLAY_VERSION,
  MODEL_NAME,
  MODEL_ISSUER,
  MANIFEST_ID,
  QUESTION_COUNT,
  ANSWER_OPTION_COUNT,
  ANSWER_MAP,
  STRUCTURE_WEIGHT_PERCENT,
  STABILITY_WEIGHT_PERCENT,
  BAND_THRESHOLDS,
  CONSTRAINT_TIE_BREAK_ORDER,
  DRIVER_TIE_BREAK_ORDER,
  STRUCTURAL_PRIORITY_MAP,
  FIELD_LABELS,
  INTERPRETATION_VERSION,
} from "./constants";
import { CANONICAL_KEYS, STRUCTURE_KEYS, STABILITY_KEYS } from "./types";

export interface ModelManifest {
  manifest_id: string;
  model_name: string;
  model_issuer: string;
  model_code: string;
  model_display_version: string;
  interpretation_version: string;
  question_count: number;
  answer_option_count: number;
  answer_mapping: Record<string, number>;
  canonical_input_order: readonly string[];
  structure_component_fields: readonly string[];
  stability_component_fields: readonly string[];
  weights: {
    structure_weight_percent: number;
    stability_weight_percent: number;
  };
  band_thresholds: { min: number; max: number; band: string }[];
  constraint_tie_break_order: readonly string[];
  driver_tie_break_order: readonly string[];
  structural_priority_mapping: Record<string, string>;
  field_labels: Record<string, string>;
}

function buildManifest(): ModelManifest {
  return {
    manifest_id: MANIFEST_ID,
    model_name: MODEL_NAME,
    model_issuer: MODEL_ISSUER,
    model_code: MODEL_CODE,
    model_display_version: MODEL_DISPLAY_VERSION,
    interpretation_version: INTERPRETATION_VERSION,
    question_count: QUESTION_COUNT,
    answer_option_count: ANSWER_OPTION_COUNT,
    answer_mapping: ANSWER_MAP,
    canonical_input_order: CANONICAL_KEYS,
    structure_component_fields: STRUCTURE_KEYS,
    stability_component_fields: STABILITY_KEYS,
    weights: {
      structure_weight_percent: STRUCTURE_WEIGHT_PERCENT,
      stability_weight_percent: STABILITY_WEIGHT_PERCENT,
    },
    band_thresholds: BAND_THRESHOLDS.map((b) => ({ ...b })),
    constraint_tie_break_order: CONSTRAINT_TIE_BREAK_ORDER,
    driver_tie_break_order: DRIVER_TIE_BREAK_ORDER,
    structural_priority_mapping: { ...STRUCTURAL_PRIORITY_MAP },
    field_labels: { ...FIELD_LABELS },
  };
}

function canonicalizeManifest(manifest: ModelManifest): string {
  return JSON.stringify(manifest, Object.keys(manifest).sort());
}

function deepSortKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(deepSortKeys);
  }
  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      sorted[key] = deepSortKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}

export function computeManifestChecksum(manifest: ModelManifest): string {
  const sorted = deepSortKeys(manifest);
  const canonical = JSON.stringify(sorted);
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

let _manifest: ModelManifest | null = null;
let _checksum: string | null = null;

export function getManifest(): ModelManifest {
  if (!_manifest) {
    _manifest = buildManifest();
    _checksum = computeManifestChecksum(_manifest);
  }
  return _manifest;
}

export function getRulesetChecksum(): string {
  if (!_checksum) {
    getManifest();
  }
  return _checksum!;
}

export function verifyChecksum(expectedChecksum: string): boolean {
  return getRulesetChecksum() === expectedChecksum;
}
