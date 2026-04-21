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

export default function SmallBusinessSeasonalRisk() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Small Business — Seasonal Risk"
        definition="A business that earns 60% of annual revenue in a 3-month window operates on a fundamentally different risk profile than one with even monthly distribution."
        subtitle="Seasonal concentration is structural risk disguised as a business model. This analysis explains the measurement."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "A 3-month earning window means 9 months of cash depletion against fixed costs that do not pause",
          "Weather dependency adds an uncontrollable variable to an already concentrated timeline",
          "One disrupted season can eliminate the entire annual profit margin",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Seasonal concentration as structural fragility",
            body: (
              <>
                <P>
                  A landscaping business earning $250,000 annually with 65% of that revenue concentrated between May and August is structurally different from a business earning the same amount distributed evenly across twelve months. The $162,500 earned in four months must fund the remaining eight months of operations — equipment payments, insurance premiums, vehicle costs, crew retention, and the owner&apos;s personal financial obligations. These costs do not reduce proportionally during the off-season.
                </P>
                <P>
                  The income stability model treats seasonal concentration as a form of temporal concentration risk — analogous to client concentration but measured across time rather than sources. A business that earns 65% of revenue in 33% of the year has effectively the same structural exposure as a consultant who earns 65% of income from a single client. The loss or disruption of that concentrated period eliminates the majority of annual income in a single event.
                </P>
                <P>
                  The critical distinction is that seasonal businesses cannot replace a lost season the way a consultant can replace a lost client. If May through August underperforms, there is no mechanism to recover that revenue in September. The earning window is fixed by external conditions — weather, daylight hours, customer demand patterns — that the business cannot influence. This makes seasonal concentration risk structurally more rigid than client concentration risk.
                </P>
              </>
            ),
          },
          {
            heading: "The compounding effect of weather dependency",
            body: (
              <>
                <P>
                  Weather-dependent businesses operate within a narrower margin of viability than most business owners recognize. A landscaping operation in the northeastern United States has approximately 16-20 viable working weeks between May and August. An unusually wet summer — defined as rainfall 30% above average — can eliminate 4-6 of those weeks through direct work cancellations and delayed project timelines. That represents a 25-35% reduction in the available earning window.
                </P>
                <P>
                  The financial impact is not proportional to the time lost. When a landscaping crew cannot work, the business still incurs crew wages (if retaining seasonal workers), equipment lease payments, insurance premiums, and vehicle costs. A six-week disruption does not reduce costs by six weeks — it reduces revenue by six weeks while costs continue at approximately 40-60% of their normal rate. The margin compression is severe because the business model assumes full utilization of the seasonal window.
                </P>
                <P>
                  Climate variability has increased the frequency of disrupted seasons over the past decade, making historical weather patterns a less reliable predictor of future seasonal performance. A business that operated successfully for fifteen years under historical weather norms may find that the underlying assumptions about seasonal duration and reliability no longer hold. The model accounts for this by treating weather-dependent seasonal income as carrying higher volatility than non-weather-dependent seasonal income.
                </P>
              </>
            ),
          },
          {
            heading: "Structural responses to seasonal concentration",
            body: (
              <>
                <P>
                  The most direct structural response to seasonal concentration is counter-seasonal diversification — adding revenue streams that perform during the off-season months. For a landscaping business, the canonical example is snow removal services during December through March. This does not eliminate seasonality, but it creates a second earning window that reduces the dependency on the primary season. A business earning 50% in summer and 30% in winter has meaningfully better distribution than one earning 65% in summer alone.
                </P>
                <P>
                  Annual maintenance contracts represent a structural upgrade independent of seasonal diversification. A contract that pays $500 per month for twelve months — covering spring cleanup, summer maintenance, fall preparation, and winter monitoring — converts seasonal project revenue into year-round recurring revenue. Ten such contracts generate $60,000 annually with even monthly distribution. This income is contractual, recurring, and not weather-dependent, directly addressing all three structural weaknesses of seasonal concentration.
                </P>
                <P>
                  The combination of counter-seasonal services and annual contracts can transform the income profile from a 65/35 seasonal split to a more balanced distribution where no single quarter represents more than 35% of annual revenue. The model scores this transformation as a significant structural improvement — typically adding 15-25 points to the stability score — because it addresses concentration, recurrence, and weather dependency simultaneously.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A landscaping business earning $250,000 annually. Approximately 65% of revenue ($162,500) is earned between May and August. The remaining 35% is distributed across spring preparation (April) and fall cleanup (September-October). November through March generates near-zero revenue. The business carries year-round fixed costs of approximately $8,500 per month: equipment leases, insurance, vehicle payments, and crew retention bonuses."
        riskExposure="Weather dependency — primary revenue is contingent on conditions outside the business owner's control. Off-season cash drain — $8,500 monthly in fixed costs continues for five months with near-zero revenue, consuming $42,500 annually. Seasonal concentration — 65% of annual revenue is compressed into a 4-month window with no mechanism to recover lost production time."
        disruption="An unusually wet summer cuts the effective season by 6 weeks. Crew utilization drops from 90% to 55% during the affected period. Revenue for the May-August window falls from $162,500 to approximately $105,000 — a $57,500 shortfall. Fixed costs continue unchanged. The annual profit margin, typically $45,000-$55,000, is eliminated entirely. The business enters the off-season with insufficient reserves to cover five months of fixed costs."
        scoreRange="22-32. The score reflects extreme temporal concentration (65% in 4 months), weather dependency on primary revenue, high fixed-cost burden during zero-revenue months, and the absence of contractual recurring revenue. Seasonal businesses in this configuration consistently score in the bottom third of the model's range."
        howToFix="Add snow removal or winter services to create a counter-seasonal revenue stream. Lock annual maintenance contracts that provide monthly recurring revenue year-round. Target reducing primary season dependency to below 45% of annual revenue. Build a cash reserve equal to six months of fixed costs to survive disrupted seasons without financial crisis."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={15} atRisk={75} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Wet summer eliminates annual profit margin"
        setup="A landscaping business earning $250,000 annually with 65% of revenue in May-August. Fixed costs of $8,500/month continue year-round. Typical annual profit margin of $45,000-$55,000 after all expenses."
        risk="Rainfall exceeds historical averages by 40% during June and July. Six weeks of scheduled work are cancelled or delayed. Crew utilization drops from 90% to 55%. Two large installation projects are postponed to the following year. The earning window effectively shrinks from 16 weeks to 10 weeks."
        outcome="Summer revenue falls from $162,500 to approximately $105,000. The $57,500 shortfall exceeds the annual profit margin. The business enters the off-season with depleted reserves and five months of $8,500/month fixed costs ahead. Without a credit line or savings, the business faces equipment payment defaults by February. The following season must generate above-average revenue just to recover the prior year's deficit — creating a compounding vulnerability cycle."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Peak Season Revenue"
        right="Year-Round Income"
        explanation="Peak season revenue is income concentrated in a time window — high volume but structurally fragile because it depends on conditions aligning within a fixed period. Year-round income is distributed across twelve months with no single period carrying disproportionate weight. The model measures temporal distribution as a structural characteristic because concentration in time creates the same vulnerability as concentration in sources."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A $250K landscaping business that earns $162K in four months is not a $250K business. It is a $105K business that has historically had good weather." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-small-business-owners", label: "Income Stability for Small Business Owners" },
          { href: "/learn/business-owner-one-vs-three-sources", label: "Scenario: Business Owner — One vs Three Sources" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Does the model penalize all seasonal businesses equally?",
            a: "No. The model evaluates the degree of seasonal concentration, not the presence of seasonality itself. A business that earns 40% in its strongest quarter scores meaningfully better than one that earns 65% in its strongest quarter. Seasonal businesses with counter-seasonal diversification, annual contracts, or strong off-season revenue streams can score in the moderate range despite operating in inherently seasonal industries.",
          },
          {
            q: "How much does adding snow removal actually improve the score?",
            a: "It depends on the revenue generated and the resulting temporal distribution. If snow removal adds $50,000-$70,000 in winter revenue and reduces the primary season's share from 65% to 48% of annual total, the structural improvement is significant — typically 10-18 points. The improvement comes from both the reduced temporal concentration and the creation of a second earning window that provides cash flow during what was previously a zero-revenue period.",
          },
          {
            q: "Are annual maintenance contracts realistic for landscaping businesses?",
            a: "Yes, and they are increasingly common. Many residential and commercial clients prefer predictable monthly billing over seasonal invoicing. A $400-$600 monthly contract that covers spring cleanup, summer maintenance, fall preparation, and basic winter property monitoring provides the client with budget predictability and the business with year-round recurring revenue. The structural benefit to the score is substantial because this income is contractual, recurring, and not weather-dependent.",
          },
          {
            q: "What cash reserve should a seasonal business maintain?",
            a: "The model does not prescribe specific reserve levels, but the structural analysis suggests that a seasonal business should maintain reserves equal to at least six months of fixed costs. For a business with $8,500/month in fixed costs, that is approximately $51,000. This reserve serves as a structural buffer against both disrupted seasons and normal off-season cash requirements, reducing the financial pressure that amplifies seasonal concentration risk.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Seasonal Income Structure"
        sub="Get your income stability score and understand how seasonal concentration, weather dependency, and fixed-cost exposure affect your structural position."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
