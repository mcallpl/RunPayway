"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Divider() {
  return <hr className="border-divider my-20" />;
}

const questionLabels: Record<string, string> = {
  q1: "Recurring Revenue Base",
  q2: "Income Concentration",
  q3: "Income Source Count",
  q4: "Forward Revenue Visibility",
  q5: "Earnings Variability",
  q6: "Income Continuity Without Active Labor",
};

const optionLabels: Record<string, Record<string, string>> = {
  q1: { A: "0\u201310%", B: "11\u201330%", C: "31\u201360%", D: "61\u201385%", E: "86\u2013100%" },
  q2: { A: "90\u2013100%", B: "70\u201389%", C: "50\u201369%", D: "30\u201349%", E: "Under 30%" },
  q3: { A: "1", B: "2", C: "3\u20134", D: "5\u20137", E: "8 or more" },
  q4: { A: "Less than 1 month", B: "1\u20132 months", C: "3\u20135 months", D: "6\u201311 months", E: "12 or more months" },
  q5: { A: "More than 75%", B: "50\u201375%", C: "25\u201349%", D: "10\u201324%", E: "Less than 10%" },
  q6: { A: "0%", B: "1\u201325%", C: "26\u201350%", D: "51\u201375%", E: "76\u2013100%" },
};

const bands = [
  { label: "Limited", range: "0\u201339" },
  { label: "Developing", range: "40\u201359" },
  { label: "Established", range: "60\u201379" },
  { label: "High", range: "80\u2013100" },
];

export default function ReviewPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [answers, setAnswers] = useState<Record<string, string> | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("runpayway_profile");
      const d = localStorage.getItem("runpayway_diagnostic");
      if (p) setProfile(JSON.parse(p));
      if (d) setAnswers(JSON.parse(d));
    }
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-[1280px] px-10">
      {/* Page Title */}
      <section className="max-w-[720px] py-24">
        <h1 className="text-[28px]">Review Assessment</h1>
        <div className="mt-6 space-y-3 text-secondary">
          <p>
            Before generating your{" "}
            <strong className="text-navy">Income Stability Score&trade;</strong>{" "}
            report, confirm the information below.
          </p>
          <p>
            The final report will be issued under{" "}
            <strong className="text-navy">Model RP-1.0</strong> using the
            structural information shown.
          </p>
        </div>
        <p className="mt-4 text-sm text-secondary">Model RP-1.0 | Version 1.0</p>
      </section>

      <Divider />

      {/* Income Structure Profile */}
      <section className="max-w-[720px]">
        <h2>Income Structure Profile</h2>
        <div className="mt-4 text-sm text-secondary space-y-1">
          <p>Classification: <span className="text-navy">{profile?.classification || "\u2014"}</span></p>
          <p>Primary Income Model: <span className="text-navy">{profile?.primaryIncomeModel || "\u2014"}</span></p>
          <p>Revenue Structure: <span className="text-navy">{profile?.revenueStructure || "\u2014"}</span></p>
          <p>Revenue Range: <span className="text-navy">{profile?.revenueRange || "\u2014"}</span></p>
          <p>Industry Sector: <span className="text-navy">{profile?.industrySector || "\u2014"}</span></p>
          <p>Assessment Date (UTC): <span className="text-navy">{today}</span></p>
        </div>
      </section>

      <Divider />

      {/* Structural Inputs */}
      <section className="max-w-[720px]">
        <h2>Structural Inputs</h2>
        <div className="mt-6 space-y-8">
          {Object.entries(questionLabels).map(([qId, label]) => (
            <div key={qId}>
              <h3 className="text-base">{label}</h3>
              <p className="mt-1 text-sm text-secondary">Selected Response</p>
              <div className="mt-2 bg-divider/30 rounded-md px-4 py-3 text-sm text-navy">
                {answers?.[qId]
                  ? optionLabels[qId][answers[qId]]
                  : "[ No response ]"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Report Preview */}
      <section className="max-w-[720px]">
        <h2>Report Preview</h2>
        <p className="mt-2 text-sm text-secondary">
          This section previews the{" "}
          <strong className="text-navy">structure of the report that will be issued</strong>.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-base">Income Stability Score</h3>
            <div className="mt-2 bg-divider/30 rounded-md px-4 py-3 text-sm text-secondary">
              [ Score will appear here ]
            </div>
          </div>

          <div>
            <h3 className="text-base">Stability Classification</h3>
            <div className="mt-2 bg-divider/30 rounded-md px-4 py-3 text-sm text-secondary">
              [ Classification will appear here ]
            </div>
          </div>

          <div>
            <h3 className="text-base">Stability Scale</h3>
            <div className="mt-2 grid grid-cols-4 text-center text-xs border border-divider rounded overflow-hidden">
              {bands.map((b) => (
                <div key={b.label} className="border-r border-divider last:border-r-0 py-2">
                  <p className="font-medium text-navy">{b.label}</p>
                  <p className="text-secondary">{b.range}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Report Edition */}
      <section className="max-w-[720px]">
        <h2>Report Edition</h2>
        <div className="mt-2 bg-divider/30 rounded-md px-4 py-3 text-sm text-navy">
          Report Edition: Stability Snapshot
        </div>
      </section>

      <Divider />

      {/* Confirmation */}
      <section className="max-w-[720px]">
        <h2>Confirmation</h2>
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-divider"
          />
          <span className="text-sm text-secondary">
            I confirm the information above accurately reflects my income
            structure at the time of assessment.
          </span>
        </label>
      </section>

      {/* Navigation */}
      <section className="max-w-[720px] flex items-center gap-4 mt-12 pb-24">
        <Link
          href="/diagnostic"
          className="text-sm text-secondary hover:text-navy font-medium"
        >
          Edit Responses
        </Link>
        <button
          onClick={() => confirmed && router.push("/download")}
          disabled={!confirmed}
          className={`bg-navy text-white px-6 py-3 rounded-md text-sm font-medium ${
            confirmed ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Generate Stability Report
        </button>
      </section>
    </div>
  );
}
