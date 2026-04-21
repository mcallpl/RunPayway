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

export default function WhatA35ScoreMeans() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Score Interpretation"
        title="What a 35 Income Stability Score Means"
        definition="A score of 35 places you in the Developing Stability band. Your income has foundational elements but remains vulnerable to common disruptions."
        subtitle="Score range: 30-49 · Band: Developing Stability"
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A score of 35 means your income has structural building blocks but lacks the diversification and commitments that absorb disruptions",
          "Most earners in this band rely on 1-2 income sources with limited contractual protection and high labor dependency",
          "Moving from 35 to the mid-40s typically requires one structural change — not an overhaul, but a single diversification or commitment upgrade",
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
                  A score of 35 indicates that your income is concentrated, has low forward visibility, and is heavily labor-dependent. This does not mean your income is low or that you are struggling financially — many earners in this band have strong earnings. What it means is that the structural architecture of your income leaves you exposed to disruptions that earners with higher scores can absorb without material impact.
                </P>
                <P>
                  Concentration means your income comes from a small number of sources — often one or two. Low forward visibility means you have limited contractual commitments that guarantee future income beyond the current billing cycle. Labor dependency means that if you stop working, your income stops with you. These three characteristics combine to create a profile where a single event — losing a client, a market downturn, a health issue — can materially change your financial position.
                </P>
                <P>
                  The model is not measuring your talent, your earnings potential, or your financial discipline. It is measuring how your income is built. A score of 35 tells you that the way your income is structured leaves meaningful gaps in protection, recurrence, and diversification — and that these gaps are addressable with specific structural changes.
                </P>
              </>
            ),
          },
          {
            heading: "What typically drives a 35",
            body: (
              <>
                <P>
                  Earners who score 35 typically share a common structural profile: one or two primary clients or income sources, project-based or hourly billing with no long-term contracts, and minimal income that continues without active labor. This is the default structure for early-career freelancers, solo consultants building a practice, sales professionals who have not yet built a renewal book, and small business owners dependent on their own daily effort.
                </P>
                <P>
                  The scoring model identifies these patterns not because they are unusual — they are extremely common — but because they create measurable structural exposure. A freelancer with two clients and no retainer agreements is one client departure away from a 50% income loss. A consultant billing hourly with no forward commitments has zero income visibility beyond the current month. These are not hypothetical risks; they are structural characteristics that the model quantifies.
                </P>
                <P>
                  What is notable about a 35 is that it typically does not require multiple problems — it usually reflects one dominant structural weakness. The most common: extreme concentration in a single source. Addressing that single weakness often produces the largest score improvement available at this band level.
                </P>
              </>
            ),
          },
          {
            heading: "What to do first",
            body: (
              <>
                <P>
                  The highest-impact move from a 35 is diversifying one income source. If you earn from one client, add a second. If you earn from two clients in the same industry, add one in a different sector. The model rewards source diversification heavily at this band level because it directly reduces concentration risk — the single largest structural vulnerability for earners scoring in the 30s.
                </P>
                <P>
                  The second-highest-impact move is locking one commitment. Convert one project-based relationship to a retainer. Sign one contract that guarantees income for 3-6 months. Add one recurring revenue stream, even if it is small relative to total income. The model measures forward commitments as a distinct scoring dimension, and moving from zero commitments to one produces a meaningful score improvement.
                </P>
                <P>
                  These two moves — diversify one source and lock one commitment — are typically sufficient to move a score of 35 into the mid-40s. They do not require increasing total income, changing careers, or making dramatic lifestyle changes. They require restructuring how existing income is generated and protected.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={8} recurring={15} atRisk={77} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Freelance marketer at $90K with a score of 35"
        setup="A freelance marketing consultant earns $90,000 annually from two clients. One provides 70% of revenue through project-based work with no contract. The other provides 30% through a month-to-month verbal agreement. All income requires active delivery. No retainers, no recurring products, no passive revenue."
        risk="The primary client delays a project by 60 days due to internal budget reallocation. This is not a lost client — just a timing shift. But with 70% of income concentrated in one relationship and no contractual protection, the freelancer faces a two-month period at 30% of normal income."
        outcome="Converting the primary client to a $5,000/month retainer would restructure 67% of that relationship from project-based to recurring. This single change would push the score from 35 to approximately 48 — crossing from Developing Stability into the upper range of the band and approaching the Established threshold. The total income does not change. Only the structure changes."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Score of 35"
        right="Score of 65"
        explanation="Two marketing consultants in the same industry, earning the same $90,000. The 35 earns from two clients with no contracts and project-based billing. The 65 earns from five clients, two on 12-month retainers, with a small digital product generating $800/month in recurring revenue. Same profession, same income level, fundamentally different structural resilience. The difference is not talent or effort — it is architecture."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A 35 doesn't mean your income is bad. It means one disruption could change everything." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-a-50-score-means", label: "What a 50 Score Means" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/freelancer-no-recurring-income", label: "Freelancer With No Recurring Income" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is a 35 a failing score?",
            a: "No. A 35 is in the Developing Stability band, which means your income has foundational elements but structural vulnerabilities. Most early-career independent earners score in this range. The score identifies what needs to change, not whether you are succeeding or failing financially.",
          },
          {
            q: "How quickly can I improve from a 35?",
            a: "The fastest improvements at this band level come from structural changes, not income increases. Adding one diversified source or converting one relationship to a retainer can produce a 10-15 point improvement. Most earners who make one targeted structural change see measurable improvement within 3-6 months.",
          },
          {
            q: "Does earning more money improve a 35?",
            a: "Not necessarily. The model measures income structure, not income level. Earning $150,000 from one client with no contract produces a similar score to earning $75,000 from one client with no contract. The structural vulnerabilities are the same regardless of the dollar amount. Higher income with the same structure means more income at risk, not less risk.",
          },
          {
            q: "What is the most common reason for a 35?",
            a: "Extreme source concentration — earning 70% or more of total income from a single source with no contractual protection. This single structural characteristic is the most common driver of scores in the 30-39 range because it creates maximum exposure to a single point of failure.",
          },
          {
            q: "Should I be worried about a 35?",
            a: "Concerned, not panicked. A 35 means your income is structurally exposed but not structurally broken. The score is designed to identify specific vulnerabilities so you can address them. The fact that you are measuring your income structure puts you ahead of the vast majority of earners who have no visibility into their structural risk at all.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Understand Your Score"
        sub="Get your income stability score and see exactly where your income is vulnerable — and what one structural change could improve."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
