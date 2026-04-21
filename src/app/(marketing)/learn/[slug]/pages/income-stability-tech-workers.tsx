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

export default function IncomeStabilityTechWorkers() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Tech Workers"
        definition="Tech compensation appears stable because the employer system is stable. But it depends on one company, one role, and one market cycle — all of which can shift simultaneously."
        subtitle="Why high total compensation can mask structural concentration risk."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Single-employer dependency means 100% income concentration",
          "RSUs and bonuses create variable compensation that appears fixed",
          "Most tech workers score between 40 and 60 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How tech compensation works",
            body: (
              <>
                <P>
                  Tech compensation is typically structured as a package combining base salary, restricted stock units (RSUs), and performance bonuses. A senior engineer at a growth-stage company might receive a total compensation package of $250,000 — composed of $160,000 in base salary, $70,000 in annual RSU vesting, and $20,000 in performance bonus. Each component has different structural characteristics, but all three depend on continued employment at a single organization.
                </P>
                <P>
                  Base salary is the most structurally stable component. It is contractually defined, paid on a regular schedule, and protected by employment law provisions including notice periods and severance in many jurisdictions. However, base salary typically represents only 60-70% of total compensation for mid-to-senior tech roles. The remainder comes from equity and bonus components that are structurally variable even when they appear predictable.
                </P>
                <P>
                  RSUs vest on a schedule — typically over four years with a one-year cliff. The value of vested RSUs depends on the company&apos;s stock price at the time of vesting, which can differ substantially from the grant-date value used in offer letters. A $70,000 annual RSU grant valued at the time of hire may vest at $45,000 or $110,000 depending on stock performance. For pre-IPO companies, the RSUs may have no liquid value at all until a liquidity event occurs. This creates a compensation component that is structurally uncertain in both timing and amount.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores cluster in the 40-60 range",
            body: (
              <>
                <P>
                  Tech workers score higher than most independent professionals because employer-based income provides structural protections by default. Employment agreements, notice periods, severance provisions, unemployment insurance eligibility, and benefits continuation (COBRA) create buffers that independent workers must build themselves. These structural features are reflected in the scoring model as baseline protections that elevate scores above the ranges typical for freelancers, contractors, and creators.
                </P>
                <P>
                  However, the single-employer dependency creates a concentration risk that caps scores below the upper ranges. A tech worker earning $250,000 from one employer has 100% income concentration — the same structural characteristic as a freelancer with one client. If that employment relationship ends, all income ceases simultaneously. The difference is that employment provides some transition protections (severance, notice periods), while freelancing typically does not. But the underlying concentration risk is structurally identical.
                </P>
                <P>
                  Layoff exposure introduces cyclical risk that is specific to the tech industry. Technology companies are particularly susceptible to market-cycle-driven workforce reductions. During contractions, companies that hired aggressively during growth periods reduce headcount rapidly. These reductions are often broad-based — affecting entire teams, divisions, or functions rather than individual performance. A tech worker can be performing excellently and still be laid off because their team or product line was eliminated.
                </P>
              </>
            ),
          },
          {
            heading: "Structural strategies for tech workers",
            body: (
              <>
                <P>
                  The most impactful structural improvement is developing income sources outside primary employment. A tech worker who maintains a consulting practice, builds a SaaS product, or generates income from technical writing, teaching, or advisory work creates diversification that reduces single-employer dependency. Even modest secondary income — $20,000 to $40,000 annually — materially changes the structural profile by ensuring that a layoff does not reduce income to zero.
                </P>
                <P>
                  Understanding the true stable component of compensation is essential for financial planning. A tech worker with $250,000 in total compensation should plan around the structurally stable portion — typically the base salary — rather than the total package. RSU values fluctuate with stock price. Bonuses depend on company performance and individual review outcomes. Building financial obligations around total compensation rather than base salary amplifies the impact of any component reduction.
                </P>
                <P>
                  Building and maintaining an active professional network provides structural protection against extended unemployment. Tech workers who are visible in their professional community — through open source contributions, conference speaking, technical writing, or industry relationships — typically re-employ faster after layoffs. Shorter unemployment duration directly reduces the financial impact of job loss, even though it does not change the underlying income structure.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Technology"
        howIncomeWorks="Base salary plus restricted stock units (RSUs) and performance bonuses, all from a single employer. Base salary is contractually fixed and paid biweekly or monthly. RSUs vest on a multi-year schedule with value tied to stock price — creating a compensation component that is uncertain in both timing and realized amount. Bonuses are discretionary and depend on company and individual performance. All three components terminate simultaneously upon job loss."
        typicalRange="40-60. Tech workers with secondary income sources, significant liquid savings relative to expenses, and roles at stable organizations score toward the upper range. Tech workers with high RSU concentration, single-employer dependency, and roles at early-stage or growth-stage companies with layoff history score toward the lower range. The proportion of base salary to total compensation is a key differentiator."
        biggestRisk="Single source dependency combined with layoff exposure. 100% of income depends on one employer. Tech industry layoffs tend to be sudden, broad-based, and market-cycle-driven rather than performance-based. When they occur, all compensation components — salary, equity vesting, bonus eligibility, and benefits — terminate simultaneously. The re-employment timeline in a contracted market can extend to three to nine months."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={40} recurring={25} atRisk={35} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Senior engineer at a growth-stage startup — $250K total comp, 40% in RSUs"
        setup="Senior software engineer at a Series C startup. Total compensation package: $150,000 base salary, $80,000 in annual RSU vesting (valued at last funding round), and $20,000 target performance bonus. The company has raised $200 million in venture funding and has 800 employees. The engineer has been at the company for two years and has no income sources outside primary employment."
        risk="The company misses growth targets for two consecutive quarters. The board directs a 20% workforce reduction to extend runway. The engineer's team is restructured and the role is eliminated. Severance: three months of base salary ($37,500). Unvested RSUs are forfeited. No bonus is paid for the current year. The company's stock price drops 40% from the last funding round, reducing the value of any vested but unsold shares."
        outcome="Estimated stability score: 42-50. Effective income drops from $250,000 to $0 after the severance period. The engineer's realized compensation over the termination year is approximately $187,500 base (including severance), $48,000 in RSUs at reduced valuation, and $0 in bonus — a total of approximately $235,500 versus the $250,000 package. In year two, income is $0 until re-employment, which in a contracted tech market may take three to nine months."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Total Compensation"
        right="Stable Compensation"
        explanation="Total compensation includes every component of a tech worker's pay package — base salary, RSUs, bonuses, and benefits. Stable compensation measures only the portion that is structurally protected and predictable. For a tech worker earning $250,000 with 40% in RSUs and bonuses, stable compensation is approximately $150,000. Financial planning built around $250,000 creates a $100,000 structural gap that becomes real during any disruption."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A $250,000 compensation package from a single employer is a $250,000 concentration risk." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-vs-income", label: "Income Stability vs Income" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I have a high salary at a large tech company — isn't that stable?",
            a: "A high salary from a single employer is stable income from an unstable structure. Large tech companies have conducted significant layoffs in recent years, affecting tens of thousands of workers regardless of individual performance. The salary itself is structurally sound while employment continues. The risk is that employment can end abruptly, eliminating all income simultaneously. Stability measures the structure, not the amount.",
          },
          {
            q: "How do RSUs affect my stability score?",
            a: "RSUs are scored as variable compensation because their realized value depends on stock price at vesting, which the employee does not control. RSUs also terminate upon job loss — unvested shares are typically forfeited. A higher proportion of RSUs in total compensation means a larger portion of income is structurally variable, which reduces the stability score relative to a compensation package weighted toward base salary.",
          },
          {
            q: "Does working at a FAANG company improve my score?",
            a: "Employer stability is a factor, but it does not override structural concentration risk. A FAANG employee still has 100% income concentration in a single employer. Large tech companies have demonstrated willingness to conduct large-scale layoffs when business conditions change. The employer's financial stability reduces the probability of disruption but does not change the structural severity if disruption occurs — all income still goes to zero simultaneously.",
          },
          {
            q: "Should I count unvested RSUs in my income planning?",
            a: "From a stability perspective, unvested RSUs should not be counted as reliable income. They depend on continued employment and stock price — two variables outside your control. Financial planning built around base salary creates a conservative but structurally sound foundation. RSU income that materializes above that foundation can be directed to savings, investment, or discretionary spending without creating structural dependency on its continuation.",
          },
          {
            q: "How can a tech worker reach a score above 60?",
            a: "Develop income sources outside primary employment. A tech worker with a $180,000 salary who also earns $40,000 annually from consulting, technical writing, or a side project has diversified their income across two sources. If employment ends, 82% of income is lost but 18% continues. Combined with an emergency fund covering six or more months of expenses, this structure can support scores in the 60-70 range.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Understand Your Structural Position"
        sub="Get your income stability score and see how your compensation structure performs under disruption."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
