"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSessionByEmail, isExpired, getRemaining, verifyPin, resetPinAndSend, type MonitoringSession } from "@/lib/monitoring";
import {
  C, T, mono, sans, sp, maxW, secPad, px,
  h1, h2Style, h3Style, body, bodySm, cardStyle, ctaButtonLight,
  canHover,
} from "@/lib/design-tokens";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */
function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

const fadeIn = (v: boolean, delay = 0) => ({
  opacity: v ? 1 : 0,
  transform: v ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */
export default function SignInPage() {
  const router = useRouter();
  const m = useMobile();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [nextBtnHovered, setNextBtnHovered] = useState(false);
  const [session, setSession] = useState<MonitoringSession | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [pinSent, setPinSent] = useState(false);
  const [sending, setSending] = useState(false);

  const heroAnim = useInView();
  const formAnim = useInView();
  const infoAnim = useInView();

  const handleLookup = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) { setError("Please enter a valid email address."); return; }
    if (!pin || pin.length !== 4) { setError("Please enter your 4-digit PIN."); return; }
    const found = getSessionByEmail(trimmed);
    if (!found) { setError("No active monitoring plan found for this email."); return; }
    const pinValid = await verifyPin(trimmed, pin);
    if (!pinValid) { setError("Incorrect PIN. Try again or use Forgot PIN below."); return; }
    if (isExpired(found)) { setError("This monitoring plan has expired. Purchase a new plan to continue."); return; }
    setError("");
    setSession(found);
  };

  const handleForgotPin = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) { setError("Enter your email address first."); return; }
    setSending(true);
    const sent = await resetPinAndSend(trimmed);
    setSending(false);
    if (sent) {
      setPinSent(true);
      setError("");
    } else {
      setError("No active monitoring plan found for this email.");
    }
  };

  const remaining = session ? getRemaining(session.access_code) : 0;
  const allUsed = session ? remaining <= 0 : false;
  const expiresDate = session ? new Date(session.expires_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  const handleTakeAssessment = () => {
    if (!session || allUsed) return;
    sessionStorage.setItem("rp_purchase_session", JSON.stringify({
      plan_key: "annual_monitoring", price_cents: 14900, currency: "USD",
      intended_assessment_count: 3, status: "paid", checkout_provider: "stripe",
      monitoring_access_code: session.access_code,
    }));
    router.push("/diagnostic-portal");
  };

  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      {/* ══ HERO ══ */}
      <section ref={heroAnim.ref} style={{ backgroundColor: C.navy, paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...fadeIn(heroAnim.visible) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
              <span style={{ ...T.label, color: C.teal }}>Monitoring Portal</span>
            </div>
            <h1 style={{ ...h1(m), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
              Your stability,{!m && <br />} tracked over time.
            </h1>
            <p style={{ ...body(m), color: C.sandMuted, maxWidth: 480, margin: "0 auto 28px" }}>
              Sign in to access your RunPayway&#8482; Stability Monitoring dashboard, take assessments, and review your history.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" as const }}>
              {["Email sign-in", "No password required", "3 assessments included"].map(t => (
                <span key={t} style={{ ...T.micro, fontWeight: 500, color: C.sandLight }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIGN-IN / DASHBOARD ══ */}
      <section style={{ backgroundColor: "#FAFAFA", paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
        <div ref={formAnim.ref} style={{ maxWidth: 520, margin: "0 auto", ...fadeIn(formAnim.visible) }}>
          <div style={{ ...cardStyle, borderRadius: 16, padding: m ? "32px 16px" : "48px 44px", boxShadow: "0 8px 32px rgba(14,26,43,0.05)" }}>

            {!session ? (
              /* ─── Email login ─── */
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16 }}>RunPayway&#8482; Stability Monitoring</div>
                  <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
                    Sign in to your portal
                  </h2>
                  <p style={{ ...bodySm(m), color: C.muted, maxWidth: 360, margin: "0 auto" }}>
                    Enter the email address you used at checkout.
                  </p>
                </div>

                {forgotMode ? (
                  /* ─── Forgot PIN flow ─── */
                  <>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ ...T.label, fontSize: 13, color: C.navy, display: "block", marginBottom: 10 }}>
                        Email Address
                      </label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{
                          width: "100%", height: 52, padding: "0 18px", borderRadius: 12,
                          border: `1px solid ${C.softBorder}`, background: "#FAFAFA", fontSize: 14, fontFamily: sans, color: C.navy,
                          outline: "none", boxSizing: "border-box" as const,
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleForgotPin(); }}
                      />
                    </div>

                    {error && <p style={{ fontSize: 14, color: C.bandLimited, marginBottom: 16, lineHeight: 1.5 }}>{error}</p>}

                    {pinSent ? (
                      <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: "rgba(31,109,122,0.06)", border: `1px solid rgba(31,109,122,0.15)`, textAlign: "center", marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 4 }}>PIN sent to your email.</div>
                        <p style={{ ...T.meta, color: C.muted, margin: 0 }}>Check your inbox, then return here to sign in.</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleForgotPin}
                        disabled={sending}
                        style={{
                          width: "100%", height: 52, borderRadius: 12,
                          background: C.navy, color: C.white,
                          fontSize: 16, fontWeight: 600, fontFamily: sans, border: "none", cursor: sending ? "wait" : "pointer",
                          opacity: sending ? 0.6 : 1,
                        }}
                      >
                        {sending ? "Sending..." : "Send My PIN"}
                      </button>
                    )}

                    <div style={{ textAlign: "center", marginTop: 16 }}>
                      <button onClick={() => { setForgotMode(false); setPinSent(false); setError(""); }} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 500, color: C.purple, cursor: "pointer", padding: 0, fontFamily: sans }}>
                        &larr; Back to sign in
                      </button>
                    </div>
                  </>
                ) : (
                  /* ─── Normal sign-in flow ─── */
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ ...T.label, fontSize: 13, color: C.navy, display: "block", marginBottom: 10 }}>
                        Email Address
                      </label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{
                          width: "100%", height: 52, padding: "0 18px", borderRadius: 12,
                          border: `1px solid ${C.softBorder}`, background: "#FAFAFA", fontSize: 14, fontFamily: sans, color: C.navy,
                          outline: "none", transition: "border-color 200ms ease, box-shadow 200ms ease", boxSizing: "border-box" as const,
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.softBorder; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <label style={{ ...T.label, fontSize: 13, color: C.navy }}>4-Digit PIN</label>
                        <button onClick={() => { setForgotMode(true); setError(""); }} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 500, color: C.purple, cursor: "pointer", padding: 0, fontFamily: sans }}>
                          Forgot PIN?
                        </button>
                      </div>
                      <input
                        type="text" inputMode="numeric" maxLength={4} value={pin}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setPin(v); }}
                        placeholder="&#8226;&#8226;&#8226;&#8226;"
                        style={{
                          width: "100%", height: 52, padding: "0 18px", borderRadius: 12,
                          border: `1px solid ${C.softBorder}`, background: "#FAFAFA",
                          fontSize: 24, fontFamily: mono, color: C.navy, letterSpacing: "0.3em", textAlign: "center" as const,
                          outline: "none", transition: "border-color 200ms ease, box-shadow 200ms ease", boxSizing: "border-box" as const,
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.softBorder; e.currentTarget.style.boxShadow = "none"; }}
                        onKeyDown={(e) => { if (e.key === "Enter" && pin.length === 4) handleLookup(); }}
                      />
                    </div>

                    {error && <p style={{ fontSize: 14, color: C.bandLimited, marginBottom: 16, lineHeight: 1.5 }}>{error}</p>}

                    <button
                      onClick={handleLookup}
                      onMouseEnter={() => canHover() && setBtnHovered(true)}
                      onMouseLeave={() => setBtnHovered(false)}
                      style={{
                        width: "100%", height: 52, borderRadius: 12,
                        background: C.navy, color: C.white,
                        fontSize: 16, fontWeight: 600, fontFamily: sans, letterSpacing: "-0.01em", border: "none", cursor: "pointer",
                        boxShadow: btnHovered ? "0 12px 32px rgba(14,26,43,0.25)" : "0 8px 24px rgba(14,26,43,0.15)",
                        transition: "box-shadow 260ms ease, transform 260ms ease",
                        transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
                      }}
                    >
                      Access Monitoring Portal
                    </button>

                    <div style={{ textAlign: "center", marginTop: 24 }}>
                      <span style={{ fontSize: 14, color: C.light }}>Don&apos;t have a plan? </span>
                      <Link href="/pricing" style={{ fontSize: 14, fontWeight: 600, color: C.purple, textDecoration: "none" }}>
                        View pricing &rarr;
                      </Link>
                    </div>

                    <div style={{ height: 1, background: C.softBorder, margin: "28px 0 20px" }} />
                    <div style={{ textAlign: "center" }}>
                      <p style={{ ...T.micro, color: C.light, margin: 0 }}>
                        Deterministic &#183; Email + PIN authentication &#183; Encrypted
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* ─── Dashboard ─── */
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16 }}>Command Center</div>
                  <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
                    Welcome back.
                  </h2>
                  <p style={{ ...bodySm(m), color: C.muted }}>
                    Your RunPayway&#8482; Stability Monitoring plan is active.
                  </p>
                </div>

                {/* Status rows */}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 0, marginBottom: 28 }}>
                  {[
                    { label: "Assessments Remaining", value: `${remaining} of 3`, highlight: true },
                    { label: "Plan Expires", value: expiresDate },
                    { label: "Account Email", value: session.email },
                  ].map((row, i) => (
                    <div key={row.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "16px 0",
                      borderBottom: i < 2 ? `1px solid ${C.softBorder}` : "none",
                    }}>
                      <span style={{ ...T.meta, color: C.muted }}>{row.label}</span>
                      <span style={{
                        fontSize: row.highlight ? 16 : 14,
                        fontWeight: row.highlight ? 700 : 600,
                        fontFamily: row.highlight ? mono : sans,
                        color: row.highlight ? (allUsed ? C.bandLimited : C.teal) : C.navy,
                      }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Past assessments */}
                {session.assessment_records.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ ...T.label, fontSize: 13, color: C.purple, marginBottom: 14 }}>
                      Assessment History
                    </div>
                    {session.assessment_records.map((recordId, i) => (
                      <div key={recordId} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "12px 16px", borderRadius: 12,
                        background: "#FAFAFA", border: `1px solid ${C.softBorder}`,
                        marginBottom: i < session.assessment_records.length - 1 ? 8 : 0,
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Assessment {i + 1}</span>
                        <span style={{ fontSize: 12, color: C.light, fontFamily: mono }}>{recordId.slice(0, 14)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {allUsed ? (
                  <>
                    <div style={{ padding: "20px 24px", borderRadius: 12, background: "rgba(155,44,44,0.04)", border: `1px solid rgba(155,44,44,0.10)`, textAlign: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 6 }}>All 3 Assessments Completed</div>
                      <p style={{ ...T.meta, color: C.muted, margin: 0, lineHeight: 1.55 }}>Purchase a new plan to continue tracking your income stability.</p>
                    </div>
                    <Link href="/pricing" style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "100%", height: 52, borderRadius: 12,
                      background: C.navy, color: C.white,
                      fontSize: 16, fontWeight: 600, fontFamily: sans, textDecoration: "none",
                      boxShadow: "0 8px 24px rgba(14,26,43,0.15)",
                    }}>
                      Renew Stability Monitoring
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleTakeAssessment}
                    onMouseEnter={() => canHover() && setNextBtnHovered(true)}
                    onMouseLeave={() => setNextBtnHovered(false)}
                    style={{
                      width: "100%", height: 52, borderRadius: 12,
                      background: C.navy, color: C.white,
                      fontSize: 16, fontWeight: 600, fontFamily: sans, border: "none", cursor: "pointer",
                      boxShadow: nextBtnHovered ? "0 12px 32px rgba(14,26,43,0.25)" : "0 8px 24px rgba(14,26,43,0.15)",
                      transition: "box-shadow 260ms ease, transform 260ms ease",
                      transform: nextBtnHovered ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    Take Next Assessment
                  </button>
                )}

                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button onClick={() => { setSession(null); setEmail(""); setPin(""); setError(""); }} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 500, color: C.light, cursor: "pointer", padding: 0, fontFamily: sans }}>
                    Sign in with a different email
                  </button>
                </div>

                <div style={{ height: 1, background: C.softBorder, margin: "28px 0 20px" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ ...T.micro, color: C.light, margin: 0 }}>
                    Deterministic &#183; Versioned &#183; Same inputs, same score
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ══ INFO CARDS ══ */}
      <section style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
        <div ref={infoAnim.ref} style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ marginBottom: sp(2), ...fadeIn(infoAnim.visible) }}>
            <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>01</span>
          </div>
          <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(infoAnim.visible) }}>
            <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Stability is not static.{!m && <br />} Neither is the score.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 16 : 20 }}>
            {[
              { num: "01", title: "Authenticate instantly", desc: "One email. Zero passwords. Your monitoring portal recognizes you the moment you arrive.", color: C.purple },
              { num: "02", title: "Reassess on your terms", desc: "Each assessment captures a new structural snapshot \u2014 a full 4-page diagnostic calibrated to your current reality.", color: C.teal },
              { num: "03", title: "Observe the trajectory", desc: "Income structures evolve. Three assessments over 12 months reveal what changed, what held, and what to act on next.", color: C.purple },
            ].map((card, i) => (
              <div key={card.num} style={{
                ...cardStyle, borderRadius: 14, padding: m ? "28px 24px" : "32px 28px",
                ...fadeIn(infoAnim.visible, 100 + i * 80),
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA", border: `1px solid ${C.softBorder}`, fontSize: 13, fontWeight: 700, fontFamily: mono, color: card.color, position: "relative", overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: card.color, opacity: 0.6 }} />
                  {card.num}
                </div>
                <div style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy, marginBottom: 8 }}>{card.title}</div>
                <p style={{ ...bodySm(m), color: C.muted, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...fadeIn(true) }}>
            <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Your income has a structure.{!m && <br />} Now you can measure it.
            </h2>
            <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
              The free score shows where you stand. The full diagnostic shows what to do about it.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
              <Link href="/begin" style={{
                ...ctaButtonLight, height: m ? 48 : 56, paddingLeft: 32, paddingRight: 32, borderRadius: 12,
                backgroundColor: C.white, color: C.navy,
              }}>
                Get My Free Score
              </Link>
              <Link href="/pricing" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: m ? 48 : 56, paddingLeft: 32, paddingRight: 32, borderRadius: 12,
                backgroundColor: "transparent", color: C.sandText,
                fontSize: 16, fontWeight: 600, textDecoration: "none",
                border: `1px solid ${C.sandBorder}`,
              }}>
                View Pricing
              </Link>
            </div>
            <div style={{ marginTop: 20, ...T.meta, color: C.sandLight }}>
              Under 2 minutes &#183; Instant result &#183; Private by default
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
