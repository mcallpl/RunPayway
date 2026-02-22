import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ScopeSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold text-navy-900">Scope</h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="mt-8 space-y-4 text-gray-700 leading-[1.6]">
            <p>RunPayway&#8482; is a one-time structural diagnostic.</p>
            <p>
              It produces a finalized digital report reflecting how your income
              is structured today.
            </p>
            <p>It does not provide financial advice.</p>
            <p>It provides structural clarity.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
