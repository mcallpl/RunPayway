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
} from "@/components/learn/LearnComponents";

export default function IncomeRiskExplained() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        title="Income Risk Explained"
        definition="Income risk is the probability and magnitude of income disruption based on structural factors — not market conditions or personal performance."
        subtitle="Risk that lives in the architecture, not the economy."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Income risk is structural, not situational.",
          "It measures how much income is exposed to disruption — and how severe that disruption would be.",
          "Market risk and income risk are independent variables.",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "What income risk actually measures",
            body: (
              <>
                <P>
                  Income risk is a measurement of structural vulnerability — the degree to which an income profile is exposed to disruption based on how it is constructed, not based on external economic conditions or the earner&apos;s skill level. It answers a specific question: given the current structure of this income, what is the probability of significant loss and how severe would that loss be?
                </P>
                <P>
                  This is distinct from the way risk is typically discussed in financial planning. Market risk refers to the probability that investment values decline. Business risk refers to the probability that a venture fails. Income risk refers to the probability that the structural arrangement of income sources produces a disruption event — a client termination, a contract expiration, a platform change — that eliminates a material share of total earnings.
                </P>
                <P>
                  Income risk is determined by concentration (how much income depends on a single source), protection (whether contracts or institutional arrangements prevent sudden termination), and recoverability (how quickly lost income can be replaced given the earner&apos;s structural position). These factors are observable and measurable before any disruption occurs.
                </P>
              </>
            ),
          },
          {
            heading: "Structural risk vs market risk",
            body: (
              <>
                <P>
                  The financial industry has developed sophisticated frameworks for measuring market risk, credit risk, and operational risk. Income risk has received almost no formal attention. This is partly because income was historically assumed to be stable — salaried employment provided a structural floor that made income disruption a relatively rare event. That assumption no longer holds for a substantial portion of the workforce.
                </P>
                <P>
                  Structural income risk differs from market risk in a critical way: it is endogenous to the income profile. Market risk is an external condition that affects many participants simultaneously. Structural income risk is specific to the individual earner&apos;s arrangement of sources, contracts, and dependencies. Two freelancers operating in the same market can have vastly different structural risk profiles based on how their income is assembled.
                </P>
                <P>
                  This means structural income risk can be reduced through architectural changes — adding sources, securing contracts, diversifying dependencies — without requiring any change in market conditions. It is, in this sense, more actionable than market risk. The earner has direct control over the structural factors that determine their exposure.
                </P>
              </>
            ),
          },
          {
            heading: "Measuring probability and magnitude",
            body: (
              <>
                <P>
                  Income risk has two dimensions: the probability that a disruption event occurs and the magnitude of income loss if it does. A profile with moderate probability but catastrophic magnitude (single-source dependency) may carry more total risk than a profile with higher probability but limited magnitude (well-diversified with one volatile component).
                </P>
                <P>
                  Probability is determined primarily by contractual coverage and dependency stability. Income protected by long-term contracts with defined termination provisions has lower disruption probability than income dependent on informal relationships or per-project engagement. Magnitude is determined primarily by concentration. When one source represents 80% of total income, the magnitude of its loss is severe regardless of probability.
                </P>
                <P>
                  The interaction of probability and magnitude produces the overall risk profile. The highest-risk positions combine high probability of disruption with high concentration of income in the exposed source. The lowest-risk positions combine contractual protection (low probability) with diversification (low magnitude per source).
                </P>
              </>
            ),
          },
        ]}
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={15} atRisk={75} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Tech contractor with one client and no contract"
        setup="Senior software contractor earning $195,000 annually. Engaged by a single enterprise client through a staffing agency. No direct contract with the end client. Agency agreement is terminable with 2 weeks notice. No other active client relationships. No recurring revenue from previous work."
        risk="The structural risk profile is severe across both dimensions. Probability of disruption is elevated because the engagement has no long-term contractual protection — 2 weeks notice is the only buffer. Magnitude is catastrophic because 100% of income is concentrated in a single source. The contractor has no structural mechanism to absorb even a partial disruption. Budget cuts, project cancellation, or vendor consolidation at the client level would terminate the entire income stream."
        outcome="RunPayway estimates a stability score of 12-20 for this profile. The contractor earns a premium rate for specialized work, but the income architecture carries near-maximum structural risk. The combination of single-source concentration, minimal contractual protection, and zero diversification creates a profile where income is one decision away from elimination."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Market Risk"
        right="Structural Risk"
        explanation="Market risk is an external condition that affects asset values broadly. Structural income risk is an internal property of how income is assembled — its concentration, contractual coverage, and dependency patterns. Market risk cannot be eliminated by the individual. Structural income risk can be reduced through deliberate architectural changes."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="Income risk is not about what might happen in the economy. It is about what is already true in your income structure." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-fragility-explained", label: "Income Fragility Explained" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/income-structure-explained", label: "Income Structure Explained" },
          { href: "/learn/income-stability-vs-income", label: "Income Stability vs Income" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Is income risk the same as job loss risk?",
            a: "No. Job loss risk is one component of income risk for employed individuals. Income risk encompasses the full structural exposure of all income sources — including concentration, contractual gaps, dependency overlaps, and recoverability. A person with three income sources and no contracts has income risk that has nothing to do with job loss.",
          },
          {
            q: "Can income risk be eliminated entirely?",
            a: "It can be reduced substantially but not eliminated entirely. Even highly diversified, contractually protected income carries residual risk from systemic events, regulatory changes, or simultaneous contract expirations. The goal is to reduce structural exposure to a level where no single disruption event produces a catastrophic income loss.",
          },
          {
            q: "How is income risk different from income volatility?",
            a: "Volatility measures how much income fluctuates period to period. Risk measures the probability and magnitude of a structural disruption. Income can be volatile (seasonal fluctuations) without being structurally at risk (multiple protected sources). Conversely, income can be steady for years and carry extreme structural risk that has simply not yet materialized.",
          },
          {
            q: "Does industry affect income risk?",
            a: "Industry creates context but does not determine risk. A real estate agent with a strong referral network and property management income has different structural risk than one dependent entirely on transaction commissions — even though both work in the same industry. Structure, not industry, is the primary determinant.",
          },
          {
            q: "Can insurance protect against income risk?",
            a: "Disability and business interruption insurance address specific disruption scenarios but do not change the structural risk profile of income itself. Insurance provides a financial buffer if disruption occurs. Income stability measurement identifies structural exposure so that the architecture itself can be improved.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Get My Stability Class", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Quantify Your Income Risk"
        sub="Get your income stability score — structural risk exposure, concentration analysis, and an improvement roadmap."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
