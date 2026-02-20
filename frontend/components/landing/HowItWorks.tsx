import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    text: "Complete a fixed, criteria-based diagnostic calibrated to your industry and role.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    text: "Responses are evaluated using defined structural criteria.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    text: "Your Payway Rating is generated immediately.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    text: "You receive a documented structural report reflecting revenue configuration at the time of assessment.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">How It Works</h2>
        </ScrollReveal>
        <ol className="mt-8 space-y-5">
          {steps.map((step, index) => (
            <ScrollReveal key={index} delay={index * 120}>
              <li className="flex gap-4 text-gray-700 leading-relaxed items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-900/5 text-navy-900 shrink-0 mt-0.5">
                  {step.icon}
                </span>
                <div>
                  <span className="text-xs font-semibold text-navy-900 uppercase tracking-wider">
                    Step {index + 1}
                  </span>
                  <p className="mt-1">{step.text}</p>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
