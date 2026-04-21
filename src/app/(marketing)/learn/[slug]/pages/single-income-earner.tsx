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
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function SingleIncomeEarner() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Single Income Earner"
        definition="A single-source income earner — whether employed or self-employed — has maximum concentration risk. One decision by one entity controls 100% of their livelihood."
        subtitle="Concentration does not require complexity to be dangerous. This analysis examines the simplest and most common income vulnerability."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "100% income concentration means any disruption to the single source is a total income event",
          "W-2 employment provides contractual protections that partially offset concentration — but do not eliminate it",
          "A single-client freelancer has the same concentration as a W-2 employee but without the structural protections",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Maximum concentration as a structural condition",
            body: (
              <>
                <P>
                  A professional earning $130,000 from a single W-2 employer has achieved a comfortable income by most measures. The paycheck arrives reliably, benefits are provided, and the employment relationship may have persisted for years without disruption. This reliability creates a perception of stability that the income stability model does not share. The model sees a single source providing 100% of income — the maximum possible concentration — and scores accordingly.
                </P>
                <P>
                  The distinction the model makes is between reliability and resilience. Reliability measures whether income has arrived as expected historically. Resilience measures whether the income structure can absorb a disruption without catastrophic failure. A single-source earner may have perfect reliability — ten years of uninterrupted paychecks — while having zero resilience. The loss of the single source eliminates 100% of income in a single event. There is no partial reduction, no structural floor, and no continuing income from alternative sources.
                </P>
                <P>
                  This is not a commentary on the quality of the employment or the likelihood of job loss. The model does not predict whether a layoff will occur. It measures the structural consequence if one does. For a single-source earner, that consequence is total income elimination — the most severe structural outcome the model can identify. The score reflects this structural reality regardless of how stable the employer appears or how long the employment has continued.
                </P>
              </>
            ),
          },
          {
            heading: "W-2 protections versus freelancer exposure",
            body: (
              <>
                <P>
                  Not all single-source income is structurally equivalent. A W-2 employee earning $130,000 has contractual protections that a single-client freelancer earning the same amount does not. Employment law provides minimum notice in many jurisdictions, severance is common at this income level, unemployment insurance provides a partial income floor during transition, and benefits like health insurance continue for a defined period after separation. These protections do not prevent the disruption, but they buffer its financial impact.
                </P>
                <P>
                  A freelancer earning $130,000 from a single client has the same 100% concentration but none of these structural buffers. The client can terminate the engagement immediately in most cases, with no severance obligation, no unemployment insurance eligibility, and no continuation of benefits. The freelancer&apos;s income goes from $130,000 to zero in a single event with no transitional support. The model scores this as meaningfully worse than the W-2 equivalent — typically 10-15 points lower — because the structural protections that buffer the disruption are absent.
                </P>
                <P>
                  The practical implication is that a single-client freelancer at $130,000 has the income level of a senior professional but the structural profile of an at-will temp worker. The income is real and may be well-earned, but the structural characteristics — zero diversification, zero contractual protection, zero forward commitment — create a vulnerability profile that the model scores in the 15-25 range. This is among the weakest structural positions the model evaluates.
                </P>
              </>
            ),
          },
          {
            heading: "The first structural improvement",
            body: (
              <>
                <P>
                  For a single-source earner, the most impactful structural improvement is adding one additional income source. The model is not looking for dramatic transformation — it is looking for structural evidence that the earner has begun to diversify. A W-2 employee who adds $15,000 in freelance income has moved from 100% concentration to 90/10 distribution. That 10% may seem marginal, but it demonstrates a structural capacity that did not exist before: the ability to generate income independently of the primary employer.
                </P>
                <P>
                  The score improvement from adding a second source depends on the characteristics of that source. A $15,000 freelance stream from three clients on retainer adds more structural value than $15,000 from a single project for a single client. The model evaluates the new source on its own terms — diversification, contractual protection, recurrence — and incorporates it into the overall profile. Even a modest, well-structured second source can add 8-15 points to a single-source earner&apos;s score.
                </P>
                <P>
                  The longer-term structural goal is to reduce dependency on the primary source to below 60% of total income. For a $130,000 W-2 earner, this means building additional income to approximately $87,000 — bringing the total to $217,000 with the W-2 representing 60% rather than 100%. This is a multi-year structural project for most earners, but the model rewards every incremental step. The journey from 100% concentration to 60% concentration is scored as one of the most significant structural improvements an earner can achieve.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A professional earning $130,000 annually from a single W-2 employer. No side income, no freelance work, no rental property, no investment income of meaningful scale. Benefits include health insurance, 401(k) matching, and 15 days PTO. Employment tenure is six years. No employment contract — at-will employment in a state with no additional protections."
        riskExposure="100% concentration in a single source controlled by a single employer. Zero diversification — no alternative income of any kind. One decision (layoff, restructuring, termination) eliminates the entire income. Structural protections exist (unemployment insurance, potential severance) but provide temporary, partial income replacement only."
        disruption="The employer announces a restructuring affecting 12% of the workforce. The professional's position is eliminated. Severance is offered at two weeks per year of service (12 weeks total = $30,000 pre-tax). Health insurance continues for 60 days. Unemployment insurance provides approximately $2,400/month in the professional's state. No other income source exists."
        scoreRange="30-45 for W-2 with benefits. 15-25 for single-client freelancer. The W-2 range reflects the partial structural protections provided by employment law, benefits, and unemployment insurance. The freelancer range reflects the absence of all such protections. Both ranges reflect the fundamental structural weakness of 100% income concentration."
        howToFix="Add one additional income source — even a modest one — to break the 100% concentration. Freelance consulting, rental property, or a small recurring side business can reduce primary source dependency. Negotiate longer notice periods or severance terms with the current employer. Target reducing primary source to below 70% of total income within 24 months as a first structural milestone."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={25} recurring={55} atRisk={20} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Position eliminated in restructuring"
        setup="A professional earning $130,000 from a single W-2 employer with six years of tenure. At-will employment. Benefits include health insurance and 401(k). No other income sources. Monthly financial obligations total $7,800 including mortgage, car payment, insurance, and household expenses."
        risk="The employer undergoes a strategic restructuring. The professional's department is consolidated. The position is eliminated with 30 days' notice. Severance of 12 weeks' pay ($30,000) is offered. Health insurance continues for 60 days. Unemployment insurance will provide approximately $2,400/month."
        outcome="Income drops from $10,833/month to $2,400/month (unemployment) after severance is exhausted. The gap between income ($2,400) and obligations ($7,800) is $5,400/month — consuming savings at a rate that most households cannot sustain for more than 3-4 months. The job search timeline for a $130,000 position averages 4-6 months. The financial arithmetic creates a structural crisis within 90 days of severance expiration."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Stable Paycheck"
        right="Stable Structure"
        explanation="A stable paycheck means income has arrived reliably in the past — a historical observation. A stable structure means income can absorb disruption without catastrophic failure — a forward-looking measurement. A professional with 10 years of uninterrupted paychecks from one employer has a stable paycheck. A professional with income from three sources, none exceeding 40%, with contractual protections on each has a stable structure. The model measures structure because history does not prevent future disruption — it only describes the absence of past disruption."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A $130K salary from one employer is not stable income. It is reliable income — until it isn't. The distinction matters because reliability is a historical observation while stability is a structural characteristic." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-stability-vs-income", label: "Income Stability vs Income" },
          { href: "/learn/what-makes-income-stable", label: "What Makes Income Stable" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Why does the model score W-2 employees relatively low despite steady paychecks?",
            a: "The model measures structural resilience, not historical reliability. A steady paycheck from one employer demonstrates that no disruption has occurred — not that the structure can absorb one. Single-source concentration is evaluated because it determines the severity of the worst-case scenario. A W-2 employee scores higher than a single-client freelancer due to employment protections, but 100% concentration in one source still produces a lower score than a diversified structure.",
          },
          {
            q: "Does a high salary compensate for single-source concentration?",
            a: "No. Income level and income stability are independent measurements in the model. A professional earning $300,000 from one employer has the same 100% concentration as one earning $50,000 from one employer. The higher earner may have more savings to buffer a disruption, but the structural vulnerability — the complete elimination of income from a single event — is identical. The model scores structure, not level.",
          },
          {
            q: "What counts as a meaningful second income source?",
            a: "Any income source that operates independently of the primary employer and has its own structural characteristics. Freelance consulting, rental property income, a recurring side business, or even structured investment income qualifies. The source should be ongoing rather than one-time, and ideally generates enough to cover at least one major monthly obligation. Even $1,000-$2,000/month from an independent source creates a structural floor that did not exist before.",
          },
          {
            q: "How does the model treat government employment or tenured positions?",
            a: "Government employment and tenured academic positions receive higher scores for contractual protection due to stronger termination protections, defined benefit pensions, and civil service rules. However, the 100% concentration factor still applies. A tenured professor earning entirely from one university has better contractual protection but the same source concentration as any single-employer earner. The protections raise the score within the single-source range but do not move the profile into the diversified range.",
          },
          {
            q: "Is a household with two W-2 incomes considered diversified?",
            a: "The model evaluates income at the individual level by default, but when assessing household income structure, two W-2 incomes from different employers in different industries represents meaningful diversification. The loss of either income reduces household income significantly but does not eliminate it. A household with two earners at $75,000 each from unrelated employers has better structural diversification than a household with one earner at $150,000, even though the total is identical.",
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
