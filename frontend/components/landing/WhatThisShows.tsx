import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhatThisShows() {
  const items = [
    "Your Payway Rating (0\u2013100)",
    "Your Dependency Classification",
    "The proportion of revenue supported by structure",
    "The proportion requiring direct attention",
    "Structural pressure sensitivity",
    "A dated, documented structural report",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">
            What This Shows &mdash; At a Glance
          </h2>
        </ScrollReveal>
        <ul className="mt-8 space-y-3">
          {items.map((item, i) => (
            <ScrollReveal key={item} delay={i * 80}>
              <li className="text-gray-700 leading-relaxed">
                <span className="text-gray-400 mr-3" aria-hidden="true">
                  &mdash;
                </span>
                {item}
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
