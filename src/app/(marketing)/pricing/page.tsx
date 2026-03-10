import Link from "next/link";

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
};

export default function PricingPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="pt-16 pb-12 text-center">
        <h1 className="text-[32px] md:text-[48px] font-semibold leading-tight mb-3" style={{ color: B.navy }}>
          Pricing — RunPayway™
        </h1>
        <p className="text-base" style={{ color: B.muted }}>Income Stability Assessment</p>
        <p className="text-[13px] font-medium mt-2" style={{ color: B.navy }}>
          Model RP-1.0 | Version 1.0
        </p>
      </div>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Choose */}
      <section className="py-16 text-center">
        <h2 className="text-2xl md:text-[32px] font-semibold leading-tight mb-4" style={{ color: B.navy }}>
          Choose How You Want to Measure Income Stability
        </h2>
        <p className="text-[15px] leading-relaxed mb-3 max-w-2xl mx-auto" style={{ color: B.muted }}>
          RunPayway provides structured income stability diagnostics using the{" "}
          <strong style={{ color: B.navy }}>Income Stability Score™</strong>.
        </p>
        <p className="text-[15px] leading-relaxed max-w-2xl mx-auto" style={{ color: B.muted }}>
          You may obtain a <strong style={{ color: B.navy }}>single structural measurement</strong>,
          or monitor how your income stability changes across time.
        </p>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Measurement and Monitoring */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: B.navy }}>
          Measurement and Monitoring
        </h2>
        <p className="text-[15px] mb-8" style={{ color: B.muted }}>
          Income stability can be evaluated in two ways.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div>
            <div className="text-[13px] font-semibold mb-2" style={{ color: B.navy }}>Measurement</div>
            <p className="text-[13px] leading-relaxed" style={{ color: B.muted }}>
              A one-time structural evaluation of your income system at a specific point in time.
            </p>
          </div>
          <div>
            <div className="text-[13px] font-semibold mb-2" style={{ color: B.navy }}>Monitoring</div>
            <p className="text-[13px] leading-relaxed" style={{ color: B.muted }}>
              Multiple evaluations across one year to observe how structural changes affect income stability.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Assessment Options */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-8" style={{ color: B.navy }}>
          Assessment Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-2xl mx-auto">
          {/* Single Assessment */}
          <div className="rounded-lg border p-6 text-center" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
            <div className="text-base font-semibold mb-1" style={{ color: B.navy }}>Single Assessment</div>
            <div className="text-[36px] font-semibold leading-none mt-3 mb-4" style={{ color: B.navy }}>$59</div>
            <div className="space-y-2 mb-6">
              <p className="text-[13px]" style={{ color: B.muted }}>One structural measurement</p>
              <p className="text-[11px]" style={{ color: B.light }}>Secure checkout via Stripe</p>
            </div>
            <Link
              href="/checkout-placeholder?plan=single"
              className="inline-flex items-center px-5 py-2.5 text-[13px] font-medium rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: B.navy, color: "#ffffff" }}
            >
              Get Assessment
            </Link>
          </div>

          {/* Annual Monitoring */}
          <div
            className="rounded-lg border-2 p-7 text-center"
            style={{ borderColor: B.purple, backgroundColor: `${B.sand}40` }}
          >
            <div className="text-base font-semibold mb-1" style={{ color: B.navy }}>Annual Monitoring</div>
            <div className="text-[36px] font-semibold leading-none mt-3 mb-4" style={{ color: B.navy }}>$119</div>
            <div className="space-y-2 mb-6">
              <p className="text-[13px]" style={{ color: B.muted }}>Three assessments across one year</p>
              <p className="text-[11px]" style={{ color: B.light }}>Secure checkout via Stripe</p>
            </div>
            <Link
              href="/checkout-placeholder?plan=monitoring"
              className="inline-flex items-center px-5 py-2.5 text-[13px] font-medium rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: B.purple, color: "#ffffff" }}
            >
              Start Monitoring
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Income Stability Monitoring */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: B.navy }}>
          Income Stability Monitoring
        </h2>
        <p className="text-[15px] mb-8" style={{ color: B.muted }}>
          Annual monitoring measures how your income structure evolves across time.
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-[13px] font-semibold" style={{ color: B.navy }}>Baseline Score</div>
          <span style={{ color: B.light }}>&rarr;</span>
          <div className="text-[13px] font-semibold" style={{ color: B.navy }}>Stability Trend</div>
        </div>
        <div className="rounded-lg border p-5 max-w-xl mx-auto" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {[
              ["Assessment 1", "Month 0"],
              ["Assessment 2", "Month 6"],
              ["Assessment 3", "Month 12"],
            ].map(([label, month], i) => (
              <div key={label} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-[13px] font-semibold" style={{ color: B.navy }}>{label}</div>
                  <div className="text-[11px]" style={{ color: B.light }}>{month}</div>
                </div>
                {i < 2 && <span className="text-lg" style={{ color: B.light }}>&rarr;</span>}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[13px] mt-4" style={{ color: B.light }}>
          Each assessment measures the structural stability of income at the time it is issued.
        </p>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Assessment Record Structure */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: B.navy }}>
          Assessment Record Structure
        </h2>
        <p className="text-[15px] mb-6" style={{ color: B.muted }}>
          The Income Stability Assessment produces a structured report containing:
        </p>
        <ul className="space-y-2.5 mb-6 inline-block text-left">
          {[
            "Income Stability Score™",
            "Stability Classification",
            "Structural Drivers",
            "Structural Constraints",
            "Industry Percentile Comparison",
            "Structural Improvement Path",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-[13px] font-medium" style={{ color: B.navy }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[13px] font-medium" style={{ color: B.purple }}>
          Official PDF Assessment Record issued under Model RP-1.0
        </p>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* What Every Assessment Includes */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: B.navy }}>
          What Every Assessment Includes
        </h2>
        <p className="text-[15px] mb-6" style={{ color: B.muted }}>
          Each Income Stability Assessment includes:
        </p>
        <ul className="space-y-2.5 mb-6 inline-block text-left">
          {[
            ["Income Stability Score™ (0\u2013100)", true],
            ["stability classification", false],
            ["structural system diagnosis", false],
            ["structural drivers and constraints", false],
            ["industry percentile comparison", false],
            ["structural improvement path", false],
            ["Official PDF Assessment Record", true],
          ].map(([item, bold]) => (
            <li key={item as string} className="flex items-center gap-3 text-[13px]" style={{ color: B.muted }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
              {bold ? <strong style={{ color: B.navy }}>{item as string}</strong> : (item as string)}
            </li>
          ))}
        </ul>
        <p className="text-[13px]" style={{ color: B.light }}>
          Assessments are generated using fixed scoring criteria under <strong style={{ color: B.navy }}>Model RP-1.0</strong>.
        </p>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Assessment Options Explained */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-8" style={{ color: B.navy }}>
          Assessment Options Explained
        </h2>
        <div className="space-y-8 max-w-2xl mx-auto">
          <div>
            <div className="text-base font-semibold mb-3" style={{ color: B.navy }}>Single Assessment</div>
            <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: B.muted }}>
              <p>Provides a one-time structural evaluation of your income system.</p>
              <p>The diagnostic measures the stability of your income at the time the assessment is completed.</p>
              <p>
                An <strong style={{ color: B.navy }}>Official PDF Assessment Record</strong> is issued immediately after completion.
              </p>
            </div>
          </div>
          <div className="border-t" style={{ borderColor: B.sandDk }} />
          <div>
            <div className="text-base font-semibold mb-3" style={{ color: B.navy }}>Annual Monitoring</div>
            <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: B.muted }}>
              <p>Includes three assessments issued across a twelve-month period.</p>
              <p>
                This allows you to observe how your <strong style={{ color: B.navy }}>Income Stability Score™</strong> changes
                as your income structure changes over time.
              </p>
              <p>
                Each assessment produces its own <strong style={{ color: B.navy }}>Official PDF Assessment Record</strong>,
                allowing comparison across the year.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* How the Process Works */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-8" style={{ color: B.navy }}>
          How the Process Works
        </h2>
        <ol className="space-y-4 inline-block text-left">
          {[
            "Select your assessment option.",
            ["You will be redirected to ", "Stripe Secure Checkout", "."],
            ["After successful payment, you will be redirected to the ", "RunPayway Diagnostic Portal", "."],
            ["Complete the ", "Income Stability Assessment", "."],
            ["Your ", "Income Stability Score™ report", " will be generated and issued as an ", "Official PDF Assessment Record", "."],
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 mt-0.5"
                style={{ backgroundColor: B.sand, color: B.navy }}
              >
                {i + 1}
              </span>
              <p className="text-[15px] leading-relaxed" style={{ color: B.muted }}>
                {Array.isArray(item)
                  ? item.map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} style={{ color: B.navy }}>{part}</strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )
                  : item}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Final Selection */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: B.navy }}>
          Final Selection
        </h2>
        <p className="text-[15px] mb-8" style={{ color: B.muted }}>
          Choose how you would like to measure the structural stability of your income system.
        </p>
        <div className="space-y-4 max-w-xl mx-auto">
          <Link
            href="/checkout-placeholder?plan=single"
            className="flex items-center justify-between rounded-lg border px-6 py-4 group hover:border-gray-400 transition-colors"
            style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}
          >
            <span className="text-[15px] font-semibold" style={{ color: B.navy }}>
              Single Assessment — $59
            </span>
            <span className="text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: B.teal }}>
              Select &rarr;
            </span>
          </Link>
          <Link
            href="/checkout-placeholder?plan=monitoring"
            className="flex items-center justify-between rounded-lg border-2 px-6 py-4 group hover:border-opacity-80 transition-colors"
            style={{ borderColor: B.purple, backgroundColor: `${B.sand}40` }}
          >
            <span className="text-[15px] font-semibold" style={{ color: B.navy }}>
              Annual Monitoring — $119
            </span>
            <span className="text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: B.purple }}>
              Select &rarr;
            </span>
          </Link>
        </div>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Methodology Statement */}
      <section className="py-12 text-center">
        <h2 className="text-lg font-semibold mb-3" style={{ color: B.navy }}>
          Methodology Statement
        </h2>
        <p className="text-[13px] leading-relaxed max-w-2xl mx-auto" style={{ color: B.muted }}>
          Income Stability assessments are generated using fixed scoring criteria defined
          under <strong style={{ color: B.navy }}>Model RP-1.0</strong>.
        </p>
      </section>

      <div className="border-t" style={{ borderColor: B.sandDk }} />

      {/* Footer Note */}
      <div className="py-12 text-center">
        <p className="text-[13px] leading-relaxed max-w-2xl mx-auto" style={{ color: B.light }}>
          The <strong>Income Stability Score™</strong> is a structural income assessment based on
          information provided by the user. It does not provide financial advice and does not predict
          future financial outcomes. Assessments are issued under Model RP-1.0.
        </p>
      </div>
    </div>
  );
}
