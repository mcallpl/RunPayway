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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function FreelancerFiveClients() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="$150K Freelancer — Five Clients"
        definition="Same income as the single-client freelancer. Completely different risk profile."
        subtitle="How client diversification transforms income structure without changing earning level."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Five clients with the largest at 30% creates moderate — not severe — concentration",
          "A mix of project and retainer work builds structural resilience",
          "Estimated stability score: 45-60",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Why the same income produces a different score",
            body: (
              <>
                <P>
                  Two freelancers earn $150,000 per year. The first has one client. The second has five. Their tax returns look identical. Their income stability profiles are fundamentally different. The difference is not in the amount earned but in the structural distribution of how that income is generated, protected, and exposed to disruption.
                </P>
                <P>
                  The single-client freelancer has 100% concentration in one relationship. If that client leaves, income goes to zero. The five-client freelancer has distributed risk across multiple independent relationships. If their largest client leaves, income drops by 30% — a significant loss, but not an existential one. The remaining four clients continue generating $105,000 annually while the freelancer replaces the lost account.
                </P>
                <P>
                  This is the structural principle that drives the score difference. Income stability is not about how much you earn. It is about how much of what you earn is protected against the loss of any single client, contract, or revenue source. Diversification across clients is the most direct way to improve that structural protection without changing anything about earning capacity or professional skill.
                </P>
              </>
            ),
          },
          {
            heading: "How the five-client structure works",
            body: (
              <>
                <P>
                  In this scenario, the freelancer&apos;s $150,000 in annual income is distributed across five clients. The largest client represents 30% of revenue ($45,000), followed by clients at 25% ($37,500), 20% ($30,000), 15% ($22,500), and 10% ($15,000). This is not an equal distribution — it reflects the natural reality that some clients require more work and generate more revenue than others.
                </P>
                <P>
                  The income mix includes both project-based and retainer arrangements. Two clients are on monthly retainers totaling $5,500 per month ($66,000 annually), creating a contractual revenue floor. The remaining three clients engage on a project basis with typical engagement cycles of two to four months. The combination of retainer and project income creates a blended structure that is more resilient than either type alone.
                </P>
                <P>
                  The retainer clients provide baseline predictability — income that arrives monthly regardless of specific project deliverables. The project clients provide upside variability and the opportunity to increase total earnings during high-demand periods. This blended model is the structural mechanism that elevates the stability score from the 15-25 range of a single-client arrangement to the 45-60 range.
                </P>
              </>
            ),
          },
          {
            heading: "What disruption looks like with five clients",
            body: (
              <>
                <P>
                  When the largest client leaves — the one generating $45,000 per year — the financial impact is a 30% reduction in annual income. This is a material loss. It requires adjustment, prospecting, and eventual replacement. But it is not a catastrophe. The freelancer continues earning $105,000 per year from the remaining four clients, with $66,000 of that protected by retainer agreements.
                </P>
                <P>
                  The recovery timeline is also fundamentally different. The single-client freelancer who loses their only client must rebuild from zero — finding new clients, negotiating terms, and establishing income flow from scratch. The five-client freelancer needs to replace 30% of income while continuing to serve existing clients. The existing retainer revenue provides cash flow stability during the transition. The existing project clients provide referral opportunities and portfolio evidence for new business development.
                </P>
                <P>
                  Even a worst-case scenario — losing two clients simultaneously — reduces income to approximately $67,500 from the three remaining clients. This is a severe disruption, but the freelancer retains income, retains client relationships, and retains the ability to recover without starting from zero. The structural difference between partial loss and total loss is the core value of diversification.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Five clients, $150,000 total annual revenue. Largest client at 30% ($45,000), followed by 25%, 20%, 15%, and 10%. Two clients on monthly retainers totaling $66,000 annually. Three clients on project-based engagements. Mix of industries — technology, healthcare, and professional services."
        riskExposure="Moderate concentration. No single client exceeds 30% of total revenue. Client loss reduces income but does not eliminate it. Retainer agreements provide contractual protection for 44% of total income. Project-based income (56%) is variable but distributed across three independent relationships."
        disruption="Largest client (30% of revenue) terminates engagement. Annual income drops from $150,000 to $105,000. Retainer income ($66,000) continues unaffected. Two project clients continue generating approximately $39,000. The freelancer operates at 70% of previous income while prospecting for a replacement client."
        scoreRange="45-60. This range reflects moderate diversification with partial contractual protection. The score is meaningfully higher than the single-client version (15-25) because the income structure has multiple independent revenue sources and a contractual floor through retainer agreements."
        howToFix="Lock the largest client into a retainer arrangement to increase the protected revenue percentage. Add a sixth client to reduce maximum concentration below 25%. Negotiate 60-90 day termination notice clauses with all project-based clients. Target a structure where retainer income covers at least 50% of total revenue and no single client exceeds 25% of the total."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={25} recurring={30} atRisk={45} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Same $150K — score of 50 vs score of 20"
        setup="Two freelancers file identical tax returns showing $150,000 in annual income. Freelancer A has one client, no contract, project-based invoicing. Freelancer B has five clients, two on retainers, no single client exceeding 30% of revenue. Both are skilled professionals with strong reputations."
        risk="Both freelancers lose their largest client. Freelancer A loses 100% of income — $150,000 drops to $0. Freelancer B loses 30% of income — $150,000 drops to $105,000. Both must replace lost revenue, but only one must do so from a position of zero income and zero active client relationships."
        outcome="Freelancer A: estimated score 15-25. Freelancer B: estimated score 45-60. The tax return is identical. The structural exposure is not. Freelancer B's diversification and retainer agreements create a fundamentally different risk profile that the stability score captures and a simple income figure does not."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="One Client at $150K"
        right="Five Clients at $150K"
        explanation="The income is the same. The structure is not. One client at $150K means 100% concentration, binary risk, and a stability score of 15-25. Five clients at $150K means distributed risk, partial protection, and a stability score of 45-60. The difference is entirely structural — same earnings, same profession, same skill level, completely different resilience."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Diversification is not about working harder. It is about building an income structure that survives the loss of any single client." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/150k-freelancer-one-client", label: "Scenario: $150K Freelancer, One Client" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/consultant-no-contracts-vs-retainers", label: "Scenario: Consultant — No Contracts vs Retainers" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is five clients the magic number?",
            a: "No. The number of clients is less important than the concentration distribution. Four clients at roughly 25% each provides excellent diversification. Five clients where one represents 60% of income provides little structural benefit over having two clients. The target is a distribution where no single client can eliminate more than 30-40% of total income.",
          },
          {
            q: "How much does retainer income improve the score?",
            a: "Significantly. Retainer income is contractually protected recurring revenue — it arrives monthly regardless of specific project deliverables and typically requires notice for termination. In this scenario, retainer income covers 44% of total revenue, which creates a structural floor that project-based income alone cannot provide. Increasing the retainer percentage to 50% or above would push the score toward the upper end of the range.",
          },
          {
            q: "What if I can't get all five clients at once?",
            a: "Building a diversified client base is a gradual process. Start by adding a second client to reduce concentration from 100% to something more manageable. Then add retainer terms to your most reliable relationship. Each structural improvement moves the score upward incrementally. The five-client model described here is a target state, not a prerequisite — every step toward it improves the stability profile.",
          },
          {
            q: "Does the industry mix of my clients matter?",
            a: "Yes. Clients in different industries provide protection against sector-specific downturns. If all five clients are in the same industry and that industry contracts, all five relationships face simultaneous risk. Diversification across industries means that a downturn in one sector affects only the clients in that sector while the others continue generating revenue.",
          },
          {
            q: "How does this compare to the one-client scenario?",
            a: "The single-client freelancer earning $150,000 has a stability score of 15-25. This five-client freelancer earning the same $150,000 has a score of 45-60. The difference is 25-35 points — driven entirely by structural factors: client diversification, retainer agreements, and reduced maximum concentration. No change in income level, skill, or profession.",
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
