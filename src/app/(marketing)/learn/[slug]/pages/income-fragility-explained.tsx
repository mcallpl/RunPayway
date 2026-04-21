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

export default function IncomeFragilityExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="Income Fragility Explained"
        definition="Income fragility describes the degree to which income is vulnerable to a single point of failure."
        subtitle="Fragile income is income that breaks — not bends — under pressure."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Fragility is concentration risk expressed as a structural property.",
          "Fragile income can persist for years before a disruption reveals the exposure.",
          "The most fragile incomes are often the most impressive on paper.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What income fragility means",
            body: (
              <>
                <P>
                  Income fragility is a specific structural condition in which a small number of disruption events — often a single event — can produce a disproportionately large income loss. It is the inverse of resilience. Resilient income absorbs shocks and continues functioning. Fragile income fractures under pressure because its structure contains critical single points of failure.
                </P>
                <P>
                  The concept borrows from engineering and systems theory, where fragility describes a system&apos;s sensitivity to stress events. A fragile system performs well under normal conditions but fails catastrophically when stressed. Income fragility operates identically: the earning profile functions perfectly when conditions are favorable, but a single adverse event — a client departure, a contract non-renewal, a platform algorithm change — can eliminate a large share of total earnings in a compressed timeframe.
                </P>
                <P>
                  Critically, income fragility is not correlated with income level. A $500,000 annual income dependent on two clients is more fragile than a $90,000 annual income distributed across fifteen recurring sources. Fragility is a property of structure, not magnitude. This makes it invisible to any financial analysis that evaluates income solely by its amount.
                </P>
              </>
            ),
          },
          {
            heading: "The mechanics of fragile income",
            body: (
              <>
                <P>
                  Income fragility arises from the interaction of three structural factors: high concentration, low contractual protection, and correlated dependencies. High concentration means that a small number of sources represent a large share of total earnings. When two clients generate 85% of income, the loss of either one is a material event. When fifteen clients each contribute roughly equal shares, the loss of any one is absorbable.
                </P>
                <P>
                  Low contractual protection means that concentrated sources can be terminated rapidly. A client generating 50% of income who is engaged on a month-to-month basis with no written agreement can exit in 30 days. The concentration would be less dangerous if the engagement were governed by a 24-month contract with termination provisions. The combination of concentration and contractual exposure creates acute fragility.
                </P>
                <P>
                  Correlated dependencies occur when nominally separate income sources share a common failure mechanism. Two clients in the same industry, three revenue streams dependent on the same platform, or multiple engagements tied to the same economic cycle may appear diversified but are structurally correlated. A single sector downturn or platform change can disrupt all of them simultaneously.
                </P>
              </>
            ),
          },
          {
            heading: "Why fragility persists undetected",
            body: (
              <>
                <P>
                  The most dangerous property of income fragility is that it produces no visible signal during periods of stability. Fragile income performs identically to resilient income when conditions are favorable. The client pays on time. The projects keep coming. The commission checks arrive. There is no experiential difference between fragile and resilient income until the moment of disruption.
                </P>
                <P>
                  This creates a survivorship bias that reinforces fragile structures. Every month that fragile income continues without incident strengthens the earner&apos;s belief that the structure is sound. The longer the favorable period, the stronger the false confidence. When disruption finally occurs — and structural fragility guarantees that it eventually will — the impact is compounded by the lack of preparation that the false confidence produced.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={20} atRisk={65} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Consultant earning $300K from two clients"
        setup="Management consultant earning $300,000 annually. Client A contributes $180,000 (60%) through a quarterly-renewed engagement. Client B contributes $120,000 (40%) on a project basis with no formal agreement. Both clients are in financial services. No other active revenue sources."
        risk="The income structure has a severe single point of failure at Client A — its loss would immediately eliminate 60% of total income. Client B provides no contractual buffer. The sector correlation means that an industry downturn could disrupt both relationships simultaneously. Two clients and $300,000 in income, but the structure is binary: it works, or it collapses."
        outcome="RunPayway estimates a stability score of 20-28 for this profile. Despite strong earnings and a recognizable client base, the structural fragility is acute. The combination of high concentration, minimal contractual protection, and correlated sector dependency creates a profile where income preservation depends entirely on the continuation of two relationships — neither of which is contractually secured."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Low Income"
        right="Fragile Income"
        explanation="Low income describes an earnings level below a reference threshold. Fragile income describes a structural condition in which earnings — at any level — are vulnerable to catastrophic loss from a single disruption event. Income can be high and fragile, or low and resilient. The two measurements are independent."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Fragile income doesn't feel fragile. It feels like it's working — right up until the moment it stops." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-risk-explained", label: "Income Risk Explained" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/income-structure-explained", label: "Income Structure Explained" },
          { href: "/learn/income-continuity-explained", label: "Income Continuity Explained" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is income fragility the same as income instability?",
            a: "They are related but distinct. Income instability is the broader measurement of structural resilience across all factors. Income fragility specifically describes vulnerability to catastrophic loss from a single point of failure — the most severe form of instability. All fragile income is unstable, but not all unstable income is fragile.",
          },
          {
            q: "How many clients or sources does it take to reduce fragility?",
            a: "There is no fixed number. What matters is that no single source represents an outsized share of total income and that sources are not correlated. Five clients who each contribute 20% is meaningfully less fragile than two clients contributing 50% each — but five clients in the same industry with the same payment terms may still carry correlated risk.",
          },
          {
            q: "Can contracts eliminate fragility?",
            a: "Contracts reduce fragility by lowering the probability of sudden income loss, but they do not eliminate concentration risk. A single client under a 3-year contract is better protected than one with no contract, but the income is still concentrated in a single source. Contracts and diversification together produce the strongest reduction in fragility.",
          },
          {
            q: "Does fragility matter if I have savings?",
            a: "Savings provide a time buffer after disruption occurs, but they do not change the structural fragility of income itself. A person with $500,000 in savings and fragile income has a longer runway to recover from disruption, but the probability and magnitude of the disruption are unchanged. Savings mitigate consequences. Structural changes prevent them.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Identify Your Single Points of Failure"
        sub="Get your income stability score — fragility analysis, concentration mapping, and a structural improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
