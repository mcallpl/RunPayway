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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityInsuranceAgents() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Insurance Agents"
        definition="Insurance income splits between new production commissions and renewal income. The ratio between the two determines structural stability."
        subtitle="Why production numbers alone do not reveal the durability of an insurance agent's income."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Renewal income is the structural backbone of agent stability",
          "New production commissions are high but non-recurring",
          "Most agents score between 35 and 55 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How insurance agent income works",
            body: (
              <>
                <P>
                  Insurance agents earn through two distinct channels: new business commissions and renewal commissions. New business commissions are paid when a policy is first written. These tend to be larger — often 40% to 100% of the first-year premium — and represent the immediate reward for acquiring a new client. Renewal commissions are smaller percentages, typically 5% to 15%, paid annually when a client renews their policy.
                </P>
                <P>
                  The interplay between these two streams defines the agent&apos;s income structure. An agent in their early years typically depends heavily on new production because their book of business is small. As the book grows, renewal income accumulates and begins to form a more predictable baseline. The transition from production-dependent to renewal-supported income is the single most important structural shift in an insurance agent&apos;s career.
                </P>
                <P>
                  Carrier contracts, product mix, and retention rates all influence how quickly this transition occurs. Agents focused on personal lines with high retention may build a durable renewal book within five to seven years. Agents focused on specialty commercial lines may earn larger new business commissions but face more volatile renewal patterns. The product mix determines the trajectory.
                </P>
              </>
            ),
          },
          {
            heading: "Why renewal erosion is the hidden risk",
            body: (
              <>
                <P>
                  The most significant structural risk for insurance agents is renewal erosion masked by new production. An agent writing $200,000 in new business commissions may appear to be thriving. But if their renewal book is simultaneously losing 15% of policies annually due to non-renewals, carrier changes, or client attrition, the underlying foundation is deteriorating while the surface numbers look strong.
                </P>
                <P>
                  This dynamic creates a treadmill effect. The agent must continually produce new business simply to replace lost renewals before any net growth occurs. If new production slows — due to market conditions, personal circumstances, or competitive pressure — the erosion becomes immediately visible. Income drops not because the agent stopped selling, but because the renewal base was never as solid as it appeared.
                </P>
                <P>
                  Retention rate is therefore a more meaningful indicator of structural stability than production volume. An agent with modest new production but 92% renewal retention is building a more durable income structure than an agent with exceptional new production and 78% retention. The first agent&apos;s book compounds. The second agent&apos;s book leaks.
                </P>
              </>
            ),
          },
          {
            heading: "What agents can do to strengthen stability",
            body: (
              <>
                <P>
                  The most effective strategy for improving income stability is to increase renewal retention. This means focusing on client service, policy reviews, and proactive communication that reduces the likelihood of policy cancellation or carrier switch. Every percentage point of improved retention compounds over time, building a larger and more resilient baseline.
                </P>
                <P>
                  Product diversification also matters. Agents who write across multiple lines — personal, commercial, life, and benefits — create income streams that respond to different market forces. A hard market in commercial lines may coincide with stable personal lines retention, providing balance that a single-line agent does not have.
                </P>
                <P>
                  Contract structure with carriers should also be evaluated. Vesting provisions, ownership of the book of business, and renewal commission schedules vary significantly. Agents who own their book outright have a structural asset. Agents whose renewals revert to the carrier upon termination have income that depends entirely on the carrier relationship continuing.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Insurance"
        howIncomeWorks="Income derives from two channels: new business commissions (40-100% of first-year premium) and renewal trail commissions (5-15% of annual premium on retained policies). New production drives short-term earnings. Renewal income creates long-term baseline. The ratio between the two defines the agent's structural position."
        typicalRange="35-55. Agents with high retention rates and mature books of business score toward the upper range. Agents dependent primarily on new production with low retention score toward the lower range. The renewal-to-production ratio is the most significant variable."
        biggestRisk="Renewal erosion masked by new production. An agent can maintain or grow total income while the underlying book deteriorates. When new production eventually slows — and it always does — the weakened renewal base is exposed. The income decline appears sudden but was structural all along."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={20} recurring={35} atRisk={45} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Strong new business, declining renewal retention"
        setup="Insurance agent writing $180,000 in new business commissions annually. Book of business generates $90,000 in renewal income. Total income: $270,000. But renewal retention has dropped from 88% to 76% over three years. The agent has not noticed because new production has compensated for the losses."
        risk="New production slows by 25% due to market tightening. Renewal erosion continues at 76% retention. In one year, new business income drops to $135,000 and renewal income erodes to $68,000. Total income falls from $270,000 to $203,000 — a 25% decline that reveals the structural weakness."
        outcome="Estimated stability score: 32-40. The agent's production record is strong, but the underlying book is leaking faster than it is being replenished. Without improving retention, the income trajectory continues downward regardless of sales effort."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Production Volume"
        right="Book Durability"
        explanation="Production volume measures how much new business an agent writes in a given period. Book durability measures how much of the existing book survives each renewal cycle. An agent with $300,000 in new production and 75% retention is structurally weaker than an agent with $150,000 in new production and 93% retention. The second agent's income compounds. The first agent is running to stand still."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The size of the book matters less than the rate at which it holds together. Retention is the structural foundation — production is the addition built on top of it." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/income-stability-sales-professionals", label: "Income Stability for Sales Professionals" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does owning my book of business affect my stability score?",
            a: "Yes. Book ownership is a structural factor. An agent who owns their book has a transferable asset and retains renewal income regardless of carrier relationship changes. An agent whose renewals are carrier-dependent has income that can be interrupted by contract termination. Ownership creates structural protection that is reflected in the score.",
          },
          {
            q: "How does product mix affect stability?",
            a: "Diversification across product lines creates resilience. Personal lines tend to have higher retention but lower per-policy commissions. Commercial lines have larger commissions but more volatile renewal patterns. Life and benefits create distinct income streams with different market drivers. A diversified mix reduces the impact of any single market shift.",
          },
          {
            q: "I write a lot of new business — why would my score be low?",
            a: "New business commissions are one-time payments. They do not recur. If your renewal retention is low, you are replacing lost income rather than building on it. High production with low retention produces income that looks strong in the current year but has no structural foundation for future years. The score reflects the structure, not the current total.",
          },
          {
            q: "What retention rate do I need for a strong score?",
            a: "Retention above 90% is generally associated with scores in the upper range for insurance agents. Below 80%, the erosion rate begins to undermine even strong production numbers. The exact threshold depends on other factors — product mix, carrier contracts, and income diversification — but retention is the single most influential variable for insurance agent stability.",
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
