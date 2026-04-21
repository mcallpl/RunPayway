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
} from "@/components/learn/LearnComponents";

export default function IncomeContinuityExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="Income Continuity Explained"
        definition="Income continuity measures whether income persists when active work stops — through contracts, recurring arrangements, or passive streams."
        subtitle="The distinction between income that requires your presence and income that does not."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Continuity measures whether income survives the absence of active effort.",
          "Recurring arrangements and contractual obligations are the primary continuity mechanisms.",
          "Most high earners have near-zero income continuity despite strong cash flow.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What income continuity measures",
            body: (
              <>
                <P>
                  Income continuity is a structural property that describes what happens to income when the earner stops actively working. It measures the share of total income that would continue to arrive — through contractual obligations, recurring billing arrangements, passive revenue streams, or institutional mechanisms — if active effort paused for 30, 60, or 90 days.
                </P>
                <P>
                  This is a narrower and more specific measurement than income stability, which encompasses diversification, protection, and recurrence broadly. Continuity isolates the question of persistence: does this income require the earner&apos;s continuous presence to exist? If the answer is yes for most or all income sources, the continuity score is low regardless of how much is earned or how many sources contribute.
                </P>
                <P>
                  The practical significance of income continuity becomes apparent during disruption events that affect the earner&apos;s ability to work — illness, family obligations, market pauses, or transitional periods between engagements. Income with high continuity provides a structural floor during these events. Income with low continuity drops to zero the moment active work stops.
                </P>
              </>
            ),
          },
          {
            heading: "The mechanisms of continuity",
            body: (
              <>
                <P>
                  Income continuity is produced by specific structural mechanisms. Contractual obligations require clients or counterparties to continue payments for a defined period regardless of service delivery — retainer agreements, minimum-term contracts, and employment agreements with paid leave provisions all create contractual continuity. Recurring billing arrangements — monthly subscriptions, management fees, licensing royalties — generate income through standing agreements that do not require new work to trigger each payment cycle.
                </P>
                <P>
                  Passive revenue streams — rental income, dividend income, royalty payments, licensing fees — produce income without active effort by definition. Institutional mechanisms — employer-provided paid leave, disability insurance, partnership distributions — provide continuity through organizational structures rather than individual arrangements. Each mechanism contributes differently to the continuity profile, but all share the common property of producing income in the absence of active work.
                </P>
                <P>
                  The total share of income supported by these mechanisms determines the continuity score. A profile where 70% of income is covered by retainer agreements and recurring billing has high continuity. A profile where 100% of income depends on hourly billing or per-project delivery has zero continuity. Most profiles fall somewhere between these extremes.
                </P>
              </>
            ),
          },
          {
            heading: "Why continuity is undervalued",
            body: (
              <>
                <P>
                  Income continuity receives less attention than income level because it has no immediate visible consequence. An earner with zero continuity who works consistently experiences the same cash flow as an earner with high continuity who works consistently. The difference is invisible during normal operations. It becomes visible — and often devastating — only when the ability to actively work is interrupted.
                </P>
                <P>
                  This creates a systematic undervaluation of continuity in career and business decisions. Professionals choose higher-paying project work over lower-paying retainer arrangements. Consultants optimize for hourly rate rather than recurring engagement structure. Business owners focus on revenue growth rather than recurring revenue as a share of total income. In each case, the decision maximizes short-term income while eroding long-term continuity.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={40} recurring={40} atRisk={20} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Fitness trainer: per-session billing vs monthly memberships"
        setup="Two personal trainers, each earning $95,000 annually. Trainer A bills per session — $120 per hour, approximately 15 sessions per week. If sessions are not completed, no income is generated. Trainer B earns through monthly training packages — clients pay $800/month for 8 sessions, billed automatically. Trainer B has 10 monthly clients and supplements with occasional per-session bookings."
        risk="Trainer A has zero income continuity. A week of illness, a holiday period, or a scheduling gap produces zero income for that period. Trainer B has approximately 85% continuity through monthly billing — clients are charged whether sessions are used or not in a given week. A two-week absence costs Trainer A $3,600 in lost income. Trainer B continues earning during the same period with no revenue impact."
        outcome="RunPayway estimates Trainer A at 22-30 and Trainer B at 58-66 in stability score. Same profession, nearly identical annual income, fundamentally different structural profiles. The difference is entirely attributable to income continuity — the share of earnings that persists without continuous active delivery."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Active Income"
        right="Continuous Income"
        explanation="Active income is generated by direct effort — each payment requires corresponding work. Continuous income is generated by structural arrangements that produce payments independent of immediate effort. The distinction is not between working and not working, but between income that requires presence and income that persists through structural mechanisms."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Income continuity is the difference between taking a month off and losing a month of income." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
          { href: "/learn/income-structure-explained", label: "Income Structure Explained" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/income-stability-vs-net-worth", label: "Income Stability vs Net Worth" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is income continuity the same as passive income?",
            a: "Passive income is one mechanism that creates continuity, but it is not the only one. Retainer agreements, recurring billing, contractual minimums, and employer-provided paid leave all create continuity without being passive income in the traditional sense. Continuity is the broader structural property; passive income is one of several mechanisms that produce it.",
          },
          {
            q: "How much of my income should be continuous?",
            a: "There is no universal threshold, but profiles with less than 30% continuity are structurally vulnerable to any interruption in active work. Profiles above 50% have meaningful structural protection. The appropriate target depends on the earner's profession, risk tolerance, and financial obligations.",
          },
          {
            q: "Can I improve continuity without changing careers?",
            a: "Yes. Within most professions, structural changes can increase continuity. Converting per-project billing to monthly retainers, adding recurring service offerings, or negotiating minimum-term contracts all increase continuity within the same professional context. The change is to the billing and contractual structure, not the work itself.",
          },
          {
            q: "Does income continuity affect mortgage qualification?",
            a: "Not currently in most lending frameworks. Mortgage qualification evaluates income history and amount, not structural continuity. However, continuity directly affects the borrower's ability to sustain payments during work interruptions — a risk factor that historical income figures do not capture.",
          },
          {
            q: "Is salaried income continuous by default?",
            a: "Salaried income has built-in continuity through employer obligations — paid leave, notice periods, and in some cases severance. However, the degree of continuity varies by contract terms. An at-will employee with no paid leave has less structural continuity than one with a 2-year contract and 6 months of accrued leave.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Get My Stability Class", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure What Keeps Coming When You Stop"
        sub="Get your income stability score — continuity analysis, structural mapping, and an improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
