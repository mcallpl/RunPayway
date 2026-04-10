"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      const payload = {
        error_message: error.message || "Unknown global error",
        error_stack: error.stack || "",
        component: "global-error.tsx",
        page_url: typeof window !== "undefined" ? window.location.href : "",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      };
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("https://runpayway-pressuremap.mcallpl.workers.dev/error-report", blob);
      }
    } catch { /* reporting should never throw */ }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", margin: 0, padding: 0, backgroundColor: "#FAFAFA" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
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
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1C1635", marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 20 }}>
              We encountered an unexpected error. Your data has been saved. Please try again.
            </p>

            {/* Show the actual error so we can debug */}
            <div style={{
              backgroundColor: "rgba(220,38,38,0.04)",
              border: "1px solid rgba(220,38,38,0.12)",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 24,
              textAlign: "left",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", marginBottom: 4 }}>
                Error Details
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5 }}>
                {error?.message || "Unknown error"}
              </div>
              {error?.digest && (
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                  Digest: {error.digest}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  backgroundColor: "#1C1635",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
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
                Go Home
              </button>
            </div>

            <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 20 }}>
              If this keeps happening, <a href="/RunPayway/contact" style={{ color: "#4B3FAE" }}>contact support</a>.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
