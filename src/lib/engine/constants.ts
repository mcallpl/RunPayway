export const MODEL = "RP-1.0" as const;
export const VERSION = "1.0" as const;

export const RESPONSE_VALUES = [0, 25, 50, 75, 100] as const;

export const QUESTION_WEIGHTS = [
  0.1333333333, // Q1 - Stability Base
  0.15,         // Q2 - Revenue Diversity
  0.15,         // Q3 - Revenue Diversity
  0.1333333333, // Q4 - Stability Base
  0.1333333333, // Q5 - Stability Base
  0.15,         // Q6 - System Independence
  0.15,         // Q7 - System Independence
] as const;

export const PILLAR_WEIGHTS = {
  stability: 0.40,
  diversity: 0.30,
  independence: 0.30,
} as const;

export const BAND_THRESHOLDS = [
  { min: 0, max: 49, band: "Foundation" },
  { min: 50, max: 69, band: "Developing" },
  { min: 70, max: 87, band: "Strong" },
  { min: 88, max: 100, band: "Elite" },
] as const;

export const EXPOSURE_TIERS = [
  { min: 0, max: 49, tier: "Severe" },
  { min: 50, max: 64, tier: "Elevated" },
  { min: 65, max: 79, tier: "Moderate" },
  { min: 80, max: 100, tier: "Low" },
] as const;
