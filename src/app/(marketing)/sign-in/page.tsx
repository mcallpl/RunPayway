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
  const [success, setSuccess] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [nextBtnHovered, setNextBtnHovered] = useState(false);
  const [session, setSession] = useState<MonitoringSession | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [pinSent, setPinSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [validating, setValidating] = useState(false);

  const heroAnim = useInView();
  const formAnim = useInView();

  // Lockout timer effect
  useEffect(() => {
    if (!isLocked || lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime(t => {
        if (t <= 1) {
          setIsLocked(false);
          setAttempts(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked, lockoutTime]);

  /* ── Verify PIN ── */
  const handlePinSignIn = async () => {
    if (isLocked) {
      setError(`Too many attempts. Please try again in ${lockoutTime} seconds.`);
      return;
    }
    const trimmed = email.trim();
    if (!pin || pin.length !== 4) { setError("PIN must be exactly 4 digits."); return; }
    if (!trimmed || !trimmed.includes("@")) { setError("Please enter a valid email address."); return; }

    setValidating(true);
    setError("");
    setSuccess("");

    try {
      const found = getSessionByEmail(trimmed);
      if (!found) {
        setValidating(false);
        setError("No active monitoring plan found for this email.");
        return;
      }
      const pinValid = await verifyPin(trimmed, pin);
      if (!pinValid) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setValidating(false);
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTime(300); // 5 minutes
          setError("Too many failed attempts. Account temporarily locked for 5 minutes.");
        } else {
          setError(`Incorrect PIN. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} remaining.`);
        }
        return;
      }
      if (isExpired(found)) {
        setValidating(false);
        setError("This monitoring plan has expired. Purchase a new plan to continue.");
        return;
      }
      setAttempts(0);
      setSuccess("PIN verified. Loading your dashboard...");
      setTimeout(() => {
        setSession(found);
      }, 400);
    } catch (e) {
      setValidating(false);
      setError("Authentication failed. Please try again.");
    }
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
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .security-badge {
          animation: slideDown 400ms ease-out;
        }
      `}</style>
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
                    <div style={{ marginBottom: 28 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(75,63,174,0.04)", border: "1px solid rgba(75,63,174,0.10)", marginBottom: 18 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                          <circle cx="8" cy="8" r="7" stroke={C.purple} strokeWidth="1.5"/>
                          <path d="M8 5V8M8 11V11.5" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <p style={{ fontSize: 12, color: "rgba(75,63,174,0.70)", margin: 0, lineHeight: 1.5 }}>
                          We'll send a new PIN to the email address associated with your account.
                        </p>
                      </div>

                      <label style={{ ...T.label, fontSize: 13, color: C.navy, display: "block", marginBottom: 10 }}>
                        Email Address
                      </label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={pinSent}
                        style={{ ...inputStyle, opacity: pinSent ? 0.6 : 1 }}
                        onFocus={(e) => { if (!pinSent) { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.softBorder; e.currentTarget.style.boxShadow = "none"; }}
                        onKeyDown={(e) => { if (e.key === "Enter" && !pinSent) handleForgotPin(); }}
                        aria-label="Email address for PIN reset"
                      />
                    </div>

                    {error && (
                      <div style={{
                        padding: "12px 14px", borderRadius: 10,
                        background: "rgba(155,44,44,0.05)", border: "1px solid rgba(155,44,44,0.12)",
                        marginBottom: 16,
                      }}>
                        <p style={{ fontSize: 13, color: "#9B2C2C", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{error}</p>
                      </div>
                    )}

                    {pinSent ? (
                      <div style={{ padding: "16px 18px", borderRadius: 12, backgroundColor: "rgba(31,109,122,0.05)", border: `1px solid rgba(31,109,122,0.15)`, marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" fill="rgba(31,109,122,0.10)" stroke={C.teal} strokeWidth="1.5"/>
                            <path d="M6 8.5L7 9.5L10 6.5" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>PIN sent successfully</div>
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(31,109,122,0.70)", margin: 0, lineHeight: 1.5 }}>Check your inbox (or spam folder) for a new PIN. You can now return to sign in.</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleForgotPin}
                        disabled={sending}
                        style={{ ...primaryBtn, opacity: sending ? 0.6 : 1, cursor: sending ? "wait" : "pointer" }}
                      >
                        {sending ? (
                          <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                            <span style={{ display: "inline-block", width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.6)", animation: "pulse 1.4s ease-in-out infinite" }} />
                            Sending PIN...
                          </span>
                        ) : (
                          "Send My PIN"
                        )}
                      </button>
                    )}

                    <div style={{ textAlign: "center", marginTop: 18 }}>
                      <button onClick={() => { setForgotMode(false); setPinSent(false); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 500, color: C.purple, cursor: "pointer", padding: 0, fontFamily: sans, transition: "color 200ms ease" }} onMouseEnter={(e) => { e.currentTarget.style.color = C.navy; }} onMouseLeave={(e) => { e.currentTarget.style.color = C.purple; }}>
                        ← Back to sign in
                      </button>
                    </div>
                  </>
                ) : (
                  /* ─── Normal sign-in ─── */
                  <>
                    {isLocked && (
                      <div style={{
                        padding: "16px 18px", borderRadius: 12,
                        background: "rgba(155,44,44,0.04)", border: "1px solid rgba(155,44,44,0.15)",
                        marginBottom: 24,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="#9B2C2C" strokeWidth="1.5" />
                            <path d="M8 4V8M8 12V12.5" stroke="#9B2C2C" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#9B2C2C" }}>Account Temporarily Locked</span>
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(155,44,44,0.70)", margin: "0 0 8px", lineHeight: 1.5 }}>
                          Too many failed attempts. Try again in {lockoutTime} second{lockoutTime !== 1 ? 's' : ''}.
                        </p>
                      </div>
                    )}

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ ...T.label, fontSize: 13, color: C.navy, display: "block", marginBottom: 4 }}>
                        Email Address
                      </label>
                      <p style={{ fontSize: 12, color: C.muted, margin: "0 0 10px" }}>The email you used at checkout</p>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={isLocked}
                        aria-label="Email address"
                        style={{ ...inputStyle, opacity: isLocked ? 0.6 : 1, cursor: isLocked ? "not-allowed" : "text" }}
                        onFocus={(e) => { if (!isLocked) { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.softBorder; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <label style={{ ...T.label, fontSize: 13, color: C.navy }}>4-Digit PIN</label>
                        <button
                          onClick={() => { setForgotMode(true); setError(""); setSuccess(""); }}
                          disabled={isLocked}
                          style={{ background: "none", border: "none", fontSize: 12, fontWeight: 500, color: isLocked ? C.muted : C.purple, cursor: isLocked ? "not-allowed" : "pointer", padding: 0, fontFamily: sans, opacity: isLocked ? 0.5 : 1 }}
                        >
                          Forgot PIN?
                        </button>
                      </div>
                      <input
                        type="text" inputMode="numeric" maxLength={4} value={pin}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setPin(v); }}
                        placeholder="••••"
                        disabled={isLocked || validating}
                        aria-label="4-digit PIN"
                        style={{ ...inputStyle, fontSize: 24, fontFamily: mono, color: C.navy, letterSpacing: "0.3em", textAlign: "center", opacity: isLocked || validating ? 0.6 : 1, cursor: isLocked || validating ? "not-allowed" : "text" }}
                        onFocus={(e) => { if (!isLocked && !validating) { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}}
                        onBlur={(e) => { e.currentTarget.style.borderColor = C.softBorder; e.currentTarget.style.boxShadow = "none"; }}
                        onKeyDown={(e) => { if (e.key === "Enter" && pin.length === 4 && !isLocked && !validating) handlePinSignIn(); }}
                      />
                      {pin.length > 0 && pin.length < 4 && (
                        <p style={{ fontSize: 11, color: C.muted, margin: "6px 0 0", fontWeight: 500 }}>
                          {4 - pin.length} digit{4 - pin.length !== 1 ? 's' : ''} remaining
                        </p>
                      )}
                    </div>

                    {error && (
                      <div style={{
                        padding: "12px 14px", borderRadius: 10,
                        background: "rgba(155,44,44,0.05)", border: "1px solid rgba(155,44,44,0.12)",
                        marginBottom: 16,
                      }}>
                        <p style={{ fontSize: 13, color: "#9B2C2C", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{error}</p>
                      </div>
                    )}

                    {success && (
                      <div style={{
                        padding: "12px 14px", borderRadius: 10,
                        background: "rgba(31,109,122,0.05)", border: "1px solid rgba(31,109,122,0.12)",
                        marginBottom: 16,
                      }}>
                        <p style={{ fontSize: 13, color: C.teal, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{success}</p>
                      </div>
                    )}

                    <button
                      onClick={handlePinSignIn}
                      onMouseEnter={() => !isLocked && !validating && canHover() && setBtnHovered(true)}
                      onMouseLeave={() => setBtnHovered(false)}
                      disabled={isLocked || validating}
                      style={{
                        ...primaryBtn,
                        opacity: isLocked || validating ? 0.6 : 1,
                        cursor: isLocked || validating ? "not-allowed" : "pointer",
                      }}
                    >
                      {validating ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                          <span style={{ display: "inline-block", width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.6)", animation: "pulse 1.4s ease-in-out infinite" }} />
                          Verifying...
                        </span>
                      ) : (
                        "Access Monitoring Dashboard"
                      )}
                    </button>

                    <div style={{ height: 1, background: C.softBorder, margin: "28px 0 18px" }} />
                    <div className="security-badge" style={{ textAlign: "center", padding: "12px 16px", borderRadius: 12, background: "rgba(31,109,122,0.04)", border: "1px solid rgba(31,109,122,0.10)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1L3 4V8C3 12.5 8 15 8 15S13 12.5 13 8V4L8 1Z" stroke={C.teal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 8L7.5 9.5L10.5 6.5" stroke={C.teal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Enterprise Security</span>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(31,109,122,0.70)", margin: 0, lineHeight: 1.4 }}>
                        End-to-end encrypted &#183; Rate limited &#183; Audit logged
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* ─── Monitoring Dashboard ─── */
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(31,109,122,0.10)", marginBottom: 16 }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill={C.teal}/>
                      <path d="M6 8.5L7 9.5L10 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.teal, letterSpacing: "0.05em" }}>ACTIVE PLAN</span>
                  </div>
                  <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
                    Welcome back.
                  </h2>
                  <p style={{ ...bodySm(m), color: C.muted }}>
                    Your RunPayway™ Annual Monitoring plan is active and ready to use.
                  </p>
                </div>

                {/* Status rows */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
                  {[
                    { label: "Assessments Remaining", value: `${remaining}/${3}`, highlight: true, icon: "📊" },
                    { label: "Plan Expires", value: expiresDate, icon: "📅" },
                    { label: "Status", value: allUsed ? "Completed" : "Active", icon: allUsed ? "✓" : "●" },
                  ].map((row) => (
                    <div key={row.label} style={{
                      padding: "16px 14px", borderRadius: 12,
                      background: C.panelFill, border: `1px solid ${C.softBorder}`,
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.05em", margin: "0 0 6px", textTransform: "uppercase" }}>
                        {row.label}
                      </p>
                      <div style={{
                        fontSize: row.highlight ? 20 : 16,
                        fontWeight: 700,
                        fontFamily: row.highlight ? mono : sans,
                        color: allUsed && row.highlight ? C.bandLimited : (row.highlight ? C.teal : C.navy),
                        wordBreak: "break-word",
                      }}>{row.value}</div>
                    </div>
                  ))}
                </div>

                {/* Past assessments */}
                {session.assessment_records.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ ...T.label, fontSize: 13, color: C.purple, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H14V14H2V4Z" stroke={C.purple} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 4V3C2 1.9 2.9 1 4 1H12C13.1 1 14 1.9 14 3V4" stroke={C.purple} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Assessment History
                    </div>
                    {session.assessment_records.map((recordId, i) => (
                      <div key={recordId} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "12px 14px", borderRadius: 10,
                        background: C.panelFill, border: `1px solid ${C.softBorder}`,
                        marginBottom: i < session.assessment_records.length - 1 ? 8 : 0,
                      }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Assessment {i + 1}</span>
                          <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0", fontFamily: mono }}>{recordId.slice(0, 16)}</p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" fill="rgba(31,109,122,0.10)" stroke={C.teal} strokeWidth="1.2"/>
                          <path d="M6 8.5L7 9.5L10 6.5" stroke={C.teal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {allUsed ? (
                  <>
                    <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(155,44,44,0.04)", border: `1px solid rgba(155,44,44,0.10)`, marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#9B2C2C" strokeWidth="1.5"/>
                          <path d="M8 5.5V8M8 10.5V11" stroke="#9B2C2C" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>All Assessments Completed</div>
                      </div>
                      <p style={{ fontSize: 12, color: "rgba(155,44,44,0.70)", margin: 0, lineHeight: 1.5 }}>You've used all 3 assessments included in your plan. Renew to continue monitoring.</p>
                    </div>
                    <Link href="/plans" style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "100%", height: 54, borderRadius: 12,
                      background: C.navy, color: C.white,
                      fontSize: 15, fontWeight: 600, fontFamily: sans, textDecoration: "none",
                      boxShadow: "0 8px 24px rgba(14,26,43,0.15)",
                      transition: "all 260ms ease",
                    }}
                    onMouseEnter={(e) => { if (canHover()) { e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      Renew Annual Monitoring
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleTakeAssessment}
                    onMouseEnter={() => canHover() && setNextBtnHovered(true)}
                    onMouseLeave={() => setNextBtnHovered(false)}
                    style={{
                      width: "100%", height: 54, borderRadius: 12,
                      background: C.navy, color: C.white,
                      fontSize: 15, fontWeight: 600, fontFamily: sans, border: "none", cursor: "pointer",
                      boxShadow: nextBtnHovered ? "0 12px 32px rgba(14,26,43,0.25)" : "0 8px 24px rgba(14,26,43,0.15)",
                      transition: "box-shadow 260ms ease, transform 260ms ease",
                      transform: nextBtnHovered ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    Take Next Assessment
                  </button>
                )}

                <div style={{ textAlign: "center", marginTop: 18 }}>
                  <button onClick={() => { setSession(null); setEmail(""); setPin(""); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 500, color: C.light, cursor: "pointer", padding: 0, fontFamily: sans, transition: "color 200ms ease" }} onMouseEnter={(e) => { e.currentTarget.style.color = C.muted; }} onMouseLeave={(e) => { e.currentTarget.style.color = C.light; }}>
                    Sign in with a different email
                  </button>
                </div>

                <div style={{ height: 1, background: C.softBorder, margin: "28px 0 18px" }} />
                <div className="security-badge" style={{ textAlign: "center", padding: "12px 16px", borderRadius: 12, background: "rgba(31,109,122,0.04)", border: "1px solid rgba(31,109,122,0.10)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L3 4V8C3 12.5 8 15 8 15S13 12.5 13 8V4L8 1Z" stroke={C.teal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 8L7.5 9.5L10.5 6.5" stroke={C.teal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Secure Session</span>
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(31,109,122,0.70)", margin: 0, lineHeight: 1.4 }}>
                    Encrypted &#183; Session-based &#183; Auto-logout after 30 min
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
