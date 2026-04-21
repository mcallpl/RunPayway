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
  MetaFooter,
} from "@/components/learn/LearnComponents";

export default function HowStableIsYourIncome() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Framework"
        title="How Stable Is Your Income"
        definition="Income stability is measurable. It depends on six structural dimensions — not how much you earn or how long you've earned it."
        subtitle="Tenure and earnings history create the illusion of stability. Structure determines whether it actually exists."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Twenty years of experience does not equal twenty years of structural stability",
          "Six dimensions determine income resilience independently of income amount",
          "The earner with fewer years but better structure often has the more stable income",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Why Experience Does Not Equal Stability",
            body: (
              <>
                <P>
                  Experience measures how long someone has earned income in a given field. Stability measures whether the structural characteristics of that income are likely to persist under adverse conditions. These are fundamentally different measurements. A twenty-year veteran real estate agent with zero recurring revenue has two decades of experience and near-zero structural protection. Each month begins with no committed income regardless of track record.
                </P>
                <P>
                  The conflation of experience and stability is one of the most persistent errors in income assessment. Lenders, employers, and the earners themselves treat longevity as evidence of resilience. It is not. Longevity describes the past. Structure describes the future. A business that has operated for fifteen years on a single client contract has fifteen years of history and one point of failure.
                </P>
                <P>
                  This misattribution creates systematic mispricing of income risk. Experienced professionals with fragile structures receive credit, capital, and confidence that their income architecture does not support. When disruption arrives, the experience provides no protection — because experience never was the structural variable that mattered.
                </P>
              </>
            ),
          },
          {
            heading: "The Six Dimensions That Determine Stability",
            body: (
              <>
                <P>
                  Income stability is the composite product of six measurable dimensions. Persistence evaluates whether income sources have demonstrated continuity over time. Diversification evaluates how many independent sources contribute to total earnings. Forward visibility evaluates how far into the future income is contractually committed or reasonably assured. Each dimension contributes independently to the structural profile.
                </P>
                <P>
                  Concentration evaluates how much of total income depends on a single source, client, or revenue channel. Variability evaluates the degree to which income fluctuates from period to period — high variability indicates structural unpredictability regardless of average amount. Labor dependence evaluates how tightly income is linked to the earner&apos;s direct, continuous personal effort.
                </P>
                <P>
                  No single dimension determines the overall score. An earner can have excellent diversification but poor forward visibility. A salaried employee can have strong persistence but extreme concentration in a single employer. The six dimensions interact to create a composite structural picture that no individual variable captures alone. This is why intuitive assessments of stability — based on one or two factors — are consistently unreliable.
                </P>
              </>
            ),
          },
          {
            heading: "Structure vs History as Predictive Framework",
            body: (
              <>
                <P>
                  Financial institutions have historically used income history as a proxy for income stability. Tax returns showing three years of consistent earnings are treated as evidence that the income will continue. This approach is equivalent to evaluating the safety of a bridge by measuring how long it has stood rather than examining its structural integrity. Time standing is not irrelevant, but it is not the same as load-bearing capacity.
                </P>
                <P>
                  Structural analysis examines the income architecture directly. How many sources exist? How concentrated are they? What contractual protections are in place? How much income continues during a 90-day absence? These questions produce answers that are diagnostic — they identify specific vulnerabilities rather than relying on historical patterns that may not repeat.
                </P>
                <P>
                  The distinction has practical consequences. A three-year agent with retainer agreements, property management fees, and four independent referral channels has structural stability that a twenty-year agent with pure commission income does not. The historical record would favor the veteran. The structural analysis would favor the newcomer. Both are measuring something real — but only one is measuring the variable that predicts future resilience.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={25} recurring={35} atRisk={40} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="20-year veteran vs 3-year agent with retainers"
        setup="Agent A has 20 years of experience, earns $210,000 annually, and generates 100% of income from residential transaction commissions. No retainers, no property management, no recurring revenue. Agent B has 3 years of experience, earns $135,000, with 40% from property management fees, 30% from buyer retainer agreements, and 30% from transaction commissions."
        risk="A market correction reduces residential transaction volume by 35% over two quarters. Agent A&apos;s income drops proportionally — from $210,000 toward $135,000 — because every dollar was transaction-dependent. Agent B&apos;s transaction income drops by 35% (losing approximately $14,000), but the property management and retainer income continues unchanged, producing a total decline of roughly 10%."
        outcome="Agent A&apos;s estimated stability score: 26-32. Agent B&apos;s estimated stability score: 51-58. The twenty-year veteran has more experience, higher earnings, and a dramatically worse structural position. The three-year agent earns less but has built an income architecture that absorbs market disruption without proportional income loss."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Years of Experience"
        right="Structural Stability"
        explanation="Years of experience measure tenure — how long someone has earned income in a domain. Structural stability measures architecture — how income sources are distributed, contracted, and protected. An earner can accumulate decades of experience without ever building structural resilience, because experience and structure are independent variables."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The number of years you have been earning is not the same as the number of reasons your income will continue." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/is-my-income-stable", label: "Is My Income Stable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does years of experience count for anything in stability measurement?",
            a: "Experience contributes to one of six dimensions — persistence. An income source that has produced revenue for ten consecutive years scores higher on persistence than one that started last quarter. But persistence is one-sixth of the composite score. If the other five dimensions are weak, strong persistence alone cannot produce a high stability rating.",
          },
          {
            q: "Can a new business have high income stability?",
            a: "Yes, if it is structured correctly from the outset. A new consultancy that launches with three retainer clients across two industries, a 12-month service agreement, and a pricing model that does not require the founder to deliver all hours personally can have a higher stability score than an established business running on handshake deals and a single revenue channel.",
          },
          {
            q: "What is the most common mistake people make about their income stability?",
            a: "Equating consistency with stability. If income has been steady for five years, the assumption is that it is stable. But consistent income can be structurally fragile — it has simply not yet been disrupted. A freelancer with one client who has paid reliably for five years has consistent income. They also have a concentration ratio of 100%. Consistency describes the past. Stability describes the structure.",
          },
          {
            q: "How do I know if my income is structurally sound?",
            a: "Ask three questions: What percentage of my income comes from my single largest source? How much income continues if I stop working for 90 days? How far into the future is my income contractually committed? If the answers are high concentration, zero continuity, and minimal forward commitment, the structure has material vulnerability regardless of current earnings.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure What Actually Matters"
        sub="Get a structural stability score based on six dimensions — not years of experience."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
