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

export default function IncomeStabilityVsNetWorth() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="Income Stability vs Net Worth"
        definition="Net worth measures what you've accumulated. Income stability measures whether the income funding it will continue."
        subtitle="Wealth is a snapshot. Income stability is a forecast."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Net worth is a balance sheet metric. Income stability is a cash flow metric.",
          "High net worth individuals can carry severe income fragility.",
          "Assets deplete rapidly when the income feeding them stops.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What net worth does and does not tell you",
            body: (
              <>
                <P>
                  Net worth is the most widely used measure of financial health. It captures the difference between what someone owns and what they owe at a fixed point in time. It is useful for understanding accumulated wealth, collateral capacity, and long-term solvency. It is not useful for understanding whether the income that built that wealth will continue to arrive.
                </P>
                <P>
                  This distinction matters because net worth is a trailing indicator. It reflects decisions and earnings from the past. It says nothing about the structural integrity of current income streams. A person with $2 million in net worth and a single source of unprotected freelance income is wealthier than a person with $200,000 in net worth and five diversified recurring revenue streams — but the second person&apos;s income is far more likely to persist under disruption.
                </P>
                <P>
                  Financial planning that relies exclusively on net worth assumes that accumulated assets will continue to grow or at least remain stable. That assumption depends entirely on income continuity. When income is structurally fragile, net worth becomes a depreciating asset — one that erodes with every month of reduced earnings.
                </P>
              </>
            ),
          },
          {
            heading: "The income stability gap in wealth management",
            body: (
              <>
                <P>
                  Wealth management and financial advisory services are organized around net worth tiers. Clients are segmented by assets under management, not by the durability of the income that funds those assets. This creates a systematic blind spot: the advisors managing the largest portfolios often have no visibility into whether the income sustaining those portfolios is structurally sound.
                </P>
                <P>
                  The consequences surface during disruption events. When a high-net-worth client loses a major income source — a business contract terminates, a consulting engagement ends, a commission stream dries up — the withdrawal rate from investment accounts accelerates. Asset allocation models built for accumulation phases break down when income no longer covers living expenses and the portfolio shifts from growth mode to drawdown mode.
                </P>
                <P>
                  Income stability analysis addresses this gap by evaluating the structural properties of income independently from the wealth it has produced. The question is not how much has been accumulated, but whether the mechanism of accumulation is likely to continue functioning.
                </P>
              </>
            ),
          },
          {
            heading: "How they interact in financial decision-making",
            body: (
              <>
                <P>
                  Net worth and income stability are complementary measurements that together produce a more complete financial picture than either metric alone. High net worth with high income stability represents the strongest financial position — substantial assets backed by durable income. High net worth with low income stability represents a position that appears strong but is structurally vulnerable to income disruption.
                </P>
                <P>
                  Low net worth with high income stability describes an early-career or recently-started earner whose income structure is sound even though assets have not yet accumulated. This profile is often better suited for long-term financial commitments than a high-net-worth individual with fragile income, because the income engine is more likely to continue operating.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={25} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="High net worth, unstable freelance income"
        setup="Successful creative director with $1.8M in net worth accumulated over 15 years. Left a salaried agency role two years ago to freelance. Currently earns $240,000 annually from three project-based clients. No retainer agreements. No contracts longer than 60 days."
        risk="The net worth figure masks severe income fragility. All three clients engage on a project-by-project basis. If two projects end simultaneously — a routine occurrence in creative services — income drops by 67% with no contractual buffer. The $1.8M in assets begins depleting immediately to cover fixed expenses."
        outcome="RunPayway estimates a stability score of 22-30 for this income structure. The net worth is substantial, but the income architecture supporting ongoing contributions and lifestyle costs is structurally exposed. Without income stability analysis, this fragility remains invisible until a disruption event forces asset liquidation."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="What You Have"
        right="What Keeps Coming"
        explanation="Net worth measures accumulated assets minus liabilities — a point-in-time balance sheet. Income stability measures whether the income streams funding that balance sheet are structurally durable. One looks backward at what was built. The other looks forward at whether it will be sustained."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Net worth is what you built. Income stability is whether you can keep building." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-vs-income", label: "Income Stability vs Income" },
          { href: "/learn/income-continuity-explained", label: "Income Continuity Explained" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Can high net worth compensate for low income stability?",
            a: "Temporarily. Accumulated assets provide a buffer during income disruptions, but they deplete. A person with $2M in assets and zero stable income is drawing down reserves every month. Without structural income recovery, net worth deteriorates at a predictable rate.",
          },
          {
            q: "Do wealth managers typically assess income stability?",
            a: "Not systematically. Wealth management segmentation is based on assets under management, not income structure. Most advisory relationships have no formal mechanism for evaluating whether client income is structurally durable or concentrated in fragile sources.",
          },
          {
            q: "Should income stability affect investment strategy?",
            a: "Yes. An investor with highly stable income can tolerate more portfolio risk because their cash flow is reliable. An investor with fragile income needs more liquidity and lower portfolio volatility to avoid forced selling during income disruptions.",
          },
          {
            q: "Is net worth or income stability more important?",
            a: "They measure different things and serve different purposes. Net worth captures accumulated wealth. Income stability captures the structural durability of the income that sustains and grows that wealth. Both are necessary for a complete financial assessment.",
          },
          {
            q: "How does income stability affect retirement planning?",
            a: "Income stability directly affects the accumulation phase of retirement planning. Fragile income creates irregular contributions, forced withdrawals, and portfolio disruptions that compound over time. Stable income enables consistent contributions and long-term compounding.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure the Durability Behind Your Wealth"
        sub="Get your income stability score — structure, risk exposure, and a concrete improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
