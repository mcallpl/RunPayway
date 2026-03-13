"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
};

/* Thin divider */
function Divider() {
  return (
    <div
      style={{
        height: 1,
        backgroundColor: B.navy,
        opacity: 0.15,
        margin: "24px 0 32px",
      }}
    />
  );
}

export default function PricingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Reading progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: `${progress}%`,
          backgroundColor: B.navy,
          opacity: 0.3,
          zIndex: 50,
          transition: "width 50ms linear",
        }}
      />

      <div
        className="pricing-content"
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "100px 36px 120px",
          backgroundColor: "#ffffff",
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .pricing-content {
              padding: 72px 20px 80px !important;
            }
          }
        `}</style>
        {/* ============ SECTION 1 — HERO ============ */}
        <div style={{ marginBottom: 64 }}>
          <h1
            className="text-[36px] md:text-[40px] font-semibold leading-tight"
            style={{ color: B.navy, marginBottom: 12 }}
          >
            Measure Your Income Stability
          </h1>
          <h2
            className="text-[22px] font-semibold"
            style={{ color: B.navy, marginBottom: 12 }}
          >
            Income Stability Assessment
          </h2>
          <p className="text-[14px]" style={{ color: B.muted, marginBottom: 24 }}>
            Model RP-1.0 | Version 1.0
          </p>
          <p
            className="text-[16px] leading-[1.7]"
            style={{ color: B.muted }}
          >
            RunPayway provides structured income stability diagnostics using the Income Stability Score™.
          </p>
        </div>

        <Divider />

        {/* ============ SECTION 2 — PRIMARY PRICING OPTIONS ============ */}
        <section style={{ marginTop: 56 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Single Assessment */}
            <div
              className="rounded-lg"
              style={{
                border: "1px solid #E5E7EB",
                padding: 32,
                backgroundColor: "#ffffff",
              }}
            >
              <div
                className="text-[17px] font-semibold"
                style={{ color: B.navy, marginBottom: 4 }}
              >
                Single Assessment
              </div>
              <div
                className="text-[40px] font-semibold leading-none"
                style={{ color: B.navy, marginTop: 12, marginBottom: 16 }}
              >
                $39
              </div>
              <p className="text-[15px] leading-[1.7]" style={{ color: B.muted, marginBottom: 4 }}>
                One structural measurement
              </p>
              <p className="text-[13px]" style={{ color: B.light, marginBottom: 24 }}>
                Secure checkout via Stripe
              </p>
              <Link
                href="/checkout-placeholder?plan=single"
                className="inline-flex items-center px-6 py-3 text-[14px] font-medium rounded transition-opacity hover:opacity-90"
                style={{ backgroundColor: B.purple, color: "#ffffff" }}
              >
                Get Assessment
              </Link>
            </div>

            {/* Annual Monitoring — emphasized */}
            <div
              className="rounded-lg relative"
              style={{
                border: `1px solid rgba(14, 26, 43, 0.4)`,
                padding: 32,
                backgroundColor: "#ffffff",
              }}
            >
              <div
                className="text-[12px] font-medium uppercase tracking-[0.08em]"
                style={{ color: B.navy, opacity: 0.6, marginBottom: 8 }}
              >
                Recommended
              </div>
              <div
                className="text-[17px] font-semibold"
                style={{ color: B.navy, marginBottom: 4 }}
              >
                Annual Monitoring
              </div>
              <div
                className="text-[40px] font-semibold leading-none"
                style={{ color: B.navy, marginTop: 12, marginBottom: 16 }}
              >
                $99
              </div>
              <p className="text-[15px] leading-[1.7]" style={{ color: B.muted, marginBottom: 2 }}>
                Three assessments across one year
              </p>
              <p className="text-[14px] font-medium" style={{ color: B.navy, marginBottom: 4 }}>
                $33 per assessment
              </p>
              <p className="text-[13px]" style={{ color: B.light, marginBottom: 24 }}>
                Secure checkout via Stripe
              </p>
              <Link
                href="/checkout-placeholder?plan=monitoring"
                className="inline-flex items-center px-6 py-3 text-[14px] font-medium rounded transition-opacity hover:opacity-90"
                style={{ backgroundColor: B.purple, color: "#ffffff" }}
              >
                Start Monitoring
              </Link>
            </div>
          </div>

          {/* Trust line */}
          <div className="text-center" style={{ marginTop: 24 }}>
            <p className="text-[13px]" style={{ color: B.light }}>
              Secure checkout powered by Stripe
            </p>
            <p className="text-[13px]" style={{ color: B.light }}>
              Encrypted payment processing
            </p>
          </div>
        </section>

        <Divider />

        {/* ============ SECTION 3 — MONITORING TIMELINE ============ */}
        <section style={{ marginTop: 56 }}>
          <h2
            className="text-[22px] font-semibold"
            style={{ color: B.navy, marginBottom: 12 }}
          >
            Income Stability Monitoring
          </h2>
          <p
            className="text-[16px] leading-[1.7]"
            style={{ color: B.muted, marginBottom: 32 }}
          >
            Annual monitoring measures how your income structure evolves across time.
          </p>
          <div
            className="rounded-lg"
            style={{
              border: "1px solid #E5E7EB",
              padding: "20px 24px",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              {[
                ["Assessment 1", "Month 0"],
                ["Assessment 2", "Month 6"],
                ["Assessment 3", "Month 12"],
              ].map(([label, month], i) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-[14px] font-semibold" style={{ color: B.navy }}>{label}</div>
                    <div className="text-[12px]" style={{ color: B.light }}>{month}</div>
                  </div>
                  {i < 2 && <span className="text-lg" style={{ color: B.light }}>&rarr;</span>}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[13px]" style={{ color: B.light, marginTop: 16 }}>
            Each assessment measures the structural stability of income at the time it is issued.
          </p>
        </section>

        <Divider />

        {/* ============ SECTION 4 — WHAT EVERY ASSESSMENT INCLUDES ============ */}
        <section style={{ marginTop: 56 }}>
          <h2
            className="text-[22px] font-semibold"
            style={{ color: B.navy, marginBottom: 16 }}
          >
            What Every Assessment Includes
          </h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              "Income Stability Score™ (0\u2013100)",
              "Stability Classification",
              "Structural Drivers",
              "Structural Constraints",
              "Industry Percentile Comparison",
              "Structural Improvement Path",
              "Official PDF Assessment Record",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-[15px]"
                style={{ color: B.navy }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: B.teal }}
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[14px]" style={{ color: B.light }}>
            Assessments are generated using fixed scoring criteria under Model RP-1.0.
          </p>
        </section>

        <Divider />

        {/* ============ SECTION 5 — ASSESSMENT RECORD STRUCTURE ============ */}
        <section style={{ marginTop: 56 }}>
          <h2
            className="text-[22px] font-semibold"
            style={{ color: B.navy, marginBottom: 12 }}
          >
            Assessment Record Structure
          </h2>
          <p
            className="text-[16px] leading-[1.7]"
            style={{ color: B.muted, marginBottom: 20 }}
          >
            The Income Stability Assessment produces a structured report containing:
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              "Income Stability Score™",
              "Stability Classification",
              "Structural Drivers",
              "Structural Constraints",
              "Industry Percentile Comparison",
              "Structural Improvement Path",
              "Official PDF Assessment Record issued under Model RP-1.0",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-[15px]"
                style={{ color: B.muted }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: B.teal }}
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* ============ SECTION 6 — HOW THE PROCESS WORKS ============ */}
        <section style={{ marginTop: 56 }}>
          <h2
            className="text-[22px] font-semibold"
            style={{ color: B.navy, marginBottom: 24 }}
          >
            How the Process Works
          </h2>
          <ol style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              "Select your assessment option.",
              ["You will be redirected to ", "Stripe Secure Checkout", "."],
              ["After successful payment, you will be redirected to the ", "RunPayway Diagnostic Portal", "."],
              ["Complete the ", "Income Stability Assessment", "."],
              ["Your ", "Income Stability Score™ report", " will be generated and issued as an ", "Official PDF Assessment Record", "."],
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="text-[14px] font-semibold shrink-0"
                  style={{ color: B.navy, minWidth: 20 }}
                >
                  {i + 1}
                </span>
                <p className="text-[16px] leading-[1.7]" style={{ color: B.muted }}>
                  {Array.isArray(item)
                    ? item.map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} style={{ color: B.navy }}>{part}</strong>
                        ) : (
                          <span key={j}>{part}</span>
                        )
                      )
                    : item}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <Divider />

        {/* ============ SECTION 7 — FINAL SELECTION ============ */}
        <section style={{ marginTop: 56 }}>
          <h2
            className="text-[22px] font-semibold text-center"
            style={{ color: B.navy, marginBottom: 12 }}
          >
            Final Selection
          </h2>
          <p
            className="text-[16px] leading-[1.7] text-center"
            style={{ color: B.muted, marginBottom: 32 }}
          >
            Choose how you would like to measure the structural stability of your income system.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link
              href="/checkout-placeholder?plan=single"
              className="flex items-center justify-between rounded-lg px-6 py-4 group hover:border-gray-400 transition-colors"
              style={{ border: "1px solid #E5E7EB", backgroundColor: "#ffffff" }}
            >
              <span className="text-[16px] font-semibold" style={{ color: B.navy }}>
                Single Assessment — $39
              </span>
              <span
                className="text-[14px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: B.teal }}
              >
                Select &rarr;
              </span>
            </Link>
            <Link
              href="/checkout-placeholder?plan=monitoring"
              className="flex items-center justify-between rounded-lg px-6 py-4 group hover:border-opacity-80 transition-colors"
              style={{ border: `1px solid rgba(14, 26, 43, 0.4)`, backgroundColor: "#ffffff" }}
            >
              <span className="text-[16px] font-semibold" style={{ color: B.navy }}>
                Annual Monitoring — $99
              </span>
              <span
                className="text-[14px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: B.navy }}
              >
                Select &rarr;
              </span>
            </Link>
          </div>
        </section>

        <Divider />

        {/* ============ SECTION 8 — METHODOLOGY STATEMENT ============ */}
        <section style={{ marginTop: 56 }}>
          <h2
            className="text-[18px] font-semibold"
            style={{ color: B.navy, marginBottom: 12 }}
          >
            Methodology Statement
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p className="text-[14px] leading-[1.7]" style={{ color: B.muted }}>
              Income Stability assessments are generated using fixed scoring criteria defined under{" "}
              <strong style={{ color: B.navy }}>Model RP-1.0</strong>.
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: B.light }}>
              The Income Stability Score™ is a structural income assessment based on information provided
              by the user. It does not provide financial advice and does not predict future financial
              outcomes. Assessments are issued under Model RP-1.0.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
