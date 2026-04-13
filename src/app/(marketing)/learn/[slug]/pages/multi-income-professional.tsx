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

export default function MultiIncomeProfessional() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Multi-Income Professional"
        definition="A professional with three or more income sources has structural diversification — but not necessarily stability. The quality of each source matters as much as the count."
        subtitle="Diversification is necessary but not sufficient. This analysis explains what the model actually measures."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Three income sources with one representing 60% is structurally similar to a single-source earner with a side project",
          "Source count is a surface metric — the model evaluates concentration, contractual protection, and recurrence of each source independently",
          "A balanced three-source profile scores 20-30 points higher than an imbalanced three-source profile at the same total income",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The difference between multiple and balanced",
            body: (
              <>
                <P>
                  A professional earning $200,000 from three sources — a W-2 job at $120,000, freelance consulting at $50,000, and rental property income at $30,000 — has structural diversification by count. Three sources is meaningfully better than one. But the distribution reveals that the W-2 position represents 60% of total income, making it the dominant source by a wide margin. The loss of the W-2 job eliminates $120,000 — more than the other two sources combined — and fundamentally changes the financial picture.
                </P>
                <P>
                  The income stability model evaluates diversification not by counting sources but by measuring the concentration of each source relative to the total. A 60/25/15 distribution is structurally imbalanced. The dominant source carries concentration risk that is only partially offset by the existence of the other two streams. The model treats this as moderate diversification — better than a single-source earner, but far from the structural resilience of a balanced multi-source profile.
                </P>
                <P>
                  A truly balanced three-source profile would distribute income more evenly — ideally with no single source exceeding 40% of the total. At $200,000, that would mean no source contributing more than $80,000. This balance ensures that the loss of any single source creates a significant but survivable reduction rather than a financial crisis. The model scores the difference between 60/25/15 and 35/35/30 as a 20-30 point gap — one of the largest structural improvements available without changing total income.
                </P>
              </>
            ),
          },
          {
            heading: "Evaluating source quality independently",
            body: (
              <>
                <P>
                  Each income source in a multi-source profile carries its own structural characteristics that the model evaluates independently. The W-2 job provides contractual employment with benefits, predictable pay cycles, and typically some form of termination protection (severance, notice periods, unemployment insurance eligibility). These characteristics score well on contractual protection and recurrence. However, the W-2 is controlled by a single employer — one decision-maker determines whether this income continues.
                </P>
                <P>
                  The freelance consulting income of $50,000 depends on how it is structured. If it comes from one client on project-based terms, it carries concentration risk within its own stream. If it comes from three to four clients on retainer, it is well-diversified at the source level. The model evaluates this independently — the freelance stream can score anywhere from 15 to 65 depending on its internal structure, and that score contributes to the overall profile assessment.
                </P>
                <P>
                  Rental property income at $30,000 provides genuine structural diversification because it is independent of the professional&apos;s labor and employer. It continues regardless of employment status, health, or work capacity. However, it carries its own risks: vacancy, maintenance costs, tenant issues, and market conditions. The model scores rental income based on occupancy history, lease terms, and the ratio of rental income to carrying costs. A fully leased property with long-term tenants scores well; a single-unit property with high turnover scores lower.
                </P>
              </>
            ),
          },
          {
            heading: "Rebalancing toward structural resilience",
            body: (
              <>
                <P>
                  The path from imbalanced multi-source to balanced multi-source requires either growing the smaller sources, reducing dependency on the dominant source, or both. For the $200,000 earner with a 60/25/15 split, the structural goal is to reduce the W-2&apos;s share below 40% — which means either growing the freelance and rental income by approximately $50,000 combined, or accepting a lower-paying W-2 role while growing the other streams.
                </P>
                <P>
                  Growing freelance income from $50,000 to $80,000 and rental income from $30,000 to $50,000 would produce a 46/31/23 distribution at $260,000 total — meaningfully better balance while also increasing total income. The freelance growth requires adding clients and formalizing arrangements. The rental growth requires either adding a property or increasing rents on the existing portfolio. Both are achievable within 12-24 months for a professional already operating in these areas.
                </P>
                <P>
                  The model rewards incremental progress. Each step toward better balance produces a measurable score improvement. Moving from 60/25/15 to 55/28/17 adds 3-5 points. Moving further to 48/32/20 adds another 5-8 points. The professional does not need to achieve perfect balance to see meaningful structural improvement — each incremental rebalancing toward a more even distribution produces a proportional benefit in the stability score.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A professional earning $200,000 annually from three sources: W-2 employment at $120,000 (60%), freelance consulting at $50,000 (25%), and rental property income at $30,000 (15%). The W-2 provides benefits including health insurance and retirement matching. Freelance consulting comes from two clients on project-based terms. Rental income comes from a single duplex property with two units."
        riskExposure="Moderate overall — three sources provide genuine diversification. However, the W-2 at 60% creates dominant-source concentration. The freelance income from two clients carries its own concentration risk. The rental property is a single asset with vacancy exposure. The combined profile is diversified but imbalanced, with the W-2 loss scenario representing the critical structural vulnerability."
        disruption="The professional is laid off from the W-2 position during a company restructuring. Income drops from $200,000 to $80,000 immediately. Health insurance coverage ends in 60 days. The freelance and rental income continue unchanged, providing a structural floor — but at 40% of the prior total. The professional's financial obligations were calibrated to $200,000, creating an immediate gap between income and expenses."
        scoreRange="45-65, depending on balance. At the current 60/25/15 distribution, the profile scores in the 45-50 range. With better balance (no source exceeding 40%), the same three sources would score 60-65. The score range reflects the model's sensitivity to distribution quality, not just source count."
        howToFix="Reduce primary source dependency below 40% of total income by growing freelance and rental streams. Formalize freelance consulting with retainer agreements and add one to two additional clients. Consider adding a third rental unit to increase passive income share. Target a 40/35/25 distribution or better within 18 months."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={30} recurring={35} atRisk={35} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Primary employer restructures"
        setup="A professional earning $200,000 from three sources: W-2 at $120,000 (60%), freelance at $50,000 (25%), rental at $30,000 (15%). Financial obligations calibrated to the full $200,000 including mortgage, car payment, and children's education costs."
        risk="The employer announces a 15% workforce reduction. The professional's position is eliminated. Severance is three months' pay ($30,000). Health insurance continues for 60 days under COBRA. The two freelance clients and rental property are unaffected."
        outcome="Income drops to $80,000 annually — the freelance and rental income that continue regardless of employment status. With three months' severance, the professional has approximately five months of runway at current expense levels before requiring either a new W-2 position, expanded freelance work, or expense restructuring. The structural floor provided by the non-W-2 income prevents a total income crisis but does not prevent a significant lifestyle adjustment."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Multiple Incomes"
        right="Balanced Incomes"
        explanation="Multiple incomes means more than one source — a count measurement. Balanced incomes means no single source dominates the total — a distribution measurement. Three sources at 60/25/15 is multiple but not balanced. Three sources at 35/35/30 is both multiple and balanced. The model measures structural resilience through distribution quality, not source count, because the concentration of the dominant source determines the severity of the worst-case disruption scenario."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Three income sources at 60/25/15 is not diversified income. It is a primary job with two side projects. The structural test is not how many sources you have — it is what happens when the largest one disappears." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/income-stability-vs-income", label: "Income Stability vs Income" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How many income sources does the model consider 'well-diversified'?",
            a: "The model does not set a fixed threshold for source count. Three sources can score well if balanced; seven sources can score poorly if concentrated. The structural assessment focuses on the distribution of income across sources, the contractual protection of each source, and the recurrence pattern of each stream. As a practical guideline, most profiles that score above 60 have at least three sources with no single source exceeding 40% of total income.",
          },
          {
            q: "Does the model value passive income higher than active income?",
            a: "The model values income that continues without active labor input because it provides a structural floor during disruptions — illness, job loss, burnout, or career transitions. Rental income and dividend income continue regardless of the earner's work status. This characteristic is scored as a structural advantage. However, passive income carries its own risks (vacancy, market decline) that are evaluated independently. The model does not categorically prefer passive over active — it evaluates the structural characteristics of each source on its own terms.",
          },
          {
            q: "What if my W-2 income comes with strong benefits — does that offset the concentration?",
            a: "Benefits improve the quality score of the W-2 source but do not eliminate concentration risk. Health insurance, retirement matching, and disability coverage add structural protections that increase the W-2 stream's individual score. However, if the W-2 represents 60% of total income, the loss of that source still creates a 60% income disruption regardless of the benefits package. Benefits make the W-2 a better income source but do not reduce its share of total income.",
          },
          {
            q: "Is it better to add a fourth source or rebalance the existing three?",
            a: "In most cases, rebalancing the existing three sources produces a larger score improvement than adding a fourth source at a small percentage. Moving the distribution from 60/25/15 to 45/30/25 by growing the smaller sources adds more structural resilience than adding a fourth source at 5% while the dominant source remains at 57%. The model rewards balance improvements more than source count improvements because the concentration of the dominant source is the primary driver of structural vulnerability.",
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
        heading="Measure Your Multi-Source Income Structure"
        sub="Get your income stability score and understand how source balance, contractual protection, and concentration affect your structural position across all income streams."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
