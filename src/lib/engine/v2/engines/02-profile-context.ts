// Engine 02 — Profile Context Resolution
// Derives archetype and structural flags from profile context.

import type {
  ProfileContext,
  ResolvedProfile,
  OperatingStructure,
  PrimaryIncomeModel,
} from "../types";

const LABOR_PRIMARY_STRUCTURES: OperatingStructure[] = [
  "solo_service",
  "commissioned_operator",
  "creator_operator",
];

const ASSET_PRIMARY_STRUCTURES: OperatingStructure[] = [
  "portfolio_operator",
  "asset_supported",
];

const RECURRING_MODELS: PrimaryIncomeModel[] = [
  "retainer",
  "subscription",
  "licensing",
  "rental",
];

const PROJECT_MODELS: PrimaryIncomeModel[] = [
  "commission",
  "project_fee",
];

export function resolveProfileContext(profile: ProfileContext): ResolvedProfile {
  const is_labor_primary = LABOR_PRIMARY_STRUCTURES.includes(profile.operating_structure);
  const is_asset_primary = ASSET_PRIMARY_STRUCTURES.includes(profile.operating_structure);
  const is_recurring_model = RECURRING_MODELS.includes(profile.primary_income_model);
  const is_project_model = PROJECT_MODELS.includes(profile.primary_income_model);

  let profile_archetype: string;
  if (is_asset_primary && is_recurring_model) {
    profile_archetype = "asset_recurring";
  } else if (is_asset_primary) {
    profile_archetype = "asset_diversified";
  } else if (is_labor_primary && is_project_model) {
    profile_archetype = "labor_project";
  } else if (is_labor_primary && is_recurring_model) {
    profile_archetype = "labor_transitioning";
  } else if (is_labor_primary) {
    profile_archetype = "labor_active";
  } else if (is_recurring_model) {
    profile_archetype = "hybrid_recurring";
  } else {
    profile_archetype = "hybrid_mixed";
  }

  return {
    ...profile,
    profile_archetype,
    is_labor_primary,
    is_asset_primary,
    is_recurring_model,
    is_project_model,
  };
}
