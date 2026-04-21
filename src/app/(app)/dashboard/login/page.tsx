"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { C, sans } from "@/lib/design-tokens";

const STRIPE_URL = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmed = code.trim();
      if (!trimmed) {
        setError("Please enter your access code");
        setLoading(false);
        return;
      }

      // Validate base64 format
      let decoded: Record<string, unknown>;
      try {
        decoded = JSON.parse(Buffer.from(trimmed, "base64").toString("utf-8"));
      } catch {
        setError("Invalid access code format. Please check and try again.");
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!decoded.record_id || typeof decoded.final_score !== "number" || !decoded.stability_band) {
        setError("Access code is incomplete or expired. Please get a new one.");
        setLoading(false);
        return;
      }

      // Store in both sessionStorage and localStorage
      sessionStorage.setItem("rp_record", trimmed);
      localStorage.setItem("rp_record", trimmed);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(31,109,122,0.75)", marginBottom: 16, textTransform: "uppercase" }}>
            RunPayway™
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: C.navy, margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Access Your Report
          </h1>
          <p style={{ fontSize: 16, color: "rgba(14,26,43,0.60)", margin: 0, lineHeight: 1.6 }}>
            Enter your access code to view your income stability analysis and personalized plan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10, letterSpacing: "0.02em" }}>
              Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 15,
                fontFamily: "'Monaco', 'Courier New', monospace",
                border: `1px solid ${error ? "rgba(229, 62, 62, 0.30)" : "rgba(14,26,43,0.12)"}`,
                borderRadius: 12,
                backgroundColor: C.white,
                color: C.navy,
                transition: "border-color 200ms, box-shadow 200ms",
                boxSizing: "border-box" as const,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = error ? "rgba(229, 62, 62, 0.50)" : "rgba(31,109,122,0.30)";
                e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? "rgba(229, 62, 62, 0.06)" : "rgba(31,109,122,0.06)"}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? "rgba(229, 62, 62, 0.30)" : "rgba(14,26,43,0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{ padding: "12px 14px", marginBottom: 20, borderRadius: 10, backgroundColor: "rgba(229, 62, 62, 0.06)", border: "1px solid rgba(229, 62, 62, 0.15)" }}>
              <p style={{ fontSize: 14, color: "rgba(229, 62, 62, 0.85)", margin: 0, lineHeight: 1.5 }}>
                {error}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 54,
              padding: 0,
              fontSize: 16,
              fontWeight: 600,
              color: C.white,
              backgroundColor: C.navy,
              border: "none",
              borderRadius: 12,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "opacity 200ms, transform 200ms",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? "Verifying..." : "Access Your Dashboard"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "rgba(14,26,43,0.08)" }} />
          <span style={{ fontSize: 13, color: "rgba(14,26,43,0.40)", whiteSpace: "nowrap" }}>Don't have a code?</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "rgba(14,26,43,0.08)" }} />
        </div>

        {/* Secondary CTA */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: "rgba(14,26,43,0.60)", margin: "0 0 16px", lineHeight: 1.6 }}>
            Get access to your full income stability report and personalized 12-week action plan.
          </p>
          <a
            href={STRIPE_URL}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              padding: "0 24px",
              fontSize: 15,
              fontWeight: 600,
              color: "#4B3FAE",
              backgroundColor: "rgba(75, 63, 174, 0.08)",
              border: `1px solid rgba(75, 63, 174, 0.20)`,
              borderRadius: 10,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 200ms",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(75, 63, 174, 0.12)";
              e.currentTarget.style.borderColor = "rgba(75, 63, 174, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(75, 63, 174, 0.08)";
              e.currentTarget.style.borderColor = "rgba(75, 63, 174, 0.20)";
            }}
          >
            Get Your Full Report — $69
          </a>
        </div>

        {/* Footer info */}
        <div style={{ textAlign: "center", paddingTop: 24, borderTop: `1px solid rgba(14,26,43,0.08)` }}>
          <p style={{ fontSize: 12, color: "rgba(14,26,43,0.40)", margin: 0, lineHeight: 1.6 }}>
            Your access code was emailed to you after purchase. Check your inbox or spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
