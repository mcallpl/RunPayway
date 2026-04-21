"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { getRemaining, getRemainingServer } from "@/lib/monitoring";
import { C, T, mono, sans, sp, padX, cardStyle, ctaButton, canHover, h2Style, body, bodySm } from "@/lib/design-tokens";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CLASSIFICATIONS = [
  { value: "Individual", desc: "You earn income as one person" },
  { value: "Business Entity", desc: "Income flows through a business you own" },
  { value: "Team / Partnership", desc: "You share income with partners" },
];

const OPERATING_STRUCTURES = [
  { value: "Employee (W-2)", desc: "You receive a paycheck from an employer" },
  { value: "Independent Contractor", desc: "You work for yourself — 1099, freelance, or gig" },
  { value: "Business Owner / Firm", desc: "You own the business that earns the income" },
  { value: "Partnership", desc: "You co-own the business with others" },
  { value: "Nonprofit Organization", desc: "You run or work for a nonprofit" },
];

const PRIMARY_INCOME_MODELS = [
  "Employee Salary",
  "Commission-Based",
  "Contract-Based",
  "Consulting / Client Services",
  "Agency / Brokerage Income",
  "Project-Based Work",
  "Subscription / Retainer Services",
  "Licensing / Royalty Income",
  "Product Sales",
  "Digital Product Sales",
  "Creator / Media Income",
  "Real Estate Rental Income",
  "Real Estate Brokerage Income",
  "Investment / Dividend Income",
  "Hybrid Multiple Income Sources",
];

// Clarifying subtitles shown after selection — helps users confirm they picked the right one
const INCOME_MODEL_HINTS: Record<string, string> = {
  "Employee Salary": "Paycheck from an employer — W-2, hourly, or salaried",
  "Commission-Based": "You earn per deal, sale, or transaction",
  "Contract-Based": "Fixed-term agreements for specific deliverables",
  "Consulting / Client Services": "You advise or serve clients directly",
  "Agency / Brokerage Income": "You run an agency or broker deals for others",
  "Project-Based Work": "You take on projects with a start and end date",
  "Subscription / Retainer Services": "Clients pay you monthly for ongoing access",
  "Licensing / Royalty Income": "You earn from intellectual property, content, or rights",
  "Product Sales": "You sell physical products — retail, wholesale, or e-commerce",
  "Digital Product Sales": "You sell digital products — courses, templates, software",
  "Creator / Media Income": "You earn from content, sponsorships, or audience monetization",
  "Real Estate Rental Income": "You earn from rental properties you own",
  "Real Estate Brokerage Income": "You earn commissions from real estate transactions",
  "Investment / Dividend Income": "You earn from investments, dividends, or interest",
  "Hybrid Multiple Income Sources": "You earn from two or more of the above",
};

const REVENUE_STRUCTURES = [
  { value: "Mostly One-Time Payments", desc: "Each sale or deal is separate — no automatic repeat" },
  { value: "Repeat Clients / Returning Customers", desc: "Clients come back regularly but can stop anytime" },
  { value: "Monthly Recurring Payments", desc: "Income repeats every month — retainers, memberships, subscriptions" },
  { value: "Contracted Multi-Month Revenue", desc: "Signed agreements that guarantee income for multiple months" },
  { value: "Long-Term Recurring Income", desc: "Income that continues on its own — royalties, rental income, licensing" },
  { value: "Mixed Revenue Structure", desc: "Some income repeats, some is one-time" },
];

const YEARS_IN_STRUCTURE = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5+ years",
];

