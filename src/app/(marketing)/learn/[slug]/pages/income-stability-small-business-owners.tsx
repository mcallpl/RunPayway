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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilitySmallBusinessOwners() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Small Business Owners"
        definition="Small business income is the residual after expenses — revenue is not income. The owner's draw depends on margin, seasonality, and client concentration."
        subtitle="Why revenue growth does not automatically produce income stability."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Owner income is what remains after all business obligations are met",
          "Revenue concentration in a few clients creates binary risk for the owner's draw",
          "Most small business owners score between 30 and 50 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How small business owner income works",
            body: (
              <>
                <P>
                  Small business owners do not earn a salary in the traditional sense. Their income is an owner&apos;s draw — the amount extracted from the business after all operating expenses, payroll, taxes, debt service, and reinvestment obligations are met. A business generating $500,000 in annual revenue with $420,000 in total expenses produces $80,000 in available owner income. That $80,000 is not guaranteed by any contract or employment agreement — it is the residual of a complex set of financial obligations that change month to month.
                </P>
                <P>
                  The variable margin structure means that owner income fluctuates even when revenue is stable. A marketing agency with consistent $40,000 monthly revenue may produce owner draws ranging from $3,000 to $12,000 depending on contractor costs, software expenses, client payment timing, and project mix in any given month. The owner absorbs all variance — they are the last to be paid after every other obligation, and they bear the full impact of margin compression from any source.
                </P>
                <P>
                  Seasonality affects many small businesses in ways that directly impact owner income. A landscaping company generating 70% of annual revenue between April and September must either maintain year-round expenses on seasonal income or dramatically reduce operations during off-months. Either approach creates income instability for the owner — either through compressed margins during high-revenue months that subsidize low-revenue months, or through near-zero draws during the off-season.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores cluster in the 30-50 range",
            body: (
              <>
                <P>
                  Small business owners who have built diversified client bases, maintained healthy margins, and established predictable revenue patterns score toward the upper end of the range. A business with 20 clients, no single client exceeding 15% of revenue, and recurring service agreements creates a structural foundation that provides meaningful income protection. The loss of any individual client reduces revenue but does not threaten the owner&apos;s ability to draw income from the business.
                </P>
                <P>
                  However, most small businesses operate with significant client concentration. Research consistently shows that a majority of small service businesses derive more than 40% of revenue from their top two clients. This concentration creates a structural risk that is difficult to mitigate through operational excellence alone. When the largest client leaves, revenue drops by a proportion that typically exceeds the business&apos;s profit margin — meaning the owner&apos;s draw goes to zero or negative before any adjustment can be made.
                </P>
                <P>
                  The owner&apos;s dual role as both operator and income recipient creates an additional constraint. Unlike an employee who receives compensation regardless of business performance, the owner must manage the business while simultaneously depending on it for personal income. During periods of stress — client loss, margin compression, seasonal downturns — the owner must invest more time and energy in the business while receiving less income from it. This structural tension has no parallel in employment-based income.
                </P>
              </>
            ),
          },
          {
            heading: "Structural strategies for small business owners",
            body: (
              <>
                <P>
                  The highest-impact structural improvement is reducing client concentration. A business where no single client exceeds 20% of total revenue can absorb the loss of any individual client without eliminating the owner&apos;s draw. Achieving this distribution requires deliberate client acquisition strategy — not just pursuing revenue growth, but pursuing it in a way that distributes revenue across a broader base. This may mean declining a large new client that would increase concentration, or actively marketing to smaller clients who collectively reduce dependency on the largest accounts.
                </P>
                <P>
                  Converting project-based or transactional revenue into recurring agreements directly improves income structure. A web development agency that sells one-time projects has revenue that resets to zero each month. The same agency offering monthly maintenance retainers at $1,500 per client with 15 clients creates $22,500 in monthly recurring revenue — a structural floor that persists regardless of new project sales. The recurring base does not need to replace project income; it needs to cover the owner&apos;s minimum draw and core operating expenses.
                </P>
                <P>
                  Maintaining a business reserve fund separate from personal savings creates a structural buffer between business volatility and owner income. A reserve fund equal to three to six months of operating expenses allows the business to weather client losses, seasonal downturns, and margin compression without immediately reducing the owner&apos;s draw. This buffer converts acute business disruptions into manageable cash flow events rather than personal income crises.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Small Business"
        howIncomeWorks="Owner's draw from business profit after all operating expenses, payroll, taxes, and debt service. Revenue is not income — the owner receives what remains after every other obligation is met. Margins vary monthly based on project mix, client payment timing, and expense fluctuation. The owner is the last to be paid and absorbs all downside variance. No employer benefits, no paid leave, no structural income floor independent of business performance."
        typicalRange="30-50. Owners with diversified client bases (no single client exceeding 20% of revenue), recurring revenue streams, and healthy margins score toward the upper range. Owners with high client concentration, project-based revenue, thin margins, or significant seasonality score toward the lower range. The ratio of recurring revenue to total revenue is a primary differentiator."
        biggestRisk="Revenue concentration combined with margin compression. When a business derives more than 40% of revenue from one or two clients, the loss of either client can eliminate the owner's entire draw. Margin compression from rising costs, competitive pricing pressure, or scope creep further reduces the available income even when revenue is maintained. The combination of concentrated revenue and thin margins creates a structure where the owner's income is the first casualty of any business disruption."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={25} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Marketing agency owner — 3 clients, largest is 55% of revenue"
        setup="Owner of a marketing agency generating $360,000 in annual revenue from three clients. Client A: $198,000 (55% of revenue) — a mid-size SaaS company on a month-to-month agreement. Client B: $108,000 (30%) — a regional healthcare system on a 12-month contract. Client C: $54,000 (15%) — a local real estate firm on quarterly renewals. Total operating expenses including two contractors: $280,000. Owner's annual draw: $80,000."
        risk="Client A's new CMO initiates an agency review and ultimately moves to a larger agency. The $198,000 in annual revenue is lost over a 60-day transition period. Remaining revenue: $162,000. Remaining expenses (after reducing one contractor): $220,000. The business now operates at a $58,000 annual deficit."
        outcome="Estimated stability score: 30-36. The owner's draw goes from $80,000 to negative — the business cannot cover its remaining expenses from remaining revenue, even after reducing contractor costs. The owner must either inject personal capital, take on debt, or rapidly acquire new clients to restore positive cash flow. Recovery timeline: four to eight months to replace the lost revenue, during which the owner draws nothing."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Revenue"
        right="Owner Income"
        explanation="Revenue measures total business sales. Owner income measures what the owner actually takes home after all business obligations are met. A business generating $500,000 in revenue with $460,000 in expenses produces $40,000 in owner income. A business generating $300,000 with $220,000 in expenses produces $80,000. Higher revenue does not mean higher owner income — margin and expense structure determine the owner's draw."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Revenue is what the business earns. Income is what you keep. They are not the same number." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/business-owner-one-vs-three-sources", label: "Scenario: Business Owner — 1 vs 3 Revenue Sources" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/income-stability-contractors", label: "Income Stability for Contractors" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "My business has been growing every year — doesn't that mean my income is stable?",
            a: "Revenue growth indicates business momentum, not income stability. A business growing from $300,000 to $400,000 in revenue while expenses grow from $250,000 to $360,000 has increased the owner's draw by only $10,000 while dramatically increasing the business's scale and complexity. Growth can actually reduce stability if it increases client concentration, compresses margins, or requires taking on fixed costs that the business cannot sustain through a downturn.",
          },
          {
            q: "How does client concentration specifically affect my score?",
            a: "Client concentration affects your score because it determines the severity of a single-client loss event. A business where the top client represents 20% of revenue can absorb that loss while maintaining a reduced but positive owner's draw. A business where the top client represents 55% of revenue may produce a negative cash flow position immediately upon losing that client. The model evaluates the structural damage of losing the largest client, not just the probability of it happening.",
          },
          {
            q: "Should I pay myself a fixed salary from the business?",
            a: "A fixed owner salary creates the appearance of stability but does not change the underlying structure. If the business cannot support the fixed draw during a downturn, the owner either depletes business reserves, takes on debt, or reduces the draw anyway. A more effective structural strategy is to maintain a modest base draw that the business can sustain through a three-month revenue decline, supplemented by quarterly distributions when cash flow permits.",
          },
          {
            q: "Does having employees improve or hurt my stability score?",
            a: "Employees create fixed costs that must be met before the owner draws income, which can reduce the owner's draw during downturns. However, employees also enable the business to serve more clients simultaneously, reducing single-client dependency. The net effect depends on whether the employees generate enough diversified revenue to offset their cost. A business with employees serving 15 clients has better structural resilience than a solo operation serving three.",
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
