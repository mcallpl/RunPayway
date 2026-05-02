"use client";

import {
  LearnHero,
  QuickInsightStrip,
  CoreContent,
  P,
  SystemBlock,
  VisualModel,
  ScenarioBlock,
  ContrastBlock,
  RealityCheck,
  RelatedTopics,
  LearnFAQ,
  MetaFooter,
  StickyLearnCTA,
} from "@/components/learn/LearnComponents";

export default function HowVersioningWorks() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="VERSIONING"
        title="How Versioning Works"
        definition="Every RunPayway™ assessment is stamped with the exact model version used. Scores produced under the same version are directly comparable. Version changes are documented and never applied retroactively."
        subtitle="Same version, comparable scores. Different version, different rules. Always labeled."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Every RunPayway assessment carries a version stamp — the exact model version that produced the score",
          "Scores under the same version are directly comparable because identical rules were applied to both assessments",
          "When the model version changes, old scores are preserved unchanged and new scores are produced under the updated rules",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Why versioning matters",
            body: (
              <>
                <P>
                  Versioning is what makes scores meaningful over time. If the rules that produce scores change silently — a weight adjusted here, a threshold modified there — then a score of 65 from January and a score of 65 from July may not represent the same structural profile. Without versioning, score comparisons become unreliable, progress tracking becomes impossible, and trust in the measurement system erodes.
                </P>
                <P>
                  RunPayway&apos;s versioning system solves this by locking every scoring rule to a specific version identifier. When you receive a score, it comes with a version stamp — RP-2.0, for example. That stamp guarantees that the rules used to produce your score are identical to the rules used to produce every other score under RP-2.0. Your score is comparable to any score produced under the same version, regardless of when the assessment was taken.
                </P>
                <P>
                  This comparability is essential for three purposes: tracking your own progress (did your structure improve between assessments?), benchmarking against peers (how does your structure compare to others in your profession?), and maintaining trust in the system (does a score of 65 today mean the same thing as a score of 65 six months ago?). Versioning ensures the answer to all three questions is reliable.
                </P>
              </>
            ),
          },
          {
            heading: "How versions are numbered",
            body: (
              <>
                <P>
                  RunPayway uses a major.minor versioning format: RP-2.0, RP-2.1, RP-3.0. The major number (the first digit) changes when there is a significant structural change to the model — a new dimension added, a fundamental recalculation of how a core metric is weighted, or a redesign of the scoring bands. The minor number (the second digit) changes for smaller adjustments — a threshold refinement, a weight calibration, or a clarification of how an existing dimension is measured.
                </P>
                <P>
                  Both major and minor version changes produce a new version identifier. There is no change too small to version — any modification to the rule set, however minor, creates a new version because it potentially changes the score output for some input profiles. This strictness is intentional. It ensures that the version stamp is a complete guarantee: same version means same rules, without exception.
                </P>
                <P>
                  The current model version is visible on every assessment and report. Users do not need to track versions themselves — the system labels every score automatically. When a version change occurs, users are informed and the distinction between versions is made explicit.
                </P>
              </>
            ),
          },
          {
            heading: "What happens during a version change",
            body: (
              <>
                <P>
                  When a new version is deployed, three things happen simultaneously: new assessments begin using the new rule set, past assessments remain unchanged under their original version, and the version change is documented with a clear description of what changed and why. There is no migration, no retroactive recalculation, and no attempt to &ldquo;translate&rdquo; old scores into the new framework.
                </P>
                <P>
                  This means that if you scored 65 under RP-2.0 and then reassess under RP-2.1, your new score reflects the new rules applied to your current income structure. A change in score between versions may reflect a change in your income structure, a change in the model&apos;s rules, or both. The version stamps allow you to distinguish between these possibilities — if the version changed, the rules changed. If the version is the same, only your structure changed.
                </P>
                <P>
                  Version transitions are designed to be transparent and non-disruptive. Your RP-2.0 score remains valid and meaningful as a measurement under RP-2.0 rules. Your RP-2.1 score is a new measurement under updated rules. Both are accurate representations of your income structure as measured by their respective rule sets. Neither invalidates the other.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={33} recurring={34} atRisk={33} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Reassessing after a version change"
        setup="A consultant takes the RunPayway assessment in March under model version RP-2.0 and receives a score of 62. Six months later, in September, the consultant reassesses. During the intervening period, RunPayway deployed version RP-2.1, which adjusted the weighting of contractual commitment duration — giving slightly more weight to 12-month contracts relative to 6-month contracts."
        risk="Without versioning, the consultant would receive a new score with no way to determine whether the change reflects structural improvement, a rule change, or both. Progress tracking would be unreliable and the score comparison meaningless."
        outcome="The consultant's September score of 66 is clearly stamped as RP-2.1. The March score of 62 remains stamped as RP-2.0. The consultant can see that the model version changed, review what changed (contractual commitment weighting), and understand that 4 of the point difference may reflect the rule change rather than structural improvement alone. The versioning system makes this analysis possible without requiring the user to track model changes themselves."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Version-Locked"
        right="Silently Updated"
        explanation="A version-locked system like RunPayway stamps every output with the exact rules that produced it. When rules change, a new version is created. Past outputs are never modified. Users can compare outputs within a version with confidence. A silently updated system changes its rules without notification — scores produced yesterday and scores produced today may use different calculations, but the user has no way to know. This makes progress tracking unreliable, benchmarking impossible, and the system fundamentally unauditable. Version-locking trades flexibility for trust."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A score is only meaningful if you know the rules that produced it. The version stamp is how you know." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/model-governance", label: "Model Governance" },
          { href: "/learn/what-runpayway-does-not-do", label: "What RunPayway Does Not Do" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Where can I see which version produced my score?",
            a: "The model version is displayed on every assessment report. It appears alongside your score as a version identifier (e.g., RP-2.0). This stamp is permanently associated with your assessment and does not change, even if newer model versions are deployed after your assessment.",
          },
          {
            q: "Are scores from different versions comparable?",
            a: "Not directly. Scores from different versions were produced by different rule sets, which means the same income structure could produce different scores under different versions. Comparing scores across versions is like comparing measurements made with different instruments — the numbers may differ even if the underlying reality is the same. Compare scores within versions for reliable progress tracking.",
          },
          {
            q: "Will my old score be recalculated under a new version?",
            a: "No. Past scores are never recalculated, modified, or updated. Your score under RP-2.0 remains your score under RP-2.0 permanently. If you want a score under a newer version, you take a new assessment. The old and new scores coexist — each valid under its respective rule set.",
          },
          {
            q: "How will I know when a version change happens?",
            a: "Version changes are communicated to users when they take a new assessment. If the model version has changed since your last assessment, this is noted on your new report. You do not need to monitor version changes proactively — the system handles version labeling automatically.",
          },
          {
            q: "Can I request a score under a previous version?",
            a: "No. Assessments are always produced under the current active model version. Previous versions are archived for score preservation purposes but are not available for new assessments. This ensures that all users taking assessments at the same time are measured by the same rules.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
