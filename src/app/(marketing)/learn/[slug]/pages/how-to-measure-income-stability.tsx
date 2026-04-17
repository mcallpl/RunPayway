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

export default function HowToMeasureIncomeStability() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Methodology"
        title="How to Measure Income Stability"
        definition="Income stability is measured by evaluating six structural dimensions: persistence, diversification, forward visibility, concentration, variability, and labor dependence."
        subtitle="Measurement replaces assumption. Structure replaces intuition."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Six dimensions combine into a single composite score",
          "Same inputs always produce the same result — no subjective judgment",
          "Two identical incomes can produce entirely different scores",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The Six Structural Dimensions",
            body: (
              <>
                <P>
                  Income stability measurement begins with six independent dimensions, each capturing a distinct aspect of how income is built. Persistence evaluates whether income sources have demonstrated continuity over time — a client relationship that has lasted three years carries different weight than one that began last quarter. Diversification measures the number and independence of income sources, assessing whether total earnings depend on many streams or few.
                </P>
                <P>
                  Forward visibility quantifies how far into the future income is contractually committed. An earner with twelve months of signed contracts has materially different forward visibility than one whose income depends entirely on next month&apos;s pipeline. Concentration measures the share of total income attributable to a single source — the higher the concentration, the greater the single-point-of-failure risk.
                </P>
                <P>
                  Variability captures the degree to which income fluctuates from period to period. High variability does not automatically indicate instability, but it increases exposure when combined with other structural weaknesses. Labor dependence measures how tightly income is tied to the earner&apos;s direct time — income that stops when the earner stops working scores lower than income with passive or semi-passive characteristics.
                </P>
              </>
            ),
          },
          {
            heading: "How Dimensions Combine into a Score",
            body: (
              <>
                <P>
                  Each dimension is evaluated independently and contributes to a composite stability score on a 0-100 scale. The dimensions are weighted based on the structural risk they represent. An earner with perfect diversification but zero contractual protection still faces material exposure.
                </P>
                <P>
                  The composite score reflects the interaction between dimensions, not merely their sum. Strong performance on one dimension can partially offset weakness on another, but severe deficiency in any single dimension caps the overall score. An earner with 95% concentration in one client cannot score above the moderate range regardless of how well they perform on other dimensions — the single-source dependency represents a structural ceiling.
                </P>
                <P>
                  This interaction model means the score captures structural reality rather than arithmetic averages. It is possible for two earners with identical average dimension scores to receive different composite scores based on where their strengths and weaknesses concentrate.
                </P>
              </>
            ),
          },
          {
            heading: "What the Score Reveals — and What It Does Not",
            body: (
              <>
                <P>
                  The stability score is a diagnostic measurement of structural resilience. It reveals where income is protected, where it is exposed, and which specific dimensions create the most significant vulnerabilities. It provides a basis for targeted structural improvement — rather than general advice to &quot;diversify,&quot; the dimensional breakdown identifies precisely which type of diversification would have the greatest impact.
                </P>
                <P>
                  The score does not measure earning potential, financial health, or creditworthiness. A low stability score does not mean the earner is financially struggling — it means the earning structure has identifiable concentration risks. A high stability score does not guarantee future income — it indicates that the structural foundations are sound. The score is one dimension of a complete financial picture, not a comprehensive assessment.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={35} recurring={40} atRisk={25} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Two consultants — same income, different structures"
        setup="Consultant A earns $150,000 from one long-term client with a handshake agreement renewed annually. Consultant B earns $150,000 from six clients, each on a signed twelve-month retainer, with no single client exceeding 25% of total revenue."
        risk="Consultant A has maximum concentration risk — 100% of income depends on one relationship with no contractual protection. Consultant B has distributed risk across six independent sources, each contractually committed. If Consultant A loses their client, income drops to zero. If Consultant B loses their largest client, income drops by 25%."
        outcome="RunPayway estimates Consultant A scores 15-22. Consultant B scores 68-74. Identical income. Identical profession. Fundamentally different structural resilience. The measurement captures what tax returns and bank statements cannot: the architecture of the earning itself."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Income Verification"
        right="Income Stability Measurement"
        explanation="Income verification confirms that income existed — it answers 'did this person earn this amount?' Income stability measurement evaluates how income is built — it answers 'is this earning structure likely to persist?' Verification is backward-looking confirmation. Measurement is forward-looking structural analysis. Both are necessary. Neither is sufficient alone."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="You cannot manage structural risk you have not measured. Measurement is the first act of financial clarity." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "What data is needed to measure income stability?",
            a: "The measurement requires information about income sources, their relative contribution to total earnings, contractual terms, duration of each source, payment recurrence patterns, and the degree of labor dependence. It does not require bank statements, tax returns, or account access.",
          },
          {
            q: "Can the score change if I restructure my income?",
            a: "Yes. The score reflects current structure. If you convert a month-to-month client to an annual retainer, add a new income source, or reduce concentration in your largest client, the dimensional inputs change and the score updates accordingly. Structural changes produce score changes.",
          },
          {
            q: "Is the measurement subjective?",
            a: "No. The scoring model uses fixed rules applied to structural inputs. The same inputs always produce the same score. There is no AI in the score calculation, no subjective weighting, and no human judgment. The model is version-locked and deterministic.",
          },
          {
            q: "How often should income stability be measured?",
            a: "Any time your income structure changes materially — gaining or losing a major client, signing or ending a contract, adding a new revenue stream, or experiencing a significant shift in income distribution across sources. For most earners, quarterly or semi-annual measurement captures meaningful structural shifts.",
          },
          {
            q: "Does a high score mean my income is guaranteed?",
            a: "No. A high stability score indicates that your income structure is resilient — diversified, contractually protected, and not concentrated in a single source. It does not guarantee that income will continue. External events can still affect earnings. The score measures structural probability, not certainty.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "Measure Your Six Dimensions", href: "/begin" },
          { text: "See How the Score Works", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Get Your Structural Measurement"
        sub="A diagnostic score across six dimensions of income stability. Fixed rules. No interpretation."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
