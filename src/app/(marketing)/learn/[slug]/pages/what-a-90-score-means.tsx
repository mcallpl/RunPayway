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
} from "@/components/learn/LearnComponents";

export default function WhatA90ScoreMeans() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Score Interpretation"
        title="What a 90 Income Stability Score Means"
        definition="A score of 90 places you in the top tier of High Stability. Your income is structurally resilient — diversified, recurring, forward-committed, and labor-independent."
        subtitle="Score range: 75-100 · Band: High Stability"
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A score of 90 means your income structure can absorb major disruptions — including simultaneous loss of multiple sources — without threatening financial continuity",
          "Earners at 90 have typically built income that continues at 40-60% of normal levels even during extended work stoppages",
          "Maintaining a 90 requires ongoing structural discipline — contracts must be renewed, diversification must be preserved, and recurring streams must be monitored",
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
                  A score of 90 tells you that your income is built to last. The model has identified structural characteristics that place your income in the top tier of resilience: deep diversification across multiple sources with no single source dominating, long-term contractual commitments that provide forward visibility measured in years rather than months, and a substantial percentage of income that continues without your active labor. This is not a profile that happens by accident — it is the result of deliberate structural decisions made over time.
                </P>
                <P>
                  At 90, your income can absorb the disruptions that would destabilize most earners: the loss of a major client, a prolonged market downturn, a 60-day or longer work stoppage, or even the simultaneous occurrence of multiple adverse events. The structural protections are deep enough that no single event, and few combinations of events, can threaten your financial continuity. Your income is not just stable — it is structurally resilient.
                </P>
                <P>
                  What a 90 also tells you is that you have built income architecture that most earners aspire to but few achieve. The structural characteristics required to reach this level — broad diversification, extended commitments, substantial recurring income, low labor dependency — represent the culmination of intentional financial architecture over years of practice.
                </P>
              </>
            ),
          },
          {
            heading: "What structure produces a 90",
            body: (
              <>
                <P>
                  A score of 90 requires excellence across all structural dimensions the model measures. Typical characteristics include: five or more income sources with no single source exceeding 20% of total income, contractual commitments averaging 12 months or longer, recurring or passive income representing 35-50% of total earnings, and a structural floor (income that continues during a 30-day work stoppage) of 40% or higher.
                </P>
                <P>
                  The profiles that reach 90 are diverse in profession but consistent in structure. A financial advisor with assets under management generating ongoing advisory fees, 200+ client relationships across multiple segments, multi-year service agreements, and referral partnerships. A software company founder with subscription revenue, enterprise contracts, multiple product lines, and licensing income. A real estate professional with property management fees, a rental portfolio, transaction commissions from multiple market segments, and a referral network. The common thread is not the profession but the depth of structural protection across every dimension.
                </P>
                <P>
                  Notably, reaching 90 almost always requires income that generates returns independent of the earner&apos;s daily labor. This is the dimension that separates scores in the high 70s and low 80s from the 90+ tier. Active income, no matter how diversified and committed, has a ceiling because it depends on the earner&apos;s continued capacity to work. Breaking through that ceiling requires building income streams that operate independently — assets, products, contracts, or businesses that generate revenue without daily effort.
                </P>
              </>
            ),
          },
          {
            heading: "How to maintain it",
            body: (
              <>
                <P>
                  A score of 90 is not self-sustaining. It reflects current structural characteristics that require active maintenance. Contracts expire and must be renewed. Client relationships require ongoing management to remain committed. Recurring revenue streams must be monitored for churn. Diversification can erode if one source grows disproportionately while others shrink. The score is a snapshot of how your income is built today — maintaining it requires maintaining the structures that produced it.
                </P>
                <P>
                  The primary risk at 90 is structural drift — the gradual erosion of diversification, commitment, or recurrence as the earner&apos;s attention shifts away from structural maintenance toward growth or new opportunities. A financial advisor who stops taking new clients may see their client count decline through natural attrition. A business owner who focuses on one product line may see diversification erode. A consultant who lets contracts lapse to month-to-month terms may see commitment scores decline. Each of these is a small change, but cumulative structural drift can reduce a 90 to an 80 over 18-24 months.
                </P>
                <P>
                  Maintaining a 90 requires periodic structural review: Are contracts being renewed at similar or longer terms? Is diversification holding or concentrating? Is recurring income growing proportionally with total income? Are labor-independent streams being maintained? These are the structural questions that keep a 90 at 90.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={45} recurring={35} atRisk={20} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Financial advisor with AUM-based practice at score 90"
        setup="A financial advisor earns $320,000 annually. Advisory fees from $45M in assets under management provide 55% ($176,000) across 200+ client households. Insurance renewals provide 20% ($64,000). Financial planning retainers provide 15% ($48,000) from 30 clients on annual agreements. Referral partnerships provide 10% ($32,000). No single client represents more than 2% of total revenue."
        risk="A market correction reduces AUM by 20%, cutting advisory fee income by $35,000 annually. Simultaneously, two planning retainer clients (6% of that segment) do not renew, reducing retainer income by $2,900. Total impact: approximately $38,000 in reduced annual income."
        outcome="Despite a significant market correction and client attrition occurring simultaneously, total income drops from $320,000 to $282,000 — a 12% reduction. The advisor retains 88% of pre-disruption income because no single source, client, or event can materially threaten the overall structure. Insurance renewals and referral partnerships are unaffected. The remaining 194+ client relationships continue generating fees. This is what a 90 looks like under real pressure: the disruption is absorbed by the structure, not endured by the earner."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="High Stability (90)"
        right="Invulnerable (100)"
        explanation="A score of 90 means your income can absorb major disruptions and simultaneous adverse events. But it is not invulnerable. A 90 still has 20% of income at risk — sources that are not contractually committed, not recurring, and depend on continued market conditions or active effort. A theoretical 100 would mean zero structural exposure: every dollar of income is contractually committed, recurring, diversified, and labor-independent. In practice, this is nearly impossible to achieve and maintain. Even a 90 has exposure — it is simply managed, measured, and minimal."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Even a 90 has exposure. The difference is that at 90, you know exactly where it is, how much it is, and what it would take to trigger it." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-a-72-score-means", label: "What a 72 Score Means" },
          { href: "/learn/is-70-a-good-income-stability-score", label: "Is 70 a Good Score?" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/stop-working-30-days", label: "Stop Working 30 Days" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How rare is a score of 90?",
            a: "A score of 90 requires structural characteristics that few earners build intentionally: deep diversification, extended commitments, substantial recurring income, and meaningful labor independence. Earners who reach 90 have typically spent years building income architecture with deliberate attention to structural resilience. It is achievable but uncommon.",
          },
          {
            q: "Can a score of 90 decline?",
            a: "Yes. A 90 reflects current structural characteristics. If contracts expire without renewal, diversification erodes, or recurring income declines, the score will decrease. Structural drift — the gradual erosion of protective characteristics — is the primary risk for earners at this level. Maintaining a 90 requires ongoing structural discipline.",
          },
          {
            q: "Is there a meaningful difference between 90 and 95?",
            a: "Yes, but the differences at this level are narrow and specific. A 95 typically indicates even lower labor dependency, longer contractual commitments, or broader diversification than a 90. The practical resilience difference is measurable but small — both profiles can absorb major simultaneous disruptions. The distinction matters most in extreme scenarios: prolonged market downturns, extended work stoppages of 90+ days, or cascading multi-source disruptions.",
          },
          {
            q: "What professions tend to reach 90?",
            a: "No profession inherently reaches 90 — it is always a function of structure, not profession. However, professions that lend themselves to recurring revenue, long-term contracts, and asset-based income have a structural advantage: financial advisors with AUM-based practices, business owners with subscription models, real estate professionals with rental portfolios, and professionals who have built product-based income alongside their service practice.",
          },
          {
            q: "Should I try to reach 100?",
            a: "A score of 100 would require zero structural exposure — every dollar of income contractually committed, recurring, diversified, and labor-independent. This is theoretically possible but practically difficult to achieve and maintain. A more productive goal is maintaining your score in the high 80s or 90s while focusing on the specific exposure the model identifies. The structural gains between 90 and 100 are real but incremental, and the effort required increases significantly with each additional point.",
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
