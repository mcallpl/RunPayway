export default function MethodologyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Model Documentation
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Income Stability Score™ — Model RP-1.0 | Version 1.0
        </p>
      </div>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Methodology Overview
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The Income Stability Score™ is a deterministic structural
          classification model developed by RunPayway™. The model evaluates
          the structural characteristics of an income system across six
          canonical input dimensions to produce a single integer score and
          corresponding stability classification band.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Purpose of the Model
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The model is designed to classify the structural stability of income
          systems. It provides a standardized framework for evaluating income
          durability, diversification, persistence, and predictability based
          on reported structural characteristics.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Model Inputs
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The diagnostic instrument consists of six questions that map to six
          canonical input fields. Each input is measured on a five-point scale
          and converted to integer values. The six input dimensions are:
        </p>
        <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside">
          <li>Recurring Revenue Base</li>
          <li>Income Concentration</li>
          <li>Income Source Count</li>
          <li>Forward Revenue Visibility</li>
          <li>Earnings Variability</li>
          <li>Income Continuity Without Active Labor</li>
        </ul>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Deterministic Scoring Framework
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Scoring is entirely deterministic. Identical inputs under the same
          model version always produce identical outputs. The model uses
          integer arithmetic only. No floating-point logic, machine learning,
          randomization, or adaptive scoring is used.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Inputs are grouped into two pillars: Structure (weighted at 60%) and
          Stability (weighted at 40%). The final score is a weighted integer
          average of the two pillar scores.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Stability Classification System
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The final score maps to one of four stability bands:
        </p>
        <div className="grid grid-cols-4 border border-gray-200 rounded overflow-hidden text-center text-xs">
          <div className="py-2 bg-gray-50">
            <div className="font-medium text-neutral-700">Limited</div>
            <div className="text-neutral-400">0–39</div>
          </div>
          <div className="py-2 bg-gray-50 border-l border-gray-200">
            <div className="font-medium text-neutral-700">Developing</div>
            <div className="text-neutral-400">40–59</div>
          </div>
          <div className="py-2 bg-gray-50 border-l border-gray-200">
            <div className="font-medium text-neutral-700">Established</div>
            <div className="text-neutral-400">60–79</div>
          </div>
          <div className="py-2 bg-gray-50 border-l border-gray-200">
            <div className="font-medium text-neutral-700">High</div>
            <div className="text-neutral-400">80–100</div>
          </div>
        </div>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Structural Interpretation Framework
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The model identifies a primary structural constraint (the lowest-scoring
          input dimension), three structural drivers supporting stability
          (the three highest-scoring dimensions excluding the constraint),
          and a structural priority derived from the constraint. All
          interpretation selections are deterministic and use locked
          templates.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Diagnostic Timeframe
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The assessment evaluates income structure over the preceding
          twelve-month period as reported by the subject. The income
          continuity test considers a hypothetical 90-day cessation of active
          work.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Analytical Scope
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The model evaluates structural income stability only. It does not
          assess credit, net worth, investment performance, debt capacity, or
          future income potential. The assessment is analytical and does not
          constitute financial advice.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Non-Predictive Nature
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The Income Stability Score is a classification of current structural
          characteristics, not a prediction of future performance. The model
          does not forecast income, estimate growth, or project stability
          over future periods.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Model Version Governance
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Any change to the model&apos;s questions, answer mapping, canonical input
          order, weights, band thresholds, tie-break rules, interpretation
          templates, or structural priority mapping requires a formal version
          update. Historical records remain tied to their original model
          version, ruleset checksum, and interpretation version.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Assessment Record Integrity
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Each issued assessment produces an immutable record identified by a
          unique Record ID and Authorization Code. Records are append-only
          and cannot be modified, deleted, or regenerated after issuance. A
          cryptographic record hash ensures tamper detection.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Independent Verification
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Issued records may be independently verified at RunPayway.com/verify
          using the Record ID and Authorization Code. Verification confirms
          the record exists and returns the score, band, and issuance
          details without exposing internal data.
        </p>
      </section>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800">
          Methodology Transparency
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The scoring methodology, input structure, weighting, and
          classification system are documented and available for review. The
          model operates under a canonical manifest with a verified ruleset
          checksum to ensure consistency across all assessments issued under
          the same model version.
        </p>
      </section>
    </div>
  );
}
