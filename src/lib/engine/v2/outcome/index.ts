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
} from "./types";
import type { AssessmentRecord } from "../types";

import { normalizeIntakeSignals } from "./engines/intake-signals";
import { resolveFamilyProfile } from "./engines/family-resolution";
import { selectScenarios } from "./engines/scenario-selection";
import { INDUSTRY_PROFILES } from "./data/industry-profiles";
import { resolveIndustryProfileId } from "./data/industry-sector-map";
import {
  mergeActions,
  mergeTriggers,
  mergeExplanations,
  mergeStrongerPatterns,
  applyScenarioEmphasis,
} from "./engines/override-merge";

/**
 * Execute the full outcome layer pipeline.
 * Layer 2 (family) + Layer 3 (industry) merged deterministically.
 */
export function executeOutcomeLayer(
  coreRecord: AssessmentRecord,
  rawIntakeFields?: RawIntakeFields | null,
): OutcomeLayerResult {
  // ── Layer 2: Family Resolution ────────────────────────

  const signals: IntakeSignals = normalizeIntakeSignals(rawIntakeFields);

  const familyResult = resolveFamilyProfile(
    coreRecord.profile_context.primary_income_model,
  );
  const family = familyResult.profile;

  const industrySector = coreRecord.profile_context.industry_sector;

  // Select base scenarios from family + industry
  let selectedScenarios = selectScenarios(
    family.family_id,
    industrySector,
    signals,
    coreRecord.fragility.fragility_class,
  );

  // Start with family defaults
  let strongerPatterns = family.stronger_structure_signals;
  let actions = family.default_action_priorities;
  let avoidActions = family.default_avoid_priorities;
  let triggers = family.reassessment_trigger_templates;
  let explanations = family.explanation_translation_map;
  let benchmarkContext: { framing_text: string; peer_group_label: string } | null = null;
  let industryProfile: { industry_id: string; industry_label: string } | null = null;

  // ── Layer 3: Industry Refinement ──────────────────────

  const industryProfileId = resolveIndustryProfileId(industrySector);
  const industry = industryProfileId ? (INDUSTRY_PROFILES[industryProfileId] ?? null) : null;

  if (industry) {
    industryProfile = {
      industry_id: industry.industry_id,
      industry_label: industry.industry_label,
    };

    // Apply scenario emphasis
    if (industry.scenario_emphasis.length > 0) {
      selectedScenarios = applyScenarioEmphasis(
        selectedScenarios,
        industry.scenario_emphasis,
      );
    }

    // Merge stronger-structure patterns
    if (industry.stronger_structure_overrides.length > 0) {
      strongerPatterns = mergeStrongerPatterns(
        family.stronger_structure_signals,
        industry.stronger_structure_overrides,
      );
    }

    // Merge actions (industry overrides take priority positions)
    if (industry.action_priority_overrides.length > 0) {
      actions = mergeActions(
        family.default_action_priorities,
        industry.action_priority_overrides,
      );
    }

    // Merge triggers (additive)
    if (industry.reassessment_trigger_overrides.length > 0) {
      triggers = mergeTriggers(
        family.reassessment_trigger_templates,
        industry.reassessment_trigger_overrides,
      );
    }

    // Merge explanations (industry replaces family for matching keys)
    if (Object.keys(industry.explanation_language_overrides).length > 0) {
      explanations = mergeExplanations(
        family.explanation_translation_map,
        industry.explanation_language_overrides,
      );
    }

    // Benchmark framing
    benchmarkContext = industry.benchmark_framing;
  }

  // ── Assemble Result ───────────────────────────────────

  const rankedActions = actions.map((a, i) => ({
    rank: i + 1,
    action_id: a.action_id,
    label: a.label,
    description: a.description,
    why_now: a.why_now ?? "",
    expected_effect: a.expected_effect ?? "",
  }));

  return {
    income_model_family: {
      family_id: family.family_id,
      family_label: family.family_label,
    },
    industry_refinement_profile: industryProfile,
    selected_scenarios: selectedScenarios,
    stronger_structure_patterns: strongerPatterns.slice(0, 5),
    ranked_action_map: rankedActions,
    avoid_actions: avoidActions,
    reassessment_trigger_set: triggers,
    explanation_translation_layer: explanations,
    benchmark_context_layer: benchmarkContext,
  };
}

// Re-exports
export type { OutcomeLayerResult, RawIntakeFields, IntakeSignals } from "./types";
