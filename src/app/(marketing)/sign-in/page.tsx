"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSessionByEmail, isExpired, getRemaining, verifyPin, resetPinAndSend, type MonitoringSession } from "@/lib/monitoring";
import {
  C, T, mono, sans, secPad, px,
  h2Style, bodySm, cardStyle,
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

  /* ── Verify PIN ── */
  const handlePinSignIn = async () => {
    const trimmed = email.trim();
    if (!pin || pin.length !== 4) { setError("Please enter your 4-digit PIN."); return; }
    const found = getSessionByEmail(trimmed);
    if (!found) { setError("No active monitoring plan found for this email."); return; }
    const pinValid = await verifyPin(trimmed, pin);
    if (!pinValid) { setError("Incorrect PIN. Try again or use Forgot PIN below."); return; }
    if (isExpired(found)) { setError("This monitoring plan has expired. Purchase a new plan to continue."); return; }
    setError("");
    setSession(found);
  };

  /* ── Forgot PIN ── */
  const handleForgotPin = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) { setError("Enter your email address first."); return; }
    setSending(true);
    const sent = await resetPinAndSend(trimmed);
    setSending(false);
    if (sent) { setPinSent(true); setError(""); }
    else { setError("No active monitoring plan found for this email."); }
  };

  /* ── Monitoring dashboard actions ── */
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

  /* ── Shared input styles ── */
  const inputStyle: React.CSSProperties = {
    width: "100%", height: 52, padding: "0 18px", borderRadius: 12,
    border: `1px solid ${C.softBorder}`, background: C.panelFill, fontSize: 14,
    fontFamily: sans, color: C.navy, outline: "none",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
    boxSizing: "border-box",
  };

  const primaryBtn: React.CSSProperties = {
    width: "100%", height: 60, borderRadius: 16,
    background: C.navy, color: C.white,
    fontSize: 16, fontWeight: 600, fontFamily: sans, letterSpacing: "-0.01em",
    border: "none", cursor: "pointer",
    boxShadow: btnHovered ? "0 12px 32px rgba(14,26,43,0.25)" : "0 8px 24px rgba(14,26,43,0.15)",
    transition: "box-shadow 260ms ease, transform 260ms ease",
    transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
  };

  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      {/* ══ HERO ══ */}
      <section ref={heroAnim.ref} style={{ backgroundColor: C.sand, paddingTop: m ? 80 : 112, paddingBottom: m ? 40 : 64, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...fadeIn(heroAnim.visible) }}>
            <h1 style={{ fontSize: m ? 28 : 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 16 }}>
              Stability Monitoring Sign In
            </h1>
            <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 520, margin: "0 auto" }}>
              For RunPayway™ Annual Monitoring customers. Sign in with your email and PIN to access your monitoring dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ══ SIGN-IN / DASHBOARD ══ */}
      <section style={{ backgroundColor: C.panelFill, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
        <div ref={formAnim.ref} style={{ maxWidth: 520, margin: "0 auto", ...fadeIn(formAnim.visible) }}>
          <div style={{ ...cardStyle, borderRadius: 16, padding: m ? "32px 16px" : "48px 44px", boxShadow: "0 8px 32px rgba(14,26,43,0.05)" }}>

            {!session ? (
              /* ─── Email + PIN sign-in (monitoring customers only) ─── */
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16 }}>RunPayway™ Annual Monitoring</div>
                  <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
                    Sign in with Your Email &amp; PIN
                  </h2>
                  <p style={{ ...bodySm(m), color: C.muted, maxWidth: 360, margin: "0 auto" }}>
                    Enter the email and 4-digit PIN from your monitoring account.
                  </p>
                </div>

                {forgotMode ? (
                  /* ─── Forgot PIN ─── */
                  <>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ ...T.label, fontSize: 13, color: C.navy, display: "block", marginBottom: 10 }}>
                        Email Address
                      </label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.softBorder; e.currentTarget.style.boxShadow = "none"; }}
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
                        style={{ ...primaryBtn, opacity: sending ? 0.6 : 1, cursor: sending ? "wait" : "pointer" }}
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
                  /* ─── Normal sign-in ─── */
                  <>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ ...T.label, fontSize: 13, color: C.navy, display: "block", marginBottom: 4 }}>
                        Email Address
                      </label>
                      <p style={{ fontSize: 12, color: C.muted, margin: "0 0 10px" }}>The email you used at checkout</p>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={inputStyle}
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
                        style={{ ...inputStyle, fontSize: 24, fontFamily: mono, color: C.navy, letterSpacing: "0.3em", textAlign: "center" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.softBorder; e.currentTarget.style.boxShadow = "none"; }}
                        onKeyDown={(e) => { if (e.key === "Enter" && pin.length === 4) handlePinSignIn(); }}
                      />
                    </div>

                    {error && <p style={{ fontSize: 14, color: C.bandLimited, marginBottom: 16, lineHeight: 1.5 }}>{error}</p>}

                    <button
                      onClick={handlePinSignIn}
                      onMouseEnter={() => canHover() && setBtnHovered(true)}
                      onMouseLeave={() => setBtnHovered(false)}
                      style={primaryBtn}
                    >
                      Access Monitoring Dashboard
                    </button>

                    {/* Other customer types */}
                    <div style={{ height: 1, background: C.softBorder, margin: "28px 0 24px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ padding: "14px 16px", borderRadius: 12, backgroundColor: C.panelFill, border: `1px solid ${C.softBorder}` }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: "0 0 2px" }}>Have a $69 full report?</p>
                        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Check your purchase confirmation email — it contains your direct dashboard link.</p>
                      </div>
                      <div style={{ padding: "14px 16px", borderRadius: 12, backgroundColor: C.panelFill, border: `1px solid ${C.softBorder}` }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: "0 0 2px" }}>Advisor account?</p>
                        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 6px" }}>Use your advisor code to access your dashboard.</p>
                        <Link href="/advisor-portal/dashboard" style={{ fontSize: 12, fontWeight: 600, color: C.teal, textDecoration: "none" }}>
                          Go to Advisor Dashboard →
                        </Link>
                      </div>
                    </div>

                    <div style={{ height: 1, background: C.softBorder, margin: "20px 0 16px" }} />
                    <div style={{ textAlign: "center" }}>
                      <p style={{ ...T.micro, color: C.light, margin: 0 }}>
                        Consistent &#183; Email + PIN authentication &#183; Encrypted
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* ─── Monitoring Dashboard ─── */
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16 }}>Dashboard</div>
                  <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
                    Welcome back.
                  </h2>
                  <p style={{ ...bodySm(m), color: C.muted }}>
                    Your RunPayway™ Stability Monitoring plan is active.
                  </p>
                </div>

                {/* Status rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 28 }}>
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
                        background: C.panelFill, border: `1px solid ${C.softBorder}`,
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
                    <Link href="/plans" style={{
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
                    Consistent &#183; Versioned &#183; Same inputs, same score
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
