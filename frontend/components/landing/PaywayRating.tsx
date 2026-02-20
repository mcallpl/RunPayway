import ScrollReveal from "@/components/ui/ScrollReveal";

export default function PaywayRating() {
  const points = [
    "The Payway Rating is a 0\u2013100 structural evaluation.",
    "Higher ratings indicate revenue sustained primarily through structure.",
    "Lower ratings indicate revenue sustained primarily through direct involvement.",
    "Structure determines how revenue behaves under pressure, absence, and disruption.",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">
            The Payway Rating
          </h2>
        </ScrollReveal>
        <div className="mt-8 space-y-4">
          {points.map((point, i) => (
            <ScrollReveal key={point} delay={i * 100}>
              <p className="text-gray-700 leading-relaxed">{point}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
