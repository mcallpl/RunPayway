// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Family Resolution Engine (OL-1.0)
// Resolves income model to family and returns full profile
// ═══════════════════════════════════════════════════════════════

import type { IncomeModelFamily, IncomeModelFamilyId } from "../types";
import { resolveFamily } from "../data/income-model-families";
import { FAMILY_PROFILES } from "../data/family-profiles";

export interface FamilyResolutionResult {
  family_id: IncomeModelFamilyId;
  family_label: string;
  profile: IncomeModelFamily;
}

/**
 * Resolve a primary income model string to its full family profile.
 * Pure function — deterministic lookup.
 */
export function resolveFamilyProfile(primaryIncomeModel: string): FamilyResolutionResult {
  const familyId = resolveFamily(primaryIncomeModel);
  const profile = FAMILY_PROFILES[familyId];

  return {
    family_id: familyId,
    family_label: profile.family_label,
    profile,
  };
}
