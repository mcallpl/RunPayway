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
} from "@/components/learn/LearnComponents";

export default function WhatA50ScoreMeans() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Score Interpretation"
        title="What a 50 Income Stability Score Means"
        definition="A score of 50 places you at the threshold of Established Stability. Your income has measurable protections but still has structural exposure."
        subtitle="Score range: 50-74 · Band: Established Stability"
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A score of 50 means you have crossed from Developing into Established Stability — your income has real structural protections in place",
          "Earners at 50 typically have multiple income sources and at least one recurring or contractually committed stream",
          "The gap between 50 and 65 is where targeted structural improvements produce the most dramatic score movement",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What this score tells you",
            body: (
              <>
                <P>
                  A score of 50 tells you that your income has crossed a meaningful structural threshold. You have moved beyond the concentrated, unprotected profile that characterizes scores in the 30s and 40s. At 50, the model has identified measurable diversification, some recurring or committed income, and a degree of structural resilience that can absorb minor disruptions without catastrophic impact.
                </P>
                <P>
                  However, a 50 also indicates that your structural protections are early-stage. You likely have enough diversification to survive the loss of one source but not two. You have some forward visibility but not enough to plan confidently beyond 3-6 months. You have some income that continues without active labor, but the majority still depends on your ongoing effort. These are real protections — they matter — but they leave meaningful exposure that earners scoring 65+ have addressed.
                </P>
                <P>
                  The most important thing a score of 50 tells you is that you are in the band where structural improvements have the highest return. Every point between 50 and 65 represents a meaningful reduction in structural vulnerability, and the changes required to move through this range are specific, measurable, and achievable without changing your profession or income level.
                </P>
              </>
            ),
          },
          {
            heading: "What typically drives a 50",
            body: (
              <>
                <P>
                  Earners at 50 have typically moved past the single biggest structural weakness — extreme concentration — but have not yet built the depth of protection that characterizes mid-range Established scores. A typical profile at 50 includes three clients or income sources, with one providing a disproportionate share (40-50% of total income). There is often one retainer or contractual commitment, but it may be short-term (month-to-month or quarterly). There may be a small recurring income stream — a product, a subscription, rental income — but it represents less than 15% of total earnings.
                </P>
                <P>
                  The structural characteristics that produce a 50 are sound but incomplete. The earner has begun to diversify but has not diversified enough to eliminate single-source dependency. They have begun to add commitments but have not converted enough relationships to reduce forward visibility risk. They have some income that continues without labor, but not enough to meaningfully change the outcome of a 30-day work stoppage.
                </P>
                <P>
                  What separates a 50 from a 35 is intentional structure — the earner has made choices that improve resilience. What separates a 50 from a 65 is depth — the structures are present but need reinforcement and expansion.
                </P>
              </>
            ),
          },
          {
            heading: "Next moves to reach 65+",
            body: (
              <>
                <P>
                  Moving from 50 to 65 requires deepening the structural protections you have already started building. The three highest-impact moves at this stage: reduce your largest source to below 35% of total income by growing other sources, convert at least two client relationships to contracts of 6 months or longer, and increase your recurring or labor-independent income to at least 20% of total earnings.
                </P>
                <P>
                  Each of these moves addresses a different scoring dimension. Reducing concentration below 35% in your largest source eliminates the single-point-of-failure risk that caps scores in the low-to-mid 50s. Adding 6-month contracts gives the model forward visibility data that significantly improves your commitment score. Growing recurring income to 20% creates a meaningful structural floor that protects against labor-dependent disruptions.
                </P>
                <P>
                  The path from 50 to 65 is not about working harder or earning more. It is about converting the income you already earn into a more resilient structure. Most earners who are intentional about these three dimensions can reach 65 within 12-18 months without increasing their total income.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={20} recurring={30} atRisk={50} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Consultant with 3 clients and one retainer at score 50"
        setup="A management consultant earns $140,000 annually from three clients. Client A provides 45% of revenue on a 6-month retainer. Client B provides 35% through project-based work with no contract. Client C provides 20% through quarterly engagements. All income requires active delivery."
        risk="Client B, providing 35% of income with no contractual protection, ends the engagement with 30 days notice. The consultant retains the retainer and quarterly work but loses more than a third of income with no committed replacement pipeline."
        outcome="The retainer with Client A provides structural protection for 45% of income — this is what a 50 looks like in practice. A score of 35 would have no retainer to fall back on. Adding a second retainer relationship and reducing dependency on any single client to below 35% would push this consultant into the low 60s, where a single client departure becomes manageable rather than destabilizing."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Entering Established (50)"
        right="Deep Established (70)"
        explanation="At 50, you have the beginnings of structural protection — some diversification, one or two commitments, limited recurring income. At 70, those protections are deep and layered: no single source exceeds 30% of income, multiple relationships are contractually committed for 6+ months, and 25-35% of income continues without active labor. The difference is not a different kind of income — it is the same structural principles applied more thoroughly."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A 50 means you have started building real structural protection. The foundation is in place — now it needs depth." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-a-35-score-means", label: "What a 35 Score Means" },
          { href: "/learn/what-a-72-score-means", label: "What a 72 Score Means" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is 50 a good score?",
            a: "A 50 is the entry point of Established Stability, which means your income has crossed from vulnerable to protected. It is not yet strong — earners in the 60s and 70s have significantly more structural resilience — but it represents a meaningful threshold. You have protections that most earners in the 30s and 40s do not.",
          },
          {
            q: "How long does it take to move from 50 to 65?",
            a: "Most earners who make targeted structural changes — adding contractual commitments, reducing concentration, growing recurring income — can move from 50 to 65 within 12-18 months. The timeline depends on the specific structural changes available in your profession and client relationships.",
          },
          {
            q: "What is the biggest risk at a 50?",
            a: "The biggest risk at 50 is typically residual concentration — having one source that still provides 40-50% of total income. While you have diversified beyond a single source, the largest source still represents a disproportionate share. Losing that source would drop you back into the Developing band. Reducing your largest source below 35% is the single most impactful structural change at this level.",
          },
          {
            q: "Does a 50 mean I can handle a disruption?",
            a: "A 50 means you can handle a minor disruption — the loss of a small client, a short-term project delay, a temporary market slowdown. It does not yet mean you can handle a major disruption like losing your largest client or a prolonged market downturn. That level of resilience typically requires a score in the mid-60s or higher.",
          },
          {
            q: "Is there a difference between a 50 and a 55?",
            a: "Yes. Every point in the 50-65 range represents measurable structural improvement. A 55 typically indicates that concentration has been further reduced, commitments have been extended, or recurring income has grown. The model does not use arbitrary thresholds within bands — each point reflects real structural characteristics.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="See Where You Stand"
        sub="Get your income stability score and understand exactly what structural changes will move you from the threshold of Established into its core."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
