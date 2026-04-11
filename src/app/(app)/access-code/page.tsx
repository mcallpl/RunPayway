"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import SuiteHeader from "@/components/SuiteHeader";
import { C, mono, sans } from "@/lib/design-tokens";

const B = {
  navy: C.navy,
  purple: C.purple,
  teal: C.teal,
  white: C.white,
  bg: "#FAFAFA",
  surface: C.white,
  stone: "#E5E7EB",
  taupe: C.light,
  muted: C.muted,
  red: C.bandLimited,
};

function AccessCodeContent() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useState(() => {
    if (typeof window !== "undefined") {
      const check = () => setMobile(window.innerWidth <= 768);
      check();
      window.addEventListener("resize", check);
    }
  });

  const handleSubmit = () => {
    setError(null);
    const trimmed = code.trim();
    if (!trimmed) { setError("Paste your Access Code from your report."); return; }
    try {
      const d = JSON.parse(atob(trimmed));
      if (typeof d.p !== "number" || typeof d.c !== "number" || typeof d.l !== "number") { setError("Invalid code. Check that you copied the full code."); return; }
      const nr = {
        record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0",
        assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(),
        final_score: d.o || 0, stability_band: d.b || "", assessment_title: d.n || "",
        classification: "", operating_structure: "", primary_income_model: d.m || "",
        industry_sector: d.i || "",
        _v2: {
          normalized_inputs: {
            income_persistence_pct: d.p, largest_source_pct: d.c, source_diversity_count: d.s,
            forward_secured_pct: d.f, income_variability_level: d.v || "moderate", labor_dependence_pct: d.l,
          },
          quality: { quality_score: d.q || 5 },
        },
      };
      sessionStorage.setItem("rp_record", JSON.stringify(nr));
      sessionStorage.setItem("rp_sim_code", trimmed);
      // Access code comes from paid report — grant full access
      const codeSession = { plan_key: "single_assessment", status: "paid", checkout_provider: "access_code" };
      sessionStorage.setItem("rp_purchase_session", JSON.stringify(codeSession));
      localStorage.setItem("rp_purchase_session", JSON.stringify(codeSession));
      localStorage.setItem("rp_record", JSON.stringify(nr));
      router.push("/dashboard");
    } catch { setError("Invalid code. Copy the full code from your report."); }
  };

  return (
    <>
      <title>Access Code | RunPayway™</title>
      <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: sans }}>
        <SuiteHeader current="access-code" />

        <div style={{ maxWidth: 520, margin: "0 auto", padding: mobile ? "48px 20px 100px" : "80px 36px 96px" }}>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: B.purple, marginBottom: 16 }}>ACCESS CODE</div>
            <h1 style={{ fontSize: mobile ? 22 : 28, fontWeight: 300, color: B.navy, margin: "0 0 12px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              Load your Dashboard.
            </h1>
            <p style={{ fontSize: 15, color: B.muted, margin: 0, lineHeight: 1.65 }}>
              Paste the access code from your RunPayway™ report to open your full diagnostic, simulator, and roadmap.
            </p>
          </div>

          <div style={{
            padding: mobile ? "24px 16px" : "36px 32px",
            borderRadius: 16,
            border: `1px solid ${B.stone}`,
            backgroundColor: B.surface,
            boxShadow: "0 2px 8px rgba(14,26,43,0.03)",
          }}>
            <label htmlFor="access-code-input" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: B.taupe, display: "block", marginBottom: 10 }}>
              PASTE CODE
            </label>
            <textarea
              id="access-code-input"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(null); }}
              placeholder="Paste the full code from your report..."
              rows={4}
              style={{
                width: "100%", padding: "14px 16px", fontSize: 14, fontFamily: mono,
                border: `2px solid ${B.purple}20`, borderRadius: 12, outline: "none",
                backgroundColor: B.white, resize: "vertical" as const,
                boxSizing: "border-box" as const, lineHeight: 1.6,
                transition: "border-color 200ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = `${B.purple}20`; }}
            />
            {error && <div style={{ fontSize: 14, color: B.red, marginTop: 8 }}>{error}</div>}
            <button
              onClick={handleSubmit}
              style={{
                width: "100%", marginTop: 16, padding: mobile ? "14px 16px" : "14px 24px",
                fontSize: 16, fontWeight: 600, color: B.white,
                background: `linear-gradient(135deg, ${B.navy} 0%, ${B.purple} 100%)`,
                border: "none", borderRadius: 12, cursor: "pointer",
                minHeight: 48, transition: "opacity 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Open Dashboard
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontSize: 14, color: B.taupe, margin: "0 0 4px", lineHeight: 1.6 }}>
              Your access code is on page 1 and page 4 of your RunPayway™ report.
            </p>
            <p style={{ fontSize: 13, color: `${B.taupe}80`, margin: 0 }}>
              Same code, same score. Deterministic by design.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default function AccessCodePage() {
  return <Suspense><AccessCodeContent /></Suspense>;
}
