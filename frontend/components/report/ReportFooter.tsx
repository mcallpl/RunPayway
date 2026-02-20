import Link from "next/link";

interface ReportFooterProps {
  modelVersion: string;
  engineVersion: string;
  calibrationVersion: string;
}

export default function ReportFooter({
  modelVersion,
  engineVersion,
  calibrationVersion,
}: ReportFooterProps) {
  return (
    <div className="border-t border-gray-200 pt-10 mt-16">
      {/* Reproducibility Guarantee */}
      <div className="mb-8 border border-gray-100 bg-slate-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Deterministic Guarantee
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Identical inputs under the same model version ({modelVersion}) will
          always produce identical Payway Ratings. This report reflects a fixed,
          criteria-based structural evaluation. No adaptive scoring, AI
          variability, or peer benchmarking is applied.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-8">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Disclaimer:</strong>{" "}
          RunPayway&#8482; is a structural classification tool. The Payway
          Rating is a deterministic output based on user inputs and a fixed
          scoring model. It does not constitute financial, legal, tax, or
          investment advice. Results are not personalized, AI-generated, or
          manually reviewed. The accuracy of results depends on the accuracy of
          inputs provided. RunPayway does not predict, forecast, or guarantee
          any financial outcome. For full terms, visit{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-gray-600"
          >
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </div>

      {/* Version Stamps */}
      <div className="flex flex-wrap gap-x-8 gap-y-1 text-[11px] text-gray-400 font-mono mb-6">
        <span>Model: {modelVersion}</span>
        <span>Engine: E-{engineVersion}</span>
        <span>Calibration: C-{calibrationVersion}</span>
        <span>Output: O-1.0</span>
      </div>

      {/* Operator */}
      <p className="text-[11px] text-gray-400">
        &copy; 2026 RunPayway&#8482; &mdash; Operated by PeopleStar
        Enterprises, Inc.
      </p>
    </div>
  );
}
