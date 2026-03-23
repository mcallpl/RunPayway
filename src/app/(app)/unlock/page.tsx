"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UnlockPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    // Verify record exists, then redirect to full report
    const record = sessionStorage.getItem("rp_record");
    if (!record) {
      router.push("/pricing");
      return;
    }

    const timer = setTimeout(() => {
      router.push("/review");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 800, height: 800, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 400,
          padding: "0 24px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
      >
        {/* Spinner */}
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.12)", borderTopColor: "#ffffff", margin: "0 auto 32px", animation: "rp-spin 0.8s linear infinite" }} />

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.45)", marginBottom: 16 }}>
          UNLOCKING YOUR FULL REPORT
        </div>

        <div style={{ fontSize: 24, fontWeight: 600, color: "#F4F1EA", marginBottom: 12 }}>
          Income Stability Score&#8482;
        </div>

        <div style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.6 }}>
          Building your 5-page diagnostic...
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6, height: 6, borderRadius: "50%",
                backgroundColor: "#F4F1EA",
                animation: `rp-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rp-spin { to { transform: rotate(360deg); } }
        @keyframes rp-pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