const INDUSTRY_PREP: Record<string, string[]> = {
  "Real Estate": [
    "Know how many deals are under signed contract vs. verbal pipeline right now",
    "Know roughly what % of last year\u2019s income came from your top 1\u20132 closings",
    "Think about whether you have any income that continues between transactions",
  ],
  "Finance / Banking": [
    "Know what % of your annual compensation is variable vs. fixed base",
    "Know whether your base salary alone would cover your financial obligations",
    "Think about how tied your income is to market conditions or deal flow",
  ],
  "Insurance": [
    "Know what % of your income is renewals vs. new production",
    "Know whether your renewal book is growing, flat, or declining",
    "Think about how much your income would drop if new sales stopped for 90 days",
  ],
  "Technology": [
    "Know what % of your total compensation is variable \u2014 bonus, equity, or commissions",
    "Know how many income sources you have outside your primary employer",
    "Think about what your income looks like if your role was eliminated today",
  ],
  "Healthcare": [
    "Know whether your income comes from one institution or multiple sources",
    "Know what your income would look like if your primary employer restructured",
    "Think about whether any of your income continues when you\u2019re not actively working",
  ],
  "Legal Services": [
    "Know how many active matters you currently have",
    "Know what % of your billings come from your top 2\u20133 matters",
    "Think about whether any of your income is on retainer vs. matter-by-matter",
  ],
  "Consulting / Professional Services": [
    "Know what % of your income comes from your single largest client",
    "Know whether your current work is contracted, retainer, or project-by-project",
    "Think about what your income looks like in month 2 if you sign nothing new today",
  ],
  "Sales / Brokerage": [
    "Know what % of this quarter\u2019s earnings will carry forward automatically",
    "Know how many separate commission sources your income comes from",
    "Think about what your income is in a month where no deals close",
  ],
  "Media / Entertainment": [
    "Know how many months your current projects or contracts run",
    "Know whether you have any income that continues between active engagements",
    "Think about what your income looks like in a month with no active project",
  ],
  "Construction / Trades": [
    "Know how many months of signed work you currently have in backlog",
    "Know what % of your jobs come from repeat vs. new customers",
    "Think about whether your income stops completely between projects",
  ],
  "Retail / E-Commerce": [
    "Know how much your monthly revenue varies from your best to your slowest month",
    "Know whether you rely on one core product or have multiple lines",
    "Think about what % of your revenue comes from returning vs. new customers",
  ],
  "Hospitality / Food Service": [
    "Know what your income looks like in your slowest month of the year",
    "Know how much of your revenue is tied to foot traffic vs. contracted events",
    "Think about how quickly your income would change if demand shifted",
  ],
  "Transportation / Logistics": [
    "Know how many active clients or contracts you currently have",
    "Know what happens to your income if your largest route or client pauses",
    "Think about whether your income is consistent or heavily tied to utilization",
  ],
  "Manufacturing": [
    "Know what % of your output goes to your single largest buyer",
    "Know whether your current contracts are signed agreements or ongoing relationships",
    "Think about how your fixed costs compare to your income in a slow month",
  ],
  "Education": [
    "Know whether your income comes from one institution or multiple sources",
    "Know what your income would be if your primary position ended today",
    "Think about whether you have any income outside your primary teaching or instruction role",
  ],
  "Nonprofit / Public Sector": [
    "Know whether your position is grant-funded, budget-funded, or both",
    "Know when your current funding cycle ends",
    "Think about whether your income could continue if the primary funding source changed",
  ],
  "Agriculture": [
    "Know whether you have any contracted sales vs. open market sales",
    "Know how much last year\u2019s income varied from a typical year",
    "Think about what % of your income comes from one crop, product, or buyer",
  ],
  "Energy / Utilities": [
    "Know whether your income is tied to commodity prices or contracted rates",
    "Know how much your income varied month-to-month last year",
    "Think about whether your customers are under long-term contracts or spot pricing",
  ],
  "Other": [
    "Know roughly how many sources your income comes from",
    "Know whether any of your income repeats automatically each month",
    "Think about what your income would be if your largest source stopped today",
  ],
};

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
  fontFamily: sans,
  color: C.navy,
  marginBottom: 6,
};


