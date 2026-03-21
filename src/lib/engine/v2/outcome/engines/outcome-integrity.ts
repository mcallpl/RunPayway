// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Outcome Layer Integrity (OL-1.0 Phase 3)
// Versioned manifest for the outcome layer
// ═══════════════════════════════════════════════════════════════

export const OUTCOME_LAYER_VERSION = "OL-1.0" as const;
export const FAMILY_REGISTRY_VERSION = "FR-1.0" as const;
export const SCENARIO_REGISTRY_VERSION = "SR-1.0" as const;
export const INDUSTRY_REGISTRY_VERSION = "IR-1.0" as const;
export const BENCHMARK_REGISTRY_VERSION = "BR-1.0" as const;

export interface OutcomeManifest {
  outcome_layer_version: string;
  family_registry_version: string;
  scenario_registry_version: string;
  industry_registry_version: string;
  benchmark_registry_version: string;
}

export function getOutcomeManifest(): OutcomeManifest {
  return {
    outcome_layer_version: OUTCOME_LAYER_VERSION,
    family_registry_version: FAMILY_REGISTRY_VERSION,
    scenario_registry_version: SCENARIO_REGISTRY_VERSION,
    industry_registry_version: INDUSTRY_REGISTRY_VERSION,
    benchmark_registry_version: BENCHMARK_REGISTRY_VERSION,
  };
}
