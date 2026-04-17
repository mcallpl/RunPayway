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

export default function RealtorDiversifiedPipeline() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="$200K Realtor — Diversified Pipeline"
        definition="Same $200K income. But with investor clients, property management fees, and a systematic referral network — the structure is fundamentally different."
        subtitle="What changes when the same income comes from multiple structural sources."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Recurring property management fees create a monthly income floor",
          "Referral-based income adds predictability to the pipeline",
          "Estimated stability score: 50-65",
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
                  This scenario describes a real estate agent earning $200,000 annually — the same total as the commission-heavy counterpart — but with a fundamentally different income architecture. The $200,000 breaks down as follows: $120,000 from transaction commissions, $48,000 from property management fees on a portfolio of rental properties, and $32,000 from referral-based income generated through a systematic referral network with contractual arrangements.
                </P>
                <P>
                  The transaction commission component still represents the majority of income, but it is no longer the only component. The property management fees arrive monthly regardless of whether a single transaction closes. The referral income flows from established relationships with agents in other markets who pay referral fees on closed deals generated through the network. Both of these streams operate independently of the agent&apos;s personal transaction pipeline.
                </P>
                <P>
                  This is the same $200,000. The same profession. The same market. But the structural architecture is different in ways that fundamentally alter the income&apos;s resilience. The agent has three distinct channels rather than one, a recurring monthly floor, and income sources that respond to different market forces.
                </P>
              </>
            ),
          },
          {
            heading: "Why the structure is more resilient",
            body: (
              <>
                <P>
                  The property management component provides a contractual, recurring income floor. Tenants pay rent monthly. The management agreements are typically annual with renewal provisions. This income persists whether the transaction market is hot, cold, or frozen. If the agent closes zero transactions in a given month, $4,000 in management fees still arrives. Over a year, this floor represents $48,000 in income that is structurally protected from transaction market volatility.
                </P>
                <P>
                  The referral network adds a second layer of diversification. Referral income depends on transactions closing — but in other markets, through other agents, under different conditions. A market slowdown in the agent&apos;s primary area does not necessarily affect referral partners in other regions. Geographic diversification through referrals creates income that is partially insulated from local market conditions.
                </P>
                <P>
                  The combination means that a 30% decline in the agent&apos;s personal transaction volume does not produce a 30% decline in total income. The $120,000 commission component might drop to $84,000 — but the management fees hold at $48,000 and referral income may only decline modestly. Total income drops from $200,000 to approximately $155,000-$165,000 rather than the $120,000-$140,000 projected in the commission-heavy scenario.
                </P>
              </>
            ),
          },
          {
            heading: "What this model teaches about structure",
            body: (
              <>
                <P>
                  The comparison between this scenario and the commission-heavy version isolates the impact of income architecture. Both agents earn $200,000. Both are real estate professionals. Both operate in the same market. The only difference is how the income is structured — and that difference produces a stability score gap of 25 to 35 points.
                </P>
                <P>
                  This illustrates a principle that applies across all professions: income amount does not determine income stability. Structure does. A $200,000 income with three channels and a recurring floor is structurally superior to a $250,000 income from a single transaction-dependent channel. The first withstands disruption. The second collapses when disruption arrives.
                </P>
                <P>
                  The lesson is not that all agents should pursue property management or referral networks. The lesson is that any structural change that creates recurring income, diversifies sources, or adds contractual protection will improve resilience — regardless of whether it increases total earnings. Sometimes the most valuable financial decision is not earning more, but earning differently.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="$200,000 annual income split across three channels: $120,000 in transaction commissions (approximately 9-10 closings), $48,000 in property management fees (managing 30-40 rental units), and $32,000 in referral-based income from a multi-market referral network with contractual fee-sharing arrangements."
        riskExposure="Moderate. Transaction commissions remain the largest component and are market-dependent. Property management fees are contractually recurring but subject to portfolio turnover. Referral income depends on partner agent activity in other markets. No single channel represents more than 60% of total income."
        disruption="Market slows 30%. Transaction commissions decline proportionally — from $120,000 to approximately $84,000. Property management fees remain stable at $48,000 (tenants still rent during market slowdowns). Referral income declines modestly to $26,000 as some partner markets also slow. Total income: approximately $158,000 — a 21% decline versus 35% in the commission-heavy scenario."
        scoreRange="50-65. This range reflects meaningful diversification with a recurring income floor. The score is significantly higher than the commission-heavy counterpart because the income architecture provides structural insulation against market-level disruption. The gap between 50 and 65 depends on contract terms, management portfolio stability, and referral network depth."
        howToFix="Expand the property management book to increase the recurring floor. Target 50+ managed units to push management income above $60,000 annually. Deepen the referral network to include partners in counter-cyclical markets. Consider adding investor consulting retainers for clients who rely on market analysis for acquisition decisions."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={24} recurring={36} atRisk={40} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Same market slowdown, different outcome"
        setup="Agent earning $200,000 with diversified income: $120,000 commissions, $48,000 property management, $32,000 referral network. Market conditions tighten — rates rise, inventory shifts, buyer activity slows by 30%."
        risk="Transaction commissions decline to $84,000 as personal closings drop from 10 to 7. Property management fees hold at $48,000 — tenants continue renting. Referral income dips to $26,000 as some partner markets slow. Total projected income: $158,000."
        outcome="Income declines 21% versus the 35% decline in the commission-heavy scenario with identical market conditions. The $48,000 management floor and the $26,000 referral base absorb $74,000 of what would otherwise be a $60,000-$80,000 loss. Estimated score: 52-60. Same market, same profession — different architecture."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Commission Only"
        right="Diversified Pipeline"
        explanation="Commission-only income means every dollar requires a new transaction. A diversified pipeline means a portion of income arrives through recurring contracts and referral arrangements regardless of personal transaction volume. The same $200,000 can score 25 or 60 depending on how it is structured. The amount is identical. The architecture is not."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The agent who earns $200,000 three different ways will still be earning six figures when the one who earns it one way is starting over." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/200k-realtor-commission-heavy", label: "Scenario: $200K Realtor — Commission Heavy" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How many properties do I need to manage for the score to improve?",
            a: "There is no fixed threshold, but property management income representing at least 15-20% of total income begins to meaningfully affect the stability score. For a $200,000 earner, that translates to approximately $30,000-$40,000 in annual management fees — roughly 20-30 units depending on fee structure and rental rates.",
          },
          {
            q: "Does referral income really count as stable?",
            a: "Referral income occupies a middle ground. It is more predictable than cold lead generation because it flows from established relationships, but it is not contractually guaranteed the way a retainer is. Referral income with formal fee-sharing agreements and multiple partners is more stable than informal referral arrangements with one or two agents.",
          },
          {
            q: "Why is this score so much higher than the commission-heavy version?",
            a: "Because the income architecture is fundamentally different. The commission-heavy scenario has one income channel with no floor. This scenario has three channels with a recurring floor. When disruption occurs, the commission-heavy agent loses income proportionally to market decline. This agent has $74,000 in income that is partially or fully insulated from the market decline. Structure, not amount, drives the difference.",
          },
          {
            q: "Can I build this structure without reducing my transaction business?",
            a: "Yes. Property management and referral network development are additive activities. They do not require reducing transaction focus. Many agents add management services using dedicated property management staff, and referral networks operate through relationships that generate passive deal flow. The goal is not to replace commissions but to supplement them with structurally different income.",
          },
          {
            q: "What would push this score above 65?",
            a: "Expanding the management portfolio to represent 30%+ of income, adding retainer-based consulting relationships with investor clients, and deepening the referral network to include 10+ active partners across diverse markets. Each addition increases the recurring and diversified share of income, which is the primary driver of scores above 65.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Assess Your Pipeline", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Diversification"
        sub="Get your income stability score and see how your income channels compare to a single-source structure."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
