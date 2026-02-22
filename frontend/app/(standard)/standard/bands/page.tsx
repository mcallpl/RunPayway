import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rating Bands \u2014 RunPayway\u2122 Structural Standard",
};

const bands = [
  {
    range: "80\u2013100",
    label: "Structurally Supported",
    border: "border-l-emerald-700",
    description:
      "Revenue continues with minimal direct involvement. Structural mechanisms sustain income independently.",
  },
  {
    range: "60\u201379",
    label: "Mixed Structural Support",
    border: "border-l-sky-700",
    description:
      "Some structural support exists, but income still depends partially on ongoing involvement.",
  },
  {
    range: "40\u201359",
    label: "Attention-Weighted",
    border: "border-l-amber-700",
    description:
      "Revenue is primarily driven by direct effort and attention. Limited structural support is present.",
  },
  {
    range: "0\u201339",
    label: "Attention-Dependent",
    border: "border-l-red-800",
    description:
      "Income requires continuous direct involvement. Revenue stops or declines quickly without active participation.",
  },
];

export default function BandsPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Rating Bands
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          The Payway Rating&#8482; maps to one of four classification bands.
          Each band represents a range on the 0&ndash;100 scale and corresponds
          to a defined structural dependency profile.
        </p>

        <div className="space-y-5 mt-8">
          {bands.map((band) => (
            <div
              key={band.label}
              className={`border-l-4 ${band.border} pl-5 py-1`}
            >
              <p className="font-semibold text-navy-900">
                {band.range} &mdash; {band.label}
              </p>
              <p className="text-sm text-gray-600 mt-1">{band.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8">
          Band thresholds are fixed and do not change based on calibration or
          any external input. They are locked at the model version level.
        </p>
      </div>
    </>
  );
}
