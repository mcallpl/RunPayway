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

export default function DoctorSalaryVsPrivatePractice() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Doctor — Salary vs Private Practice"
        definition="An employed physician earning $350K from one hospital and an independent physician earning $350K from their own practice have fundamentally different stability profiles."
        subtitle="Same income, same profession, same credentials. Different employment structures. Different structural exposure."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Employment structure determines whether $350K is fragile or durable",
          "Single-employer dependency creates a different risk than patient concentration and overhead exposure",
          "Neither model is inherently superior — each carries distinct structural vulnerabilities",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Two physicians, one income, two structures",
            body: (
              <>
                <P>
                  An employed physician earning $350,000 annually from a single hospital system receives a W-2, benefits, and the administrative simplicity of a salaried role. The hospital handles billing, malpractice coverage, staffing, and facility costs. The physician shows up, practices medicine, and collects a paycheck. This arrangement is often described as &quot;secure,&quot; but that characterization conflates convenience with structural stability.
                </P>
                <P>
                  The structural reality is that 100% of this physician&apos;s income originates from a single source. If the hospital restructures its compensation model, eliminates the position, or merges with another system that already has coverage in this specialty, the physician&apos;s entire income disappears in a single event. There is no second source, no partial buffer, no diversified revenue base to absorb the disruption.
                </P>
                <P>
                  A physician in private practice earning the same $350,000 draws income from hundreds of individual patient relationships, multiple payer contracts, and possibly ancillary services. The income is structurally distributed across many sources — but it also carries overhead obligations, staff payroll, lease commitments, and malpractice exposure that the employed physician does not bear. The risk is different in character, not necessarily in magnitude.
                </P>
              </>
            ),
          },
          {
            heading: "Why the same income produces different scores",
            body: (
              <>
                <P>
                  The income stability model does not evaluate income amount — it evaluates income structure. For the employed physician, the model identifies single-source dependency as the dominant risk factor. One employer controls the entirety of the income stream. The physician has no contractual claim on future compensation beyond whatever employment agreement governs the relationship, and most physician employment contracts include termination-without-cause provisions with 90 to 180 days of notice.
                </P>
                <P>
                  For the private practice physician, the model identifies a more complex risk profile. Income is distributed across many patients and payers, which reduces concentration risk. However, the practice carries fixed overhead — rent, staff, equipment leases, malpractice premiums — that must be serviced regardless of patient volume. A malpractice suit, a payer contract dispute, or a sustained decline in patient volume creates financial pressure that compounds because expenses do not scale down with revenue.
                </P>
                <P>
                  The employed physician scores in the 40-55 range, reflecting moderate stability undermined by extreme source concentration. The private practice physician scores in the 35-60 range, with the wide band reflecting variation in how well the practice is diversified, how much overhead leverage exists, and whether multiple revenue streams (clinical, ancillary, consulting) are present.
                </P>
              </>
            ),
          },
          {
            heading: "Disruption reveals the structural difference",
            body: (
              <>
                <P>
                  When the hospital restructures its physician compensation model — shifting from guaranteed salary to a productivity-based RVU model, for example — the employed physician&apos;s $350,000 may drop to $280,000 or lower with no recourse. The physician did not lose their job, but the income structure changed unilaterally. The physician&apos;s only leverage is the threat of departure, which requires finding another position in a market where most hospital systems are implementing similar models.
                </P>
                <P>
                  When a private practice physician faces a malpractice suit, the disruption is different in character but equally destabilizing. Even with insurance coverage, a lawsuit consumes physician time, creates reputational risk, and may cause patient attrition. If the suit is publicized, referral patterns may shift. The financial impact extends beyond legal costs into revenue reduction, and the overhead obligations continue regardless.
                </P>
                <P>
                  Neither disruption scenario is hypothetical. Hospital compensation restructuring is an ongoing trend in healthcare administration. Malpractice exposure is an inherent feature of clinical practice. The stability model measures how the income structure responds to these foreseeable events — not whether the physician is talented, dedicated, or well-credentialed. Structure determines outcome when conditions change.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="Two physicians, both earning $350,000 annually. Physician A is employed by a single hospital system on a salaried contract. Physician B operates an independent practice with approximately 800 active patients, three payer contracts, and a four-person staff."
        riskExposure="Physician A: single-source dependency — 100% of income originates from one employer. No diversification, no alternative revenue streams. Physician B: patient concentration risk (top 5% of patients may represent 15-20% of revenue), overhead obligations ($180,000+ annually in fixed costs), and payer contract dependency."
        disruption="Physician A: hospital restructures compensation from guaranteed salary to productivity-based RVU model, reducing effective income by $70,000. Physician B: malpractice suit creates 18-month disruption — legal costs absorbed by insurance, but patient volume drops 15% due to reputational impact while overhead remains fixed."
        scoreRange="Physician A (employed): 40-55, reflecting moderate stability undermined by extreme source concentration. Physician B (private practice): 35-60, with the wide range reflecting variation in diversification, overhead leverage, and revenue stream count."
        howToFix="Physician A: negotiate a multi-year employment contract with guaranteed minimum compensation, or develop a secondary income source (medical directorships, consulting, telemedicine). Physician B: add revenue streams beyond direct clinical care (ancillary services, consulting, medical device advisory), reduce overhead leverage, and diversify payer mix to reduce single-payer concentration."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={30} recurring={25} atRisk={45} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Hospital restructures physician compensation"
        setup="A physician earning $350,000 on a guaranteed salary from a single hospital system. The employment contract includes a 90-day termination-without-cause provision. No secondary income sources. No private patients outside the hospital system."
        risk="The hospital announces a transition from guaranteed salary to a productivity-based RVU model. The new model ties compensation directly to patient volume and procedure count. The physician's effective income drops to $280,000 — a $70,000 reduction with no structural buffer. The physician has no alternative income stream to offset the reduction."
        outcome="The physician's income stability score drops from the mid-40s to the low-30s. The score was already constrained by single-source dependency; the compensation restructuring confirms the vulnerability that the model identified. The physician must either accept the reduction, negotiate from a position of limited leverage, or seek a new position in a market where similar restructuring is widespread."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Employed Security"
        right="Ownership Control"
        explanation="Employed security provides predictability and administrative simplicity but concentrates all income in a single source controlled by someone else. Ownership control distributes income across many sources and provides structural autonomy but introduces overhead leverage, operational complexity, and liability exposure. The stability model measures which structure creates greater resilience under disruption — not which is more convenient during normal operations."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A physician earning $350K from one hospital has the same structural vulnerability as anyone earning 100% of their income from a single source — the credential does not change the concentration risk." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-doctors", label: "Income Stability for Doctors" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/income-stability-vs-income", label: "Income Stability vs Income" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is employed physician income really less stable than private practice?",
            a: "Not necessarily less stable in absolute terms, but differently structured. Employed income concentrates all revenue in a single source, creating a binary risk profile — the income either continues or it doesn't. Private practice distributes income across many patients and payers, creating a more granular risk profile where disruptions tend to reduce income incrementally rather than eliminate it entirely. The model measures structural characteristics, not subjective assessments of safety.",
          },
          {
            q: "Does a multi-year contract change the employed physician's score?",
            a: "Yes, meaningfully. A multi-year employment contract with guaranteed minimum compensation converts a portion of the physician's income from at-will to contractually protected. The longer the guaranteed term and the stronger the termination provisions, the higher the structural protection. A three-year contract with a guaranteed base shifts the score upward within the employed range because it adds forward commitment and reduces the employer's ability to make unilateral changes.",
          },
          {
            q: "What about physicians who work for multiple hospital systems?",
            a: "A physician earning income from two or more independent hospital systems has meaningfully better source diversification than a physician dependent on a single system. If one system restructures compensation or eliminates the position, the physician retains income from the other source. The model recognizes multi-source arrangements as structurally superior to single-source dependency, even when the total income is the same.",
          },
          {
            q: "How does malpractice insurance affect the private practice score?",
            a: "Malpractice insurance mitigates the financial impact of litigation but does not eliminate the structural disruption. A lawsuit consumes physician time, may reduce patient volume through reputational impact, and creates uncertainty that affects practice operations. The model accounts for insurance as a protective factor but recognizes that litigation risk extends beyond direct financial liability into operational disruption and revenue impact.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Assess Your Physician Income", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Measure Your Physician Income Structure"
        sub="Get your income stability score and understand exactly how your employment arrangement affects your structural position."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
