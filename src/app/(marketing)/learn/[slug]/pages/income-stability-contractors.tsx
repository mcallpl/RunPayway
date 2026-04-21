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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityContractors() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Contractors"
        definition="Contractor income depends on project completion and the next signed contract. Between jobs, income is zero — regardless of how strong the last project was."
        subtitle="Why project-based income creates structural gaps that high earnings cannot solve."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Income arrives during active projects and stops between them",
          "Forward visibility is limited to signed contracts — not pipeline",
          "Most contractors score between 28 and 45 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How contractor income works",
            body: (
              <>
                <P>
                  Contractors earn through projects — discrete scopes of work with defined start dates, completion milestones, and payment schedules. A general contractor managing a $400,000 residential renovation receives progress payments tied to construction phases: foundation, framing, rough-in, finish work, final inspection. Each payment is contingent on completing the prior phase to specification. Revenue is not a function of time — it is a function of verified progress against a contracted scope.
                </P>
                <P>
                  The bid-driven nature of contracting introduces a second structural layer. Before a project begins, the contractor must identify the opportunity, prepare a bid or estimate, negotiate terms, and execute a contract. This process can take weeks or months depending on the project scale and client decision-making timeline. During this period, the contractor is investing time and overhead without generating revenue from that opportunity. The conversion rate from bid to signed contract varies significantly by trade, market conditions, and project size.
                </P>
                <P>
                  Progress billing creates cash flow patterns that differ from both salaried employment and retainer-based professional services. A contractor may invoice $80,000 upon completing a project phase, then receive no payment for three to six weeks while the next phase is executed. This lumpy revenue pattern means that monthly income can vary dramatically even during active projects — and drops to zero in the gaps between them.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores cluster in the 28-45 range",
            body: (
              <>
                <P>
                  Contractors with active projects and signed contracts for future work score toward the upper end of the range. The presence of a signed contract creates forward visibility — a measurable commitment from a client to pay a defined amount for defined work. This structural feature distinguishes contracting from purely speculative income sources. A contractor with two signed contracts totaling $600,000 over the next eight months has a quantifiable revenue floor that the scoring model recognizes.
                </P>
                <P>
                  However, several structural factors prevent contractor scores from reaching higher ranges. The project-based model creates inherent gaps. Even contractors with strong pipelines experience periods between projects where no revenue is generated. These gaps are structural, not discretionary — they exist because mobilization, permitting, material procurement, and scheduling require time between project completions and new project starts.
                </P>
                <P>
                  The single-operator constraint further limits scores for independent contractors. If the contractor is injured, ill, or otherwise unable to perform, all active projects halt and no revenue is generated. There is no team to continue work, no passive revenue stream to maintain cash flow, and typically no disability insurance structured to replace project income at its full level. The contractor is both the business and the single point of failure.
                </P>
              </>
            ),
          },
          {
            heading: "Structural strategies for contractors",
            body: (
              <>
                <P>
                  The most impactful structural improvement is maintaining overlapping project timelines. A contractor who finishes one project and then begins sourcing the next creates a guaranteed income gap. A contractor who begins business development for the next project while the current one is at 60-70% completion can reduce or eliminate the zero-income period between engagements. This requires deliberate pipeline management — treating business development as a continuous function rather than an event triggered by project completion.
                </P>
                <P>
                  Maintenance contracts and service agreements create recurring revenue that persists between major projects. A contractor who maintains 10 annual service agreements at $3,000 each generates $30,000 in baseline revenue regardless of project status. This recurring floor does not replace project income, but it prevents the income from reaching zero during transition periods and improves the structural profile of the income.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Contracting"
        howIncomeWorks="Project-based, bid-driven, with progress billing tied to construction milestones or deliverable completion. Revenue arrives in irregular intervals during active projects and ceases entirely between them. Contractors must invest significant time and overhead in bidding, estimating, and contract negotiation before any revenue is generated. Cash flow is lumpy even during active engagements due to the milestone-based payment structure."
        typicalRange="28-45. Contractors with signed future contracts and overlapping project timelines score toward the upper range. Contractors dependent on sequential projects with gaps between them, or those with high concentration in a single client or project type, score toward the lower range. The presence of maintenance contracts or recurring service agreements shifts scores upward."
        biggestRisk="Forward visibility gap between projects. When a project ends and no contract is signed for the next one, income drops to zero immediately. The bid-to-contract cycle can take weeks or months, during which the contractor carries full overhead with no revenue. Unlike employment or retainer arrangements, there is no structural mechanism that generates income between signed contracts."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={20} atRisk={70} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="GC finishing a $400K project with nothing signed next"
        setup="A general contractor is completing a $400,000 residential renovation. The project is 90% complete with final payments of $60,000 remaining. The contractor has been focused on delivery for five months and has not actively pursued new business. There are no signed contracts for future work. The pipeline contains two potential projects, both in early discussion with no formal bids submitted."
        risk="In approximately three weeks, the current project will be complete and final payment collected. After that point, revenue drops to zero. The two pipeline opportunities are four to eight weeks from contract execution at best, and neither is guaranteed. The contractor's monthly overhead — insurance, equipment payments, vehicle costs, crew wages — continues regardless of project status."
        outcome="Estimated stability score: 28-32. The contractor has strong current income but no forward visibility beyond the current project. The gap between project completion and next contract signing creates a zero-income period of unpredictable duration. Total potential income loss during the gap: $40,000 to $80,000 depending on how quickly the next project is secured."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Current Project"
        right="Next Project"
        explanation="A contractor's current project measures delivery capacity and present revenue. The next signed project measures forward visibility and structural continuity. A contractor completing a $400,000 project with nothing signed next has strong current income but zero structural protection against the gap that follows. The stability score reflects the forward position, not the current billing rate."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The gap between projects is not downtime. It is a zero-income period with full overhead." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/contractor-project-based-risk", label: "Scenario: Contractor — Project-Based Risk" },
          { href: "/learn/income-stability-small-business-owners", label: "Income Stability for Small Business Owners" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I always have work lined up — why would my score be low?",
            a: "Pipeline is not the same as signed contracts. Work that is likely but not contracted provides no structural protection. The scoring model measures commitments — executed agreements with defined terms and payment schedules. Until a contract is signed, the revenue it represents is speculative regardless of how confident you are in the outcome.",
          },
          {
            q: "Does the size of my projects affect my stability score?",
            a: "Project size affects income level but not stability structure. A $1 million project and a $100,000 project create the same structural pattern: revenue during active work and zero revenue after completion. Larger projects may provide longer periods of active income, but they also create larger gaps if no subsequent project is secured. The scoring model evaluates structure, not scale.",
          },
          {
            q: "How do maintenance contracts improve my score?",
            a: "Maintenance contracts create recurring revenue that persists between major projects. They establish a structural income floor — a baseline that prevents revenue from reaching zero during project transitions. Even modest recurring revenue from service agreements shifts the income structure from purely project-dependent to partially recurring, which improves the structural profile of the income.",
          },
          {
            q: "Should I take smaller projects to maintain continuity?",
            a: "Continuity has structural value. A contractor who maintains three overlapping projects of varying size has greater income stability than one who pursues a single large project at a time. Smaller projects can fill gaps, maintain cash flow, and provide revenue diversification. The trade-off is operational complexity, but the stability benefit is measurable.",
          },
          {
            q: "Does having a crew versus working solo affect the score?",
            a: "Indirectly. A contractor with a crew can maintain multiple active projects simultaneously, which improves diversification and reduces gap risk. A solo contractor is limited to sequential projects, which maximizes gap exposure. The scoring model evaluates the resulting income structure — overlapping projects with staggered timelines produce higher scores than sequential single-project execution.",
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
