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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityConsultants() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Consultants"
        definition="Consulting income is labor-dependent by design. The consultant is the product. If they stop delivering, income stops."
        subtitle="Why high-value engagements do not automatically produce high stability scores."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Engagement-based income ends when the statement of work ends",
          "The consultant is the product — no leverage beyond personal delivery",
          "Most independent consultants score between 30 and 50 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How consulting income works",
            body: (
              <>
                <P>
                  Independent consultants earn through engagements — structured periods of advisory or implementation work governed by a statement of work (SOW). A typical SOW defines the scope, deliverables, timeline, and compensation for a specific project. Compensation is usually structured as a fixed project fee, a daily or hourly rate, or a monthly retainer for a defined period. When the SOW concludes, the income from that engagement concludes.
                </P>
                <P>
                  The engagement model creates natural income cycles. A consultant may have two overlapping engagements generating $25,000 per month, followed by a gap of four to eight weeks while the next engagement is scoped and contracted. These gaps are structural — they are inherent to the business model, not evidence of underperformance. Even highly sought-after consultants experience periodic revenue interruptions between engagements.
                </P>
                <P>
                  Unlike product businesses or firms with multiple practitioners, an independent consultant&apos;s revenue capacity is bounded by their personal delivery capacity. There is a hard ceiling on billable hours, which means income growth requires raising rates rather than scaling volume. This constraint also means that any interruption to the consultant&apos;s ability to deliver — illness, travel, personal obligations — directly reduces revenue with no buffer or substitute.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores cluster in the 30-50 range",
            body: (
              <>
                <P>
                  Consultants generally score higher than freelancers because their engagements tend to be longer, more formally structured, and governed by written agreements. A six-month SOW with a management consulting firm creates more structural protection than a month-to-month freelance project with no contract. The SOW defines obligations on both sides, typically includes termination provisions, and provides forward revenue visibility that project-based freelancing does not.
                </P>
                <P>
                  However, several factors prevent consulting scores from reaching the upper ranges. Labor dependence is the primary constraint. The consultant must personally deliver the work — there is no team, no product, no asset that generates revenue independently of the consultant&apos;s active participation. If the consultant is unavailable for any reason, income ceases entirely during that period.
                </P>
                <P>
                  Client concentration is the second factor. Most independent consultants maintain two to four active engagements at any given time, with one or two representing the majority of revenue. This is a natural consequence of the engagement model — deep advisory work requires significant time investment per client, limiting the number of concurrent relationships. The resulting concentration means that a single engagement ending can eliminate 40-60% of income.
                </P>
              </>
            ),
          },
          {
            heading: "Structural strategies for consultants",
            body: (
              <>
                <P>
                  The most effective structural improvement for consultants is converting project-based engagements into ongoing retainer arrangements. A retainer agreement commits the client to a monthly fee for a defined period — typically six to twelve months — in exchange for a guaranteed allocation of the consultant&apos;s time and availability. This transforms irregular project income into predictable recurring revenue with contractual protection.
                </P>
                <P>
                  Building a pipeline of overlapping engagements reduces the gap risk inherent in the SOW model. If a consultant maintains three engagements with staggered end dates, the conclusion of any single engagement does not create a zero-income period. The other two continue generating revenue while the replacement engagement is secured. This requires deliberate pipeline management — starting business development for the next engagement well before the current one concludes.
                </P>
                <P>
                  Developing productized offerings — workshops, assessments, frameworks, or diagnostic tools that can be sold as standardized packages — creates income that is less dependent on custom engagement scoping. A productized offering can be delivered more efficiently, sold at higher margin, and scaled beyond the consultant&apos;s personal billable capacity. Even modest revenue from productized services improves the stability profile by diversifying away from pure labor-for-revenue arrangements.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Consulting"
        howIncomeWorks="Engagement-based, governed by statements of work. Compensation structured as project fees, daily/hourly rates, or time-bounded retainers. Income arrives during active engagements and ceases between them. Revenue capacity is constrained by the consultant's personal delivery bandwidth. No employer benefits, no paid leave, no structural income floor between engagements."
        typicalRange="30-50. Consultants with multi-month retainer agreements and three or more concurrent clients score toward the upper range. Consultants dependent on sequential project engagements with one or two clients score toward the lower range. Engagement length and contractual terms are the primary differentiators."
        biggestRisk="Labor dependence. The consultant is the product. Every dollar of revenue requires the consultant's personal participation in delivery. There is no leverage — no team, no recurring asset, no passive income stream in the standard consulting model. If the consultant stops working, income stops immediately, with no structural mechanism to sustain revenue during the interruption."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={30} atRisk={55} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Management consultant, $200K, two clients, no retainers"
        setup="Independent management consultant earning $200,000 annually from two clients. Client A is a mid-size private equity firm paying $140,000 per year through sequential project engagements. Client B is a portfolio company paying $60,000 per year for operational advisory. Both engagements are SOW-based with 30-day termination clauses. No retainer agreements."
        risk="Client A completes a fund transition and pauses all external advisory engagements for 90 days while restructuring. The consultant's income drops from $16,700 per month to $5,000 per month — a 70% reduction — with no contractual obligation from Client A to resume the engagement afterward."
        outcome="Estimated stability score: 30-38. The consultant's income is structurally dependent on two relationships, with 70% concentrated in a single client. The SOW structure provides some protection through termination clauses, but no guarantee of engagement renewal. A single client pause creates a severe income disruption that the remaining engagement cannot offset."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Billable Hours"
        right="Stable Income"
        explanation="Billable hours measure the consultant's utilization rate — how much of their available time is sold to clients. Stable income measures the structural resilience of the revenue those hours generate. A consultant billing 90% of their capacity has excellent utilization but may still have a low stability score if those hours are concentrated in one client with no retainer and no contractual renewal commitment."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="If you are the product, your income has a single point of failure — you." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/consultant-no-contracts-vs-retainers", label: "Scenario: Consultant — No Contracts vs Retainers" },
          { href: "/learn/income-stability-sales-professionals", label: "Income Stability for Sales Professionals" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I have long-standing client relationships — doesn't that indicate stability?",
            a: "Longevity reflects relationship quality, not structural protection. A five-year client relationship governed by sequential short-term SOWs can end at the conclusion of any engagement. Stability is measured by contractual commitments — retainer terms, minimum engagement periods, and notice provisions — not by the duration of the relationship itself.",
          },
          {
            q: "How does a retainer agreement change the score?",
            a: "A retainer converts variable engagement income into contractually protected recurring revenue. A twelve-month retainer with a $15,000 monthly fee creates $180,000 in committed revenue with defined terms. This fundamentally changes the income structure from project-dependent to contractually secured, and the stability score reflects that difference directly.",
          },
          {
            q: "Is consulting inherently less stable than salaried employment?",
            a: "Not inherently, but structurally in most configurations. A consultant with three retainer clients, written agreements, and diversified revenue streams can achieve a stability score comparable to or exceeding salaried employment. The difference is that salaried employment provides structural protection by default, while consulting requires the consultant to deliberately build it.",
          },
          {
            q: "What is the minimum number of clients I need?",
            a: "The number matters less than the concentration distribution. Three clients at roughly equal revenue contribution provide significantly more structural resilience than five clients where one represents 60% of income. The target is a distribution where no single client exceeds 40% of total revenue and losing any one client does not create an existential income crisis.",
          },
          {
            q: "Does subcontracting work to other consultants improve stability?",
            a: "Subcontracting can improve stability if it reduces labor dependence — meaning revenue can continue even when you are not personally delivering. However, subcontracting also introduces quality risk and margin compression. The stability benefit is real but must be weighed against operational complexity and the potential impact on client relationships that were built around your personal delivery.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Assess Your Consulting Practice", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Understand Your Structural Position"
        sub="Get your income stability score and identify the specific structural risks in your consulting practice."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
