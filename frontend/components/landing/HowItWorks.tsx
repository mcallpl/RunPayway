import ScrollReveal from "@/components/ui/ScrollReveal";

export default function HowItWorks() {
  const steps = [
    "Answer structured prompts calibrated to your industry and role.",
    "Your responses are evaluated using defined standards.",
    "Your Payway Rating\u2122 is generated instantly.",
    "Your report is delivered immediately.",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">How It Works</h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="mt-8 space-y-4 text-gray-700 leading-[1.6]">
            {steps.map((step) => (
              <p key={step}>{step}</p>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="mt-6 text-gray-700 leading-[1.6]">
            No consultation. No scheduling. No ongoing commitment.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
