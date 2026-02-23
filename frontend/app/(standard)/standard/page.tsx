import type { Metadata } from "next";
import CalibrationPanel from "@/components/standard/CalibrationPanel";
import StandardCTAPrimary from "@/components/standard/StandardCTAPrimary";

export const metadata: Metadata = {
  title: "RunPayway\u2122 Structural Standard",
  description:
    "The governing framework for structural revenue measurement. Model Version RP-1.0.",
};

const EXPOSURE_PATTERNS = [
  {
    title: "Renewal Dependency",
    intro:
      "Recurring revenue structures may remain dependent on active renewal cycles and relationship continuity.",
    bullets: [
      "Retention may rely on primary operator involvement",
      "Continuity may depend on renewal negotiation cycles",
      "Contract renewal timing may introduce sensitivity",
    ],
    close:
      "The diagnostic distinguishes structurally recurring revenue from operator-dependent renewal retention.",
  },
  {
    title: "Service Delivery Ceiling",
    intro:
      "Subscription or retainer models may encounter structural capacity constraints.",
    bullets: [
      "Revenue scaling may correlate with operator bandwidth",
      "Fulfillment may vary with direct involvement",
      "Growth may require proportional effort expansion",
    ],
    close:
      "The diagnostic measures structural independence from primary operator capacity.",
  },
  {
    title: "Concentration Exposure",
    intro:
      "Revenue concentration may create disproportionate structural sensitivity.",
    bullets: [
      "Limited client base may represent majority revenue share",
      "Loss of key accounts may materially affect continuity",
      "Acquisition may depend on direct outreach",
    ],
    close:
      "The diagnostic quantifies concentration exposure within overall structural assessment.",
  },
  {
    title: "Contractual Fragility",
    intro:
      "Revenue may operate under short-term or informal agreements.",
    bullets: [
      "Agreements may lack enforcement durability",
      "Predictability may fluctuate by contract structure",
      "Renewal cycles may introduce volatility",
    ],
    close:
      "The diagnostic evaluates contractual durability as a component of structural continuity.",
  },
];

export default function StandardOverviewPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div style={{ paddingTop: "96px", paddingBottom: "64px" }}>
        <h1 className="text-[40px] md:text-[44px] font-bold text-[#0B1F2E] tracking-tight leading-tight">
          RunPayway&#8482; Structural Standard
        </h1>

        <p className="mt-3 text-gray-500 text-[16px]">
          The governing framework for structural revenue measurement.
        </p>

        <div className="mt-8 text-[16px] text-gray-600 leading-[1.6] space-y-2 max-w-[680px]">
          <p>
            This Standard defines the structural measurement system underlying
            the Payway Rating&#8482;. It governs scoring architecture,
            calibration weighting, rating band classification, and report
            issuance under Model RP-1.0.
          </p>
        </div>
      </div>

      {/* ── CALIBRATION PANEL ─────────────────────────────────────── */}
      <div className="mb-16">
        <CalibrationPanel />
      </div>

      {/* ── SECTION 01: GOVERNANCE ────────────────────────────────── */}
      <section className="py-12 border-t border-gray-100">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-6">
          01 Governance
        </p>

        <ul className="space-y-3 text-[16px] text-gray-700 leading-[1.6]">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Executed under version-controlled model (RP-1.0)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Deterministic scoring (no adaptive AI variance)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Fixed rating band boundaries</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Standardized report issuance protocol</span>
          </li>
        </ul>

        <p className="mt-8 text-[15px] text-gray-500 leading-[1.6]">
          The Standard defines measurement architecture. The diagnostic executes
          it.
        </p>
      </section>

      {/* ── SECTION 02: DEFINITIONS ───────────────────────────────── */}
      <section className="py-12 border-t border-gray-100">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-8">
          02 Definitions
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B1F2E] mb-2">
              Payway Rating&#8482;
            </h3>
            <p className="text-[16px] text-gray-600 leading-[1.6]">
              Expresses the degree to which revenue continuity is structurally
              supported rather than dependent on direct operator involvement.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold text-[#0B1F2E] mb-2">
              Calibration
            </h3>
            <p className="text-[16px] text-gray-600 leading-[1.6]">
              Applies contextual weighting adjustments by industry, revenue
              model, and operator role without altering base scoring criteria.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold text-[#0B1F2E] mb-2">
              Structural Exposure
            </h3>
            <p className="text-[16px] text-gray-600 leading-[1.6]">
              Identifies measurable revenue vulnerability across concentration,
              contract structure, renewal dependency, and operator reliance.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 03: MEASUREMENT ARCHITECTURE ──────────────────── */}
      <section className="py-12 border-t border-gray-100">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-10">
          03 Measurement Architecture
        </p>

        {/* Vertical flow diagram */}
        <div className="flex flex-col items-center gap-0 mb-8">
          {[
            "Revenue Structure",
            "Diagnostic Execution (Model RP-1.0)",
            "Payway Rating\u2122 (0\u2013100)",
            "Structural Position Classification",
          ].map((label, i, arr) => (
            <div key={label} className="flex flex-col items-center">
              <div className="border border-gray-200 rounded-lg px-6 py-3 text-center text-[13px] text-[#0B1F2E] font-medium bg-white min-w-[260px]">
                {label}
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-6 bg-gray-300 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-[15px] text-gray-500 leading-[1.6] text-center">
          All outputs are derived from fixed scoring criteria under
          version-controlled governance.
        </p>
      </section>

      {/* ── SECTION 04: EXPOSURE PATTERNS ─────────────────────────── */}
      <section className="py-12 border-t border-gray-100">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-8">
          04 Exposure Patterns (Contextual)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPOSURE_PATTERNS.map((pattern) => (
            <div
              key={pattern.title}
              className="border border-gray-200 rounded-lg p-5"
            >
              <h3 className="text-[16px] font-semibold text-[#0B1F2E] mb-2">
                {pattern.title}
              </h3>
              <p className="text-[14px] text-gray-600 leading-[1.6] mb-3">
                {pattern.intro}
              </p>
              <ul className="space-y-1.5 mb-4">
                {pattern.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-[14px] text-gray-600 leading-[1.6] flex items-start gap-2"
                  >
                    <span className="text-gray-400 mt-0.5">&bull;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[13px] text-gray-500 leading-[1.55] border-t border-gray-100 pt-3">
                {pattern.close}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 05: SCOPE & BOUNDARIES ────────────────────────── */}
      <section className="py-12 border-t border-gray-100">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-6">
          05 Scope &amp; Boundaries
        </p>

        <ul className="space-y-3 text-[16px] text-gray-700 leading-[1.6]">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Does not provide tactical recommendations</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Does not forecast revenue outcomes</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Does not adapt scoring dynamically</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Does not benchmark against peer entities</span>
          </li>
        </ul>

        <p className="mt-8 text-[15px] text-gray-500 leading-[1.6]">
          This document defines the framework. The diagnostic applies it.
        </p>
      </section>

      {/* ── SECTION 06: FORMAL APPLICATION ────────────────────────── */}
      <section className="py-12 border-t border-gray-100">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-6">
          06 Formal Application
        </p>

        <div className="text-[16px] text-gray-700 leading-[1.6] space-y-4">
          <p>
            The formal diagnostic applies this Standard to a defined revenue
            structure.
          </p>
          <p>
            The resulting report documents measured structural position under
            Model RP-1.0.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <div className="mt-16 mb-8">
        <StandardCTAPrimary />
      </div>
    </>
  );
}
