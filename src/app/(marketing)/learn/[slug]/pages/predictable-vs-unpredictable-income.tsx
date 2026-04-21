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

export default function PredictableVsUnpredictableIncome() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Visibility"
        title="Predictable vs Unpredictable Income"
        definition="Predictable income has forward visibility — you can see what's coming in 30, 60, or 90 days. Unpredictable income depends on events that haven't happened yet."
        subtitle="Forward visibility is the structural difference between managing income and reacting to it."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Predictability is determined by contractual commitments, not historical patterns",
          "Most earners confuse consistency with predictability — they are different measurements",
          "A 90-day forward visibility window is the threshold for meaningful financial planning",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What Forward Visibility Means in Practice",
            body: (
              <>
                <P>
                  Forward visibility is the ability to identify, with reasonable certainty, what income will arrive in a defined future period. It is not a forecast. It is not an estimate based on historical averages. It is income that is contractually committed, formally agreed upon, or structurally guaranteed to arrive barring an explicit cancellation event.
                </P>
                <P>
                  A salaried employee with a twelve-month contract has forward visibility through the contract term. A SaaS business with 500 annual subscribers has forward visibility based on the remaining contract duration and historical retention rates. A real estate agent with no signed listings has zero forward visibility — next month&apos;s income depends entirely on transactions that have not yet been initiated.
                </P>
                <P>
                  The measurement is not binary. Forward visibility exists in degrees. An earner may have 60% of next month&apos;s income committed and 40% dependent on uncommitted pipeline. The ratio between committed and uncommitted income at any given time horizon defines the predictability profile.
                </P>
              </>
            ),
          },
          {
            heading: "The Cost of Operating Without Visibility",
            body: (
              <>
                <P>
                  Unpredictable income forces reactive decision-making. When the earner cannot see what is coming, every financial decision carries uncertainty — hiring, investment, personal spending, and tax planning all become exercises in estimation rather than management. The psychological cost is significant, but the structural cost is greater.
                </P>
                <P>
                  Without forward visibility, the earner cannot distinguish between a temporary dip and a structural decline. A slow month in a predictable income structure is an identifiable deviation from a known baseline. A slow month in an unpredictable structure could be normal variance, the beginning of a trend, or the early signal of a client departure. The absence of forward data makes these scenarios indistinguishable in real time.
                </P>
                <P>
                  This uncertainty compounds over longer time horizons. An earner who cannot reliably predict next month&apos;s income cannot meaningfully plan for next quarter, next year, or retirement. Every long-term financial decision is built on assumptions that lack structural support.
                </P>
              </>
            ),
          },
          {
            heading: "Building Predictability Into Existing Structures",
            body: (
              <>
                <P>
                  Predictability is not an inherent property of an industry — it is a design choice in how revenue is structured. A consultant who bills hourly with no engagement letter has zero forward visibility. The same consultant who offers quarterly retainers with auto-renewal has 90 days of committed visibility at any point during the engagement. The expertise is identical. The revenue architecture is different.
                </P>
                <P>
                  The most effective approach to building predictability involves converting existing relationships into forward commitments. Annual contracts instead of month-to-month agreements. Retainers instead of hourly billing. Subscription models instead of per-transaction pricing. Each conversion extends the visibility window without requiring new client acquisition.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={30} recurring={25} atRisk={45} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Two sales reps: signed contracts vs inbound leads"
        setup="Sales Rep A has $180,000 in annual earnings with $120,000 backed by signed annual contracts from existing accounts. Rep B earns the same $180,000 but generates 100% of revenue from inbound leads with an average 45-day sales cycle. Both report identical W-2 income."
        risk="Rep A enters each quarter with 67% of income already committed. Pipeline activity determines the remaining 33%. Rep B enters each quarter with zero committed income — every dollar depends on leads that arrive, qualify, and close within the period. A two-month slowdown in inbound volume eliminates Rep B&apos;s income entirely while Rep A retains two-thirds of baseline."
        outcome="RunPayway estimates Rep A at 48-54 and Rep B at 26-32. The visibility dimension is the primary differentiator. Rep A&apos;s signed contracts provide structural predictability that Rep B&apos;s historical consistency cannot replicate."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Pipeline Visibility"
        right="Pipeline Hope"
        explanation="Pipeline visibility means income is committed — signed, contracted, or structurally guaranteed. Pipeline hope means income is expected based on historical patterns but depends on future events that may not materialize. One is a measurement. The other is an assumption."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Consistency is what happened. Predictability is what you can see. One is a rearview mirror. The other is a windshield." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is a steady paycheck the same as predictable income?",
            a: "A steady paycheck from an at-will employer provides apparent predictability but limited structural guarantee. The income appears predictable because it has been consistent, but there is no contractual commitment beyond the current pay period. True predictability requires forward commitments — contracts, agreements, or structural mechanisms that bind future payments.",
          },
          {
            q: "How far ahead should income be visible?",
            a: "The 90-day window is the threshold for meaningful financial planning. Income visible 30 days out enables basic cash flow management. Income visible 90 days out enables strategic decisions — hiring, investment, and capacity allocation. Beyond 90 days, visibility provides long-term planning confidence but with diminishing marginal impact on near-term stability.",
          },
          {
            q: "Can unpredictable income still produce high annual totals?",
            a: "Yes. Unpredictability is not about how much arrives — it is about whether you can see it coming. A real estate agent may earn $300,000 in a year without ever knowing with certainty what the next month would produce. The annual total is high. The month-to-month predictability is low. These are independent measurements.",
          },
          {
            q: "Does historical consistency create forward visibility?",
            a: "No. Historical consistency creates reasonable expectations but not structural visibility. An earner who has earned $15,000 per month for 36 consecutive months has strong consistency metrics. But if that income depends on transactions that must close each month, the forward visibility is still zero. Past performance is not a structural commitment.",
          },
          {
            q: "How does RunPayway measure forward visibility?",
            a: "The scoring model evaluates forward visibility based on the percentage of income that is contractually committed at defined time horizons — 30, 60, and 90 days. Higher percentages of committed income at longer horizons produce higher visibility scores. The measurement is structural, not historical.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="See How Visible Your Future Income Is"
        sub="Get a diagnostic score that measures forward visibility alongside five other structural dimensions."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