const inputBase: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 18px",
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  background: "#FAFAFA",
  fontSize: 14,
  fontFamily: sans,
  color: C.navy,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 200ms ease",
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
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 12,
        border: `1px solid ${selected ? C.purple : "rgba(14,26,43,0.10)"}`,
        background: selected ? "rgba(75,63,174,0.04)" : C.white,
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 160ms ease, background 160ms ease",
        width: "100%",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${selected ? C.purple : "rgba(14,26,43,0.20)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.purple }} />}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: sans, color: C.navy }}>{label}</div>
        <div style={{ fontSize: 12, fontFamily: sans, color: C.light }}>{desc}</div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function StepBreadcrumb({ activeStep, completedSteps = [] as number[] }: { activeStep: number; completedSteps?: number[] }) {
  const steps = [
    { num: "①", label: "Profile" },
    { num: "②", label: "Assessment" },
    { num: "③", label: "Results" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 24 }}>
      {steps.map((s, i) => {
        const isActive = i + 1 === activeStep;
        const isCompleted = completedSteps.includes(i + 1);
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
            <span style={{
              fontSize: 11,
              fontWeight: isActive ? 600 : 400,
              fontFamily: sans,
              color: isActive ? C.purple : isCompleted ? C.teal : C.light,
              letterSpacing: "0.01em",
            }}>
              {isCompleted ? "✓" : s.num} {s.label}
            </span>
            {i < steps.length - 1 && (
              <span style={{ margin: "0 10px", color: "rgba(14,26,43,0.15)", fontSize: 11 }}>——</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function InitializationPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [portalRevealed, setPortalRevealed] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => { const c = () => setMobile(window.innerWidth <= 768); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

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

  const [needsRetakePurchase, setNeedsRetakePurchase] = useState(false);

  // Portal entrance animation + check for retake requirement
  useEffect(() => {
    // Check if user is attempting to retake without purchasing a new report
    const existingRecord = localStorage.getItem("rp_record");
    const purchaseSession = sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session");

    if (existingRecord && purchaseSession) {
      try {
        const ps = JSON.parse(purchaseSession);
        // If they have a completed assessment and are trying to use free plan without new purchase
        if (ps.plan_key === "free" && ps.status !== "paid") {
          setNeedsRetakePurchase(true);
          setPortalRevealed(true);
          return;
        }
      } catch { /* ignore malformed data */ }
    }

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
      if (step >= 3) { e.preventDefault(); }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => { window.removeEventListener("beforeunload", onBeforeUnload); };
  }, [step]);

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

  if (needsRetakePurchase) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40, textAlign: "center", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: sans, color: C.navy, marginBottom: 16, lineHeight: 1.2 }}>
            Retake Requires Purchase
          </h1>
          <p style={{ fontSize: 16, fontFamily: sans, color: C.textSecondary, marginBottom: 32, lineHeight: 1.6 }}>
            You&rsquo;ve already completed an assessment. To retake and get an updated report with your latest income structure, you need to purchase a new report.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            <a
              href="/plans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: sans,
                color: C.white,
                backgroundColor: C.purple,
                textDecoration: "none",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
              }}
            >
              Purchase New Report — $69
            </a>
            <button
              onClick={() => router.push("/dashboard/login")}
              style={{
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: sans,
                color: C.navy,
                backgroundColor: "transparent",
                border: `2px solid ${C.navy}`,
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              View Your Current Report
            </button>
          </div>
          <p style={{ fontSize: 13, fontFamily: sans, color: C.textMuted }}>
            Annual Monitoring subscribers can reassess at any time using their plan quota.
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 40, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, fontFamily: sans, color: C.navy, marginBottom: 12 }}>Access Required</h2>
        <p style={{ fontSize: 14, fontFamily: sans, color: C.muted, marginBottom: 24, maxWidth: 400 }}>
          Your session could not be verified. Please start from the pricing page.
        </p>
        <button onClick={() => router.push("/pricing")} style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, fontFamily: sans, color: "#fff", backgroundColor: C.purple, border: "none", borderRadius: 12, cursor: "pointer" }}>
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
    const profileData = { ...form, assessment_title: form.assessment_title.trim() };
    sessionStorage.setItem("rp_profile", JSON.stringify(profileData));
    localStorage.setItem("rp_profile", JSON.stringify(profileData));
    router.push("/diagnostic");
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = C.purple;
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)";
  };

  const canContinueStep0 = form.assessment_title.trim() !== "";
  const canContinueStep1 = form.industry_sector !== "" && form.operating_structure !== "" && form.primary_income_model !== "" && form.years_in_structure !== "";


  /* ================================================================ */
  /*  STEP 0 — PORTAL ENTRANCE                                        */
  /*  Dark, immersive, institutional. Feels like entering a vault.     */
  /* ================================================================ */
  if (step === 0) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#FAFAFA",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: mobile ? 300 : 600, height: mobile ? 300 : 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(75,63,174,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Step breadcrumb */}
        <div style={{
          position: "absolute", top: 32, left: 0, right: 0, zIndex: 2,
          opacity: portalRevealed ? 1 : 0,
          transition: "opacity 800ms ease",
        }}>
          <StepBreadcrumb activeStep={1} completedSteps={[]} />
        </div>

        {/* Content */}
        <div style={{
          maxWidth: 520, width: "100%", padding: mobile ? "0 28px" : "0 32px",
          opacity: portalRevealed ? 1 : 0,
          transform: portalRevealed ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 800ms ease, transform 800ms ease",
        }}>
          {/* Top badge */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-block", padding: "6px 16px", borderRadius: 20,
              border: "1px solid rgba(14,26,43,0.08)",
              background: "rgba(14,26,43,0.03)",
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: sans, color: C.purple, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                Income Stability Score™ &middot; Model RP-2.0
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: mobile ? 28 : 36, fontWeight: 300, fontFamily: sans, color: C.navy, textAlign: "center",
            lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 12,
          }}>
            Your Assessment Begins Here
          </h1>
          <p style={{
            fontSize: 15, fontFamily: sans, color: C.muted, textAlign: "center",
            lineHeight: 1.6, marginBottom: 48, maxWidth: 400, margin: "0 auto 48px",
          }}>
            Enter the name that will appear on your report. This is a confidential, one-time assessment of your income stability.
          </p>

          {/* Input field — centered, glowing */}
          <div style={{ position: "relative", marginBottom: 32 }}>
            <input
              type="text"
              id="assessment-title"
              value={form.assessment_title}
              onChange={(e) => update("assessment_title", e.target.value)}
              placeholder="Your name or organization"
              autoFocus
              aria-required="true"
              onFocus={focusHandler}
              onBlur={blurHandler}
              style={{
                width: "100%", height: 56, padding: "0 20px",
                borderRadius: 12, border: "1px solid rgba(14,26,43,0.12)",
                background: C.white, color: C.navy,
                fontSize: 17, fontWeight: 400, fontFamily: sans, letterSpacing: "-0.01em",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 200ms ease",
                textAlign: "center",
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && canContinueStep0) goToStep(1); }}
            />
          </div>

          {/* Email field */}
          <div style={{ position: "relative", marginBottom: 32 }}>
            <input
              type="email"
              id="recipient-email"
              value={form.recipient_email}
              onChange={(e) => update("recipient_email", e.target.value)}
              placeholder="Email (optional - to receive your report)"
              onFocus={focusHandler}
              onBlur={blurHandler}
              style={{
                width: "100%", height: 52, padding: "0 20px",
                borderRadius: 12, border: "1px solid rgba(14,26,43,0.08)",
                background: C.white, color: C.navy,
                fontSize: 15, fontWeight: 400, fontFamily: sans, letterSpacing: "-0.01em",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 200ms ease",
                textAlign: "center",
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && canContinueStep0) goToStep(1); }}
            />
          </div>

          {/* CTA */}
          <button
            className="cta-tick"
            disabled={!canContinueStep0}
            onClick={() => goToStep(1)}
            style={{
              width: "100%", height: 52, borderRadius: 12, border: "none",
              background: canContinueStep0 ? C.navy : "rgba(14,26,43,0.06)",
              color: canContinueStep0 ? C.sandText : C.light,
              fontSize: 14, fontWeight: 600, fontFamily: sans, letterSpacing: "-0.01em",
              cursor: canContinueStep0 ? "pointer" : "not-allowed",
              transition: "all 200ms ease",
            }}
          >
            <span className="tick tick-white" />
            Continue
          </button>

          {/* Trust signals */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 24, marginTop: 40,
          }}>
            {["Confidential", "Under 2 minutes", "No financial data required"].map((t) => (
              <span key={t} style={{ fontSize: 11, fontFamily: sans, color: C.light, letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* CSS animations */}
        <style>{`
          input::placeholder { color: rgba(14,26,43,0.30); }
          select::placeholder { color: rgba(14,26,43,0.30); }
          input:focus, select:focus { border-color: rgba(14,26,43,0.25) !important; }
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
    "Tell us how your income is structured. This calibrates your assessment.",
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#FAFAFA",
      overflowY: "auto",
    }}>
      {/* Section transition overlay */}
      {transitioning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "#FAFAFA",
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
        background: C.navy, padding: mobile ? "14px 24px" : "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
          <span style={{ fontSize: mobile ? 10 : 11, fontWeight: 700, fontFamily: sans, color: C.sandMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Income Stability Assessment
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: mobile ? 10 : 11, fontFamily: sans, color: C.sandLight }}>
            Assessing: {form.assessment_title || "—"}
          </span>
          {!mobile && <span style={{ fontSize: 11, fontFamily: sans, color: C.sandLight }}>Model RP-2.0</span>}
        </div>
      </div>

      {/* Progress indicator — clinical-style segmented bar */}
      <div style={{
        background: C.white, borderBottom: "1px solid rgba(14,26,43,0.06)",
        padding: mobile ? "12px 12px" : "12px 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: mobile ? 6 : 12 }}>
          {(mobile ? ["Profile", "Income", "Assessment"] : ["Profile", "Income Structure", "Assessment"]).map((label, i) => {
            const isActive = i === step;
            const isComplete = i < step;
            const isFuture = i > step && i < 3;
            return (
              <div key={label} style={{ flex: i === 2 ? 2 : 1, display: "flex", alignItems: "center", gap: mobile ? 4 : 8 }}>
                <div style={{
                  width: mobile ? 20 : 24, height: mobile ? 20 : 24, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: mobile ? 10 : 11, fontWeight: 700, fontFamily: mono,
                  background: isComplete ? C.teal : isActive ? C.purple : "rgba(14,26,43,0.06)",
                  color: isComplete || isActive ? C.white : C.light,
                  transition: "all 300ms ease",
                }}>
                  {isComplete ? "\u2713" : i + 1}
                </div>
                <span style={{
                  fontSize: mobile ? 11 : 12, fontWeight: isActive ? 600 : 400, fontFamily: sans,
                  color: isActive ? C.navy : isComplete ? C.teal : C.light,
                  whiteSpace: "nowrap",
                }}>
                  {label}
                </span>
                {i < 2 && (
                  <div style={{ flex: 1, height: 2, background: isComplete ? C.teal : "rgba(14,26,43,0.06)", borderRadius: 1, transition: "background 300ms ease" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 60px" }}>
        {/* Global step breadcrumb */}
        <div style={{ marginBottom: 8 }}>
          <StepBreadcrumb activeStep={1} completedSteps={[]} />
        </div>
        {/* Step header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 8 }} />
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: sans, color: C.navy, letterSpacing: "-0.02em", marginBottom: 8 }}>
            {stepTitles[step]}
          </h1>
          <p style={{ fontSize: 14, fontFamily: sans, color: C.muted, lineHeight: 1.6, maxWidth: 480 }}>
            {stepDescriptions[step]}
          </p>
        </div>

        {/* Step 1 — Income Profile */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Industry */}
            <div>
              <label htmlFor="industry-sector" style={labelStyle}>What industry are you in?</label>
              <select
                id="industry-sector"
                value={form.industry_sector}
                onChange={(e) => update("industry_sector", e.target.value)}
                style={{ ...selectStyle, color: form.industry_sector ? C.navy : C.light }}
                aria-required="true"
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Choose one</option>
                {INDUSTRY_SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Industry prep panel — appears on selection */}
              {form.industry_sector && INDUSTRY_PREP[form.industry_sector] && (
                <div style={{
                  marginTop: 12,
                  padding: "16px 20px",
                  borderRadius: 12,
                  backgroundColor: "rgba(31,109,122,0.04)",
                  border: "1px solid rgba(31,109,122,0.14)",
                  animation: "prepFadeIn 300ms ease-out",
                }}>
                  <style>{`@keyframes prepFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", fontFamily: sans, color: C.teal, marginBottom: 10 }}>
                    HAVE IN MIND
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {INDUSTRY_PREP[form.industry_sector].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: 13, fontFamily: sans, color: C.navy, lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Operating Structure */}
            <div>
              <label htmlFor="operating-structure" style={labelStyle}>How is your income set up?</label>
              <select
                id="operating-structure"
                value={form.operating_structure}
                onChange={(e) => update("operating_structure", e.target.value)}
                style={{ ...selectStyle, color: form.operating_structure ? C.navy : C.light }}
                aria-required="true"
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Choose one</option>
                {OPERATING_STRUCTURES.map((s) => (
                  <option key={s.value} value={s.value}>{s.value}</option>
                ))}
              </select>
            </div>

            {/* Primary Income Model */}
            <div>
              <label htmlFor="income-model" style={labelStyle}>How do you primarily earn?</label>
              <select
                id="income-model"
                value={form.primary_income_model}
                onChange={(e) => update("primary_income_model", e.target.value)}
                style={{ ...selectStyle, color: form.primary_income_model ? C.navy : C.light }}
                aria-required="true"
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Choose one</option>
                {PRIMARY_INCOME_MODELS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {form.primary_income_model && INCOME_MODEL_HINTS[form.primary_income_model] && (
                <div style={{ fontSize: 12, color: C.teal, marginTop: 6, lineHeight: 1.4 }}>
                  {INCOME_MODEL_HINTS[form.primary_income_model]}
                </div>
              )}
            </div>

            {/* Years in Current Structure */}
            <div>
              <label htmlFor="years-in-structure" style={labelStyle}>How long have you earned this way?</label>
              <select
                id="years-in-structure"
                value={form.years_in_structure}
                onChange={(e) => update("years_in_structure", e.target.value)}
                style={{ ...selectStyle, color: form.years_in_structure ? C.navy : C.light }}
                aria-required="true"
                onFocus={focusHandler}
                onBlur={blurHandler}
              >
                <option value="">Choose one</option>
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
              height: 52, borderRadius: 12, background: C.white, color: C.navy,
              fontSize: 14, fontWeight: 600, fontFamily: sans, letterSpacing: "-0.01em",
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
                background: canContinueStep1 ? C.purple : "rgba(14,26,43,0.12)",
                color: canContinueStep1 ? C.white : C.light,
                fontSize: 14, fontWeight: 600, fontFamily: sans, letterSpacing: "-0.01em", border: "none",
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
                color: isValid ? C.white : C.light,
                fontSize: 14, fontWeight: 600, fontFamily: sans, letterSpacing: "-0.01em", border: "none",
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
          fontSize: 11, fontFamily: sans, color: C.light, textAlign: "center", marginTop: 24, lineHeight: 1.5,
        }}>
          All information is confidential and used only to generate your assessment. No financial data is collected.
        </p>
      </div>
    </div>
  );
}
