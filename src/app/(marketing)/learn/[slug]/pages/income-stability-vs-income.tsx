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

export default function IncomeStabilityVsIncome() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="Income Stability vs Income"
        definition="Income measures how much you earn. Income stability measures whether that earning continues."
        subtitle="Two metrics. Two entirely different questions."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Income is a quantity. Stability is a structural property.",
          "High earners routinely carry the highest structural risk.",
          "No traditional financial instrument separates these two dimensions.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The distinction that financial planning ignores",
            body: (
              <>
                <P>
                  Income and income stability are frequently conflated in financial analysis, lending decisions, and personal planning. When someone earns $250,000 per year, the assumption is that they are financially secure. When someone earns $60,000, the assumption is that they are not. Both assumptions can be wrong because they evaluate only one dimension of a two-dimensional problem.
                </P>
                <P>
                  Income answers the question: how much? Income stability answers the question: how durable? A high income that depends on a single client, a single contract, or a single commission cycle is structurally fragile regardless of its magnitude. A modest income distributed across multiple recurring sources with contractual protection is structurally resilient regardless of its size.
                </P>
                <P>
                  The failure to distinguish between these two measurements creates blind spots in every financial decision that depends on future earning capacity. Mortgage approvals, insurance underwriting, business lending, and personal financial planning all treat income as a single number. That number tells you what happened last year. It tells you nothing about what is likely to happen next year.
                </P>
              </>
            ),
          },
          {
            heading: "Why the gap matters",
            body: (
              <>
                <P>
                  The practical consequence of conflating income with income stability is mispriced risk. Lenders extend credit based on historical earnings without evaluating whether the structure supporting those earnings is sound. Individuals make long-term financial commitments based on current income without understanding how concentrated or unprotected that income actually is.
                </P>
                <P>
                  This is not a theoretical concern. The rise of non-traditional income arrangements — contract work, freelancing, commission-based roles, portfolio careers — means that income structures vary enormously across earners at the same income level. Two professionals earning $200,000 per year may have radically different risk profiles depending on how that income is generated, how many sources contribute to it, and what contractual protections exist.
                </P>
                <P>
                  Until income stability is measured independently of income level, every forward-looking financial decision is working with incomplete information. The amount earned is visible. The durability of that earning is not.
                </P>
              </>
            ),
          },
          {
            heading: "How the two interact",
            body: (
              <>
                <P>
                  Income and income stability are independent variables, but they interact in ways that matter for financial planning. High income with high stability represents the strongest financial position — substantial earnings from diversified, protected sources. High income with low stability represents the most commonly misjudged position — large earnings that could collapse under a single disruption event.
                </P>
                <P>
                  Low income with high stability describes earners whose modest revenue is well-structured — multiple recurring sources, contractual coverage, low concentration risk. These individuals are often better positioned to take on long-term obligations than higher earners with fragile structures. Low income with low stability is the highest-risk quadrant, where both the amount and the durability are insufficient.
                </P>
                <P>
                  Understanding where you fall in this matrix is the first step toward making financial decisions that account for structural reality rather than headline earnings alone.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={20} recurring={30} atRisk={50} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Two earners at $200K — one stable, one fragile"
        setup="Earner A: marketing executive with a salaried position, 2-year employment contract, and severance clause. Earner B: independent marketing consultant earning the same $200,000 from two project-based clients with no written agreements."
        risk="Earner B has complete structural exposure. If either client terminates, 50% of income disappears immediately with no contractual buffer. Earner A has contractual protection, notice periods, and institutional continuity. Same income. Entirely different structural resilience."
        outcome="RunPayway estimates Earner A in the 72-80 stability range. Earner B falls between 28-36. The income figure is identical. The structural risk is not remotely comparable. Any financial decision that treats these two earners equivalently is working with incomplete data."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="How Much"
        right="How Durable"
        explanation="Income level tells you the magnitude of current earnings. Income stability tells you the structural likelihood that those earnings persist under pressure. They are orthogonal measurements. Evaluating one without the other produces an incomplete financial picture."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The highest earners often carry the highest structural risk — because no one told them to measure it." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-vs-net-worth", label: "Income Stability vs Net Worth" },
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
          { href: "/learn/income-risk-explained", label: "Income Risk Explained" },
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Can someone with high income have low income stability?",
            a: "Yes. Income level and income stability are independent measurements. A consultant earning $400,000 from a single client with no contract has high income and very low stability. The amount is large. The structure is fragile.",
          },
          {
            q: "Does increasing income automatically improve stability?",
            a: "No. If additional income comes from the same source or the same structural pattern, it increases earnings without improving resilience. Stability improves when income is diversified across sources, protected by contracts, and structured for recurrence.",
          },
          {
            q: "Why don't lenders already separate these two measurements?",
            a: "Traditional lending evaluates income through tax returns, pay stubs, and bank statements — all backward-looking instruments that capture amount but not structure. The tools to measure income stability independently did not previously exist in a standardized form.",
          },
          {
            q: "Is it possible to have low income but high stability?",
            a: "Yes. An earner with $70,000 distributed across six recurring clients with 12-month agreements has modest income but strong structural resilience. That profile may be better positioned for long-term financial commitments than a $200,000 earner with a single unprotected source.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure What Your Income Number Cannot"
        sub="Get your income stability score — structure, durability, and a roadmap for reducing exposure."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
