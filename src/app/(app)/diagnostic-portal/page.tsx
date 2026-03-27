"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import logoWhite from "../../../../public/runpayway-logo-white.png";
import { getRemaining, getRemainingServer } from "@/lib/monitoring";

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
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CLASSIFICATIONS = [
  { value: "Individual", desc: "You earn income as a single person" },
  { value: "Business Entity", desc: "Income flows through a registered business" },
  { value: "Team / Partnership", desc: "Income is shared across multiple partners" },
];

const OPERATING_STRUCTURES = [
  { value: "Employee (W-2)", desc: "Salaried or hourly employee" },
  { value: "Independent Contractor", desc: "1099 or freelance arrangement" },
  { value: "Business Owner / Firm", desc: "Owner of an LLC, S-Corp, or C-Corp" },
  { value: "Partnership", desc: "Shared ownership structure" },
  { value: "Nonprofit Organization", desc: "Tax-exempt entity" },
];

const PRIMARY_INCOME_MODELS = [
  "Employee Salary",
  "Commission-Based",
  "Contract-Based",
  "Independent Contractor",
  "Team / Partnership Income",
  "Business Ownership",
  "Professional Practice",
  "Consulting / Client Services",
  "Agency / Brokerage Income",
  "Project-Based Work",
  "Subscription / Retainer Services",
  "Licensing / Royalty Income",
  "Product Sales",
  "Digital Product Sales",
  "Creator / Media Income",
  "Affiliate / Referral Income",
  "Real Estate Rental Income",
  "Real Estate Brokerage Income",
  "Franchise Ownership",
  "Investment / Dividend Income",
  "Hybrid Multiple Income Sources",
];

const REVENUE_STRUCTURES = [
  { value: "Mostly One-Time Payments", desc: "Commissions, project fees, one-off sales" },
  { value: "Repeat Clients / Returning Customers", desc: "Clients who come back but without formal contracts" },
  { value: "Monthly Recurring Payments", desc: "Retainers, memberships, subscriptions" },
  { value: "Contracted Multi-Month Revenue", desc: "Signed engagements lasting several months" },
  { value: "Long-Term Recurring Income", desc: "Recurring advisory services, licensing, or royalties" },
  { value: "Mixed Revenue Structure", desc: "Combination of one-time and recurring income" },
];

const YEARS_IN_STRUCTURE = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5+ years",
];

const INDUSTRY_SECTORS = [
  "Real Estate",
  "Finance / Banking",
  "Insurance",
  "Technology",
  "Healthcare",
  "Legal Services",
  "Consulting / Professional Services",
  "Sales / Brokerage",
  "Media / Entertainment",
  "Construction / Trades",
  "Retail / E-Commerce",
  "Hospitality / Food Service",
  "Transportation / Logistics",
  "Manufacturing",
  "Education",
  "Nonprofit / Public Sector",
  "Agriculture",
  "Energy / Utilities",
  "Other",
];

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: B.navy,
  marginBottom: 6,
};

const helperStyle: React.CSSProperties = {
  fontSize: 12,
  color: B.light,
  lineHeight: 1.5,
  marginBottom: 8,
};

const inputBase: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 16px",
  borderRadius: 10,
  border: "1px solid rgba(14,26,43,0.12)",
  background: "#FFFFFF",
  fontSize: 14,
  color: B.navy,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 180ms ease",
};

const selectStyle: React.CSSProperties = {
  ...inputBase,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: 44,
  cursor: "pointer",
};

/* ------------------------------------------------------------------ */
/*  Radio button component                                             */
/* ------------------------------------------------------------------ */

