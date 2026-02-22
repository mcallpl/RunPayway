import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhoThisIsFor() {
  const segments = [
    "Contracts",
    "Clients",
    "Transactions",
    "Retainers",
    "Commissions",
    "Negotiated agreements",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">
            Who This Is For
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="mt-6 text-gray-700 leading-[1.6]">
            Professionals and businesses whose income depends on:
          </p>
          <ul className="mt-4 space-y-3 text-gray-700 leading-[1.6]">
            {segments.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5" aria-hidden="true">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-8 space-y-4 text-gray-700 leading-[1.6]">
            <p>
              Where continuity should not rely entirely on personal availability.
            </p>
            <p>
              Used across service industries, commission-based roles, advisory
              practices, and founder-led businesses.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
