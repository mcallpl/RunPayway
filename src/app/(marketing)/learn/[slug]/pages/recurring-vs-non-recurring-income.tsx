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

export default function RecurringVsNonRecurringIncome() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Revenue Model"
        title="Recurring vs Non-Recurring Income"
        definition="Recurring income repeats on a predictable schedule without requiring a new sale. Non-recurring income must be re-earned with each transaction."
        subtitle="The difference between recurring and non-recurring revenue is the difference between building on a foundation and rebuilding from zero every month."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Recurring revenue provides forward visibility — you can see income before it arrives",
          "Non-recurring revenue resets to zero at the start of each period",
          "The ratio between them determines how much of next month's income is already committed",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What Makes Revenue Recurring",
            body: (
              <>
                <P>
                  Recurring revenue is income that repeats on a defined schedule — monthly, quarterly, or annually — without requiring a new purchase decision from the buyer. Subscription fees, retainer agreements, management contracts, and licensing arrangements all produce recurring revenue. The defining characteristic is automatic continuation: the income persists unless the counterparty takes an affirmative action to cancel.
                </P>
                <P>
                  This structural property creates forward visibility. An earner with $8,000 per month in recurring revenue enters each month knowing that $8,000 is already committed. The pipeline is not empty. The sales cycle for that income has already been completed in a prior period. New revenue is additive rather than replacement.
                </P>
                <P>
                  Recurring revenue also compounds. Each new recurring client adds to the existing base rather than substituting for a completed project. A business that adds three recurring clients per quarter while retaining 90% of existing clients experiences cumulative growth that project-based businesses cannot replicate without proportionally increasing sales volume.
                </P>
              </>
            ),
          },
          {
            heading: "The Structural Cost of Non-Recurring Revenue",
            body: (
              <>
                <P>
                  Non-recurring revenue must be re-earned with each transaction. A web designer who completes a $12,000 project and delivers the final files starts the next month at zero. There is no residual income from the completed work. The entire revenue base must be rebuilt through new client acquisition, proposal development, and project negotiation.
                </P>
                <P>
                  This creates two compounding structural costs. First, the earner must maintain a continuous sales pipeline alongside delivery obligations — dividing capacity between revenue generation and revenue fulfillment. Second, any gap in the pipeline produces an immediate income gap. There is no buffer of committed future revenue to absorb periods of low new-business activity.
                </P>
                <P>
                  Non-recurring revenue is not inherently inferior. It often commands higher per-transaction margins and provides flexibility to adjust pricing, scope, and client selection. But from a stability perspective, it introduces measurable risk because every dollar of next month&apos;s income depends on transactions that have not yet occurred.
                </P>
              </>
            ),
          },
          {
            heading: "Converting Project Revenue Into Recurring Structures",
            body: (
              <>
                <P>
                  Most project-based businesses contain elements that can be restructured into recurring arrangements. A web designer who delivers a site and moves on could instead offer a monthly maintenance, hosting, and optimization retainer at $500-$1,500 per month. The project becomes a gateway to a recurring relationship rather than a terminal transaction.
                </P>
                <P>
                  The conversion does not require a fundamentally different business. It requires repackaging existing capabilities into ongoing commitments. Consultants can offer quarterly strategy reviews. Photographers can offer annual content retainers. Contractors can offer preventive maintenance agreements. The underlying skill remains the same — the revenue architecture changes.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={25} recurring={35} atRisk={40} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Web designer vs SaaS founder: same income, different structures"
        setup="A freelance web designer earns $140,000 annually from project-based work, averaging 10-12 projects per year at $12,000-$14,000 each. A SaaS founder earns $140,000 annually from 580 subscribers at $20 per month. Both report identical income on their tax returns."
        risk="The designer starts each month at zero committed revenue. A two-month gap between projects eliminates approximately $24,000 in income with no automatic recovery mechanism. The SaaS founder starts each month with $11,600 in committed recurring revenue. A two-month pause in new subscriber acquisition reduces growth but does not eliminate existing income."
        outcome="RunPayway estimates the designer at 28-34 and the SaaS founder at 56-63. The total income is identical. The structural resilience is not. The difference is driven primarily by the recurring revenue dimension and its downstream effect on forward visibility."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="One-Time Revenue"
        right="Recurring Revenue"
        explanation="One-time revenue is a transaction — value exchanged once, relationship complete. Recurring revenue is a commitment — value delivered continuously, relationship ongoing. One-time revenue measures what happened. Recurring revenue measures what will happen."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="If you start every month at zero and must sell your way to solvency, you are not building a business. You are running a perpetual fundraise." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/predictable-vs-unpredictable-income", label: "Predictable vs Unpredictable Income" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is a retainer the same as recurring revenue?",
            a: "A retainer is a form of recurring revenue if it renews automatically or has a defined term. A month-to-month retainer that the client must actively decide to continue each cycle is structurally weaker than an annual retainer with automatic renewal. The commitment length and renewal mechanism determine the stability value.",
          },
          {
            q: "Can project-based income ever score well for stability?",
            a: "Yes, if other structural dimensions compensate. A project-based earner with eight diversified clients, a six-month pipeline of signed contracts, and low concentration can achieve moderate stability scores despite the non-recurring revenue model. No single dimension determines the overall score.",
          },
          {
            q: "What percentage of income should be recurring?",
            a: "There is no universal threshold, but structural resilience improves significantly when recurring revenue exceeds 40% of total income. At this level, the earner has a meaningful base that persists independent of new sales activity. Above 70%, the income structure has strong forward visibility and resistance to short-term pipeline gaps.",
          },
          {
            q: "Does recurring revenue guarantee stability?",
            a: "No. Recurring revenue improves one dimension of stability but does not guarantee overall resilience. A SaaS business with 95% recurring revenue but 80% of that revenue from one enterprise client still has acute concentration risk. Stability is a composite of six dimensions, not a single metric.",
          },
          {
            q: "How does churn affect recurring revenue stability?",
            a: "Churn is the primary threat to recurring revenue structures. A 5% monthly churn rate means the business must replace half its revenue base every year just to maintain current income. Net revenue retention — the percentage of revenue retained from existing customers including expansion — is a more precise measure of recurring revenue health than gross recurring revenue alone.",
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
