"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSessionByEmail, isExpired, getRemaining, type MonitoringSession } from "@/lib/monitoring";

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

const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/* ------------------------------------------------------------------ */
/*  Tokens — matched to pricing / methodology pages                    */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  sand: "#F5F2EC",
  bone: "#FAF9F6",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  borderMd: "rgba(14,26,43,0.12)",
  gradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1A7A6D 100%)",
};

const SY = { desktop: 120, mobile: 72 };
const PAD = { desktop: 56, mobile: 24 };
const MAX = 1100;
const DF = "'DM Serif Display', Georgia, serif";

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */
export default function SignInPage() {
  const router = useRouter();
  const m = useMobile();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [nextBtnHovered, setNextBtnHovered] = useState(false);
  const [session, setSession] = useState<MonitoringSession | null>(null);

  const heroAnim = useInView();
  const formAnim = useInView();
  const infoAnim = useInView();

  const handleLookup = () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) { setError("Please enter a valid email address."); return; }
    const found = getSessionByEmail(trimmed);
    if (!found) { setError("No active monitoring plan found for this email."); return; }
    if (isExpired(found)) { setError("This monitoring plan has expired. Purchase a new plan to continue."); return; }
    setError("");
    setSession(found);
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
    <div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>

      {/* ══ HERO ══ */}
      <section ref={heroAnim.ref} style={{ background: B.gradient, position: "relative", overflow: "hidden", paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120 }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", width: 900, height: 900, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${m ? PAD.mobile : PAD.desktop}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 800ms ease-out, transform 800ms ease-out" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 28 }}>Monitoring Portal</div>
            <h1 style={{ fontSize: m ? 36 : 56, fontFamily: DF, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 680, margin: "0 auto 24px" }}>
              Your stability,<br />tracked over time.
            </h1>
            <p style={{ fontSize: m ? 16 : 20, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 28px" }}>
              Sign in to access your RunPayway&#8482; Stability Monitoring dashboard, take assessments, and review your history.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" as const }}>
              {["Email sign-in", "No password required", "3 assessments included"].map(t => (
                <span key={t} style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.30)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIGN-IN / DASHBOARD ══ */}
      <section style={{ backgroundColor: B.bone, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
        <div ref={formAnim.ref} style={{ maxWidth: 520, margin: "0 auto", opacity: formAnim.visible ? 1 : 0, transform: formAnim.visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 700ms ease-out, transform 700ms ease-out" }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: `1px solid ${B.border}`, padding: m ? "36px 24px" : "48px 44px", boxShadow: "0 8px 32px rgba(14,26,43,0.05)" }}>

            {!session ? (
              /* ─── Email login ─── */
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>RunPayway&#8482; Stability Monitoring</div>
                  <h2 style={{ fontSize: m ? 28 : 36, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
                    Sign in to your portal
                  </h2>
                  <p style={{ fontSize: m ? 15 : 16, color: B.muted, lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
                    Enter the email address you used at checkout.
                  </p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: B.navy, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                    Email Address
                  </label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%", height: 52, padding: "0 18px", borderRadius: 10,
                      border: `1px solid ${B.borderMd}`, background: B.bone, fontSize: 15, color: B.navy,
                      outline: "none", transition: "border-color 200ms ease, box-shadow 200ms ease", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = B.borderMd; e.currentTarget.style.boxShadow = "none"; }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }}
                  />
                </div>

                {error && <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 16, lineHeight: 1.5 }}>{error}</p>}

                <button
                  className="cta-tick"
                  onClick={handleLookup}
                  onMouseEnter={() => canHover() && setBtnHovered(true)}
                  onMouseLeave={() => setBtnHovered(false)}
                  style={{
                    width: "100%", height: 52, borderRadius: 10,
                    background: B.gradient, color: "#FFFFFF",
                    fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", border: "none", cursor: "pointer",
                    boxShadow: btnHovered ? "0 12px 32px rgba(75,63,174,0.30)" : "0 8px 24px rgba(75,63,174,0.20)",
                    transition: "box-shadow 260ms ease, transform 260ms ease",
                    transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  <span className="tick tick-white" />
                  Access Monitoring Portal
                </button>

                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <span style={{ fontSize: 14, color: B.light }}>Don&apos;t have a plan? </span>
                  <Link href="/pricing" style={{ fontSize: 14, fontWeight: 600, color: B.purple, textDecoration: "none" }}>
                    View pricing &rarr;
                  </Link>
                </div>

                <div style={{ height: 1, background: B.border, margin: "28px 0 20px" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: B.light, margin: 0 }}>
                    Deterministic &#183; Email-based authentication &#183; No password required
                  </p>
                </div>
              </>
            ) : (
              /* ─── Dashboard ─── */
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Monitoring Dashboard</div>
                  <h2 style={{ fontSize: m ? 28 : 36, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
                    Welcome back.
                  </h2>
                  <p style={{ fontSize: m ? 15 : 16, color: B.muted, lineHeight: 1.6 }}>
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
                      borderBottom: i < 2 ? `1px solid ${B.border}` : "none",
                    }}>
                      <span style={{ fontSize: 14, color: B.muted }}>{row.label}</span>
                      <span style={{
                        fontSize: row.highlight ? 16 : 14,
                        fontWeight: row.highlight ? 700 : 600,
                        color: row.highlight ? (allUsed ? "#DC2626" : B.teal) : B.navy,
                      }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Past assessments */}
                {session.assessment_records.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.purple, marginBottom: 14 }}>
                      Assessment History
                    </div>
                    {session.assessment_records.map((recordId, i) => (
                      <div key={recordId} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "12px 16px", borderRadius: 10,
                        background: B.bone, border: `1px solid ${B.border}`,
                        marginBottom: i < session.assessment_records.length - 1 ? 8 : 0,
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>Assessment {i + 1}</span>
                        <span style={{ fontSize: 12, color: B.light, fontFamily: "monospace" }}>{recordId.slice(0, 14)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {allUsed ? (
                  <>
                    <div style={{ padding: "20px 24px", borderRadius: 12, background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.10)", textAlign: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: B.navy, marginBottom: 6 }}>All 3 Assessments Completed</div>
                      <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.55, margin: 0 }}>Purchase a new plan to continue tracking your income stability.</p>
                    </div>
                    <Link className="cta-tick" href="/pricing" style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "100%", height: 52, borderRadius: 10,
                      background: B.gradient, color: "#FFFFFF",
                      fontSize: 16, fontWeight: 600, textDecoration: "none",
                      boxShadow: "0 8px 24px rgba(75,63,174,0.20)",
                    }}>
                      <span className="tick tick-white" />
                      Renew Stability Monitoring
                    </Link>
                  </>
                ) : (
                  <button
                    className="cta-tick"
                    onClick={handleTakeAssessment}
                    onMouseEnter={() => canHover() && setNextBtnHovered(true)}
                    onMouseLeave={() => setNextBtnHovered(false)}
                    style={{
                      width: "100%", height: 52, borderRadius: 10,
                      background: B.gradient, color: "#FFFFFF",
                      fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer",
                      boxShadow: nextBtnHovered ? "0 12px 32px rgba(75,63,174,0.30)" : "0 8px 24px rgba(75,63,174,0.20)",
                      transition: "box-shadow 260ms ease, transform 260ms ease",
                      transform: nextBtnHovered ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    <span className="tick tick-white" />
                    Take Next Assessment
                  </button>
                )}

                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button onClick={() => { setSession(null); setEmail(""); setError(""); }} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 500, color: B.light, cursor: "pointer", padding: 0 }}>
                    Sign in with a different email
                  </button>
                </div>

                <div style={{ height: 1, background: B.border, margin: "28px 0 20px" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: B.light, margin: 0 }}>
                    Deterministic &#183; Model RP-2.0 &#183; Same inputs, same score
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ══ INFO CARDS ══ */}
      <section style={{ backgroundColor: B.sand, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
        <div ref={infoAnim.ref} style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 36 : 48, opacity: infoAnim.visible ? 1 : 0, transform: infoAnim.visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Continuous Monitoring</div>
            <h2 style={{ fontSize: m ? 32 : 48, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em" }}>
              Stability is not static.<br />Neither is the score.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 16 : 20 }}>
            {[
              { num: "01", title: "Authenticate instantly", desc: "One email. Zero passwords. Your monitoring portal recognizes you the moment you arrive.", color: B.purple },
              { num: "02", title: "Reassess on your terms", desc: "Each assessment captures a new structural snapshot \u2014 a full 4-page diagnostic calibrated to your current reality.", color: B.teal },
              { num: "03", title: "Observe the trajectory", desc: "Income structures evolve. Three assessments over 12 months reveal what changed, what held, and what to act on next.", color: B.purple },
            ].map((card, i) => (
              <div key={card.num} style={{
                background: "#FFFFFF", borderRadius: 16, border: `1px solid ${B.border}`,
                padding: m ? "28px 24px" : "32px 28px",
                opacity: infoAnim.visible ? 1 : 0, transform: infoAnim.visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 500ms ease-out ${100 + i * 80}ms, transform 500ms ease-out ${100 + i * 80}ms`,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: B.bone, border: `1px solid ${B.borderMd}`, fontSize: 13, fontWeight: 700, color: card.color, position: "relative", overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: card.color, opacity: 0.6 }} />
                  {card.num}
                </div>
                <div style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: B.navy, marginBottom: 8 }}>{card.title}</div>
                <p style={{ fontSize: m ? 14 : 15, color: B.muted, lineHeight: 1.55, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ background: B.gradient, position: "relative", overflow: "hidden", paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 700, height: 700, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${m ? PAD.mobile : PAD.desktop}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
          <h2 style={{ fontSize: m ? 32 : 48, color: "#F4F1EA", fontFamily: DF, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 20 }}>
            Not a subscriber yet?
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: "rgba(250,249,247,0.55)", lineHeight: 1.65, maxWidth: 440, margin: "0 auto 40px" }}>
            Start with your free Income Stability Score&#8482;. Upgrade to the full diagnostic or annual monitoring when you are ready.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
            <Link href="/begin" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: m ? 48 : 56, paddingLeft: 32, paddingRight: 32, borderRadius: 10, backgroundColor: "#F4F1EA", color: B.navy, fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              Get My Free Score
            </Link>
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: m ? 48 : 56, paddingLeft: 32, paddingRight: 32, borderRadius: 10, backgroundColor: "transparent", color: "#F4F1EA", fontSize: 16, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(244,241,234,0.25)" }}>
              View Pricing
            </Link>
          </div>
          <div style={{ marginTop: 20, fontSize: 14, color: "rgba(250,249,247,0.35)" }}>
            Free to start &#183; Under 2 minutes &#183; Private by default
          </div>
        </div>
      </section>
    </div>
  );
}
