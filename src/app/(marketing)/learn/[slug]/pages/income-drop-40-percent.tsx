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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function IncomeDrop40Percent() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Income Drop 40%"
        definition="A 40% income drop exposes every structural weakness simultaneously. Whether it comes from a client loss, market shift, or personal disruption — the structural response depends entirely on how income was built before the drop."
        subtitle="The severity of an income disruption is determined by the structure that existed before the disruption occurred."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A 40% drop from a well-structured profile is recoverable — a 40% drop from a fragile profile can be terminal",
          "Which income is lost matters more than how much — losing protected income is structurally different from losing at-risk income",
          "The score after disruption reveals the structural floor that was always present but invisible during normal conditions",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Why the same percentage drop produces different outcomes",
            body: (
              <>
                <P>
                  A $200,000 earner who loses 40% of income retains $120,000. That number is identical regardless of how the income was structured before the drop. But the structural implications are radically different depending on which $80,000 was lost and what characteristics the remaining $120,000 carries. This is the core insight the model provides: the same income event produces fundamentally different structural outcomes depending on the pre-existing income architecture.
                </P>
                <P>
                  Consider two $200,000 earners. Earner A has five income sources with contractual protections, no source exceeding 30% of total, and 40% of income classified as protected recurring revenue. Earner B has two income sources with no contracts, one source at 65%, and zero protected recurring revenue. Both lose 40%. Earner A&apos;s remaining $120,000 retains its diversification, contractual protection, and recurring characteristics — the structural quality of the remaining income is preserved. Earner B likely lost the larger source entirely, leaving a single remaining source with no structural protection.
                </P>
                <P>
                  The model scores these post-disruption profiles very differently. Earner A drops from approximately 65 to 45 — a significant decline but still in the moderate range with clear structural assets to rebuild from. Earner B drops from approximately 35 to 12 — entering the critical range where the remaining income lacks the structural characteristics to support recovery. The percentage lost is identical. The structural outcome is not comparable.
                </P>
              </>
            ),
          },
          {
            heading: "Identifying which income is most vulnerable",
            body: (
              <>
                <P>
                  The model categorizes income into three structural tiers based on vulnerability to disruption. Protected income — contractual, recurring, with termination protections — is the most resistant to external events. Moderate-risk income — recurring but without strong contracts, or contractual but from a single source — is vulnerable to specific disruption types. At-risk income — project-based, performance-dependent, platform-controlled, or single-source — is the most likely to be lost in a disruption event.
                </P>
                <P>
                  In a 40% income drop scenario, the at-risk income is almost always the first to disappear. Clients who are not under contract leave first. Performance-based income declines when markets slow. Platform-dependent income drops when algorithms change. The protected income — retainer agreements, long-term contracts, recurring subscription revenue — tends to persist through the disruption. This creates a natural selection process where the structural quality of the remaining income is determined by how much protected income existed before the event.
                </P>
                <P>
                  The practical implication is that building protected income before a disruption occurs is the most effective structural defense against income drops of any magnitude. A professional who converts 40% of their income from at-risk to protected has not changed their total income or their day-to-day financial experience. But they have fundamentally changed the structural floor that will be revealed when a disruption occurs. The model measures this floor as the single most important structural characteristic of any income profile.
                </P>
              </>
            ),
          },
          {
            heading: "Rebuilding after a 40% disruption",
            body: (
              <>
                <P>
                  The rebuilding timeline after a 40% income drop depends on the structural characteristics of the remaining income and the earner&apos;s capacity to add new sources. For a well-structured profile that dropped from 65 to 45, the remaining income provides a stable base from which to rebuild. The diversification, contracts, and recurring revenue that survived the disruption continue to generate income while the earner replaces the lost sources. Typical recovery timelines for well-structured profiles are 6-12 months to return to 80% of pre-disruption income.
                </P>
                <P>
                  For a fragile profile that dropped from 35 to 12, the rebuilding challenge is qualitatively different. The remaining income may be a single source with no structural protections — meaning the earner is rebuilding from a position of maximum vulnerability. Any additional disruption during the recovery period could eliminate the remaining income entirely. Recovery timelines for fragile profiles are typically 12-24 months, and the recovery often results in a structurally different income configuration than the original because the earner is forced to build from scratch.
                </P>
                <P>
                  The model&apos;s recommendation for any earner is to build the structural characteristics that determine post-disruption resilience before the disruption occurs. Converting at-risk income to protected income, diversifying sources, and locking contractual commitments does not change the probability of a disruption — but it fundamentally changes the structural outcome when one occurs. An earner who spends 18 months improving their structural score from 35 to 55 has not made their income higher, but they have made a 40% disruption survivable rather than catastrophic.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A professional earning $200,000 annually loses 40%, retaining $120,000. The analysis examines two structural profiles: Profile A (well-structured: five sources, no source exceeding 30%, 40% protected recurring) and Profile B (fragile: two sources, largest at 65%, zero protected recurring)."
        riskExposure="Depends on which 40% is lost. Profile A loses at-risk income while protected income persists — the structural floor holds. Profile B loses its largest source entirely — the structural floor collapses. The risk is not the percentage lost but the structural characteristics of the income that remains."
        disruption="The largest client or income source contracts or terminates. Market conditions slow project-based work. The 40% loss occurs over 60-90 days as multiple factors compound. Profile A retains its diversified, protected base. Profile B retains only the smaller, unprotected source."
        scoreRange="Profile A: drops from 65 to 45, remaining in moderate range with clear recovery path. Profile B: drops from 35 to 12, entering critical range with limited structural assets for recovery. The 33-point gap in post-disruption scores illustrates the structural difference that pre-disruption architecture creates."
        howToFix="Rebuild diversification by adding new sources to replace lost income. Lock remaining clients and income sources with forward contracts. Add one new source with contractual protection within 90 days. For Profile B: prioritize structural improvements over income recovery — a $90,000 income with three protected sources is structurally stronger than rushing back to $200,000 with the same fragile configuration."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={25} recurring={30} atRisk={45} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Two profiles, same drop, different outcomes"
        setup="Two professionals each earning $200,000. Profile A: five sources, diversified, 40% protected recurring. Profile B: two sources, 65/35 split, zero contracts. Both experience a 40% income drop ($80,000 lost) over 90 days."
        risk="Profile A loses its two smallest, least-protected sources ($40,000 each). Three protected sources totaling $120,000 continue uninterrupted. Profile B loses its larger source ($130,000). Only the smaller source ($70,000) remains — but the total lost exceeds 40% because the source was indivisible. Actual loss: 65%."
        outcome="Profile A retains $120,000 from three diversified, protected sources. Score drops from 65 to 45. Recovery timeline: 6-9 months. Profile B retains $70,000 from one unprotected source. Score drops from 35 to 15. Recovery timeline: 18-24 months. The same economic environment produced a manageable disruption for one and a structural crisis for the other. The difference was entirely determined by pre-disruption income architecture."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Income Amount Lost"
        right="Structure Remaining"
        explanation="Income amount lost is a dollar figure — it tells you the magnitude of the disruption. Structure remaining is a quality assessment — it tells you the characteristics of the income that survived. A $200,000 earner who loses $80,000 of at-risk income and retains $120,000 of protected recurring income has a fundamentally different position than one who loses $80,000 of protected income and retains $120,000 of at-risk income. The model measures what remains and how it is structured, not just how much was lost."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A 40% income drop does not reveal new information. It reveals information that was always there — hidden by the absence of disruption. The structural floor was always your real income. The disruption simply made it visible." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
          { href: "/learn/income-stress-testing-explained", label: "Income Stress Testing Explained" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/structural-income-risk-explained", label: "Structural Income Risk Explained" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is a 40% income drop survivable?",
            a: "It depends entirely on pre-disruption structure. For a well-diversified profile with protected recurring income, a 40% drop is significant but manageable — the remaining 60% provides a stable base for recovery. For a concentrated, unprotected profile, a 40% drop can be structurally catastrophic because the loss may eliminate the dominant income source entirely, leaving the earner with whatever secondary income existed. The model's score before the disruption is the best predictor of post-disruption survivability.",
          },
          {
            q: "How does the model calculate the post-disruption score?",
            a: "The model evaluates the structural characteristics of the remaining income using the same methodology applied to any income profile: source diversification, contractual protection, recurrence pattern, and concentration. Income that was lost is removed from the profile entirely. The remaining income is scored on its own structural merits. This is why building protected income matters — it determines the quality of the post-disruption profile, which determines the score, recovery timeline, and financial resilience.",
          },
          {
            q: "Should I prioritize income recovery or structural improvement after a drop?",
            a: "Structural improvement. The natural instinct after income loss is to replace the lost dollars as quickly as possible. But if the replacement income has the same structural weaknesses as the income that was lost — no contracts, single-source dependency, at-risk characteristics — the earner has rebuilt the same fragile configuration that failed. The model recommends rebuilding with structural improvements: add contracts, diversify sources, build recurring revenue. A lower total with better structure is more resilient than a higher total with the same fragility.",
          },
          {
            q: "Can the model predict which income sources will be lost in a disruption?",
            a: "The model does not predict specific events, but it identifies structural vulnerabilities that determine which income is most likely to be affected. Income without contractual protection, income from a single source, income dependent on external platforms, and income tied to discretionary spending are structurally more vulnerable to disruption than contracted, diversified, owned, and essential-service income. The model's risk categorization indicates which income is most exposed, even though it cannot predict the timing or nature of the disruption.",
          },
          {
            q: "What score should I target to survive a 40% drop?",
            a: "A pre-disruption score of 55-65 typically produces a post-disruption score in the 35-45 range after a 40% income loss — still in the moderate zone with clear structural assets for recovery. Scores below 40 pre-disruption often drop into the critical range (below 20) after a 40% loss, where recovery becomes structurally challenging. The model suggests that building to a pre-disruption score above 55 provides meaningful resilience against income disruptions up to 40%.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Structural Floor"
        sub="Get your income stability score and understand what your income structure looks like after disruption — before the disruption occurs."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
