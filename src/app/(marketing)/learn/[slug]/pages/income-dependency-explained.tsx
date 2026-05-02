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
  StickyLearnCTA,
} from "@/components/learn/LearnComponents";

export default function IncomeDependencyExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Framework"
        title="Income Dependency Explained"
        definition="Income dependency measures the degree to which income relies on a single source, a single skill, or continuous personal effort."
        subtitle="Dependency is not about how hard you work. It is about what happens when you stop."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Dependency means income stops when the earner stops",
          "Single-source reliance is the most common form of structural fragility",
          "Reducing dependency requires structural changes, not more effort",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Three Forms of Income Dependency",
            body: (
              <>
                <P>
                  Income dependency manifests in three distinct structural forms. Source dependency means a disproportionate share of income originates from a single client, employer, or revenue channel. Skill dependency means income requires a specific capability that cannot be delegated, transferred, or automated. Labor dependency means income requires the earner&apos;s continuous personal effort — time traded directly for compensation with no mechanism for income to persist in the earner&apos;s absence.
                </P>
                <P>
                  These three forms are independent. A consultant may have low source dependency — five clients of equal size — but extreme labor dependency if every dollar requires billable hours. A franchise owner may have low labor dependency — the business operates without them — but high source dependency if 80% of revenue comes from one product line. Each form creates a distinct structural vulnerability.
                </P>
                <P>
                  The compounding effect is where dependency becomes dangerous. An earner with moderate levels of all three forms — some source concentration, some skill limitation, some labor requirement — may have an aggregate dependency profile that is substantially more fragile than any single dimension suggests. Dependency compounds because each form limits the earner&apos;s ability to adapt when the others are disrupted.
                </P>
              </>
            ),
          },
          {
            heading: "Why Dependency Is Invisible Until Disruption",
            body: (
              <>
                <P>
                  Income dependency is structurally silent during normal operations. A photographer whose entire income depends on wedding season earns well during peak months. The checks clear. The calendar is full. By every conventional measure — tax returns, bank statements, client volume — the income appears healthy. The dependency is invisible because it only manifests when conditions change.
                </P>
                <P>
                  This is the fundamental problem with backward-looking income analysis. Historical income data shows what was earned. It does not show what the earning depended on. A year of strong wedding season revenue looks identical to a year of diversified portrait, commercial, and event revenue on a tax return. Both produce the same number. Only one survives a wedding industry downturn.
                </P>
                <P>
                  Dependency becomes visible only at the moment of disruption — when the single client leaves, when the seasonal demand shifts, when the earner cannot work. By then, the structural damage is already occurring. The purpose of measuring dependency is to identify it before it materializes as income loss.
                </P>
              </>
            ),
          },
          {
            heading: "Measuring Dependency Structurally",
            body: (
              <>
                <P>
                  Measuring income dependency requires examining the structural architecture of income generation, not its output. The relevant questions are not about amounts or growth rates. They are about concentration ratios, substitutability, and continuity mechanisms. What percentage of income comes from the single largest source? Can the earner&apos;s primary skill be performed by someone else? Does any income continue if the earner takes a 90-day absence?
                </P>
                <P>
                  Each question targets a specific dependency dimension. High concentration ratios indicate source dependency. Low substitutability indicates skill dependency. Zero continuity during absence indicates labor dependency. The composite of these measurements produces a dependency profile that reveals where structural risk is concentrated.
                </P>
                <P>
                  The measurement is not judgmental. High dependency is not a character flaw — it is a structural condition. Many of the most skilled and highest-earning professionals have extreme dependency profiles precisely because their expertise is rare and their time is valuable. The measurement exists to make the condition visible so it can be addressed through structural changes rather than discovered through income loss.
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
        title="Photographer dependent on wedding season"
        setup="A wedding photographer earns $120,000 annually. Approximately 85% of revenue concentrates between May and October, with 60% coming from June through September alone. Off-season income consists of occasional portrait sessions and print sales that generate less than $18,000 combined. The photographer has no retainer clients, no licensing revenue, and no studio rental income."
        risk="A combination of economic slowdown and shifting consumer preferences reduces wedding bookings by 40% in a single season. The photographer&apos;s skill — capturing weddings — cannot be redirected to commercial or editorial work without significant portfolio development and new client acquisition that requires 6 to 12 months of investment."
        outcome="Estimated stability score: 22-28. The dependency is threefold: source dependency on wedding clients, seasonal dependency on a six-month window, and skill dependency on a single genre. When wedding demand contracts, all three dependencies activate simultaneously, and the income structure has no alternative channel to absorb the loss."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Independence"
        right="Dependency"
        explanation="Independence means income persists across source changes, seasonal shifts, and periods of reduced personal effort. Dependency means income requires specific conditions to continue — a particular client, a particular season, or continuous personal labor. The distinction is not about how much is earned but about how many conditions must hold for earning to continue."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="If your income requires your presence every day, your best client staying forever, and your industry never changing — that is not income. That is a set of conditions." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-stress-testing-explained", label: "Income Stress Testing Explained" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is all self-employment income dependent?",
            a: "Not inherently. Self-employed earners with diversified client bases, recurring contracts, and income streams that persist during absence can have low dependency profiles. The key variable is structure, not employment classification. A freelancer with eight retainer clients and a licensing portfolio may have lower dependency than a salaried employee in an at-will position.",
          },
          {
            q: "How is dependency different from concentration?",
            a: "Concentration is one form of dependency — specifically, source dependency. But dependency also includes skill dependency and labor dependency. An earner can have low concentration (many clients) but high labor dependency (every dollar requires billable hours). Dependency is the broader structural concept; concentration is one component.",
          },
          {
            q: "Can high-income earners have high dependency?",
            a: "Frequently. Surgeons, trial attorneys, and elite consultants often earn substantial incomes that are entirely dependent on their personal effort, a narrow skill set, and a limited number of referral sources. High income and high dependency are not contradictory — they are often correlated.",
          },
          {
            q: "What reduces income dependency?",
            a: "Three structural changes: diversifying income sources to reduce concentration, developing income streams that do not require personal labor (licensing, recurring fees, managed assets), and building contractual protections that guarantee minimum income periods. Each addresses a different dependency dimension.",
          },
          {
            q: "Does having employees reduce my dependency?",
            a: "Only if the business generates revenue without your direct involvement in delivery. If clients hire the firm because of you specifically, and revenue depends on your personal participation, employees reduce workload but not structural dependency. The test is whether revenue continues at a similar level during a 90-day absence.",
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
