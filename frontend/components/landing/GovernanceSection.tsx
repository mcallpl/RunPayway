import ScrollReveal from "@/components/ui/ScrollReveal";

export default function GovernanceSection() {
  return (
    <section className="pt-16 pb-18 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <div className="space-y-4 text-gray-600 text-[15px] leading-[1.6]">
            <p>Model Version: RP-1.0</p>
            <p>
              Identical inputs under the same model version produce identical
              Payway Ratings&#8482;.
            </p>
            <p>
              Model updates are documented and versioned over time.
            </p>
            <p>Standards remain fixed within each version.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
