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

export default function ConsultantNoContractsVsRetainers() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Consultant — No Contracts vs Retainers"
        definition="The structural difference between project-based consulting and retainer-based consulting is the difference between a score of 30 and a score of 65."
        subtitle="Same consultant, same clients, same expertise. Different contract structure. Different stability score."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Contract structure is the single largest lever a consultant controls",
          "Retainer agreements convert variable income into contractually protected revenue",
          "The same person can score 30 or 65 depending solely on arrangement type",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The setup: same consultant, different arrangements",
            body: (
              <>
                <P>
                  This scenario examines a single variable in isolation: contract structure. The consultant is the same person in both configurations. The clients are the same organizations. The expertise, the industry, the geographic market, and the annual income are all held constant. The only difference is how the work is structured — project-based engagements with no forward commitment versus retainer agreements with six-month terms.
                </P>
                <P>
                  In Configuration A, the consultant operates on a project basis. Each engagement is scoped, delivered, and concluded independently. When the project ends, the income from that client ends. The next engagement requires a new proposal, a new scope, and a new agreement. There is no contractual expectation of continuation. Income between engagements depends entirely on whether the client chooses to engage again.
                </P>
                <P>
                  In Configuration B, the same consultant has converted their two primary client relationships into six-month retainer agreements. Each retainer defines a monthly fee, a minimum commitment period, and a 90-day termination notice clause. The work itself may be similar — advisory sessions, deliverable reviews, strategic guidance — but the contractual wrapper is fundamentally different. Income is committed forward. Termination requires notice. Revenue is predictable for the retainer period.
                </P>
              </>
            ),
          },
          {
            heading: "Why contract structure drives the score",
            body: (
              <>
                <P>
                  The income stability model evaluates structural characteristics of income — how it is generated, how it is protected, and how exposed it is to disruption. Contract structure is one of the most heavily weighted factors because it directly determines whether income is guaranteed for a forward period or dependent on ongoing discretionary decisions by the client.
                </P>
                <P>
                  A project-based consultant with no forward contracts has zero committed revenue. Every dollar of next month&apos;s income depends on the client&apos;s willingness to commission new work. This creates a structural profile similar to a sales professional whose income resets each quarter — past performance does not create contractual claims on future income. The resulting score reflects this lack of forward visibility.
                </P>
                <P>
                  A retainer-based consultant with six-month commitments has forward-committed revenue — income that is contractually obligated for a defined period. The 90-day termination notice clause adds an additional layer of protection, ensuring that even if a client decides to end the arrangement, the consultant has three months of guaranteed income during the transition. This forward commitment is the structural mechanism that elevates the score from the 25-35 range to the 55-70 range.
                </P>
              </>
            ),
          },
          {
            heading: "The practical difference during disruption",
            body: (
              <>
                <P>
                  A market slowdown is the most instructive disruption scenario because it affects both configurations simultaneously. When client budgets contract, discretionary spending is the first category to face cuts. Advisory and consulting engagements are typically classified as discretionary. Both the project-based and retainer-based consultant face the same external pressure — their clients are reducing spend.
                </P>
                <P>
                  The project-based consultant receives a call: the client has decided not to proceed with the next phase. There is no contractual obligation to continue. The engagement simply does not renew. Income from that client drops to zero immediately. The consultant must find replacement revenue in a market where other potential clients are also reducing discretionary spend. The timing is unfavorable, and the structural exposure is maximum.
                </P>
                <P>
                  The retainer-based consultant receives the same call — the client wants to reduce their consulting spend. However, the retainer agreement requires 90 days&apos; notice before termination. The consultant has three months of guaranteed income during which to adjust their pipeline, reduce expenses, and pursue alternative engagements. The income impact is delayed, not eliminated, but the structural buffer transforms a sudden crisis into a managed transition.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Same consultant, same two primary clients, same annual revenue of approximately $200,000. Configuration A: project-based engagements, no minimum commitment, no termination clause. Configuration B: six-month retainer agreements at $8,500 per month per client ($204,000 annually), with 90-day termination notice requirements."
        riskExposure="Configuration A: no forward revenue visibility. Income for next month depends entirely on whether clients commission new work. Configuration B: six months of committed revenue at any given time, with 90 days of additional protection through termination notice clauses. Same clients, same consultant — different structural exposure."
        disruption="Market slowdown reduces client budgets for advisory services. Configuration A: both clients decline to commission new projects. Income drops to $0 within 30 days. Configuration B: both clients issue termination notice. Income continues at $17,000 per month for 90 days ($51,000) while the consultant transitions. The retainer structure buys time that the project structure does not."
        scoreRange="Configuration A: 25-35. Configuration B: 55-70. The 30-35 point difference is driven entirely by contract structure — forward commitment, termination protection, and revenue predictability. No other variable changes between the two configurations."
        howToFix="Convert the top two client relationships from project-based to retainer-based with minimum six-month terms and 90-day termination notice clauses. Price the retainer to reflect the value of guaranteed availability and priority access. Even if the monthly retainer fee is slightly lower than peak project billing, the structural stability improvement more than compensates for the rate difference."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={40} recurring={25} atRisk={35} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="The exact same person, same clients, different contract structure"
        setup="An independent management consultant serving two clients — a private equity firm and a healthcare organization. Annual revenue: $200,000. In one configuration, both engagements are project-based with no forward commitment. In the other, both are structured as six-month retainers with 90-day termination notice."
        risk="Both clients decide to reduce external consulting spend due to a market correction. The project-based consultant loses both engagements immediately — $200,000 in annual income drops to $0 within 30 days. The retainer-based consultant receives termination notice from both clients and continues earning $17,000 per month for 90 days — $51,000 in guaranteed transition income."
        outcome="The project-based consultant enters a zero-income period with no structural runway. The retainer-based consultant has three months of funded transition time to secure new engagements. Same person, same clients, same market disruption. The contract structure is the only variable, and it produces a 30-35 point difference in income stability score."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Project-Based"
        right="Retainer-Based"
        explanation="Project-based consulting income has no structural persistence — each engagement is independent, and income between projects depends on the client's discretionary decision to re-engage. Retainer-based consulting income is contractually committed for a defined period with termination protection. The work may be identical. The income structure is not. The stability score measures the structure, not the work."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The contract you work under matters more than the work you do — because structure determines what happens when conditions change." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/150k-freelancer-one-client", label: "Scenario: $150K Freelancer, One Client" },
          { href: "/learn/150k-freelancer-five-clients", label: "Scenario: $150K Freelancer, Five Clients" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Won't clients resist retainer agreements?",
            a: "Some will, but many will accept retainers when the value proposition is clear. Retainers guarantee the consultant's availability and priority access — benefits that project-based arrangements do not provide. Clients who depend on the consultant's expertise often prefer the certainty of a retained relationship over the risk of the consultant being unavailable when needed. The conversation is about mutual commitment, not one-sided obligation.",
          },
          {
            q: "Should I charge less for retainer work than project work?",
            a: "Not necessarily. Retainer agreements provide value to the client — guaranteed access, priority scheduling, and continuity. Many consultants charge a premium for retainer arrangements because of the commitment involved. If the retainer rate is lower than the project rate, the structural stability benefit must be weighed against the revenue reduction. A modest rate concession for a six-month retainer commitment is often a favorable trade.",
          },
          {
            q: "What if my retainer clients don't use all the hours?",
            a: "Retainer structures vary. Some are use-it-or-lose-it, where the client pays for a block of hours regardless of usage. Others carry unused hours forward. The stability benefit comes from the committed monthly payment, not from hour utilization. If the client pays the retainer fee, the consultant's income stability is protected regardless of whether the full allocation is consumed in a given month.",
          },
          {
            q: "How long should a retainer term be?",
            a: "Six months is the minimum term that creates meaningful structural protection. Twelve months is preferable. The term determines the forward revenue visibility — how far ahead the consultant can project income with contractual certainty. A three-month retainer provides limited protection. A twelve-month retainer with a 90-day termination notice clause provides up to fifteen months of structural runway from the date the agreement begins.",
          },
          {
            q: "Can I mix project and retainer work?",
            a: "Yes, and this is common in practice. A blended model — retainer agreements with core clients and project engagements for additional revenue — combines the structural protection of retainer income with the upside flexibility of project work. The stability score reflects the proportion of income that is retainer-protected. Increasing the retainer percentage improves the score incrementally.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Assess Your Consulting Structure", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="See What Your Contract Structure Scores"
        sub="Get your income stability score and understand exactly how your engagement terms affect your structural position."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
