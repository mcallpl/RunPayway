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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilitySalesProfessionals() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Sales Professionals"
        definition="Sales income resets each quarter. Last quarter's performance doesn't carry forward structurally — next quarter starts from zero unless new deals close."
        subtitle="Why on-target earnings and income stability measure fundamentally different things."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Commission income is structurally non-persistent — it must be re-earned each period",
          "Base salary provides a floor, but commission often represents 50-70% of total compensation",
          "Most sales professionals score between 25 and 40 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How sales income works",
            body: (
              <>
                <P>
                  Sales compensation is typically structured as a combination of base salary and variable commission. The base provides a guaranteed monthly payment — a structural floor that exists regardless of performance. The commission component is earned by closing deals, hitting quotas, or generating revenue against defined targets. The ratio between base and commission varies by industry and role, but a 40/60 or 50/50 split is common in enterprise and SaaS sales.
                </P>
                <P>
                  The critical structural characteristic of commission income is that it does not persist. A sales representative who closes $500,000 in new business in Q1 does not carry that revenue into Q2. The quota resets. The pipeline must be rebuilt. The commission earned in the previous period has no structural connection to income in the next period unless the deals generate recurring revenue with ongoing commission trails — and most compensation plans do not include meaningful trail commissions.
                </P>
                <P>
                  On-target earnings (OTE) figures represent what a sales professional would earn if they hit 100% of quota consistently. In practice, attainment varies. A representative with $180,000 OTE — $72,000 base and $108,000 variable — may earn $180,000 in a strong year and $110,000 in a weak one. The base remains constant, but the commission component can swing by 50% or more depending on deal flow, market conditions, and pipeline health.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores tend to be low",
            body: (
              <>
                <P>
                  The base salary component of sales compensation provides genuine structural protection — it is contractually guaranteed and arrives regardless of performance. This is why sales professionals generally score above zero and above some categories of pure commission earners. However, the base typically represents only 35-50% of total expected compensation, which means the majority of income lacks structural persistence.
                </P>
                <P>
                  Income persistence is the primary risk factor. Commission income earned in one period does not create any structural claim on income in the next period. Each quarter, the sales professional must generate new pipeline, advance new opportunities, and close new deals to earn the variable component of their compensation. If pipeline development stalls — due to market conditions, territory changes, product issues, or personal capacity — commission income can decline sharply within a single quarter.
                </P>
                <P>
                  Quota attainment volatility compounds this risk. Sales quotas are set by the employer and can change. Territory assignments shift. Product-market fit evolves. Compensation plans are restructured. These employer-controlled variables directly affect the sales professional&apos;s ability to earn commission, but the professional has limited influence over these decisions. A top performer under one compensation plan can become a median performer under a restructured plan without any change in their skill or effort.
                </P>
              </>
            ),
          },
          {
            heading: "Structural considerations for sales professionals",
            body: (
              <>
                <P>
                  The most significant structural lever for sales professionals is the base-to-variable ratio. A role with a 70/30 split — 70% base, 30% commission — has fundamentally different income stability than a role with a 30/70 split, even if the OTE is identical. When evaluating opportunities, the base salary percentage is a direct proxy for structural income protection. Higher base ratios produce higher stability scores, all else being equal.
                </P>
                <P>
                  Recurring revenue trails provide a second layer of structural improvement. In some compensation plans, the sales professional earns ongoing commission on the recurring revenue their closed deals generate — typically 2-5% of annual contract value for the life of the account. These trails create income that persists beyond the initial close and accumulates over time. A sales professional with three years of trail commissions on a growing book of business has meaningfully more stable income than one whose compensation resets entirely each quarter.
                </P>
                <P>
                  Diversifying income beyond the primary employer is the third structural strategy. Sales professionals with advisory consulting engagements, board positions, investment income, or side businesses create income streams that do not depend on their employer&apos;s quota structure or compensation plan. These secondary streams may be modest in absolute terms, but they reduce concentration risk and provide a buffer if the primary sales role is disrupted by a plan change, layoff, or territory reassignment.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Sales"
        howIncomeWorks="Base salary plus variable commission, typically structured as a 40/60 or 50/50 split against on-target earnings. Commission is earned by closing deals against quota. Quota resets each period — quarterly or annually. Commission income does not persist from one period to the next unless the compensation plan includes recurring revenue trails. OTE represents theoretical maximum at 100% attainment."
        typicalRange="25-40. Sales professionals with high base-to-variable ratios, recurring revenue trails, and supplemental income sources score toward the upper range. Sales professionals in pure commission or heavily variable roles with no trail commissions score toward the lower range. OTE level does not determine the score — structure does."
        biggestRisk="Income persistence. Commission income must be re-earned each period. Last quarter's performance creates no structural claim on next quarter's income. A strong Q1 followed by a weak Q2 can reduce annual earnings by 20-30% with no contractual protection. Employer-controlled variables — quota changes, territory reassignment, plan restructuring — can alter earning capacity without the professional's consent."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={35} recurring={10} atRisk={55} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="SaaS sales rep, $180K OTE, 60% commission, pipeline dependent"
        setup="Enterprise SaaS account executive with $180,000 OTE — $72,000 base salary and $108,000 in variable commission at 100% quota attainment. Commission is earned on new annual contract value closed each quarter. No recurring revenue trails. Pipeline consists of 8-12 opportunities with an average sales cycle of 90-120 days."
        risk="Two enterprise deals representing 45% of the quarterly pipeline slip to next quarter due to buyer procurement delays. A third deal is lost to a competitor. Quarterly attainment drops from projected 110% to 55%. Commission income for the quarter falls from $27,000 to $14,850 — a 45% reduction. The pipeline for next quarter is thinner because development time was invested in deals that did not close on schedule."
        outcome="Estimated stability score: 28-35. The base salary provides a meaningful floor at $72,000 annually, but 60% of total expected compensation resets each quarter with no structural carryover. A single weak quarter reduces annual earnings by approximately $12,000-$15,000. Two consecutive weak quarters can reduce total compensation to $120,000-$130,000 against a $180,000 OTE — a gap that no amount of future performance can retroactively close."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Closing Deals"
        right="Building Durable Income"
        explanation="Closing deals measures sales execution — the ability to advance opportunities through a pipeline and convert them into revenue. Building durable income measures structural resilience — whether the income generated by those deals persists, accumulates, or must be entirely re-earned each period. A sales professional can be exceptional at closing and still have low income stability if none of that revenue carries forward."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="On-target earnings is a projection. Your income stability score measures what is structurally protected if you miss the target." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I consistently hit quota — doesn't that make my income stable?",
            a: "Consistent quota attainment indicates strong performance, but it does not create structural protection. Your ability to hit quota depends on variables you do not fully control — territory assignment, product-market fit, compensation plan structure, and market conditions. A quota change, territory reassignment, or market shift can alter your attainment without any change in your skill or effort. Stability measures structure, not track record.",
          },
          {
            q: "How does a higher base-to-variable ratio affect the score?",
            a: "Directly. The base salary is contractually guaranteed income — it arrives regardless of quota attainment. A role with a 70/30 base-to-variable split at $180,000 OTE guarantees $126,000. A role with a 40/60 split at the same OTE guarantees only $72,000. The second role has $54,000 more income at risk each year, and the stability score reflects that structural difference.",
          },
          {
            q: "Do recurring revenue trails significantly improve stability?",
            a: "Yes, over time. Trail commissions — ongoing payments based on the recurring revenue of closed accounts — create income that persists beyond the initial sale. A sales professional who has built a book of business generating $30,000-$50,000 in annual trail commissions has a meaningful income floor that did not exist in year one. The longer the tenure and the larger the book, the greater the structural protection trails provide.",
          },
          {
            q: "Is sales income less stable than freelance income?",
            a: "It depends on the specific structure. A sales role with a substantial base salary (60%+ of OTE) provides more structural protection than most freelance arrangements. A pure commission role with no base provides less. The base salary is the critical differentiator — it creates a contractual floor that most freelancers do not have. Commission income above the base carries similar structural risks to project-based freelance income.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Know What Your Compensation Protects"
        sub="Get your income stability score and see exactly how much of your sales compensation is structurally at risk."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
