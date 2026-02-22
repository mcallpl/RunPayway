import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payway Rating\u2122 \u2014 RunPayway\u2122 Structural Standard",
};

export default function RatingPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Payway Rating&#8482;
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          The Payway Rating&#8482; is a deterministic index from 0 to 100. It
          classifies the structural dependency of income &mdash; the degree to
          which revenue relies on ongoing direct involvement, or is supported by
          structural mechanisms that sustain it independently.
        </p>

        <p>
          It is produced by a 12-question diagnostic, calibrated by Industry,
          Revenue Model, and Role. Identical inputs always produce identical
          outputs.
        </p>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          What It Measures
        </h2>

        <p>The Payway Rating measures structural dependency. Specifically:</p>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>How income is generated (Core Revenue Flow)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              How it is concentrated and contracted (Modifiers)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              How predictable and resilient it is (Stability Indicators)
            </span>
          </li>
        </ul>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          What It Does Not Measure
        </h2>

        <p>The Payway Rating does not evaluate:</p>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Income amount or growth rate</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Business valuation or profitability</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Performance quality or market position</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Legal compliance or future results</span>
          </li>
        </ul>

        <p>
          The rating is a classification, not a judgment. A high rating indicates
          structural support is present. A low rating indicates income depends
          more on direct involvement.
        </p>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Deterministic Guarantee
        </h2>

        <p>
          The Payway Rating is computed deterministically. There is no curve, no
          peer benchmarking, no percentile ranking, and no dynamic
          recalibration. The same answers to the same questions under the same
          calibration profile will always produce the same rating.
        </p>
      </div>
    </>
  );
}