function RadioCard({ label, desc, selected, onClick }: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 10,
        border: `1px solid ${selected ? B.purple : "rgba(14,26,43,0.10)"}`,
        background: selected ? "rgba(75,63,174,0.04)" : "#FFFFFF",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 160ms ease, background 160ms ease",
        width: "100%",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${selected ? B.purple : "rgba(14,26,43,0.20)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.purple }} />}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{label}</div>
        <div style={{ fontSize: 12, color: B.light }}>{desc}</div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function InitializationPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [portalRevealed, setPortalRevealed] = useState(false);
  const [showReadyScreen, setShowReadyScreen] = useState(false);
  const [readyVisible, setReadyVisible] = useState(false);
  const [readyExiting, setReadyExiting] = useState(false);

  const goToStep = useCallback((nextStep: number) => {
    setTransitioning(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      setStep(nextStep);
      setTimeout(() => setTransitioning(false), 300);
    }, 800);
  }, []);
  const [form, setForm] = useState({
    assessment_title: "",
    classification: "",
    operating_structure: "",
    primary_income_model: "",
    revenue_structure: "",
    industry_sector: "",
    years_in_structure: "",
    recipient_email: "",
  });

  // Portal entrance animation + clear prior session
  useEffect(() => {
    // Clear prior report so a new assessment starts fresh
    try {
      sessionStorage.removeItem("rp_record");
      sessionStorage.removeItem("runpayway_diagnostic_state");
    } catch { /* ignore */ }
    const t = setTimeout(() => setPortalRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.assessment_title || form.industry_sector) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [form.assessment_title, form.industry_sector]);

  useEffect(() => {
    const purchaseRaw = sessionStorage.getItem("rp_purchase_session");
    if (purchaseRaw) {
      try {
        const ps = JSON.parse(purchaseRaw);
        if (ps.customer_email) {
          setForm((prev) => ({ ...prev, recipient_email: ps.customer_email }));
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function verifyAccess() {
      let session = sessionStorage.getItem("rp_purchase_session");
      if (!session) {
        const stored = localStorage.getItem("rp_purchase_session");
        if (stored) {
          sessionStorage.setItem("rp_purchase_session", stored);
          session = stored;
        }
      }
      if (!session) {
        const freeSession = { plan_key: "free", status: "paid" };
        sessionStorage.setItem("rp_purchase_session", JSON.stringify(freeSession));
        session = JSON.stringify(freeSession);
      }

      try {
        const parsed = JSON.parse(session);
        if (parsed?.status === "paid" || parsed?.status === "active") {
          setAuthorized(true);
        } else if (parsed?.payment_token) {
          const res = await fetch("/api/v1/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: parsed.payment_token }),
          });
          if (res.ok) {
            parsed.status = "paid";
            sessionStorage.setItem("rp_purchase_session", JSON.stringify(parsed));
            localStorage.setItem("rp_purchase_session", JSON.stringify(parsed));
            setAuthorized(true);
          }
        }

        // Monitoring plan: check remaining assessments
        if (parsed?.plan_key === "annual_monitoring" && parsed?.monitoring_access_code) {
          try {
            const remaining = typeof window !== "undefined"
              ? await getRemaining(parsed.monitoring_access_code)
              : await getRemainingServer(parsed.monitoring_access_code);
            if (remaining <= 0) {
              setAuthorized(false);
              router.push("/pricing");
              return;
            }
          } catch { /* allow — can't reach monitoring service, let them proceed */ }
        }
      } catch { /* ignore malformed session */ }

      setReady(true);
    }

    verifyAccess();
  }, [router]);

  if (!ready) return null;
  if (!authorized) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: B.navy, marginBottom: 12 }}>Access Required</h2>
        <p style={{ fontSize: 14, color: B.muted, marginBottom: 24, maxWidth: 400 }}>
          Your session could not be verified. Please start from the pricing page.
        </p>
        <button onClick={() => router.push("/pricing")} style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#fff", backgroundColor: B.purple, border: "none", borderRadius: 10, cursor: "pointer" }}>
          View Plans
        </button>
      </div>
    );
  }

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const isValid =
    form.assessment_title.trim() !== "" &&
    form.industry_sector !== "" &&
    form.operating_structure !== "" &&
    form.primary_income_model !== "" &&
    form.years_in_structure !== "";

  const handleBegin = () => {
    if (!isValid) return;
    const profile = {
      ...form,
      assessment_title: form.assessment_title.trim(),
    };
    sessionStorage.setItem("rp_profile", JSON.stringify(profile));
    localStorage.setItem("rp_profile", JSON.stringify(profile));
    setShowReadyScreen(true);
    setTimeout(() => setReadyVisible(true), 100);
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = B.purple;
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)";
  };

  const canContinueStep0 = form.assessment_title.trim() !== "";
  const canContinueStep1 = form.industry_sector !== "" && form.operating_structure !== "" && form.primary_income_model !== "" && form.years_in_structure !== "";

  /* ================================================================ */
  /*  READY SCREEN — Breath before the diagnostic begins               */
  /* ================================================================ */
  if (showReadyScreen) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "linear-gradient(170deg, #0E1A2B 0%, #151D30 40%, #1a1f3a 70%, #0E1A2B 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "0 32px",
      }}>
        <div style={{
          opacity: readyExiting ? 0 : readyVisible ? 1 : 0,
          transform: readyExiting ? "translateY(-16px)" : readyVisible ? "translateY(0)" : "translateY(20px)",
          transition: readyExiting ? "opacity 1000ms ease-out, transform 1000ms ease-out" : "opacity 800ms ease-out, transform 800ms ease-out",
          maxWidth: 440,
          display: "flex", flexDirection: "column", alignItems: "center",
          minHeight: "80vh", justifyContent: "center", position: "relative",
        }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.35)", marginBottom: 28 }}>
              Prepared for {form.assessment_title}
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.25 }}>
              Your assessment is ready.
            </h1>

            <div style={{ width: 32, height: 1, backgroundColor: "rgba(244,241,234,0.12)", marginBottom: 20 }} />

            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, maxWidth: 340, margin: "0 auto 12px" }}>
              A short structural diagnostic about how your income works. No financial data required.
            </p>

            <p style={{ fontSize: 13, color: "rgba(244,241,234,0.25)", marginBottom: 40 }}>
              Takes about 90 seconds
            </p>

            <button
              className="cta-tick"
              onClick={() => {
                setReadyExiting(true);
                setTimeout(() => router.push("/diagnostic"), 1200);
              }}
              style={{
                height: 52, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
                background: "#F4F1EA",
                color: B.navy, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em",
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 28px rgba(0,0,0,0.20)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.20)"; }}
            >
              <span className="tick tick-navy" />
              Begin Assessment
            </button>

            <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              {["No bank connection", "No credit pull", "Private by default"].map((item) => (
                <span key={item} style={{ fontSize: 12, color: "rgba(244,241,234,0.20)", letterSpacing: "0.02em" }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Logo at bottom center */}
          <div style={{ paddingBottom: 40, paddingTop: 32 }}>
            <Image
              src={logoWhite}
              alt="RunPayway"
              width={100}
              height={12}
              style={{ height: "auto", opacity: 0.3 }}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  STEP 0 — PORTAL ENTRANCE                                        */
  /*  Dark, immersive, institutional. Feels like entering a vault.     */
  /* ================================================================ */
  if (step === 0) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "linear-gradient(170deg, #0E1A2B 0%, #151D30 40%, #1a1f3a 70%, #0E1A2B 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(75,63,174,0.08) 0%, rgba(75,63,174,0) 70%)",
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{
          maxWidth: 520, width: "100%", padding: "0 32px",
          opacity: portalRevealed ? 1 : 0,
          transform: portalRevealed ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 800ms ease, transform 800ms ease",
        }}>
          {/* Top badge */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-block", padding: "6px 16px", borderRadius: 20,
              border: "1px solid rgba(75,63,174,0.30)",
              background: "rgba(75,63,174,0.08)",
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Income Stability Score&#8482; &middot; Model RP-2.0
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 36, fontWeight: 300, color: "#F4F1EA", textAlign: "center",
            lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 12,
          }}>
            Your Assessment Begins Here
          </h1>
          <p style={{
            fontSize: 15, color: "rgba(244,241,234,0.45)", textAlign: "center",
            lineHeight: 1.6, marginBottom: 48, maxWidth: 400, margin: "0 auto 48px",
          }}>
            Enter the name that will appear on your report. This is a confidential, one-time assessment of your income stability.
          </p>

          {/* Input field — centered, glowing */}
          <div style={{ position: "relative", marginBottom: 32 }}>
            <input
              type="text"
              value={form.assessment_title}
              onChange={(e) => update("assessment_title", e.target.value)}
              placeholder="Your name or organization"
              autoFocus
              onFocus={focusHandler}
              onBlur={blurHandler}
              style={{
                width: "100%", height: 56, padding: "0 20px",
                borderRadius: 12, border: "1px solid rgba(75,63,174,0.30)",
                background: "rgba(255,255,255,0.04)", color: "#F4F1EA",
                fontSize: 17, fontWeight: 400, letterSpacing: "-0.01em",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 200ms ease, box-shadow 200ms ease",
                textAlign: "center",
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && canContinueStep0) goToStep(1); }}
            />
            {/* Glow ring */}
            {form.assessment_title.trim() && (
              <div style={{
                position: "absolute", inset: -2, borderRadius: 14,
                border: "1px solid rgba(75,63,174,0.40)",
                boxShadow: "0 0 20px rgba(75,63,174,0.15)",
                pointerEvents: "none",
              }} />
            )}
          </div>

          {/* CTA */}
          <button
            className="cta-tick"
            disabled={!canContinueStep0}
            onClick={() => goToStep(1)}
            style={{
              width: "100%", height: 52, borderRadius: 12, border: "none",
              background: canContinueStep0
                ? "linear-gradient(135deg, #4B3FAE 0%, #3d35a0 50%, #1F6D7A 100%)"
                : "rgba(255,255,255,0.06)",
              color: canContinueStep0 ? "#FFFFFF" : "rgba(255,255,255,0.25)",
              fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em",
              cursor: canContinueStep0 ? "pointer" : "not-allowed",
              boxShadow: canContinueStep0 ? "0 8px 24px rgba(75,63,174,0.30)" : "none",
              transition: "all 300ms ease",
            }}
          >
            <span className="tick tick-white" />
            Begin Profile Setup
          </button>

          {/* Trust signals */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 24, marginTop: 40,
          }}>
            {["Confidential", "Under 2 minutes", "No financial data required"].map((t) => (
              <span key={t} style={{ fontSize: 11, color: "rgba(244,241,234,0.25)", letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* CSS animations */}
        <style>{`
          input::placeholder { color: rgba(244,241,234,0.25); }
          input:focus { border-color: rgba(75,63,174,0.60) !important; box-shadow: 0 0 24px rgba(75,63,174,0.12) !important; }
        `}</style>
      </div>
    );
  }

  /* ================================================================ */
  /*  STEPS 1 & 2 — CLINICAL DIAGNOSTIC INTAKE                        */
  /*  Transition from portal to structured intake. Clean, precise,     */
  /*  institutional. Feels like a professional assessment instrument.  */
  /* ================================================================ */

  const stepTitles = [
    "",
    "Your Income Profile",
  ];

  const stepDescriptions = [
    "",
    "Tell us about how your income is structured. This calibrates your diagnostic report.",
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: B.sand,
      overflowY: "auto",
    }}>
      {/* Section transition overlay */}
      {transitioning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: B.sand,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          animation: "portalCrossFade 800ms ease-in-out",
        }}>
          <style>{`
            @keyframes portalCrossFade { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 1; } }
          `}</style>
          <Image
            src={logoBlue}
            alt="RunPayway™"
            width={160}
            height={19}
            style={{ height: "auto", opacity: 0.4 }}
          />
        </div>
      )}

      {/* Top bar — institutional header */}
      <div style={{
        background: B.navy, padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.teal }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(244,241,234,0.50)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Income Stability Diagnostic
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: "rgba(244,241,234,0.35)" }}>
            Assessing: {form.assessment_title || "—"}
          </span>
          <span style={{ fontSize: 11, color: "rgba(244,241,234,0.25)" }}>Model RP-2.0</span>
        </div>
      </div>

      {/* Progress indicator — clinical-style segmented bar */}
      <div style={{
        background: "#FFFFFF", borderBottom: "1px solid rgba(14,26,43,0.06)",
        padding: "12px 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          {["Profile", "Income Structure", "Assessment"].map((label, i) => {
            const isActive = i === step;
            const isComplete = i < step;
            const isFuture = i > step && i < 3;
            return (
              <div key={label} style={{ flex: i === 2 ? 2 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  background: isComplete ? B.teal : isActive ? B.purple : "rgba(14,26,43,0.06)",
                  color: isComplete || isActive ? "#FFFFFF" : B.light,
                  transition: "all 300ms ease",
                }}>
                  {isComplete ? "\u2713" : i + 1}
                </div>
                <span style={{
                  fontSize: 12, fontWeight: isActive ? 600 : 400,
                  color: isActive ? B.navy : isComplete ? B.teal : B.light,
                }}>
                  {label}
                </span>
                {i < 2 && (
                  <div style={{ flex: 1, height: 2, background: isComplete ? B.teal : "rgba(14,26,43,0.06)", borderRadius: 1, transition: "background 300ms ease" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 60px" }}>
        {/* Step header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.teal, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Step {step} of 2
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 8 }}>
            {stepTitles[step]}
          </h1>
          <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6, maxWidth: 480 }}>
            {stepDescriptions[step]}
          </p>
        </div>

        {/* Step 1 — Income Profile */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Industry */}
            <div>
              <label style={labelStyle}>Industry Sector</label>
              <p style={helperStyle}>Which industry generates your primary income?</p>
              <select
                value={form.industry_sector}
                onChange={(e) => update("industry_sector", e.target.value)}
                style={{ ...selectStyle, color: form.industry_sector ? B.navy : B.light }}
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Select your industry</option>
                {INDUSTRY_SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Operating Structure */}
            <div>
              <label style={labelStyle}>Operating Structure</label>
              <p style={helperStyle}>How is your income legally structured?</p>
              <select
                value={form.operating_structure}
                onChange={(e) => update("operating_structure", e.target.value)}
                style={{ ...selectStyle, color: form.operating_structure ? B.navy : B.light }}
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Select your structure</option>
                {OPERATING_STRUCTURES.map((s) => (
                  <option key={s.value} value={s.value}>{s.value}</option>
                ))}
              </select>
            </div>

            {/* Primary Income Model */}
            <div>
              <label style={labelStyle}>Primary Income Model</label>
              <p style={helperStyle}>How do you primarily earn income?</p>
              <select
                value={form.primary_income_model}
                onChange={(e) => update("primary_income_model", e.target.value)}
                style={{ ...selectStyle, color: form.primary_income_model ? B.navy : B.light }}
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Select your income model</option>
                {PRIMARY_INCOME_MODELS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Years in Current Structure */}
            <div>
              <label style={labelStyle}>Years in Current Structure</label>
              <p style={helperStyle}>How long have you been earning under this arrangement?</p>
              <select
                value={form.years_in_structure}
                onChange={(e) => update("years_in_structure", e.target.value)}
                style={{ ...selectStyle, color: form.years_in_structure ? B.navy : B.light }}
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Select tenure</option>
                {YEARS_IN_STRUCTURE.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
          <button
            onClick={() => goToStep(step - 1)}
            style={{
              height: 52, borderRadius: 12, background: "#FFFFFF", color: B.navy,
              fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em",
              border: "1px solid rgba(14,26,43,0.12)", cursor: "pointer", padding: "0 24px",
              transition: "background 180ms ease",
            }}
          >
            Back
          </button>
          {step < 1 ? (
            <button
              className="cta-tick"
              disabled={!canContinueStep1}
              onClick={() => goToStep(step + 1)}
              style={{
                flex: 1, height: 52, borderRadius: 12,
                background: canContinueStep1 ? B.purple : "rgba(14,26,43,0.12)",
                color: canContinueStep1 ? "#FFFFFF" : B.light,
                fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", border: "none",
                cursor: canContinueStep1 ? "pointer" : "not-allowed",
                boxShadow: canContinueStep1 ? "0 6px 16px rgba(75,63,174,0.25)" : "none",
                transition: "background 180ms ease, transform 180ms ease",
              }}
            >
              <span className="tick tick-white" />
              Continue
            </button>
          ) : (
            <button
              className="cta-tick"
              disabled={!isValid}
              onClick={handleBegin}
              style={{
                flex: 1, height: 52, borderRadius: 12,
                background: isValid
                  ? "linear-gradient(135deg, #4B3FAE 0%, #1F6D7A 100%)"
                  : "rgba(14,26,43,0.12)",
                color: isValid ? "#FFFFFF" : B.light,
                fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", border: "none",
                cursor: isValid ? "pointer" : "not-allowed",
                boxShadow: isValid ? "0 8px 24px rgba(75,63,174,0.30)" : "none",
                transition: "all 300ms ease",
              }}
            >
              <span className="tick tick-white" />
              Begin Assessment
            </button>
          )}
        </div>

        {/* Confidentiality notice */}
        <p style={{
          fontSize: 11, color: B.light, textAlign: "center", marginTop: 24, lineHeight: 1.5,
        }}>
          All information is confidential and used only to generate your assessment. No financial data is collected.
        </p>
      </div>
    </div>
  );
}
