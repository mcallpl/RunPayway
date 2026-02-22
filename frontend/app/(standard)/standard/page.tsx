import type { Metadata } from "next";
import IdentityMirror from "@/components/standard/IdentityMirror";
import ExposurePatternViewer from "@/components/standard/ExposurePatternViewer";
import StandardCTAPrimary from "@/components/standard/StandardCTAPrimary";

export const metadata: Metadata = {
  title: "RunPayway\u2122 Structural Standard",
  description:
    "The originating framework for Revenue Exposure measurement. Model Version RP-1.0.",
};

export default function StandardOverviewPage() {
  return (
    <>
      {/* H1 */}
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        RunPayway&#8482; Structural Standard
      </h1>

      {/* Subline */}
      <p className="mt-3 text-gray-500 text-sm">
        The originating framework for Revenue Exposure measurement
      </p>

      {/* Identity Mirror — conditional on calibration */}
      <IdentityMirror />

      {/* What This Is */}
      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          This is not marketing. This is not a blog. This is not a FAQ.
        </p>

        <p>
          This is an institutional, version-controlled reference system that:
        </p>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Defines vocabulary and meaning</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Defines governance and boundaries</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Defines the measurement architecture (without revealing scoring
              mechanics)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Provides calibration-based interpretation notes
              (industry/model/role)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Provides non-tactical &ldquo;exposure pattern&rdquo; previews (no
              solutions)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Increases trust and reduces hesitation without sales pressure
            </span>
          </li>
        </ul>
      </div>

      {/* Architecture Diagram — mini version */}
      <div className="my-12 flex flex-col items-center gap-0">
        {[
          "Structural Revenue Exposure",
          "Structural Diagnostic Standard (RP-1.0)",
          "RunPayway\u2122 Execution Layer",
          "Payway Rating\u2122 (0\u2013100)",
          "Structural Continuity Position",
        ].map((label, i, arr) => (
          <div key={label} className="flex flex-col items-center">
            <div className="border border-gray-200 rounded-lg px-5 py-3 text-center text-xs text-navy-900 font-medium bg-white min-w-[240px]">
              {label}
            </div>
            {i < arr.length - 1 && (
              <div className="w-px h-6 bg-gray-300 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-300" />
              </div>
            )}
          </div>
        ))}
        <p className="mt-4 text-xs text-gray-400 text-center">
          Structural Exposure &rarr; Standardized Measurement &rarr;
          Deterministic Output &rarr; Continuity Definition.
        </p>
      </div>

      {/* Exposure Pattern Viewer */}
      <ExposurePatternViewer />

      {/* CTA #1 — 24px below preceding content */}
      <div className="mt-16">
        <StandardCTAPrimary />
      </div>
    </>
  );
}
