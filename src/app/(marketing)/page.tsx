"use client";

import { useState } from "react";
import Section2 from "./section2";
import Section3 from "./section3";
import Section4 from "./section4";
import Footer from "./footer";

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
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{ height: "56px", width: "auto" }} />
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
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{ height: "41px", width: "auto" }} />
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
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "0" }}>
                <span style={{ fontSize: "100px", fontWeight: "700", lineHeight: "0.9", letterSpacing: "-0.05em", color: "#0E1A2B", paddingBottom: "4px" }}>72</span>
                <span style={{ fontSize: "32px", fontWeight: "400", color: "#6B7280", lineHeight: "1", paddingBottom: "6px" }}>/100</span>
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

      <Section2 />

      <Section3 />

      <Section4 />
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

      <Footer />
    </div>
  );
}
