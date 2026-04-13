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

export default function IncomeStabilityIndex() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scoring Model"
        title="Income Stability Index"
        definition="The Income Stability Index is a composite score from 0 to 100 that measures how income holds under disruption, based on six structural dimensions."
        subtitle="The index does not measure how much you earn. It measures how structurally sound your earning is."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "The score is deterministic — same inputs always produce the same result",
          "Six dimensions contribute independently to the composite measurement",
          "The index measures structural resilience, not income amount or growth rate",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What the Index Measures",
            body: (
              <>
                <P>
                  The Income Stability Index evaluates six structural dimensions of income: concentration, diversification, forward visibility, labor dependence, variability, and persistence. Each dimension is scored independently based on the factual characteristics of the earner&apos;s income structure. The composite score represents the weighted interaction of all six dimensions, producing a single measurement from 0 to 100.
                </P>
                <P>
                  The index does not evaluate income amount, growth trajectory, industry conditions, or market opportunity. A surgeon earning $600,000 and a property manager earning $80,000 are scored on the same structural dimensions using the same methodology. The surgeon may score lower if the income is concentrated, labor-dependent, and lacking forward contractual commitment. The property manager may score higher if the income is diversified across multiple leases with twelve-month terms.
                </P>
                <P>
                  This is by design. Income amount and income stability are independent measurements. The index captures the dimension that traditional financial assessment systematically omits: whether the income structure is likely to hold under adverse conditions.
                </P>
              </>
            ),
          },
          {
            heading: "The Six Dimensions in Detail",
            body: (
              <>
                <P>
                  Concentration measures the degree to which income depends on a single source or client. High concentration means a single loss event can eliminate a material share of earnings. Diversification measures the breadth of independent income sources — more sources with lower individual weight produce higher diversification scores. These two dimensions are related but not redundant: an earner can have moderate concentration but poor diversification if the remaining sources are correlated.
                </P>
                <P>
                  Forward visibility measures how much of future income is contractually committed at defined time horizons. Labor dependence measures what percentage of income requires the earner&apos;s direct, ongoing participation to continue. Variability measures the degree of period-to-period fluctuation in income, independent of trend. Persistence measures whether income sources have demonstrated continuity over historical periods.
                </P>
                <P>
                  Each dimension operates independently. An earner can score 80 on diversification and 15 on forward visibility. The composite score reflects the contribution of each dimension, identifying both strengths and vulnerabilities in the overall structure. No single high-scoring dimension can fully compensate for a critically weak one.
                </P>
              </>
            ),
          },
          {
            heading: "How to Interpret the Score",
            body: (
              <>
                <P>
                  Scores above 60 indicate structurally resilient income — income that can absorb disruption across multiple dimensions without catastrophic loss. Scores between 40 and 60 indicate moderate structural stability with identifiable concentration points or dimensional weaknesses. Scores below 40 indicate material structural fragility — income that is vulnerable to single-event disruption.
                </P>
                <P>
                  The score is diagnostic, not evaluative. A score of 32 does not mean the earner is financially irresponsible. It means the income structure has identifiable points where it would fail under pressure. The purpose of the measurement is to make those points visible so they can be addressed through structural modification — not to render judgment on the earner&apos;s financial decisions.
                </P>
                <P>
                  Dimensional breakdowns accompanying the composite score reveal where risk concentrates. An overall score of 45 might reflect strong diversification and persistence offset by critical weakness in forward visibility and labor dependence. The dimensional detail provides the actionable insight — it identifies which specific structural changes would produce the largest improvement in overall resilience.
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
        title="How a score of 45 breaks down across six dimensions"
        setup="A marketing consultant earns $155,000 annually from four clients. One client represents 45% of revenue. Three clients are on month-to-month agreements; one has a six-month contract. All income requires direct labor. Monthly income has ranged from $9,500 to $16,200 over the past twelve months. All four client relationships have persisted for at least eighteen months."
        risk="The dimensional breakdown reveals: Concentration — 28 (one client at 45% creates material dependency). Diversification — 42 (four sources, but insufficient independence). Forward visibility — 30 (only one contract extends beyond 30 days). Labor dependence — 18 (100% active income). Variability — 52 (moderate fluctuation within a manageable band). Persistence — 68 (all sources have demonstrated 18+ month continuity)."
        outcome="The composite score of 45 masks significant dimensional divergence. Persistence and variability are structurally sound. Concentration and labor dependence are critically weak. Forward visibility is below the threshold for meaningful planning confidence. The most impactful structural changes would be: converting two clients to quarterly commitments (visibility), acquiring two additional clients to reduce the dominant client below 30% (concentration), and developing a productized offering to reduce labor dependence."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Credit Score"
        right="Stability Score"
        explanation="A credit score measures how you have managed debt obligations in the past — payment history, utilization, account age. A stability score measures how your income is structurally built to withstand disruption in the future. One looks backward at financial behavior. The other looks forward at income architecture. They measure different things entirely."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A credit score tells lenders whether you pay your bills. A stability score tells you whether your income will be there to pay them." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/structural-income-risk-explained", label: "Structural Income Risk Explained" },
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/predictable-vs-unpredictable-income", label: "Predictable vs Unpredictable Income" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How often should I check my stability score?",
            a: "The score is most useful when your income structure changes — adding or losing a client, signing or completing a contract, launching a new revenue stream, or experiencing a significant shift in revenue distribution. Quarterly review is a reasonable cadence for most earners. The score reflects structural architecture, which changes less frequently than income amount.",
          },
          {
            q: "Can the score change without my income changing?",
            a: "Yes. If a contract expires, a client relationship shifts from annual to month-to-month, or concentration increases because one client grows faster than others, the structural profile changes even though the dollar amount may remain constant. The score measures structure, not amount.",
          },
          {
            q: "Is a perfect score of 100 achievable?",
            a: "A score of 100 would require maximum resilience across all six dimensions simultaneously — fully diversified, zero concentration, 100% forward visibility, zero labor dependence, minimal variability, and complete persistence. This theoretical maximum is virtually unattainable in practice. Scores above 75 represent exceptionally resilient structures. The goal is not perfection but identification and remediation of critical weaknesses.",
          },
          {
            q: "Does a higher income automatically produce a higher score?",
            a: "No. Income amount is not a variable in the scoring model. A $500,000 earner with concentrated, labor-dependent, uncommitted income will score lower than a $90,000 earner with diversified, partially passive, contractually committed income. The index measures structure, not magnitude.",
          },
          {
            q: "How does the index handle multiple income types?",
            a: "The scoring model evaluates all income sources within the earner&apos;s total structure. W-2 salary, 1099 consulting, rental income, royalties, and investment returns are all assessed as components of the overall income architecture. Each source contributes to or detracts from the relevant dimensions based on its structural characteristics.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "Get Your Stability Score", href: "/begin" },
          { text: "See Your Dimensional Breakdown", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Income Stability"
        sub="Get your composite score and dimensional breakdown across all six structural dimensions."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
