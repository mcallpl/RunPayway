// Engine 05 — Stability Band Classification
// Assigns primary band, sub-band, and warning overlays.

import type {
  CanonicalInput,
  StabilityBand,
  BandClassification,
  WarningOverlay,
} from "../types";
import { BAND_THRESHOLDS } from "../constants";

export function classifyBand(
  overall_score: number,
  normalized: CanonicalInput,
  fragility_score: number,
): BandClassification {
  let primary_band: StabilityBand = "Limited Stability";
  for (const { min, max, band } of BAND_THRESHOLDS) {
    if (overall_score >= min && overall_score <= max) {
      primary_band = band as StabilityBand;
      break;
    }
  }

  const warning_overlays: WarningOverlay[] = [];

  if (fragility_score <= 25) {
    warning_overlays.push({
      code: "WRN-FRAG",
      label: "Fragility Warning",
      trigger: "fragility_score <= 25",
    });
  }
  if (normalized.largest_source_pct >= 70) {
    warning_overlays.push({
      code: "WRN-CONC",
      label: "Concentration Risk",
      trigger: "largest_source_pct >= 70",
    });
  }
  if (normalized.labor_dependence_pct >= 80) {
    warning_overlays.push({
      code: "WRN-LABOR",
      label: "Labor-Heavy",
      trigger: "labor_dependence_pct >= 80",
    });
  }
  if (normalized.forward_secured_pct <= 10) {
    warning_overlays.push({
      code: "WRN-VIS",
      label: "Thin Visibility",
      trigger: "forward_secured_pct <= 10",
    });
  }

  const sub_band =
    warning_overlays.length > 0
      ? `${primary_band} / ${warning_overlays[0].label}`
      : primary_band;

  return { primary_band, sub_band, warning_overlays };
}

/** Utility: quick band lookup without overlays */
export function getBand(score: number): StabilityBand {
  for (const { min, max, band } of BAND_THRESHOLDS) {
    if (score >= min && score <= max) return band as StabilityBand;
  }
  return "Limited Stability";
}
