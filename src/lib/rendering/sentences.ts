import type { Band } from "@/lib/engine/types";

const POSITION_SENTENCE_1: Record<Band, string> = {
  Foundation: "Current income structure reflects material instability.",
  Developing: "Current income structure reflects developing stability.",
  Strong: "Current income structure reflects measurable structural strength.",
  Elite: "Current income structure reflects high structural resilience.",
};

const EXPOSURE_SENTENCE_2: Record<string, string> = {
  "Stability Base": "Primary structural exposure concentrated within income stability.",
  "Revenue Diversity": "Primary structural exposure concentrated within revenue diversification.",
  "System Independence": "Primary structural exposure concentrated within system independence.",
};

const INDEPENDENCE_SENTENCE_3: Record<string, string> = {
  Severe: "System independence reflects high labor dependency with minimal passive continuity.",
  Elevated: "System independence reflects significant labor dependency with limited continuity mechanisms.",
  Moderate: "System independence reflects partial continuity with remaining labor dependency.",
  Low: "System independence reflects strong continuity with limited labor dependency.",
};

export function getPositionSentence1(band: Band): string {
  return POSITION_SENTENCE_1[band];
}

export function getPositionSentence2(
  stabilityInternal: number,
  diversityInternal: number,
  independenceInternal: number
): string {
  const pillars = [
    { name: "Stability Base", value: stabilityInternal },
    { name: "Revenue Diversity", value: diversityInternal },
    { name: "System Independence", value: independenceInternal },
  ];
  pillars.sort((a, b) => a.value - b.value);
  return EXPOSURE_SENTENCE_2[pillars[0].name];
}

export function getPositionSentence3(independenceInternal: number): string {
  if (independenceInternal <= 49) return INDEPENDENCE_SENTENCE_3["Severe"];
  if (independenceInternal <= 64) return INDEPENDENCE_SENTENCE_3["Elevated"];
  if (independenceInternal <= 79) return INDEPENDENCE_SENTENCE_3["Moderate"];
  return INDEPENDENCE_SENTENCE_3["Low"];
}

export function getExposureTier(value: number): string {
  if (value <= 49) return "Severe";
  if (value <= 64) return "Elevated";
  if (value <= 79) return "Moderate";
  return "Low";
}

const PILLAR_BULLETS: Record<string, Record<string, string[]>> = {
  "Stability Base": {
    Severe: [
      "Recurring revenue base insufficient to absorb disruption.",
      "Forward visibility limited to near-term horizon.",
      "Earnings variability indicates structural instability.",
    ],
    Elevated: [
      "Recurring revenue base provides partial coverage.",
      "Forward visibility extends to short-term commitments.",
      "Earnings variability remains above structural threshold.",
    ],
    Moderate: [
      "Recurring revenue base provides meaningful coverage.",
      "Forward visibility extends to medium-term commitments.",
      "Earnings variability within manageable range.",
    ],
    Low: [
      "Recurring revenue base provides substantial structural coverage.",
      "Forward visibility extends beyond six-month horizon.",
      "Earnings variability minimal relative to base.",
    ],
  },
  "Revenue Diversity": {
    Severe: [
      "Income concentration creates single-point-of-failure risk.",
      "Source count insufficient for structural diversification.",
    ],
    Elevated: [
      "Income concentration above optimal threshold.",
      "Source diversification partially established.",
    ],
    Moderate: [
      "Income concentration within manageable range.",
      "Source diversification provides partial structural coverage.",
    ],
    Low: [
      "Income distribution reflects structural diversification.",
      "Source count supports revenue continuity under disruption.",
    ],
  },
  "System Independence": {
    Severe: [
      "Income cessation upon labor interruption indicates full dependency.",
      "Client re-engagement requires direct acquisition effort.",
    ],
    Elevated: [
      "Limited income continuity without active labor.",
      "Client retention partially dependent on direct effort.",
    ],
    Moderate: [
      "Partial income continuity established without active labor.",
      "Returning client base partially self-sustaining.",
    ],
    Low: [
      "Significant income continuity without active labor.",
      "Returning client base structurally self-sustaining.",
    ],
  },
};

export function getPillarBullets(pillarName: string, internalValue: number): string[] {
  const tier = getExposureTier(internalValue);
  return PILLAR_BULLETS[pillarName]?.[tier] ?? [];
}
