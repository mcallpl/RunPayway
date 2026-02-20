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
    <div className="border-t border-gray-200 pt-8 mt-12">
      {/* Disclaimer */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong>Disclaimer:</strong> RunPayway&#8482; is a structural
          classification tool. The Payway Rating is a deterministic output
          based on user inputs and a fixed scoring model. It does not
          constitute financial, legal, tax, or investment advice. Results are
          not personalized, AI-generated, or manually reviewed. The accuracy
          of results depends on the accuracy of inputs provided. RunPayway
          does not predict, forecast, or guarantee any financial outcome. For
          full terms, visit{" "}
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
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400 font-mono">
        <span>Model: {modelVersion}</span>
        <span>Engine: E-{engineVersion}</span>
        <span>Calibration: C-{calibrationVersion}</span>
        <span>Output: O-1.0</span>
      </div>

      {/* Operator */}
      <p className="text-xs text-gray-400 mt-4">
        &copy; 2026 RunPayway&#8482; &mdash; Operated by PeopleStar
        Enterprises, Inc.
      </p>
    </div>
  );
}
