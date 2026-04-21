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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityRealEstateAgents() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Real Estate Agents"
        definition="Real estate agents earn through commissions — large, irregular payments tied to transaction closings. This creates structural income fragility that is distinct from earning potential."
        subtitle="Why high-earning agents can still have dangerously low income stability."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Commission income is structurally irregular by design",
          "Pipeline dependency replaces employer dependency",
          "Most agents score between 25 and 45 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How real estate income works",
            body: (
              <>
                <P>
                  Real estate agents earn commissions on closed transactions. A typical residential agent receives 2.5% to 3% of the sale price, split with their brokerage. On a $400,000 home, the agent&apos;s gross commission before brokerage split is approximately $10,000 to $12,000. After the split, the agent may net $5,000 to $8,000 per transaction depending on their arrangement.
                </P>
                <P>
                  This payment structure means income arrives in large, infrequent installments rather than regular intervals. An agent who closes four transactions per quarter may earn $20,000 to $32,000 in commission — but the timing of those payments depends on buyer financing, inspection contingencies, and closing schedules that the agent does not control.
                </P>
                <P>
                  The result is income that is both variable in amount and unpredictable in timing. Two agents with identical annual earnings can have dramatically different cash flow profiles depending on when their transactions close. This irregularity is not a flaw in execution — it is an inherent structural characteristic of commission-based real estate income.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores tend to be low",
            body: (
              <>
                <P>
                  Real estate agents face several structural factors that compress income stability scores. First, there is no contractual guarantee of future income. Unlike a salaried employee or a consultant with a retainer agreement, an agent has no binding commitment from future clients. Each transaction is independent, and past success does not contractually secure future earnings.
                </P>
                <P>
                  Second, income is highly sensitive to market conditions. Interest rate changes, inventory shortages, and local economic shifts can reduce transaction volume across an entire market. An agent in a cooling market may see deal flow drop 30% to 50% in a single quarter — not due to performance, but due to macroeconomic forces outside their control.
                </P>
                <P>
                  Third, the referral pipeline that most agents depend on is relationship-based and inherently fragile. A strong referral network can sustain deal flow for years, but it has no contractual protection and can deteriorate without warning if key referral sources change behavior, relocate, or shift their own business practices.
                </P>
                <P>
                  These factors combine to produce stability scores that typically range from 25 to 45. Agents with property management income, long-term listing agreements, or recurring commercial clients tend to score higher. Agents who depend entirely on residential transaction commissions tend to score lower, regardless of annual earnings.
                </P>
              </>
            ),
          },
          {
            heading: "What agents can do about it",
            body: (
              <>
                <P>
                  Improving income stability as a real estate agent requires structural changes to how income is generated — not simply closing more deals. The most effective strategies involve creating recurring revenue streams that persist between transactions. Property management fees, long-term consulting retainers with investors, and referral partnerships with guaranteed minimums all create baseline income that does not depend on individual closings.
                </P>
                <P>
                  Diversification across transaction types also improves structural resilience. An agent who handles residential sales, commercial leases, and property management has three distinct income channels. If residential volume drops, the other channels provide partial insulation. An agent who handles only residential sales has a single channel with no structural backup.
                </P>
                <P>
                  Contract structure matters as well. Exclusive listing agreements, buyer representation contracts, and retainer arrangements with developers all create contractual income protection that improves stability scores. These agreements do not increase the amount earned per transaction — they increase the structural certainty that future transactions will occur.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Real Estate"
        howIncomeWorks="Commission-based, paid at closing. Typical agent receives 2.5-3% of sale price after brokerage split. Income arrives in large, irregular installments tied to transaction timing. No base salary in most arrangements. Annual earnings depend entirely on closed deal volume and average transaction size."
        typicalRange="25-45. Agents with property management income or commercial retainers score toward the upper range. Agents dependent solely on residential transaction commissions score toward the lower range. Top producers are not exempt — high volume does not equal structural stability."
        biggestRisk="Pipeline dependency. Real estate agents have no contractual claim on future income. Every dollar earned requires a new transaction with a new or returning client. If deal flow stalls due to market conditions, rate changes, or referral network disruption, income can drop to zero with no contractual floor."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={25} atRisk={65} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Top-producing agent in a cooling market"
        setup="Residential agent closing $8M annually in a metro market. Ranked in the top 5% of the local board. Income derived entirely from buyer and seller transaction commissions. No property management, no commercial clients, no retainer agreements."
        risk="Interest rates rise 150 basis points over six months. Buyer qualification rates drop. Inventory sits longer. Transaction volume in the market declines 35%. The agent's pipeline, which averaged 4-5 closings per month, drops to 1-2. Annual income falls from $240,000 to under $100,000."
        outcome="Estimated stability score: 22-30. Despite being a top producer, the agent's income structure has no protection against market-level disruption. Every dollar earned was transaction-dependent, and when transaction volume contracted, income contracted proportionally. Performance was not the issue — structure was."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Top Producer"
        right="Stable Earner"
        explanation="Top production measures volume — how many deals close and how much revenue they generate. Stability measures structure — how much of that revenue is protected if conditions change. An agent can be the top producer in their market and still have a stability score below 30 if all income depends on transaction flow."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The agents who earn the most are often the most exposed — because volume masks structural fragility." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/150k-freelancer-one-client", label: "Scenario: $150K Freelancer, One Client" },
          { href: "/learn/income-stability-commission-sales", label: "Income Stability for Commission Sales" },
          { href: "/learn/income-concentration-risk", label: "What Is Income Concentration Risk" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I'm a top producer — doesn't that mean my income is stable?",
            a: "Not necessarily. Production volume measures how much you earn, not how structurally protected those earnings are. If all your income comes from transaction commissions with no recurring component, a market downturn can reduce your income by 50% or more regardless of your skill level. Stability is about structure, not performance.",
          },
          {
            q: "Does having a team improve my stability score?",
            a: "It depends on the team structure. A team that handles more transaction types, serves multiple market segments, or manages properties creates diversification that can improve stability. A team that simply increases volume in the same transaction type does not change the underlying structural exposure.",
          },
          {
            q: "How do property management fees affect the score?",
            a: "Property management fees are recurring, contractually protected income. They arrive monthly regardless of transaction market conditions. Adding property management to a commission-only practice creates a baseline income floor that significantly improves structural stability, even if the management fees represent a small percentage of total earnings.",
          },
          {
            q: "What score should I aim for as a real estate agent?",
            a: "Most residential agents score between 25 and 45. Reaching 50 or above typically requires adding a recurring income stream — property management, commercial retainers, or consulting arrangements — alongside transaction commissions. The goal is not a specific number but reducing concentration risk so that no single market condition can eliminate most of your income.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Know Your Structural Exposure"
        sub="Get your income stability score and see exactly where your real estate income is vulnerable."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
