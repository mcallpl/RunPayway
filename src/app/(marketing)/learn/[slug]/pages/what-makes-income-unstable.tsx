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

export default function WhatMakesIncomeUnstable() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="What Makes Income Unstable"
        definition="Income is unstable when it depends on a single source, requires constant active effort, has no forward visibility, and lacks contractual protection."
        subtitle="Instability is not low income. It is structurally exposed income."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Unstable income can be high, consistent, and still structurally fragile.",
          "Single-source dependency is the most common instability pattern.",
          "The absence of contracts converts every income source into at-risk revenue.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The anatomy of unstable income",
            body: (
              <>
                <P>
                  Income instability is not defined by the amount earned or the consistency of historical earnings. It is defined by structural properties that make income vulnerable to disruption. The four primary markers of instability are: single-source concentration, active-effort dependency, absence of forward visibility, and lack of contractual protection.
                </P>
                <P>
                  Single-source concentration means that a disproportionate share of total income depends on one client, one employer, one platform, or one revenue channel. When that single source is disrupted, the impact on total earnings is catastrophic rather than incremental. Active-effort dependency means that income stops when work stops — there is no mechanism for earnings to continue during illness, vacation, or involuntary pause.
                </P>
                <P>
                  Absence of forward visibility means there is no contractual or structural basis for predicting next month&apos;s income. Each period&apos;s earnings depend entirely on new activity during that period. Lack of contractual protection means that income sources can be terminated without notice, negotiation, or penalty. Any combination of these factors creates instability. The presence of all four creates severe structural fragility regardless of income level.
                </P>
              </>
            ),
          },
          {
            heading: "Why high earners are often the most exposed",
            body: (
              <>
                <P>
                  There is a counterintuitive relationship between income level and income instability. Many of the highest-earning professionals — top-performing salespeople, senior consultants, specialized freelancers — earn large amounts from structurally fragile arrangements. A salesperson earning $350,000 in commissions from a single territory with no base salary has high income and extreme structural exposure. A consultant billing $500 per hour to one client has an impressive rate and complete single-source dependency.
                </P>
                <P>
                  High earners are disproportionately exposed because the characteristics that produce high income — specialized expertise, premium pricing, concentrated client relationships — often work against structural diversification. The more specialized and highly compensated the work, the fewer potential sources exist and the greater the dependency on each individual relationship.
                </P>
                <P>
                  This creates a paradox: the professionals who appear most financially secure based on their earnings are frequently the most structurally fragile. The income number is impressive. The income architecture is brittle. Without structural measurement, this fragility remains invisible until a disruption event reveals it.
                </P>
              </>
            ),
          },
          {
            heading: "Recognizing instability before disruption",
            body: (
              <>
                <P>
                  Income instability is identifiable before it produces consequences. The structural markers — concentration, active dependency, lack of visibility, absence of contracts — are observable at any point. They do not require a disruption event to become apparent. They require measurement.
                </P>
                <P>
                  The challenge is that unstable income often feels stable when conditions are favorable. A freelancer with one excellent client relationship that has lasted three years experiences that income as reliable. But reliability of past performance is not the same as structural resilience. The income continued because the external conditions that could disrupt it did not occur — not because the structure would survive if they did.
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
        title="Top-performing real estate agent with zero recurring revenue"
        setup="Residential real estate agent earning $280,000 annually, consistently ranked in the top 5% of their brokerage. All income is transaction-based commission. No property management, no referral agreements, no retainer arrangements. Income depends entirely on closing new transactions each month."
        risk="Despite exceptional historical performance, the income structure exhibits all four instability markers. Single-channel dependency (transaction commissions only). Complete active-effort dependency (income stops when transactions stop). Zero forward visibility (no contracted future closings). No contractual protection on the income stream itself. A market slowdown, health event, or regulatory change could reduce income by 50-80% within a single quarter."
        outcome="RunPayway estimates a stability score of 16-24 for this profile. The agent is a top performer by every conventional measure. The income structure is among the most fragile in any profession. This divergence between performance and structural resilience is precisely what income stability measurement is designed to surface."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="High Income"
        right="Stable Income"
        explanation="High income describes the magnitude of current earnings. Stable income describes the structural likelihood that earnings persist under adverse conditions. Many of the highest earners have the least stable income structures because concentration and specialization — the drivers of high earnings — are also the drivers of structural fragility."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Unstable income does not announce itself. It performs perfectly — until it doesn't." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/income-risk-explained", label: "Income Risk Explained" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/income-stability-sales-professionals", label: "Income Stability for Sales Professionals" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is all commission-based income unstable?",
            a: "Not necessarily. Commission income with recurring components — such as insurance renewals, SaaS upsells, or management fees — can be structurally stable. The instability comes from the structure (transaction-based, non-recurring, unprotected), not from the compensation model itself.",
          },
          {
            q: "Can unstable income become stable without earning more?",
            a: "Yes. Stability is a structural property, not an amount. Converting project work to retainer agreements, adding a second client, or securing a minimum-term contract all improve stability without requiring higher earnings. The changes are architectural, not volumetric.",
          },
          {
            q: "Is gig economy income always unstable?",
            a: "Gig income tends toward instability because it typically exhibits active-effort dependency, lack of contracts, and limited forward visibility. However, a gig worker with multiple platforms, consistent demand patterns, and diversified service offerings has a meaningfully different structural profile than one dependent on a single platform.",
          },
          {
            q: "How does instability affect borrowing capacity?",
            a: "Currently, most lenders do not formally measure income instability. They evaluate income history. This means structurally unstable income can qualify for loans that the underlying structure may not support. As income stability measurement becomes more widespread, lending criteria are likely to incorporate structural factors.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Income's Structural Exposure"
        sub="Get your income stability score — structure, risk factors, and a concrete improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
