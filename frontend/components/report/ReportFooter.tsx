export default function ReportFooter() {
  return (
    <div className="py-14 md:py-[72px] border-t border-gray-100">
      {/* Deterministic Statement */}
      <p className="text-sm text-gray-600 leading-relaxed mb-8">
        Results reflect deterministic scoring based solely on submitted
        structural inputs.
      </p>

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
          any financial outcome.
        </p>
      </div>

      {/* Stacked Version Stamps */}
      <div className="space-y-0.5 text-[11px] text-gray-400 font-mono mb-6">
        <p>RunPayway&#8482; Structural Model RP-1.0</p>
        <p>Calibration Engine v1.0</p>
        <p>Output Logic v1.0</p>
      </div>

      {/* Operated-by */}
      <p className="text-[11px] text-gray-400">
        &copy; 2026 RunPayway&#8482; &mdash; Operated by PeopleStar
        Enterprises, Inc.
      </p>
    </div>
  );
}
