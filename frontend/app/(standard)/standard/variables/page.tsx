import type { Metadata } from "next";
import Link from "next/link";
import { VARIABLE_DOMAINS } from "@/lib/standard-variables";

export const metadata: Metadata = {
  title: "Structural Variables \u2014 RunPayway\u2122 Structural Standard",
};

export default function VariablesPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Structural Variables
      </h1>
      <p className="mt-3 text-gray-500 text-sm">
        Defined structural variables organized into domains
      </p>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          The RunPayway&#8482; Structural Standard defines a formal taxonomy of
          structural variables. Each variable represents a measurable dimension
          of income dependency.
        </p>

        <p>
          Variables are organized into six domains. Each domain addresses a
          distinct aspect of how revenue is structured, concentrated, enforced,
          or sustained.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {VARIABLE_DOMAINS.map((domain) => (
          <div key={domain.numeral}>
            <h2 className="text-[18px] md:text-[20px] font-medium text-navy-900">
              {domain.numeral}. {domain.label}
            </h2>
            <ul className="mt-4 space-y-2">
              {domain.variables.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/standard/variables/${v.slug}`}
                    className="text-[16px] md:text-[18px] text-gray-700 hover:text-navy-900 hover:underline"
                  >
                    {v.name}
                  </Link>
                  <span className="text-gray-400 text-sm ml-2">
                    &mdash; {v.description.split(".")[0]}.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          This page explains interpretation only. It does not disclose scoring
          criteria.
        </p>
      </div>
    </>
  );
}
