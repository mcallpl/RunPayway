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
  LearnCTA,
  StickyLearnCTA,
  MetaFooter,
} from "@/components/learn/LearnComponents";

export default function ModelGovernance() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="GOVERNANCE"
        title="Model Governance"
        definition="RunPayway™ operates under a fixed governance framework. Every scoring rule is version-locked, auditable, and immutable once deployed."
        subtitle="The rules don't change after the fact. That's the point."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Every scoring rule in RunPayway is version-locked — once deployed, it cannot be changed retroactively",
          "Model governance means your score is produced by a fixed, auditable set of rules — not an adaptive algorithm that shifts with new data",
          "When the model does change, the change is versioned, documented, and applied only to future assessments — never to past scores",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How the model is governed",
            body: (
              <>
                <P>
                  RunPayway operates under a fixed governance framework that treats scoring rules as immutable once deployed. Every rule — every weight, every threshold, every calculation — is locked to a specific model version. Once a version is deployed, its rules cannot be modified, adjusted, or overridden. This means that every score produced under a given version is the product of the same fixed set of rules, regardless of when the assessment was taken or who took it.
                </P>
                <P>
                  This governance approach is deliberate. Fixed rules produce comparable scores. If two earners take the assessment under the same model version, their scores are directly comparable because the same rules were applied to both. If the same earner takes the assessment twice under the same version, any score change reflects a real change in their income structure — not a change in how the model evaluates that structure.
                </P>
                <P>
                  The governance framework also ensures auditability. Because every rule is version-locked and documented, any score can be traced back to the exact set of rules that produced it. There is no black box. There is no adaptive learning that changes how scores are calculated based on aggregate data. The model measures what it measures, using the rules it was deployed with, and those rules do not change.
                </P>
              </>
            ),
          },
          {
            heading: "What triggers a new version",
            body: (
              <>
                <P>
                  A new model version is triggered by any change to the scoring framework: a rule change, a weight adjustment, a new dimension added to the model, a threshold modification, or a calculation methodology update. No change is too small to warrant a new version — even a minor weight adjustment produces a new version number because it changes the output the model produces for at least some input profiles.
                </P>
                <P>
                  Version changes are not frequent. The model is designed to be stable, and changes are made only when there is a clear structural rationale — not in response to user feedback, market trends, or competitive pressure. A version change means the model&apos;s creators have identified a meaningful improvement to how income stability is measured, and that improvement has been validated, documented, and prepared for deployment.
                </P>
                <P>
                  When a new version is deployed, it applies only to future assessments. Past scores remain under their original version. This means a score of 65 under RP-2.0 and a score of 65 under RP-3.0 may not be directly comparable — they were produced by different rule sets. The version stamp on every assessment makes this distinction explicit and transparent.
                </P>
              </>
            ),
          },
          {
            heading: "How scores are preserved",
            body: (
              <>
                <P>
                  Every assessment is permanently stamped with the model version that produced it. This stamp is not metadata — it is a core component of the score itself. A score without a version stamp is meaningless because the score can only be interpreted in the context of the rules that produced it. The version stamp ensures that every score carries its own interpretive context permanently.
                </P>
                <P>
                  Scores produced under the same version are directly comparable. If you scored 55 in January under RP-2.0 and 62 in July under RP-2.0, the 7-point improvement reflects a real change in your income structure. The rules did not change between assessments — only your inputs changed. This comparability is only possible because the governance framework guarantees rule immutability within a version.
                </P>
                <P>
                  When a version transition occurs, users are informed that their new score was produced under a different rule set. The model does not attempt to &ldquo;translate&rdquo; scores between versions because different rules may produce different scores for the same income structure. The integrity of each version&apos;s scoring is preserved by keeping versions separate and clearly labeled.
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
        title="What happens when RP-2.0 updates to RP-3.0"
        setup="RunPayway version RP-2.0 has been the active model for 18 months. During this period, thousands of assessments have been produced, all under the same fixed rule set. The model's creators identify a structural improvement: adding a new dimension that measures contractual escalation clauses as a distinct factor in forward visibility scoring."
        risk="Without proper governance, adding a new dimension could retroactively change existing scores, break comparability between past assessments, and undermine trust in the scoring system. Users who made decisions based on their RP-2.0 scores would find those scores no longer valid."
        outcome="Under RunPayway's governance framework, the new dimension is deployed as RP-3.0. All past scores remain under RP-2.0, unchanged and fully valid. New assessments are produced under RP-3.0 with the updated rule set. Users are informed of the version change and understand that RP-2.0 and RP-3.0 scores are produced by different rules. No past score is modified. No comparability is broken. The improvement is implemented without compromising the integrity of existing measurements."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Adaptive Models"
        right="Fixed Models"
        explanation="Adaptive models change their rules based on new data — they learn, adjust, and update continuously. This means scores produced last month may not be comparable to scores produced today because the underlying rules have shifted. Fixed models like RunPayway lock their rules at deployment. Scores are comparable within a version because the rules are identical for every assessment. When improvement is needed, a new version is created rather than silently updating the existing one. Adaptive models optimize for accuracy against shifting targets. Fixed models optimize for consistency, comparability, and trust."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The model doesn't change to fit the data. The data is measured by the model." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/how-versioning-works", label: "How Versioning Works" },
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
            q: "Can my past score change if the model updates?",
            a: "No. Past scores are permanently locked to the model version that produced them. A version update creates a new rule set for future assessments — it never modifies scores produced under a previous version. Your score under RP-2.0 will always be your score under RP-2.0, regardless of what future versions are deployed.",
          },
          {
            q: "How often does the model change?",
            a: "Version changes are infrequent and driven by structural rationale, not by schedule. The model is designed to be stable. A new version is created only when a meaningful improvement to the measurement framework has been identified, validated, and documented. There is no regular update cycle.",
          },
          {
            q: "Who decides when the model changes?",
            a: "Model changes are governed by RunPayway's internal framework team. Changes require structural justification — a clear rationale for why the current model is insufficient and how the proposed change improves measurement accuracy. Changes are not made in response to individual user feedback, competitive pressure, or market trends.",
          },
          {
            q: "Is the model open source?",
            a: "The model's governance principles and version history are transparent and documented. The specific scoring algorithms, weights, and thresholds are proprietary. This balance ensures that users can trust and audit the governance framework while protecting the intellectual property that makes the model effective.",
          },
          {
            q: "What if I disagree with my score?",
            a: "The model produces scores based on the structural characteristics reported in the assessment. If you believe your score does not reflect your income structure accurately, the most productive step is to review whether the inputs you provided fully capture your income architecture. The model does not make subjective judgments — it applies fixed rules to reported inputs. Different inputs produce different scores under the same rules.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="See the Model in Action"
        sub="Get your income stability score — produced by a fixed, version-locked model with full governance transparency."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
