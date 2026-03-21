// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Outcome Layer Orchestrator (OL-1.0)
// Layer 2: Income-Model Outcomes | Layer 3: Industry Refinement
//
// This orchestrator runs AFTER Layer 1 (core scoring).
// It NEVER modifies Layer 1 outputs.
// It produces additional deterministic outcome fields.
// ═══════════════════════════════════════════════════════════════

import type {
  RawIntakeFields,
  IntakeSignals,
  OutcomeLayerResult,
  IncomeModelFamilyId,
} from "./types";
import type { AssessmentRecord } from "../types";

import { normalizeIntakeSignals } from "./engines/intake-signals";
import { resolveFamilyProfile } from "./engines/family-resolution";
import { selectScenarios } from "./engines/scenario-selection";

/**
 * Execute the full outcome layer pipeline.
 *
 * @param coreRecord - The Layer 1 assessment record (read-only)
 * @param rawIntakeFields - Optional new intake fields (4 fields)
 * @returns OutcomeLayerResult - Additional deterministic outcome fields
 */
export function executeOutcomeLayer(
  coreRecord: AssessmentRecord,
  rawIntakeFields?: RawIntakeFields | null,
): OutcomeLayerResult {
  // 1. Normalize intake signals
  const signals: IntakeSignals = normalizeIntakeSignals(rawIntakeFields);

  // 2. Resolve family
  const familyResult = resolveFamilyProfile(
    coreRecord.profile_context.primary_income_model,
  );
  const family = familyResult.profile;

  // 3. Resolve industry
  const industrySector = coreRecord.profile_context.industry_sector;

  // 4. Select scenarios (top 4)
  const selectedScenarios = selectScenarios(
    family.family_id,
    industrySector,
    signals,
    coreRecord.fragility.fragility_class,
  );

  // 5. Stronger structure patterns (family defaults for now — Phase 2 adds industry overrides)
  const strongerPatterns = family.stronger_structure_signals.slice(0, 5);

  // 6. Action map (family defaults for now — Phase 2 adds industry re-ranking)
  const rankedActions = family.default_action_priorities.map((a, i) => ({
    rank: i + 1,
    action_id: a.action_id,
    label: a.label,
    description: a.description,
    why_now: a.why_now ?? "",
    expected_effect: a.expected_effect ?? "",
  }));

  // 7. Avoid actions
  const avoidActions = family.default_avoid_priorities;

  // 8. Reassessment triggers (family defaults for now)
  const triggers = family.reassessment_trigger_templates;

  // 9. Explanation translations (family defaults for now)
  const explanations = family.explanation_translation_map;

  // 10. Benchmark context (Phase 2 adds industry framing)
  const benchmarkContext = null;

  return {
    income_model_family: {
      family_id: family.family_id,
      family_label: family.family_label,
    },
    industry_refinement_profile: null, // Phase 2
    selected_scenarios: selectedScenarios,
    stronger_structure_patterns: strongerPatterns,
    ranked_action_map: rankedActions,
    avoid_actions: avoidActions,
    reassessment_trigger_set: triggers,
    explanation_translation_layer: explanations,
    benchmark_context_layer: benchmarkContext,
  };
}

// Re-exports
export type { OutcomeLayerResult, RawIntakeFields, IntakeSignals } from "./types";
