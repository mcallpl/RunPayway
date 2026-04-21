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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function InsuranceRenewalVsNewBusiness() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Insurance — Renewal vs New Business"
        definition="An agent earning $200K from 80% new business and an agent earning $200K from 80% renewals have the same income but opposite stability profiles."
        subtitle="Same production, same carrier appointments, same license. Different book composition. Different structural durability."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "New business commissions must be re-earned every policy cycle — they carry zero persistence",
          "Renewal commissions are structurally recurring income with measurable retention rates",
          "The ratio of renewal to new business is the single most predictive variable in an agent's stability score",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Two agents, opposite book compositions",
            body: (
              <>
                <P>
                  Agent A earns $200,000 annually with 80% of that income — $160,000 — generated from new business production. First-year commissions on newly written policies represent the vast majority of revenue. The remaining $40,000 comes from a small renewal book built over two years of production. Agent A is a top producer by every conventional metric: high activity, strong closing ratios, consistent lead generation.
                </P>
                <P>
                  Agent B earns the same $200,000 annually, but 80% — $160,000 — comes from renewal commissions on a mature book of business built over twelve years. New business production contributes $40,000 per year, enough to offset natural attrition and grow the book incrementally. Agent B is not a top producer in new business rankings but has built a durable revenue base that generates income with minimal ongoing effort.
                </P>
                <P>
                  From a production ranking perspective, Agent A appears more impressive. From a structural stability perspective, Agent B is in a fundamentally stronger position. The income stability model measures structure, not production volume, and these two agents represent opposite ends of the structural spectrum within the same profession.
                </P>
              </>
            ),
          },
          {
            heading: "Why book composition determines the score",
            body: (
              <>
                <P>
                  New business commissions are structurally non-recurring. Each policy sold generates a first-year commission, but that commission does not repeat. The agent must write new policies continuously to maintain income. If lead flow slows, if the market hardens, or if the agent takes time away from production, income declines immediately. There is no structural floor — the income persists only as long as the production activity continues.
                </P>
                <P>
                  Renewal commissions are structurally recurring. Once a policy is written and the client retains it, the renewal commission generates income in subsequent years with minimal effort from the agent. Retention rates in personal lines insurance typically range from 85% to 92%, meaning the vast majority of the book renews automatically. This creates a predictable, self-sustaining income base that does not depend on the agent&apos;s daily production activity.
                </P>
                <P>
                  The model scores Agent A in the 25-35 range because the income profile is dominated by non-recurring production that must be re-earned every cycle. Agent B scores in the 55-70 range because the income profile is dominated by contractually recurring revenue with measurable retention rates. The 30-40 point gap reflects the structural difference between income that requires continuous effort and income that persists through contractual inertia.
                </P>
              </>
            ),
          },
          {
            heading: "Market disruption exposes the structural gap",
            body: (
              <>
                <P>
                  When the insurance market hardens — carriers raise rates, underwriting tightens, and competitive quoting becomes more difficult — new business production declines across the industry. Leads convert at lower rates because prospects face sticker shock. Agents who depend on new business volume experience immediate income compression because their production pipeline is structurally sensitive to market conditions.
                </P>
                <P>
                  Agent A&apos;s $160,000 in new business income is directly exposed to this market shift. If closing ratios drop from 30% to 20% and lead volume declines by 25%, new business income may fall to $80,000-$100,000. The agent is working the same hours, running the same processes, but the external market has reduced the yield. The $40,000 renewal base provides minimal cushion against a $60,000-$80,000 production shortfall.
                </P>
                <P>
                  Agent B&apos;s $160,000 in renewal income is largely insulated from the same market disruption. Existing clients renew their policies regardless of whether the broader market is hard or soft — they need coverage, and switching carriers in a hard market often means paying more. The renewal book continues generating income at roughly the same rate. Agent B&apos;s $40,000 in new business may decline, but the structural base remains intact. The model predicted this asymmetry before the disruption occurred.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Two insurance agents, both earning $200,000 annually. Agent A: 80% new business ($160,000), 20% renewals ($40,000). Agent B: 80% renewals ($160,000), 20% new business ($40,000). Same carriers, same product lines, same geographic market."
        riskExposure="Agent A: must re-earn $160,000 annually through continuous new business production. Zero forward revenue commitment. Income is entirely dependent on lead flow, closing ratios, and market conditions. Agent B: $160,000 in structurally recurring revenue with 87% historical retention rate. Only $40,000 depends on active production."
        disruption="Market hardens significantly. Carrier rate increases of 15-20% reduce closing ratios by a third. Lead volume drops 25% as prospects defer purchasing decisions. Agent A's new business income falls from $160,000 to approximately $85,000 — a 47% decline in the production-dependent portion. Agent B's renewal income remains at $155,000 (97% retention during hard market as clients avoid switching). New business drops from $40,000 to $22,000."
        scoreRange="Agent A (new business heavy): 25-35. Agent B (renewal heavy): 55-70. The gap reflects the structural difference between income that must be produced and income that persists through contractual renewal."
        howToFix="Agent A: shift strategic focus from pure production volume to book-building. Retain every client written. Implement systematic retention processes. Accept that the transition from production-dependent to renewal-dependent income takes 5-7 years of disciplined book management. Each year, the renewal base grows and the production dependency shrinks."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={30} atRisk={55} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Hard market exposes production dependency"
        setup="An insurance agent earning $200,000 with 80% of income from new business production. The agent has built a consistent lead generation system and maintains strong closing ratios. Annual production has been stable for three consecutive years."
        risk="The market hardens. Carriers increase rates by 15-20%. Closing ratios decline from 30% to 20% as prospects resist higher premiums. Lead volume drops 25% as some prospects defer purchasing decisions. The agent's production system is intact, but the external market has reduced its yield."
        outcome="New business income falls from $160,000 to approximately $85,000 — a $75,000 reduction driven entirely by market conditions the agent cannot control. The small renewal book provides $40,000 in stable income, but the total drops to $125,000. The agent must either increase activity dramatically to compensate or accept a sustained income reduction until market conditions normalize."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Production"
        right="Book Value"
        explanation="Production measures how much new business an agent writes in a given period. Book value measures how much recurring revenue the agent's client base generates regardless of new production. High production with a thin book creates impressive income that resets annually. Moderate production with a deep book creates durable income that compounds over time. The stability model measures structural persistence, and book value is the primary driver of persistence in insurance."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The agent who writes the most new business is not the agent with the most stable income — the agent who retains the most clients is." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-insurance-agents", label: "Income Stability for Insurance Agents" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How long does it take to build a renewal-dominant book?",
            a: "Most insurance agents require 7-10 years of consistent production and retention to build a book where renewal commissions exceed new business commissions. The timeline depends on retention rates, policy sizes, and carrier renewal commission schedules. Agents who prioritize retention from day one accelerate this timeline. Those who focus exclusively on production without retention systems may never reach renewal dominance.",
          },
          {
            q: "Do all insurance lines have the same renewal dynamics?",
            a: "No. Personal lines (home, auto) typically have higher retention rates (85-92%) and lower first-year commissions. Commercial lines have moderate retention (75-85%) with higher first-year commissions. Life insurance has different renewal structures depending on product type — term life has level renewals, while whole life may have declining trail commissions. The model evaluates the specific renewal characteristics of the agent's actual book composition.",
          },
          {
            q: "Can a new agent improve their score quickly?",
            a: "A new agent's score will be structurally low because they have no renewal base. The fastest path to improvement is writing policies with high retention characteristics (bundled accounts, annual payment plans, strong carrier service) and implementing retention processes from the first policy written. Each retained policy adds to the structural base. The score improves incrementally as the renewal percentage of total income increases.",
          },
          {
            q: "What about agents who buy existing books of business?",
            a: "Purchasing an existing book of business is the fastest way to acquire structurally recurring income. A purchased book with verified retention rates immediately provides a renewal base that would otherwise take years to build organically. The model scores the income structure as it exists — whether the book was built or bought is irrelevant to its structural characteristics. The key variable is the retention rate of the acquired book post-transition.",
          },
          {
            q: "Does the model account for carrier risk?",
            a: "Carrier concentration — having a disproportionate share of the book with a single carrier — is a recognized risk factor. If a carrier exits the market, changes commission structures, or terminates the agent's appointment, the concentrated portion of the book is at risk. Agents with multi-carrier diversification have better structural protection than agents whose book is concentrated with one or two carriers.",
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
