import type { Metadata } from "next";
import PageContainer from "@/components/layout/PageContainer";
import AccordionSection from "@/components/reference-guide/AccordionSection";

export const metadata: Metadata = {
  title: "Reference Guide \u2014 RunPayway\u2122",
  description:
    "Complete reference guide for the RunPayway Income Structure Diagnostic. Methodology, rating bands, calibration, and interpretation discipline.",
};

export default function ReferenceGuidePage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
            RunPayway&#8482; Reference Guide
          </h1>
          <p className="text-gray-500 text-sm mb-12">
            Complete reference for the Income Structure Diagnostic.
          </p>

          <div className="border-t border-gray-200">
            {/* Section 1: What RunPayway Is */}
            <AccordionSection title="What RunPayway Is">
              <p>
                RunPayway&#8482; is a structured diagnostic tool that measures
                how an individual or organization generates, concentrates, and
                depends on income.
              </p>
              <p>
                It produces a single deterministic index &mdash; the{" "}
                <strong>Payway Rating</strong> &mdash; on a 0&ndash;100 scale.
                This rating reflects the degree to which income relies on
                ongoing direct involvement, or is supported by structural
                mechanisms that sustain revenue independently of personal
                effort.
              </p>
              <p>
                RunPayway does not predict income levels, evaluate business
                quality, or provide financial advice. It classifies structural
                dependency &mdash; nothing more.
              </p>
            </AccordionSection>

            {/* Section 2: Why It Exists */}
            <AccordionSection title="Why It Exists">
              <p>
                Most professionals and business operators have no structured way
                to evaluate how their income actually works.
              </p>
              <p>
                Revenue is often discussed in terms of amount &mdash; how much
                is earned, how fast it grows, or how it compares to a
                benchmark. But the structure of that revenue &mdash; how it
                flows, what sustains it, and what happens when direct attention
                stops &mdash; is rarely measured.
              </p>
              <p>
                RunPayway exists to fill that gap. It provides a formal,
                repeatable classification of income structure so that
                individuals and businesses can see where they fall on the
                spectrum between fully dependent and fully supported revenue.
              </p>
            </AccordionSection>

            {/* Section 3: Who It Is For */}
            <AccordionSection title="Who It Is For">
              <p>
                RunPayway is designed for professionals and business operators
                whose income is tied to contracts, client relationships,
                transactions, or service delivery.
              </p>
              <p>This includes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Independent contractors and consultants</li>
                <li>Freelancers with project-based revenue</li>
                <li>Small business owners with client-dependent models</li>
                <li>Sales professionals with commission or pipeline exposure</li>
                <li>
                  Agency founders managing recurring client relationships
                </li>
                <li>
                  Professionals in real estate, legal, financial, or creative
                  services
                </li>
              </ul>
              <p>
                RunPayway is not designed for salaried employees with no
                variable income, passive investors with no operational role, or
                retirees with fixed income streams.
              </p>
            </AccordionSection>

            {/* Section 4: Calibration */}
            <AccordionSection title="Calibration">
              <p>
                Before answering the diagnostic questions, each respondent
                selects three calibration inputs:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Industry</strong> &mdash; The sector in which the
                  individual or business primarily operates.
                </li>
                <li>
                  <strong>Revenue Model</strong> &mdash; The primary mechanism
                  through which income is generated (e.g., project-based,
                  retainer, commission).
                </li>
                <li>
                  <strong>Role</strong> &mdash; The respondent&apos;s function
                  within the revenue process (e.g., owner-operator, account
                  manager, solo practitioner).
                </li>
              </ul>
              <p>
                These calibration inputs adjust the relative weight of each
                question group within the scoring model. They do not change the
                scoring logic, the answer values, or the rating band
                thresholds. Calibration ensures that the diagnostic reflects
                the structural reality of different income environments.
              </p>
            </AccordionSection>

            {/* Section 5: Methodology */}
            <AccordionSection title="Methodology">
              <p>
                The RunPayway diagnostic consists of{" "}
                <strong>12 structured questions</strong> divided into three
                groups:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Core Revenue Flow</strong> (Questions 1&ndash;4)
                  &mdash; Measures the foundational mechanisms of income
                  generation.
                </li>
                <li>
                  <strong>Modifiers</strong> (Questions 5&ndash;8) &mdash;
                  Captures concentration, client dynamics, and contractual
                  exposure.
                </li>
                <li>
                  <strong>Stability Indicators</strong> (Questions 9&ndash;12)
                  &mdash; Evaluates predictability, trend direction, and
                  structural resilience.
                </li>
              </ul>
              <p>
                Each question has four answer options (A, B, C, D). Each answer
                maps to a fixed integer value. Higher values indicate greater
                structural support; lower values indicate greater dependency on
                direct involvement.
              </p>
              <p>
                The three groups are weighted according to the calibration
                profile. The final Payway Rating is a normalized score from 0
                to 100, calculated deterministically. Identical inputs always
                produce identical outputs.
              </p>
            </AccordionSection>

            {/* Section 6: Rating Bands */}
            <AccordionSection title="Rating Bands">
              <p>
                The Payway Rating maps to one of four classification bands:
              </p>
              <div className="space-y-4 mt-2">
                <div className="border-l-4 border-emerald-600 pl-4">
                  <p className="font-semibold text-navy-900">
                    80&ndash;100 &mdash; Structurally Supported
                  </p>
                  <p className="text-sm">
                    Revenue continues with minimal direct involvement.
                    Structural mechanisms sustain income independently.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-navy-900">
                    60&ndash;79 &mdash; Mixed Structural Support
                  </p>
                  <p className="text-sm">
                    Some structural support exists, but income still depends
                    partially on ongoing involvement.
                  </p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <p className="font-semibold text-navy-900">
                    40&ndash;59 &mdash; Attention-Weighted
                  </p>
                  <p className="text-sm">
                    Revenue is primarily driven by direct effort and attention.
                    Limited structural support is present.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-semibold text-navy-900">
                    0&ndash;39 &mdash; Attention-Dependent
                  </p>
                  <p className="text-sm">
                    Income requires continuous direct involvement. Revenue
                    stops or declines quickly without active participation.
                  </p>
                </div>
              </div>
              <p className="mt-2">
                Band thresholds are fixed and do not change based on
                calibration or any external input.
              </p>
            </AccordionSection>

            {/* Section 7: Composition */}
            <AccordionSection title="Composition">
              <p>
                The report includes a{" "}
                <strong>Structural Revenue Composition</strong> breakdown,
                which shows the proportion of the Payway Rating attributable
                to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Structural Revenue</strong> &mdash; The share
                  supported by Core Revenue Flow and Stability Indicators.
                </li>
                <li>
                  <strong>Direct Involvement</strong> &mdash; The share
                  dependent on Modifiers (concentration, client dynamics,
                  contractual exposure).
                </li>
              </ul>
              <p>
                This composition is expressed as a percentage split (e.g., 62%
                Structural / 38% Direct Involvement). It provides a secondary
                lens on how the rating was formed, helping distinguish between
                two entities with the same numeric rating but different
                structural profiles.
              </p>
            </AccordionSection>

            {/* Section 8: Pressure Sensitivity */}
            <AccordionSection title="Pressure Sensitivity">
              <p>
                The <strong>Structural Exposure Profile</strong> section of the
                report provides four indicators:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Structural Pressure Sensitivity</strong> &mdash; A
                  composite index measuring how sensitive the income structure
                  is to external disruption. Derived from the inverse
                  contribution of each question group.
                </li>
                <li>
                  <strong>Attention Dependence Impact</strong> &mdash; Reflects
                  the degree to which revenue depends on direct personal
                  involvement, derived from the Direct Involvement percentage
                  in the composition.
                </li>
                <li>
                  <strong>Contract Disruption Impact</strong> &mdash; Evaluates
                  exposure to contract-related revenue loss, based on
                  contractual structure and renewal dependency responses.
                </li>
                <li>
                  <strong>Client Turnover Impact</strong> &mdash; Assesses the
                  risk posed by client concentration and acquisition
                  dependency, based on revenue concentration and client
                  acquisition responses.
                </li>
              </ul>
              <p>
                Each indicator is expressed as a labeled severity level (e.g.,
                Low, Moderate, Elevated, High). These are derived from fixed
                formulas and are not influenced by external benchmarks.
              </p>
            </AccordionSection>

            {/* Section 9: What It Is Not */}
            <AccordionSection title="What It Is Not">
              <p>RunPayway is not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>A credit score or financial rating</li>
                <li>An income prediction tool</li>
                <li>A business valuation model</li>
                <li>A financial planning or advisory service</li>
                <li>A comparison tool against other individuals or entities</li>
                <li>A recommendation engine for business strategy</li>
              </ul>
              <p>
                The Payway Rating measures structural dependency. It does not
                evaluate income quality, growth potential, profitability, or
                market position. The rating is a classification, not a
                judgment.
              </p>
            </AccordionSection>

            {/* Section 10: When to Reassess */}
            <AccordionSection title="When to Reassess">
              <p>
                A Payway Rating reflects the structural state of income at the
                time of assessment. It is not a permanent classification.
              </p>
              <p>Reassessment may be appropriate when:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Revenue model or primary income source changes</li>
                <li>Client or contract base undergoes significant turnover</li>
                <li>
                  Business operations shift (e.g., from project-based to
                  retainer)
                </li>
                <li>
                  Role within the revenue process changes (e.g., from solo
                  practitioner to team lead)
                </li>
                <li>Six or more months have passed since the last assessment</li>
              </ul>
              <p>
                Each assessment is independent. Previous ratings do not
                influence future results.
              </p>
            </AccordionSection>

            {/* Section 11: Regulatory Boundary */}
            <AccordionSection title="Regulatory Boundary">
              <p>
                RunPayway&#8482; is a self-service diagnostic tool. It is not a
                regulated financial product, and it does not provide:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Investment advice</li>
                <li>Tax guidance</li>
                <li>Legal counsel</li>
                <li>Credit evaluation</li>
                <li>Insurance underwriting</li>
              </ul>
              <p>
                The Payway Rating is not intended to be used as the basis for
                any financial, legal, or regulatory decision. Users should
                consult appropriate licensed professionals for advice specific
                to their circumstances.
              </p>
            </AccordionSection>

            {/* Section 12: Interpretation Discipline */}
            <AccordionSection title="Interpretation Discipline">
              <p>
                The Payway Rating is designed to be read as-is. It is a
                structural classification, not a performance indicator.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  A high rating does not mean &ldquo;good&rdquo; income. It
                  means structural support is present.
                </li>
                <li>
                  A low rating does not mean &ldquo;bad&rdquo; income. It means
                  income is more dependent on direct involvement.
                </li>
                <li>
                  The rating does not account for income amount, growth rate,
                  or satisfaction.
                </li>
                <li>
                  Comparisons between individuals in different industries or
                  roles should consider the calibration context.
                </li>
              </ul>
              <p>
                The correct use of the Payway Rating is to understand where
                you fall on the spectrum of structural dependency &mdash; not
                to evaluate whether your position is inherently better or worse
                than another.
              </p>
            </AccordionSection>

            {/* Section 13: Governance */}
            <AccordionSection title="Governance">
              <p>
                RunPayway&#8482; is operated by PeopleStar Enterprises, Inc.
              </p>
              <p>
                The diagnostic model, scoring engine, calibration profiles, and
                output logic are maintained under a formal version control
                framework. Changes to the model are governed by the following
                principles:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  All model changes are versioned and documented internally.
                </li>
                <li>
                  Scoring logic, band thresholds, and answer mappings are
                  locked at each model version.
                </li>
                <li>
                  Calibration profiles may be updated between model versions
                  under independent sub-versioning.
                </li>
                <li>
                  Output logic (labels, composition formulas, exposure
                  indicators) is versioned separately from the scoring engine.
                </li>
                <li>
                  Every generated report is stamped with the model version and
                  sub-component versions used at the time of assessment.
                </li>
              </ul>
              <p>
                This governance structure ensures reproducibility, traceability,
                and consistency across all assessments.
              </p>
            </AccordionSection>

            {/* Section 14: Closing */}
            <AccordionSection title="Closing">
              <p>
                RunPayway&#8482; provides a structured, deterministic view of
                how income works &mdash; not how much income exists or whether
                it is growing.
              </p>
              <p>
                The Payway Rating is a classification tool. It measures one
                thing: the degree to which revenue depends on direct, ongoing
                involvement versus structural mechanisms that sustain income
                independently.
              </p>
              <p>
                Every assessment is self-contained. Every result is
                reproducible. Every report is versioned.
              </p>
              <p className="font-medium text-navy-900">
                This is the standard for income structure diagnostics.
              </p>
            </AccordionSection>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
