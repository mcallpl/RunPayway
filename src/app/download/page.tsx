"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Divider() {
  return <hr className="border-divider my-20" />;
}

const bands = [
  { label: "Limited", range: "0\u201339" },
  { label: "Developing", range: "40\u201359" },
  { label: "Established", range: "60\u201379" },
  { label: "High", range: "80\u2013100" },
];

function DownloadContent() {
  const searchParams = useSearchParams();
  const editionParam = searchParams.get("edition");
  const [edition, setEdition] = useState<"snapshot" | "record">(
    editionParam === "record" ? "record" : "snapshot"
  );
  const [profile, setProfile] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("runpayway_profile");
      if (p) setProfile(JSON.parse(p));
    }
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-[1280px] px-10">
      {/* Page Title */}
      <section className="max-w-[720px] py-24">
        <h1 className="text-[28px]">Report Preview</h1>
        <div className="mt-6 space-y-3 text-secondary">
          <p>
            Your assessment results will appear in the report format shown below.
          </p>
          <p>
            In Phase 1, this page renders the report structure only. Final
            scoring, issuance, and downloadable PDF generation are introduced in
            later phases.
          </p>
        </div>
        <p className="mt-4 text-sm text-secondary">Model RP-1.0 | Version 1.0</p>
      </section>

      <Divider />

      {/* Edition Selector */}
      <section className="max-w-[720px]">
        <h2>Report Edition</h2>
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => setEdition("snapshot")}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              edition === "snapshot"
                ? "border-navy bg-navy text-white"
                : "border-divider text-secondary hover:border-navy/30"
            }`}
          >
            Stability Snapshot
          </button>
          <button
            onClick={() => setEdition("record")}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              edition === "record"
                ? "border-navy bg-navy text-white"
                : "border-divider text-secondary hover:border-navy/30"
            }`}
          >
            Stability Record Edition
          </button>
        </div>
      </section>

      <Divider />

      {/* Report Surface */}
      <section className="max-w-[800px] mx-auto">
        <div className="bg-white">
          {/* Report Header */}
          <p className="text-lg font-semibold text-navy">RUNPAYWAY&trade;</p>
          <p className="text-sm text-secondary">Income Stability Score&trade;</p>
          {edition === "record" && (
            <>
              <p className="text-sm font-semibold text-navy mt-1">
                Stability Record Edition
              </p>
            </>
          )}
          <p className="text-sm text-secondary mt-1">
            <strong className="text-navy">Model: RP-1.0 | Version 1.0</strong>
          </p>

          <div className="mt-12">
            <h2>Income Stability Score</h2>
            <div className="mt-4 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
              [ Score will appear here ]
            </div>
            <div className="mt-3 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
              [ Stability band will appear here ]
            </div>
            <p className="mt-3 text-sm text-secondary">
              High Stability begins at 80
            </p>
          </div>

          <div className="mt-12">
            <h2>Income Stability Scale</h2>
            <div className="mt-4 grid grid-cols-4 text-center text-xs border border-divider rounded overflow-hidden">
              {bands.map((b) => (
                <div
                  key={b.label}
                  className="border-r border-divider last:border-r-0 py-3"
                >
                  <p className="font-medium text-navy">{b.label}</p>
                  <p className="text-secondary">{b.range}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-secondary">
              Your result will appear within the appropriate stability band.
            </p>
          </div>

          <div className="mt-12">
            <h3>Position Within Current Band</h3>
            <div className="mt-3 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
              [ Position bar will appear here ]
            </div>
            <div className="mt-2 text-sm text-secondary space-y-1">
              <p>Established Band Range: 60&ndash;79</p>
              <p>High Stability Threshold: 80</p>
            </div>
          </div>

          <Divider />

          {/* Income Structure Profile */}
          <div>
            <h2>Income Structure Profile</h2>
            <div className="mt-4 text-sm text-secondary space-y-1">
              <p>Classification: <span className="text-navy">[ {profile?.classification || "value"} ]</span></p>
              <p>Primary Income Model: <span className="text-navy">[ {profile?.primaryIncomeModel || "value"} ]</span></p>
              <p>Revenue Structure: <span className="text-navy">[ {profile?.revenueStructure || "value"} ]</span></p>
              <p>Revenue Range: <span className="text-navy">[ {profile?.revenueRange || "value"} ]</span></p>
              <p>Industry Sector: <span className="text-navy">[ {profile?.industrySector || "value"} ]</span></p>
              <p>Assessment Date (UTC): <span className="text-navy">[ {today} ]</span></p>
            </div>
          </div>

          <Divider />

          {/* What This Score Indicates */}
          <div>
            <h2>What This Score Indicates</h2>
            <div className="mt-3 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
              [ Interpretation text will appear here ]
            </div>
          </div>

          <div className="mt-12">
            <h2>Structural Drivers Supporting Stability</h2>
            <div className="mt-3 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
              [ Driver summary will appear here ]
            </div>
          </div>

          <Divider />

          {/* Primary Structural Constraint */}
          <div>
            <h2 className="uppercase text-base tracking-wide">
              Primary Structural Constraint
            </h2>
            <h3 className="mt-2">
              Income Continuity (90-Day Persistence Standard)
            </h3>
            <div className="mt-3 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
              [ Constraint explanation will appear here ]
            </div>
            <div className="mt-6">
              <h3>Income Continuity Indicator</h3>
              <p className="mt-2 text-sm text-secondary">
                Measured under the 90-Day Persistence Standard
              </p>
            </div>
            <div className="mt-6">
              <h3>Structural Priority</h3>
              <div className="mt-3 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
                [ Structural priority text will appear here ]
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3>Context</h3>
            <div className="mt-3 bg-warm-sand rounded-lg px-6 py-4 text-sm text-secondary">
              [ Context section will appear here ]
            </div>
          </div>

          <Divider />

          {/* Snapshot Summary */}
          <div>
            <h2>Snapshot Summary</h2>
            <div className="mt-4 text-sm text-secondary space-y-1">
              <p>Score: <span className="text-navy">[ value ]</span></p>
              <p>Band: <span className="text-navy">[ value ]</span></p>
              <p>Primary Structural Constraint: <span className="text-navy">[ value ]</span></p>
            </div>
          </div>

          <Divider />

          {/* Methodology */}
          <div>
            <h2>Methodology</h2>
            <p className="mt-3 text-sm text-secondary">
              Generated under Model RP-1.0 | Version 1.0
            </p>
          </div>

          <Divider />

          {/* Disclosure */}
          <div>
            <h2>Disclosure</h2>
            <p className="mt-3 text-sm text-secondary">
              Income Stability Score&trade; evaluates structural income stability
              at the time of submission.
            </p>
          </div>

          <Divider />

          {/* Official Stability Classification Record */}
          <div>
            <h2>Official Stability Classification Record</h2>
            <div className="mt-4 text-sm text-secondary space-y-1">
              <p>Record ID: <span className="text-navy">[ placeholder ]</span></p>
              <p>Issued (UTC): <span className="text-navy">[ placeholder ]</span></p>
              <p>Authorization Code: <span className="text-navy">[ placeholder ]</span></p>
              <p>Verification available at RunPayway.com/verify</p>
            </div>
          </div>

          {/* Record Edition extras */}
          {edition === "record" && (
            <>
              <Divider />
              <div>
                <h2>Stability Record</h2>
                <p className="mt-3 text-sm text-secondary">
                  Stability Record Edition tracks structural income stability over
                  time.
                </p>
                <div className="mt-4 text-sm text-secondary space-y-1">
                  <p>Assessments Issued: <span className="text-navy">[ value ]</span></p>
                  <p>Assessments Remaining: <span className="text-navy">[ value ]</span></p>
                </div>
              </div>

              <div className="mt-12">
                <h2>Current Assessment</h2>
                <div className="mt-4 text-sm text-secondary space-y-1">
                  <p>Score: <span className="text-navy">[ value ]</span></p>
                  <p>Classification: <span className="text-navy">[ value ]</span></p>
                  <p>Assessment Date (UTC): <span className="text-navy">[ value ]</span></p>
                </div>
              </div>

              <div className="mt-12">
                <h2>Prior Assessment</h2>
                <div className="mt-4 text-sm text-secondary space-y-1">
                  <p>Score: <span className="text-navy">[ value ]</span></p>
                  <p>Classification: <span className="text-navy">[ value ]</span></p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Divider />

      {/* Actions */}
      <section className="max-w-[720px] pb-24">
        <div className="flex gap-4">
          <button
            disabled
            className="bg-divider text-secondary px-6 py-3 rounded-md text-sm font-medium cursor-not-allowed opacity-60"
          >
            Download $39 Report (PDF)
          </button>
          <button
            disabled
            className="bg-divider text-secondary px-6 py-3 rounded-md text-sm font-medium cursor-not-allowed opacity-60"
          >
            Download $84 Report (PDF)
          </button>
        </div>
        <div className="mt-8 text-sm text-secondary space-y-1">
          <p>Snapshot ID: <span className="text-navy">[ placeholder ]</span></p>
          <p>Authentication Code: <span className="text-navy">[ placeholder ]</span></p>
          <p>Issuance Timestamp: <span className="text-navy">[ {today}T00:00:00Z ]</span></p>
        </div>
      </section>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1280px] px-10 py-24"><p className="text-secondary">Loading...</p></div>}>
      <DownloadContent />
    </Suspense>
  );
}
