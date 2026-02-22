import { notFound } from "next/navigation";
import { ALL_VARIABLES, getVariableBySlug } from "@/lib/standard-variables";

export async function generateStaticParams() {
  return ALL_VARIABLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const variable = getVariableBySlug(slug);
  return {
    title: variable
      ? `${variable.name} \u2014 RunPayway\u2122 Structural Standard`
      : "Variable Not Found",
  };
}

export default async function VariableDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const variable = getVariableBySlug(slug);

  if (!variable) return notFound();

  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        {variable.name}
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        Domain {variable.domainIndex}: {variable.domainLabel}
      </p>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        {/* Definition */}
        <p>{variable.description}</p>

        {/* Why It Matters */}
        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Why It Matters
        </h2>
        <ul className="space-y-3 pl-1">
          {variable.whyItMatters.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-gray-400 mt-0.5">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* How It Tends to Present */}
        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          How It Tends to Present
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <h3 className="text-[16px] font-medium text-navy-900 mb-3">
              Structure-Supported
            </h3>
            <ul className="space-y-3 pl-1">
              {variable.structureSupported.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-emerald-600 mt-0.5">&bull;</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[16px] font-medium text-navy-900 mb-3">
              Direct-Involvement
            </h3>
            <ul className="space-y-3 pl-1">
              {variable.directInvolvement.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-red-600 mt-0.5">&bull;</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reassessment Trigger */}
        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Reassessment Trigger
        </h2>
        <p>{variable.reassessmentTrigger}</p>
      </div>

      {/* Boundary Note */}
      <div className="mt-12 border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          This page explains interpretation only. It does not disclose scoring
          criteria.
        </p>
      </div>
    </>
  );
}
