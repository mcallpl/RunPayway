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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function CreatorBrandDealsVsMixedIncome() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Creator — Brand Deals vs Mixed Income"
        definition="A creator earning $150K from brand deals alone and a creator earning $150K from a mix of brand deals, courses, and memberships have completely different stability profiles."
        subtitle="How owned revenue streams transform the structural resilience of creator income."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Brand-only income has zero recurring revenue — every dollar must be re-earned",
          "Mixed income with memberships creates a structural floor that persists monthly",
          "Same total earnings, 20-30 point difference in stability score",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Two creators, same income, different structures",
            body: (
              <>
                <P>
                  Creator A earns $150,000 annually from brand deals — approximately 10 to 12 separate sponsored content campaigns averaging $12,500 each. Each deal is negotiated individually, executed as a discrete deliverable, and paid upon completion. There is no recurring component. When a campaign ends, that revenue ends. The next $12,500 requires a new negotiation, a new contract, and a new deliverable. Every dollar of Creator A&apos;s income must be re-earned from scratch each month.
                </P>
                <P>
                  Creator B also earns $150,000 annually, but from three distinct sources: $60,000 from brand deals (five campaigns averaging $12,000 each), $50,000 from an online course with ongoing enrollment, and $40,000 from a membership community with 800 members paying an average of $4.17 per month. The brand deal component is structurally identical to Creator A&apos;s — discrete, non-recurring, re-earned each time. But it represents only 40% of total income rather than 100%.
                </P>
                <P>
                  The structural difference is in what happens on the first of each month. Creator A starts every month at $0 in committed income. Creator B starts every month with approximately $7,500 in recurring revenue from memberships and ongoing course sales — revenue that continues without any new deal being signed, any new content being sponsored, or any new negotiation being completed. This $7,500 monthly floor is the structural difference that the scoring model measures.
                </P>
              </>
            ),
          },
          {
            heading: "Why brand-only income scores low",
            body: (
              <>
                <P>
                  Brand deal income has three structural characteristics that suppress stability scores. First, it is entirely non-recurring. Each deal is a one-time transaction with no commitment to future work. A brand that paid $15,000 for a sponsored video in March has no obligation to pay anything in April. The creator must continuously sell new deals to maintain income, and the sales cycle — outreach, negotiation, contracting, production, payment — can span weeks to months for each individual deal.
                </P>
                <P>
                  Second, brand deal income depends on audience metrics that the creator does not control. Brands evaluate creators based on reach, engagement rates, audience demographics, and content performance — metrics that are platform-mediated and algorithmically influenced. A creator whose average views decline by 25% due to an algorithm change becomes less attractive to brands, reducing both the number of available deals and the rates those deals command. The income decline cascades: lower views produce lower rates, which produce lower total income, which reduces the creator&apos;s market position further.
                </P>
                <P>
                  Third, brand budgets are cyclical and externally determined. Brands increase and decrease marketing spend based on their own business conditions, competitive dynamics, and budget cycles. During economic contractions, branded content budgets are among the first to be reduced. A creator has no influence over these decisions and no contractual protection against them. The entire brand deal pipeline can contract simultaneously across multiple brands for reasons entirely unrelated to the creator&apos;s content quality or audience engagement.
                </P>
              </>
            ),
          },
          {
            heading: "How owned products change the structural profile",
            body: (
              <>
                <P>
                  Creator B&apos;s course and membership income introduce structural characteristics that brand deals cannot provide. The membership program generates recurring revenue — 800 members paying monthly create a revenue stream that continues until individual members cancel. Churn is gradual, not catastrophic. If 5% of members cancel in a given month, membership revenue declines by 5%, not by 100%. The structural resilience of distributed, recurring revenue is qualitatively different from the binary nature of brand deals.
                </P>
                <P>
                  The online course provides semi-recurring revenue through ongoing enrollment. While individual course sales are transactional, a well-positioned course with consistent marketing generates relatively predictable monthly revenue. The course exists as a digital asset — it continues to sell without requiring new content production for each sale. This creates a revenue source that is partially decoupled from the creator&apos;s active content production schedule.
                </P>
                <P>
                  Both the course and membership represent owned revenue — income generated through products the creator controls, sold to customers the creator has a direct relationship with, on platforms the creator can migrate if necessary. This ownership distinction is structurally significant. Brand deal income depends on the brand&apos;s willingness to pay, the platform&apos;s willingness to distribute, and the audience&apos;s willingness to engage — three dependencies outside the creator&apos;s control. Owned product income depends primarily on the creator&apos;s ability to maintain and market the product — a single dependency within their control.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Both creators earn $150,000 annually. Creator A: $150,000 from brand deals (10-12 campaigns, no recurring revenue, no owned products). Creator B: $60,000 from brand deals, $50,000 from an online course with ongoing enrollment, $40,000 from a membership community (800 members). Creator B has approximately 40% recurring revenue; Creator A has 0%."
        riskExposure="Creator A: 100% non-recurring, campaign-dependent income. Every dollar requires a new deal. No structural floor. Income resets to $0 potential each month. Creator B: 60% of income comes from owned products with recurring characteristics. Membership churn is gradual (typically 3-7% monthly). Course sales provide semi-predictable baseline. Only 40% of income depends on new brand deal acquisition."
        disruption="A major brand pulls its planned campaign — a $25,000 deal — due to budget cuts. For Creator A, this represents a 17% income loss for the period, with no replacement mechanism built into the income structure. For Creator B, the same $25,000 brand deal loss represents a 17% reduction in brand income but only a 6.7% reduction in total income. Membership and course revenue continue unaffected."
        scoreRange="Creator A (brand-only): 18-28. Zero recurring revenue, complete dependency on continuous deal flow, platform-mediated audience metrics, and cyclical brand budgets. Creator B (mixed): 45-60. Meaningful recurring revenue base, owned products, diversified income streams, and only partial dependency on brand deals."
        howToFix="For Creator A: build owned audience products. Launch a membership or community ($5-15/month) targeting the most engaged 2-3% of the audience. Develop a course or digital product that generates sales independent of sponsored content production. Target a structure where brand deals represent no more than 40-50% of total income within 12-18 months. Each percentage point shifted from brand deals to owned products improves structural resilience."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={35} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Brand deal season goes quiet — two different outcomes"
        setup="It is January. Both creators typically sign three to four brand deals in Q1. This year, the advertising market is soft — brands are holding budgets pending Q1 earnings. Both creators enter the quarter with no signed deals. Creator A has no other income source. Creator B has membership and course revenue continuing at their normal levels."
        risk="Creator A generates $0 in January income. Pipeline conversations are active but no contracts are signed. The creator's expenses — rent, insurance, software subscriptions, production costs — continue at their normal level. Cash reserves begin to deplete. Creator B generates approximately $7,500 in January from membership and course revenue. Brand income is $0, but the structural floor prevents a zero-income month."
        outcome="By the end of Q1, Creator A has earned $15,000 from two late-quarter deals (versus a typical $37,500). Creator B has earned $22,500 from recurring revenue plus $12,000 from one brand deal — $34,500 total. The brand market softness affected both creators equally on the brand deal side. The structural difference — $22,500 in recurring revenue — is what separates a financial crisis from a slower quarter."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Sponsored Income"
        right="Owned Income"
        explanation="Sponsored income depends on a brand's willingness to pay for access to your audience. Owned income depends on your ability to sell a product directly to that audience. Sponsored income can disappear when brand budgets contract, audience metrics shift, or platform dynamics change. Owned income persists as long as you maintain the product and the customer relationship. The distinction is structural: dependency versus ownership."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="If every dollar you earn requires someone else to write you a check, you do not control your income." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-creators", label: "Income Stability for Creators" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I earn well from brand deals — why should I build products?",
            a: "Brand deal income is structurally non-recurring. Every dollar requires a new negotiation, a new contract, and a new deliverable. Building products creates income that continues without continuous deal-making. The question is not whether brand deals are profitable — they clearly are. The question is whether your income survives a quarter where brand deals slow down or stop. If it does not, your income structure has a vulnerability that product revenue directly addresses.",
          },
          {
            q: "What kind of membership generates meaningful income for a creator?",
            a: "A membership that converts 1-3% of an engaged audience at $5-15 per month generates meaningful recurring revenue for most mid-size creators. A creator with 100,000 engaged followers converting 2% at $8/month generates $16,000 in monthly recurring revenue — $192,000 annually. The membership must provide ongoing value that justifies continued payment: community access, exclusive content, direct interaction, or specialized resources that the free audience does not receive.",
          },
          {
            q: "How quickly can a creator build a recurring revenue base?",
            a: "Most creators who launch a membership or course see meaningful revenue within three to six months, assuming they have an established audience. The first month typically generates 30-50% of the eventual steady-state revenue, with growth occurring through ongoing promotion and audience conversion. Reaching a structural level where recurring revenue covers basic monthly expenses usually takes six to twelve months of consistent effort.",
          },
          {
            q: "Do longer-term brand partnerships count as recurring revenue?",
            a: "Quarterly or annual brand ambassador agreements with committed budgets are scored more favorably than one-off campaigns because they provide forward revenue visibility. A twelve-month ambassador deal with monthly payments creates a revenue stream that functions as recurring for the contract period. However, it remains dependent on the brand's renewal decision, which distinguishes it from owned products where the creator controls the revenue relationship directly.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Score Your Creator Income", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Find Out Where You Stand"
        sub="Get your income stability score and see how your revenue mix affects your structural resilience."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
