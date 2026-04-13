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

export default function HowIncomeBreaksUnderPressure() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Stress Analysis"
        title="How Income Breaks Under Pressure"
        definition="Income doesn't usually fail all at once. It fails at the weakest structural point — concentration, labor dependence, or lack of forward commitment."
        subtitle="Understanding where income breaks reveals what to reinforce before disruption occurs."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Income structures have failure modes — identifiable points where they collapse under stress",
          "The first dimension to fail determines the speed and severity of income loss",
          "Most earners discover their structural weakness only after it has already failed",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The Mechanics of Income Failure",
            body: (
              <>
                <P>
                  Income does not fail randomly. It fails at structural weak points — the dimensions where resilience is lowest. A concentrated income structure fails when the dominant source is disrupted. A labor-dependent structure fails when the earner&apos;s capacity is constrained. A structure with no forward visibility fails when the pipeline dries up. The failure mode is determined by the structural profile, not by the triggering event.
                </P>
                <P>
                  This distinction matters because it means income failure is diagnosable in advance. The structural weak point exists before the disruption that exploits it. A consultant with 80% of revenue from one client has an identifiable failure mode — the loss of that client — that can be detected and addressed before it materializes. The structural risk precedes the event.
                </P>
                <P>
                  The triggering events themselves are often unpredictable — economic downturns, client budget cuts, health events, industry shifts. But the structural response to those events is predictable. Income with strong diversification absorbs client losses differently than concentrated income. Income with forward commitments responds to market shifts differently than uncommitted income. The structure determines the outcome.
                </P>
              </>
            ),
          },
          {
            heading: "Common Failure Sequences",
            body: (
              <>
                <P>
                  Income failure rarely involves a single dimension. It typically follows a cascade pattern where weakness in one dimension amplifies failure in others. The most common sequence begins with concentration: the dominant income source is disrupted. This triggers a visibility failure — without the primary source, there is no committed pipeline to replace it. The visibility gap then exposes labor dependence — the earner must personally sell, network, and close new business to rebuild income from zero.
                </P>
                <P>
                  A second common pattern begins with a market contraction. Demand for the earner&apos;s services declines across all sources simultaneously. If the income structure lacks diversification across industries or revenue types, the contraction affects the entire base. Forward visibility collapses because uncommitted pipeline disappears. The earner is left with only the structurally committed portion of income — which, in many cases, is negligible.
                </P>
                <P>
                  A third pattern involves labor disruption. The earner experiences a health event, burnout, or personal obligation that reduces capacity. In a fully active income structure, reduced capacity produces proportionally reduced income. If the income is also concentrated, the capacity reduction may trigger client departure — the dominant client seeks alternative providers — converting a temporary disruption into a permanent structural loss.
                </P>
              </>
            ),
          },
          {
            heading: "Why Pressure Reveals What Prosperity Hides",
            body: (
              <>
                <P>
                  During periods of strong market conditions, high demand, and personal peak performance, structural weaknesses are invisible. Concentrated income feels safe because the dominant client is happy. Labor-dependent income feels sustainable because the earner is energized. Unpredictable income feels predictable because deals keep closing. The symptoms of instability are masked by favorable conditions.
                </P>
                <P>
                  Pressure removes the mask. When conditions deteriorate — even modestly — the structural weaknesses that were always present begin to produce visible consequences. The client that accounted for 60% of revenue renegotiates. The earner who billed 50 hours per week can only manage 30. The pipeline that always had three proposals pending goes quiet for six weeks. None of these events are catastrophic in isolation. But in a structurally fragile income system, each one exposes the next weakness in the chain.
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
        title="Consultant who loses their top client during a downturn"
        setup="An independent management consultant earns $210,000 annually. One client accounts for $135,000 — a Fortune 500 company on a month-to-month consulting agreement. Three smaller clients contribute the remaining $75,000. The consultant has no signed engagements beyond current billing cycles and operates with 100% labor dependence."
        risk="A market downturn triggers the Fortune 500 client to cut external consulting spend. The month-to-month agreement provides no protection — the engagement ends with 30 days notice. The consultant loses 64% of income in a single event while the remaining three clients simultaneously reduce scope due to the same economic conditions. Within 90 days, effective income drops to approximately $45,000 annualized."
        outcome="RunPayway estimates the pre-disruption score at 21-27. The concentration, visibility, and labor dependence dimensions are all critically weak. The downturn did not cause the failure — it revealed the failure modes that were present throughout the high-earning period. Restructuring around four to six clients with quarterly commitments would have produced a pre-disruption score of 42-50."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Stable Months"
        right="Stable Structure"
        explanation="Stable months describe a historical pattern — income that has been consistent over a given period. Stable structure describes an architectural property — income that is built to withstand disruption. A string of stable months can emerge from an unstable structure. A stable structure can survive an unstable month. They are not the same measurement."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Income does not break because of bad luck. It breaks at the point where structural weakness meets external pressure. The weakness was there all along." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/structural-income-risk-explained", label: "Structural Income Risk Explained" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/predictable-vs-unpredictable-income", label: "Predictable vs Unpredictable Income" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Can income break even during good economic conditions?",
            a: "Yes. Income failure does not require a recession or market downturn. A single client decision, a personal health event, or an industry regulatory change can trigger failure in a structurally weak income system regardless of broader economic conditions. Structural risk is independent of market conditions.",
          },
          {
            q: "Is there a way to predict which dimension will fail first?",
            a: "The dimension with the lowest score in your stability profile is the most likely point of failure under pressure. If concentration is your weakest dimension, client loss is your primary risk. If labor dependence is weakest, personal capacity disruption is the primary risk. The diagnostic score identifies the failure hierarchy.",
          },
          {
            q: "How quickly does income typically deteriorate once it starts breaking?",
            a: "The speed depends on the structural profile. Concentrated income can lose 50-70% of its value in a single event. Diversified income with forward commitments may deteriorate gradually over 6-12 months. The more structural protections in place, the slower and more manageable the decline.",
          },
          {
            q: "Can a high income offset structural weakness?",
            a: "High income can create cash reserves that buffer the financial impact of structural failure, but it does not prevent the failure itself. A high earner with fragile structure and six months of savings has more time to rebuild than one without savings. But the income still breaks at the same structural point. Savings buy time. Structure prevents the break.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "Find Your Structural Weak Points", href: "/begin" },
          { text: "Get Your Stability Diagnostic", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="See Where Your Income Would Break"
        sub="Get a diagnostic score that identifies your structural weak points before disruption reveals them."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
