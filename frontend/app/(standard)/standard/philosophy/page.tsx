import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Measurement Philosophy \u2014 RunPayway\u2122 Structural Standard",
};

export default function PhilosophyPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Measurement Philosophy
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>Revenue is not only performance. Revenue is configuration.</p>

        <p>Performance fluctuates. Configuration persists.</p>

        <p>
          Most systems measure output. The RunPayway&#8482; Structural Standard
          measures dependency architecture.
        </p>

        <p>
          Revenue Exposure is measurable because income is constructed.
        </p>

        <p>
          Structure either sustains continuity &mdash; or involvement sustains
          continuity.
        </p>

        <p>
          Measurement must be stable, deterministic, version-controlled, and
          interpretable across time.
        </p>
      </div>
    </>
  );
}
