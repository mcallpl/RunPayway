"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { C, sans } from "@/lib/design-tokens";

export default function DashboardSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const code = searchParams?.get("code");

    if (!code) {
      setError(true);
      return;
    }

    try {
      // Validate base64 format
      const decoded = JSON.parse(Buffer.from(code, "base64").toString("utf-8"));

      // Validate required fields
      if (!decoded.record_id || typeof decoded.final_score !== "number" || !decoded.stability_band) {
        setError(true);
        return;
      }

      // Store in both sessionStorage and localStorage
      sessionStorage.setItem("rp_record", code);
      localStorage.setItem("rp_record", code);

      // Redirect to dashboard after brief delay for celebration animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch {
      setError(true);
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: C.navy, margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Something Went Wrong
          </h1>
          <p style={{ fontSize: 16, color: "rgba(14,26,43,0.60)", margin: "0 0 28px", lineHeight: 1.6 }}>
            We couldn't find your access code. Please check your email for the correct code.
          </p>
          <a
            href="/dashboard/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 54,
              padding: "0 28px",
              fontSize: 16,
              fontWeight: 600,
              color: C.white,
              backgroundColor: C.navy,
              border: "none",
              borderRadius: 12,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 200ms",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Enter Code Manually
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ textAlign: "center", animation: "fadeSlideIn 600ms ease-out" }}>
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes celebrate {
            0% { transform: scale(0.95); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .celebrate-ring {
            animation: celebrate 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        `}</style>

        {/* Success check mark */}
        <div style={{ marginBottom: 24 }}>
          <div
            className="celebrate-ring"
            style={{
              width: 80,
              height: 80,
              margin: "0 auto",
              borderRadius: "50%",
              backgroundColor: "rgba(31,109,122,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 300, color: C.navy, margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          Your Report is Ready
        </h1>

        <p style={{ fontSize: 16, color: "rgba(14,26,43,0.60)", margin: "0 0 32px", maxWidth: 380, lineHeight: 1.6 }}>
          Your full income stability analysis and personalized 12-week action plan are loading. You'll see your next steps immediately.
        </p>

        {/* Loading indicator */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#1F6D7A",
              opacity: 0.3,
              animation: "pulse 1.5s ease-in-out 0s infinite",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#1F6D7A",
              opacity: 0.3,
              animation: "pulse 1.5s ease-in-out 0.3s infinite",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#1F6D7A",
              opacity: 0.3,
              animation: "pulse 1.5s ease-in-out 0.6s infinite",
            }}
          />
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>

        <p style={{ fontSize: 14, color: "rgba(14,26,43,0.40)", margin: 0 }}>
          Redirecting in a moment...
        </p>
      </div>
    </div>
  );
}
