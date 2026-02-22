import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Definitions \u2014 RunPayway\u2122 Structural Standard",
};

const definitions = [
  {
    term: "Revenue Exposure",
    definition:
      "The degree to which income depends on direct, ongoing involvement versus structural mechanisms that sustain revenue independently.",
  },
  {
    term: "Structural Continuity",
    definition:
      "The ability of income to persist without active personal effort. A function of how revenue is configured, not how much is earned.",
  },
  {
    term: "Payway Rating\u2122",
    definition:
      "A deterministic index from 0 to 100 that classifies income structure. Produced by the RunPayway\u2122 diagnostic under a locked scoring model.",
  },
  {
    term: "Deterministic",
    definition:
      "Identical inputs always produce identical outputs. No curve, no peer benchmarking, no percentile ranking, no dynamic recalibration.",
  },
  {
    term: "Structure-Supported Revenue",
    definition:
      "Income sustained by contracts, subscriptions, systems, or assets that continue without direct involvement.",
  },
  {
    term: "Direct-Involvement Revenue",
    definition:
      "Income that requires ongoing personal effort, attention, or presence to generate or maintain.",
  },
  {
    term: "Calibration",
    definition:
      "A pre-diagnostic adjustment that modifies question group weights based on Industry, Revenue Model, and Role. Does not change scoring logic or band thresholds.",
  },
  {
    term: "Model Version",
    definition:
      "The versioned release of the scoring engine, calibration profiles, and output logic. Current version: RP-1.0.",
  },
  {
    term: "Rating Band",
    definition:
      "One of four fixed classification ranges: Structurally Supported (80\u2013100), Mixed Structural Support (60\u201379), Attention-Weighted (40\u201359), Attention-Dependent (0\u201339).",
  },
  {
    term: "Structural Revenue Composition",
    definition:
      "The percentage split between Structure-Supported and Direct-Involvement contributions to the Payway Rating.",
  },
  {
    term: "Structural Pressure Sensitivity",
    definition:
      "A composite index measuring how sensitive the income structure is to external disruption.",
  },
  {
    term: "Revenue Initiation Architecture",
    definition:
      "The structural mechanism through which new income is generated or acquired.",
  },
];

export default function DefinitionsPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Definitions
      </h1>
      <p className="mt-3 text-gray-500 text-sm">
        Formal vocabulary used throughout the RunPayway&#8482; Structural
        Standard
      </p>

      <div className="mt-10 space-y-8">
        {definitions.map((item) => (
          <div
            key={item.term}
            className="border-b border-gray-100 pb-6 last:border-0"
          >
            <dt className="text-[16px] md:text-[18px] font-medium text-navy-900">
              {item.term}
            </dt>
            <dd className="mt-2 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
              {item.definition}
            </dd>
          </div>
        ))}
      </div>
    </>
  );
}
