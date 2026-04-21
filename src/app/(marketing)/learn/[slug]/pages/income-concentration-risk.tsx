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

export default function IncomeConcentrationRisk() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Risk Factor"
        title="Income Concentration Risk"
        definition="Income concentration risk is the vulnerability created when a disproportionate share of income depends on a single source, client, or arrangement."
        subtitle="Concentration is the most common structural weakness in high-earning profiles. It is also the least measured."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Over 60% of self-employed earners derive more than half their income from a single client",
          "Concentration risk is invisible on tax returns and bank statements",
          "Losing one source that represents 40%+ of income triggers a structural collapse, not a dip",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What Concentration Risk Actually Means",
            body: (
              <>
                <P>
                  Income concentration risk exists when the loss of a single source, client, or contract would reduce total earnings by a material percentage. The threshold is not arbitrary. When any single source exceeds 30% of total income, the earner&apos;s financial structure becomes dependent on the continuity of that relationship. Above 50%, the dependency is acute.
                </P>
                <P>
                  This is distinct from income amount or income variability. An earner can have perfectly consistent monthly deposits and still carry extreme concentration risk if those deposits originate from one source. The consistency masks the fragility. A single decision by a single counterparty — to renegotiate, delay payment, or terminate — can eliminate the majority of income in a single event.
                </P>
                <P>
                  Concentration risk is structural, not situational. It does not depend on the quality of the client relationship or the earner&apos;s performance. It depends on the mathematical distribution of income sources. A portfolio with one position representing 70% of assets would never pass institutional review. Yet income structures with identical concentration profiles are treated as normal.
                </P>
              </>
            ),
          },
          {
            heading: "How Concentration Develops Over Time",
            body: (
              <>
                <P>
                  Concentration rarely begins as a deliberate choice. It emerges gradually. An earner acquires a large client or contract. Revenue grows. The earner allocates more capacity to serve that relationship because the economics are favorable — the revenue per hour exceeds what other sources provide. Smaller clients receive less attention. Some are not replaced when they leave.
                </P>
                <P>
                  Over a period of twelve to thirty-six months, what began as a diversified portfolio of clients consolidates into a structure dominated by one or two sources. The total income may increase during this period, reinforcing the perception that the business is thriving. The structural risk increases in parallel, but because it produces no visible symptom until the concentration source is disrupted, it goes undetected.
                </P>
                <P>
                  This pattern is especially common among consultants, agency owners, and commission-based professionals. The economic incentive to deepen existing relationships is stronger than the incentive to maintain breadth. By the time the earner recognizes the concentration, unwinding it requires rebuilding a client pipeline from a position of dependency.
                </P>
              </>
            ),
          },
          {
            heading: "Why Standard Financial Metrics Miss It",
            body: (
              <>
                <P>
                  Tax returns report total income. Bank statements report deposit frequency and amounts. Neither instrument decomposes income by source to reveal distribution patterns. A W-2 showing $180,000 in annual earnings from a single employer is, by definition, 100% concentrated — but no standard financial assessment flags this as a risk factor.
                </P>
                <P>
                  Credit scoring models treat income as a binary: verified or unverified, sufficient or insufficient. They do not evaluate the structural resilience of the income that underlies the score. Two applicants with identical incomes — one diversified across eight clients, the other dependent on a single contract — receive identical treatment in conventional underwriting.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={20} atRisk={70} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Agency owner with 70% of revenue from one client"
        setup="A digital marketing agency generates $320,000 in annual revenue. One enterprise client accounts for $224,000 — roughly 70% of total billings. The remaining 30% comes from four smaller accounts, none exceeding $30,000. The agency has three full-time employees whose salaries are calibrated to the current revenue level."
        risk="The enterprise client operates on a month-to-month agreement with a 30-day termination clause. No contractual commitment extends beyond the current billing cycle. If the client churns, the agency loses 70% of revenue while retaining 100% of fixed costs. The four remaining clients cannot absorb the payroll obligation."
        outcome="RunPayway estimates a stability score of 22-28 for this profile. The concentration dimension alone would suppress the score, but the absence of contractual protection compounds the risk. Redistributing capacity to acquire three additional clients at $50,000-$70,000 each — with six-month minimum terms — would shift the score into the 45-52 range."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Diversified Income"
        right="Concentrated Income"
        explanation="Diversified income distributes risk across multiple independent sources, so no single loss event can eliminate a material share of earnings. Concentrated income consolidates revenue into one or two sources, creating structural dependency. The distinction is not about income amount — it is about survivability under disruption."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="If one client leaving would force you to restructure your business, you do not have a client — you have an employer without benefits." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/structural-income-risk-explained", label: "Structural Income Risk Explained" },
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "At what percentage does concentration become a risk?",
            a: "Any single source exceeding 30% of total income introduces material concentration risk. Above 50%, the risk is acute — the loss of that source would require fundamental restructuring. Below 20%, concentration is generally within acceptable parameters for most income structures.",
          },
          {
            q: "Is W-2 employment automatically concentrated?",
            a: "Yes. A single-employer W-2 earner has 100% income concentration by definition. However, the risk is partially offset by employment protections, notice periods, severance norms, and unemployment insurance — factors that do not exist in 1099 or self-employed concentration scenarios.",
          },
          {
            q: "Can I have high income and high concentration risk simultaneously?",
            a: "Absolutely. Concentration risk is independent of income level. An earner generating $500,000 from one client has higher structural risk than an earner generating $120,000 from eight clients. The dollar figure is larger, but the structure is more fragile.",
          },
          {
            q: "How quickly can concentration risk be reduced?",
            a: "Meaningful diversification typically requires 6-18 months of deliberate pipeline development. The timeline depends on the industry, sales cycle length, and current capacity allocation. Quick fixes — such as accepting low-value clients to pad the count — can reduce the concentration metric without meaningfully reducing structural risk.",
          },
          {
            q: "Does RunPayway penalize all forms of concentration equally?",
            a: "No. The scoring model distinguishes between concentration with contractual protection and concentration without it. A single client representing 60% of income under a two-year contract carries less structural risk than the same concentration under a month-to-month arrangement.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Know Where Your Income Concentrates"
        sub="Get a diagnostic score that reveals concentration risk alongside five other structural dimensions."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
