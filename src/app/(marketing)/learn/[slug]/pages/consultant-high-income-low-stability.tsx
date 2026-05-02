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
  StickyLearnCTA,
  ScenarioExtension,
} from "@/components/learn/LearnComponents";

export default function ConsultantHighIncomeLowStability() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Scenario Analysis"
        title="Consultant — High Income, Low Stability"
        definition="A consultant earning $400K from two clients with no contracts is structurally more fragile than a consultant earning $150K from five clients on retainer."
        subtitle="Income level and income stability are independent measurements. This scenario illustrates why."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Two-client concentration means a single departure eliminates 40-60% of total income",
          "Project-based work with no contracts carries zero forward revenue visibility",
          "The $400K income creates a lifestyle and cost structure that the underlying structure cannot reliably support",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "High income as a structural liability",
            body: (
              <>
                <P>
                  A consultant earning $400,000 annually from two clients on a project basis has achieved an income level that places them in the top percentile of independent earners. The income is real, the work is demanding, and the expertise that commands this rate is genuine. But the income stability model does not measure expertise or income level — it measures the structural characteristics of how that income is generated, protected, and exposed to disruption.
                </P>
                <P>
                  Two clients means extreme concentration. If the income is split 60/40, the larger client represents $240,000 — a sum that would constitute a comfortable full-time salary for most professionals. The loss of that single client eliminates 60% of total income in a single event. With no contract governing the engagement, no termination notice requirement, and no minimum commitment, the client can end the relationship at any time for any reason with zero financial consequence to themselves.
                </P>
                <P>
                  The high income level compounds the structural risk because it typically supports a commensurate cost structure. A consultant earning $400,000 is likely carrying a mortgage, car payments, educational expenses, and lifestyle obligations calibrated to that income level. When the income drops by $240,000 in a single event, the expense base does not adjust proportionally. The gap between structural income capacity (what the remaining client provides) and committed expenses creates immediate financial pressure.
                </P>
              </>
            ),
          },
          {
            heading: "Why two clients is not diversification",
            body: (
              <>
                <P>
                  Diversification in the income stability model requires sufficient source distribution such that the loss of any single source creates a manageable reduction rather than a crisis. With two clients, no distribution is sufficient. A 50/50 split means each client represents half of total income — losing either one is a crisis. A 60/40 or 70/30 split is worse because the larger client&apos;s departure is catastrophic. Two clients is structurally equivalent to one client from a concentration risk perspective because the loss of either creates an unmanageable income gap.
                </P>
                <P>
                  The consultant earning $150,000 from five clients on retainer has meaningfully lower income but meaningfully better diversification. No single client represents more than 25-30% of total revenue. The retainer agreements provide forward commitment and termination protection. The loss of any single client reduces income by $30,000-$45,000 — a significant but survivable reduction that does not threaten the consultant&apos;s ability to meet financial obligations during the replacement period.
                </P>
                <P>
                  The model scores the $400,000 consultant in the 18-28 range and the $150,000 consultant in the 55-70 range. The 30-40 point gap is driven by three structural factors: concentration (2 clients vs. 5), contractual protection (none vs. retainer agreements), and forward visibility (zero vs. committed forward revenue). Income level is not a factor in the calculation — it is the structural characteristics that determine the score.
                </P>
              </>
            ),
          },
          {
            heading: "The path from high income to high stability",
            body: (
              <>
                <P>
                  Converting from a high-income, low-stability configuration to a high-income, high-stability configuration requires addressing three structural deficiencies simultaneously: concentration, contractual protection, and forward commitment. The consultant must add clients, formalize arrangements, and lock forward revenue — without reducing total income to the point where the structural improvement is offset by an unsustainable income decline.
                </P>
                <P>
                  The most direct path is to formalize the existing two relationships with retainer agreements while adding three to four additional clients. If the two existing clients are converted to retainers at $12,000-$15,000 per month with six-month terms, that provides $144,000-$180,000 in committed annual revenue. Adding three more retainer clients at $5,000-$8,000 per month adds $180,000-$288,000. The total can approach or exceed $400,000 with five to six clients, all on retainer, providing diversification and forward commitment.
                </P>
                <P>
                  This restructuring takes time — typically 12-18 months to add clients and formalize arrangements without disrupting existing relationships. During the transition, the consultant operates in a blended profile: some retainer income, some project income, improving concentration. The model scores the profile as it exists at any point, and each incremental structural improvement produces a measurable score increase. The destination is a configuration where high income and high stability coexist — achievable, but requiring deliberate structural changes.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Scenario Extension */}
      <ScenarioExtension
        setup="A consultant earning $400,000 annually from two clients. Client A: $240,000 (60%). Client B: $160,000 (40%). Both engagements are project-based with no retainer agreements, no minimum commitments, and no termination notice requirements. Engagements are renewed informally on a quarterly basis."
        riskExposure="Extreme concentration — two clients, with the larger representing 60% of total income. Zero forward visibility — no contractual commitment beyond the current project scope. Zero termination protection — either client can end the engagement immediately. The combination of high concentration, no contracts, and no forward commitment creates maximum structural exposure."
        disruption="The larger client ($240,000) does not renew. The client's new CFO has mandated a reduction in external consulting spend, and the engagement is not continued into the next quarter. The consultant loses 60% of total income in a single event with no notice period, no transition support, and no contractual remedy. Remaining income: $160,000 from one client."
        scoreRange="18-28. The score reflects extreme client concentration, zero contractual protection, zero forward revenue commitment, and the binary nature of two-client dependency. Despite the $400,000 income level, the structural profile is among the weakest the model evaluates."
        howToFix="Diversify the client base to five or more clients. Formalize all engagements with retainer agreements including minimum six-month terms and 90-day termination notice clauses. Lock forward revenue commitments. Reduce dependency on any single client to below 30% of total income. The goal is to maintain high income while adding the structural protections that convert it from fragile to durable."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={10} atRisk={85} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Largest client does not renew"
        setup="A consultant earning $400,000 from two project-based clients. Client A provides $240,000 (60%), Client B provides $160,000 (40%). No retainer agreements. No forward commitments. Engagements are renewed informally each quarter."
        risk="Client A's organization undergoes leadership change. The new executive team conducts a vendor review and decides to consolidate external consulting relationships. The consultant's engagement is not renewed. No termination notice is required. The consultant learns of the decision when the expected renewal call does not arrive."
        outcome="Income drops from $400,000 to $160,000 — a 60% reduction from a single client event. The consultant's financial obligations, calibrated to $400,000, now exceed their income from the remaining client. The replacement timeline for a client generating $240,000 annually is 3-6 months in most consulting markets. During this period, the consultant operates at 40% of their previous income with a cost structure built for 100%."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="High Income"
        right="High Stability"
        explanation="High income means a large total number. High stability means that total is structurally protected against disruption. A consultant earning $400,000 from two clients with no contracts has high income and low stability. A consultant earning $150,000 from five clients on retainer has lower income and high stability. The model measures stability independently of income level because they are independent structural characteristics."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A $400K income from two clients with no contracts is not a $400K practice — it is a $160K practice that happens to have a second client right now." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/consultant-no-contracts-vs-retainers", label: "Scenario: Consultant — No Contracts vs Retainers" },
          { href: "/learn/income-stability-consultants", label: "Income Stability for Consultants" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-stability-vs-income", label: "Income Stability vs Income" },
          { href: "/learn/income-stability-vs-net-worth", label: "Income Stability vs Net Worth" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is it possible to maintain $400K income with high stability?",
            a: "Yes. A consultant earning $400,000 from five or six clients on retainer agreements with forward commitments can score in the 55-70 range. The income level is not the constraint — the structure is. The path requires adding clients, formalizing arrangements, and distributing revenue across a broader base. It takes time but is achievable without reducing total income.",
          },
          {
            q: "Why does the model score a $150K consultant higher than a $400K consultant?",
            a: "Because the model measures structural characteristics, not income level. The $150K consultant with five retainer clients has better diversification, contractual protection, and forward visibility. The $400K consultant with two project-based clients has extreme concentration, no contractual protection, and zero forward commitment. These structural differences produce the score difference. Income level is not a factor in the calculation.",
          },
          {
            q: "How long does it take to restructure a two-client practice?",
            a: "Typically 12-18 months to add three to four additional client relationships while formalizing the existing two with retainer agreements. The constraint is not finding clients — it is finding clients at fee levels that maintain total income while adding structural protection. The transition involves accepting some temporary income reduction or increased workload while the new client base matures. Each incremental addition improves the structural score.",
          },
          {
            q: "What if my clients won't sign retainer agreements?",
            a: "Some clients prefer project-based arrangements for their own budgeting reasons. If retainer agreements are not achievable, alternative structural improvements include: multi-phase project commitments with defined scopes, master service agreements with minimum annual spend commitments, or engagement letters with 60-90 day termination notice clauses. Each adds incremental structural protection even if a formal retainer is not feasible. The goal is to move from zero forward commitment toward any form of contractual persistence.",
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
