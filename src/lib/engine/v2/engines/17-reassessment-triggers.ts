// Engine 17 — Reassessment Triggers
// Generates conditions under which reassessment becomes meaningful.

import type {
  CanonicalInput,
  QualityResult,
  ReassessmentTrigger,
} from "../types";

export function computeReassessmentTriggers(
  n: CanonicalInput,
  quality: QualityResult,
): ReassessmentTrigger[] {
  const triggers: ReassessmentTrigger[] = [];

  if (n.forward_secured_pct < 90) {
    triggers.push({
      trigger_id: "RT-01",
      condition: "forward_secured_pct improves by 10+",
      threshold: `${n.forward_secured_pct + 10}%`,
      current_value: `${n.forward_secured_pct}%`,
      description:
        "If your forward-committed revenue increases by 10+ percentage points, reassess to capture improved visibility.",
    });
  }

  if (n.largest_source_pct > 25) {
    triggers.push({
      trigger_id: "RT-02",
      condition: "largest_source_pct decreases by 10+",
      threshold: `${n.largest_source_pct - 10}%`,
      current_value: `${n.largest_source_pct}%`,
      description:
        "If your largest income source drops below this threshold through diversification, reassess to reflect reduced concentration.",
    });
  }

  if (n.labor_dependence_pct > 25) {
    triggers.push({
      trigger_id: "RT-03",
      condition: "labor_dependence_pct decreases by 10+",
      threshold: `${n.labor_dependence_pct - 10}%`,
      current_value: `${n.labor_dependence_pct}%`,
      description:
        "If your labor dependence drops by 10+ points through building passive or recurring income, reassess.",
    });
  }

  if (quality.quality_score < 8) {
    triggers.push({
      trigger_id: "RT-04",
      condition: "quality_score increases by 2+",
      threshold: `${quality.quality_score + 2}`,
      current_value: `${quality.quality_score}`,
      description:
        "If you extend contract terms, reduce cancellation risk, or lower platform dependency, reassess to capture quality improvements.",
    });
  }

  triggers.push({
    trigger_id: "RT-05",
    condition: "New committed revenue stream added",
    threshold: "1+ new recurring source",
    current_value: `${n.source_diversity_count} sources`,
    description:
      "If you add a new meaningfully independent recurring revenue stream, reassess to reflect improved diversification.",
  });

  return triggers;
}
