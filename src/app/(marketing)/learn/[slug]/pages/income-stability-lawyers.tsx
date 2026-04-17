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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityLawyers() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Lawyers"
        definition="Legal income concentrates heavily in a small number of matters. When the top two or three matters conclude, the revenue gap arrives all at once."
        subtitle="Why billable hours and high rates do not automatically produce structural income stability."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Matter concentration is the primary structural risk for lawyers",
          "Billable hours measure activity, not income durability",
          "Most lawyers score between 35 and 50 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How legal income works",
            body: (
              <>
                <P>
                  Lawyers earn through billable hours, flat fees, contingency arrangements, or retainer agreements — depending on practice area, firm structure, and client relationships. The dominant model for most private practitioners is hourly billing: the lawyer records time spent on client matters and bills at a rate that typically ranges from $200 to $1,000 or more per hour depending on market, seniority, and specialization.
                </P>
                <P>
                  Income is therefore a function of hours billed, realization rate (the percentage of billed time actually collected), and the number and size of active matters. A partner billing 1,800 hours annually at $500 per hour with a 90% realization rate generates approximately $810,000 in collected revenue. But this revenue is not evenly distributed across clients or matters.
                </P>
                <P>
                  In most legal practices, a small number of matters generate a disproportionate share of revenue. It is common for two or three matters to represent 50% to 70% of a lawyer&apos;s annual billings. This concentration is a natural consequence of how legal work is structured — large matters demand more hours, and lawyers naturally allocate capacity toward the highest-value engagements. The structural risk emerges when those matters conclude.
                </P>
              </>
            ),
          },
          {
            heading: "Why matter concentration compresses scores",
            body: (
              <>
                <P>
                  Legal matters are inherently temporary. A litigation case resolves through settlement, trial, or dismissal. A transaction closes. A regulatory matter concludes. When a major matter ends, the revenue it generated ends with it — immediately and completely. Unlike a business with recurring subscription revenue, there is no residual income stream from a concluded matter.
                </P>
                <P>
                  The challenge is that replacing a major matter is neither immediate nor guaranteed. Business development in law is relationship-driven and often slow. A partner whose largest matter concludes may require six to twelve months to develop a replacement engagement of comparable scope. During that period, their billing capacity goes underutilized, and revenue declines significantly.
                </P>
                <P>
                  This dynamic creates a pattern of revenue peaks followed by valleys. The peaks correspond to periods when major matters are active and demanding significant hours. The valleys correspond to transition periods between matters. For lawyers with high matter concentration, these valleys can represent income declines of 40% or more — not because of underperformance, but because the structural dependence on a few matters creates inevitable gaps when they end.
                </P>
              </>
            ),
          },
          {
            heading: "What lawyers can do to build durability",
            body: (
              <>
                <P>
                  The most effective strategy is matter diversification — ensuring that no single matter represents more than 25% of annual billings. This requires active pipeline management and a willingness to limit capacity allocation to any one engagement. It also requires a consistent business development effort that generates new matters before existing ones conclude, rather than after.
                </P>
                <P>
                  Retainer arrangements create structural protection that hourly billing does not. A retainer guarantees a minimum monthly payment regardless of matter activity. Lawyers who establish retainer relationships with ongoing advisory clients create a baseline income floor that persists between major matters. This floor does not need to be large to meaningfully improve stability — even a retainer base representing 20% of income significantly reduces the severity of matter-transition valleys.
                </P>
                <P>
                  Practice area diversification also helps. A lawyer who handles both litigation and transactional work has two distinct demand cycles. When litigation slows, transactional activity may be strong, and vice versa. A single-practice-area lawyer has no such counterbalance and is fully exposed to the cyclical patterns of that one area.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Legal"
        howIncomeWorks="Primarily billable hours at rates ranging from $200 to $1,000+ per hour. Income depends on active matter volume, hours billed, and realization rates. Some practices use flat fees, contingency arrangements, or monthly retainers. Revenue is matter-based — when a matter concludes, the income from that matter ends immediately."
        typicalRange="35-50. Lawyers with diversified matter portfolios and retainer clients score toward the upper range. Lawyers with high concentration in a small number of large matters score toward the lower range. Firm equity partners with predictable draws may score higher than solo practitioners with volatile matter flow."
        biggestRisk="Concentration in top matters. When two or three matters represent 50-70% of billings and those matters conclude in the same period, the revenue gap is immediate and severe. Replacement matters take months to develop. The transition period creates income volatility that billable rate and historical earnings do not predict."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={25} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Litigation partner with concentrated billings"
        setup="Partner at a mid-size firm billing $650 per hour. Three active matters generate 65% of annual billings — a commercial dispute ($280,000), a breach of contract case ($190,000), and a regulatory investigation ($150,000). Total billings: $950,000. Remaining 35% comes from seven smaller matters."
        risk="The commercial dispute settles. The regulatory investigation concludes with a consent order. Within four months, two of the three largest matters are complete. Billings from these two matters — $470,000 annually — drop to zero. The partner has seven smaller matters generating $332,000 and must rebuild pipeline to replace the lost capacity."
        outcome="Annual billings fall from $950,000 to approximately $500,000 while replacement matters are developed. Estimated stability score: 34-42. The partner's rate and reputation are unchanged, but the income structure was dependent on three matters that were always going to end."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Billable Hours"
        right="Stable Revenue"
        explanation="Billable hours measure capacity utilization — how much of a lawyer's time is being sold. Stable revenue measures the structural durability of the income those hours generate. A lawyer billing 2,000 hours across two matters has high utilization but fragile income. A lawyer billing 1,600 hours across fifteen matters and three retainer clients has lower utilization but significantly more durable revenue."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Every matter ends. The question is whether the income structure survives when the top two matters end at the same time." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/income-stability-doctors", label: "Income Stability for Doctors" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I'm a firm partner with a guaranteed draw — does that improve my score?",
            a: "A guaranteed draw provides short-term income protection but is typically contingent on firm profitability and partner performance metrics. It creates a floor, which improves structural stability relative to a solo practitioner. However, draws can be adjusted annually based on firm economics, so they offer less protection than they appear to on the surface.",
          },
          {
            q: "Does contingency work affect stability differently than hourly billing?",
            a: "Yes. Contingency income is even more concentrated and unpredictable than hourly billing. A single large contingency case may generate a significant fee upon resolution — or nothing at all. The binary outcome makes contingency-heavy practices among the most volatile income structures in the legal profession. Blending contingency with retainer income can offset this volatility.",
          },
          {
            q: "How do retainer clients help my score?",
            a: "Retainers create predictable, recurring income that persists regardless of matter-level activity. A retainer base representing 20-30% of total income creates a floor that reduces the impact of matter transitions. The retainer income arrives monthly, is contractually committed, and does not depend on the conclusion timing of any specific matter.",
          },
          {
            q: "What is a realistic target score for a practicing lawyer?",
            a: "Most practicing lawyers score between 35 and 50. Reaching above 50 typically requires a combination of diversified matter portfolio (no single matter exceeding 25% of billings), retainer relationships providing at least 20% of income, and practice area diversification. Solo practitioners face a lower ceiling than firm partners due to the absence of institutional income smoothing.",
          },
          {
            q: "Does my billing rate matter for stability?",
            a: "Billing rate affects earning capacity but not income stability. A lawyer billing at $800 per hour with two concentrated matters has the same structural vulnerability as a lawyer billing at $300 per hour with two concentrated matters. The rate determines how much income is at risk — the structure determines how much of that income is protected.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Assess Your Practice", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Assess Your Practice Structure"
        sub="Get your income stability score and see where matter concentration creates structural exposure."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
