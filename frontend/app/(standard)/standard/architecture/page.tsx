import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Measurement Architecture \u2014 RunPayway\u2122 Structural Standard",
};

export default function ArchitecturePage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Measurement Architecture
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          The RunPayway&#8482; diagnostic follows a defined measurement
          pipeline. Each stage is versioned, deterministic, and documented.
        </p>

        {/* Architecture Diagram — full version */}
        <div className="my-10 flex flex-col items-center gap-0">
          {[
            "Structural Revenue Exposure",
            "Structural Diagnostic Standard (RP-1.0)",
            "RunPayway\u2122 Execution Layer",
            "Payway Rating\u2122 (0\u2013100 Deterministic Index)",
            "Structural Continuity Position",
          ].map((label, i, arr) => (
            <div key={label} className="flex flex-col items-center">
              <div className="border border-gray-200 rounded-lg px-6 py-4 text-center text-sm text-navy-900 font-medium bg-white min-w-[300px]">
                {label}
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-8 bg-gray-300 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 text-center">
          Structural Exposure &rarr; Standardized Measurement &rarr;
          Deterministic Output &rarr; Continuity Definition.
        </p>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Pipeline Stages
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Calibration
            </h3>
            <p className="mt-2">
              Three inputs (Industry, Revenue Model, Role) adjust question group
              weights. Calibration does not change scoring logic, answer values,
              or band thresholds.
            </p>
          </div>

          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Diagnostic
            </h3>
            <p className="mt-2">
              12 structured questions across three groups: Core Revenue Flow,
              Modifiers, and Stability Indicators. Each answer maps to a fixed
              integer value.
            </p>
          </div>

          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Scoring
            </h3>
            <p className="mt-2">
              Weighted subtotals are computed for each group, normalized to a
              0&ndash;100 scale. The result is the Payway Rating.
            </p>
          </div>

          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Output
            </h3>
            <p className="mt-2">
              The rating, band classification, revenue composition, exposure
              indicators, and metadata are assembled into a versioned report.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
