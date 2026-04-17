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
  MicroConversion,
  LearnCTA,
  MetaFooter,
} from "@/components/learn/LearnComponents";

export default function WhatA72ScoreMeans() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Score Interpretation"
        title="What a 72 Income Stability Score Means"
        definition="A score of 72 places you solidly in Established Stability. Your income can absorb most common disruptions without structural failure."
        subtitle="Score range: 50-74 · Band: Established Stability"
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A score of 72 means your income is well-diversified, has meaningful contractual commitments, and includes recurring streams that reduce labor dependency",
          "Earners at 72 can typically absorb the loss of any single client or income source without dropping below essential expense coverage",
          "The gap between 72 and 75 — the High Stability threshold — is narrow but structurally significant, and often requires one precise improvement",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What this score tells you",
            body: (
              <>
                <P>
                  A score of 72 tells you that your income structure has reached a level of resilience that most earners never achieve. Your income is diversified across multiple sources, has meaningful forward visibility through contracts or committed relationships, and includes a meaningful percentage of income that continues without your active labor. These are not theoretical protections — they are structural characteristics that the model has measured and quantified.
                </P>
                <P>
                  At 72, the model has identified that no single source dominates your income to a degree that creates catastrophic risk. You have contractual commitments that extend forward visibility beyond the current quarter. You have recurring or passive income that provides a structural floor during disruptions. The combination of these factors means your income can absorb the most common disruptions — a lost client, a delayed project, a short-term market downturn — without structural failure.
                </P>
                <P>
                  What a 72 also tells you is that you are near the top of the Established band. The High Stability threshold begins at 75, and the structural improvements required to cross it are specific and achievable. You are not rebuilding your income — you are refining an already strong structure.
                </P>
              </>
            ),
          },
          {
            heading: "What typically drives a 72",
            body: (
              <>
                <P>
                  Earners at 72 have typically built income structures with four or more sources, no single source exceeding 30% of total income, at least two contractual commitments of 6 months or longer, and recurring income representing 20-30% of total earnings. This is the profile of a mature professional who has intentionally structured their income for resilience — whether through a diversified client base, a renewal book, a product portfolio, or a combination of income types.
                </P>
                <P>
                  Common profiles at 72 include insurance agents with strong renewal books and diversified product lines, consultants with multiple retainer clients and a growing advisory practice, real estate professionals with both transaction income and property management fees, and business owners with recurring revenue from subscriptions or maintenance contracts. What unites these profiles is not the profession but the structural characteristics: diversification, commitment, and recurrence.
                </P>
                <P>
                  The difference between a 72 and a score in the 50s or 60s is depth of protection. At 72, the loss of any single client or source does not threaten the overall income structure. At 55 or 60, it often does. This depth is what makes a 72 resilient in practice, not just in theory.
                </P>
              </>
            ),
          },
          {
            heading: "How to reach High Stability (75+)",
            body: (
              <>
                <P>
                  The gap between 72 and 75 is only 3 points, but crossing the High Stability threshold requires addressing the specific structural dimensions where your profile still has exposure. At 72, the model has typically identified one or two remaining vulnerabilities: slightly elevated concentration in one source, limited contractual duration (6-month contracts rather than 12-month), or recurring income that is meaningful but not yet sufficient to serve as a true structural floor.
                </P>
                <P>
                  The most common path from 72 to 75+ involves one of three moves: extending your longest contractual commitments from 6 months to 12 months, growing your recurring or labor-independent income from 25% to 35% of total earnings, or adding one additional diversified source that reduces your largest source below 25% of total income. Any one of these changes, fully executed, is typically sufficient to cross the threshold.
                </P>
                <P>
                  The precision required at this level is different from the broad structural changes that move scores in the 30s and 40s. At 72, you are not fixing structural problems — you are optimizing an already strong structure. The improvements are smaller in scale but meaningful in their impact on resilience, because each point above 72 represents a measurable reduction in the last remaining structural vulnerabilities.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={28} recurring={40} atRisk={32} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Insurance agent with a strong renewal book at score 72"
        setup="An independent insurance agent earns $185,000 annually. Renewal commissions provide 45% of income ($83,000) from a book of 400+ policies across multiple carriers. New business commissions provide 35% ($65,000). A small financial planning practice provides 20% ($37,000) through advisory fees. Renewal and advisory income are contractually recurring."
        risk="A regional economic downturn reduces new business commission by 40% over 6 months. New policies are harder to close, referral volume drops, and the new business pipeline thins significantly."
        outcome="The agent loses approximately $26,000 in annual new business income — a meaningful reduction. But the renewal book ($83,000) and advisory practice ($37,000) continue without interruption, providing 65% of pre-disruption income. The structural floor holds. This is what a 72 looks like under pressure: the disruption is real, but the income structure absorbs it without failure. A score of 50, with less diversification and fewer recurring streams, would experience the same downturn as a structural crisis rather than a manageable reduction."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Established (72)"
        right="High Stability (78)"
        explanation="At 72, your income absorbs most common disruptions — a lost client, a delayed project, a short-term market downturn. At 78, your income absorbs uncommon disruptions as well — a prolonged market contraction, simultaneous loss of two sources, a 60-day work stoppage. The difference is not a different kind of structure but a deeper version of the same principles: more diversification, longer commitments, higher recurring percentage. The last 3 points before High Stability represent the final structural refinements that separate resilience from near-resilience."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A 72 means your income can take a hit. The question now is whether it can take two hits at once — and the answer determines whether you cross into High Stability." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-a-90-score-means", label: "What a 90 Score Means" },
          { href: "/learn/is-70-a-good-income-stability-score", label: "Is 70 a Good Score?" },
          { href: "/learn/what-a-50-score-means", label: "What a 50 Score Means" },
          { href: "/learn/insurance-renewal-vs-new-business", label: "Insurance: Renewal vs New Business" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is 72 close to High Stability?",
            a: "Yes. The High Stability band begins at 75, so a score of 72 is 3 points below the threshold. This gap is typically addressable with one targeted structural improvement — extending a contract, growing recurring income, or adding one diversified source. Most earners at 72 who make intentional changes can cross the 75 threshold within 6-12 months.",
          },
          {
            q: "Can I lose my 72 score?",
            a: "Yes. If you lose a major client, allow contracts to lapse without renewal, or see a significant reduction in recurring income, your score can decline. A 72 reflects your current income structure — it is a snapshot, not a permanent designation. Maintaining the structural characteristics that produced the score is what maintains the score itself.",
          },
          {
            q: "What percentage of earners score 72 or above?",
            a: "The model does not publish population distribution data, but structurally, a score of 72 requires characteristics that most independent earners have not built: multiple diversified sources, contractual commitments, and meaningful recurring income. Earners who have intentionally structured their income over several years are the typical population at this level.",
          },
          {
            q: "Does a 72 mean I am financially secure?",
            a: "A 72 means your income structure is resilient — it can absorb common disruptions without failure. Financial security depends on many factors beyond income structure, including savings, expenses, debt, and insurance. The model measures one dimension — how your income is built — and a 72 indicates that this dimension is strong.",
          },
          {
            q: "What is the difference between 72 and 75?",
            a: "The difference is typically one structural dimension that needs deepening. At 72, you may have good diversification but contracts that are too short, or strong recurring income but slightly elevated concentration. At 75, all major structural dimensions are at levels the model considers resilient. The 75 threshold is not arbitrary — it marks the point where the model identifies comprehensive structural protection across all measured dimensions.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Assess Your Income Structure", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="See How Close You Are"
        sub="Get your income stability score and find out exactly what stands between your current structure and High Stability."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
