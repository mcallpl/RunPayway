import type { Metadata } from "next";
import StandardCTAClosing from "@/components/standard/StandardCTAClosing";

export const metadata: Metadata = {
  title: "Governance \u2014 RunPayway\u2122 Structural Standard",
};

export default function GovernancePage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Governance
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900">
          Governance &amp; Model Integrity
        </h2>

        <p>Model Version: RP-1.0</p>

        <p>Deterministic principles:</p>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Identical inputs produce identical outputs</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>No curve</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>No peer benchmarking</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>No percentile ranking</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>No dynamic recalibration</span>
          </li>
        </ul>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Model Stability Statement
        </h2>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>RP-1.0 is fixed once released</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Future versions are version-controlled and documented</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Prior issued ratings are not retroactively altered</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Each report references its governing version</span>
          </li>
        </ul>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Interpretive Boundary Clause
        </h2>

        <p>The Standard measures configuration only.</p>

        <p>It does not measure:</p>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Income amount</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Profitability</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Valuation</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Performance quality</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Legal compliance</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Forecasts or future results</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Risk probability</span>
          </li>
        </ul>

        <p>
          RunPayway&#8482; is operated by PeopleStar Enterprises, Inc. The
          diagnostic model, scoring engine, calibration profiles, and output
          logic are maintained under a formal version control framework.
        </p>
      </div>

      {/* CTA #2 — Final closing CTA after Governance */}
      <StandardCTAClosing />
    </>
  );
}
