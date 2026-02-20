export default function HowItWorks() {
  const steps = [
    "Complete a fixed, criteria-based diagnostic calibrated to your industry and role.",
    "Responses are evaluated using defined structural criteria.",
    "Your Payway Rating is generated immediately.",
    "You receive a documented structural report reflecting revenue configuration at the time of assessment.",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-2xl font-semibold text-navy-900">How It Works</h2>
        <ol className="mt-8 space-y-5">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-4 text-gray-700 leading-relaxed">
              <span className="text-sm font-semibold text-navy-900 mt-0.5 shrink-0">
                {index + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
