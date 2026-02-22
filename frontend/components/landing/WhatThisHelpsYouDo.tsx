import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhatThisHelpsYouDo() {
  const decisions = [
    "delegation",
    "hiring",
    "process improvement",
    "stepping back",
    "scaling responsibly",
  ];

  return (
    <section className="bg-white" style={{ paddingTop: "64px", paddingBottom: "72px" }}>
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <div className="space-y-1 text-gray-700 leading-[1.6]">
            <p>See where income depends on you.</p>
            <p>See where it does not.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-6">
            <p className="text-gray-700 leading-[1.6]">Make decisions about:</p>
            <ul className="mt-4 space-y-3 text-gray-700 leading-[1.6]">
              {decisions.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-8 text-gray-700 leading-[1.6]">
            Measured dependency leads to stronger structure.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
