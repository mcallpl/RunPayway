/**
 * Maps revenue model values to common dependency patterns
 * used by the Identity Mirror component.
 *
 * These patterns describe structural dependencies commonly associated
 * with each revenue model. They are interpretive and high-level.
 */
export const DEPENDENCY_PATTERNS: Record<string, string> = {
  TRANSACTIONAL: "per-transaction effort and personal closing capacity",
  COMMISSION: "individual sales activity and pipeline maintenance",
  PROJECT_FIXED: "project acquisition cycles and personal delivery",
  CONTRACT_FIXED: "renewal timing and relationship management",
  RETAINER_SUBSCRIPTION: "renewal cycles and relationship continuity",
  USAGE_BASED: "volume fluctuation and demand variability",
  LICENSING_ROYALTY: "initial creation effort and distribution reach",
  HYBRID: "multiple simultaneous dependency vectors",
  ASSET_LEASE: "asset utilization rates and maintenance requirements",
};

export function getDependencyPattern(revenueModel: string): string {
  return (
    DEPENDENCY_PATTERNS[revenueModel] ??
    "direct involvement patterns that may limit structural continuity"
  );
}
