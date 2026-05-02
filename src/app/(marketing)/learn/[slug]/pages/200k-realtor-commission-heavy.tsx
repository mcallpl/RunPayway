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
  StickyLearnCTA,
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function RealtorCommissionHeavy() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="$200K Realtor — Commission Heavy"
        definition="A top-producing real estate agent earning $200K annually through transaction commissions — with no recurring revenue, no retainers, and no contractual income."
        subtitle="What $200,000 looks like when every dollar requires a new transaction."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "100% commission income means zero structural protection",
          "15 transactions per year at $13K average commission",
          "Estimated stability score: 20-30",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The income setup",
            body: (
              <>
                <P>
                  This scenario describes a residential real estate agent earning $200,000 annually through transaction commissions. The income derives from approximately 15 closed transactions per year, averaging $13,000 in gross commission per deal after brokerage splits. There is no property management income, no recurring consulting fees, no retainer agreements, and no contractual commitments from future clients.
                </P>
                <P>
                  The agent is a strong performer by industry standards. Closing 15 transactions annually places them well above the median for residential agents. The $200,000 income exceeds what most agents earn. By every visible measure — production volume, annual earnings, market presence — this is a successful practice.
                </P>
                <P>
                  Structurally, however, the income is entirely transaction-dependent. Every dollar earned requires a buyer or seller to engage, a property to close, and a commission to be paid. There is no forward visibility into future income. The pipeline may contain prospects and pending deals, but none carry contractual certainty. January starts at zero regardless of what December produced.
                </P>
              </>
            ),
          },
          {
            heading: "Why the structure is fragile",
            body: (
              <>
                <P>
                  Transaction-dependent income has no floor. If the market contracts, the agent&apos;s income contracts proportionally — and often more than proportionally, because fewer transactions also mean more competition for each deal. There is no base salary, no minimum guarantee, and no employer absorbing the variance. The agent bears 100% of the market risk with 0% structural protection.
                </P>
                <P>
                  The concentration risk is also temporal. Fifteen transactions per year means roughly one closing every three to four weeks. If two or three deals fall through in succession — due to financing issues, inspection failures, or buyer changes of heart — the income gap can extend to two months or more. Cash flow becomes irregular even when annual production remains on track.
                </P>
                <P>
                  There is no mechanism in this income structure that smooths volatility. No renewal income carries over from past years. No retainer provides monthly baseline. No contractual agreement guarantees that any current prospect will become a closed transaction. The agent must continuously generate new business to produce any income at all.
                </P>
              </>
            ),
          },
          {
            heading: "What a market slowdown reveals",
            body: (
              <>
                <P>
                  When the market slows by 30% — due to rate increases, inventory constraints, or economic uncertainty — this agent&apos;s 15 annual transactions may drop to 10 or fewer. At $13,000 per transaction, income falls from $200,000 to approximately $130,000. The 30% market decline translates directly into a 35% income decline because the agent has no insulating income layer.
                </P>
                <P>
                  The decline may be worse than proportional. In a contracting market, agents compete more aggressively for fewer deals. Commission rates face downward pressure. Average transaction values may decline as sellers lower prices. The $13,000 average commission may compress to $10,000 or $11,000, further accelerating the income drop.
                </P>
                <P>
                  Recovery timelines compound the impact. Real estate markets do not snap back immediately. A slowdown that persists for 12 to 18 months creates sustained income reduction that depletes savings, increases debt, and forces the agent to restructure their financial commitments. The structural damage extends well beyond the initial market shift.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="$200,000 annual income from 15 residential transactions averaging $13,000 in gross commission per closing. 100% transaction-dependent. No property management fees, no retainer agreements, no recurring revenue of any kind. Brokerage split in place. Operating as a solo agent or small team."
        riskExposure="100% transaction-dependent with no forward visibility. No contractual income. No recurring revenue floor. Every dollar of income requires a new client engagement, a successful closing, and commission payment. Pipeline consists of prospects and pending deals with no binding commitment."
        disruption="Market slows 30% due to rate increase or economic contraction. Transaction volume drops from 15 to 10-11 annually. Average commission may also compress under competitive pressure. Projected income decline: $200,000 to $120,000-$140,000. No structural buffer absorbs the impact."
        scoreRange="20-30. This range reflects full transaction dependency with no recurring or contractual income component. The score is low not because earnings are low, but because the income architecture offers no protection against volume contraction."
        howToFix="Build a referral engine with systematic follow-up that reduces dependence on market-driven lead flow. Add a listing pipeline management system that creates forward visibility into upcoming inventory. Consider adding property management services to create recurring monthly revenue. Establish investor client relationships that generate repeat transactions independent of retail market conditions."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={0} recurring={10} atRisk={90} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Top producer in a contracting market"
        setup="Agent closing $200,000 annually through 15 residential transactions. No recurring income. No retainer clients. Referral network is active but informal — no contractual referral agreements. Business built during a favorable market with low rates and high demand."
        risk="Interest rates rise 175 basis points over eight months. Buyer pool contracts. Listing inventory increases. Transaction volume across the market drops 30%. The agent's closings slow from 15 to 9. Two additional deals fall through due to buyer financing issues."
        outcome="Annual income drops from $200,000 to approximately $117,000. The agent's overhead, lifestyle, and financial commitments were built around the higher income level. Estimated score: 22-28. The income was real, but the structure provided no protection when the market shifted."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Top Producer"
        right="Stable Producer"
        explanation="A top producer closes the most transactions and earns the most commission in a given period. A stable producer has income that persists when transaction volume declines. These are independent measurements. An agent can be a top producer with a stability score of 25 if all income is transaction-dependent. A lower-volume agent with property management income and retainer clients may score 55 with half the annual earnings."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="$200,000 earned entirely through commissions is $200,000 that must be re-earned from scratch every year. The number resets to zero on January 1st." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/200k-realtor-diversified-pipeline", label: "Scenario: $200K Realtor — Diversified Pipeline" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I close 15+ deals a year — isn't that enough for stability?",
            a: "Transaction volume measures productivity, not structural protection. Fifteen deals per year is strong production, but each deal is an independent event with no contractual connection to the next. If market conditions reduce your volume by a third, your income drops by a third or more. Volume without structural protection does not create stability.",
          },
          {
            q: "What would it take to move this score above 40?",
            a: "Adding a recurring income component — property management fees, investor retainers, or contractual referral arrangements — that represents at least 15-20% of total income would meaningfully improve the score. Diversifying transaction types (residential, commercial, investment) also helps. The key is creating income that does not require a new transaction to arrive.",
          },
          {
            q: "Does my referral network count as recurring income?",
            a: "No. A referral network is a lead source, not an income stream. Referrals increase the probability of future transactions, but they carry no contractual commitment or payment guarantee. Stability scoring measures structural income architecture — contracts, recurring payments, and diversification — not the quality of the sales pipeline.",
          },
          {
            q: "How does this compare to the diversified pipeline scenario?",
            a: "The diversified pipeline scenario shows the same $200,000 income with a fundamentally different structure — commissions supplemented by property management fees and systematic referral-based income. That structure scores 50-65. Same total income, dramatically different resilience. The comparison isolates the impact of income architecture on stability.",
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
