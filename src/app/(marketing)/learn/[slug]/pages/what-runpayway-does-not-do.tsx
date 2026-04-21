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

export default function WhatRunPaywayDoesNotDo() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="BOUNDARIES"
        title="What RunPayway™ Does Not Do"
        definition="RunPayway™ is a measurement system — not a financial product, advisory service, or predictive tool. Understanding its boundaries is as important as understanding its capabilities."
        subtitle="Knowing what the model measures is only half the picture. Knowing what it doesn't is the other half."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "RunPayway measures income structure — it does not provide financial advice, investment recommendations, or product suggestions",
          "The score reflects your current structural state — it does not predict future income, market conditions, or financial outcomes",
          "The model applies fixed rules to reported inputs — no human judgment, no AI in scoring, no adaptive learning influences your score",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Not financial advice",
            body: (
              <>
                <P>
                  RunPayway measures income structure. It identifies how your income is built — the sources, their diversification, their contractual commitments, their recurrence, and their labor dependency. It does not recommend financial products, suggest investments, advise on tax strategy, or tell you what to do with your money. The score is a structural measurement, not a prescription.
                </P>
                <P>
                  When the model identifies that your income is concentrated in a single source, it is measuring a structural characteristic — not advising you to diversify. When it identifies low recurring income, it is quantifying a structural dimension — not recommending you build passive income streams. The distinction matters because financial advice requires understanding your complete financial picture: goals, obligations, risk tolerance, tax situation, family circumstances, and more. The model measures one dimension — income structure — and does not have access to or consider any other financial information.
                </P>
                <P>
                  Users should treat the score as one input among many in their financial decision-making — not as a directive. A financial advisor, tax professional, or other qualified professional is the appropriate source for advice on what actions to take based on structural insights the model provides.
                </P>
              </>
            ),
          },
          {
            heading: "Not a prediction",
            body: (
              <>
                <P>
                  RunPayway measures your income structure as it exists today. It does not predict what your income will be next month, next quarter, or next year. It does not forecast market conditions, client behavior, industry trends, or economic cycles. The score is a snapshot of current structural characteristics — a measurement of how your income is built at the time of assessment.
                </P>
                <P>
                  A score of 72 does not mean your income will remain stable. It means your income is currently structured in a way that can absorb most common disruptions. Whether those disruptions actually occur, and whether new disruptions emerge that the structure was not designed to handle, are questions the model does not and cannot answer. The model measures structural resilience — the capacity to absorb disruption — not the probability that disruption will occur.
                </P>
                <P>
                  This distinction is critical because users may be tempted to interpret a high score as a guarantee of financial continuity. It is not. A high score means the structural architecture is sound. Whether the architecture is tested, and how severely, depends on events the model does not attempt to predict. The score tells you how your income is built. It does not tell you what will happen to it.
                </P>
              </>
            ),
          },
          {
            heading: "Not subjective",
            body: (
              <>
                <P>
                  RunPayway applies fixed rules to the inputs you provide. There is no human reviewer who adjusts your score based on qualitative factors. There is no AI in the scoring calculation. There is no adaptive learning system that changes how your inputs are weighted based on aggregate user data. The model is deterministic: the same inputs under the same version always produce the same score.
                </P>
                <P>
                  This objectivity is a design choice, not a limitation. Subjective assessment introduces variability — two reviewers might evaluate the same income structure differently. Adaptive learning introduces instability — the same inputs might produce different scores as the model &ldquo;learns&rdquo; from new data. RunPayway eliminates both sources of variability by using fixed, version-locked rules applied identically to every assessment.
                </P>
                <P>
                  The trade-off is that the model cannot account for qualitative factors that a human advisor might consider: the strength of a client relationship, the reputation of an employer, the growth trajectory of an industry. These factors matter — they are simply outside the model&apos;s measurement scope. The model measures what can be quantified structurally. Everything else is left to the earner&apos;s judgment and their professional advisors.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={33} recurring={34} atRisk={33} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Using the score correctly"
        setup="A real estate agent receives a RunPayway score of 58 with the assessment identifying concentration in transaction-based commission income and limited recurring revenue. The agent is considering whether to invest in rental property, shift toward property management, or focus on growing transaction volume."
        risk="The agent interprets the score as advice to buy rental property because the model identified low recurring income. This would be treating the structural measurement as a financial recommendation — which it is not. The model does not know the agent's savings, debt, risk tolerance, market conditions, or investment experience."
        outcome="The correct use of the score: treat it as a structural snapshot that identifies where the income architecture has exposure. The agent now knows that recurring income is a structural weakness. What to do about it — rental property, property management fees, referral partnerships, or something else entirely — is a decision that should involve financial planning, market analysis, and professional advice. The model provides the measurement. The decision is the earner's."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="What It Measures"
        right="What It Doesn't"
        explanation="RunPayway measures: income source diversification, contractual commitment duration, recurring vs non-recurring income ratio, labor dependency, forward visibility, and structural resilience under disruption scenarios. RunPayway does not measure: savings, net worth, debt, expenses, tax efficiency, investment returns, credit history, insurance coverage, retirement readiness, or financial goals. The model measures one dimension of financial health — income structure — with precision. It does not attempt to measure the many other dimensions that together constitute a complete financial picture."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The score tells you how your income is built. What you do with that information is yours to decide." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/model-governance", label: "Model Governance" },
          { href: "/learn/how-versioning-works", label: "How Versioning Works" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is RunPayway a financial advisor?",
            a: "No. RunPayway is a measurement system that produces a structural score based on reported income characteristics. It does not provide advice, recommendations, or guidance on financial decisions. The score is an input for your decision-making, not a substitute for professional financial advice.",
          },
          {
            q: "Can the score predict if I will lose income?",
            a: "No. The score measures your current income structure — how diversified, committed, recurring, and labor-independent your income is. It does not predict future events, client behavior, market conditions, or income changes. A high score means your structure is resilient to disruption, not that disruption will not occur.",
          },
          {
            q: "Does RunPayway use AI to interpret my answers?",
            a: "Your score is calculated using fixed, deterministic rules. No AI, no machine learning, and no adaptive weighting. The same inputs under the same version always produce the same score. AI is used only in clearly labeled narrative sections of the report (PressureMap, Plain English, Action Plan) — never in the score itself.",
          },
          {
            q: "Should I make financial decisions based on my score?",
            a: "Your score is one input among many for financial decision-making. It tells you how your income is structured — a dimension that most financial tools do not measure. Use it alongside your savings, expenses, goals, risk tolerance, and the advice of qualified professionals to make informed decisions. Do not treat it as a standalone directive.",
          },
          {
            q: "What does RunPayway do, then?",
            a: "RunPayway measures income structure. It quantifies how your income is diversified, committed, recurring, and labor-dependent. It produces a score that reflects the structural resilience of your income — its capacity to absorb disruption without failure. It gives you visibility into a dimension of financial health that is typically invisible: not how much you earn, but how your earnings are built.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Income Structure"
        sub="Get your income stability score — a structural measurement of how your income is built, not a prediction of where it's going."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
