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

export default function SalesHighPerformerRisk() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Sales — High Performer Risk"
        definition="Top sales performers often have the most structurally fragile income. The higher the commission percentage, the more income depends on continuous closing."
        subtitle="President's Club recognition measures past production. The stability model measures what happens when conditions change."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "High commission percentages create income that resets every quota period",
          "Top performers are most exposed to comp plan changes because their variable component is largest",
          "Trailing commissions and residual revenue are the structural mechanisms that protect sales income",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The structural paradox of top performance",
            body: (
              <>
                <P>
                  A sales professional earning $280,000 annually with 75% of income from commission ($210,000) and 25% from base salary ($70,000) has reached a level of production that most peers aspire to. They have won President&apos;s Club recognition. Their pipeline management is disciplined. Their closing ratio is consistently above team average. By every conventional measure, this is a high-performing, successful salesperson.
                </P>
                <P>
                  The structural paradox is that the same characteristics that drive high earnings — a large variable compensation component, high production volume, and aggressive quota attainment — also create maximum structural fragility. The $210,000 in commission income resets to zero at the beginning of every quota period. It must be re-earned through continuous prospecting, pipeline development, and closing activity. There is no structural persistence in the commission — past performance generates past income but creates no contractual claim on future income.
                </P>
                <P>
                  The 75/25 commission-to-base ratio means that 75% of this professional&apos;s income depends on factors that include not only their own performance but also market conditions, product availability, company strategy, territory assignments, and compensation plan design — variables that are partially or entirely outside their control. The base salary of $70,000 is the only structurally committed component, and it represents barely one-quarter of total compensation.
                </P>
              </>
            ),
          },
          {
            heading: "The comp plan change scenario",
            body: (
              <>
                <P>
                  Compensation plan changes are among the most common and most impactful disruptions in sales income. Companies modify commission structures for strategic reasons — to redirect sales effort toward different products, to reduce overall compensation costs, to align incentives with new go-to-market strategies, or to respond to market changes. These modifications are typically announced with 30-60 days of notice and take effect at the beginning of the next fiscal period.
                </P>
                <P>
                  For a top performer, a comp plan change can restructure the economics of their income overnight. A reduction in commission rates from 12% to 9% on the same product mix reduces the $210,000 commission component to approximately $157,500 — a $52,500 annual reduction. A territory reassignment that moves the salesperson from an established market to a developing one can reduce production volume by 30-40% during the transition year. A shift from individual to team-based quotas can dilute the top performer&apos;s earnings by averaging their production across lower-performing teammates.
                </P>
                <P>
                  None of these scenarios involve the salesperson performing worse. They involve the company changing the rules under which performance is compensated. The salesperson has no structural protection against these changes — the employment relationship gives the company broad discretion to modify compensation plans, reassign territories, and restructure quota systems. The top performer&apos;s leverage is their threat to leave, but the same comp plan changes that reduce their income often coincide with market conditions that limit their external options.
                </P>
              </>
            ),
          },
          {
            heading: "Why trailing revenue changes the structural equation",
            body: (
              <>
                <P>
                  Sales professionals who earn trailing commissions — ongoing revenue from accounts they have closed and continue to service — have a fundamentally different structural profile than those whose commission resets every period. Trailing commissions create a form of recurring revenue within the compensation structure. Each closed deal generates not just a one-time commission but an ongoing income stream that persists as long as the customer remains active.
                </P>
                <P>
                  A salesperson with $100,000 in trailing commissions from a mature book of accounts has a structural floor that is independent of current-period production. If their new-business commission declines by 30% due to a comp plan change or territory adjustment, the trailing income provides a buffer. The total income reduction is smaller, and the salesperson has ongoing revenue to sustain them while adapting to the new conditions.
                </P>
                <P>
                  The model scores trailing commissions as a form of income persistence — similar to retainer agreements for consultants or renewal commissions for insurance agents. The structural mechanism is different (customer retention rather than contract terms), but the economic effect is the same: income that continues without requiring new sales activity. Sales professionals who negotiate for trailing commission structures or who work in industries where trailing revenue is standard (SaaS, financial services, recurring subscription products) have measurably stronger stability profiles than those in transactional, one-time commission models.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A sales professional earning $280,000 annually — $70,000 base salary (25%) and $210,000 in commission (75%). President's Club winner for two consecutive years. Commission is earned on new business closed during the current quota period with no trailing component. Product mix is concentrated in a single product line."
        riskExposure="Income resets every quarter. The $210,000 commission component must be re-earned through continuous closing activity. No trailing revenue, no residual income, no structural persistence. The salesperson is also exposed to unilateral comp plan changes, territory reassignment, and product mix shifts — all of which are within the company's discretion."
        disruption="The company restructures its compensation plan. Commission rates are reduced from 12% to 9% on the primary product line. The salesperson's territory is adjusted to include a developing market that requires longer sales cycles. Effective impact: commission income drops from $210,000 to approximately $145,000 in the first year. Total income: $215,000 — a $65,000 reduction (23%) from changes the salesperson did not initiate and cannot reverse."
        scoreRange="20-35. The score reflects the high proportion of non-recurring commission income, the absence of trailing revenue, single-product concentration, and vulnerability to unilateral comp plan modifications. The range is among the lowest for high-income earners."
        howToFix="Negotiate trailing commissions on closed accounts — even a modest trail (2-3% of recurring revenue) builds a structural floor over time. Diversify the product mix to reduce dependency on a single line's commission structure. Build relationships that generate referrals and repeat business, creating de facto persistence. If the current company does not offer trailing structures, evaluate opportunities in industries where trailing revenue is standard."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={15} atRisk={75} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Company restructures the compensation plan"
        setup="A sales professional earning $280,000 — $70,000 base and $210,000 commission. The commission is based on new business closed during each quota period at a 12% rate on a single primary product line. No trailing commissions. No residual income. Two consecutive President's Club awards."
        risk="The company announces a compensation restructuring effective next quarter. Commission rates on the primary product are reduced from 12% to 9%. The salesperson's territory is adjusted to include a less mature market segment. The changes are presented as 'strategic realignment' — they are within the company's contractual right to implement."
        outcome="Commission income drops from $210,000 to approximately $145,000 in the first year under the new plan. Total income falls to $215,000 — a $65,000 annual reduction. The salesperson is performing at the same level with the same effort. The income changed because the compensation structure changed, and the salesperson had no structural protection against the change."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Top Producer"
        right="Stable Earner"
        explanation="A top producer generates maximum revenue during favorable conditions — high commission rates, strong territory, aligned comp plan. A stable earner has structural protections — trailing commissions, diversified product mix, contractual minimums — that maintain income across changing conditions. Top producers often have the highest incomes and the lowest stability scores. Stable earners may earn less in peak periods but maintain more consistent income over multi-year horizons."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The salesperson who earns the most this year is not necessarily the one with the most durable income — because commission income that resets every quarter has zero structural persistence." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-sales-professionals", label: "Income Stability for Sales Professionals" },
          { href: "/learn/sales-rep-base-plus-commission", label: "Scenario: Sales Rep — Base Plus Commission" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Do all sales roles have low stability scores?",
            a: "No. Sales roles with trailing commissions, residual revenue, or high base-to-variable ratios can score in the 40-55 range. SaaS account executives with recurring revenue trails, financial advisors with assets-under-management fees, and insurance agents with renewal books all earn income that has structural persistence. The model scores the income structure, not the job title. A salesperson with 50% trailing revenue is structurally different from one with zero trailing revenue.",
          },
          {
            q: "How much does base salary improve the score?",
            a: "Base salary is the only contractually guaranteed component of sales compensation. A higher base-to-variable ratio improves the score because it increases the proportion of income that persists independent of current-period production. Moving from a 25/75 base/commission split to a 40/60 split meaningfully improves the structural profile — but the base must be genuinely guaranteed and not subject to clawback or conditional performance requirements.",
          },
          {
            q: "Can I negotiate for trailing commissions?",
            a: "In many organizations, yes — particularly when moving to a new role or during compensation negotiations. Trailing commissions are more common in industries with recurring revenue models (SaaS, financial services, telecommunications). Even in industries where they are not standard, top performers can sometimes negotiate trail structures as part of retention packages. The structural impact of even a modest trailing commission is significant because it creates income persistence where none existed before.",
          },
          {
            q: "What about equity compensation?",
            a: "Equity (RSUs, stock options) adds a form of deferred compensation that the model recognizes. However, equity is typically illiquid, subject to vesting schedules, and dependent on company performance. The model evaluates equity differently than cash compensation because it cannot be deployed to cover expenses during a disruption unless it is vested and liquid. Vested, liquid equity improves the overall financial position but does not directly improve the income stability score unless it generates ongoing income (dividends, distributions).",
          },
          {
            q: "Is it better to have a lower income with more stability?",
            a: "The model does not make recommendations — it measures structural characteristics. A salesperson earning $180,000 with 40% trailing revenue may have a higher stability score than one earning $280,000 with zero trailing revenue. Whether the higher income or the higher stability is more valuable depends on the individual's financial obligations, risk tolerance, and career strategy. The model provides the structural measurement. The interpretation is the individual's to make.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Sales Income Structure"
        sub="Get your income stability score and understand exactly how your commission structure, trailing revenue, and comp plan exposure affect your position."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
