import type { Metadata } from "next";
import ExposurePatternViewer from "@/components/standard/ExposurePatternViewer";

export const metadata: Metadata = {
  title: "Pressure Sensitivity \u2014 RunPayway\u2122 Structural Standard",
};

export default function PressurePage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Pressure Sensitivity
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          The Structural Exposure Profile section of the report provides four
          indicators that measure how sensitive the income structure is to
          external disruption.
        </p>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Indicators
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Structural Pressure Sensitivity
            </h3>
            <p className="mt-2">
              A composite index measuring how sensitive the income structure is
              to external disruption. Derived from the inverse contribution of
              each question group.
            </p>
          </div>

          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Attention Dependence Impact
            </h3>
            <p className="mt-2">
              Reflects the degree to which revenue depends on direct personal
              involvement, derived from the Direct Involvement percentage in the
              composition.
            </p>
          </div>

          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Contract Disruption Impact
            </h3>
            <p className="mt-2">
              Evaluates exposure to contract-related revenue loss, based on
              contractual structure and renewal dependency responses.
            </p>
          </div>

          <div>
            <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              Client Turnover Impact
            </h3>
            <p className="mt-2">
              Assesses the risk posed by client concentration and acquisition
              dependency, based on revenue concentration and client acquisition
              responses.
            </p>
          </div>
        </div>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Severity Levels
        </h2>

        <p>
          Each indicator is expressed as a labeled severity level: Low,
          Moderate, Elevated, or High. These are derived from fixed formulas and
          are not influenced by external benchmarks.
        </p>

        <p>
          Severity levels indicate structural exposure characteristics. They do
          not predict outcomes or recommend actions.
        </p>
      </div>

      {/* Exposure Pattern Viewer — contextual to calibration */}
      <ExposurePatternViewer />
    </>
  );
}
