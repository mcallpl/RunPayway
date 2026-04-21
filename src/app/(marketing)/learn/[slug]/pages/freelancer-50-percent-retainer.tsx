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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function Freelancer50PercentRetainer() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Freelancer — 50% Retainer"
        definition="The same freelancer earning $120K — but with half their income on monthly retainers. The structural difference is measurable."
        subtitle="Same person, same skills, same annual income. Different contract structure. Different score."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Retainer income creates a structural floor that project income cannot provide",
          "50% retainer coverage converts a crisis scenario into a manageable adjustment",
          "The score improvement from zero retainers to 50% retainers is typically 20-30 points",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The same freelancer, restructured",
            body: (
              <>
                <P>
                  This scenario examines the same freelancer profiled in the zero-retainer configuration — $120,000 in annual income, four clients, the same skills and market position — but with one structural change: two of the four client relationships have been converted to monthly retainer agreements. Each retainer is set at $5,000 per month with a six-month minimum commitment and a 60-day termination notice clause. Together, the retainers account for $60,000 of the $120,000 total — exactly 50% of annual income.
                </P>
                <P>
                  The remaining $60,000 continues to come from project-based engagements with the other two clients. These relationships have not changed — they are informal, project-to-project, with no forward commitment. The freelancer&apos;s total income, client count, and workload are identical. The only variable that has changed is the contractual structure governing half of the income.
                </P>
                <P>
                  This controlled comparison isolates the impact of contract structure on the income stability score. The freelancer&apos;s skill, reputation, market, and effort are held constant. The model evaluates only the structural change — and the score improvement is substantial. Where the zero-retainer configuration scored 18-28, the 50% retainer configuration scores 45-58. The 20-30 point improvement is driven entirely by the addition of forward-committed, contractually protected income.
                </P>
              </>
            ),
          },
          {
            heading: "How retainers change the structural profile",
            body: (
              <>
                <P>
                  Retainer agreements change three structural variables simultaneously. First, they create forward revenue commitment — $60,000 of income is contractually guaranteed for the retainer period. The freelancer does not need to re-earn this income through new proposals or project negotiations. It is committed. Second, the 60-day termination notice clause provides a buffer against sudden client departure. Even if a retainer client decides to end the arrangement, the freelancer has two months of guaranteed income during the transition. Third, the recurring monthly payment creates predictable cash flow that supports financial planning and reduces the operational stress of variable income.
                </P>
                <P>
                  The model weights each of these factors in its scoring. Forward commitment is the most heavily weighted because it directly determines how much income is structurally protected against disruption. The termination notice clause adds incremental protection by extending the guaranteed period beyond the current month. The predictability of monthly payments reduces volatility, which the model also recognizes as a structural positive.
                </P>
                <P>
                  The combined effect is that the freelancer has moved from a configuration where zero percent of income is structurally protected to one where 50% is protected by contract. The remaining 50% carries the same zero-persistence risk as before. The score reflects this blended profile — significantly better than zero protection, but not yet at the level of a freelancer with 80%+ retainer coverage.
                </P>
              </>
            ),
          },
          {
            heading: "Disruption with a structural floor",
            body: (
              <>
                <P>
                  When the same disruption occurs — the largest project-based client ends the engagement — the financial impact is fundamentally different. In the zero-retainer scenario, the freelancer lost 35% of total income with no structural buffer. In the 50% retainer scenario, the freelancer loses one of two project-based clients, which represents approximately $30,000 in annual income, or 25% of the total.
                </P>
                <P>
                  Critically, the $60,000 retainer base is unaffected by the project client&apos;s departure. The retainer clients are under contract, continuing to pay, and providing the freelancer with $5,000 per month in guaranteed income during the replacement period. The freelancer&apos;s income drops from $120,000 to $90,000 — a meaningful reduction, but one that maintains a livable baseline while the freelancer pursues replacement revenue.
                </P>
                <P>
                  The difference between $78,000 (zero-retainer post-disruption) and $90,000 (50%-retainer post-disruption) understates the structural impact. The retainer freelancer has predictable monthly cash flow of $10,000 from the two retainer clients plus whatever the remaining project client generates. The zero-retainer freelancer has unpredictable project-based income from three clients, any of whom could also leave. The retainer provides not just a higher floor but a more stable and predictable floor — and predictability compounds the structural benefit.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A freelancer earning $120,000 annually from four clients. Two clients are on monthly retainers at $5,000 each ($60,000 annually, 50% of income) with six-month minimum commitments and 60-day termination notice. Two clients are project-based with no forward commitment ($60,000 annually, 50% of income)."
        riskExposure="Moderate. The retainer base provides a structural floor of $60,000 in committed annual income. The project-based portion ($60,000) carries the same zero-persistence risk as the fully project-based scenario. The blended profile means half the income is protected and half is exposed — a meaningful improvement over full exposure but still carrying significant project-based risk."
        disruption="One project-based client ends the engagement. The freelancer loses $30,000 in annual project income (25% of total). The retainer base of $60,000 continues uninterrupted. The remaining project client provides approximately $30,000. Total income during transition: $90,000 — a 25% reduction rather than the 35% reduction in the zero-retainer scenario."
        scoreRange="45-58. The score reflects the structural improvement from adding forward-committed retainer income. The range is 20-30 points higher than the zero-retainer configuration, driven entirely by the addition of contractual persistence, forward commitment, and termination protection on 50% of income."
        howToFix="Expand the retainer base to 65%+ of total income. Convert the remaining project relationships to retainer agreements where possible. Lock forward commitments beyond six months — twelve-month retainers with 90-day notice clauses provide substantially more structural protection. Each incremental increase in retainer coverage improves the score because it increases the proportion of income that is contractually committed."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={30} recurring={25} atRisk={45} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Project client leaves — retainer floor holds"
        setup="A freelancer earning $120,000 from four clients — two on retainers ($60,000 combined) and two on project basis ($60,000 combined). The retainer clients are under six-month agreements with 60-day termination notice. The project clients have no contractual commitment."
        risk="The larger project-based client ends the engagement. Budget reallocation within the client organization eliminates the freelance line item. No notice, no transition period, no contractual obligation. The freelancer loses $30,000 in annual income — 25% of total revenue."
        outcome="The retainer base of $60,000 continues generating $10,000 per month in predictable income. The remaining project client provides additional revenue. Total income drops to approximately $90,000 during the replacement period. The freelancer has a stable financial foundation from which to pursue replacement business — a fundamentally different position than the zero-retainer freelancer facing the same disruption with no structural floor."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Project-Only"
        right="Half Retainer"
        explanation="A project-only freelancer at $120,000 must re-earn 100% of income every cycle. The same freelancer at $120,000 with 50% retainer coverage must re-earn only 50% — the other half is contractually committed. The work may be identical. The schedule may be identical. But the structural exposure to disruption is cut in half, and the score reflects this quantifiable reduction in structural risk."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The same person, the same income, the same clients — with a different contract structure — can move from a score of 22 to a score of 52. Structure is the variable that matters." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/freelancer-no-recurring-income", label: "Scenario: Freelancer — No Recurring Income" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/consultant-no-contracts-vs-retainers", label: "Scenario: Consultant — No Contracts vs Retainers" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How do I convert a project client to a retainer?",
            a: "Frame the retainer as a mutual commitment that benefits both parties. The client receives guaranteed availability, priority scheduling, and continuity of service. The freelancer receives predictable income and can plan capacity more effectively. Present a specific proposal: a defined monthly fee, a minimum commitment period, and clear deliverable expectations. Many clients prefer the certainty of a retained relationship over the risk of the freelancer being unavailable when needed.",
          },
          {
            q: "Should retainer fees be lower than project rates?",
            a: "Not necessarily. Retainers provide the client with guaranteed access and priority — benefits that project-based arrangements do not include. Many freelancers charge the same effective rate or a modest premium for retainer work. If the retainer rate is lower, the structural stability benefit must justify the rate concession. A 10% rate reduction for a six-month guaranteed commitment is generally a favorable trade for the freelancer's structural position.",
          },
          {
            q: "What if a retainer client doesn't use all the hours?",
            a: "The structural benefit of a retainer comes from the committed monthly payment, not from utilization. If the retainer fee is paid regardless of usage, the freelancer's income stability is protected whether the client consumes 100% or 60% of the allocated time. Retainer structures vary — some carry unused hours forward, some operate on a use-it-or-lose-it basis. The model evaluates the payment commitment, not the utilization rate.",
          },
          {
            q: "Is 50% retainer coverage enough?",
            a: "It is a significant structural improvement over zero, but the model continues to reward higher retainer coverage. A freelancer at 50% retainer scores 45-58. At 65% retainer, the range shifts to 52-64. At 80%+, the range reaches 60-72. Each incremental increase adds structural protection because a larger proportion of income is contractually committed forward. The optimal target depends on the freelancer's market and client mix, but higher retainer percentages consistently produce higher scores.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="See How Retainers Change Your Score"
        sub="Get your income stability score and understand exactly how your retainer coverage affects your structural position."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
