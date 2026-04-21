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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityFreelancers() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Freelancers"
        definition="Freelance income depends entirely on active client relationships. Without contracts, retainers, or recurring arrangements, every month starts at zero."
        subtitle="Why earning power and income stability are fundamentally different measurements for independent professionals."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Project-based income resets after every deliverable",
          "No benefits, no employer contributions, no structural floor",
          "Most freelancers score between 20 and 40 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How freelance income works",
            body: (
              <>
                <P>
                  Freelance income is project-based by default. A client engages a freelancer for a specific deliverable — a website, a brand identity, a content series, a software feature — and pays upon completion or according to milestone terms. Once the project ends, the income from that engagement ends. There is no structural mechanism that carries revenue forward into the next month unless a new project or continuation is explicitly negotiated.
                </P>
                <P>
                  Unlike salaried employment, freelance income carries no ancillary benefits. There is no employer-funded health insurance, no retirement matching, no paid leave, and no unemployment insurance. The freelancer bears the full cost of these protections independently, which means the effective value of freelance income is lower than an equivalent salary figure — a detail that compounds the structural fragility of the arrangement.
                </P>
                <P>
                  Income variability is the norm rather than the exception. A freelancer may invoice $18,000 in one month and $4,000 the next, depending on project timing, client payment schedules, and scope changes. Annual earnings can be substantial, but the month-to-month pattern is inherently irregular, making financial planning difficult even when the trailing twelve-month total looks healthy.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores tend to be low",
            body: (
              <>
                <P>
                  The structural factors that compress freelance stability scores are not about talent or effort — they are about arrangement design. Most freelancers operate without written contracts that guarantee minimum engagements. Without a retainer or a multi-month commitment, the freelancer has no contractual claim on future income. Each month&apos;s revenue must be re-earned through active selling, delivery, and invoicing.
                </P>
                <P>
                  Client concentration is the second major factor. Many freelancers derive 50% or more of their income from one or two clients. This is not unusual — it is the natural result of capacity constraints. A freelancer who can serve three to five clients simultaneously will often find that one or two of those engagements dominate their billable hours. The resulting concentration means that losing a single relationship can eliminate a disproportionate share of total income.
                </P>
                <P>
                  Labor dependence is the third structural constraint. Freelance income requires the freelancer to personally perform work. There is no leverage — no team, no product, no recurring asset that generates revenue independently of the freelancer&apos;s active participation. If the freelancer stops working due to illness, burnout, or personal circumstances, income stops entirely. This creates a fragility that persists regardless of earning level.
                </P>
              </>
            ),
          },
          {
            heading: "What freelancers can do about it",
            body: (
              <>
                <P>
                  Structural improvement requires changing how income is generated, not simply increasing the amount earned. The most impactful change is converting project-based relationships into retainer agreements. A retainer creates a contractual floor — a minimum monthly payment that persists regardless of specific project deliverables. Even a modest retainer with two or three clients creates predictable baseline revenue that meaningfully improves stability.
                </P>
                <P>
                  Diversification across clients is the second priority. The target is a portfolio where no single client represents more than 30-40% of total income. This does not require working with dozens of clients — five to seven active relationships with reasonable distribution can produce meaningful structural resilience. The goal is to ensure that losing any single client reduces income but does not eliminate it.
                </P>
                <P>
                  Building income streams that are not labor-dependent addresses the third structural constraint. Digital products, licensing arrangements, templates, courses, or recurring subscription offerings generate revenue that does not require the freelancer&apos;s active participation for each dollar earned. Even a small percentage of total income from these sources improves the stability profile by reducing the binary dependency on active labor.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Freelance"
        howIncomeWorks="Project-based, paid per deliverable or milestone. No base salary, no employer benefits, no paid leave. Income is invoiced and collected independently. Payment timing depends on client terms, project scope, and completion schedules. Annual earnings are the sum of individual project payments with no structural carryover between engagements."
        typicalRange="20-40. Freelancers with retainer agreements and diversified client bases score toward the upper range. Freelancers dependent on project-based work from one or two clients without contracts score toward the lower range. High annual earnings do not compensate for structural fragility."
        biggestRisk="Client concentration combined with labor dependence. Most freelancers depend on a small number of clients for the majority of their income, and every dollar earned requires the freelancer to personally perform work. Losing a major client or being unable to work for any reason creates immediate, unprotected income loss with no contractual buffer."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={8} recurring={22} atRisk={70} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Designer earning $95K from three clients — one leaves"
        setup="Freelance brand designer earning $95,000 annually from three clients. Client A represents 50% of income ($47,500), Client B represents 30% ($28,500), and Client C represents 20% ($19,000). No written contracts with any client. All work is project-based with monthly invoicing."
        risk="Client A — the largest account — completes a rebrand and decides to bring design work in-house. The engagement ends after the current project. No termination clause, no transition period, no severance obligation. The designer loses $47,500 in annual income in a single event."
        outcome="Estimated stability score: 22-28. Annual income drops to $47,500 from the remaining two clients. The designer must immediately begin prospecting to replace the lost revenue while maintaining delivery to existing clients. Recovery to previous income level typically requires four to eight months. The concentration in Client A was the structural vulnerability — not the designer's skill or the quality of the relationship."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Freelance Freedom"
        right="Freelance Fragility"
        explanation="Freedom describes the freelancer's autonomy — choosing clients, setting hours, selecting projects. Fragility describes the freelancer's income structure — no contracts, no recurring revenue, no protection against client loss. These are independent dimensions. A freelancer can have maximum freedom and maximum fragility simultaneously. The income stability score measures only the second."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Every month starts at zero unless you have built structural arrangements that say otherwise." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/150k-freelancer-one-client", label: "Scenario: $150K Freelancer, One Client" },
          { href: "/learn/150k-freelancer-five-clients", label: "Scenario: $150K Freelancer, Five Clients" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/income-stability-sales-professionals", label: "Income Stability for Sales Professionals" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I earn more than most salaried employees — why is my score low?",
            a: "Income stability measures structure, not amount. A freelancer earning $150,000 from project-based work with no contracts has less structural protection than a salaried employee earning $75,000 with an employment agreement, benefits, and unemployment insurance. The score reflects how protected your income is against disruption, not how much you earn.",
          },
          {
            q: "Do retainers significantly improve the score?",
            a: "Yes. Retainer agreements create contractual recurring revenue — a monthly minimum that persists regardless of specific project deliverables. Converting even two or three client relationships from project-based to retainer-based can shift a stability score by 10-15 points because it fundamentally changes the income structure from variable to partially protected.",
          },
          {
            q: "How many clients do I need for a strong stability score?",
            a: "The number of clients matters less than the concentration distribution. Five clients where one represents 70% of income is structurally fragile. Four clients at roughly 25% each is significantly more resilient. The target is a distribution where losing any single client reduces income by no more than 30-40% of the total.",
          },
          {
            q: "Does having a strong reputation or referral network improve stability?",
            a: "Reputation and referral networks improve the likelihood of future income, but they do not create structural protection. A referral network has no contractual obligation to produce work. A stability score measures binding arrangements — contracts, retainers, recurring revenue — not probabilities based on reputation or past performance.",
          },
          {
            q: "What is the fastest structural change I can make?",
            a: "Negotiate a written retainer agreement with your largest client. Even a modest monthly minimum — $3,000 to $5,000 — creates a contractual floor that did not previously exist. Pair this with a 60-day termination notice clause, and you have transformed a project-based relationship into one with measurable structural protection.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Income Structure"
        sub="Get your income stability score and see exactly where your freelance income is structurally exposed."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
