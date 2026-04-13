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

export default function IsMyIncomeStable() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Framework"
        title="Is My Income Stable"
        definition="If your income depends on decisions you haven't made yet — clients you haven't closed, deals that haven't landed, work you haven't done — it has structural risk."
        subtitle="Being busy is not the same as being stable. Forward commitment is."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A full pipeline is not committed income — it is a set of possibilities",
          "Structural risk exists in the gap between booked work and future earnings",
          "Most earners confuse current workload with income security",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The Difference Between Busy and Stable",
            body: (
              <>
                <P>
                  A busy calendar signals current demand. It does not signal structural resilience. A freelance developer booked solid for the next three months has confirmed work. But the operative word is &quot;next three months.&quot; Beyond that window, income depends on engagements that have not been signed, clients that have not committed, and projects that have not been scoped. Current workload creates the sensation of security. It does not create the structure.
                </P>
                <P>
                  The distinction is between realized and unrealized income. Realized income is committed — contracts signed, deposits received, work scheduled with binding agreements. Unrealized income is projected — based on pipeline conversations, anticipated renewals, and historical patterns. Financial decisions made on the assumption of unrealized income are structural bets, whether or not the earner recognizes them as such.
                </P>
                <P>
                  This is why the question &quot;Is my income stable?&quot; cannot be answered by looking at the current month. Stability is a forward-looking measurement. It evaluates what is committed, not what is happening. An earner at full capacity with no forward commitments is at maximum utilization and minimum structural security simultaneously.
                </P>
              </>
            ),
          },
          {
            heading: "Identifying Structural Risk in Your Income",
            body: (
              <>
                <P>
                  Structural risk hides in the assumptions that underlie income continuity. If income continues only because a client chooses to re-engage, that is a dependency assumption. If income continues only because the market remains strong, that is a conditions assumption. If income continues only because the earner maintains their current work pace, that is a labor assumption. Each assumption represents a variable that the earner does not control.
                </P>
                <P>
                  The accumulation of uncontrolled variables is what creates fragility. An earner with one uncontrolled variable — say, a single client who could leave — has identifiable, manageable risk. An earner whose entire income depends on continuous client acquisition, favorable market conditions, personal health, and a specific skill remaining in demand has four uncontrolled variables compounding simultaneously. The income appears functional because all four conditions are currently met. The structure is fragile because any one of them can change.
                </P>
                <P>
                  Identifying structural risk is not pessimism. It is the same analytical framework that institutions apply to any asset or revenue stream. A bank does not assume a borrower will keep paying simply because they have been paying. It evaluates the structural conditions — employment stability, debt ratios, collateral — that determine whether payments are likely to continue. Income deserves the same rigor.
                </P>
              </>
            ),
          },
          {
            heading: "What Forward Commitment Actually Looks Like",
            body: (
              <>
                <P>
                  Forward commitment exists on a spectrum. At the strongest end are binding contracts with defined payment schedules — retainer agreements, annual service contracts, lease income with fixed terms. These create income that is legally committed regardless of short-term market fluctuations. The earner knows what they will receive and when, with contractual recourse if the commitment is broken.
                </P>
                <P>
                  In the middle are recurring arrangements without formal contracts — long-standing clients who engage monthly, subscription-based services, established referral flows. These have demonstrated persistence but no legal guarantee. They are more resilient than one-off engagements but less protected than contractual commitments. Their stability depends on relationship continuity rather than legal obligation.
                </P>
                <P>
                  At the weakest end is project-based or transaction-based income with no forward pipeline. Each engagement is independent. Each payment requires a new sale, a new agreement, a new scope of work. The income may be consistent historically, but each dollar requires a new origination event. This is the structural equivalent of building the road as you drive on it — functional as long as construction keeps pace, catastrophic the moment it stops.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={25} atRisk={65} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Freelance developer fully booked but structurally exposed"
        setup="A freelance software developer earns $195,000 annually. Current utilization is 100% — fully booked for the next three months across two client projects. No retainer agreements exist. Both engagements are project-based with defined end dates. The developer has no recurring revenue, no maintenance contracts, and no pipeline beyond the current projects."
        risk="Both projects conclude on schedule. The developer enters month four with zero committed income. Business development — which was paused during the fully-booked period — requires 4 to 8 weeks to produce new signed engagements. The gap between project completion and new project commencement creates a zero-income window that recurs after every engagement cycle."
        outcome="Estimated stability score: 24-30. The developer&apos;s income is high and current utilization is perfect, but the structure has no forward visibility beyond active projects. Every transition between engagements is an income gap. The score reflects what the full calendar obscures: that stability requires commitment beyond the current workload."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Busy Calendar"
        right="Stable Income"
        explanation="A busy calendar describes current utilization — how fully the earner&apos;s time is committed right now. Stable income describes structural commitment — how far into the future income is secured through contracts, recurring arrangements, or diversified sources. The first measures today&apos;s workload. The second measures tomorrow&apos;s certainty."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="If you cannot name the source of your income six months from now, you do not have stable income. You have current income." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/how-stable-is-your-income", label: "How Stable Is Your Income" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/income-continuity-explained", label: "Income Continuity Explained" },
          { href: "/learn/income-stress-testing-explained", label: "Income Stress Testing Explained" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I'm fully booked for the next quarter — isn't that stable?",
            a: "It is current. It is not necessarily stable. Stability requires forward visibility beyond the current engagement period. If your pipeline is empty after current projects conclude, your income has a hard expiration date. Full booking describes utilization, not structure.",
          },
          {
            q: "How far ahead does income need to be committed to be considered stable?",
            a: "There is no fixed threshold, but forward visibility of six months or more through contracts, retainers, or recurring arrangements materially improves structural stability. Income with less than 90 days of forward commitment scores poorly on the visibility dimension regardless of current earnings.",
          },
          {
            q: "Does having savings offset low income stability?",
            a: "Savings provide a financial buffer but do not change the structural characteristics of income. A developer with $100,000 in savings and a stability score of 25 has resources to survive income gaps but still has structurally fragile income. Savings are a financial safety net, not a structural fix.",
          },
          {
            q: "Can project-based income ever be stable?",
            a: "Yes, if the project pipeline has structural characteristics that reduce risk — multiple simultaneous clients, contracts with renewal provisions, industries where demand is persistent rather than cyclical, and transition periods short enough that income gaps are minimal. The key is whether the pipeline is structurally reliable, not whether individual projects are temporary.",
          },
          {
            q: "What is the first step to making my income more stable?",
            a: "Identify your single largest structural vulnerability. For most earners, it is either concentration (too much income from one source) or forward visibility (no committed income beyond current work). Addressing the weakest dimension produces the largest score improvement because it reduces the most significant point of failure.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "Check Your Income Structure", href: "/begin" },
          { text: "See a Sample Report", href: "/sample-report" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Find Out Where You Actually Stand"
        sub="Get a structural stability score that measures forward commitment, not current workload."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
