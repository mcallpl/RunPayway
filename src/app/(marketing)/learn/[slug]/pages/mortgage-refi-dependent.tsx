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
  StickyLearnCTA,
  MetaFooter,
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function MortgageRefiDependent() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Mortgage — Refi Dependent"
        definition="A mortgage broker whose volume depends on refinance activity is structurally tied to interest rate cycles — the one variable they cannot control."
        subtitle="When rates are low, production soars. When rates rise, the pipeline collapses. The income is real. The structure is fragile."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Refinance volume is a direct function of interest rate movement — brokers do not control rates",
          "A 200-basis-point rate increase can reduce refi volume by 60% or more within two quarters",
          "Purchase-focused brokers maintain more consistent pipelines across rate environments",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The structural problem with refi dependency",
            body: (
              <>
                <P>
                  A mortgage broker earning $180,000 annually with 70% of volume from refinance transactions has built an income stream that is structurally coupled to interest rate cycles. When rates drop, homeowners rush to refinance. Lead volume increases, conversion rates improve, and commission income surges. The broker appears to be performing exceptionally well. But the performance is driven primarily by an external variable — the interest rate environment — not by structural characteristics of the broker&apos;s business.
                </P>
                <P>
                  This distinction matters because interest rates are cyclical and beyond the broker&apos;s control. The same rate environment that creates a refinance boom will eventually reverse. When rates rise, the refinance incentive disappears for most homeowners. A borrower who refinanced at 3.5% has no reason to refinance at 5.5%. The pool of eligible and motivated refinance candidates contracts sharply, and the broker&apos;s pipeline contracts with it.
                </P>
                <P>
                  The income stability model identifies this as a structural dependency — income that is tied to an external cyclical variable rather than to the broker&apos;s own client relationships, referral network, or business development capability. The broker&apos;s skill and effort are real, but the structural foundation of the income is rate-dependent, and that dependency drives the score into the lowest ranges.
                </P>
              </>
            ),
          },
          {
            heading: "Why rate dependency produces low scores",
            body: (
              <>
                <P>
                  The model evaluates several structural factors that are particularly unfavorable for refi-dependent brokers. First, refinance transactions are non-recurring — each transaction is a one-time event. The borrower refinances, the commission is paid, and the relationship has no structural mechanism for generating future income. The broker must find a new borrower or wait for the same borrower to have another refinance opportunity, which may not occur for years.
                </P>
                <P>
                  Second, the pipeline has near-zero forward visibility in a rising rate environment. When rates increase, the number of economically motivated refinance candidates drops precipitously. The broker cannot predict when rates will decline again, making forward revenue projection unreliable. This lack of visibility is a significant structural weakness that the model penalizes heavily.
                </P>
                <P>
                  Third, there is no contractual or structural mechanism that protects the broker&apos;s income during a rate-adverse period. Unlike a retainer agreement or a renewal commission, refinance income carries no persistence. When the rate environment shifts, income declines immediately and proportionally. The score range of 15-25 for a heavily refi-dependent broker reflects this combination of non-recurring revenue, external dependency, and zero forward protection.
                </P>
              </>
            ),
          },
          {
            heading: "The contrast with purchase-focused production",
            body: (
              <>
                <P>
                  Purchase mortgage activity is also cyclical, but it is less volatile than refinance activity. People buy homes for life reasons — marriage, children, job relocation, upsizing, downsizing — that are partially independent of interest rate levels. A purchase-focused broker builds relationships with real estate agents, financial planners, and past clients who generate referrals based on life events rather than rate arbitrage. The pipeline is more consistent because the demand drivers are more distributed.
                </P>
                <P>
                  A broker who earns 70% of income from purchase transactions and 30% from refinance activity has a structurally different profile than one with the inverse ratio. The purchase-focused broker will experience some volume reduction when rates rise (because higher rates reduce purchasing power and may cool the housing market), but the decline is typically 15-25% rather than 60%+. The structural floor is higher, and the recovery is faster because purchase demand is driven by demographic and economic factors that do not require low rates.
                </P>
                <P>
                  Adding reverse mortgage origination, commercial lending, or construction lending further diversifies the broker&apos;s income away from any single rate-sensitive product. Each additional product type reduces the structural dependency on the refinance cycle and improves the model&apos;s assessment of the broker&apos;s income resilience across rate environments.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A mortgage broker earning $180,000 annually. Approximately 70% of closed volume ($126,000 in commissions) originates from refinance transactions. The remaining 30% ($54,000) comes from purchase mortgages. The broker has a strong digital lead generation system optimized for rate-sensitive refinance prospects."
        riskExposure="Rate-cycle dependency — 70% of income is structurally tied to interest rate conditions that the broker does not control. Refinance demand is binary: it exists when rates drop and disappears when rates rise. No contractual persistence, no recurring revenue, no forward pipeline visibility in a rising-rate environment."
        disruption="The Federal Reserve raises rates by 200 basis points over 18 months. Refinance applications drop 60% industry-wide as the economic incentive to refinance disappears for most borrowers. The broker's refi income falls from $126,000 to approximately $50,000. Purchase volume declines modestly by 15% due to reduced buyer purchasing power, dropping from $54,000 to $46,000. Total income: approximately $96,000 — a 47% reduction from $180,000."
        scoreRange="15-25 for a broker with 70%+ refi dependency. The score reflects the combination of non-recurring transaction income, external rate dependency, zero forward visibility, and no structural protection against rate-cycle reversal."
        howToFix="Shift the business mix toward purchase mortgages by building referral relationships with real estate agents, financial planners, and past clients. Add product diversification — reverse mortgage origination, commercial lending, or construction lending — to reduce dependency on any single rate-sensitive product. Target a ratio of 60%+ purchase volume to create a structural floor that persists across rate environments."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={15} atRisk={80} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Rates rise 200 basis points in 18 months"
        setup="A mortgage broker earning $180,000 annually with 70% of income from refinance transactions. The broker has built a highly efficient digital lead generation system that captures rate-sensitive refinance prospects. In a low-rate environment, this system produces a steady pipeline of pre-qualified refinance applications."
        risk="The Federal Reserve raises rates by 200 basis points. The economic incentive to refinance disappears for the majority of existing mortgage holders. Refinance application volume drops 60% within two quarters. The broker's lead generation system is still running, but the pool of motivated prospects has contracted to a fraction of its previous size."
        outcome="Refinance commission income falls from $126,000 to approximately $50,000. Purchase income declines modestly to $46,000. Total income drops to $96,000 — a 47% reduction. The broker is working the same hours, running the same systems, and applying the same skill. The rate environment changed, and because the income structure was rate-dependent, the income changed with it."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Refi Volume"
        right="Purchase Pipeline"
        explanation="Refinance volume is a function of interest rate differentials — it surges when rates drop and collapses when rates rise. Purchase pipeline is driven by demographic and life-event demand that persists across rate environments. A broker dependent on refi volume is structurally coupled to a variable they cannot control. A broker with a purchase-dominant pipeline has a structural floor that survives rate-cycle reversals."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A mortgage broker earning $180K in a refi boom is not earning $180K — they are earning whatever the rate cycle allows, and the cycle always turns." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-mortgage-brokers", label: "Income Stability for Mortgage Brokers" },
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/predictable-vs-unpredictable-income", label: "Predictable vs Unpredictable Income" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/structural-income-risk-explained", label: "Structural Income Risk Explained" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Can a refi-dependent broker maintain income when rates rise?",
            a: "Not at the same level unless they have diversified their business mix before rates rise. Some refi volume persists even in higher-rate environments — cash-out refinances, ARM-to-fixed conversions, and divorce-related refinances continue regardless of rate direction. But these represent a fraction of the volume available during a refi boom. The broker who waits until rates rise to diversify faces the worst possible timing: reduced income and a competitive market for purchase business.",
          },
          {
            q: "How quickly does refi volume decline when rates increase?",
            a: "Refinance application volume typically declines within one to two quarters of a meaningful rate increase. A 100-basis-point increase reduces refi volume by approximately 30-40%. A 200-basis-point increase reduces volume by 50-70%. The decline is not linear — it accelerates as the rate differential between existing mortgages and current rates narrows. The speed of the decline leaves little time for structural adjustment.",
          },
          {
            q: "Is purchase lending immune to rate increases?",
            a: "No. Higher rates reduce buyer purchasing power and can cool housing markets, which reduces purchase volume. But the decline in purchase activity is typically 15-25% during rate increases, compared to 50-70% for refinance activity. Purchase demand is driven by life events — people still need to buy homes for reasons unrelated to interest rate optimization. The structural floor for purchase business is significantly higher than for refinance business.",
          },
          {
            q: "What about adding reverse mortgages or commercial lending?",
            a: "Product diversification reduces rate-cycle dependency by adding income streams with different demand drivers. Reverse mortgages are driven by demographic factors (aging population, home equity accumulation) rather than rate direction. Commercial lending is driven by business expansion and investment activity. Each additional product type reduces the broker's structural exposure to residential refinance cycles and widens the range of market conditions under which the broker can produce.",
          },
          {
            q: "Does the model penalize mortgage brokers specifically?",
            a: "The model does not penalize any profession. It evaluates income structure. A mortgage broker with a diversified product mix, strong purchase pipeline, and referral-based business development may score in the 40-55 range — meaningfully higher than a refi-dependent broker. The low score is not about being a mortgage broker. It is about having income structurally coupled to a cyclical external variable with no protective mechanism.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Rate Cycle Exposure"
        sub="Get your income stability score and understand how your refinance dependency affects your structural position across rate environments."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
