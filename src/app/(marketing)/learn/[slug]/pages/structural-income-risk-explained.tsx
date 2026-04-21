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
  MetaFooter,
} from "@/components/learn/LearnComponents";

export default function StructuralIncomeRiskExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Risk Framework"
        title="Structural Income Risk Explained"
        definition="Structural income risk is risk that exists because of how income is built — not because of market conditions, personal performance, or economic cycles."
        subtitle="Market risk is external. Structural risk is architectural. Both are real. Only one is within the earner's control."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Structural risk persists regardless of market conditions or personal performance",
          "Two earners in identical markets can carry fundamentally different structural risk",
          "Structural risk is the only category of income risk that the earner can directly modify",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Distinguishing Structural Risk from Market Risk",
            body: (
              <>
                <P>
                  Market risk is the probability that external conditions — economic cycles, industry shifts, regulatory changes, competitive dynamics — will reduce demand for the earner&apos;s services or products. It is external, systemic, and largely outside the individual earner&apos;s control. A recession that reduces corporate consulting budgets by 20% is market risk. Every consultant in the affected market faces the same headwind.
                </P>
                <P>
                  Structural risk is different. It is the probability that the earner&apos;s income will fail because of how that income is organized — regardless of what the market does. Two consultants facing the same 20% market contraction will experience materially different outcomes if one has diversified clients with annual contracts and the other has concentrated revenue on a month-to-month basis. The market risk is identical. The structural risk is not.
                </P>
                <P>
                  This distinction is critical because it identifies the category of risk that the earner can actually address. Market conditions cannot be controlled. Structural architecture can be. Concentration can be reduced. Forward commitments can be extended. Labor dependence can be decreased. Revenue can be diversified. Each structural improvement reduces risk independent of what the market does.
                </P>
              </>
            ),
          },
          {
            heading: "The Six Sources of Structural Risk",
            body: (
              <>
                <P>
                  Structural risk originates from six measurable dimensions: concentration, diversification, forward visibility, labor dependence, variability, and persistence. Each dimension contributes independently to the overall structural risk profile. An earner can have low risk in four dimensions and critical risk in two — the composite profile reveals which structural elements are sound and which represent points of vulnerability.
                </P>
                <P>
                  Concentration risk arises when income depends disproportionately on a single source. Diversification risk is its inverse — insufficient breadth across independent income streams. Visibility risk exists when future income cannot be identified with confidence. Labor dependence risk scales with the percentage of income that requires the earner&apos;s direct participation. Variability risk measures the degree of period-to-period fluctuation. Persistence risk evaluates whether income sources have demonstrated continuity over time.
                </P>
                <P>
                  No single dimension is dispositive. The structural risk profile is a composite measurement that reflects the interaction of all six dimensions. Strength in one dimension can partially offset weakness in another, but it cannot eliminate it. A concentrated income structure with excellent forward visibility is more resilient than one without it — but the concentration risk remains present and measurable.
                </P>
              </>
            ),
          },
          {
            heading: "Why Structural Risk Is Systematically Unmeasured",
            body: (
              <>
                <P>
                  Traditional financial assessment focuses on income amount, credit history, and asset values. None of these instruments evaluate the structural architecture of income. A loan application captures how much the applicant earned. It does not capture whether that income is concentrated in one client, dependent on personal labor, or lacking forward contractual commitment. The structural dimension is absent from standard financial evaluation.
                </P>
                <P>
                  This creates a systematic blind spot. Two applicants with identical income, credit scores, and asset profiles may carry fundamentally different structural risk — one with resilient, diversified, committed income and the other with fragile, concentrated, uncommitted income. Standard assessment treats them identically because it lacks the instruments to distinguish between them.
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
        title="Two financial advisors in the same market — different structures"
        setup="Advisor A manages $12M in assets under management (AUM), generating $120,000 annually from a 1% management fee charged quarterly across 45 client accounts. Advisor B earns $120,000 annually from commission-based product sales, averaging 8-10 transactions per month with no residual income from completed sales."
        risk="Advisor A&apos;s income is recurring (quarterly AUM fees), diversified (45 accounts), and has forward visibility (existing AUM generates predictable fees). Advisor B&apos;s income is non-recurring (each commission requires a new sale), concentrated in personal production (100% labor-dependent), and has zero forward visibility (next month&apos;s income depends on transactions that haven&apos;t occurred). Both operate in the same market with the same regulatory environment."
        outcome="RunPayway estimates Advisor A at 58-65 and Advisor B at 24-30. The market risk is identical. The structural risk diverges across every dimension. Advisor A&apos;s AUM model creates structural resilience that Advisor B&apos;s commission model does not — regardless of which advisor earns more in any given year."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Market Risk"
        right="Structural Risk"
        explanation="Market risk is what happens to you — economic shifts, competitive pressure, regulatory change. Structural risk is what you built — how your income is organized, committed, and distributed. Market risk is external and shared. Structural risk is internal and individual. You cannot control the market. You can control the structure."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="When income fails, the instinct is to blame the market. But two people in the same market rarely experience the same failure. The difference is structure." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/predictable-vs-unpredictable-income", label: "Predictable vs Unpredictable Income" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Can structural risk exist in a strong economy?",
            a: "Yes. Structural risk is independent of economic conditions. A concentrated, labor-dependent income structure carries the same architectural vulnerability in a bull market as in a recession. The difference is that strong markets mask the risk by providing consistent demand. The weakness exists whether it is currently being tested or not.",
          },
          {
            q: "Is structural risk more important than market risk?",
            a: "They are different categories with different characteristics. Market risk is larger in magnitude but cannot be individually controlled. Structural risk is smaller in scope but can be directly modified by the earner. From an actionability standpoint, structural risk is the higher-priority focus because it represents the component of total risk that the earner can actually change.",
          },
          {
            q: "Can a W-2 employee have structural income risk?",
            a: "Yes. A W-2 employee has 100% income concentration in a single employer, 100% labor dependence, and forward visibility limited to the employment agreement terms. At-will employment with no contract provides minimal structural protection. The W-2 format mitigates some risk through employment law protections and unemployment insurance, but the underlying structural risk profile is measurable.",
          },
          {
            q: "How do I reduce structural risk without changing my career?",
            a: "Structural risk reduction does not require a career change. It requires architectural changes to how existing income is organized. Converting monthly clients to quarterly contracts improves visibility. Adding two to three new clients reduces concentration. Creating a digital product or licensing arrangement reduces labor dependence. Each change modifies the structure without changing the profession.",
          },
          {
            q: "Does RunPayway measure market risk or structural risk?",
            a: "RunPayway measures structural risk exclusively. Market conditions, economic cycles, and industry-specific demand factors are outside the scoring model. The score reflects how the earner&apos;s income is built — not what the market is doing. This is deliberate: structural risk is the actionable component that the earner can modify.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Identify Your Structural Risk"
        sub="Get a diagnostic score that separates structural risk from market noise across six measurable dimensions."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
