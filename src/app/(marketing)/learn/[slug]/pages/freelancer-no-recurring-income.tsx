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

export default function FreelancerNoRecurringIncome() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Freelancer — No Recurring Income"
        definition="A freelancer with no retainers, no subscriptions, and no contractual commitments is re-earning their entire livelihood every 30 days."
        subtitle="Fully booked is not structurally protected. The distinction is measurable."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Project-based income without contracts carries zero forward persistence",
          "Four clients with no retainers means four relationships that can end without notice",
          "Being fully booked today tells you nothing about structural stability next quarter",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The illusion of a full calendar",
            body: (
              <>
                <P>
                  A freelancer earning $120,000 annually from four clients, all on a project basis, appears to be thriving by conventional standards. The calendar is full. The income is strong. The work is consistent — this quarter, and last quarter, and the quarter before that. From the outside, this looks like a stable freelance practice. From a structural perspective, it is one of the most fragile income configurations the model evaluates.
                </P>
                <P>
                  The structural problem is that none of this income is committed forward. Each client engagement exists on an informal, project-to-project basis. There are no retainer agreements, no minimum commitments, no contractual terms governing continuation or termination. The client can end the relationship at any time, for any reason, with no notice obligation and no financial consequence. The freelancer has no structural claim on next month&apos;s income — only a reasonable expectation based on past behavior.
                </P>
                <P>
                  Reasonable expectations are not structural protection. When the model evaluates this income profile, it identifies zero contractual persistence, zero forward revenue commitment, and high concentration across only four sources. The fact that the freelancer has been busy for twelve consecutive months does not change the structural assessment, because past consistency does not create contractual claims on future income.
                </P>
              </>
            ),
          },
          {
            heading: "Why zero persistence produces the lowest scores",
            body: (
              <>
                <P>
                  Income persistence measures the degree to which current income is structurally expected to continue without additional effort or renegotiation. A retainer agreement has high persistence — the income continues because the contract requires it. A subscription has high persistence — the revenue continues because the customer must actively cancel. Project-based freelance income has zero persistence — each project is independent, and income between projects depends entirely on the client&apos;s discretionary decision to engage again.
                </P>
                <P>
                  Zero persistence means that the freelancer is effectively re-earning their entire $120,000 every year from scratch. There is no base, no floor, no committed portion of income that rolls forward automatically. If all four clients decided independently not to engage for the next project, the freelancer&apos;s income would drop to zero with no contractual remedy. The probability of all four clients leaving simultaneously may be low, but the structural exposure to that scenario is real and unmeasured by any conventional financial metric.
                </P>
                <P>
                  The model scores this configuration in the 18-28 range. The score is low not because the freelancer is unsuccessful or unskilled, but because the income structure lacks every protective mechanism the model evaluates: no forward commitments, no contractual terms, no recurring revenue, no termination protections, and concentrated client dependency across only four relationships.
                </P>
              </>
            ),
          },
          {
            heading: "What happens when the largest client leaves",
            body: (
              <>
                <P>
                  In a four-client freelance practice, the largest client typically represents 30-40% of total income. If that client ends the engagement — because their budget was cut, because they hired internally, because the project scope changed — the freelancer loses $36,000-$48,000 in annual income in a single event. There is no notice period, no severance equivalent, and no contractual mechanism that provides transition time.
                </P>
                <P>
                  The freelancer must replace that revenue by finding a new client, which requires business development activity that competes with delivery obligations to the remaining three clients. The timeline to replace a major client varies, but in most freelance markets it takes 30-90 days to identify, propose, negotiate, and begin a new engagement. During this period, the freelancer is operating at 60-70% of their previous income with no structural buffer.
                </P>
                <P>
                  This scenario is not a worst case — it is a foreseeable event that the model treats as a baseline disruption. Clients leave. Projects end. Budget priorities shift. The question the model answers is not whether this will happen, but what the income structure looks like when it does. For a freelancer with no recurring income, the answer is that the structure provides zero protection against a foreseeable and common disruption.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A freelancer earning $120,000 annually from four clients. All engagements are project-based with no retainer agreements, no minimum commitments, and no contractual continuation terms. The largest client represents approximately 35% of total income ($42,000). Average engagement length: 4-6 months per project cycle."
        riskExposure="Zero persistence — no income is committed forward beyond the current project scope. Zero forward visibility — there is no contractual basis for projecting income beyond active engagements. High concentration — four clients, with the largest representing 35% of total revenue. No termination protection — any client can end the relationship immediately with no financial consequence."
        disruption="The largest client ends the engagement. The client's internal team has expanded, and the budget for external freelance work has been eliminated. The freelancer loses $42,000 in annual income — 35% of total revenue — with no notice period and no transition support. Replacement requires 60-90 days of business development while maintaining delivery to remaining clients."
        scoreRange="18-28. The score reflects the combination of zero contractual persistence, zero forward commitment, high client concentration, and no structural protection against client departure. The range is among the lowest the model produces for any income configuration."
        howToFix="Convert at least one client relationship to a monthly retainer with a minimum 90-day commitment. Lock the largest client into a 6-month agreement with a 60-day termination notice clause. Add a fifth or sixth client to reduce concentration. Each structural change — retainer terms, forward commitments, client diversification — incrementally improves the score by adding persistence and reducing concentration risk."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={0} recurring={10} atRisk={90} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Largest client ends engagement without notice"
        setup="A freelancer earning $120,000 from four project-based clients. The largest client represents 35% of income ($42,000 annually). No retainer agreements, no minimum commitments. The freelancer has been fully booked for 14 consecutive months."
        risk="The largest client's VP of Marketing is replaced. The new VP brings their own preferred agency. The freelancer receives a polite email thanking them for their work — the engagement is over. No notice period. No transition. No contractual obligation to continue."
        outcome="Income drops from $120,000 to $78,000 annually — a 35% reduction from a single email. The freelancer must replace $42,000 in revenue while maintaining delivery to three remaining clients. Business development takes 60-90 days to produce a new engagement. The 14-month streak of being fully booked provided no structural protection against this entirely foreseeable event."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Fully Booked"
        right="Structurally Protected"
        explanation="Being fully booked means the calendar is occupied today. Being structurally protected means income is contractually committed forward. A freelancer can be fully booked with zero structural protection — every hour is billable, but no hour is guaranteed beyond the current project. The stability model measures forward commitment, not current utilization. A half-booked freelancer with retainer agreements may score higher than a fully booked freelancer with none."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A freelancer with no retainers and no contracts is not self-employed — they are employed by four clients, any of whom can terminate at will." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/freelancer-50-percent-retainer", label: "Scenario: Freelancer — 50% Retainer" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
          { href: "/learn/150k-freelancer-one-client", label: "Scenario: $150K Freelancer, One Client" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is all freelance income structurally unstable?",
            a: "No. Freelance income that is structured with retainer agreements, forward commitments, and diversified client bases can score in the 45-65 range. The low score in this scenario is driven by the absence of those structural mechanisms, not by the freelance model itself. The model evaluates structure, not employment classification.",
          },
          {
            q: "What counts as a retainer for scoring purposes?",
            a: "A retainer is a contractual agreement where the client commits to a recurring payment for a defined period, regardless of whether the full allocation of work is consumed. The key structural elements are: a defined monthly fee, a minimum commitment period, and a termination notice requirement. Informal arrangements where the client 'usually' sends work monthly do not qualify as retainers because they carry no contractual obligation.",
          },
          {
            q: "How many clients does a freelancer need to be diversified?",
            a: "The model evaluates concentration by measuring the percentage of income from the largest single source. With four clients, even an equal distribution means each client represents 25% of income — still high concentration. Six to eight clients with no single source exceeding 20% provides meaningful diversification. The goal is to ensure that losing any single client creates a manageable reduction, not a crisis.",
          },
          {
            q: "Does having a long relationship with a client improve the score?",
            a: "Not directly. A five-year informal relationship with no contract is structurally identical to a five-month informal relationship with no contract — neither has forward commitment, termination protection, or contractual persistence. The relationship history may make continuation more probable, but probability is not structure. The model scores what is contractually committed, not what is historically expected.",
          },
          {
            q: "Can I improve my score without changing my clients?",
            a: "Yes. The most impactful changes involve formalizing existing relationships — converting informal project-based arrangements into retainer agreements with minimum terms and termination notice clauses. The same clients, the same work, and the same income with a different contractual structure can produce a meaningfully different score. The structure is what changes, and the structure is what the model measures.",
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
