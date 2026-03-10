"use client";

import { useState } from "react";

interface VerificationResult {
  valid_record: boolean;
  record_id?: string;
  model_version?: string;
  final_score?: number;
  stability_band?: string;
  assessment_date?: string;
  issued_timestamp?: string;
  verified_at?: string;
  verification_statement?: string;
}

export default function VerifyPage() {
  const [recordId, setRecordId] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record_id: recordId.trim(),
          authorization_code: authCode.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Verification request failed.");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      recordId.trim()
    ) && /^[a-f0-9]{64}$/.test(authCode.trim().toLowerCase());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Record Verification
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Verify a RunPayway-issued Income Stability Assessment record.
        </p>
      </div>

      <section className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Record ID
          </label>
          <input
            type="text"
            value={recordId}
            onChange={(e) => setRecordId(e.target.value)}
            placeholder="UUID v4 format"
            className="font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Authorization Code
          </label>
          <input
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            placeholder="64-character hexadecimal string"
            className="font-mono text-xs"
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={!isValid || loading}
          className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Record"}
        </button>
      </section>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}

      {result && (
        <section className="border border-gray-200 rounded-lg bg-white p-6">
          {result.valid_record ? (
            <div className="space-y-4">
              <div className="text-sm font-medium text-green-700">
                {result.verification_statement}
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  ["Record ID", result.record_id],
                  ["Model Version", result.model_version],
                  ["Income Stability Score", String(result.final_score)],
                  ["Stability Band", result.stability_band],
                  ["Assessment Date", result.assessment_date],
                  ["Issued", result.issued_timestamp],
                  ["Verified At", result.verified_at],
                ].map(([label, value]) => (
                  <div key={label} className="flex">
                    <dt className="w-48 text-neutral-500 shrink-0">
                      {label}
                    </dt>
                    <dd className="text-neutral-800 font-mono text-xs break-all">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="text-sm text-neutral-600">
              No matching record found. The provided Record ID and
              Authorization Code do not correspond to a valid assessment.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
