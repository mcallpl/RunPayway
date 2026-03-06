"use client";

import { useState } from "react";

function Divider() {
  return <hr className="border-divider my-20" />;
}

type VerifyState = "idle" | "verified" | "not-found";

export default function VerificationPage() {
  const [recordId, setRecordId] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [state, setState] = useState<VerifyState>("idle");

  const handleVerify = () => {
    if (!recordId.trim() || !authCode.trim()) return;
    // Phase 1: mock verification state toggle
    setState((prev) => (prev === "verified" ? "not-found" : "verified"));
  };

  const inputClass =
    "w-full border border-divider rounded-md px-3 py-3 text-sm text-navy bg-white focus:outline-none focus:ring-1 focus:ring-navy/30";

  return (
    <div className="mx-auto max-w-[1280px] px-10">
      {/* Page Title + Context */}
      <section className="max-w-[720px] py-24">
        <h1 className="text-[28px]">Verify Stability Record</h1>
        <div className="mt-6 space-y-3 text-secondary">
          <p>
            RunPayway&trade; reports include a{" "}
            <strong className="text-navy">verification record</strong> to confirm
            authenticity.
          </p>
          <p>
            Enter the <strong className="text-navy">Record ID</strong> and{" "}
            <strong className="text-navy">Authorization Code</strong> from the
            report to confirm issuance under{" "}
            <strong className="text-navy">Model RP-1.0</strong>.
          </p>
        </div>
        <p className="mt-4 text-sm text-secondary">Model RP-1.0 | Version 1.0</p>
      </section>

      <Divider />

      {/* Verification Input Section */}
      <section className="max-w-[720px]">
        <div className="space-y-6">
          <div>
            <label htmlFor="recordId" className="block text-sm font-medium text-navy mb-1">
              Record ID
            </label>
            <input
              id="recordId"
              type="text"
              placeholder="Enter record ID"
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-secondary">
              Record ID appears in the Official Stability Classification Record
              section of the report.
            </p>
          </div>

          <div>
            <label htmlFor="authCode" className="block text-sm font-medium text-navy mb-1">
              Authorization Code
            </label>
            <input
              id="authCode"
              type="text"
              placeholder="Enter authorization code"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-secondary">
              Authorization Code confirms the report was issued by RunPayway.
            </p>
          </div>
        </div>

        <button
          onClick={handleVerify}
          className="mt-8 bg-navy text-white px-6 py-3 rounded-md text-sm font-medium hover:opacity-90"
        >
          Verify Record
        </button>
      </section>

      <Divider />

      {/* Verification Result Surface */}
      <section className="max-w-[720px] pb-24">
        <div className="bg-warm-sand rounded-lg p-8">
          <h2 className="text-base">Verification Result</h2>

          {state === "idle" && (
            <p className="mt-4 text-sm text-secondary">
              Verification results will appear here once a Record ID and
              Authorization Code are submitted.
            </p>
          )}

          {state === "verified" && (
            <div className="mt-4">
              <h3 className="text-teal font-semibold">Record Verified</h3>
              <p className="mt-2 text-sm text-secondary">
                Issued by RunPayway&trade;
              </p>
              <div className="mt-4 text-sm text-secondary space-y-1">
                <p>Report Type: <span className="text-navy">[ placeholder ]</span></p>
                <p>Model Version: <span className="text-navy">RP-1.0 | Version 1.0</span></p>
                <p>Issued (UTC): <span className="text-navy">[ placeholder ]</span></p>
                <p>Record ID: <span className="text-navy">[ placeholder ]</span></p>
              </div>
              <p className="mt-4 text-xs text-secondary">
                This report was generated under the RunPayway structural income
                stability model.
              </p>
            </div>
          )}

          {state === "not-found" && (
            <div className="mt-4">
              <h3 className="text-navy font-semibold">Record Not Found</h3>
              <div className="mt-2 text-sm text-secondary space-y-2">
                <p>
                  The provided Record ID and Authorization Code could not be
                  verified.
                </p>
                <p>
                  Check the information provided in the report and try again.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Verification Disclosure */}
        <div className="mt-12 text-sm text-secondary space-y-2">
          <p>
            Verification confirms that a report was issued by RunPayway using the
            referenced Record ID.
          </p>
          <p>
            Verification does not evaluate the accuracy of the information
            provided at the time of assessment.
          </p>
        </div>
      </section>
    </div>
  );
}
