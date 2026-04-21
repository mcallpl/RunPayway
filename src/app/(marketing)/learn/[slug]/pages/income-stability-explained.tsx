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

export default function IncomeStabilityExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Framework"
        title="Income Stability Explained"
        definition="A framework for understanding whether income continues, repeats, and holds under pressure."
        subtitle="Income stability is not about how much you earn. It is about whether your income survives disruption."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Stability is a structural property, not a dollar figure",
          "Six dimensions determine whether income holds under pressure",
          "Most earners have never measured their income structure",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What Makes Income Stable vs Unstable",
            body: (
              <>
                <P>
                  Stable income is income that continues at or near its current level when external conditions change. It is not defined by amount, growth rate, or historical consistency. It is defined by the structural characteristics that determine whether earnings persist when a client leaves, a market shifts, or a contract expires.
                </P>
                <P>
                  Unstable income is income that depends on conditions that can change without warning. A real estate agent earning $250,000 in a strong market may see that figure collapse by 60% in a downturn — not because of poor performance, but because the income was structurally tied to market conditions outside their control. The income was high. It was never stable.
                </P>
                <P>
                  The distinction matters because most financial decisions assume income continuity. Mortgage approvals, lease agreements, hiring decisions, and retirement planning all rely on the implicit assumption that current income will persist. When income is structurally fragile, that assumption fails — often without warning.
                </P>
              </>
            ),
          },
          {
            heading: "The Six Dimensions of Income Stability",
            body: (
              <>
                <P>
                  Income stability is not a single variable. It is the product of six structural dimensions that together determine how resilient an income stream is. Persistence measures whether income sources have historical continuity. Diversification measures how many independent sources contribute to total earnings. Forward visibility measures how far into the future income is contractually committed.
                </P>
                <P>
                  Concentration measures how much of total income depends on a single source or client. Variability measures the degree to which monthly or quarterly income fluctuates from its baseline. Labor dependence measures how tightly income is linked to the earner&apos;s direct time and effort — income that stops the moment the earner stops working scores lower on this dimension.
                </P>
                <P>
                  Each dimension contributes independently to the overall stability profile. An earner can score well on diversification but poorly on forward visibility. The composite picture reveals where structural risk concentrates and where resilience exists.
                </P>
              </>
            ),
          },
          {
            heading: "How Stability Differs from Income Amount",
            body: (
              <>
                <P>
                  Income amount and income stability are independent measurements. A surgeon earning $500,000 per year from a single hospital with no employment contract has high income and low stability. A property manager earning $85,000 from twelve rental units with twelve-month leases has lower income and substantially higher structural resilience.
                </P>
                <P>
                  Traditional financial analysis conflates these two dimensions. Tax returns show how much was earned. Bank statements show when money arrived. Neither instrument evaluates whether the earning structure is likely to hold. This creates a systematic blind spot: high earners with fragile structures are treated as financially strong, while modest earners with resilient structures are undervalued.
                </P>
                <P>
                  Income stability introduces the missing dimension. It does not replace income amount as a metric — it complements it. A complete financial picture requires both: how much is earned, and how structurally sound that earning is.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={20} recurring={30} atRisk={50} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Small business owner with seasonal revenue"
        setup="A landscaping business owner earns $165,000 annually. Revenue concentrates in April through October, with December through February generating less than 8% of annual income. Two commercial contracts provide 40% of revenue; the remainder comes from one-time residential jobs with no forward commitment."
        risk="Seasonal concentration creates a predictable annual cash flow trough, but the deeper structural risk is source dependency. If either commercial contract is not renewed, 20% of annual income disappears in a single event. The residential pipeline has zero forward visibility — each job must be individually acquired."
        outcome="RunPayway estimates a stability score of 31-37 for this profile. The seasonal pattern alone is manageable, but combined with low diversification and minimal contractual protection, the overall structure is materially fragile. Adding two more commercial contracts with twelve-month terms would shift the score into the 48-55 range."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Earning $200K"
        right="Keeping $200K"
        explanation="Earning $200,000 describes a historical event — income that was received in a prior period. Keeping $200,000 describes a structural condition — whether the sources, contracts, and diversification patterns that produced that income are likely to produce it again. The first is a fact about the past. The second is a probability about the future."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Income that cannot survive a single client loss is not stable income. It is a concentration bet." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is income stability only relevant for freelancers and gig workers?",
            a: "No. Income stability applies to any earning structure — salaried, self-employed, portfolio-based, or hybrid. A salaried employee with no contract in an at-will state has measurable structural risk. A freelancer with eight diversified retainer clients may have higher stability than a W-2 employee. The measurement applies universally.",
          },
          {
            q: "Can income be high and unstable at the same time?",
            a: "Yes. Income amount and income stability are independent dimensions. A top-producing real estate agent earning $350,000 with 90% of revenue from commission-based transactions has high income and low structural stability. The amount is large. The structure is fragile.",
          },
          {
            q: "How is income stability different from income consistency?",
            a: "Consistency describes historical pattern — whether income has been steady over time. Stability describes structural resilience — whether income is likely to continue under adverse conditions. Income can appear consistent for years and collapse overnight if the underlying structure is concentrated. Consistency is backward-looking. Stability is forward-looking.",
          },
          {
            q: "Does seasonal income automatically mean low stability?",
            a: "Not necessarily. Seasonal patterns reduce one dimension of stability (variability), but an earner with strong diversification, contractual protection, and low concentration can have moderate-to-good overall stability despite seasonal fluctuation. The score reflects the composite of all six dimensions, not any single factor.",
          },
          {
            q: "What is a good income stability score?",
            a: "Scores above 60 indicate structurally resilient income. Scores between 40 and 60 indicate moderate stability with identifiable concentration risks. Scores below 40 indicate material structural fragility. The score is not a grade — it is a diagnostic measurement that identifies where structural risk exists.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Understand Your Income Structure"
        sub="Get a diagnostic score across all six dimensions of income stability."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
