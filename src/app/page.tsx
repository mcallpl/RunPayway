import Link from "next/link";

function Divider() {
  return <hr className="border-divider my-20" />;
}

function StabilityScale() {
  const bands = [
    { label: "Limited", range: "0\u201339", active: false },
    { label: "Developing", range: "40\u201359", active: false },
    { label: "Established", range: "60\u201379", active: true },
    { label: "High", range: "80\u2013100", active: false },
  ];

  return (
    <div className="w-full mt-6">
      <div className="flex w-full rounded overflow-hidden h-10">
        {bands.map((band) => (
          <div
            key={band.label}
            className={`flex-1 flex items-center justify-center text-sm font-medium ${
              band.active
                ? "bg-purple text-white"
                : "bg-divider/50 text-secondary"
            }`}
          >
            {band.label}
          </div>
        ))}
      </div>
      <div className="flex w-full mt-1">
        {bands.map((band) => (
          <div key={band.range} className="flex-1 text-center text-xs text-secondary">
            {band.range}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-10">
      {/* HERO */}
      <section className="py-[120px] max-w-[720px]">
        <h1>Income Stability. Structurally Measured.</h1>
        <p className="mt-6 text-secondary text-lg">
          The <strong className="text-navy">Income Stability Score&trade;</strong> measures
          the structural stability of income at a specific point in time.
        </p>
        <p className="mt-4 text-secondary">
          Structured assessment. Immediate result.
        </p>
        <Link
          href="/welcome"
          className="inline-block mt-8 bg-navy text-white px-6 py-3 rounded-md text-base font-medium hover:opacity-90"
        >
          Get Score
        </Link>
      </section>

      <Divider />

      {/* WHY STABILITY MATTERS */}
      <section className="max-w-[720px] py-24" id="why-stability-matters">
        <h2>Why Stability Matters</h2>
        <div className="mt-6 space-y-4 text-secondary">
          <p>Income stability reflects how reliably income continues over time.</p>
          <p>Income amount alone does not determine financial resilience.</p>
          <p>
            Two individuals with identical income may have very different levels of
            income stability depending on how that income is structured.
          </p>
          <p>High income does not necessarily mean stable income.</p>
          <p>
            Income stability is influenced by two structural factors:{" "}
            <strong className="text-navy">exposure risk</strong> and{" "}
            <strong className="text-navy">income variability</strong>.
          </p>
        </div>

        <Divider />

        <h3>Structural Exposure Risk</h3>
        <div className="mt-4 space-y-4 text-secondary">
          <p>
            Income structures may become fragile when they depend heavily on a
            limited number of sources.
          </p>
          <p>Examples</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>loss of a major client or employer</li>
            <li>concentration in a single income source</li>
            <li>interruption of active work</li>
          </ul>
          <p>
            <strong className="text-navy">
              Even strong income can decline quickly when exposure risk is high.
            </strong>
          </p>
        </div>

        <div className="mt-12">
          <h3>Structural Income Variability</h3>
          <div className="mt-4 space-y-4 text-secondary">
            <p>Some income structures fluctuate naturally over time.</p>
            <p>Examples</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>seasonal earnings patterns</li>
              <li>commission-based income cycles</li>
              <li>project-based revenue</li>
            </ul>
            <p>
              These structures may produce strong income overall but still create
              periods of instability.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3>Structural Stability Characteristics</h3>
          <div className="mt-4 space-y-4 text-secondary">
            <p>
              Income structures demonstrate higher stability when they include:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>multiple income sources</li>
              <li>recurring revenue</li>
              <li>forward revenue visibility</li>
              <li>income continuity without active labor</li>
            </ul>
            <p>
              The <strong className="text-navy">Income Stability Score&trade;</strong>{" "}
              evaluates these characteristics.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* INCOME STABILITY AS A MEASUREMENT */}
      <section className="max-w-[720px] py-24">
        <h2>Income Stability as a Measurement</h2>
        <div className="mt-6 space-y-4 text-secondary">
          <p>
            RunPayway&trade; establishes a distinct financial measurement category:
          </p>
          <p className="font-semibold text-navy">Income Stability</p>
          <p>
            Credit evaluates <strong className="text-navy">debt exposure</strong>.
          </p>
          <p>
            RunPayway evaluates{" "}
            <strong className="text-navy">income stability</strong>.
          </p>
          <p>Separate financial dimensions.</p>
          <p>
            The score reflects structural income characteristics{" "}
            <strong className="text-navy">at the time of assessment</strong>.
          </p>
        </div>
      </section>

      <Divider />

      {/* STABILITY INDEX (Example) */}
      <section className="py-24">
        <div className="mx-auto max-w-[800px] bg-warm-sand rounded-lg p-12">
          <p className="text-sm text-secondary mb-1">Example Score</p>
          <p className="text-sm font-semibold text-navy">RUNPAYWAY&trade;</p>
          <p className="text-sm text-secondary">Income Stability Score&trade;</p>
          <p className="text-sm text-secondary mt-1">Model RP-1.0 | Version 1.0</p>

          <p className="text-[60px] font-semibold text-navy mt-6 leading-none">72</p>
          <p className="text-lg text-navy mt-2">Established Stability</p>

          <div className="mt-4 text-sm text-secondary">
            <p>Income structure reflects multiple supporting income components.</p>
          </div>

          <div className="mt-6 text-sm text-secondary space-y-1">
            <p>Functional Stability Threshold: <strong className="text-navy">60</strong></p>
            <p>Index Range: 0&ndash;100</p>
          </div>

          <StabilityScale />
        </div>
      </section>

      <Divider />

      {/* MEASUREMENT REFERENCE */}
      <section className="max-w-[720px] py-24" id="methodology">
        <h2>Measurement Reference</h2>
        <div className="mt-6 space-y-4 text-secondary">
          <p>
            The <strong className="text-navy">Income Stability Score&trade;</strong>{" "}
            represents a structural measurement of income stability at the time of
            assessment.
          </p>
          <p>
            Scores are generated under{" "}
            <strong className="text-navy">Model RP-1.0</strong> using fixed scoring
            criteria applied to six structural components.
          </p>
          <p>
            Scores range from <strong className="text-navy">0&ndash;100</strong>.
          </p>
        </div>
      </section>

      <Divider />

      {/* HOW THE SCORE IS CALCULATED */}
      <section className="max-w-[720px] py-24">
        <h2>How the Score is Calculated</h2>
        <div className="mt-6 space-y-4 text-secondary">
          <p>The score evaluates six structural components:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>recurring income proportion</li>
            <li>income concentration</li>
            <li>number of income sources</li>
            <li>forward revenue visibility</li>
            <li>earnings variability</li>
            <li>income continuity without active labor</li>
          </ul>
          <p>Responses are evaluated using a deterministic scoring model.</p>
          <p>
            The assessment requires{" "}
            <strong className="text-navy">less than two minutes</strong>.
          </p>
        </div>
      </section>

      <Divider />

      {/* INTERPRETING THE SCORE */}
      <section className="max-w-[720px] py-24">
        <h2>Interpreting the Score</h2>
        <div className="mt-6 space-y-4 text-secondary">
          <p>The report includes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Income Stability Score&trade;</li>
            <li>stability band classification</li>
            <li>structural constraint identification</li>
            <li>structural improvement priority</li>
          </ul>
          <p>
            The score provides a standardized reference point for evaluating
            structural income stability.
          </p>
        </div>
      </section>

      <Divider />

      {/* MODEL GOVERNANCE */}
      <section className="max-w-[720px] py-24">
        <h2>Model Governance</h2>
        <div className="mt-6 space-y-4 text-secondary">
          <p>
            The Stability Index is generated under{" "}
            <strong className="text-navy">Model RP-1.0</strong>.
          </p>
          <p>Scoring criteria are fixed and version-controlled.</p>
          <p>
            Any methodology change creates a{" "}
            <strong className="text-navy">new model version</strong>.
          </p>
          <p>No silent changes.</p>
        </div>
      </section>

      <Divider />

      {/* GLOBAL DISCLAIMER */}
      <section className="max-w-[720px] py-24">
        <div className="bg-divider/30 rounded-lg p-8 text-sm text-secondary">
          <p>
            The <strong className="text-navy">Income Stability Score&trade;</strong> is a
            structural income assessment based on user-provided information.
          </p>
          <p className="mt-2">
            It does not provide financial advice and does not predict future
            financial outcomes.
          </p>
        </div>
      </section>
    </div>
  );
}
