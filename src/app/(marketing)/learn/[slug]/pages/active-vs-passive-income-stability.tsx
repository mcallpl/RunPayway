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

export default function ActiveVsPassiveIncomeStability() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Income Type"
        title="Active vs Passive Income Stability"
        definition="Active income requires continuous personal effort to generate. Passive income continues whether you work or not. The ratio between them defines labor dependence."
        subtitle="The stability difference between active and passive income is not philosophical. It is structural and measurable."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Active income stops when the earner stops — creating a single point of failure",
          "Passive income decouples earnings from hours, reducing labor dependence",
          "Most earners overestimate their passive income ratio by 2-3x",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Defining the Active-Passive Spectrum",
            body: (
              <>
                <P>
                  The distinction between active and passive income is not binary. It exists on a spectrum defined by the degree to which earnings require the earner&apos;s direct, ongoing participation. Fully active income — hourly consulting, per-session therapy, commission sales — ceases entirely when the earner is unavailable. Fully passive income — rental yields, royalty streams, dividend portfolios — continues regardless of the earner&apos;s involvement.
                </P>
                <P>
                  Most real-world income falls between these extremes. A course creator who earns revenue from automated sales but must periodically update content and manage a marketing funnel is neither fully active nor fully passive. The structural question is not whether income is labeled active or passive, but what percentage of total earnings would continue for 90 days if the earner stopped working entirely.
                </P>
                <P>
                  This 90-day continuation test is the operational definition of labor dependence. Income that survives the test has structural resilience. Income that does not is structurally tied to the earner&apos;s capacity — and capacity is finite, depletable, and subject to disruption from illness, burnout, or external constraints.
                </P>
              </>
            ),
          },
          {
            heading: "Why Labor Dependence Is a Stability Risk",
            body: (
              <>
                <P>
                  Labor-dependent income introduces a specific category of structural risk: the earner is a single point of failure in their own income system. If a consultant bills $400 per hour but can only work when healthy, available, and motivated, the income structure is as fragile as the consultant&apos;s personal capacity. No amount of hourly rate optimization changes this fundamental constraint.
                </P>
                <P>
                  The risk compounds under pressure. During periods of personal disruption — health events, family obligations, market-driven demand reduction — the earner&apos;s capacity to generate income declines at the exact moment financial demands may increase. Active income provides no buffer because it requires real-time effort to produce. There is no inventory. There is no backlog that generates revenue while the earner recovers.
                </P>
                <P>
                  This is why income stability scoring treats labor dependence as an independent dimension. An earner with high income, strong diversification, and excellent forward visibility still carries measurable structural risk if 95% of that income requires their daily participation to continue.
                </P>
              </>
            ),
          },
          {
            heading: "Building Passive Components Into Active Structures",
            body: (
              <>
                <P>
                  Shifting from active to passive income does not require abandoning active work. It requires building systems that convert active expertise into scalable, persistent revenue. A financial advisor who also licenses a proprietary assessment tool has created a passive component alongside an active practice. The tool generates revenue independent of the advisor&apos;s hourly availability.
                </P>
                <P>
                  The most effective transitions identify what the earner already produces — methodologies, frameworks, educational content, proprietary processes — and package those outputs into formats that do not require per-unit labor. Digital products, licensing arrangements, subscription models, and managed portfolios all represent mechanisms for converting active knowledge into passive revenue architecture.
                </P>
                <P>
                  The goal is not to eliminate active income. It is to reduce the labor dependence ratio to a level where short-term disruptions do not produce income collapse. A 60/40 active-to-passive split is structurally more resilient than a 95/5 split, even if the total income figure is identical.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={25} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Personal trainer: 100% active vs 60/40 split"
        setup="Trainer A earns $95,000 per year exclusively from one-on-one sessions at $120 per hour. Trainer B earns $95,000 per year — $57,000 from in-person sessions and $38,000 from an online training program with 180 active subscribers at $17.50 per month. Both trainers have the same total income."
        risk="Trainer A has 100% labor dependence. A two-month injury eliminates approximately $16,000 in income with zero continuation. Trainer B&apos;s online program continues generating $3,150 per month during the same injury, covering 40% of baseline income without any active work. The structural exposure to disruption is materially different."
        outcome="RunPayway estimates Trainer A at 24-30 and Trainer B at 44-51. The only structural difference is the labor dependence ratio. Total income, industry, and market conditions are identical. The score differential reflects the measurable difference in resilience."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Trading Time"
        right="Building Systems"
        explanation="Trading time converts hours into dollars at a fixed ratio — more hours produce more income, fewer hours produce less. Building systems converts effort into structures that generate revenue beyond the initial time investment. The first is linear and labor-bound. The second is compounding and capacity-independent."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Income that requires your presence every day is not a business model. It is a job with variable compensation." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/structural-income-risk-explained", label: "Structural Income Risk Explained" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is rental income truly passive?",
            a: "Rental income is passive relative to hourly billing, but it is not zero-effort. Property management, tenant issues, and maintenance require time. However, the income continues during periods when the owner is not actively working, which structurally distinguishes it from labor-dependent income. The degree of passivity depends on the management structure.",
          },
          {
            q: "Can a W-2 salary be considered passive income?",
            a: "No. A W-2 salary is active income with employment protections. It requires ongoing presence and performance. The protections — notice periods, severance norms, unemployment insurance — mitigate some disruption risk, but the income itself is fully labor-dependent. If the employee stops working, the salary stops.",
          },
          {
            q: "What is a healthy active-to-passive income ratio?",
            a: "There is no universal target, but structural resilience improves meaningfully when passive income exceeds 25-30% of total earnings. At this level, short-term disruptions to active capacity do not produce immediate financial crisis. Above 50%, the earner has significant insulation from labor-dependent risk.",
          },
          {
            q: "Does passive income always mean lower total income?",
            a: "No. Passive income structures often have lower per-unit revenue initially but scale without proportional labor increases. Over time, earners with passive components frequently exceed the income ceiling imposed by active-only structures, because active income is bounded by available hours while passive income is not.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="See How Labor-Dependent Your Income Is"
        sub="Get a diagnostic score that quantifies your active-to-passive ratio and five other structural dimensions."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
