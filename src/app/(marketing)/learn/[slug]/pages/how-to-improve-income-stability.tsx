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
} from "@/components/learn/LearnComponents";

export default function HowToImproveIncomeStability() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Strategy"
        title="How to Improve Income Stability"
        definition="Income stability improves when you increase the percentage of income that is protected, recurring, and diversified."
        subtitle="Four structural levers determine whether your income holds under pressure."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Stability improves through structural changes, not harder work",
          "Four levers drive measurable score improvement",
          "Small structural shifts can produce disproportionate score gains",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The Four Levers of Income Stability",
            body: (
              <>
                <P>
                  Income stability is not improved by earning more. It is improved by changing the structural characteristics of how income is earned. Four levers drive measurable improvement. The first is source diversification — increasing the number of independent income sources so that no single source represents a disproportionate share of total earnings. Moving from two clients to five, or from one employer to one employer plus a side revenue stream, reduces concentration and improves resilience.
                </P>
                <P>
                  The second lever is recurring revenue. Converting episodic or project-based income into recurring arrangements — retainers, subscriptions, long-term service agreements — increases the predictability and persistence of income flows. A $5,000 monthly retainer is structurally superior to a $60,000 annual project, even though the annual total is identical, because the retainer provides continuous income commitment rather than a single lump-sum event.
                </P>
                <P>
                  The third lever is forward commitment — locking income into contractual arrangements that extend as far into the future as possible. Signing a twelve-month retainer instead of operating month-to-month improves forward visibility by twelve months. The fourth lever is reducing labor dependence — building income streams that continue even when the earner is not actively working. Licensing fees, royalties, rental income, and productized services all reduce the correlation between hours worked and income received.
                </P>
              </>
            ),
          },
          {
            heading: "Prioritizing the Right Lever",
            body: (
              <>
                <P>
                  Not all levers have equal impact for every earner. The correct priority depends on where current structural weakness concentrates. An earner with strong diversification but zero contractual protection should prioritize forward commitment — converting existing relationships into signed agreements. An earner with strong contracts but 80% concentration in one client should prioritize diversification — adding new sources to reduce single-point-of-failure risk.
                </P>
                <P>
                  The dimensional breakdown in a stability score identifies which lever will produce the greatest improvement. This is the practical value of measurement: it replaces generic advice with targeted structural strategy. Rather than being told to &quot;diversify your income,&quot; an earner learns that their concentration dimension scores 18 while their forward visibility scores 72 — and that adding two new clients would have three times the score impact of extending an existing contract.
                </P>
                <P>
                  Improvement is incremental and compounding. Each structural change affects multiple dimensions simultaneously. Adding a new client on a twelve-month retainer improves diversification, forward visibility, and recurring revenue in a single action. The most efficient improvements are those that activate multiple levers at once.
                </P>
              </>
            ),
          },
          {
            heading: "What Improvement Looks Like in Practice",
            body: (
              <>
                <P>
                  Structural improvement does not require dramatic transformation. It requires deliberate, targeted changes to the architecture of existing income. A consultant who converts one of three month-to-month clients to a twelve-month retainer improves forward visibility by roughly one-third of their income base. A freelancer who adds one new client at 15% of total revenue reduces their maximum concentration ratio from 50% to 42.5%. These are modest operational changes with measurable structural impact.
                </P>
                <P>
                  The compounding effect is significant. An earner who starts at a stability score of 30 and implements one structural improvement per quarter — converting a client to retainer, adding a new source, extending a contract — can realistically reach the 55-65 range within twelve to eighteen months. The income amount may not change at all. The structural foundation under that income transforms entirely.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={45} recurring={35} atRisk={20} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Freelancer converts one client to retainer — score impact"
        setup="A graphic designer earns $110,000 from four clients. All four operate on a project-by-project basis with no ongoing agreements. The largest client represents 35% of total revenue. Average project duration is six to eight weeks with gaps between engagements."
        risk="Zero forward visibility — no income is contractually committed beyond the current project cycle. Moderate concentration risk in the largest client. High variability due to project-based income patterns with irregular gaps. The designer must continuously sell new projects to maintain income."
        outcome="The designer converts their largest client from project-based to a $3,200 monthly retainer ($38,400 annually). This single change improves forward visibility from zero to twelve months on 35% of income, converts variable project income to recurring revenue, and locks the highest-concentration relationship into a contractual commitment. RunPayway estimates the score shifts from 26-32 to 41-47 — a material improvement from a single structural change."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Working Harder"
        right="Building Stronger"
        explanation="Working harder increases output within an existing structure. Building stronger changes the structure itself. A freelancer who takes on more projects within a fragile structure earns more but remains equally exposed. A freelancer who converts one existing client to a retainer earns the same but becomes structurally more resilient. Effort operates within structure. Strategy changes it."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="You do not improve income stability by earning more. You improve it by changing how your income is built." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/how-to-measure-income-stability", label: "How to Measure Income Stability" },
          { href: "/learn/what-is-income-structure", label: "What Is Income Structure" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "How quickly can income stability improve?",
            a: "Structural changes produce immediate score changes. Converting a client to a retainer, signing a new contract, or adding an income source changes the dimensional inputs on the day it happens. Meaningful score improvement — moving from one stability tier to the next — typically requires two to four targeted structural changes, which most earners can implement within three to six months.",
          },
          {
            q: "Does earning more improve my stability score?",
            a: "Not directly. The stability score measures structure, not amount. Earning more from the same structure in the same proportions does not change the score. However, if additional income comes from a new source, it improves diversification. The source of additional income matters more than the amount.",
          },
          {
            q: "What is the single highest-impact change most people can make?",
            a: "For most earners, reducing concentration in their largest income source produces the greatest score improvement. This can be achieved by adding a new source, converting an existing relationship to a more protected arrangement, or growing smaller sources to reduce the proportional dominance of the largest one.",
          },
          {
            q: "Can a salaried employee improve their stability score?",
            a: "Yes. A salaried employee can negotiate an employment contract with defined terms, add a secondary income source such as consulting or rental income, or seek positions with contractual protections like severance agreements. Any structural change that reduces single-source concentration or increases contractual protection improves the score.",
          },
          {
            q: "Is it better to add new income sources or protect existing ones?",
            a: "It depends on your current dimensional profile. If concentration is your weakest dimension, adding sources has more impact. If forward visibility is your weakest dimension, protecting existing sources with contracts has more impact. The stability score identifies which action produces the greatest improvement for your specific structure.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Build a Stronger Income Foundation"
        sub="Identify your weakest structural dimension and get a targeted improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
