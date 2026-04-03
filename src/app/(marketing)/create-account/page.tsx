"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createMonitoringSessionServer, type MonitoringSession } from "@/lib/monitoring";
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CreateAccountPage() {
  const router = useRouter();
  const mobile = useMobile();
  const heroAnim = useInView();
  const formAnim = useInView();
  const infoAnim = useInView();

  const [email, setEmail] = useState("");
  const [activateBtnHovered, setActivateBtnHovered] = useState(false);
  const [copyBtnHovered, setCopyBtnHovered] = useState(false);
  const [beginBtnHovered, setBeginBtnHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState<MonitoringSession | null>(null);
  const [error, setError] = useState("");

  const handleActivate = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // Pass payment token if available for server-side verification
    const purchaseRaw = sessionStorage.getItem("rp_purchase_session");
    let paymentToken: string | undefined;
    let paymentPayload: Record<string, string> | undefined;
    if (purchaseRaw) {
      const ps = JSON.parse(purchaseRaw);
      if (ps.payment_token) {
        paymentToken = ps.payment_token;
        paymentPayload = {
          plan_key: ps.plan_key,
          timestamp: ps.token_timestamp,
          nonce: ps.token_nonce,
          expires_at: ps.token_expires_at,
        };
      }
    }
    const generatedPin = String(Math.floor(1000 + Math.random() * 9000));
    const newSession = await createMonitoringSessionServer(email, paymentToken, paymentPayload, generatedPin);
    sessionStorage.setItem("rp_monitoring_pin", generatedPin);
    setSession(newSession);
  };

  const handleCopy = async () => {
    if (!session) return;
    try {
      await navigator.clipboard.writeText(session.access_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback — select text manually */
    }
  };

  const handleBeginAssessment = () => {
    if (!session) return;
    // Set purchase session so diagnostic-portal allows entry
    sessionStorage.setItem(
      "rp_purchase_session",
      JSON.stringify({
        plan_key: "annual_monitoring",
        price_cents: 9900,
        currency: "USD",
        intended_assessment_count: 3,
        status: "paid",
        checkout_provider: "stripe",
        monitoring_access_code: session.access_code,
      }),
    );
    router.push("/diagnostic-portal");
  };

  const expiresDate = session
    ? new Date(session.expires_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

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
              border: `1px solid ${C.sandBorder}`,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sandMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Stability Monitoring
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              fontFamily: sans,
              color: C.white,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {session ? "Your Access Code" : "Activate Your Monitoring Plan"}
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: C.sandMuted,
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto 8px",
            }}
          >
            {session
              ? "Save this code to access your remaining assessments."
              : "Set up your Monitoring Portal to access your three Stability Monitoring assessments."}
          </p>

          <p style={{ fontSize: 14, color: C.sandLight }}>
            Structural Stability Model RP-2.0
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Activation / Code display                                   */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
          background: C.sand,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 900,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            gap: mobile ? 32 : 40,
            alignItems: "start",
          }}
        >
          {/* Form / Code card */}
          <div
            ref={formAnim.ref}
            style={{
              flex: 1,
              background: C.white,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              padding: mobile ? "32px 24px" : "40px 40px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
              opacity: formAnim.visible ? 1 : 0,
              transform: formAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease, transform 700ms ease",
            }}
          >
            {/* Stability Monitoring badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(75,63,174,0.08)",
                marginBottom: 20,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.purple }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Stability Monitoring Subscriber
              </span>
            </div>

            {!session ? (
              /* ---- Step 1: Email confirmation ---- */
              <>
                <h2
                  style={{
                    fontSize: mobile ? 22 : 26,
                    fontWeight: 700,
                    fontFamily: sans,
                    color: C.navy,
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                  }}
                >
                  Activate Monitoring
                </h2>

                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
                  Enter your email to activate your monitoring plan. You will receive an access code to use for your remaining assessments.
                </p>

                {/* Email */}
                <div style={{ marginBottom: 24 }}>
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      height: 48,
                      padding: "0 16px",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      background: C.sand,
                      fontSize: 14,
                      color: C.navy,
                      outline: "none",
                      transition: "border-color 180ms ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleActivate(); }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 16 }}>{error}</p>
                )}

                {/* Activate button */}
                <button
                  onClick={handleActivate}
                  onMouseEnter={() => canHover() && setActivateBtnHovered(true)}
                  onMouseLeave={() => setActivateBtnHovered(false)}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 12,
                    background: activateBtnHovered ? "#3D33A0" : C.purple,
                    color: C.white,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 16px rgba(75,63,174,0.25)",
                    transition: "background 180ms ease, transform 180ms ease",
                    transform: activateBtnHovered ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  Activate Monitoring
                </button>

                {/* Sign in link */}
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>Already have an access code? </span>
                  <Link
                    href="/sign-in"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.purple,
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(75,63,174,0.30)",
                      transition: "border-color 180ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(75,63,174,0.30)"; }}
                  >
                    Sign In
                  </Link>
                </div>
              </>
            ) : (
              /* ---- Step 2: Access code display ---- */
              <>
                <h2
                  style={{
                    fontSize: mobile ? 22 : 26,
                    fontWeight: 700,
                    fontFamily: sans,
                    color: C.navy,
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                  }}
                >
                  Monitoring Activated
                </h2>

                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
                  Your Stability Monitoring plan is now active. Save the access code below — you will need it to access your remaining assessments.
                </p>

                {/* Access code display */}
                <div
                  style={{
                    padding: mobile ? "24px 20px" : "28px 28px",
                    borderRadius: 14,
                    background: "rgba(75,63,174,0.04)",
                    border: "2px solid rgba(75,63,174,0.18)",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                    Your Access Code
                  </div>
                  <div
                    style={{
                      fontSize: mobile ? 28 : 36,
                      fontWeight: 700,
                      color: C.navy,
                      letterSpacing: "0.06em",
                      fontFamily: mono,
                      marginBottom: 16,
                    }}
                  >
                    {session.access_code}
                  </div>
                  <button
                    onClick={handleCopy}
                    onMouseEnter={() => canHover() && setCopyBtnHovered(true)}
                    onMouseLeave={() => setCopyBtnHovered(false)}
                    style={{
                      padding: "8px 24px",
                      borderRadius: 8,
                      background: copied ? C.teal : copyBtnHovered ? "#3D33A0" : C.purple,
                      color: C.white,
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "background 180ms ease",
                    }}
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>

                <p style={{ fontSize: 13, color: "#DC2626", lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>
                  Save this access code. You will need it to access your remaining assessments.
                </p>

                {/* Plan details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[
                    ["Assessments", "3 included"],
                    ["Plan Duration", "12 months"],
                    ["Expires", expiresDate],
                    ["Email", session.email],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: C.sand }}>
                      <span style={{ fontSize: 13, color: C.muted }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Begin First Assessment button */}
                <button
                  onClick={handleBeginAssessment}
                  onMouseEnter={() => canHover() && setBeginBtnHovered(true)}
                  onMouseLeave={() => setBeginBtnHovered(false)}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 12,
                    background: beginBtnHovered ? "#1a5c67" : C.teal,
                    color: C.white,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 16px rgba(31,109,122,0.25)",
                    transition: "background 180ms ease, transform 180ms ease",
                    transform: beginBtnHovered ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  Begin First Assessment
                </button>
              </>
            )}

            {/* Security line */}
            <div style={{ height: 1, background: C.border, margin: "24px 0 16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.light }}>Access code authentication</span>
              <span style={{ fontSize: 12, color: C.light }}>Local session management</span>
            </div>
          </div>

          {/* Right — What you get */}
          <div
            ref={infoAnim.ref}
            style={{
              flex: 1,
              opacity: infoAnim.visible ? 1 : 0,
              transform: infoAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease 140ms, transform 700ms ease 140ms",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Your Monitoring Plan Includes
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 28 }}>
              {[
                ["3 Income Stability Assessments", "Take at any time within 12 months"],
                ["Monitoring Portal Access", "View your timeline and historical scores"],
                ["Full Diagnostic Reports", "Score, classification, and improvement path"],
                ["Score Verification", "Each assessment receives a unique verification ID"],
              ].map(([title, desc], i) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "18px 0",
                    borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(75,63,174,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, fontFamily: mono, color: C.purple }}>{i + 1}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Account notice */}
            <div
              style={{
                padding: mobile ? "20px 20px" : "24px 24px",
                borderRadius: 14,
                background: C.white,
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                Access Code Info
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>
                Your access code is your key to the Monitoring Portal. Save it somewhere secure.
              </p>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Single Assessment customers do not need an access code — reports are generated instantly after completing the diagnostic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Model reference bar                                         */}
      {/* ============================================================ */}
      <div
        style={{
          background: gradient,
          padding: "16px 0",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 12, color: C.sandLight, letterSpacing: "0.02em" }}>
          Powered by Structural Stability Model RP-2.0
        </span>
      </div>
    </div>
  );
}
