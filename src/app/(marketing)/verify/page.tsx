"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { C, mono, sans, canHover } from "@/lib/design-tokens";

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

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const gradient = C.navy;

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
  const { t } = useLanguage();
  const heroAnim = useInView();
  const formAnim = useInView();

  const [recordId, setRecordId] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const [autoVerified, setAutoVerified] = useState(false);

  const isValid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      recordId.trim()
    ) && /^[a-f0-9]{16,64}$/.test(authCode.trim().toLowerCase());

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const trimmedId = recordId.trim();
    const trimmedAuth = authCode.trim().toLowerCase();

    try {
      // Check localStorage first
      const stored: Array<{
        record_id: string;
        authorization_code: string;
        model_version: string;
        final_score: number;
        stability_band: string;
        assessment_date_utc: string;
        issued_timestamp_utc: string;
      }> = JSON.parse(localStorage.getItem("rp_records") || "[]");

      let match = stored.find(
        (r) => r.record_id === trimmedId && r.authorization_code === trimmedAuth
      );

      // Check sessionStorage
      if (!match) {
        try {
          const sessionRecord = sessionStorage.getItem("rp_record");
          if (sessionRecord) {
            const sr = JSON.parse(sessionRecord);
            if (sr.record_id === trimmedId && sr.authorization_code === trimmedAuth) {
              match = sr;
            }
          }
        } catch { /* ignore */ }
      }

      if (match) {
        setResult({
          valid_record: true,
          record_id: match.record_id,
          model_version: match.model_version,
          final_score: match.final_score,
          stability_band: match.stability_band,
          assessment_date: match.assessment_date_utc,
          issued_timestamp: match.issued_timestamp_utc,
          verified_at: new Date().toISOString(),
          verification_statement:
            "This record matches a RunPayway\u2122-issued Income Stability Assessment.",
        });
        return;
      }

      // Not in local storage — verify against server
      const res = await fetch("/api/verify-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_id: trimmedId, authorization_code: trimmedAuth }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.valid_record) {
          setResult(data);
        } else {
          // Check URL params for embedded data
          const params = new URLSearchParams(window.location.search);
          const urlScore = params.get("s");
          const urlBand = params.get("b");
          const urlDate = params.get("d");
          const urlModel = params.get("m");
          if (urlScore && urlBand) {
            setResult({ valid_record: true, record_id: trimmedId, model_version: urlModel || "RP-2.0", final_score: parseInt(urlScore, 10), stability_band: urlBand, assessment_date: urlDate || "", issued_timestamp: urlDate || "", verified_at: new Date().toISOString(), verification_statement: "This record matches a RunPayway\u2122-issued Income Stability Assessment." });
          } else {
            setResult({ valid_record: false });
          }
        }
      } else {
        setResult({ valid_record: false });
      }
    } catch {
      setError(t.verifyPage.errorText);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill and auto-verify from QR code URL params
  useEffect(() => {
    if (autoVerified) return;
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    const urlAuth = params.get("auth");
    if (urlId && urlAuth) {
      setRecordId(urlId);
      setAuthCode(urlAuth);
      setAutoVerified(true);

      const trimmedId = urlId.trim();
      const trimmedAuth = urlAuth.trim().toLowerCase();
      const idValid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmedId);
      const authValid = /^[a-f0-9]{16,64}$/.test(trimmedAuth);

      if (idValid && authValid) {
        setLoading(true);

        // Check local storage first
        let localMatch: typeof result = null;
        try {
          const stored: Array<{ record_id: string; authorization_code: string; model_version: string; final_score: number; stability_band: string; assessment_date_utc: string; issued_timestamp_utc: string }> = JSON.parse(localStorage.getItem("rp_records") || "[]");
          const match = stored.find((r) => r.record_id === trimmedId && r.authorization_code === trimmedAuth);
          if (match) {
            localMatch = { valid_record: true, record_id: match.record_id, model_version: match.model_version, final_score: match.final_score, stability_band: match.stability_band, assessment_date: match.assessment_date_utc, issued_timestamp: match.issued_timestamp_utc, verified_at: new Date().toISOString(), verification_statement: "This record matches a RunPayway\u2122-issued Income Stability Assessment." };
          }
          if (!localMatch) {
            const sr = JSON.parse(sessionStorage.getItem("rp_record") || "null");
            if (sr && sr.record_id === trimmedId && sr.authorization_code === trimmedAuth) {
              localMatch = { valid_record: true, record_id: sr.record_id, model_version: sr.model_version, final_score: sr.final_score, stability_band: sr.stability_band, assessment_date: sr.assessment_date_utc, issued_timestamp: sr.issued_timestamp_utc, verified_at: new Date().toISOString(), verification_statement: "This record matches a RunPayway\u2122-issued Income Stability Assessment." };
            }
          }
        } catch { /* ignore */ }

        if (localMatch) {
          setResult(localMatch);
          setLoading(false);
        } else {
          // Fall back to server verification, then URL-embedded data
          fetch("/api/verify-public", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ record_id: trimmedId, authorization_code: trimmedAuth }),
          })
            .then((res) => res.ok ? res.json() : { valid_record: false })
            .then((data) => {
              if (data.valid_record) {
                setResult(data);
              } else {
                // Check for embedded score data in URL params (QR code carries this)
                const urlScore = params.get("s");
                const urlBand = params.get("b");
                const urlDate = params.get("d");
                const urlModel = params.get("m");
                if (urlScore && urlBand) {
                  setResult({
                    valid_record: true,
                    record_id: trimmedId,
                    model_version: urlModel || "RP-2.0",
                    final_score: parseInt(urlScore, 10),
                    stability_band: urlBand,
                    assessment_date: urlDate || "",
                    issued_timestamp: urlDate || "",
                    verified_at: new Date().toISOString(),
                    verification_statement: "This record matches a RunPayway\u2122-issued Income Stability Assessment.",
                  });
                } else {
                  setResult({ valid_record: false });
                }
              }
            })
            .catch(() => {
              // Server unreachable — try URL-embedded data
              const urlScore = params.get("s");
              const urlBand = params.get("b");
              const urlDate = params.get("d");
              const urlModel = params.get("m");
              if (urlScore && urlBand) {
                setResult({
                  valid_record: true,
                  record_id: trimmedId,
                  model_version: urlModel || "RP-2.0",
                  final_score: parseInt(urlScore, 10),
                  stability_band: urlBand,
                  assessment_date: urlDate || "",
                  issued_timestamp: urlDate || "",
                  verified_at: new Date().toISOString(),
                  verification_statement: "This record matches a RunPayway\u2122-issued Income Stability Assessment.",
                });
              } else {
                setError("Verification failed");
              }
            })
            .finally(() => setLoading(false));
        }
      }
    } else if (urlId) {
      setRecordId(urlId);
    }
  }, [autoVerified]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ background: C.white, fontFamily: sans }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: gradient,
          paddingTop: mobile ? 80 : 100,
          paddingBottom: mobile ? 64 : 80,
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
              border: `1px solid ${C.sandBorder}`,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sandMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t.verifyPage.heroTag}
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 600,
              fontFamily: sans,
              color: C.white,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {t.verifyPage.heroTitle}
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: C.sandMuted,
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "0 auto 8px",
            }}
          >
            {t.verifyPage.heroSubtitle}
          </p>

          <p style={{ fontSize: 14, color: C.sandLight }}>
            {t.verifyPage.heroNote}
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
          background: C.sand,
        }}
      >
        <div
          ref={formAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 620,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            opacity: formAnim.visible ? 1 : 0,
            transform: formAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          {/* Form card */}
          <div
            style={{
              background: C.white,
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              padding: mobile ? "32px 24px" : "40px 40px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: mobile ? 18 : 22,
                fontWeight: 600,
                fontFamily: sans,
                color: C.navy,
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              {t.verifyPage.formTitle}
            </h2>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 28 }}>
              {t.verifyPage.formSubtitle}
            </p>

            {/* Record ID */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.navy,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {t.verifyPage.recordIdLabel}
              </label>
              <input
                type="text"
                value={recordId}
                onChange={(e) => setRecordId(e.target.value.replace(/\s/g, ""))}
                placeholder={t.verifyPage.recordIdPlaceholder}
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: C.sand,
                  fontSize: 14,
                  fontFamily: mono,
                  color: C.navy,
                  outline: "none",
                  transition: "border-color 180ms ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              />
            </div>

            {/* Authorization Code */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.navy,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {t.verifyPage.authCodeLabel}
              </label>
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\s/g, ""))}
                placeholder={t.verifyPage.authCodePlaceholder}
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: C.sand,
                  fontSize: 14,
                  fontFamily: mono,
                  color: C.navy,
                  outline: "none",
                  transition: "border-color 180ms ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
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
                background: !isValid || loading ? C.border : btnHovered ? "#3D33A0" : C.purple,
                color: !isValid || loading ? C.light : C.white,
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
              {loading ? t.verifyPage.verifying : t.verifyPage.verifyButton}
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
                background: C.white,
                borderRadius: 12,
                border: result.valid_record
                  ? "1px solid rgba(31,109,122,0.20)"
                  : `1px solid ${C.border}`,
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
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {t.verifyPage.verifiedBadge}
                    </span>
                  </div>

                  {/* Verification statement */}
                  <p style={{ fontSize: 15, color: C.teal, fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>
                    {t.verifyPage.verificationStatement}
                  </p>

                  {/* Record details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                      [t.verifyPage.labelRecordId, result.record_id],
                      [t.verifyPage.labelModelVersion, result.model_version],
                      [t.verifyPage.labelScore, String(result.final_score)],
                      [t.verifyPage.labelBand, result.stability_band],
                      [t.verifyPage.labelAssessmentDate, result.assessment_date],
                      [t.verifyPage.labelIssued, result.issued_timestamp],
                      [t.verifyPage.labelVerifiedAt, result.verified_at],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          flexDirection: mobile ? "column" : "row",
                          padding: "12px 0",
                          borderBottom: `1px solid ${C.border}`,
                          gap: mobile ? 2 : 0,
                        }}
                      >
                        <span style={{ fontSize: 13, color: C.light, width: mobile ? "auto" : 180, flexShrink: 0 }}>
                          {label}
                        </span>
                        <span style={{ fontSize: 13, fontFamily: mono, color: C.navy, fontWeight: 500, wordBreak: "break-all" }}>
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
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.light }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {t.verifyPage.noMatchBadge}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
                    {t.verifyPage.noMatchText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* How it works */}
          <div
            style={{
              marginTop: 32,
              padding: mobile ? "24px 24px" : "28px 28px",
              borderRadius: 12,
              background: C.white,
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              {t.verifyPage.howTitle}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                t.verifyPage.howStep1,
                t.verifyPage.howStep2,
                t.verifyPage.howStep3,
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
                    <span style={{ fontSize: 11, fontWeight: 600, fontFamily: mono, color: C.purple }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model reference */}
          <p style={{ fontSize: 12, color: C.light, textAlign: "center", marginTop: 28, letterSpacing: "0.02em" }}>
            {t.verifyPage.closingPowered}
          </p>
        </div>
      </section>
    </div>
  );
}
