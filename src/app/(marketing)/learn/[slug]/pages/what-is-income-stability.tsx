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
} from "@/components/learn/LearnComponents";

export default function WhatIsIncomeStability() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="What Is Income Stability"
        definition="Income Stability is the degree to which income continues under disruption, based on its structure — not its amount."
        subtitle="A new category of financial measurement."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Income stability measures structure, not amount",
          "A high income can still be structurally fragile",
          "No existing financial tool measures this",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What it is",
            body: (
              <>
                <P>
                  Income stability is a structural property of how someone earns money. It describes the likelihood that income continues at or near its current level when external conditions change. A stable income is one whose sources, contracts, and diversification patterns make it resistant to disruption. An unstable income is one where a single event — a client leaving, a commission cycle ending, an algorithm shifting — can eliminate a large share of total earnings.
                </P>
                <P>
                  This is distinct from income level. A surgeon earning $400,000 per year from a single hospital system with no employment contract has a different stability profile than a therapist earning $95,000 from twelve recurring clients with six-month agreements. The surgeon earns more. The therapist&apos;s income is more structurally sound.
                </P>
                <P>
                  Traditional financial tools do not measure this. Credit scores evaluate repayment behavior. Tax returns capture historical earnings. Bank statements show cash flow. None of these instruments answer the forward-looking question: if something goes wrong, how much of this person&apos;s income is likely to survive?
                </P>
                <P>
                  Income stability fills that gap. It is not a replacement for existing financial metrics — it is a new dimension that existing metrics do not cover.
                </P>
              </>
            ),
          },
          {
            heading: "Why it matters",
            body: (
              <>
                <P>
                  Every major financial decision — buying a home, signing a lease, taking on debt, hiring an employee — is implicitly a bet on future income. Yet the tools used to evaluate these decisions look backward. They confirm that income existed. They do not evaluate whether income is likely to persist.
                </P>
                <P>
                  This gap creates real consequences. A freelancer earning $200,000 per year from two clients may qualify for a mortgage based on income history, but if one client terminates, half that income disappears overnight. The mortgage approval was based on a number that no longer exists. The underlying structure was fragile, and no one measured it.
                </P>
                <P>
                  Income stability matters because it surfaces risk that is invisible to conventional analysis. It allows individuals to understand their own exposure before a disruption occurs, rather than discovering it after the fact. It allows institutions to make lending, underwriting, and advisory decisions with a more complete picture of income durability.
                </P>
                <P>
                  The shift from employment-based income to contract, gig, and portfolio income makes this measurement increasingly urgent. When income was predominantly salaried, structural fragility was less common. In the current economy, where an estimated 36% of the U.S. workforce earns through non-traditional arrangements, income structure varies enormously — and the tools to evaluate it have not kept pace.
                </P>
              </>
            ),
          },
          {
            heading: "How it works",
            body: (
              <>
                <P>
                  Income stability is evaluated by examining the structural characteristics of how income is earned. The key factors include: the number and diversification of income sources, the contractual protection of those sources, the recurrence patterns of payments, and the concentration risk across clients or channels.
                </P>
                <P>
                  Each of these factors contributes to an overall stability profile. Income that comes from many sources is generally more stable than income from one. Income protected by long-term contracts is more stable than income dependent on month-to-month renewal. Income that recurs on a predictable schedule is more stable than income that arrives irregularly based on project completion.
                </P>
                <P>
                  The result is a score that reflects structural resilience. A high score indicates that income is well-diversified, contractually protected, and unlikely to experience sudden loss. A low score indicates concentration, lack of contractual coverage, and vulnerability to disruption events.
                </P>
                <P>
                  Critically, the score is not a judgment of earning ability or financial health. It is a measurement of structural exposure. Two people earning identical amounts can have vastly different stability scores based on how that income is structured. The score identifies where fragility exists so it can be addressed before it becomes a crisis.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={25} recurring={35} atRisk={40} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="A consultant earning $180K with one client"
        setup="Independent management consultant. One Fortune 500 client generates 100% of annual revenue. No written contract — engagement renewed verbally each quarter. No other active client relationships."
        risk="Complete single-source dependency. If the client restructures, changes vendors, or freezes consulting budgets, the entire $180,000 income stream terminates simultaneously. There is no partial loss scenario — it is binary."
        outcome="RunPayway estimates a stability score of 18-24 for this profile. Despite strong earnings, the structural exposure is severe. One phone call can reduce annual income to zero. The consultant has high earning capacity but near-zero income resilience."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="High Income"
        right="Stable Income"
        explanation="A high income describes how much someone earns. A stable income describes how likely that earning level is to persist under pressure. They are independent measurements. Income can be high and fragile, or modest and resilient. Financial planning that considers only amount without evaluating structure is incomplete."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Most people don't discover their income is fragile until something breaks." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/150k-freelancer-one-client", label: "Scenario: $150K Freelancer, One Client" },
          { href: "/learn/income-diversification", label: "What Is Income Diversification" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs. Credit Score" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is income stability the same as income level?",
            a: "No. Income stability measures structure — how diversified, protected, and resilient your income sources are. A person earning $300,000 from one client with no contract has high income but low stability. A person earning $80,000 from eight recurring clients with agreements has lower income but substantially higher structural stability.",
          },
          {
            q: "Can a salaried employee have low income stability?",
            a: "It depends on the structure. A salaried employee with a long-term contract, severance provisions, and union protections has high stability. A salaried employee in an at-will state with no contract and a single employer may have moderate stability — better than a single-client freelancer, but still structurally concentrated.",
          },
          {
            q: "How is this different from a credit score?",
            a: "Credit scores measure repayment history — whether you have paid debts on time. Income stability measures income structure — whether your earning sources are likely to continue. They answer fundamentally different questions. A person can have an excellent credit score and extremely fragile income.",
          },
          {
            q: "Does the score change over time?",
            a: "Yes. Income stability is dynamic. If you add a new client, sign a contract, or diversify into a new revenue stream, your structural profile changes and your score will reflect that. The score is a snapshot of current structural resilience, not a permanent rating.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Check Your Score", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure What No One Else Measures"
        sub="Get your income stability score — structure, risk exposure, and a concrete improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
