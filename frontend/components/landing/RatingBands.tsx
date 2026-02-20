import ScrollReveal from "@/components/ui/ScrollReveal";

export default function RatingBands() {
  const bands = [
    {
      range: "80\u2013100",
      label: "Structurally Supported",
      border: "border-l-emerald-700",
    },
    {
      range: "60\u201379",
      label: "Mixed Structural Support",
      border: "border-l-sky-700",
    },
    {
      range: "40\u201359",
      label: "Attention-Weighted",
      border: "border-l-amber-700",
    },
    {
      range: "0\u201339",
      label: "Attention-Dependent",
      border: "border-l-red-800",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">Rating Bands</h2>
        </ScrollReveal>
        <div className="mt-8 space-y-0">
          {bands.map((band, i) => (
            <ScrollReveal key={band.range} delay={i * 100}>
              <div
                className={`flex items-baseline gap-6 border-l-4 ${band.border} py-4 pl-5`}
              >
                <span className="text-sm font-medium text-navy-900 w-20 shrink-0">
                  {band.range}
                </span>
                <span className="text-gray-700">{band.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
