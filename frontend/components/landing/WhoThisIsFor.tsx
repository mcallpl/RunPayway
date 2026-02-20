import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhoThisIsFor() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">
            Who This Is For
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="mt-6 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Built for professionals and businesses whose income depends on
            contracts, clients, transactions, retainers, commissions, and
            negotiated agreements &mdash; where revenue exposure must be defined,
            not assumed.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
