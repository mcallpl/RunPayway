"use client";

import { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function VerifyPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const formAnim = useInView();

  const [recordId, setRecordId] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [btnHovered, setBtnHovered] = useState(false);

  const isValid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      recordId.trim()
    ) && /^[a-f0-9]{64}$/.test(authCode.trim().toLowerCase());

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

  return (
    <div style={{ background: "#FFFFFF" }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div
          ref={heroAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 820,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Score Verification
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Verify a Score
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 8px",
            }}
          >
            Confirm that an Income Stability Score™ was generated using the official RunPayway™ model.
          </p>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            Enter the Record ID and Authorization Code from an issued assessment.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Verification form                                           */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 64 : 96,
          background: B.sand,
        }}
      >
        <div
          ref={formAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 620,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
            opacity: formAnim.visible ? 1 : 0,
            transform: formAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          {/* Form card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              border: "1px solid rgba(14,26,43,0.06)",
              padding: mobile ? "32px 24px" : "40px 40px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: mobile ? 18 : 22,
                fontWeight: 700,
                color: B.navy,
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              Record Verification
            </h2>
            <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, marginBottom: 28 }}>
              Verify a RunPayway-issued Income Stability Assessment record.
            </p>

            {/* Record ID */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: B.navy,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Record ID
              </label>
              <input
                type="text"
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
                placeholder="UUID v4 format"
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(14,26,43,0.12)",
                  background: B.sand,
                  fontSize: 14,
                  fontFamily: "monospace",
                  color: B.navy,
                  outline: "none",
                  transition: "border-color 180ms ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Authorization Code */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: B.navy,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Authorization Code
              </label>
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="64-character hexadecimal string"
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(14,26,43,0.12)",
                  background: B.sand,
                  fontSize: 14,
                  fontFamily: "monospace",
                  color: B.navy,
                  outline: "none",
                  transition: "border-color 180ms ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleVerify}
              disabled={!isValid || loading}
              onMouseEnter={() => canHover() && setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                background: !isValid || loading ? "rgba(14,26,43,0.12)" : btnHovered ? "#3D33A0" : B.purple,
                color: !isValid || loading ? B.light : "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                border: "none",
                cursor: !isValid || loading ? "not-allowed" : "pointer",
                boxShadow: isValid && !loading ? "0 6px 16px rgba(75,63,174,0.25)" : "none",
                transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                transform: btnHovered && isValid && !loading ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {loading ? "Verifying..." : "Verify Record"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 20,
                padding: "14px 20px",
                borderRadius: 12,
                background: "rgba(220,38,38,0.06)",
                border: "1px solid rgba(220,38,38,0.14)",
                fontSize: 14,
                color: "#DC2626",
              }}
            >
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div
              style={{
                marginTop: 24,
                background: "#FFFFFF",
                borderRadius: 20,
                border: result.valid_record
                  ? "1px solid rgba(31,109,122,0.20)"
                  : "1px solid rgba(14,26,43,0.08)",
                padding: mobile ? "28px 24px" : "36px 36px",
                boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
              }}
            >
              {result.valid_record ? (
                <>
                  {/* Verified badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "rgba(31,109,122,0.08)",
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.teal }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: B.teal, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Verified
                    </span>
                  </div>

                  {/* Verification statement */}
                  <p style={{ fontSize: 15, color: B.teal, fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>
                    {result.verification_statement}
                  </p>

                  {/* Record details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                      ["Record ID", result.record_id],
                      ["Model Version", result.model_version],
                      ["Income Stability Score", String(result.final_score)],
                      ["Stability Band", result.stability_band],
                      ["Assessment Date", result.assessment_date],
                      ["Issued", result.issued_timestamp],
                      ["Verified At", result.verified_at],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          flexDirection: mobile ? "column" : "row",
                          padding: "12px 0",
                          borderBottom: "1px solid rgba(14,26,43,0.06)",
                          gap: mobile ? 2 : 0,
                        }}
                      >
                        <span style={{ fontSize: 13, color: B.light, width: mobile ? "auto" : 180, flexShrink: 0 }}>
                          {label}
                        </span>
                        <span style={{ fontSize: 13, fontFamily: "monospace", color: B.navy, fontWeight: 500, wordBreak: "break-all" }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "rgba(14,26,43,0.04)",
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.light }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: B.muted, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      No Match Found
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7 }}>
                    No matching record found. The provided Record ID and Authorization Code do not correspond to a valid assessment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* How it works */}
          <div
            style={{
              marginTop: 32,
              padding: mobile ? "24px 20px" : "28px 28px",
              borderRadius: 16,
              background: "#FFFFFF",
              border: "1px solid rgba(14,26,43,0.06)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              How Verification Works
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Each completed assessment receives a unique Record ID and Authorization Code.",
                "Enter both credentials above to verify that a score was generated using the official RunPayway\u2122 model.",
                "Verification confirms the record exists and returns the score, classification band, and issuance details without exposing internal assessment data.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: "rgba(75,63,174,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: B.purple }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model reference */}
          <p style={{ fontSize: 12, color: B.light, textAlign: "center", marginTop: 28, letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
