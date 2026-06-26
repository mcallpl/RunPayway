import type {
  CPCClass,
  CPCResult,
  CPCNormalizedInputs
} from "./formula";

export interface CommitmentPressureOutput {
  classification: CPCClass;
  label: string;
  measurement: string;
  interpretation: string;
  primary_drivers: string[];
  implications: string[];
  model_version: "cpc_v1_baseline";
  threshold_version: "cpc_thresholds_v1";
  _internal: {
    cpi_internal: number;
    normalized_inputs: CPCNormalizedInputs;
    threshold_trace: CPCResult["threshold_trace"];
  };
}

function getLabelForClass(classification: CPCClass): string {
  const labels: Record<CPCClass, string> = {
    CPL: "Low Pressure",
    CPM: "Moderate Pressure",
    CPE: "Elevated Pressure",
    CPH: "High Pressure",
    CPC: "Critical Pressure",
  };
  return labels[classification];
}

function getMeasurementString(classification: CPCClass, label: string): string {
  return `Commitment Pressure Classification: ${label} (${classification})`;
}

function getInterpretationForClass(classification: CPCClass): string {
  const interpretations: Record<CPCClass, string> = {
    CPL: "The classification reflects low reliance on the support structure sustaining the commitment.",
    CPM: "The classification reflects moderate reliance on the support structure sustaining the commitment.",
    CPE: "The classification reflects elevated reliance on the support structure sustaining the commitment.",
    CPH: "The classification reflects high reliance on the support structure sustaining the commitment.",
    CPC: "The classification reflects critical reliance on the support structure sustaining the commitment.",
  };
  return interpretations[classification];
}

function getLevelLabel(value: number): string {
  if (value >= 0.8) return "Highest";
  if (value >= 0.6) return "High";
  if (value >= 0.4) return "Elevated";
  if (value >= 0.2) return "Moderate";
  return "Lower";
}

function getDimensionName(name: string): string {
  const names: Record<string, string> = {
    fragility: "fragility",
    constraints: "constraint",
    concentration: "concentration",
    amplification: "amplification",
  };
  return names[name] || name;
}

function getPrimaryDrivers(normalized: CPCNormalizedInputs): string[] {
  interface Dimension {
    value: number;
    name: string;
    order: number;
  }

  const dimensions: Dimension[] = [
    { value: normalized.fragility_norm, name: "fragility", order: 0 },
    { value: normalized.constraints_norm, name: "constraints", order: 1 },
    { value: normalized.concentration_norm, name: "concentration", order: 2 },
    { value: normalized.amplification_norm, name: "amplification", order: 3 },
  ];

  dimensions.sort((a, b) => {
    if (Math.abs(b.value - a.value) > 0.001) {
      return b.value - a.value;
    }
    return a.order - b.order;
  });

  let driverCount = 2;

  if (dimensions.length >= 3) {
    const secondValue = dimensions[1].value;
    const thirdValue = dimensions[2].value;
    const difference = Math.abs(secondValue - thirdValue);

    if (difference <= 0.15 && thirdValue >= 0.15) {
      driverCount = 3;
    }
  }

  const drivers: string[] = [];
  for (let i = 0; i < driverCount && i < dimensions.length; i++) {
    const dim = dimensions[i];
    const label = getLevelLabel(dim.value);
    const dimensionName = getDimensionName(dim.name);
    drivers.push(`${label} ${dimensionName} contribution`);
  }

  return drivers;
}

function getImplicationsForClass(classification: CPCClass): string[] {
  const implications: Record<CPCClass, string[]> = {
    CPL: [
      "The commitment is less dependent on any single supporting condition.",
      "Changes in one supporting condition have lower influence on the classification.",
    ],
    CPM: [
      "The commitment depends on multiple supporting conditions continuing within expected bounds.",
      "Changes in supporting conditions can increase reliance if more than one dimension shifts.",
    ],
    CPE: [
      "The commitment relies more heavily on the current support structure.",
      "The classification reflects greater exposure to changes across multiple structural conditions.",
    ],
    CPH: [
      "The commitment depends heavily on continued support from structural conditions.",
      "The classification reflects limited absorption capacity if multiple supporting conditions change.",
    ],
    CPC: [
      "The commitment is highly dependent on continued support from structural conditions.",
      "The classification reflects the highest pressure range under the v1 threshold model.",
    ],
  };
  return implications[classification];
}

export function generateCommitmentPressureOutput(
  cpcResult: CPCResult
): CommitmentPressureOutput {
  const label = getLabelForClass(cpcResult.classification);
  const measurement = getMeasurementString(cpcResult.classification, label);
  const interpretation = getInterpretationForClass(cpcResult.classification);
  const primary_drivers = getPrimaryDrivers(cpcResult.normalized_inputs);
  const implications = getImplicationsForClass(cpcResult.classification);

  return {
    classification: cpcResult.classification,
    label,
    measurement,
    interpretation,
    primary_drivers,
    implications,
    model_version: "cpc_v1_baseline",
    threshold_version: "cpc_thresholds_v1",
    _internal: {
      cpi_internal: cpcResult.cpi_internal,
      normalized_inputs: cpcResult.normalized_inputs,
      threshold_trace: cpcResult.threshold_trace,
    },
  };
}
