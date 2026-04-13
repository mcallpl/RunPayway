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

export default function RealEstateBoomVsSlowMarket() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Real Estate — Boom vs Slow Market"
        definition="A real estate agent's income stability score measures structure, not market conditions. But market conditions expose structural weaknesses that boom times mask."
        subtitle="High income during a boom does not indicate structural stability. A correction reveals what the structure actually supports."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Market conditions change the volume — structure determines whether the income survives the change",
          "A boom can mask structural fragility by generating high income through transactional volume alone",
          "Agents with referral engines and recurring revenue maintain more stable income across market cycles",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Why boom income feels stable but is not",
            body: (
              <>
                <P>
                  A real estate agent earning $200,000 during a market boom is often closing 15-20 transactions per year. The pipeline is full, listings move quickly, and buyer demand creates urgency that shortens sales cycles. The agent&apos;s income has been strong for two or three consecutive years, and the trajectory feels sustainable. The conventional interpretation is that this agent has built a successful practice with reliable income.
                </P>
                <P>
                  The structural interpretation is different. If the $200,000 is generated entirely through transaction commissions — with no property management fees, no referral income, no recurring revenue of any kind — then the income is entirely dependent on transaction volume. Transaction volume, in turn, is dependent on market conditions: buyer demand, inventory levels, interest rates, and economic confidence. The agent does not control any of these variables. The income is real, but the structure is market-dependent.
                </P>
                <P>
                  During a boom, this structural weakness is invisible because market conditions are favorable. The agent attributes their income to skill and effort — which are genuine — but the structural foundation is the market itself. When the market corrects, the income contracts not because the agent became less skilled, but because the structural foundation shifted. The model evaluates the structure that would persist across market conditions, not the income that one particular market condition happens to produce.
                </P>
              </>
            ),
          },
          {
            heading: "What a market correction reveals",
            body: (
              <>
                <P>
                  When transaction volume drops 40% — a common correction magnitude — an agent whose income is entirely commission-based will see income decline proportionally. If the agent was closing 18 transactions at an average commission of $11,000, a 40% volume reduction means approximately 11 transactions at similar commission levels — $121,000 instead of $200,000. Some agents will experience steeper declines if higher-value transactions (luxury, investment) contract more sharply than the market average.
                </P>
                <P>
                  The correction does not merely reduce income — it exposes the structural dependency that was always present. The agent&apos;s expenses (marketing, assistant salary, brokerage fees, vehicle costs) do not decline proportionally with transaction volume. Fixed costs remain fixed, which means the net income decline is steeper than the gross income decline. An agent earning $200,000 gross with $80,000 in expenses nets $120,000. The same agent earning $121,000 gross with the same $80,000 in expenses nets $41,000 — a 66% decline in net income from a 40% decline in transactions.
                </P>
                <P>
                  This leverage effect — where fixed expenses amplify income volatility — is a structural characteristic that the model evaluates. Agents with lower fixed costs, diversified revenue streams, or recurring income sources have less leverage and therefore less amplified downside during corrections. The model does not predict market corrections. It measures how much structural protection the agent&apos;s income has when one occurs.
                </P>
              </>
            ),
          },
          {
            heading: "Building structure that survives market cycles",
            body: (
              <>
                <P>
                  The agents who maintain more consistent income across market cycles share common structural characteristics. They have referral engines — systems that generate inbound business from past clients, professional networks, and community relationships rather than depending on market-driven lead sources. Referral-based transactions are less sensitive to market conditions because they originate from existing relationships rather than from market activity.
                </P>
                <P>
                  Some agents diversify into property management, which generates monthly recurring fees independent of transaction volume. Others develop ancillary income streams — real estate investment, consulting, or coaching — that are not tied to closing transactions. Each additional revenue source reduces the structural dependency on transaction volume and provides income that persists when the market contracts.
                </P>
                <P>
                  The model does not require agents to abandon transaction-based income. It evaluates the proportion of total income that is structurally recurring or diversified versus the proportion that depends on market-sensitive transaction volume. An agent with 70% transaction income and 30% recurring revenue scores meaningfully higher than an agent with 100% transaction income — because the 30% provides a structural floor that does not depend on market conditions.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A real estate agent earning $200,000 annually during a market boom. All income is from transaction commissions — approximately 18 closings per year at $11,000 average commission. No property management income, no recurring fees, no referral-based revenue stream. Fixed business expenses of $80,000 annually."
        riskExposure="Transaction volume drops 40% during a market correction. The pipeline thins as buyer demand declines, inventory rises, and days on market increase. The agent's income is structurally exposed to the full magnitude of the volume decline because there is no recurring revenue base, no diversified income stream, and no structural floor."
        disruption="Market correction reduces transaction volume from 18 to 11 closings. Gross commission income falls from $200,000 to approximately $121,000. Fixed expenses remain at $80,000. Net income declines from $120,000 to $41,000 — a 66% reduction in take-home income driven by a 40% reduction in market volume, amplified by fixed cost leverage."
        scoreRange="25-35 for a transaction-only agent, regardless of whether the current market is booming or slow. The boom does not change the structure — it changes the volume. The model scores the structure, not the volume. An agent with 30% recurring income scores 40-50 in the same market conditions."
        howToFix="Build a referral engine that generates inbound business independent of market conditions. Diversify into property management or other recurring revenue streams. Reduce fixed cost leverage by optimizing business expenses. Target at least 25-30% of income from non-transaction sources to create a structural floor. These changes take 2-3 years to mature but fundamentally alter the income's structural resilience across market cycles."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={15} atRisk={80} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Market corrects — transaction volume drops 40%"
        setup="A real estate agent earning $200,000 from 18 transaction commissions during a strong market. All income is transaction-based. No recurring revenue, no property management, no diversified income streams. Fixed business expenses of $80,000 per year."
        risk="Housing market corrects. Buyer demand drops, inventory rises, and days on market increase from 30 to 75. Transaction volume declines from 18 to 11 closings. The agent is working the same hours, running the same marketing, and applying the same skill — but the market produces fewer transactions."
        outcome="Gross income falls from $200,000 to $121,000. After $80,000 in fixed expenses, net income drops from $120,000 to $41,000 — a 66% decline. The structural dependency on transaction volume, invisible during the boom, becomes the dominant factor in the income outcome. The agent's skill did not change. The market changed, and the structure was exposed."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Market Conditions"
        right="Income Structure"
        explanation="Market conditions determine how many transactions close in a given period. Income structure determines how much of the agent's revenue depends on those transactions. A boom market can produce $200,000 for an agent with weak structure. A slow market reveals that the same agent's structure supports only $121,000 — or less. The model scores the structure, which is constant, not the market, which is cyclical."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A real estate agent earning $200K in a boom has not built a $200K practice — they have built a practice that produces $200K under favorable conditions and significantly less when conditions change." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/200k-realtor-commission-heavy", label: "Scenario: $200K Realtor, Commission Heavy" },
          { href: "/learn/200k-realtor-diversified-pipeline", label: "Scenario: $200K Realtor, Diversified Pipeline" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does the model score agents differently during a boom versus a slow market?",
            a: "No. The model scores income structure, which does not change with market conditions. An agent with 100% transaction-based income scores in the 25-35 range regardless of whether the current market is hot or cold. The boom increases the income produced by that structure but does not improve the structure itself. This is the distinction the model is designed to measure.",
          },
          {
            q: "How does property management income affect the score?",
            a: "Property management income is structurally recurring — it generates monthly fees from managed properties under contract. This income persists independent of transaction market conditions. Adding property management revenue creates a structural floor that the model recognizes. An agent earning 25% of income from property management will score meaningfully higher than an agent with the same total income from transactions alone.",
          },
          {
            q: "What about referral-based business?",
            a: "Referral-based transactions are structurally different from market-driven transactions because they originate from existing relationships rather than market activity. Referral pipelines are less sensitive to market conditions — past clients refer when they know someone buying or selling, regardless of whether the broader market is hot or cold. While referral income is still transaction-based, the demand driver is more stable and less cyclical than market-driven lead generation.",
          },
          {
            q: "Can a team structure improve the score?",
            a: "A team structure can improve diversification if the team generates revenue from multiple agents across different market segments or geographic areas. However, a team also introduces additional fixed costs (agent splits, marketing, support staff) that may increase the leverage effect during a downturn. The net impact on the score depends on whether the team genuinely diversifies income sources or simply scales the same structural model with higher fixed costs.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Score Your Real Estate Income", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Market Cycle Exposure"
        sub="Get your income stability score and understand how your income structure performs across market conditions — not just during a boom."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
