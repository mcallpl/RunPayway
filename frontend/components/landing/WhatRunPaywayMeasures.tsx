import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhatRunPaywayMeasures() {
  const factors = [
    "your direct involvement",
    "repeatable systems",
    "enforceable agreements",
    "concentrated relationships",
    "transferable processes",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <p className="text-gray-700 leading-[1.6]">
            RunPayway&#8482; evaluates how income is built.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-5">
            <p className="text-gray-700 leading-[1.6]">
              Specifically, whether it depends on:
            </p>
            <ul className="mt-4 space-y-3 text-gray-700 leading-[1.6]">
              {factors.map((factor) => (
                <li key={factor} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-8 space-y-5 text-gray-700 leading-[1.6]">
            <p>It does not measure revenue size or growth.</p>
            <p>It measures structural dependency.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
