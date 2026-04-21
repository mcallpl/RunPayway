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
} from "@/components/learn/LearnComponents";

export default function WhatIsIncomeStructure() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Concept"
        title="What Is Income Structure"
        definition="Income structure describes how income is built — its sources, dependencies, patterns, and protections."
        subtitle="Structure determines whether income survives. Amount determines how much was at stake."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Income structure is the architecture behind the dollar figure",
          "Identical incomes can have fundamentally different structures",
          "Structure is measurable, modifiable, and independent of amount",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The Components of Income Structure",
            body: (
              <>
                <P>
                  Income structure is composed of several interlocking elements. Sources describe where income originates — a W-2 employer, a roster of freelance clients, rental properties, royalty agreements, or investment distributions. Each source type carries different structural characteristics. A salaried position with a two-year contract is structurally different from a salaried position in an at-will state with no agreement.
                </P>
                <P>
                  Dependencies describe what each income source relies on to continue. Commission income depends on market activity. Consulting income depends on client retention. Rental income depends on occupancy rates and lease terms. Understanding dependencies reveals what external conditions could disrupt each stream and how interconnected those conditions are.
                </P>
                <P>
                  Patterns describe the timing and regularity of income flows. Some income arrives on a fixed schedule — biweekly paychecks, monthly retainers, quarterly distributions. Other income arrives irregularly — project completions, seasonal surges, deal closings. Protections describe the contractual and structural safeguards in place — employment contracts, retainer agreements, severance provisions, non-compete clauses, and insurance coverage.
                </P>
              </>
            ),
          },
          {
            heading: "Why Structure Matters More Than Amount",
            body: (
              <>
                <P>
                  Amount tells you what happened. Structure tells you what is likely to happen. A financial advisor who earned $300,000 last year has demonstrated earning capacity. But if $240,000 of that came from three clients who can leave at any time, the structural reality is that 80% of income is unprotected and concentrated. The amount is impressive. The structure is precarious.
                </P>
                <P>
                  Structure matters more than amount because financial obligations are forward-looking. A mortgage payment is due every month for thirty years. A lease commitment extends twelve to twenty-four months. Business payroll recurs indefinitely. These obligations assume income continuity. When income structure is fragile, the implicit assumption underlying every obligation is at risk.
                </P>
                <P>
                  The emphasis on amount over structure is a legacy of the salaried economy. When most income came from a single employer with reasonable job security, structure was relatively uniform. The relevant question was how much. In the modern economy, where income sources, contract terms, and earning models vary enormously, the relevant question is how — and that question is answered by examining structure.
                </P>
              </>
            ),
          },
          {
            heading: "Reading Your Own Income Structure",
            body: (
              <>
                <P>
                  Evaluating your income structure requires asking questions that most financial tools do not prompt. How many independent sources contribute to your total earnings? What percentage of income would you lose if your single largest source disappeared? How far into the future is your income contractually committed? What percentage of your income requires your direct labor to continue?
                </P>
                <P>
                  These questions reveal structural realities that income statements obscure. A person earning $150,000 from eight clients, each on a signed annual retainer, with no client exceeding 18% of total revenue, has a fundamentally different structural profile than a person earning $150,000 from one employer with no contract. The income statement looks identical. The structure is not remotely comparable.
                </P>
                <P>
                  Understanding your own income structure is the prerequisite for improving it. You cannot reduce concentration risk you have not identified. You cannot extend forward visibility without knowing your current contractual position. Structure is the starting point for every meaningful improvement in income resilience.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={40} recurring={35} atRisk={25} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Two $120K earners — one W-2, one freelancer"
        setup="Earner A is a salaried marketing manager at a mid-size company, earning $120,000 with standard at-will employment and no written contract. Earner B is a freelance copywriter earning $120,000 from seven clients, each on a six-month retainer, with the largest client representing 22% of total revenue."
        risk="Earner A has single-source concentration — one employer controls 100% of income. If laid off, income drops to zero immediately with no contractual severance guarantee. Earner B has distributed exposure — losing any single client reduces income by no more than 22%, and six-month retainers provide forward visibility. The freelancer, conventionally seen as less stable, has materially stronger income structure."
        outcome="RunPayway estimates Earner A scores 32-38. Earner B scores 61-67. The salaried position provides regularity but not structural resilience. The freelance arrangement provides both diversification and contractual protection. Structure, not employment type, determines stability."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="How Much You Earn"
        right="How You Earn It"
        explanation="How much you earn is the output. How you earn it is the architecture. The same output can be produced by structures with vastly different resilience characteristics. A single-client dependency and an eight-client portfolio can both produce $150,000. Only one is likely to produce it again next year if conditions change."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Your income is not a number. It is a system. Systems can be measured, stress-tested, and strengthened." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is a W-2 salary always more structured than freelance income?",
            a: "No. Structure is determined by the specific characteristics of each arrangement, not the employment category. A W-2 employee with no contract in an at-will state has single-source concentration and no contractual protection. A freelancer with multiple retainer clients and signed agreements may have superior structural characteristics across multiple dimensions.",
          },
          {
            q: "Can I change my income structure without changing my income?",
            a: "Yes. Income structure can be modified independently of income amount. Converting a month-to-month client to an annual retainer improves forward visibility without changing income. Adding a second income source reduces concentration without requiring the first source to change. Structural improvement and income growth are independent actions.",
          },
          {
            q: "What is the most common structural weakness?",
            a: "Concentration — excessive dependence on a single income source. This applies to both self-employed earners dependent on one client and salaried employees dependent on one employer. Concentration is the most common and most consequential structural vulnerability because it creates binary risk: the source either continues or it does not.",
          },
          {
            q: "Does income structure affect financial planning?",
            a: "It should. Financial plans built on income assumptions that do not account for structure are implicitly betting on continuity without measuring the probability of continuity. An emergency fund calculation, a retirement projection, or a debt capacity assessment that ignores income structure is incomplete.",
          },
          {
            q: "How is income structure different from income diversification?",
            a: "Diversification is one component of income structure. Structure encompasses diversification along with contractual protection, forward visibility, concentration ratios, variability patterns, and labor dependence. Diversification addresses the number and independence of sources. Structure addresses the complete architecture of how income is built.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="See How Your Income Is Built"
        sub="A structural analysis of your income sources, dependencies, and protections."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
