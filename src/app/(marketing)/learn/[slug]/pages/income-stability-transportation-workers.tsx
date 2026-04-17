"use client";

import {
  LearnHero,
  QuickInsightStrip,
  CoreContent,
  P,
  IndustryBlock,
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

export default function IncomeStabilityTransportationWorkers() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Transportation Workers"
        definition="Transportation income depends on utilization. An idle truck earns nothing. Income stability requires consistent routes, committed volume, and minimal downtime."
        subtitle="Miles driven without committed freight is activity without structural income protection."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Transportation income is load-based — no freight means no revenue",
          "Spot market dependency creates extreme income variability",
          "Fuel and maintenance costs compress margins regardless of revenue volume",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How Transportation Income Works",
            body: (
              <>
                <P>
                  Transportation income — for owner-operators, fleet owners, and independent freight carriers — is fundamentally utilization-based. Revenue is generated when a vehicle is loaded and moving. An idle truck produces zero revenue while continuing to generate fixed costs: insurance, loan payments, permits, and depreciation. The income model is binary in a way that few other industries replicate — either the truck is working or it is a pure liability.
                </P>
                <P>
                  Revenue per load depends on route distance, freight type, market conditions, and whether the load was secured through a contracted rate or the spot market. Contracted freight provides predetermined rates for defined lanes over fixed periods — typically quarterly or annually. Spot market freight is priced in real time based on supply and demand, producing rates that can fluctuate 30% to 50% within a single month. The mix between contracted and spot freight is the primary structural variable that determines income predictability.
                </P>
                <P>
                  Operating costs in transportation are both substantial and partially uncontrollable. Fuel represents 25% to 35% of gross revenue and fluctuates with commodity markets. Maintenance is unpredictable — a major repair can cost $5,000 to $15,000 and take the vehicle offline for days or weeks. Insurance premiums increase with miles driven and claims history. The margin between gross revenue and net income is narrow, and disruptions on either the revenue or cost side can eliminate it entirely.
                </P>
              </>
            ),
          },
          {
            heading: "Spot Market vs Contracted Freight",
            body: (
              <>
                <P>
                  The structural difference between spot market and contracted freight is the difference between market-rate income and committed income. Spot freight is available immediately but at prices determined by momentary supply-demand conditions. When freight demand is high and carrier capacity is tight, spot rates spike and owner-operators earn well above average. When demand softens or capacity enters the market, spot rates collapse — sometimes below operating cost.
                </P>
                <P>
                  Contracted freight eliminates rate volatility by locking in pricing for defined lanes over defined periods. A carrier with 80% contracted freight knows what they will earn per mile on most loads for the next quarter or year. This forward visibility is the structural foundation of income stability in transportation. The rates may be lower than peak spot rates, but they persist when the spot market crashes.
                </P>
                <P>
                  Owner-operators who run primarily on spot freight are structurally equivalent to day traders — their income depends on real-time market conditions that they cannot predict or control. The income can be excellent in favorable conditions and devastating in unfavorable ones. There is no mechanism for income smoothing, no contractual floor, and no forward visibility. Each load is an independent market transaction with no relationship to the next.
                </P>
              </>
            ),
          },
          {
            heading: "Utilization Gaps and Deadhead Risk",
            body: (
              <>
                <P>
                  Utilization gaps are the silent structural risk in transportation income. A truck that runs loaded in one direction and returns empty — deadheading — has generated revenue on only half its miles while incurring fuel and maintenance costs on all of them. A carrier that waits three days between loads has three days of fixed costs with zero revenue. These gaps are structurally inherent in the industry and represent the difference between gross revenue per loaded mile and actual income per operational mile.
                </P>
                <P>
                  The financial impact of low utilization is severe because transportation has high fixed costs relative to variable costs. The loan payment, insurance premium, and permit fees are identical whether the truck runs 10,000 miles or 2,000 miles in a month. Low utilization spreads those fixed costs across fewer revenue-generating miles, compressing the per-mile margin that produces owner income. A carrier operating at 65% utilization may have zero net income even with competitive per-load rates.
                </P>
                <P>
                  Route optimization and load matching mitigate utilization risk but do not eliminate it. An owner-operator committed to specific lanes may lack return freight in one direction. A carrier serving seasonal industries — agriculture, construction materials — may face utilization drops of 40% to 50% during off-peak months. The structural solution is contracted round-trip routes or dedicated lane agreements, but these are not available to all carriers and require scale and reliability track records to secure.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block */}
      <IndustryBlock
        industry="Transportation"
        howIncomeWorks="Load-based revenue minus fuel, maintenance, insurance, and equipment costs. Income depends on utilization — loaded miles versus total miles and total days. Revenue splits between contracted freight (fixed rates, committed lanes) and spot market freight (variable rates, no commitment). Owner-operators net 15% to 25% of gross revenue as income after all operating costs."
        typicalRange="30-45. Carriers with 70%+ contracted freight, dedicated routes, and multi-customer diversification score toward the upper range. Spot-dependent owner-operators with single-lane focus and high deadhead ratios score toward the lower range. Fleet size does not independently improve stability — structural characteristics of the freight book determine the score."
        biggestRisk="Utilization gaps combined with spot market dependency. An owner-operator running 70% spot freight faces rate volatility they cannot control, and any downtime — mechanical failure, seasonal demand drops, route disruption — produces zero revenue against continuing fixed costs. The margin is thin enough that a 20% rate decline or a two-week maintenance event can eliminate a quarter&apos;s net income."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={25} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Owner-operator running 70% spot freight, fuel costs spike 25%"
        setup="An independent owner-operator runs a single Class 8 truck, generating $280,000 in annual gross revenue. The freight mix is 70% spot market and 30% contracted. The contracted lanes provide a $2.10 per mile rate on a consistent Midwest route. Spot loads average $2.45 per mile but fluctuate between $1.80 and $3.20 depending on market conditions. Annual fuel cost is approximately $70,000 at current prices."
        risk="Diesel prices increase 25% over four months, adding approximately $17,500 to annual fuel costs. Simultaneously, a softening freight market pushes spot rates down 18% — from an average of $2.45 to $2.01 per mile. The contracted freight maintains its rate but covers only 30% of loaded miles. The combined effect compresses revenue while expanding costs from both directions."
        outcome="Estimated stability score: 25-31. The owner-operator&apos;s net income drops from approximately $58,000 to under $20,000 annually. The 70% spot exposure meant that most revenue was repriced downward by market conditions, while the 25% fuel cost increase was non-negotiable. The contracted freight provided a partial floor, but at only 30% of volume, it could not offset the spot market decline. The income structure had insufficient cost protection and excessive market exposure."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Miles Driven"
        right="Revenue Locked"
        explanation="Miles driven measures activity — how much the truck operates. Revenue locked measures commitment — how much of that activity has predetermined pricing through contracts. An owner-operator driving 120,000 miles annually with no contracted freight has maximum activity and zero pricing certainty. Revenue locked means knowing what each mile will pay before the truck moves."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A truck that runs every day on spot freight is not a stable business. It is a daily bet on market conditions with a $150,000 piece of collateral." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-small-business-owners", label: "Income Stability for Small Business Owners" },
          { href: "/learn/income-stability-contractors", label: "Income Stability for Contractors" },
          { href: "/learn/income-dependency-explained", label: "Income Dependency Explained" },
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/income-stress-testing-explained", label: "Income Stress Testing Explained" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does having a newer truck improve income stability?",
            a: "A newer truck reduces maintenance disruption risk, which can improve utilization rates. However, it also increases fixed costs through higher loan payments. The net stability impact depends on whether the reduced downtime generates enough additional revenue to offset the higher debt service. Equipment age affects one cost variable but does not change the structural characteristics of the freight book.",
          },
          {
            q: "How much contracted freight do I need for a good stability score?",
            a: "Carriers with 70% or more of loaded miles on contracted rates tend to score in the upper portion of the transportation range (38-45). Below 50% contracted, the spot market exposure introduces enough rate volatility to compress stability scores significantly. The precise impact depends on the contract terms, lane consistency, and whether contracts include fuel surcharge provisions.",
          },
          {
            q: "Does running a fleet instead of a single truck improve stability?",
            a: "Fleet operation can improve stability through diversification — multiple trucks on different routes spread utilization risk. However, it also multiplies fixed costs and introduces management complexity. A three-truck fleet running 80% spot freight is not structurally more stable than a single truck with 80% contracted freight. Fleet size does not substitute for freight book structure.",
          },
          {
            q: "How do fuel surcharges affect income stability?",
            a: "Fuel surcharges on contracted freight provide structural cost protection — as fuel prices rise, the surcharge partially offsets the increased expense. Spot market loads may or may not include surcharges, and when they do, the surcharge amount is negotiated per load with no guarantee of adequate cost recovery. Having fuel surcharges built into contracted rates is a meaningful structural protection.",
          },
          {
            q: "Is leasing better than owning for income stability?",
            a: "Leasing can reduce some fixed cost risk (maintenance responsibility may transfer to the lessor) but typically increases the per-mile cost of operation. The stability impact depends on the specific lease terms. A full-service lease that covers maintenance and insurance reduces cost variability but compresses margins. The net effect on stability is neutral to slightly positive for cost predictability, with a corresponding reduction in upside potential.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "Assess Your Freight Book", href: "/begin" },
          { text: "See a Sample Report", href: "/sample-report" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Know Your Utilization Risk"
        sub="Get a structural stability score that measures your freight book, not your odometer."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
