import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhyPeopleRunThis() {
  return (
    <section className="pt-16 pb-20 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <ScrollReveal>
          <div className="space-y-5 text-gray-700 leading-[1.6]">
            <p>Most professionals track revenue.</p>
            <p>Few measure what revenue depends on.</p>
            <p>The question is simple:</p>
            <p className="text-navy-900 font-medium">
              If you step away for a period of time, what happens to income?
            </p>
            <p>RunPayway&#8482; gives you a clear answer.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
