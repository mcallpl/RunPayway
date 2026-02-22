import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reassessment \u2014 RunPayway\u2122 Structural Standard",
};

export default function ReassessPage() {
  return (
    <>
      <h1 className="text-[40px] md:text-[44px] font-bold text-navy-900 tracking-tight leading-tight">
        Reassessment
      </h1>

      <div className="mt-10 space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          A Payway Rating&#8482; reflects the structural state of income at the
          time of assessment. It is not a permanent classification.
        </p>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          When Reassessment May Be Appropriate
        </h2>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Revenue model or primary income source changes</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Client or contract base undergoes significant turnover
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Business operations shift (e.g., from project-based to retainer)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Role within the revenue process changes (e.g., from solo
              practitioner to team lead)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>
              Six or more months have passed since the last assessment
            </span>
          </li>
        </ul>

        <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900 pt-4">
          Independence of Assessments
        </h2>

        <p>
          Each assessment is independent. Previous ratings do not influence
          future results. The diagnostic measures the current structural state,
          not trajectory or change over time.
        </p>

        <p>
          Reassessment provides a new data point. Over multiple assessments, a
          pattern of structural change may emerge, but the Payway Rating itself
          does not track or compare historical results.
        </p>
      </div>
    </>
  );
}
