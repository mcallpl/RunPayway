"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionByCode, getRemaining } from "@/lib/monitoring";

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

const inputStyle: React.CSSProperties = {
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
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: 44,
  cursor: "pointer",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function InitializationPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [form, setForm] = useState({
    assessment_title: "",
    classification: "",
    operating_structure: "",
    primary_income_model: "",
    revenue_structure: "",
    industry_sector: "",
    recipient_email: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Payment gate — only paid customers can access the diagnostic
    const session = sessionStorage.getItem("rp_purchase_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.status === "paid") {
          // If monitoring plan, verify assessments remain
          if (parsed.plan_key === "annual_monitoring" && parsed.monitoring_access_code) {
            const remaining = getRemaining(parsed.monitoring_access_code);
            if (remaining <= 0) {
              router.push("/sign-in");
              return;
            }
          }
          setAuthorized(true);
          return;
        }
      } catch { /* invalid session */ }
    }
    // No valid purchase session — redirect to pricing
    router.push("/pricing");
  }, [router]);

  if (!authorized) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ fontSize: 14, color: B.light }}>Redirecting to pricing...</p>
      </div>
    );
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.classification &&
    form.operating_structure &&
    form.primary_income_model &&
    form.revenue_structure &&
    form.industry_sector &&
    form.recipient_email.includes("@");

  const handleBegin = () => {
    sessionStorage.setItem("rp_profile", JSON.stringify(form));
    router.push("/diagnostic");
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = B.purple;
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          Income Stability Assessment
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 6 }}>
          Assessment Profile
        </h1>
        <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6 }}>
          Complete the fields below to begin your Income Stability Score™ assessment. These fields identify your income profile and do not affect your score.
        </p>
      </div>

      {/* Record status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderRadius: 12,
          background: "#FFFFFF",
          border: "1px solid rgba(14,26,43,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.teal }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>Assessment Record</span>
        </div>
        <span style={{ fontSize: 11, color: B.light }}>Issued Under: RunPayway™</span>
      </div>

      {/* Section 1 — Identity */}
      <section
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid rgba(14,26,43,0.06)",
          padding: "28px 24px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          Section 1
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
          Identity &amp; Structure
        </h2>
        <p style={{ fontSize: 13, color: B.light, lineHeight: 1.6, marginBottom: 24 }}>
          How is your income structured? These fields describe the type of entity and operating model.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Assessment Title */}
          <div>
            <label style={labelStyle}>Assessment Title</label>
            <p style={helperStyle}>Your name or organization name. This appears on your report.</p>
            <input
              type="text"
              value={form.assessment_title}
              onChange={(e) => update("assessment_title", e.target.value)}
              placeholder="e.g. Jordan Ellis or Ellis Advisory Group"
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
          </div>

          {/* Classification */}
          <div>
            <label style={labelStyle}>Classification</label>
            <p style={helperStyle}>Are you assessing income as an individual, business, or team?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CLASSIFICATIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => update("classification", c.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: `1px solid ${form.classification === c.value ? B.purple : "rgba(14,26,43,0.10)"}`,
                    background: form.classification === c.value ? "rgba(75,63,174,0.04)" : "#FFFFFF",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 160ms ease, background 160ms ease",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${form.classification === c.value ? B.purple : "rgba(14,26,43,0.20)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {form.classification === c.value && (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.purple }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{c.value}</div>
                    <div style={{ fontSize: 12, color: B.light }}>{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Operating Structure */}
          <div>
            <label style={labelStyle}>Operating Structure</label>
            <p style={helperStyle}>How is your work arrangement structured?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {OPERATING_STRUCTURES.map((o) => (
                <button
                  key={o.value}
                  onClick={() => update("operating_structure", o.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: `1px solid ${form.operating_structure === o.value ? B.purple : "rgba(14,26,43,0.10)"}`,
                    background: form.operating_structure === o.value ? "rgba(75,63,174,0.04)" : "#FFFFFF",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 160ms ease, background 160ms ease",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${form.operating_structure === o.value ? B.purple : "rgba(14,26,43,0.20)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {form.operating_structure === o.value && (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.purple }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{o.value}</div>
                    <div style={{ fontSize: 12, color: B.light }}>{o.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Income Context */}
      <section
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid rgba(14,26,43,0.06)",
          padding: "28px 24px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          Section 2
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
          Income Context
        </h2>
        <p style={{ fontSize: 13, color: B.light, lineHeight: 1.6, marginBottom: 24 }}>
          Describe the characteristics of your income system. These fields provide context for your report but do not influence your score.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Primary Income Model */}
          <div>
            <label style={labelStyle}>Primary Income Model</label>
            <p style={helperStyle}>What best describes how you primarily generate income?</p>
            <select
              value={form.primary_income_model}
              onChange={(e) => update("primary_income_model", e.target.value)}
              style={{ ...selectStyle, color: form.primary_income_model ? B.navy : B.light }}
              onFocus={focusHandler}
              onBlur={blurHandler}
            >
              <option value="">Select your primary income model</option>
              {PRIMARY_INCOME_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Revenue Structure */}
          <div>
            <label style={labelStyle}>Revenue Structure</label>
            <p style={helperStyle}>Select the pattern that best describes how you receive payment for your work.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {REVENUE_STRUCTURES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => update("revenue_structure", r.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: `1px solid ${form.revenue_structure === r.value ? B.purple : "rgba(14,26,43,0.10)"}`,
                    background: form.revenue_structure === r.value ? "rgba(75,63,174,0.04)" : "#FFFFFF",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 160ms ease, background 160ms ease",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${form.revenue_structure === r.value ? B.purple : "rgba(14,26,43,0.20)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {form.revenue_structure === r.value && (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.purple }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{r.value}</div>
                    <div style={{ fontSize: 12, color: B.light }}>{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Industry Sector */}
          <div>
            <label style={labelStyle}>Industry Sector</label>
            <p style={helperStyle}>Which industry best describes where your income is generated?</p>
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
        </div>
      </section>

      {/* Section 3 — Delivery */}
      <section
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid rgba(14,26,43,0.06)",
          padding: "28px 24px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          Section 3
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
          Report Delivery
        </h2>
        <p style={{ fontSize: 13, color: B.light, lineHeight: 1.6, marginBottom: 24 }}>
          Where should we send your Income Stability Score™ report?
        </p>

        <div>
          <label style={labelStyle}>Email Address</label>
          <p style={helperStyle}>Your report will be delivered to this email address.</p>
          <input
            type="email"
            value={form.recipient_email}
            onChange={(e) => update("recipient_email", e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
          />
        </div>
      </section>

      {/* Begin button */}
      <div>
        <button
          disabled={!isValid}
          onClick={handleBegin}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 12,
            background: isValid ? B.purple : "rgba(14,26,43,0.12)",
            color: isValid ? "#FFFFFF" : B.light,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            border: "none",
            cursor: isValid ? "pointer" : "not-allowed",
            boxShadow: isValid ? "0 6px 16px rgba(75,63,174,0.25)" : "none",
            transition: "background 180ms ease, transform 180ms ease",
          }}
        >
          Begin Assessment
        </button>
        {/* Endowed progress — customer feels they've already started */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: B.teal }}>Profile complete</span>
            <span style={{ fontSize: 11, color: B.light }}>6 questions remaining</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "rgba(14,26,43,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "15%", borderRadius: 2, background: B.teal, transition: "width 600ms ease" }} />
          </div>
        </div>
        <p style={{ fontSize: 11, color: B.light, textAlign: "center", marginTop: 10 }}>
          Average completion: 1 min 47 sec
        </p>
      </div>
    </div>
  );
}
