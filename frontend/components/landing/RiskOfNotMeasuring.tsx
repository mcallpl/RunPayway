import ScrollReveal from "@/components/ui/ScrollReveal";

export default function RiskOfNotMeasuring() {
  return (
    <section className="bg-white" style={{ paddingTop: "64px", paddingBottom: "72px" }}>
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <p className="text-gray-700 leading-[1.6]">
            Dependency does not appear on a profit report.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-6">
            <p className="text-gray-700 leading-[1.6]">It shows up when:</p>
            <ul className="mt-4 space-y-3 text-gray-700 leading-[1.6]">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                <span>you take time off</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                <span>demand increases</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                <span>a key client leaves</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                <span>enforcement tightens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                <span>you need to delegate</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-8 space-y-4 text-gray-700 leading-[1.6]">
            <p>If income depends mostly on you, continuity is limited.</p>
            <p>If income depends mostly on structure, continuity expands.</p>
            <p>RunPayway&#8482; shows where you stand.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
