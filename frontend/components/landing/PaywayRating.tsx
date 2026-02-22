import ScrollReveal from "@/components/ui/ScrollReveal";

export default function PaywayRating() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">
            The Payway Rating&#8482;
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="mt-8 space-y-4 text-gray-700 leading-[1.6]">
            <p>The Payway Rating&#8482; ranges from 0 to 100.</p>
            <p>
              Higher ratings mean income runs primarily on systems.
            </p>
            <p>
              Lower ratings mean income runs primarily on your time and
              involvement.
            </p>
            <p>
              Identical inputs under the same model version produce identical
              results.
            </p>
            <p>The model is stable. Your answers determine the outcome.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
