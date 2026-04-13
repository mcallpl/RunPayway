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

export default function Is70AGoodScore() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Score Interpretation"
        title="Is 70 a Good Income Stability Score?"
        definition="A score of 70 is in the upper range of Established Stability. It means your income can handle most disruptions — but targeted improvements could push you into High Stability."
        subtitle="Yes — 70 is a strong score. Here's what it means and what's next."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A score of 70 places you in the upper range of Established Stability — well above the median and structurally resilient against most common disruptions",
          "Earners at 70 have built real structural protections: diversified sources, contractual commitments, and meaningful recurring income",
          "The distance from 70 to 75 (High Stability threshold) is short but requires specific structural improvements to cross",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Where 70 sits in the range",
            body: (
              <>
                <P>
                  The RunPayway scoring range spans 0-100, divided into three bands: Developing Stability (30-49), Established Stability (50-74), and High Stability (75-100). A score of 70 places you in the upper quartile of the Established band — 20 points above the Established threshold, 5 points below High Stability, and well above the structural profile of most independent earners.
                </P>
                <P>
                  At 70, the model has identified structural characteristics that indicate genuine resilience: your income is diversified enough that no single source creates catastrophic risk, you have forward visibility through contracts or committed relationships, and you have recurring income that provides a meaningful structural floor. These are not minor achievements — they represent intentional financial architecture that most earners never build.
                </P>
                <P>
                  The question &ldquo;Is 70 a good score?&rdquo; has a clear answer: yes. It means your income structure has been built with attention to the dimensions that matter most — diversification, commitment, recurrence, and labor independence. It is not perfect, and the model will identify specific areas where your structure could be strengthened. But it is a score that reflects real, measurable structural protection.
                </P>
              </>
            ),
          },
          {
            heading: "How it compares to industry baselines",
            body: (
              <>
                <P>
                  While the model does not publish population distribution data, the structural characteristics required to reach 70 are uncommon among independent earners. Most freelancers, consultants, and commission-based professionals begin with scores in the 30s and 40s — concentrated income, no contracts, high labor dependency. Moving to 70 requires building structural protections that most earners know they should have but have not yet implemented.
                </P>
                <P>
                  Within specific industries, a 70 is particularly strong for professions with inherently volatile income structures: real estate agents, freelancers, creative professionals, and project-based consultants. These professions typically have structural baselines in the 30-50 range, making a 70 a significant achievement. For professions with more naturally recurring income — insurance agents with renewal books, financial advisors with AUM fees — a 70 is solid but reflects a structure that could be deepened further.
                </P>
                <P>
                  The comparison that matters most, however, is not against other earners but against your own structural needs. A 70 means your income can absorb most common disruptions. Whether that is sufficient depends on your financial obligations, risk tolerance, and the specific disruptions your profession and market are most likely to produce.
                </P>
              </>
            ),
          },
          {
            heading: "What moves get you to 75+",
            body: (
              <>
                <P>
                  The gap between 70 and 75 is 5 points — a narrow margin that typically requires one or two specific structural improvements rather than a broad overhaul. The model identifies which dimensions are closest to their next scoring threshold, and at 70, the most common improvements needed are: extending contractual commitments from short-term to medium-term (moving from 3-6 month contracts to 12-month agreements), growing recurring income from 20-25% to 30-35% of total earnings, or reducing your largest source from 30-35% to below 25% of total income.
                </P>
                <P>
                  Each of these moves addresses a specific scoring dimension. Longer contracts improve forward visibility. Higher recurring income improves the structural floor. Lower concentration reduces single-source risk. At 70, you do not need to address all three — typically, one or two improvements are sufficient to cross the 75 threshold because your other dimensions are already at or near optimal levels.
                </P>
                <P>
                  The practical timeline for moving from 70 to 75 is typically 6-12 months for earners who identify and execute the specific structural change their score requires. This is not a function of earning more or working harder — it is a function of restructuring how existing income is generated, committed, and protected.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={25} recurring={38} atRisk={37} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Tech contractor with side SaaS at score 70"
        setup="A senior tech contractor earns $210,000 annually. Two long-term enterprise clients provide 75% of income ($157,500) — Client A at 40% on a 12-month contract, Client B at 35% on a 6-month rolling agreement. A side SaaS product generates $52,500 annually (25%) from 350 subscribers at $12.50/month average. The SaaS revenue is fully recurring and labor-independent after initial build."
        risk="Client B declines to renew the 6-month agreement, citing budget cuts. The contractor loses 35% of total income — $73,500 annually — with 6 months notice from the rolling agreement terms."
        outcome="Despite losing the second-largest income source, the contractor retains 65% of pre-disruption income: the 12-month contract with Client A ($84,000 remaining) and the SaaS revenue ($52,500). Combined, this provides $136,500 during the transition period — enough to cover expenses and conduct a measured search for a replacement client. The 6-month notice period from the rolling agreement provides transition time. This is what a 70 looks like under pressure: the disruption is significant but survivable. Growing the SaaS to 30% of income or converting Client B to a 12-month contract would push this profile to 75+."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Good Score (70)"
        right="Great Score (80)"
        explanation="At 70, your income absorbs most common disruptions — the loss of a single client, a short-term market downturn, a brief work stoppage. At 80, your income absorbs uncommon disruptions as well — simultaneous client losses, prolonged market contractions, extended periods without active work. The 10-point difference represents deeper structural protection across every dimension: broader diversification, longer commitments, higher recurring percentage, and greater labor independence. A 70 is good. An 80 is the structure that lets you stop worrying about the next disruption."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Yes, 70 is a good score. It means your income has real structural protection. The next question is whether good is where you want to stop — or whether you want to build toward great." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-a-72-score-means", label: "What a 72 Score Means" },
          { href: "/learn/what-a-50-score-means", label: "What a 50 Score Means" },
          { href: "/learn/what-a-90-score-means", label: "What a 90 Score Means" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/income-stability-index", label: "Income Stability Index" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is 70 above average?",
            a: "The model does not define an average because income structures vary dramatically by profession, career stage, and market. However, the structural characteristics required to reach 70 — diversified sources, contractual commitments, meaningful recurring income — are uncommon among independent earners. Most professionals who have not intentionally structured their income score in the 30-55 range. A 70 reflects deliberate structural architecture.",
          },
          {
            q: "Should I be satisfied with a 70?",
            a: "That depends on your risk tolerance and financial obligations. A 70 means your income can absorb most common disruptions without structural failure. If your financial obligations are modest relative to your income and you have adequate savings, a 70 may provide sufficient structural protection. If you have high fixed expenses, dependents, or low savings, the additional resilience of a 75+ score provides meaningful additional protection.",
          },
          {
            q: "What is the easiest way to get from 70 to 75?",
            a: "The easiest path depends on which structural dimension is closest to its next threshold. Common moves: extend your shortest contract from 3-6 months to 12 months, grow recurring income by 5-10 percentage points of total earnings, or add one diversified income source that reduces your largest source below 25%. Your assessment report identifies which specific dimension offers the most efficient path to improvement.",
          },
          {
            q: "Can my score drop from 70?",
            a: "Yes. The score reflects current structural characteristics. If a contract expires without renewal, a client relationship ends, recurring revenue declines, or diversification erodes, the score will decrease accordingly. A score of 70 must be maintained through ongoing structural discipline — it is not a permanent designation.",
          },
          {
            q: "How does a 70 compare to having a good credit score?",
            a: "They measure entirely different things. A credit score measures your history of repaying borrowed money — it reflects past behavior with debt. An income stability score measures how your income is structured today — it reflects current architecture. A high credit score does not protect you from income disruption. A high income stability score does not guarantee creditworthiness. They are complementary measures of different financial dimensions.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Score Your Income Structure", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Find Out Your Score"
        sub="Get your income stability score and see exactly where your structure stands — and what it would take to move from good to great."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
