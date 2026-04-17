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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function SalesRepBasePlusCommission() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Sales Rep — Base + Commission"
        definition="A sales professional earning $180K with a 40% base / 60% commission split. The base creates a floor. The commission creates the risk."
        subtitle="What happens when the protected part of your income is only 40% of the total."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "$72K base provides a contractual floor — but covers less than half of total income",
          "Commission resets quarterly, creating recurring income gaps",
          "Estimated stability score: 30-45",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The income setup",
            body: (
              <>
                <P>
                  This scenario describes a sales professional — an account executive, enterprise sales rep, or business development leader — earning $180,000 annually with a 40/60 base-to-commission split. The base salary of $72,000 is contractually guaranteed and paid biweekly regardless of performance. The commission component of $108,000 is earned through quota attainment and paid quarterly based on closed revenue.
                </P>
                <P>
                  The commission structure is quota-driven. The rep has a quarterly quota — a revenue target they must hit to earn the full commission payout. Hitting 100% of quota yields the target commission. Overperformance generates accelerators. Underperformance reduces or eliminates the commission for that quarter. The commission resets to zero at the start of each quarter, meaning past performance carries no structural weight into future periods.
                </P>
                <P>
                  This is one of the most common income structures in professional sales. It is designed to align the rep&apos;s incentives with the company&apos;s revenue goals. From a stability perspective, however, it creates a bifurcated income — a protected floor and an at-risk ceiling — where the majority of total compensation depends on continuous pipeline generation and quota attainment.
                </P>
              </>
            ),
          },
          {
            heading: "Why the commission component creates structural risk",
            body: (
              <>
                <P>
                  The commission portion of this income — $108,000 annually, or 60% of total compensation — resets every quarter. This means the sales rep effectively starts from zero four times per year. There is no carryover credit, no banked commission from prior periods, and no structural cushion from previous success. Each quarter is an independent performance evaluation with independent financial consequences.
                </P>
                <P>
                  Pipeline dependency is the primary risk. Commission earnings require a continuous flow of qualified opportunities through the sales process. If the pipeline thins — due to market conditions, territory changes, product issues, or organizational restructuring — the rep may have the skill to close deals but insufficient opportunity to do so. The commission structure does not distinguish between a rep who cannot sell and a rep who has nothing to sell.
                </P>
                <P>
                  Quota changes add another layer of unpredictability. Companies regularly adjust quotas based on market conditions, company growth targets, or territory realignment. A rep who consistently hit quota under one set of targets may find themselves at 70% attainment under revised targets — not because their performance changed, but because the measurement changed. The commission income swings accordingly, and the rep has no structural recourse.
                </P>
              </>
            ),
          },
          {
            heading: "What happens when quota is missed",
            body: (
              <>
                <P>
                  Missing quota for a single quarter reduces the commission payout for that period — but the consequences extend further. Many commission plans have tiered structures where reps below threshold (typically 50-70% of quota) earn reduced or zero commission. A rep at 60% of quota may earn only 40% of the target commission rather than a proportional 60%. The structure penalizes underperformance non-linearly.
                </P>
                <P>
                  Missing quota for two consecutive quarters triggers additional structural consequences. Performance improvement plans, territory reassignment, reduced account assignments, and termination are all common outcomes. The rep&apos;s position within the organization weakens, which further reduces their ability to generate pipeline and recover. The miss compounds itself.
                </P>
                <P>
                  The financial impact of two missed quarters on this income structure is significant. If the rep earns 50% of target commission for two quarters, annual income drops from $180,000 to approximately $126,000 — a 30% decline. If the rep earns zero commission for two quarters due to sub-threshold performance, annual income drops to $126,000-$135,000 depending on the remaining quarters. The base salary catches the fall but does not prevent substantial income reduction.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="$180,000 total compensation: $72,000 base salary (40%) paid biweekly plus $108,000 in commission (60%) paid quarterly based on quota attainment. Quota-driven commission structure with quarterly resets. No residual accounts — all commission earned through new and expansion revenue."
        riskExposure="Commission resets quarterly, creating four independent performance windows per year. Pipeline dependency means income depends on continuous opportunity flow. Quota changes can alter attainment calculations without changing rep performance. 60% of income has no structural protection beyond the current quarter."
        disruption="Rep misses quota for two consecutive quarters. Causes: territory reassignment reduces account base, key prospect delays purchasing decision, product launch pushed back. Commission earnings drop to 40% of target for both quarters. Annual income falls from $180,000 to approximately $135,000. Performance review initiated."
        scoreRange="30-45. The base salary provides meaningful structural protection that pure commission roles lack — $72,000 is contractually guaranteed regardless of performance. But 60% of income resets quarterly with no carryover, creating significant variance. The score range depends on quota stability, territory quality, and whether any commission component has residual characteristics."
        howToFix="Build residual accounts that generate recurring commission without requiring new sales activity each quarter. Diversify product mix so commission is not dependent on a single product line or sales motion. Negotiate for a higher base-to-commission ratio if possible, or seek roles with annual rather than quarterly commission resets. Outside the primary role, develop a secondary income stream that is not employer-dependent."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={40} recurring={10} atRisk={50} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Two quarters below quota"
        setup="Sales rep earning $180,000 — $72K base plus $108K commission. Quota set at $500,000 per quarter in new revenue. Commission earned at 1x rate above 70% attainment threshold. Below 70%, commission drops to 0.5x rate. Territory was recently reassigned, reducing established account base by 40%."
        risk="Q1: Rep closes $310,000 against $500,000 quota — 62% attainment. Below threshold. Commission earned at 0.5x: approximately $8,400 versus $27,000 target. Q2: Pipeline rebuilding underway but still thin. Closes $340,000 — 68% attainment. Still below threshold. Commission: approximately $9,200. Two consecutive misses trigger performance review."
        outcome="First-half income: $72,000 (base annualized) + $17,600 (commission) = $89,600 annualized rate, versus $180,000 target. The base caught $72,000. The commission structure gave back $36,400 of the $54,000 target. Estimated score: 32-38. The floor held, but the floor is only 40% of total compensation."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Total Compensation"
        right="Protected Compensation"
        explanation="Total compensation includes everything earned when performance targets are met — base plus full commission. Protected compensation includes only the portion that is contractually guaranteed regardless of performance. For this rep, total compensation is $180,000 but protected compensation is $72,000. The $108,000 gap between the two is the structural risk exposure — income that exists only when conditions cooperate."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A 40/60 split means 60% of your income exists only in the quarter you earn it. Miss two quarters, and the gap between what you expected and what you received is the size of a car payment — every month." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-sales-professionals", label: "Income Stability for Sales Professionals" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/200k-realtor-commission-heavy", label: "Scenario: $200K Realtor — Commission Heavy" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does my base salary protect me enough?",
            a: "It provides a meaningful floor — $72,000 is real, contractual income that arrives regardless of quota performance. But if your financial obligations are built around $180,000, the base covers only 40% of what you need. The protection is real but partial. The question is whether your financial structure can absorb a sustained period at the base-only level.",
          },
          {
            q: "How do residual accounts help my score?",
            a: "Residual accounts generate commission from existing relationships without requiring new sales activity each quarter. If 20% of your commission comes from account renewals or expansion revenue that recurs automatically, that portion has structural characteristics closer to base salary than to new-business commission. It reduces the amount of income that resets to zero each quarter.",
          },
          {
            q: "Does a higher base-to-commission ratio improve stability?",
            a: "Yes. A 60/40 split (60% base, 40% commission) has more structural protection than a 40/60 split. The same $180,000 with $108,000 in base and $72,000 in commission would score higher because a larger share is contractually guaranteed. The tradeoff is typically lower upside in strong performance quarters, but greater resilience in weak ones.",
          },
          {
            q: "What if I consistently exceed quota?",
            a: "Consistent overperformance is positive for earnings but does not change the structural exposure. A rep who hit 140% of quota last year still starts at zero next quarter. Past outperformance creates no structural carryover. The score measures the architecture of the income — how much is protected, how often it resets, and what happens when performance dips — not the historical track record.",
          },
          {
            q: "Should I worry about quota changes?",
            a: "Quota adjustments are a structural risk factor. Companies change quotas based on growth targets, territory changes, and market conditions. A quota increase of 20% without a corresponding increase in territory or pipeline effectively reduces your expected commission by 20%. These changes are at the employer's discretion and outside your control, which is a structural vulnerability.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Assess Your Comp Plan", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Know Your Protected Floor"
        sub="Get your income stability score and see how much of your compensation is structurally at risk."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
