"use client";

import { useEffect } from "react";
import { reportError } from "@/components/ErrorReporter";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError({
      error_message: error.message || "Unknown error",
      error_stack: error.stack || "",
      component: "error.tsx",
    });
  }, [error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      padding: 40,
      textAlign: "center",
    }}>
      <div style={{
        maxWidth: 520,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid rgba(14,26,43,0.08)",
        padding: "40px 32px",
        boxShadow: "0 4px 24px rgba(14,26,43,0.06)",
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1635", marginBottom: 12 }}>
          We&rsquo;re on it
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 20 }}>
          Your data is secure and your assessment is saved. This page encountered a temporary issue — it does not affect your results.
        </p>

        <div style={{
          backgroundColor: "rgba(14,26,43,0.03)",
          border: "1px solid rgba(14,26,43,0.08)",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 24,
          textAlign: "left",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(14,26,43,0.45)", marginBottom: 4 }}>
            Reference
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
            Please try refreshing the page. If you just completed an assessment, your data is saved and will load when you return.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => {
              // Clear potentially corrupted session data to break error loops
              try { sessionStorage.removeItem("rp_record"); } catch { /* */ }
              reset();
            }}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor: "#1C1635",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = "/RunPayway/"}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 500,
              color: "#6B7280",
              backgroundColor: "transparent",
              border: "1px solid rgba(14,26,43,0.12)",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Return to RunPayway
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 20 }}>
          If this keeps happening, <a href="/contact" style={{ color: "#4B3FAE" }}>contact support</a>.
        </p>
      </div>
    </div>
  );
}
