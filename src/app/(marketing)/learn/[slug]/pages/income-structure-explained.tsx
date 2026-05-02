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
} from "@/components/learn/LearnComponents";

export default function IncomeStructureExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="Income Structure Explained"
        definition="Income structure is the architecture of how income is generated — its sources, dependencies, contractual protections, and behavioral patterns."
        subtitle="The blueprint behind every dollar earned."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Income structure describes how earnings are assembled, not how large they are.",
          "Identical incomes can have radically different structural profiles.",
          "Structure determines which incomes survive disruption and which collapse.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What income structure means",
            body: (
              <>
                <P>
                  Income structure refers to the composition and arrangement of income sources — how many sources contribute to total earnings, what protections exist for each source, how payments recur, and how concentrated earnings are across clients, employers, or channels. It is the architectural blueprint of an earning profile.
                </P>
                <P>
                  A salaried employee with one employer has a simple income structure: single source, employer-dependent, typically at-will or contract-governed. A consultant with four retainer clients, two project-based engagements, and a licensing revenue stream has a complex income structure with multiple sources, varying contractual terms, and different recurrence patterns.
                </P>
                <P>
                  Neither structure is inherently better than the other. What matters is understanding the structural properties — concentration risk, contractual coverage, recurrence reliability — because these properties determine how income behaves under stress. Income structure is the foundation on which income stability is measured.
                </P>
              </>
            ),
          },
          {
            heading: "The components of income structure",
            body: (
              <>
                <P>
                  Income structure is composed of four primary dimensions. Source diversification measures how many independent income streams contribute to total earnings and how concentrated those contributions are. A profile where 90% of income comes from one source has high concentration regardless of total source count. Contractual protection measures whether income sources are secured by written agreements with defined terms, notice periods, and termination provisions.
                </P>
                <P>
                  Recurrence pattern describes how income arrives — monthly retainers, annual contracts, per-project payments, commission cycles, or irregular lump sums. Predictable recurrence reduces forward uncertainty. Dependency mapping identifies what each income source relies on — a single client relationship, an algorithm, a market condition, a regulatory environment — and whether those dependencies overlap across sources.
                </P>
                <P>
                  Together, these four dimensions produce a structural profile that explains not just how much income is earned, but how that income is assembled and where its vulnerabilities lie. Two earners with identical annual income can have structural profiles so different that their risk exposure bears no resemblance to each other.
                </P>
              </>
            ),
          },
          {
            heading: "Why structure matters more than amount",
            body: (
              <>
                <P>
                  Financial institutions and individuals both default to evaluating income by its amount. Tax returns report totals. Bank statements show deposits. Pay stubs list gross and net. Every conventional instrument captures magnitude and ignores architecture. This is equivalent to evaluating a building by its height without examining its foundation.
                </P>
                <P>
                  Income structure matters because it is the determinant of income behavior during disruption. When a client leaves, a contract expires, or a market shifts, the structural properties of income determine how much of total earnings survive. A well-structured income portfolio loses a component and continues functioning. A poorly structured one loses a component and collapses.
                </P>
                <P>
                  The growing prevalence of non-traditional income arrangements makes structural analysis increasingly critical. When most income was salaried, structure was relatively uniform. In an economy where freelance, contract, gig, and portfolio income represent a substantial and growing share of total earnings, structural variation is enormous — and the financial consequences of ignoring it are material.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={35} recurring={30} atRisk={35} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Restaurant owner with three revenue streams"
        setup="Owner-operator of an established restaurant. Revenue comes from three channels: dine-in service (55% of revenue), catering contracts with two corporate clients (30%), and a packaged food product sold through four regional grocery stores (15%). Catering contracts are 12-month agreements. Grocery distribution is governed by renewable quarterly terms."
        risk="Dine-in revenue — the largest component — has no contractual protection and depends entirely on foot traffic, local economic conditions, and consumer behavior. A single disruption event (construction, economic downturn, public health restriction) can reduce the majority revenue stream without warning. The catering and grocery channels provide partial structural protection but cannot fully offset a dine-in collapse."
        outcome="RunPayway estimates a stability score of 48-56 for this profile. The three-stream structure provides meaningful diversification compared to a single-channel restaurant. However, the dominant stream lacks contractual protection, creating moderate structural risk. Expanding the contractually protected share of revenue would materially improve the stability profile."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Income Amount"
        right="Income Architecture"
        explanation="Income amount is what appears on a tax return. Income architecture is the structural composition of how that amount is generated — its sources, protections, recurrence patterns, and concentration risks. Amount tells you what was earned. Architecture tells you whether it is likely to continue."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="You cannot manage what you have not mapped. Income structure is the map." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/income-risk-explained", label: "Income Risk Explained" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is income structure the same as income diversification?",
            a: "Diversification is one component of income structure, but structure encompasses more. It also includes contractual protection, recurrence patterns, and dependency mapping. A person with five income sources that all depend on the same client has diversification without structural resilience.",
          },
          {
            q: "Can salaried employees have complex income structures?",
            a: "Yes. A salaried employee with a base salary, performance bonus, equity vesting schedule, and rental income from a property has a multi-component income structure. Each component has different recurrence patterns, protections, and risk profiles.",
          },
          {
            q: "How do you evaluate income structure?",
            a: "By examining each income source across four dimensions: contribution to total earnings (concentration), contractual or legal protections, recurrence reliability, and dependency on external factors. The interaction of these dimensions produces the structural profile.",
          },
          {
            q: "Does income structure change over time?",
            a: "Yes. Adding clients, signing contracts, losing revenue streams, or shifting from project-based to retainer-based billing all change the structural composition of income. Structure is dynamic and should be reassessed when material changes occur.",
          },
          {
            q: "Why hasn't income structure been measured before?",
            a: "Traditional financial instruments were designed for an employment-dominated economy where income structure was relatively uniform. The structural variation introduced by freelance, contract, and portfolio income created a measurement gap that conventional tools were not built to address.",
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
