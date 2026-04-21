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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function BusinessOwnerOneVsThreeSources() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Business Owner — 1 vs 3 Revenue Sources"
        definition="A business with one revenue source and a business with three revenue sources may earn the same amount. Their structural risk is fundamentally different."
        subtitle="How revenue diversification changes the stability profile at the same income level."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Same revenue, fundamentally different structural risk",
          "Single-source revenue creates binary outcome — it continues or it ends",
          "Three sources distribute risk so no single loss is existential",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Two businesses, same revenue, different structures",
            body: (
              <>
                <P>
                  Consider two business owners, each generating $300,000 in annual revenue. Business A earns the entire $300,000 from a single large contract with one corporate client — a facilities management agreement that has been in place for three years. Business B earns $300,000 from three distinct revenue streams: $140,000 from ongoing service contracts with eight clients, $100,000 from a recurring maintenance program with 40 residential customers, and $60,000 from equipment sales and installations.
                </P>
                <P>
                  From a top-line perspective, these businesses are identical. Both generate $300,000 in revenue. Both may have similar margins, similar overhead, and similar owner draws. A traditional financial analysis would evaluate them comparably. An income stability analysis evaluates them as fundamentally different structures with fundamentally different risk profiles.
                </P>
                <P>
                  The difference is not in how much each business earns. The difference is in how the revenue is structured — how many sources contribute to the total, how concentrated the revenue is in any single source, and what happens to the business when the largest source is disrupted. These structural characteristics determine resilience, and resilience determines stability.
                </P>
              </>
            ),
          },
          {
            heading: "The structural risk of a single source",
            body: (
              <>
                <P>
                  Business A has maximum concentration risk. The entire $300,000 depends on one contract with one client. If that client terminates the agreement, revenue does not decline — it disappears. There is no partial loss scenario. The business goes from $300,000 to $0, and the owner&apos;s draw goes from whatever margin the business produces to negative, because fixed operating costs continue even when revenue stops.
                </P>
                <P>
                  The contract itself provides some structural protection — termination provisions, notice periods, and defined terms create a buffer. But the protection is limited. A 90-day termination clause gives the owner three months to find replacement revenue for the entire $300,000. In most industries, rebuilding that level of revenue from scratch takes six to twelve months. The contract delays the full impact but does not prevent it.
                </P>
                <P>
                  The psychological dimension is equally significant. A business owner with a single large client often organizes the entire operation around that client&apos;s needs — staffing, equipment, processes, and scheduling all optimized for the primary relationship. This operational alignment increases efficiency but decreases adaptability. When the relationship ends, the owner must restructure the business while simultaneously generating no revenue from the structure that was built.
                </P>
              </>
            ),
          },
          {
            heading: "How three sources change the math",
            body: (
              <>
                <P>
                  Business B distributes its $300,000 across three revenue streams and dozens of individual client relationships. The largest single revenue stream represents 47% of total revenue — still concentrated, but not binary. If the largest stream ($140,000 in service contracts) is disrupted, the business retains $160,000 in revenue from the other two streams. The owner&apos;s draw may be reduced or eliminated temporarily, but the business continues to operate and generate revenue while replacement income is pursued.
                </P>
                <P>
                  The recurring maintenance program adds a structural layer that Business A entirely lacks. Forty residential customers paying monthly create a revenue base that is inherently distributed — no single customer represents more than 2.5% of that stream&apos;s revenue. Customer churn affects the total gradually rather than catastrophically. Losing five customers reduces maintenance revenue by 12.5%, not 100%. This distributed structure is fundamentally more resilient than any single-client arrangement.
                </P>
                <P>
                  The equipment sales and installation stream provides transactional revenue that, while less predictable than recurring contracts, adds a third category of income that operates independently of the other two. A downturn in service contract demand does not necessarily reduce equipment sales. This structural independence between revenue streams means that adverse events affecting one stream do not automatically propagate to the others.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Both businesses generate $300,000 in annual revenue. Business A: single corporate contract, one client, facilities management agreement. Business B: $140,000 from service contracts (8 clients), $100,000 from residential maintenance program (40 customers), $60,000 from equipment sales and installations. Both businesses have similar operating margins of approximately 25%, producing owner draws of approximately $75,000."
        riskExposure="Business A: 100% concentration in a single client. Revenue is binary — it either continues at $300,000 or drops to $0. No partial loss scenario exists. Business B: largest revenue stream represents 47% of total. Largest single client within that stream represents approximately 12% of total revenue. Loss of the largest client reduces revenue by $36,000 (12%), not $300,000."
        disruption="The largest revenue source is lost. For Business A, the corporate client terminates the facilities management agreement with 90-day notice. Revenue drops from $300,000 to $0 after the notice period. For Business B, the largest service contract client ($36,000/year) terminates. Revenue drops from $300,000 to $264,000. The maintenance program and equipment sales continue unaffected."
        scoreRange="Business A: 20-30. Maximum concentration risk with binary outcome. Business B: 45-60. Distributed revenue with no single client representing an existential threat. Same total revenue, 20-30 point difference in stability score based entirely on structural differences."
        howToFix="Business A must diversify. The immediate priority is adding revenue sources — not replacing the existing client, but supplementing it. A target structure distributes revenue so that no single client exceeds 25-30% of total revenue and at least one revenue stream is recurring with distributed customer relationships. This transformation typically takes 12-24 months of deliberate client acquisition and service development."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={30} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="The call that changes everything — but only for one business"
        setup="Both business owners receive a call on the same Tuesday morning. The message is identical: their largest revenue source is ending in 90 days. For Business A, this is the only client. For Business B, this is the largest of eight service contract clients, representing $36,000 of $300,000 in annual revenue."
        risk="Business A enters a 90-day countdown to zero revenue. The owner must find $300,000 in replacement revenue or shut down. Every day that passes without a new contract increases financial pressure. Business B absorbs a 12% revenue reduction. The owner adjusts quarterly projections and intensifies business development for new service contracts while the other revenue streams continue uninterrupted."
        outcome="Business A: existential crisis requiring complete revenue reconstruction. Owner draw goes to zero. Business survival is uncertain. Business B: manageable revenue decline requiring accelerated sales activity. Owner draw is reduced by approximately $9,000 annually. Business continues to operate normally. Same triggering event. Structurally different outcomes."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Single Revenue Stream"
        right="Three Revenue Streams"
        explanation="A single revenue stream means a single point of failure. Three revenue streams mean that a disruption to any one of them reduces income without eliminating it. The structural difference is not about optimism or diversification as a strategy preference — it is about the mathematical reality that distributed revenue survives disruptions that concentrated revenue cannot."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A $300,000 business with one client is not a business. It is an unprotected contract." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-small-business-owners", label: "Income Stability for Small Business Owners" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "My single client has been with me for years — doesn't that reduce the risk?",
            a: "Longevity indicates a healthy relationship, not structural protection. A ten-year relationship that ends produces the same outcome as a one-year relationship that ends: $300,000 drops to $0. The duration of the relationship has no bearing on the structural consequence of its termination. Stability measures what happens when disruption occurs, not how likely the disruption appears.",
          },
          {
            q: "Is three revenue sources enough, or do I need more?",
            a: "Three sources is a meaningful improvement over one, but the quality of diversification matters more than the count. Three sources where one represents 80% of revenue provides limited structural improvement. Three sources distributed roughly equally — or where no single source exceeds 40% — creates genuine resilience. The goal is a structure where losing any single source is financially manageable, not existential.",
          },
          {
            q: "How long does it take to diversify from one source to three?",
            a: "For most service businesses, building two additional revenue streams to meaningful scale takes 12 to 24 months. The first six months typically involve identifying viable adjacent services, developing the offering, and acquiring initial clients. Months six through eighteen involve scaling those streams to a level where they provide material revenue contribution. The timeline is faster for businesses that can productize existing capabilities into new service offerings.",
          },
          {
            q: "Does revenue diversification reduce profitability?",
            a: "In the short term, adding new revenue streams often requires investment that temporarily compresses margins. New client acquisition, service development, and operational expansion consume resources. In the medium term, diversified businesses typically operate at comparable or higher margins because they are not price-dependent on a single client and can allocate resources more efficiently across multiple revenue streams. The profitability trade-off is real but temporary.",
          },
          {
            q: "What if my industry naturally produces single-client businesses?",
            a: "Some industries have structural characteristics that favor concentration — government contracting, specialized manufacturing, and enterprise consulting are examples. In these cases, the strategy shifts from client diversification to contractual protection: longer contract terms, renewal provisions, termination penalties, and milestone-based payment structures that create structural buffers. The goal remains reducing the severity of a single-client loss, even if the number of clients cannot easily increase.",
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
