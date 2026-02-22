import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclosure \u2014 RunPayway\u2122 Structural Standard",
};

export default function DisclosurePage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Important Disclosure
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          RunPayway&#8482; provides a structural diagnostic based solely on the
          information submitted at the time of assessment.
        </p>

        <p>
          The Payway Rating&#8482; reflects structural dependency
          characteristics as defined by Model Version RP-1.0. It is not a
          measure of income amount, profitability, business valuation, financial
          performance, legal compliance, or future results.
        </p>

        <p>
          RunPayway&#8482; does not provide financial, legal, tax, or investment
          advice.
        </p>

        <p>
          Results are informational and intended to provide structural
          awareness. Decisions based on the report remain the responsibility of
          the user.
        </p>

        <p>
          Changes in business structure, agreements, operations, or external
          conditions may affect structural exposure over time.
        </p>

        <p>
          RunPayway&#8482; does not monitor structural changes after report
          issuance. Updated measurement requires a new assessment under the
          active Model Version.
        </p>
      </div>
    </>
  );
}
