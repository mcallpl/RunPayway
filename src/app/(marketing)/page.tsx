"use client";

import { useState } from "react";

// Global styles for WCAG 2.1 AA compliance
const globalStyles = `
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #2F6BFF;
    outline-offset: 4px;
  }
`;

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    style={{
      fontSize: "14px",
      fontWeight: "500",
      color: "#0E1A2B",
      textDecoration: "none",
      lineHeight: "1",
      whiteSpace: "nowrap",
      padding: "8px 4px",
      transition: "color 150ms ease, outline 150ms ease",
      cursor: "pointer",
      outline: "2px solid transparent",
      outlineOffset: "4px",
      borderRadius: "4px"
    }}
    onMouseEnter={(e) => e.currentTarget.style.color = "#2F6BFF"}
    onMouseLeave={(e) => e.currentTarget.style.color = "#0E1A2B"}
    onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
    onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
  >
    {children}
  </a>
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      {/* HEADER - WCAG 2.1 AA COMPLIANT */}
      <header style={{ position: "sticky", top: "0", zIndex: "50", backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", boxShadow: "0px 1px 0px rgba(0,0,0,0.04)", height: "72px", width: "100%", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        {/* Desktop */}
        <div className="hidden lg:flex h-full items-center" style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 48px", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="/RunPayway" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: "0", marginRight: "80px", outline: "2px solid transparent", outlineOffset: "4px", borderRadius: "4px", transition: "outline 150ms ease" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{ height: "48px", width: "auto" }} />
          </a>

          {/* Center Navigation */}
          <nav style={{ display: "flex", gap: "28px", alignItems: "center", flex: "1" }} aria-label="Main navigation">
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#methodology">Methodology</NavLink>
            <NavLink href="#use-cases">Use Cases</NavLink>

            <div style={{ position: "relative" }}>
              <button
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0E1A2B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 4px",
                  transition: "color 150ms ease, outline 150ms ease",
                  outline: "2px solid transparent",
                  outlineOffset: "4px",
                  borderRadius: "4px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#2F6BFF"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#0E1A2B"}
                onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
                onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
                aria-haspopup="menu"
              >
                Solutions
                <span style={{ fontSize: "11px" }}>▼</span>
              </button>
            </div>

            <NavLink href="/plans">Plans</NavLink>
            <NavLink href="#learn">Learn</NavLink>
            <NavLink href="#about">About</NavLink>
          </nav>

          {/* Right Side */}
          <div style={{ display: "flex", gap: "28px", alignItems: "center", marginLeft: "auto" }}>
            <NavLink href="#sign-in">Sign In</NavLink>
            <button
              style={{
                height: "40px",
                padding: "0 24px",
                background: "linear-gradient(135deg, #0E1A2B 0%, #0A2540 100%)",
                color: "#FFFFFF",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                boxShadow: "0px 6px 14px rgba(14, 26, 43, 0.18)",
                transition: "all 150ms ease",
                outline: "2px solid transparent",
                outlineOffset: "4px"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0px 14px 32px rgba(10, 37, 64, 0.32)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 6px 14px rgba(14, 26, 43, 0.18)"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 6px 14px rgba(10, 37, 64, 0.2)"; }}
              onFocus={(e) => e.currentTarget.style.outline = "2px solid #FFFFFF"}
              onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
              aria-label="Start income verification"
            >
              Start Verification
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex h-full items-center justify-between" style={{ padding: "0 24px" }}>
          <a href="/RunPayway" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{ height: "35px", width: "auto" }} />
          </a>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "8px",
              outline: "2px solid transparent",
              outlineOffset: "4px",
              borderRadius: "4px",
              transition: "outline 150ms ease"
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
            onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO - WCAG 2.1 AA COMPLIANT */}
      <section style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        {/* Desktop */}
        <div className="hidden lg:block" style={{ padding: "96px 48px 88px", maxWidth: "1440px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "58% 42%", gap: "88px", alignItems: "flex-start" }}>
            {/* LEFT COLUMN */}
            <div style={{ maxWidth: "700px" }}>
              {/* Eyebrow */}
              <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#2F6BFF", marginBottom: "44px", fontFamily: "Inter" }}>
                STRUCTURAL STABILITY MODEL RP-2.0
              </div>

              {/* H1 */}
              <h1 style={{ fontSize: "56px", fontWeight: "700", lineHeight: "1.0", letterSpacing: "-0.045em", color: "#0E1A2B", marginBottom: "32px", maxWidth: "680px", fontFamily: "Inter", textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>
                Major financial decisions require income verification.
              </h1>

              {/* Body */}
              <p style={{ fontSize: "18px", fontWeight: "400", lineHeight: "1.55", color: "#0E1A2B", marginBottom: "24px", fontFamily: "Inter" }}>
                <span style={{ fontWeight: "700", color: "#2F6BFF" }}>RunPayway™</span> defines whether income stability holds before commitment.
              </p>

              {/* Support - WCAG compliant color (#4B5563 has 7.2:1 contrast) */}
              <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#4B5563", marginBottom: "56px", fontFamily: "Inter" }}>
                Without verification, income risk remains undefined.
              </p>

              {/* CTA */}
              <button
                style={{
                  width: "280px",
                  height: "56px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #0E1A2B 0%, #0A2540 100%)",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "600",
                  padding: "0 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "44px",
                  fontFamily: "Inter",
                  boxShadow: "0px 10px 24px rgba(10, 37, 64, 0.28)",
                  transition: "all 150ms ease",
                  outline: "2px solid transparent",
                  outlineOffset: "4px"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0px 14px 32px rgba(10, 37, 64, 0.32)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 10px 24px rgba(10, 37, 64, 0.28)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 6px 14px rgba(10, 37, 64, 0.2)"; }}
                onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
                onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
                aria-label="Start income verification"
              >
                Start Verification
                <span aria-hidden="true">→</span>
              </button>

              {/* Micro text */}
              <div style={{ fontFamily: "Inter" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#0E1A2B", marginBottom: "10px" }}>
                  Before financial commitment
                </div>
                <div style={{ fontSize: "14px", color: "#4B5563", lineHeight: "1.5" }}>
                  Answer 6 inputs
                  <span style={{ color: "#D1D5DB", padding: "0 8px" }}>•</span>
                  Immediate result
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Score Card */}
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <div style={{ width: "520px", minHeight: "520px", backgroundColor: "#FFFFFF", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "14px", padding: "48px", boxShadow: "0px 24px 50px rgba(16, 24, 40, 0.08), inset 0px 1px 0px rgba(255,255,255,0.6)", fontFamily: "Inter", display: "flex", flexDirection: "column", transform: "scale(1.02)" }}>
                {/* Score Title */}
                <div style={{ fontSize: "18px", fontWeight: "600", color: "#0E1A2B", marginBottom: "28px" }}>
                  Income Stability Score™
                </div>

                {/* Score Number Row */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "0" }}>
                  <span style={{ fontSize: "130px", fontWeight: "700", lineHeight: "0.85", letterSpacing: "-0.05em", color: "#0E1A2B" }}>72</span>
                  <span style={{ fontSize: "44px", fontWeight: "400", color: "#6B7280", lineHeight: "0.9" }}>/100</span>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: "#E5E7EB", margin: "36px 0 36px 0" }}></div>

                {/* Band */}
                <div style={{ fontSize: "30px", fontWeight: "700", color: "#2F6BFF", marginBottom: "14px" }}>
                  Established Stability
                </div>

                {/* Description - WCAG compliant color */}
                <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4B5563", margin: "0 0 44px 0" }}>
                  Determines whether income holds under disruption.
                </p>

                {/* Progress Track */}
                <div style={{ position: "relative", width: "100%", height: "8px", backgroundColor: "#D1D5DB", borderRadius: "999px", marginBottom: "24px" }}>
                  {/* Progress Fill */}
                  <div style={{ position: "absolute", left: "0", top: "0", width: "38%", height: "8px", background: "linear-gradient(90deg, #2F6BFF 0%, #1D4ED8 100%)", borderRadius: "999px", boxShadow: "0px 0px 8px rgba(47, 107, 255, 0.25)" }}></div>
                  {/* Progress Knob */}
                  <div style={{ position: "absolute", left: "38%", top: "50%", width: "24px", height: "24px", backgroundColor: "#2F6BFF", border: "4px solid #FFFFFF", borderRadius: "999px", transform: "translate(-50%, -50%)" }}></div>
                </div>

                {/* Progress Labels - WCAG compliant color */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", fontSize: "14px", color: "#4B5563", marginBottom: "48px" }}>
                  <span style={{ color: "#2F6BFF", fontWeight: "600" }}>Protected</span>
                  <span style={{ textAlign: "center" }}>Recurring</span>
                  <span style={{ textAlign: "right" }}>At Risk</span>
                </div>

                {/* Footer - WCAG compliant color */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "28px", display: "flex", alignItems: "center", gap: "28px", fontSize: "14px", color: "#4B5563", marginTop: "auto" }}>
                  <span style={{ fontWeight: "500" }}>Model RP-2.0</span>
                  <div style={{ width: "1px", height: "18px", backgroundColor: "#E5E7EB" }}></div>
                  <span>Same inputs produce same result</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden" style={{ padding: "64px 20px" }}>
          <div style={{ maxWidth: "1320px", marginLeft: "auto", marginRight: "auto", fontFamily: "Inter" }}>
            {/* Eyebrow */}
            <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", color: "#2F6BFF", marginBottom: "32px" }}>
              STRUCTURAL STABILITY MODEL RP-2.0
            </div>

            {/* H1 Mobile */}
            <h1 style={{ fontSize: "42px", fontWeight: "700", lineHeight: "1.05", letterSpacing: "-0.03em", color: "#0E1A2B", marginBottom: "28px", textRendering: "optimizeLegibility", WebkitFontSmoothing: "antialiased" }}>
              Major financial decisions require income verification.
            </h1>

            {/* Body Mobile */}
            <p style={{ fontSize: "18px", fontWeight: "400", lineHeight: "1.4", color: "#0E1A2B", marginBottom: "16px" }}>
              <span style={{ fontWeight: "700", color: "#2F6BFF" }}>RunPayway™</span> defines whether income stability holds before commitment.
            </p>

            {/* Support Mobile - WCAG compliant color */}
            <p style={{ fontSize: "16px", lineHeight: "1.55", color: "#4B5563", marginBottom: "32px" }}>
              Without verification, income risk remains undefined.
            </p>

            {/* CTA Mobile */}
            <button
              style={{
                width: "100%",
                height: "64px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0E1A2B 0%, #0A2540 100%)",
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "none",
                cursor: "pointer",
                marginBottom: "28px",
                boxShadow: "0px 10px 24px rgba(10, 37, 64, 0.28)",
                transition: "all 150ms ease",
                outline: "2px solid transparent",
                outlineOffset: "4px"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0px 14px 32px rgba(10, 37, 64, 0.32)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 10px 24px rgba(10, 37, 64, 0.28)"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 6px 14px rgba(10, 37, 64, 0.2)"; }}
              onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
              onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
              aria-label="Start income verification"
            >
              Start Verification
              <span aria-hidden="true">→</span>
            </button>

            {/* Micro Mobile */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#0E1A2B", marginBottom: "8px" }}>
                Before financial commitment
              </div>
              <div style={{ fontSize: "15px", color: "#4B5563" }}>
                Answer 6 inputs · Immediate result
              </div>
            </div>

            {/* Score Card Mobile */}
            <div style={{ width: "100%", minHeight: "420px", backgroundColor: "#FFFFFF", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "14px", padding: "32px", boxShadow: "0px 24px 50px rgba(16, 24, 40, 0.08), inset 0px 1px 0px rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", transform: "scale(1.02)" }}>
              {/* Score Title */}
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#0E1A2B", marginBottom: "20px" }}>
                Income Stability Score™
              </div>

              {/* Score Number */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "0" }}>
                <span style={{ fontSize: "100px", fontWeight: "700", lineHeight: "0.85", letterSpacing: "-0.05em", color: "#0E1A2B" }}>72</span>
                <span style={{ fontSize: "32px", fontWeight: "400", color: "#6B7280" }}>/100</span>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "#E5E7EB", margin: "28px 0 28px 0" }}></div>

              {/* Band */}
              <div style={{ fontSize: "26px", fontWeight: "700", color: "#2F6BFF", marginBottom: "12px" }}>
                Established Stability
              </div>

              {/* Description - WCAG compliant color */}
              <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#4B5563", marginBottom: "24px", margin: "0 0 24px 0" }}>
                Determines whether income holds under disruption.
              </p>

              {/* Progress Track */}
              <div style={{ position: "relative", width: "100%", height: "8px", backgroundColor: "#D1D5DB", borderRadius: "999px", marginBottom: "20px" }}>
                <div style={{ position: "absolute", left: "0", top: "0", width: "38%", height: "8px", backgroundColor: "#2F6BFF", borderRadius: "999px" }}></div>
                <div style={{ position: "absolute", left: "38%", top: "50%", width: "20px", height: "20px", backgroundColor: "#2F6BFF", border: "3px solid #FFFFFF", borderRadius: "999px", transform: "translate(-50%, -50%)" }}></div>
              </div>

              {/* Progress Labels - WCAG compliant color */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", fontSize: "13px", color: "#4B5563", marginBottom: "24px" }}>
                <span style={{ color: "#2F6BFF", fontWeight: "600" }}>Protected</span>
                <span style={{ textAlign: "center" }}>Recurring</span>
                <span style={{ textAlign: "right" }}>At Risk</span>
              </div>

              {/* Footer - WCAG compliant color */}
              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "20px", fontSize: "13px", color: "#4B5563", marginTop: "auto" }}>
                <span>Model RP-2.0 · Same inputs produce same result</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP - WCAG 2.1 AA COMPLIANT - CENTERED */}
      <section style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "80px 48px", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          {/* Divider Above Arrow */}
          <div style={{ width: "120px", height: "1px", backgroundColor: "#E5E7EB", margin: "0 auto 16px" }}></div>

          {/* Arrow */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2.5" style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>

          {/* Headline */}
          <p style={{ fontSize: "18px", lineHeight: "1.5", fontWeight: "700", color: "#0E1A2B", textAlign: "center", margin: "0 0 64px 0", fontFamily: "Inter", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
            Trusted by organizations and professionals for verified income stability.
          </p>

          {/* Trust Row - Horizontal Layout - Centered */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "48px", width: "100%" }}>
          {/* Item 1 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", padding: "0 16px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: "0" }} aria-hidden="true">
              <path d="M12 2L5 5v7c0 6 7 9 7 9s7-3 7-9V5l-7-3z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <p style={{ fontSize: "15px", fontWeight: "500", color: "#4B5563", margin: "0", fontFamily: "Inter", lineHeight: "1.6", maxWidth: "140px" }}>
              Independent verification
            </p>
          </div>

          {/* Item 2 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", padding: "0 16px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: "0" }} aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
            <p style={{ fontSize: "15px", fontWeight: "500", color: "#4B5563", margin: "0", fontFamily: "Inter", lineHeight: "1.6", maxWidth: "140px" }}>
              No documents required
            </p>
          </div>

          {/* Item 3 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", padding: "0 16px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: "0" }} aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <p style={{ fontSize: "15px", fontWeight: "500", color: "#4B5563", margin: "0", fontFamily: "Inter", lineHeight: "1.6", maxWidth: "140px" }}>
              Instant results
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 2: CONSEQUENCE */}
      <section className="bg-[#F8F6F1]" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[36px] font-semibold text-[#0E1A2B] mb-10">Decisions made without structural verification fail under stress.</h2>
          <div className="grid grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-[12px] border border-[#D9D6CF]" style={{ boxShadow: "0 4px 16px rgba(14,26,43,0.08)" }}>
              <p className="text-15 font-semibold text-[#0E1A2B] leading-relaxed m-0">You are approved → then denied during final underwriting</p>
            </div>
            <div className="bg-white p-6 rounded-[12px] border border-[#D9D6CF]" style={{ boxShadow: "0 4px 16px rgba(14,26,43,0.08)" }}>
              <p className="text-15 font-semibold text-[#0E1A2B] leading-relaxed m-0">Income appears strong → but fails under disruption</p>
            </div>
            <div className="bg-white p-6 rounded-[12px] border border-[#D9D6CF]" style={{ boxShadow: "0 4px 16px rgba(14,26,43,0.08)" }}>
              <p className="text-15 font-semibold text-[#0E1A2B] leading-relaxed m-0">You commit → then discover instability too late</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT THE MODEL EVALUATES */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">What the model evaluates</h2>
          <p className="text-[16px] text-[#4B5563] mb-12">A fixed set of inputs determines the result.</p>
          <div className="grid grid-cols-3 gap-10 mb-8">
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Concentration</h3>
              <p className="text-[14px] text-[#4B5563]">Reliance on primary income</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Source Diversity</h3>
              <p className="text-[14px] text-[#4B5563]">Distribution across sources</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Forward Visibility</h3>
              <p className="text-[14px] text-[#4B5563]">Income already secured</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Stability Pattern</h3>
              <p className="text-[14px] text-[#4B5563]">Consistency over time</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Continuity</h3>
              <p className="text-[14px] text-[#4B5563]">Income without activity</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Dependency</h3>
              <p className="text-[14px] text-[#4B5563]">Dependence on effort</p>
            </div>
          </div>
          <div className="bg-[#F3F4F6] rounded-[12px] p-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-[#0275D8] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-[13px] text-[#4B5563] m-0"><span className="font-semibold text-[#0E1A2B]">Model RP-2.0</span> · Fixed rules · Same inputs produce same result</p>
          </div>
        </div>
      </section>

      {/* SAME INCOME, DIFFERENT OUTCOME */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">Same income. Different outcome.</h2>
          <p className="text-[16px] text-[#4B5563] mb-12">Income level does not determine stability. Structure does.</p>

          <div className="mb-8">
            <div className="bg-[#F9F5F0] rounded-[8px] px-6 py-3 inline-flex items-center gap-3 mb-12">
              <span className="text-[20px]">💵</span>
              <span className="text-[14px] font-semibold text-[#0E1A2B]">Both examples: $150K annual income</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 items-start mb-12">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <div className="text-[12px] font-semibold text-[#C62828] mb-4 tracking-widest">1 INCOME SOURCE</div>
              <div className="text-[72px] font-bold text-[#C62828] mb-2" style={{ lineHeight: "1" }}>31</div>
              <div className="text-[18px] font-bold text-[#C62828] mb-8">Limited Stability</div>
              <div className="border-b border-[#E5E7EB] pb-6 mb-6">
                <p className="text-[14px] text-[#4B5563] m-0">Income depends on <span className="font-semibold">one source.</span></p>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <div className="text-[12px] font-semibold text-[#2E7D32] mb-4 tracking-widest">MULTIPLE INCOME SOURCES</div>
              <div className="text-[72px] font-bold text-[#2E7D32] mb-2" style={{ lineHeight: "1" }}>74</div>
              <div className="text-[18px] font-bold text-[#2E7D32] mb-8">Established Stability</div>
              <div className="border-b border-[#E5E7EB] pb-6 mb-6">
                <p className="text-[14px] text-[#4B5563] m-0">Income is <span className="font-semibold">distributed.</span></p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12">
            <svg className="w-6 h-6 text-[#0275D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <p className="text-center text-[16px] text-[#4B5563] mb-8">Structure determines outcome</p>
        </div>
      </section>

      {/* YOUR CURRENT RESULT IS INCOMPLETE */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">Your current result is incomplete.</h2>
          <p className="text-[16px] text-[#4B5563] mb-12">Full verification defines your income stability.</p>

          <div className="grid grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <div className="text-[12px] font-semibold text-[#4B5563] uppercase mb-6">Initial Output</div>
              <h3 className="text-[32px] font-bold text-[#0E1A2B] mb-8">FREE</h3>

              <div className="space-y-6">
                <div className="flex gap-4 items-start pb-6 border-b border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#4B5563]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Stability classification</p>
                    <p className="text-[13px] text-[#4B5563] m-0 mt-1">Your current stability class (band)</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start pb-6 border-b border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#4B5563]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Primary structural constraint</p>
                    <p className="text-[13px] text-[#4B5563] m-0 mt-1">The main factor limiting your stability</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#4B5563]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Not sufficient for full decision verification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border-2 border-[#0275D8] p-10">
              <div className="text-[12px] font-semibold text-[#0275D8] uppercase mb-6">Full Verification</div>
              <h3 className="text-[42px] font-bold text-[#0275D8] mb-8">$69</h3>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F4F7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.718a3.066 3.066 0 01-3.062 3.062H9.391A3.066 3.066 0 016.329 19.5V9.517a3.066 3.066 0 012.938-3.062zm7.381 5.930a1 1 0 00-1.414-1.414L9 12.586 7.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Income Stability Score™</p>
                    <p className="text-[13px] text-[#4B5563] m-0 mt-1">Your overall stability score on a 0–100 scale</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F4F7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7.5 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Full structural breakdown</p>
                    <p className="text-[13px] text-[#4B5563] m-0 mt-1">Complete view across all 6 structural inputs</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F4F7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Decision definition</p>
                    <p className="text-[13px] text-[#4B5563] m-0 mt-1">What to change, how it impacts your score</p>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-[#0E1A2B] text-white py-3 rounded-[8px] text-[16px] font-semibold mb-6 flex items-center justify-center gap-2 transition-all duration-150"
                style={{
                  outline: "2px solid transparent",
                  outlineOffset: "4px"
                }}
                onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
                onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0px)"}
                aria-label="Complete income verification for $69"
              >
                Complete Verification
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM INTEGRITY */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">System integrity</h2>
          <p className="text-[18px] font-semibold text-[#0275D8] mb-12">Fixed rules. Consistent results.</p>

          <div className="grid grid-cols-2 gap-12">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <h3 className="text-[24px] font-bold text-[#0E1A2B] mb-8 pb-6 border-b border-[#E5E7EB]">Model</h3>
              <div className="space-y-6">
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Fixed rules applied</h4>
                  <p className="text-[14px] text-[#4B5563] m-0">Rules are locked for all results.</p>
                </div>
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">No discretion</h4>
                  <p className="text-[14px] text-[#4B5563] m-0">Rules are identical for all users.</p>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Same inputs produce same result</h4>
                  <p className="text-[14px] text-[#4B5563] m-0">Consistency is guaranteed.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <h3 className="text-[24px] font-bold text-[#0E1A2B] mb-8 pb-6 border-b border-[#E5E7EB]">Record</h3>
              <div className="space-y-6">
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Timestamped result</h4>
                  <p className="text-[14px] text-[#4B5563] m-0">Every result is timestamped to the second.</p>
                </div>
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Permanent record ID</h4>
                  <p className="text-[14px] text-[#4B5563] m-0">Unique ID assigned for permanent retrieval.</p>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Results are not modified</h4>
                  <p className="text-[14px] text-[#4B5563] m-0">Prior results never modified or deleted.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#F3F4F6] rounded-[12px] p-6 flex items-center gap-4">
            <span className="text-[18px]">✓</span>
            <p className="text-[13px] text-[#4B5563] m-0">
              <span className="font-semibold text-[#0E1A2B]">Model RP-2.0</span> ·
              <span className="mx-2">Version locked</span> ·
              <span className="font-semibold text-[#0275D8]">Same inputs produce same result</span>
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#F3F4F6]" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">Check how your income is structured before you move forward.</h2>
          <p className="text-[16px] text-[#4B5563] mb-8">Takes less than a minute · No documents required · Instant result</p>
          <button
            className="bg-[#0E1A2B] text-white px-8 py-3 rounded-[8px] text-[16px] font-semibold mb-6 inline-flex items-center gap-2 transition-all duration-150"
            style={{
              outline: "2px solid transparent",
              outlineOffset: "4px"
            }}
            onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
            onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0px)"}
            aria-label="Start income verification"
          >
            Start Verification
            <span aria-hidden="true">→</span>
          </button>

          <div className="mt-10 flex justify-center gap-8 text-[14px]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.718a3.066 3.066 0 01-3.062 3.062H9.391A3.066 3.066 0 016.329 19.5V9.517a3.066 3.066 0 012.938-3.062zm7.381 5.93a1 1 0 00-1.414-1.414L9 12.586 7.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[#4B5563]">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[#4B5563]">Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
              </svg>
              <span className="text-[#4B5563]">Immediate result</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white" style={{ paddingTop: "80px" }}>
        {/* TOP CTA */}
        <div style={{ padding: "0 40px 64px", borderBottom: "1px solid #E5E7EB" }}>
          <div className="max-w-[800px] mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
              </svg>
              <span className="text-[12px] font-semibold text-[#0275D8] tracking-widest">METHODOLOGY</span>
            </div>
            <p className="text-[16px] text-[#4B5563] mb-6">Structural Stability Model RP-2.0. Fixed methodology. Version-locked. Auditable results.</p>
            <hr className="border-[#E5E7EB] mb-6" />
          </div>
        </div>

        {/* THREE COLUMN INFO */}
        <div style={{ padding: "64px 40px" }} className="hidden md:block border-b border-[#E5E7EB]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <h3 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest">DEVELOPER</h3>
              </div>
              <p className="text-[14px] text-[#4B5563]">PeopleStar Enterprises, LLC.<br/>Orange County, California, USA.</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.718a3.066 3.066 0 01-3.062 3.062H9.391A3.066 3.066 0 016.329 19.5V9.517a3.066 3.066 0 012.938-3.062zm7.381 5.93a1 1 0 00-1.414-1.414L9 12.586 7.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest">COMPLIANCE</h3>
              </div>
              <p className="text-[14px] text-[#4B5563]">Designed for financial decision support. FCRA-aligned. GDPR/CCPA compatible.</p>
            </div>

            <div>
              <h3 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">STAY INFORMED</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[6px] text-[14px]"
                  aria-label="Email address for newsletter signup"
                />
                <button
                  className="bg-[#0275D8] text-white px-4 py-2.5 rounded-[6px] transition-all duration-150"
                  style={{ outline: "2px solid transparent", outlineOffset: "4px" }}
                  onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
                  onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
                  aria-label="Subscribe to newsletter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER NAV - DESKTOP */}
        <div style={{ padding: "64px 40px" }} className="hidden md:block border-b border-[#E5E7EB]">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-5 gap-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[#0E1A2B] font-bold text-[18px]">RUNPAYWAY</span>
                  <span className="w-3 h-2 bg-[#0275D8]" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}></span>
                </div>
                <p className="text-[13px] text-[#4B5563]">Income Stability Score™<br/>Income Structure Verification Standard</p>
                <p className="text-[13px] text-[#4B5563] mt-4">Independent income verification based on fixed rules and structural analysis.</p>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">PRODUCT</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>How It Works</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Pricing</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Sample Report</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Methodology</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>For Advisors</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>For Organizations</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Industries</a>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">COMPANY</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>About</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Blog</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>FAQ</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>What's New</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Contact</a>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">RESOURCES</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Documentation</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Methodology</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Use Cases</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Security</a>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">LEGAL</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Privacy Policy</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Terms of Use</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Accessibility</a>
                  <a href="#" className="text-[14px] text-[#4B5563] block hover:text-[#0E1A2B] transition-colors duration-150" style={{ outline: "2px solid transparent", outlineOffset: "4px" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>Security Practices</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER MOBILE */}
        <div style={{ padding: "40px 24px" }} className="md:hidden">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-[#0E1A2B] font-bold text-[16px]">RUNPAYWAY</span>
            <span className="w-2 h-1.5 bg-[#0275D8]" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}></span>
          </div>
          <p className="text-[12px] text-[#4B5563] mb-8">Income Stability Score™<br/>Income Structure Verification Standard</p>

          <div className="space-y-6 border-t border-[#E5E7EB] pt-6">
            <div>
              <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-3">PRODUCT</h4>
              <div className="space-y-2">
                <a href="#" className="text-[13px] text-[#4B5563] block">How It Works</a>
                <a href="#" className="text-[13px] text-[#4B5563] block">Pricing</a>
                <a href="#" className="text-[13px] text-[#4B5563] block">Methodology</a>
                <a href="#" className="text-[13px] text-[#4B5563] block">For Advisors</a>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-3">COMPANY</h4>
              <div className="space-y-2">
                <a href="#" className="text-[13px] text-[#4B5563] block">About</a>
                <a href="#" className="text-[13px] text-[#4B5563] block">Blog</a>
                <a href="#" className="text-[13px] text-[#4B5563] block">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-3">LEGAL</h4>
              <div className="space-y-2">
                <a href="#" className="text-[13px] text-[#4B5563] block">Privacy Policy</a>
                <a href="#" className="text-[13px] text-[#4B5563] block">Terms of Use</a>
                <a href="#" className="text-[13px] text-[#4B5563] block">Accessibility</a>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-6">
              <label className="text-[12px] font-semibold text-[#0E1A2B] block mb-2">Stay informed</label>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="flex-1 px-3 py-2 bg-white border border-[#E5E7EB] rounded-[6px] text-[12px]" />
                <button className="bg-[#0275D8] text-white px-3 py-2 rounded-[6px]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div style={{ padding: "24px 40px", backgroundColor: "#F9FAFB", borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
          <p className="text-[12px] text-[#4B5563] m-0">© 2026 RunPayway™. All rights reserved. · RunPayway™ is a product of PeopleStar Enterprises, LLC. · Orange County, California, USA. · Structural Stability Model RP-2.0.</p>
        </div>
      </footer>
    </div>
  );
}
