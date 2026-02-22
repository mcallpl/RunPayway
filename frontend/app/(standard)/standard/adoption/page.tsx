import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standards Adoption \u2014 RunPayway\u2122 Structural Standard",
};

export default function AdoptionPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Standards Adoption
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          RunPayway&#8482; establishes the originating framework for Revenue
          Exposure measurement.
        </p>

        <p>
          Before this Standard, Revenue Exposure was inferred indirectly.
        </p>

        <p>
          The RunPayway&#8482; Structural Standard formalizes Revenue Exposure as
          a measurable configuration by defining vocabulary, taxonomy, domains,
          deterministic methodology, and interpretive boundaries.
        </p>

        <p>
          All Payway Ratings&#8482; issued under RP-1.0 align to this Standard.
        </p>

        <p>
          This documentation is the authoritative reference for that measurement
          category.
        </p>
      </div>
    </>
  );
}
