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

export default function IncomeStabilityVsCreditScore() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Comparison"
        title="Income Stability vs Credit Score"
        definition="Credit scores measure borrowing behavior. Income stability measures how income is built. They evaluate different dimensions of financial health."
        subtitle="Two measurements. Two questions. Neither answers both."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Credit scores evaluate repayment history, not income structure",
          "A 780 credit score says nothing about income resilience",
          "Income stability fills the gap that credit scoring cannot reach",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What Each Measurement Captures",
            body: (
              <>
                <P>
                  A credit score is a measure of borrowing behavior. It evaluates whether an individual has repaid debts on time, how much available credit they use, the length of their credit history, the diversity of their credit accounts, and the recency of new credit inquiries. It answers one question: based on past behavior, how likely is this person to repay borrowed money?
                </P>
                <P>
                  An income stability score is a measure of earning structure. It evaluates how income is built — how many sources contribute, whether those sources are contractually protected, how concentrated earnings are in a single client or channel, and how far into the future income is committed. It answers a different question: based on current structure, how likely is this person&apos;s income to persist under adverse conditions?
                </P>
                <P>
                  These are fundamentally different instruments measuring fundamentally different things. A credit score evaluates behavior with borrowed money. An income stability score evaluates the architecture of earned money. One looks at the liability side of a financial profile. The other looks at the income side. Neither captures the full picture alone.
                </P>
              </>
            ),
          },
          {
            heading: "Why Both Matter",
            body: (
              <>
                <P>
                  Credit scores became the dominant financial metric because they solved a real problem: how to assess lending risk at scale. Before standardized credit scoring, lending decisions relied on personal relationships and subjective judgment. Credit scores introduced consistency, scalability, and measurable accuracy to the lending process.
                </P>
                <P>
                  But credit scores were designed for an economy where income was predominantly salaried. When most earners received a predictable paycheck from a single employer, income structure was relatively uniform. The relevant variable was behavior — did the borrower manage their obligations responsibly? In that context, credit scores were sufficient.
                </P>
                <P>
                  The modern economy has changed. An estimated 36% of the U.S. workforce now earns through non-traditional arrangements — freelancing, consulting, gig work, portfolio income, and hybrid models. In this environment, income structure varies enormously. Two earners with identical credit scores and identical incomes can have radically different structural resilience. Credit scores cannot detect this difference. Income stability measurement can.
                </P>
              </>
            ),
          },
          {
            heading: "The Gap Between Them",
            body: (
              <>
                <P>
                  The gap between credit scoring and income stability measurement creates real-world consequences. A freelancer with a 780 credit score and $200,000 in annual income appears financially strong by conventional metrics. But if 85% of that income comes from a single client with no contract, the structural reality is precarious. The credit score reflects disciplined past behavior. It says nothing about whether the income that enabled that behavior is likely to continue.
                </P>
                <P>
                  This gap is invisible to most financial decision-making frameworks. Mortgage underwriting, insurance assessments, and business lending all rely heavily on credit scores and income verification. Neither instrument evaluates income durability. The result is a systematic blind spot: structurally fragile earners are approved for obligations their income may not sustain, while structurally resilient earners with lower raw income may be underserved.
                </P>
                <P>
                  Income stability measurement does not replace credit scoring. It addresses the dimension that credit scoring was never designed to capture. Together, they provide a materially more complete picture of financial resilience than either provides alone.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={15} recurring={25} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="780 credit score, 28 stability score"
        setup="A marketing consultant earns $190,000 annually. She has a 780 credit score with fifteen years of on-time payments, low utilization, and diverse credit accounts. Her income comes from two clients — one contributing 70% of revenue on a quarterly verbal renewal, the other contributing 30% on a month-to-month basis. No signed contracts."
        risk="By credit metrics, she is an excellent financial profile. By income structure metrics, she has severe concentration risk and zero contractual protection. If her primary client churns, $133,000 in annual income disappears with no contractual recourse and no replacement pipeline. Her credit score will remain 780 for months after the income loss — it is a lagging indicator of a structural event it was never designed to detect."
        outcome="RunPayway estimates a stability score of 22-28. The credit score and stability score tell opposite stories about the same person. Neither is wrong. They measure different things. A complete assessment requires both."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Credit Risk"
        right="Income Risk"
        explanation="Credit risk measures the probability of default on borrowed obligations. Income risk measures the probability of income disruption based on structural exposure. An individual can have minimal credit risk and maximum income risk simultaneously. These are independent dimensions of financial health."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A credit score tells you how someone managed yesterday's money. It tells you nothing about whether tomorrow's money will arrive." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does income stability affect my credit score?",
            a: "Not directly. Credit scores are calculated from credit bureau data — payment history, utilization, account age, and inquiries. Income stability is not an input to credit scoring models. However, income disruption can indirectly affect credit scores if it leads to missed payments or increased utilization over time.",
          },
          {
            q: "Can I have a good credit score and a bad stability score?",
            a: "Yes. This is common. Credit scores reflect years of accumulated payment behavior. Income stability reflects current structural conditions. A person who has always paid on time but earns 90% of their income from one client with no contract will have a strong credit score and a weak stability score. The credit score reflects past discipline. The stability score reflects present exposure.",
          },
          {
            q: "Do lenders look at income stability?",
            a: "Most do not — yet. Current lending frameworks rely on credit scores, income verification, and debt-to-income ratios. None of these instruments evaluate income structure. As the share of non-traditional earners grows, the gap between what lenders measure and what determines repayment capacity is widening.",
          },
          {
            q: "Which metric is more important?",
            a: "Neither is more important. They measure different things. A credit score is essential for understanding borrowing behavior. An income stability score is essential for understanding earning resilience. Asking which is more important is like asking whether blood pressure or cholesterol is more important — they are independent measurements of different risk factors.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See What Credit Scores Miss", href: "/begin" },
          { text: "Measure Your Income Structure", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure the Dimension Credit Scores Miss"
        sub="Your credit score measures behavior. Your stability score measures structure. Get both sides of the picture."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
