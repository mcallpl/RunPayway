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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function ContractorProjectBasedRisk() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Contractor — Project-Based Risk"
        definition="Project-based income creates a structural gap between projects. The risk isn't the work — it's the space between signed contracts."
        subtitle="Why consistent project delivery does not eliminate income gaps."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Gaps between projects are structural — not a sign of underperformance",
          "Four projects per year means three to four potential zero-income gaps",
          "Estimated stability score for sequential project work: 25-35",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The structural problem with project-based income",
            body: (
              <>
                <P>
                  Project-based income operates on a start-stop cycle. A contractor begins a project, earns revenue through progress billing or milestone payments, completes the project, and then faces a gap before the next project starts. This gap is not optional — it is a structural feature of project-based work. Between projects, the contractor must source the next opportunity, prepare a bid or proposal, negotiate terms, execute a contract, and mobilize resources. Each of these steps takes time, and during that time, income is zero.
                </P>
                <P>
                  The gap duration is unpredictable. A contractor may transition from one project to the next in two weeks, or face an eight-week gap while waiting for permits, client decisions, or seasonal conditions. The contractor cannot control most of the variables that determine gap length — client decision timelines, municipal permitting processes, material availability, and weather conditions are all external factors that extend the period between signed contracts.
                </P>
                <P>
                  During the gap, the contractor&apos;s expenses continue. Insurance premiums, equipment leases or payments, vehicle costs, office or shop rent, and in many cases crew wages or subcontractor commitments do not pause between projects. The gap is not merely a revenue interruption — it is a period of negative cash flow where the contractor is spending without earning. The longer the gap, the deeper the cash deficit that must be recovered from the next project&apos;s revenue.
                </P>
              </>
            ),
          },
          {
            heading: "How the math works for a typical contractor",
            body: (
              <>
                <P>
                  A contractor earning $180,000 annually from four projects averaging $45,000 each appears to have stable, predictable income. Divided evenly, that is $15,000 per month. But project-based revenue does not arrive evenly. Each project generates revenue over its active duration — typically 8 to 12 weeks — followed by a gap of 3 to 6 weeks. The actual monthly income pattern might look like: $22,000, $18,000, $20,000 (active project), then $0, $0, $3,000 (gap and mobilization), then $25,000, $15,000, $22,000 (next project), then $0, $0 (next gap).
                </P>
                <P>
                  The zero-income months are the structural vulnerability. A contractor who averages $15,000 per month but experiences two to three months of zero income annually must maintain cash reserves sufficient to cover those months. If monthly overhead is $8,000, each zero-income month creates an $8,000 deficit. Two zero-income months create a $16,000 annual cash flow hole that must be funded from project revenue or savings.
                </P>
                <P>
                  Project delays compound the gap problem. A project that was scheduled to start on March 1 but is delayed to April 15 due to permitting issues extends the gap by six weeks — six weeks of overhead with no revenue. The delay may not affect the total annual revenue if the project still completes within the year, but it concentrates the gap burden into a longer continuous period. Extended gaps create financial pressure that can force contractors to accept lower-margin work to restore cash flow, further compressing profitability.
                </P>
              </>
            ),
          },
          {
            heading: "Strategies to reduce gap exposure",
            body: (
              <>
                <P>
                  Overlapping project timelines are the most direct structural solution. A contractor who begins business development for the next project while the current project is at 60-70% completion can reduce or eliminate the gap. This requires treating business development as a continuous parallel activity rather than a sequential one — estimating, bidding, and negotiating the next project while still delivering the current one. The operational complexity increases, but the income continuity improves measurably.
                </P>
                <P>
                  Maintenance contracts and recurring service agreements create a revenue floor between projects. A contractor who maintains annual service agreements with previous clients — HVAC maintenance, property inspections, seasonal preparation work — generates baseline revenue that persists regardless of project status. Even $3,000 to $5,000 per month in maintenance revenue transforms a zero-income gap into a reduced-income period, which is a structurally different situation for both cash flow and stability scoring.
                </P>
                <P>
                  Staggering project sizes creates natural overlap opportunities. A contractor who pursues one large project ($60,000-$80,000) and two smaller projects ($20,000-$30,000 each) simultaneously can maintain continuous revenue because the smaller projects fill the gaps around the large project&apos;s timeline. This diversified project portfolio reduces the probability that all projects conclude simultaneously, which is the scenario that creates the longest and most damaging gaps.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Contractor earns $180,000 annually from four projects averaging $45,000 each. Projects run 8-12 weeks with 3-6 week gaps between them. No recurring revenue. No maintenance contracts. Monthly overhead (insurance, equipment, vehicle, shop): $8,000. All income is project-based with progress billing."
        riskExposure="Three to four zero-income gaps per year, each lasting 3-6 weeks. No recurring revenue to cover overhead during gaps. Each gap creates an $8,000 to $12,000 cash flow deficit that must be absorbed by savings or recovered from the next project. Total annual gap cost: $24,000 to $48,000 in overhead paid without revenue."
        disruption="One of the four projects is delayed by two months due to client permitting issues. The project was scheduled to begin immediately after the current project's completion. The gap extends from the typical 3-6 weeks to 11-14 weeks. Overhead during the extended gap: $22,000 to $28,000. The contractor now has three projects instead of four in the fiscal year, reducing annual revenue from $180,000 to $135,000 while fixed costs remain constant."
        scoreRange="25-35. Sequential project execution with regular gaps and no recurring revenue floor. The score reflects the structural reality that income is intermittent by design, with zero-income periods that are unpredictable in both frequency and duration. Contractors who overlap projects or maintain service agreements score toward the upper end."
        howToFix="Add maintenance contracts with previous clients to create recurring monthly revenue ($3,000-$5,000/month target). Begin business development for next project at 60% completion of current project to reduce gap duration. Pursue a mix of project sizes to enable timeline overlap. Build a cash reserve equal to three months of overhead ($24,000) specifically designated for gap periods. Target structure: 70% project revenue, 30% recurring/maintenance revenue."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={15} atRisk={80} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="The two-month delay that costs more than the gap"
        setup="A contractor finishes a $50,000 kitchen renovation in early March. The next project — a $55,000 bathroom and basement remodel — was scheduled to start March 15. The client's permit application is delayed by the municipal building department. The revised start date is pushed to May 15. The contractor's March pipeline has no other signed contracts."
        risk="The contractor faces 10 weeks of zero revenue instead of the planned 2-week transition. Monthly overhead of $8,000 continues. The gap cost: approximately $20,000 in overhead with no offsetting revenue. The contractor's annual income drops from $180,000 to $160,000 — the $20,000 gap cost — even though the delayed project will still be completed and paid in full."
        outcome="Estimated stability score: 26-32. The delay does not reduce the contractor's project capacity or billing rates. It creates a cash flow deficit during a period the contractor cannot control. The total annual impact exceeds the gap cost itself because the compressed timeline forces the contractor to rush business development for subsequent projects, potentially accepting lower-margin work to rebuild cash reserves."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Project Revenue"
        right="Continuous Revenue"
        explanation="Project revenue arrives in concentrated bursts tied to specific deliverables and timelines. Continuous revenue arrives predictably regardless of project status. A contractor earning $180,000 from four projects has high project revenue but intermittent income. A contractor earning $140,000 from three projects plus $40,000 from maintenance contracts has lower project revenue but continuous income. The stability score reflects the structural continuity, not the total amount."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The gap between projects is not a break. It is an unpaid period with full financial obligations." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-contractors", label: "Income Stability for Contractors" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I only have short gaps between projects — does that still affect my score?",
            a: "Yes. Even short gaps of two to three weeks create zero-income periods where overhead continues. The scoring model evaluates the structural pattern — income that stops and restarts is inherently less stable than income that continues uninterrupted. Short gaps are better than long gaps, but any gap represents a structural vulnerability that continuous revenue does not have.",
          },
          {
            q: "Can I just save during projects to cover the gaps?",
            a: "Saving during active projects to fund gaps is a cash management strategy, not a structural improvement. It addresses the symptom (cash flow during gaps) without changing the cause (income that stops between projects). The stability score evaluates income structure, not savings behavior. A contractor with excellent savings and intermittent income still has an intermittent income structure.",
          },
          {
            q: "How much should maintenance contracts contribute to total revenue?",
            a: "A target of 20-30% of total revenue from maintenance and recurring service agreements materially improves income stability. For a contractor earning $180,000, this means $36,000 to $54,000 annually in recurring revenue — approximately $3,000 to $4,500 per month. This floor covers a significant portion of monthly overhead during project gaps and transforms zero-income months into reduced-income months.",
          },
          {
            q: "Does having subcontractors reduce project gap risk?",
            a: "Subcontractors can enable overlapping project execution, which reduces gap risk by allowing the contractor to manage multiple active projects simultaneously. However, subcontractor costs reduce project margins, and managing multiple concurrent projects increases operational complexity. The trade-off is worth evaluating: lower margins on overlapping projects may produce more stable annual income than higher margins on sequential projects with gaps.",
          },
          {
            q: "What if my projects are seasonal?",
            a: "Seasonal concentration compounds gap risk. A contractor who generates 80% of revenue in six months faces an extended gap during the off-season. The structural solution is developing off-season revenue sources — interior work during winter months, maintenance services, consulting, or planning and estimation work that generates income during the period when primary project work is not available. Seasonality is a structural characteristic that the scoring model weights as a risk factor.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Score Your Contracting Income", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Find Out Where You Stand"
        sub="Get your income stability score and identify the specific gap risks in your project-based income."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
