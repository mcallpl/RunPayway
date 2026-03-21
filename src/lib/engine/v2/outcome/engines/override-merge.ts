// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Override Merge Engine (OL-1.0 Phase 2)
// Merges industry overrides onto family defaults
// ═══════════════════════════════════════════════════════════════

import type {
  IncomeModelFamily,
  IndustryProfile,
  ActionItem,
  TriggerTemplate,
  SelectedScenario,
} from "../types";

/**
 * Merge industry action overrides onto family defaults.
 * Industry actions replace family actions at the top of the list.
 * Remaining family actions fill in below.
 */
export function mergeActions(
  familyActions: ActionItem[],
  industryOverrides: ActionItem[],
  maxActions: number = 4,
): ActionItem[] {
  if (industryOverrides.length === 0) return familyActions.slice(0, maxActions);

  // Industry overrides take priority positions
  const merged: ActionItem[] = [...industryOverrides];

  // Fill remaining slots with family actions that aren't duplicates
  const usedIds = new Set(industryOverrides.map((a) => a.action_id));
  for (const action of familyActions) {
    if (merged.length >= maxActions) break;
    if (!usedIds.has(action.action_id)) {
      merged.push(action);
    }
  }

  return merged.slice(0, maxActions);
}

/**
 * Merge industry triggers onto family triggers.
 * Industry triggers are ADDED (not replaced).
 * Deduplication by trigger_id.
 */
export function mergeTriggers(
  familyTriggers: TriggerTemplate[],
  industryOverrides: TriggerTemplate[],
): TriggerTemplate[] {
  const usedIds = new Set(familyTriggers.map((t) => t.trigger_id));
  const merged = [...familyTriggers];

  for (const trigger of industryOverrides) {
    if (!usedIds.has(trigger.trigger_id)) {
      merged.push(trigger);
      usedIds.add(trigger.trigger_id);
    }
  }

  return merged;
}

/**
 * Merge industry explanation overrides onto family explanations.
 * Industry text REPLACES family text for matching reason codes.
 */
export function mergeExplanations(
  familyExplanations: Record<string, string>,
  industryOverrides: Record<string, string>,
): Record<string, string> {
  return { ...familyExplanations, ...industryOverrides };
}

/**
 * Merge industry stronger-structure overrides onto family signals.
 * Industry patterns appear first, family patterns fill remaining.
 */
export function mergeStrongerPatterns(
  familyPatterns: string[],
  industryOverrides: string[],
  maxPatterns: number = 5,
): string[] {
  if (industryOverrides.length === 0) return familyPatterns.slice(0, maxPatterns);

  const merged = [...industryOverrides];
  const usedSet = new Set(industryOverrides.map((p) => p.toLowerCase()));

  for (const pattern of familyPatterns) {
    if (merged.length >= maxPatterns) break;
    if (!usedSet.has(pattern.toLowerCase())) {
      merged.push(pattern);
    }
  }

  return merged.slice(0, maxPatterns);
}

/**
 * Boost scenario relevance for industry-emphasized scenarios.
 * Returns reordered scenarios with industry-emphasized ones moved up.
 */
export function applyScenarioEmphasis(
  scenarios: SelectedScenario[],
  emphasisIds: string[],
): SelectedScenario[] {
  if (emphasisIds.length === 0) return scenarios;

  const emphasisSet = new Set(emphasisIds);
  // Sort: emphasized first (in emphasis order), then non-emphasized
  const emphasized: SelectedScenario[] = [];
  for (const id of emphasisIds) {
    const found = scenarios.find((s) => s.scenario_id === id);
    if (found) emphasized.push(found);
  }
  const nonEmphasized = scenarios.filter((s) => !emphasisSet.has(s.scenario_id));

  return [...emphasized, ...nonEmphasized];
}
