import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "RunPayway\u2122 Structural Standard",
  description:
    "This content has moved to the RunPayway Structural Standard.",
};

export default function ReferenceGuidePage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            This Content Has Moved
          </h1>
          <p className="text-gray-700 leading-[1.6] mb-8">
            The Reference Guide has been replaced by the RunPayway&#8482;
            Structural Standard &mdash; a comprehensive, version-controlled
            documentation environment.
          </p>
          <Link
            href="/standard"
            className="inline-block bg-navy-900 text-white px-8 py-4 text-lg font-medium rounded-[5px] hover:bg-navy-800 transition-colors"
          >
            Go to RunPayway&#8482; Structural Standard
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
