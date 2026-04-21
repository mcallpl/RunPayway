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
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityDoctors() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Doctors"
        definition="Physician income appears stable because the employer system is stable. But it depends on one institution, one contract, and one set of terms that can change without notice."
        subtitle="Why a high salary does not automatically mean a stable salary."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Employed physicians face single-employer concentration risk",
          "RVU-based compensation introduces variable income exposure",
          "Most physicians score between 45 and 65 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How physician income works",
            body: (
              <>
                <P>
                  Physician compensation operates through two primary models: employed and independent. Approximately 74% of practicing physicians are now employed by hospitals, health systems, or corporate entities. Employed physicians typically receive a base salary supplemented by productivity bonuses tied to Relative Value Units (RVUs) — a standardized measure of work volume. The base salary creates a contractual floor, while RVU bonuses can add 20% to 50% or more to total compensation.
                </P>
                <P>
                  Independent physicians — those in private practice or physician-owned groups — earn through collections on services rendered. Their income depends on patient volume, payer mix, reimbursement rates, and overhead management. This model offers more control but less structural predictability than employment. Independent physicians carry the full financial risk of their practice operations.
                </P>
                <P>
                  In both models, physician income is high relative to the general population. Specialists frequently earn $300,000 to $600,000 or more annually. This high absolute income creates the perception of stability. But income level and income structure are distinct measurements. A physician earning $450,000 from a single employer under a contract that can be modified annually has a different structural profile than that income level suggests.
                </P>
              </>
            ),
          },
          {
            heading: "Why single-employer dependency is the hidden risk",
            body: (
              <>
                <P>
                  The structural risk for employed physicians is concentration — not in clients or matters, but in a single employer. One institution determines salary, bonus structure, schedule, location, and contract terms. If that institution restructures, merges, downsizes, or changes its compensation model, the physician&apos;s income changes accordingly. There is no secondary income source to buffer the adjustment.
                </P>
                <P>
                  Contract terms are the mechanism through which this risk manifests. Physician employment contracts typically include termination provisions (90 to 180 days notice), non-compete clauses (restricting practice within a geographic radius for 1 to 2 years after departure), and compensation adjustment clauses that allow the employer to modify RVU targets and bonus structures annually. These provisions mean the employer holds significant leverage over the physician&apos;s income trajectory.
                </P>
                <P>
                  The non-compete clause creates an additional layer of structural vulnerability. A physician whose contract is terminated or whose compensation is significantly reduced may be unable to practice within their established community for one to two years. This means the disruption is not merely financial — it may require relocation, rebuilding a patient base, or accepting terms from another employer in a different market. The recovery cost is substantially higher than the income loss alone.
                </P>
              </>
            ),
          },
          {
            heading: "What physicians can do to strengthen stability",
            body: (
              <>
                <P>
                  Contract negotiation is the most direct lever. Longer termination notice periods, limitations on non-compete scope, and guaranteed minimum compensation terms all create structural protection. A physician with a 12-month termination notice period and a narrowly defined non-compete has significantly more structural resilience than one with 90-day notice and a broad geographic restriction.
                </P>
                <P>
                  Income diversification outside of clinical employment also improves stability. Medical consulting, expert witness work, medical directorship roles, telemedicine contracts, and real estate investments are common diversification strategies for physicians. These create income streams that are not dependent on a single employer and persist even if the primary employment relationship changes.
                </P>
                <P>
                  For independent physicians, payer diversification and multi-location practice reduce concentration risk. A practice dependent on a single payer contract or a single facility has structural exposure similar to an employed physician with a single employer. Diversifying across payers, locations, and service types creates the resilience that independence is supposed to provide but does not automatically deliver.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Medicine"
        howIncomeWorks="Employed physicians receive base salary plus RVU-based productivity bonuses. Independent physicians earn through collections on services rendered. Base salaries range from $200,000 to $500,000+ depending on specialty. RVU bonuses add 20-50% to base. Contract terms — termination notice, non-competes, compensation adjustment clauses — define the structural framework."
        typicalRange="45-65. Employed physicians with strong contract terms and supplementary income score toward the upper range. Physicians with short termination notice periods, broad non-competes, and no income diversification score toward the lower range. Independent physicians vary widely based on payer mix and practice structure."
        biggestRisk="Single-employer dependency. One institution controls salary, bonus structure, schedule, and contract terms. Restructuring, merger activity, or compensation model changes can alter income substantially with limited notice. Non-compete clauses restrict the physician's ability to recover quickly by practicing in the same community."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={35} recurring={25} atRisk={40} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Hospital system restructures compensation model"
        setup="Employed cardiologist earning $520,000 annually — $340,000 base salary plus $180,000 in RVU bonuses. Single employer, no outside income. Contract includes 90-day termination notice and 18-month, 30-mile non-compete clause. Has practiced in the same community for 12 years."
        risk="The hospital system merges with a larger network. New leadership restructures the compensation model, reducing RVU bonus rates by 35% and increasing volume thresholds. The physician's projected income under the new model: $400,000 — a $120,000 reduction. The alternative is departure, but the non-compete restricts practice within 30 miles for 18 months."
        outcome="The physician faces a binary choice: accept a 23% income reduction or relocate to practice outside the non-compete zone. Neither option preserves the previous income structure. Estimated stability score: 44-52. The salary appeared stable until the single employer changed the terms."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="High Salary"
        right="Stable Salary"
        explanation="A high salary measures the amount of income received. A stable salary measures the structural protection around that income. A physician earning $500,000 from a single employer with a 90-day termination clause and broad non-compete has high income but moderate structural protection. The salary can be functionally reduced by compensation restructuring with limited recourse."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A physician's income feels permanent because the institution feels permanent. But institutions change terms, restructure compensation, and enforce non-competes — and the stability disappears with the contract revision." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-lawyers", label: "Income Stability for Lawyers" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
          { href: "/learn/income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I'm employed with a stable hospital — why would my score not be higher?",
            a: "Employment provides a contractual floor, which is reflected positively in the score. But single-employer concentration limits the ceiling. Your income depends on one institution's continued willingness and ability to maintain current terms. Contract modification, restructuring, or termination can alter your income with as little as 90 days' notice. The score reflects this structural dependency.",
          },
          {
            q: "Does my specialty affect my stability score?",
            a: "Specialty affects earning potential and demand dynamics but not the structural assessment directly. A surgeon earning $600,000 from one employer has the same single-employer concentration risk as a family medicine physician earning $250,000 from one employer. The amount at risk differs, but the structural exposure is similar. Specialties with higher demand may recover faster from disruption, but the structural vulnerability is comparable.",
          },
          {
            q: "How does a non-compete clause affect my score?",
            a: "Non-compete clauses restrict your ability to recover from income disruption. A broad non-compete (large geographic radius, long duration) means that if your employment relationship ends, you cannot practice in your established community — forcing relocation or a career pause. This recovery restriction is a structural vulnerability that reduces resilience and is factored into the score.",
          },
          {
            q: "Would owning my own practice improve my score?",
            a: "It depends on the practice structure. An independent practice with diversified payer contracts, multiple locations, and a strong patient base can score higher than single-employer employment. But a solo practice dependent on one payer contract or one hospital affiliation may score similarly or lower. Independence creates the potential for higher stability, but only if the practice structure actually delivers diversification.",
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
