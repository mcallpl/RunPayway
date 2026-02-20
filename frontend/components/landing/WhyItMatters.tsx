import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhyItMatters() {
  const statements = [
    "Revenue performance does not define revenue reliability.",
    "Income may appear active while structural exposure remains.",
    "When revenue depends on direct involvement, continuity is conditional.",
    "When revenue is structurally sustained, continuity is defined.",
    "The Payway Rating makes that distinction measurable.",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">
            Why It Matters
          </h2>
        </ScrollReveal>
        <div className="mt-8 space-y-5">
          {statements.map((statement, i) => (
            <ScrollReveal key={statement} delay={i * 100}>
              <p className="text-gray-700 leading-relaxed">{statement}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
