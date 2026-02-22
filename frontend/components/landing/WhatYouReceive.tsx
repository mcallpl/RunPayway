import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhatYouReceive() {
  const items = [
    "Payway Rating\u2122 (0\u2013100)",
    "Dependency Classification",
    "Percentage supported by structure",
    "Percentage requiring direct involvement",
    "Structural sensitivity indicators",
    "What improves the next rating band",
    "Model Version (RP-1.0)",
    "Unique Assessment ID",
  ];

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <p className="text-gray-700 leading-[1.6]">
            A dated structural report including:
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <ul className="mt-5 space-y-3.5 text-gray-700 leading-[1.6]">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-8 space-y-4 text-gray-700 leading-[1.6]">
            <p>Delivered immediately.</p>
            <p>Clear. Practical. Reference-ready.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
