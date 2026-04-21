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

export default function WhatMakesIncomeStable() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="What Makes Income Stable"
        definition="Income is stable when it persists without continuous active effort, comes from multiple sources, and is contractually protected."
        subtitle="Stability is not a feeling. It is a set of structural properties."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Stability requires diversification, protection, and recurrence — not just high earnings.",
          "Contractual coverage is the single strongest stabilizing factor.",
          "Perceived stability and measured stability frequently diverge.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The structural requirements of stable income",
            body: (
              <>
                <P>
                  Income stability is not a subjective assessment or a general sense of financial security. It is the product of specific, measurable structural characteristics. Income becomes stable when it exhibits three core properties: diversification across multiple independent sources, contractual or institutional protection against sudden termination, and recurrence patterns that provide forward visibility into future earnings.
                </P>
                <P>
                  Each of these properties contributes independently to overall stability. Diversification means that no single source represents an outsized share of total earnings, so the loss of any one source has a limited impact on the whole. Contractual protection means that income sources cannot be terminated without notice, negotiation, or defined exit provisions. Recurrence means that income arrives on predictable schedules based on standing arrangements rather than requiring continuous new business acquisition.
                </P>
                <P>
                  The absence of any one of these properties reduces stability, even if the others are present. A diversified income portfolio with no contracts is vulnerable to simultaneous termination. A contractually protected single-source income is resilient to disruption but catastrophically exposed if that one relationship fails. Recurrence without diversification creates dependable fragility.
                </P>
              </>
            ),
          },
          {
            heading: "Why perception and measurement diverge",
            body: (
              <>
                <P>
                  Most professionals assess their own income stability intuitively — based on how long they have been earning at their current level, how strong their client relationships feel, or how confident they are in their skills and market position. These perceptions are not invalid, but they are not structural measurements. They reflect sentiment, not architecture.
                </P>
                <P>
                  A real estate agent who has earned $300,000 for three consecutive years may feel that their income is stable. But if that income comes entirely from transaction commissions with no recurring component, no contractual relationships, and complete dependence on market conditions, the structural profile is fragile. The consistency of past results creates a feeling of stability that the underlying structure does not support.
                </P>
                <P>
                  Structural measurement eliminates this perception gap. It evaluates income based on what is contractually secured, how earnings are distributed across sources, and what recurrence mechanisms exist — regardless of how the earner feels about their financial position. The gap between perceived stability and measured stability is often where financial risk hides.
                </P>
              </>
            ),
          },
          {
            heading: "Building stability into an income profile",
            body: (
              <>
                <P>
                  Income stability is not fixed. It can be improved through deliberate structural changes. The most effective interventions target the three core properties: adding independent income sources to reduce concentration, securing contractual protections for existing relationships, and converting irregular project-based arrangements into recurring retainer or subscription models.
                </P>
                <P>
                  These changes do not require earning more. They require earning differently. A consultant who converts two project-based clients to 12-month retainer agreements has not increased their income, but they have materially improved their stability profile. A freelancer who adds a third client at a lower rate but with a recurring monthly arrangement has diluted their concentration risk without changing their total earnings.
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
        title="Insurance agent with a strong renewal book"
        setup="Independent insurance agent earning $185,000 annually. Approximately 60% of income comes from policy renewals — recurring commissions on existing client policies that renew automatically. The remaining 40% comes from new policy sales. The renewal book represents 350+ individual policies across personal and commercial lines."
        risk="The renewal-based income is structurally strong: highly diversified (350+ sources), contractually defined (policy terms), and recurring (annual renewals with historical retention rates above 88%). The new-business component is less protected — dependent on lead flow, market conditions, and active sales effort. However, it represents a minority of total income."
        outcome="RunPayway estimates a stability score of 68-76 for this profile. The dominant renewal income stream exhibits all three structural stability properties: diversification, contractual protection, and reliable recurrence. This is an example of income that is both earned and structurally resilient — the two are not always paired."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Feeling Stable"
        right="Being Stable"
        explanation="Feeling stable is a subjective assessment based on past performance and personal confidence. Being stable is a structural condition based on diversification, contractual protection, and recurrence. The two frequently diverge, and the gap between them is where unrecognized financial risk accumulates."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Stability is not earned by working harder. It is built by structuring income differently." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/income-structure-explained", label: "Income Structure Explained" },
          { href: "/learn/income-continuity-explained", label: "Income Continuity Explained" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is salaried income automatically stable?",
            a: "Not necessarily. A salaried position with a long-term contract and severance provisions is structurally stable. An at-will salaried position with no contract, concentrated in a single employer, has moderate stability at best. The employment arrangement matters more than the salary label.",
          },
          {
            q: "What is the single most important factor in income stability?",
            a: "Contractual protection has the strongest individual effect because it provides a defined floor on income duration. However, stability is a composite property — diversification and recurrence both contribute materially, and the strongest profiles exhibit all three.",
          },
          {
            q: "Can you have too many income sources?",
            a: "In theory, excessive fragmentation could dilute attention and reduce the quality of each engagement. In practice, the structural benefits of diversification outweigh this concern for most earners. The optimal range depends on the type of work and the contractual terms of each source.",
          },
          {
            q: "How quickly can income stability be improved?",
            a: "A single structural change — signing one contract, adding one recurring client, or converting one project engagement to a retainer — can measurably improve a stability score. The timeline depends on the specific changes made, but incremental improvement is immediately quantifiable.",
          },
          {
            q: "Does passive income automatically improve stability?",
            a: "Passive income improves stability when it is diversified and contractually defined. A single rental property is passive but concentrated. Dividend income from a diversified portfolio is both passive and structurally resilient. The stability benefit depends on the structure of the passive stream, not merely its passive nature.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Find Out If Your Income Is Actually Stable"
        sub="Get your income stability score — structure, risk exposure, and a concrete improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
