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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function StopWorking30Days() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Stop Working 30 Days"
        definition="The 30-day test is the clearest measure of labor dependence: if you stop all active work for 30 days, how much of your income continues? The answer reveals your structural floor."
        subtitle="This is the simplest diagnostic the model offers — and for most earners, the most revealing."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Most earners would retain less than 10% of their income if they stopped working for 30 days",
          "Income that continues without labor input is structurally different from income that requires daily effort to exist",
          "The 30-day test separates income you earn from income you have built — and the distinction determines your structural floor",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The 30-day test as a structural diagnostic",
            body: (
              <>
                <P>
                  The 30-day test is not a lifestyle exercise or a financial planning trick. It is a structural diagnostic that reveals the labor dependency of an income profile. The question is simple: if you stop all active work — all client delivery, all employee duties, all project execution, all content creation — for 30 consecutive days, what percentage of your income continues? The answer is your structural floor, and for most earners, it is uncomfortably close to zero.
                </P>
                <P>
                  A W-2 employee who stops working loses 100% of income (after PTO is exhausted, if applicable). A freelancer who stops delivering loses all project and hourly income. A consultant who stops consulting loses all active engagement revenue. The income that continues — rental payments, dividend distributions, contractual retainer payments that do not require deliverables, royalty checks, subscription revenue from products already built — is the income that exists independent of the earner&apos;s daily labor. This is the structural floor.
                </P>
                <P>
                  The model uses the 30-day test conceptually to separate labor-dependent income from labor-independent income. This separation is one of the most important structural distinctions in the model because it determines what happens during the disruptions that matter most: illness, injury, family emergency, burnout, or any circumstance that removes the earner&apos;s ability to work. In these scenarios, only the structural floor — the income that continues without labor — provides financial continuity.
                </P>
              </>
            ),
          },
          {
            heading: "Why high earners often have the lowest floors",
            body: (
              <>
                <P>
                  High-earning professionals frequently have structural floors near zero because their income is generated entirely through active labor. A consultant earning $300,000 from client engagements has a structural floor of zero if all income requires active delivery. A surgeon earning $500,000 has a structural floor of zero if all income comes from procedures performed. A sales executive earning $250,000 with a 60% commission structure has a structural floor of $100,000 (base salary) — but only if they remain employed, which itself depends on performance metrics tied to active selling.
                </P>
                <P>
                  The paradox is that higher earnings often require more intensive labor, not less. The consultant commanding $400/hour is typically the one doing the most specialized, hands-on work. The executive earning the largest bonus is typically the one putting in the most hours. The correlation between high income and high labor dependency creates a structural vulnerability that is invisible during normal operations but becomes immediately apparent during any event that interrupts the earner&apos;s ability to work.
                </P>
                <P>
                  The model does not penalize high earnings. It identifies the structural dependency that typically accompanies them. A $300,000 earner with a $50,000 structural floor (rental income, dividends, or contractual payments that continue without work) scores meaningfully better than a $300,000 earner with a zero structural floor — even though the second earner appears equally positioned by any conventional financial measure. The 30-day test reveals the difference that income level alone cannot show.
                </P>
              </>
            ),
          },
          {
            heading: "Building a structural floor",
            body: (
              <>
                <P>
                  Building a structural floor requires converting some portion of income from labor-dependent to labor-independent. The mechanisms are well-understood: rental property generates income from tenants regardless of the owner&apos;s work status. Dividend portfolios generate income from corporate distributions regardless of the investor&apos;s activity. Subscription products generate income from existing customers regardless of whether new content is being created. Retainer agreements with maintenance rather than delivery terms continue to generate income during periods of reduced activity.
                </P>
                <P>
                  The challenge for most earners is not understanding these mechanisms but executing the transition while maintaining current income. A freelancer earning $150,000 from active client work cannot simply stop working to build passive income. The structural floor must be built incrementally — typically by allocating 15-25% of current earnings toward income-producing assets or products that will generate returns independent of labor. This process takes 2-5 years for most earners to produce a meaningful structural floor.
                </P>
                <P>
                  The model rewards every increment of structural floor construction. An earner who moves from 0% continuing income to 10% continuing income has made a significant structural improvement — that 10% represents the difference between zero income and some income during a disruption. Moving from 10% to 25% adds another meaningful layer of protection. The goal is not to eliminate labor-dependent income but to ensure that a sufficient percentage of total income continues when labor stops — providing financial continuity during the disruptions that are not a matter of if but when.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Any earner — the 30-day test applies universally. The scenario examines what happens when all active work effort stops for 30 consecutive days. The relevant question is not why the work stopped but what happens to income when it does. Reasons include illness, family emergency, burnout, injury, or any circumstance that prevents active labor."
        riskExposure="Labor-dependent income goes to zero immediately or within the current billing cycle. Only contractual payments that do not require deliverables, rental income, dividend distributions, royalty payments, and subscription revenue from existing products continue. The percentage of income that continues is the structural floor — the measure of how much income was built versus how much income is earned through ongoing effort."
        disruption="The earner cannot work for 30 days. For a high labor dependence profile (90%+ active income): monthly income drops 80-95%. For a moderate labor dependence profile (50-70% active income): monthly income drops 40-60%. For a low labor dependence profile (30% or less active income): monthly income drops 15-30%. The disruption is identical — the structural outcome varies entirely based on pre-existing income architecture."
        scoreRange="High labor dependence: score drops 15-25 points during the 30-day period, reflecting the income loss and structural exposure. Low labor dependence: score drops 3-8 points, reflecting the minimal income disruption. The score drop itself is a measure of structural resilience — smaller drops indicate better-built income architecture."
        howToFix="Increase the percentage of income that continues without active labor. Add retainer agreements with maintenance (not delivery) terms. Build or acquire income-producing assets: rental property, dividend portfolio, digital products with existing customer base. Target a structural floor of at least 25% of total income within 24 months — enough to cover essential expenses during a 30-day work stoppage."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={25} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Unexpected 30-day work stoppage"
        setup="Three earners, each at $180,000 annually. Earner A: 95% active labor income (consultant, all project-based). Earner B: 60% active, 40% continuing (W-2 with rental income). Earner C: 30% active, 70% continuing (retainers, rental portfolio, dividend income). Each stops all active work for 30 days."
        risk="A medical event requires 30 days of recovery with no work capacity. No advance planning was possible. Each earner's active income stops immediately. Only income that does not require the earner's labor continues."
        outcome="Earner A: Monthly income drops from $15,000 to approximately $750 (5%). Essential expenses of $8,000 create a $7,250 monthly deficit. Earner B: Monthly income drops from $15,000 to $6,000 (40%). Deficit of $2,000 — manageable with modest savings. Earner C: Monthly income drops from $15,000 to $10,500 (70%). No deficit — continuing income exceeds essential expenses. Same event, same income level, radically different structural outcomes."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Working Income"
        right="Continuing Income"
        explanation="Working income is generated through active labor — it exists because the earner is working and stops when they stop. Continuing income persists regardless of the earner's work activity — it is generated by assets, contracts, or structures that operate independently of daily effort. The model measures the ratio of continuing income to total income as one of the most important structural characteristics because it determines the financial outcome of any event that interrupts the earner's ability to work."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Your real income is not what you earn when everything is working. It is what continues when you stop. Everything above that number is compensation for your labor. Everything at or below it is income you have built." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/income-dependency-explained", label: "Income Dependency Explained" },
          { href: "/learn/income-stress-testing-explained", label: "Income Stress Testing Explained" },
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does PTO or sick leave count as continuing income?",
            a: "For the purposes of the 30-day test, PTO and sick leave are transitional benefits — they provide temporary income continuity but are limited in duration and exist only while the employment relationship continues. The model treats PTO as a buffer, not a structural floor. A W-2 employee with 20 days of PTO has approximately 4 weeks of coverage, but this does not address the structural question of what happens after the PTO is exhausted or if the employment itself is disrupted.",
          },
          {
            q: "How much of my income should continue without work?",
            a: "The model does not prescribe a specific target, but profiles that score above 55 typically have 25-40% of income continuing without active labor. As a practical guideline, a structural floor that covers essential monthly expenses — housing, insurance, food, transportation, debt service — provides meaningful resilience against work stoppages of 30-90 days. For most earners, this represents 30-50% of gross income, depending on their expense structure.",
          },
          {
            q: "Is disability insurance equivalent to a structural floor?",
            a: "Disability insurance provides financial protection during work stoppages caused by medical events, but it is not equivalent to a structural floor. Disability policies typically have waiting periods (30-90 days), cover only 60-70% of pre-disability income, have duration limits, and require medical qualification. The model treats disability insurance as a risk mitigation tool, not as continuing income, because it is conditional, temporary, and limited in scope. A genuine structural floor — rental income, dividends, contractual payments — has none of these limitations.",
          },
          {
            q: "Can the 30-day test be applied to a business owner?",
            a: "Yes, and it is particularly revealing for business owners who believe their business generates income independently. The test asks: if you, the owner, do nothing for 30 days — no decisions, no client meetings, no oversight, no problem-solving — does the business continue to generate income? For many small business owners, the answer is no, because the business depends on the owner's daily involvement. A business that passes the 30-day test has systems, employees, or automation that generate revenue independently of the owner — a structural characteristic that the model scores as highly favorable.",
          },
          {
            q: "What is the fastest way to build a structural floor?",
            a: "The fastest mechanism is converting existing client relationships from project-based to retainer-based with maintenance terms rather than delivery requirements. A retainer that requires the professional to be available but does not require daily deliverables continues to generate income during short-term work stoppages. For non-service professionals, the fastest path is typically dividend-paying investment accounts funded from current earnings. The structural floor does not need to be large to be meaningful — even 10% continuing income is structurally superior to zero.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Structural Floor"
        sub="Get your income stability score and understand how much of your income continues when your labor stops — the clearest measure of how your income is built."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
