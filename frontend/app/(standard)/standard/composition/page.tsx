import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Composition \u2014 RunPayway\u2122 Structural Standard",
};

export default function CompositionPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Revenue Composition
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          The report includes a Structural Revenue Composition breakdown, which
          shows the proportion of the Payway Rating&#8482; attributable to:
        </p>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              <strong>Structural Revenue</strong> &mdash; The share supported by
              Core Revenue Flow and Stability Indicators.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              <strong>Direct Involvement</strong> &mdash; The share dependent on
              Modifiers (concentration, client dynamics, contractual exposure).
            </span>
          </li>
        </ul>

        <p>
          This composition is expressed as a percentage split (e.g., 62%
          Structural / 38% Direct Involvement). It provides a secondary lens on
          how the rating was formed, helping distinguish between two entities
          with the same numeric rating but different structural profiles.
        </p>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Why Composition Matters
        </h2>

        <p>
          Two individuals may receive the same Payway Rating but arrive there
          through different paths. One may have strong core revenue flow but
          weak stability. Another may have moderate scores across all groups.
        </p>

        <p>
          The composition breakdown reveals these structural differences. It
          indicates where structural support exists and where income remains
          dependent on direct involvement.
        </p>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Interpretation
        </h2>

        <p>
          A higher Structural Revenue percentage typically reflects income
          sustained by contracts, recurring arrangements, or systemized
          delivery. A higher Direct Involvement percentage typically reflects
          income requiring ongoing personal effort, negotiation, or presence.
        </p>

        <p>
          The composition does not indicate which is &ldquo;better.&rdquo; It
          classifies how income is constructed.
        </p>
      </div>
    </>
  );
}
