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

export default function IncomeStressTestingExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Framework"
        title="Income Stress Testing Explained"
        definition="Income stress testing evaluates how a score changes under specific disruption scenarios — client loss, market slowdown, or inability to work."
        subtitle="Stability is only meaningful if it holds when conditions change. Stress testing measures whether it does."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A stability score is a baseline — stress testing reveals how far it can fall",
          "Disruption scenarios expose concentration risk that static scores obscure",
          "Most earners have never modeled what happens when a single source disappears",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What Income Stress Testing Measures",
            body: (
              <>
                <P>
                  Income stress testing applies specific disruption events to an income structure and measures the resulting change in stability score. It is not a forecast or prediction. It is a structural analysis: given this income profile, what happens to the score if a defined variable changes?
                </P>
                <P>
                  The methodology borrows from institutional risk management, where stress tests have been standard practice since the 2008 financial crisis. Banks stress-test loan portfolios against rate shocks. Insurers stress-test reserves against catastrophic loss events. Income stress testing applies the same logic to individual earning structures — modeling how specific disruptions propagate through a person&apos;s income architecture.
                </P>
                <P>
                  The value is diagnostic. A score of 52 tells you where you stand today. A stress test that drops that score to 28 under a single-client-loss scenario tells you something the baseline score cannot: that the structure is concentrated in a way that creates material downside exposure. The baseline is stable. The structure is not.
                </P>
              </>
            ),
          },
          {
            heading: "Common Disruption Scenarios",
            body: (
              <>
                <P>
                  Three categories of disruption account for the majority of income instability events. Client loss removes a revenue source entirely — a key account terminates, a retainer is not renewed, or a recurring customer shifts to a competitor. Market slowdown reduces demand across an entire sector — fewer transactions, lower deal values, extended sales cycles. Inability to work disrupts labor-dependent income when the earner cannot perform — illness, injury, caregiving obligations, or burnout.
                </P>
                <P>
                  Each scenario type tests a different structural dimension. Client loss tests concentration and diversification. Market slowdown tests sector dependency and contractual protection. Inability to work tests labor dependence and the presence of passive or semi-passive income streams. An income structure that survives one scenario type may collapse under another.
                </P>
                <P>
                  The stress test does not assign probability to any scenario. It does not estimate how likely a client loss is. It measures what happens to the score if it occurs. The distinction is important: probability is speculative, but structural impact is calculable.
                </P>
              </>
            ),
          },
          {
            heading: "Why Static Scores Are Insufficient",
            body: (
              <>
                <P>
                  A static income stability score measures the current state of an income structure. It evaluates diversification, concentration, forward visibility, variability, persistence, and labor dependence as they exist today. This is necessary but incomplete. Two earners with identical baseline scores can have dramatically different downside profiles depending on how their income sources are correlated and where concentration exists.
                </P>
                <P>
                  Consider two consultants, each scoring 52. One has five clients of roughly equal size across three industries. The other has five clients, but three of them are in the same sector and were referred by the same contact. Under normal conditions, both structures produce the same score. Under a sector downturn, the first structure loses one client. The second loses three.
                </P>
                <P>
                  Stress testing reveals these hidden correlations. It forces the analysis beyond the snapshot and into the scenario — not what is the score, but what could the score become. For any earner whose income is not fully contracted and fully diversified, this is the more important question.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={30} atRisk={55} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Consultant who loses their top client"
        setup="An independent management consultant earns $180,000 annually from four clients. The largest client accounts for 45% of total revenue — approximately $81,000 per year on a rolling engagement with no long-term contract. The other three clients contribute 20%, 20%, and 15% respectively. Baseline stability score: 52."
        risk="The top client undergoes a leadership change. The new executive brings in their own consulting firm. The engagement ends with 30 days notice. Forty-five percent of annual income disappears in a single event. The consultant&apos;s remaining three clients produce $99,000 — a 45% income reduction — and the pipeline to replace the lost revenue requires 4 to 6 months of business development."
        outcome="Stress-tested stability score: 28. The 24-point drop reveals what the baseline score obscured — that nearly half the income structure depended on a single relationship with no contractual protection. The score did not drop because the consultant performed poorly. It dropped because the structure was concentrated."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Current Score"
        right="Score Under Pressure"
        explanation="A current score describes today&apos;s structural position — how income is distributed, contracted, and diversified right now. A score under pressure describes what that structure becomes when a specific variable changes. The gap between the two is the measure of hidden risk that the baseline score cannot capture on its own."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="If your score drops by more than 15 points when a single client leaves, your stability is an illusion held together by one relationship." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/income-dependency-explained", label: "Income Dependency Explained" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How is stress testing different from a regular stability score?",
            a: "A stability score measures the current state of your income structure. A stress test applies a specific disruption — client loss, market shift, inability to work — and measures what the score becomes. The baseline tells you where you are. The stress test tells you how far you can fall.",
          },
          {
            q: "What scenarios does a stress test evaluate?",
            a: "Three primary categories: client or source loss, market or sector slowdown, and inability to work. Each targets a different structural dimension. Client loss tests concentration. Market slowdown tests sector dependency. Inability to work tests labor dependence.",
          },
          {
            q: "Can a high baseline score still produce a poor stress test result?",
            a: "Yes. A baseline score of 55 can drop to 25 under a single-client-loss scenario if income is concentrated. The baseline measures the average case. The stress test measures the downside case. Both are necessary for a complete structural picture.",
          },
          {
            q: "Does stress testing predict what will happen to my income?",
            a: "No. Stress testing is not a forecast. It does not estimate the probability of a disruption occurring. It measures the structural impact if a defined disruption does occur. The question is not whether your top client will leave — it is what happens to your score if they do.",
          },
          {
            q: "How often should income be stress-tested?",
            a: "Any time the income structure changes materially — a new client, a lost contract, a shift in revenue mix. Static scores decay as conditions evolve. Regular stress testing ensures the structural picture remains current and that hidden concentrations are identified before they become realized losses.",
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
