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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityMortgageBrokers() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Mortgage Brokers"
        definition="Mortgage income is transaction-based and rate-sensitive. When rates shift, pipeline and volume shift with them — often dramatically."
        subtitle="Why mortgage brokers face structural income volatility that earnings alone cannot reflect."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Origination fees are one-time, non-recurring income events",
          "Rate movements can shift volume 40-60% in a single quarter",
          "Most mortgage brokers score between 20 and 35 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How mortgage broker income works",
            body: (
              <>
                <P>
                  Mortgage brokers earn primarily through origination fees — compensation paid when a loan closes. This typically ranges from 1% to 2.75% of the loan amount, depending on the product, lender, and borrower profile. On a $400,000 mortgage, the broker&apos;s gross compensation is approximately $4,000 to $11,000 per transaction before operating expenses.
                </P>
                <P>
                  Volume is the primary lever. A broker closing 8 to 12 loans per month in a favorable rate environment may earn $400,000 or more annually. But this income is entirely transaction-dependent. There is no recurring component, no renewal trail, and no contractual claim on future business. Each month starts at zero, and the broker must generate new pipeline to produce new income.
                </P>
                <P>
                  The critical structural feature of mortgage income is its sensitivity to interest rates. When rates decline, refinance volume surges and purchase activity often remains stable or increases. When rates rise, refinance volume collapses — often by 60% to 80% — and purchase volume contracts as affordability tightens. The broker&apos;s income is directly coupled to macroeconomic conditions they cannot influence or predict with precision.
                </P>
              </>
            ),
          },
          {
            heading: "Why rate cycle dependency compresses scores",
            body: (
              <>
                <P>
                  The fundamental challenge for mortgage broker stability is that income depends on a variable — interest rates — that is exogenous and cyclical. A broker cannot diversify away from rate sensitivity the way an insurance agent can build a renewal book or a consultant can secure retainers. The core product is rate-dependent by definition.
                </P>
                <P>
                  This creates an income pattern that follows macro cycles rather than individual performance. During a refinance boom, mediocre brokers earn well. During a rate tightening cycle, excellent brokers struggle. The correlation between personal effort and income outcome weakens significantly when rates move against volume. This decoupling of effort from result is a structural vulnerability that stability scoring captures.
                </P>
                <P>
                  Additionally, the competitive landscape shifts with rates. When volume contracts, more brokers compete for fewer transactions. Margins compress as brokers reduce fees to win business. The broker not only closes fewer loans but earns less per loan. This double compression — fewer transactions at lower compensation — accelerates income decline during adverse rate environments.
                </P>
              </>
            ),
          },
          {
            heading: "What brokers can do to improve resilience",
            body: (
              <>
                <P>
                  The most impactful structural improvement is developing a purchase-focused business model. Purchase transactions are less rate-sensitive than refinances because home purchases are driven by life events — relocations, family changes, first-time buying — that occur regardless of the rate environment. A broker whose pipeline is 70% purchase-based will experience less volume volatility than one whose pipeline is 70% refinance.
                </P>
                <P>
                  Referral network depth also matters. Brokers with deep relationships across multiple real estate offices, financial advisors, and builders have more diversified deal flow sources. If one referral partner slows, others may compensate. A broker dependent on a single referral source faces concentration risk on top of rate cycle risk.
                </P>
                <P>
                  Some brokers add adjacent revenue streams — real estate investment consulting, loan servicing fees, or financial planning referral arrangements — to create income that does not depend on origination volume. These additions do not eliminate rate sensitivity, but they create a partial floor that reduces the severity of cyclical downturns.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Mortgage Brokerage"
        howIncomeWorks="Origination fees paid at loan closing, typically 1-2.75% of the loan amount. Income is entirely transaction-based with no recurring component. Volume depends heavily on interest rate environment — refinance surges in low-rate periods and collapses when rates rise. Purchase volume is more stable but still rate-influenced through affordability constraints."
        typicalRange="20-35. Brokers with purchase-heavy pipelines and diversified referral networks score toward the upper range. Brokers dependent on refinance volume or concentrated in a single referral source score toward the lower range. Rate cycle position at the time of assessment does not change the structural score — the model evaluates the income architecture, not the current environment."
        biggestRisk="Rate cycle dependency. Mortgage income is structurally coupled to interest rate movements that the broker cannot control, predict, or hedge. A 200-basis-point rate increase can reduce volume 50-70% across an entire market. No amount of skill, hustle, or marketing can fully offset a macro contraction in origination volume."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={15} atRisk={80} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Refi-boom broker meets rising rates"
        setup="Mortgage broker built their business during a sustained low-rate environment. Closing 10-14 loans per month, 65% refinance volume. Annual income reached $380,000. Business model optimized for refi processing speed and volume capacity."
        risk="Rates rise 200 basis points over 18 months. Refinance volume drops 72%. Purchase volume contracts 20% as affordability tightens. The broker's monthly closings fall from 12 to 4. Per-loan compensation also decreases as competitive pressure intensifies."
        outcome="Annual income drops from $380,000 to approximately $110,000 — a 71% decline. The broker's infrastructure, staffing, and overhead were built for the higher volume. Estimated stability score: 18-26. The income was real, but the structure was entirely rate-dependent."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Volume"
        right="Resilience"
        explanation="Volume measures how many loans close in a given period. Resilience measures how much of that volume survives a rate shift. A broker closing 14 loans per month in a refi boom has high volume but may have low resilience if 65% of that volume depends on rates staying low. A broker closing 6 loans per month — all purchase transactions from diversified referral sources — has lower volume but significantly higher structural resilience."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="The rate environment giveth and the rate environment taketh away. What looks like a thriving business at 3.5% can be a struggling one at 5.5% — with no change in skill or effort." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-real-estate-agents", label: "Income Stability for Real Estate Agents" },
          { href: "/learn/income-stability-sales-professionals", label: "Income Stability for Sales Professionals" },
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I focus on purchase loans — does that help my score?",
            a: "Yes. Purchase transactions are driven by life events that occur across rate environments, making them structurally less volatile than refinances. A purchase-heavy pipeline typically scores higher because it is less coupled to rate movements. However, purchase volume still contracts during severe rate increases due to affordability constraints, so it is not fully insulated.",
          },
          {
            q: "Does having a large database of past clients improve stability?",
            a: "A database creates future opportunity but not structural protection. Past clients may refinance or purchase again, but there is no contractual obligation for them to return. A large database improves the probability of future transactions but does not create the certainty that stability scoring measures. It is a lead source, not a revenue guarantee.",
          },
          {
            q: "How do I score higher as a mortgage broker?",
            a: "Shift toward purchase-focused business, diversify referral sources so no single partner represents more than 25% of deal flow, and consider adjacent revenue streams that are not origination-dependent. Some brokers add financial advisory referral fees, real estate investment consulting, or loan servicing arrangements to create income channels that do not depend on rate-driven volume.",
          },
          {
            q: "Is 20-35 the normal range for mortgage brokers?",
            a: "Yes. The transaction-based, rate-sensitive nature of mortgage income places most brokers in this range. Scores above 35 typically require significant purchase-market focus, diversified referral networks, and at least one income stream that is not origination-dependent. The structural ceiling is lower than professions with recurring revenue components.",
          },
          {
            q: "Does my income during a boom year reflect my real stability?",
            a: "No. A boom-year income reflects volume under favorable conditions. Stability measures the structural architecture of your income — what survives when conditions change. A broker earning $400,000 during a refi boom and $120,000 during a rate tightening cycle has an income structure that is highly volatile regardless of the peak number.",
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
