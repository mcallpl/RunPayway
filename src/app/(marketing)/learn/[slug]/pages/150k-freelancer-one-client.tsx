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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function FreelancerOneClient() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="$150K Freelancer, One Client"
        definition="A freelancer earning $150,000 per year from a single client with no contract represents one of the most fragile income structures possible — high earnings with near-zero structural resilience."
        subtitle="What happens when 100% of income depends on one relationship."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "100% client concentration means binary income risk",
          "No contract means no structural protection",
          "Estimated stability score: 15-25",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The setup",
            body: (
              <>
                <P>
                  This scenario describes a freelancer — a designer, developer, strategist, or similar independent professional — who earns $150,000 annually from a single client. The engagement is project-based, with no retainer agreement, no minimum commitment, and no written contract guaranteeing future work. Payment is invoiced monthly based on hours worked or deliverables completed.
                </P>
                <P>
                  On the surface, this looks like a successful freelance career. The income exceeds the U.S. median household income by a significant margin. The client relationship may have persisted for years, creating a sense of security. Monthly payments arrive reliably, and the freelancer has organized their financial life — mortgage, expenses, savings — around this income level.
                </P>
                <P>
                  Structurally, however, this arrangement is one of the most fragile income configurations possible. Every dollar of income flows through a single relationship. There is no diversification, no contractual floor, and no secondary source. The freelancer has one client, and that client has made no binding commitment to continue the engagement.
                </P>
              </>
            ),
          },
          {
            heading: "The structural risk",
            body: (
              <>
                <P>
                  The primary risk is total concentration. In portfolio theory, a portfolio holding a single asset has maximum idiosyncratic risk — one adverse event can eliminate the entire position. The same principle applies to income. A freelancer with one client has maximum income concentration risk. There is no partial loss scenario. The income either continues at its current level or it goes to zero.
                </P>
                <P>
                  The absence of a contract compounds this exposure. A written agreement with a termination notice period, minimum engagement commitment, or severance provision would create structural protection — time and money that buffer the transition if the relationship ends. Without these provisions, the client can terminate the engagement at any time, for any reason, with no obligation to the freelancer.
                </P>
                <P>
                  The project-based payment structure adds a third layer of fragility. The freelancer is not paid for being available — they are paid for completing specific work. If the client reduces scope, delays projects, or restructures internally, the freelancer&apos;s income decreases even without a formal termination. The engagement can erode gradually rather than ending cleanly.
                </P>
                <P>
                  Combined, these factors produce a stability score in the 15-25 range. This is among the lowest scores the model generates. The freelancer earns well above average, but their income structure offers almost no protection against disruption of any kind.
                </P>
              </>
            ),
          },
          {
            heading: "What a disruption looks like",
            body: (
              <>
                <P>
                  Disruption in this scenario does not require a dramatic event. The client does not need to go bankrupt or behave badly. Common triggers include: the client hires an internal team to replace the freelancer&apos;s function, the client&apos;s budget is cut during a fiscal year restructuring, the freelancer&apos;s primary contact leaves the company and the new contact prefers a different vendor, or the client simply decides to move in a different direction.
                </P>
                <P>
                  In each of these cases, the outcome is the same: $150,000 in annual income drops to $0. There is no gradual transition. There is no safety net built into the income structure. The freelancer must immediately begin rebuilding from zero — finding new clients, negotiating new terms, and re-establishing income flow — while carrying the full financial obligations that were built around the previous income level.
                </P>
                <P>
                  The recovery timeline is significant. Even skilled freelancers with strong networks typically require three to six months to rebuild a comparable income level from scratch. During that period, the freelancer draws from savings, takes on debt, or accepts lower-paying work to maintain cash flow. The structural damage extends well beyond the initial loss event.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="One client, $150,000 per year gross. No written contract. Project-based invoicing, typically monthly. Engagement has persisted for approximately two years. No other active client relationships. No passive or recurring income streams."
        riskExposure="100% concentration in a single client with zero contractual protection. No diversification across clients, industries, or income types. No minimum engagement commitment. No termination notice requirement. Income is entirely dependent on the ongoing willingness of one organization to continue purchasing services."
        disruption="Client terminates engagement. Cause is irrelevant — budget cut, internal hire, leadership change, strategic pivot. The result is identical regardless of trigger: annual income drops from $150,000 to $0 immediately. No severance. No notice period. No contractual wind-down."
        scoreRange="15-25. This range reflects maximum concentration risk with no structural protection. The score is among the lowest the model produces. High earning capacity is acknowledged but does not offset the structural fragility of the arrangement."
        howToFix="Diversify to at least three clients, with no single client exceeding 40% of total income. Establish written agreements with minimum engagement periods and 60-90 day termination notice clauses. Add at least one recurring revenue stream — a retainer, a subscription product, or a licensing arrangement — that generates income independent of active project work. Target a structure where losing any single client reduces income by no more than 30-40%."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={10} atRisk={85} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="The phone call that ends $150K"
        setup="Friday afternoon. The freelancer's primary contact calls to say the company is bringing the function in-house. 'We really appreciate everything you've done. We'll wrap up the current project and that will be the last one.' The current project has two weeks of billable work remaining."
        risk="In 14 days, the freelancer's income goes from $12,500 per month to $0 per month. No severance. No transition payment. No contractual obligation from the client. The freelancer's mortgage, insurance, and living expenses remain unchanged."
        outcome="The freelancer enters a zero-income period that will likely last 3-6 months while rebuilding their client base. Total income loss during the recovery period: $37,500 to $75,000. Savings absorb the impact if they exist. Debt fills the gap if they don't."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="$150K / 1 Client"
        right="$150K / 5 Clients"
        explanation="Both freelancers earn $150,000 per year. The first has one client and a stability score of 15-25. The second has five clients, no single client exceeding 35% of income, and written agreements with each. Their stability score: 55-65. Same income. Fundamentally different structural resilience. If either loses their largest client, the first loses everything. The second loses $52,500 and continues operating."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A $150,000 income from one client is not a freelance business. It is an unprotected job without benefits." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/client-concentration-risk", label: "What Is Client Concentration Risk" },
          { href: "/learn/income-diversification", label: "What Is Income Diversification" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "My client has been with me for years — doesn't that count for something?",
            a: "Longevity indicates a healthy relationship, but it does not create structural protection. A five-year client relationship with no contract can end as abruptly as a five-month one. Stability is measured by contractual terms, diversification, and structural safeguards — not by the duration of a handshake arrangement.",
          },
          {
            q: "Can I improve my score without reducing my work for this client?",
            a: "Yes. You do not need to reduce income from your current client. The primary strategies are: add new clients to diversify concentration, negotiate a written agreement with your existing client that includes minimum terms and notice periods, and develop a secondary income stream that is not dependent on active project work.",
          },
          {
            q: "What if my client gives me a verbal commitment for next year?",
            a: "A verbal commitment has no structural weight in a stability assessment. It reflects intent, which can change. A written contract with specific terms, notice periods, and minimum commitments creates measurable structural protection. Until the commitment is documented and binding, it does not alter the stability profile.",
          },
          {
            q: "Is 15-25 the lowest possible score?",
            a: "Scores below 15 are rare but possible in cases involving irregular income with no documentation, no client agreements, and complete dependence on a single project or seasonal event. The 15-25 range represents severe structural fragility — not the absolute floor, but a level that warrants immediate attention to income structure.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Score Your Setup", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Find Out Where You Stand"
        sub="Get your income stability score and a concrete plan to reduce your concentration risk."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
