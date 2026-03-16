"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../public/runpayway-logo.png";
import CookieConsent from "@/components/CookieConsent";

/* Runtime mobile detection — bypasses CSS entirely */
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

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
];

const MORE_LINKS = [
  { href: "/sample-report", label: "Sample Report" },
  { href: "/methodology", label: "Methodology" },
  { href: "/verify", label: "Verify a Score" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "#footer", label: "More Links" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobile = useMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when switching to desktop
  useEffect(() => {
    if (!mobile) setMenuOpen(false);
  }, [mobile]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Header — Institutional Navigation */}
      <header
        className="sticky top-0"
        style={{
          zIndex: 1000,
          background: scrolled ? "rgba(255,255,255,0.96)" : "#ffffff",
          borderBottom: "1px solid rgba(14,26,43,0.08)",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
          transition: "background 200ms ease, backdrop-filter 200ms ease",
        }}
      >
        <div
          className="mx-auto flex items-center"
          style={{
            maxWidth: 1200,
            height: mobile ? 56 : 72,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <Image
              src={logoImg}
              alt="RunPayway"
              width={mobile ? 130 : 180}
              height={mobile ? 15 : 21}
              priority
              style={{ height: "auto" }}
            />
          </Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Desktop nav + CTA */}
          {!mobile && (
            <>
              <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "rgba(14,26,43,0.65)",
                      transition: "color 160ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.65)"; }}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* More dropdown */}
                <div
                  style={{ position: "relative" }}
                  onMouseEnter={() => setMoreOpen(true)}
                  onMouseLeave={() => setMoreOpen(false)}
                >
                  <button
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: moreOpen ? "#0E1A2B" : "rgba(14,26,43,0.65)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: 0,
                      transition: "color 160ms ease",
                    }}
                  >
                    More
                    <svg
                      width="10" height="6" viewBox="0 0 10 6" fill="none"
                      style={{
                        transition: "transform 200ms ease",
                        transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {moreOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -12,
                        paddingTop: 36,
                        paddingLeft: 12,
                        paddingRight: 12,
                      }}
                    >
                      <div
                        style={{
                          background: "#ffffff",
                          borderRadius: 12,
                          border: "1px solid rgba(14,26,43,0.08)",
                          boxShadow: "0 12px 40px rgba(14,26,43,0.12), 0 2px 8px rgba(14,26,43,0.06)",
                          padding: "8px 0",
                          minWidth: 200,
                        }}
                      >
                        {MORE_LINKS.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMoreOpen(false)}
                            style={{
                              display: "block",
                              padding: "10px 20px",
                              fontSize: 14,
                              fontWeight: 500,
                              color: "rgba(14,26,43,0.70)",
                              transition: "background 120ms ease, color 120ms ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(14,26,43,0.03)";
                              e.currentTarget.style.color = "#0E1A2B";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "rgba(14,26,43,0.70)";
                            }}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </nav>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginLeft: 28 }}>
                <Link
                  href="/sign-in"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(14,26,43,0.65)",
                    transition: "color 160ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.65)"; }}
                >
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  className="cta-tick inline-flex items-center justify-center font-semibold whitespace-nowrap"
                  style={{
                    height: 38,
                    paddingLeft: 18,
                    paddingRight: 18,
                    borderRadius: 9,
                    background: "#4B3FAE",
                    color: "#ffffff",
                    fontSize: 13,
                    letterSpacing: "-0.01em",
                    border: "1px solid rgba(75,63,174,0.90)",
                    boxShadow: "0 4px 12px rgba(75,63,174,0.18)",
                    transition: "background 180ms ease, transform 180ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3D33A0";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#4B3FAE";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span className="tick tick-white" />
                  <span className="cta-label">Get My Score</span>
                  <span className="cta-arrow cta-arrow-white" />
                </Link>
              </div>
            </>
          )}

          {/* Mobile hamburger */}
          {mobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: 44,
                height: 44,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 1.5,
                  borderRadius: 1,
                  backgroundColor: "#0E1A2B",
                  transition: "transform 200ms ease, opacity 200ms ease",
                  transform: menuOpen ? "rotate(45deg) translateY(4.5px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 1.5,
                  borderRadius: 1,
                  backgroundColor: "#0E1A2B",
                  marginTop: 5,
                  transition: "opacity 200ms ease",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 1.5,
                  borderRadius: 1,
                  backgroundColor: "#0E1A2B",
                  marginTop: 5,
                  transition: "transform 200ms ease, opacity 200ms ease",
                  transform: menuOpen ? "rotate(-45deg) translateY(-4.5px)" : "none",
                }}
              />
            </button>
          )}
        </div>

        {/* Mobile menu panel — full screen overlay */}
        {mobile && menuOpen && (
          <div
            style={{
              position: "fixed",
              top: 56,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              zIndex: 999,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[...NAV_LINKS, ...MORE_LINKS, { href: "/sign-in", label: "Sign In" }].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#0E1A2B",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(14,26,43,0.06)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div style={{ marginTop: 28 }}>
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="cta-tick"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 52,
                  borderRadius: 12,
                  background: "#4B3FAE",
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  border: "1px solid rgba(75,63,174,0.90)",
                  boxShadow: "0 6px 14px rgba(75,63,174,0.20)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span className="tick tick-white" />
                <span className="cta-label">Get My Income Stability Score™</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        id="footer"
        style={{
          background: "#FAFAFA",
          borderTop: "1px solid rgba(14,26,43,0.06)",
          scrollMarginTop: 80,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 1200,
            padding: mobile ? "40px 24px 32px" : "64px 48px 40px",
          }}
        >
          {/* Brand */}
          <div style={{ marginBottom: mobile ? 36 : 48, textAlign: "center" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <Image
                src={logoImg}
                alt="RunPayway"
                width={mobile ? 130 : 160}
                height={mobile ? 15 : 19}
                style={{ height: "auto" }}
              />
            </Link>
            <div style={{ fontSize: 13, color: "rgba(14,26,43,0.40)", marginTop: 6 }}>
              Income Stability Score™
            </div>
          </div>

          {/* 5-column nav grid */}
          <nav
            aria-label="Footer navigation"
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
              gap: mobile ? "36px 32px" : "0 48px",
              justifyItems: "center",
              marginBottom: mobile ? 40 : 52,
            }}
          >
            {/* Product */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>Product</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "/", label: "Home" },
                  { href: "/how-it-works", label: "How It Works" },
                  { href: "/sample-report", label: "Sample Report" },
                  { href: "/methodology", label: "Methodology" },
                  { href: "/verify", label: "Verify a Score" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/faq", label: "FAQ" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ fontSize: 13, color: "rgba(14,26,43,0.50)", lineHeight: 1.4, transition: "color 160ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.50)"; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ fontSize: 13, color: "rgba(14,26,43,0.50)", lineHeight: 1.4, transition: "color 160ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.50)"; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Governance */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>Governance</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  { href: "/terms-of-use", label: "Terms of Use" },
                  { href: "/accessibility", label: "Accessibility" },
                  { href: "/acceptable-use-policy", label: "Acceptable Use Policy" },
                  { href: "/security-practices", label: "Security Practices" },
                  { href: "/model-version-policy", label: "Model Version Policy" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ fontSize: 13, color: "rgba(14,26,43,0.50)", lineHeight: 1.4, transition: "color 160ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.50)"; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Enterprise */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>Enterprise</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(14,26,43,0.50)", lineHeight: 1.4 }}>
                  RunPayway™ for Organizations
                </span>
                <form
                  onSubmit={(e) => { e.preventDefault(); }}
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <input
                    type="email"
                    placeholder="Work email"
                    aria-label="Work email for enterprise waitlist"
                    style={{
                      width: "100%",
                      height: mobile ? 40 : 36,
                      padding: "0 12px",
                      borderRadius: 7,
                      border: "1px solid rgba(14,26,43,0.10)",
                      background: "#ffffff",
                      fontSize: 12,
                      color: "#0E1A2B",
                      outline: "none",
                      boxSizing: "border-box" as const,
                      transition: "border-color 180ms ease",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#4B3FAE"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.10)"; }}
                  />
                  <button
                    type="submit"
                    style={{
                      height: mobile ? 40 : 36,
                      borderRadius: 7,
                      background: "#4B3FAE",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "background 180ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#3D33A0"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#4B3FAE"; }}
                  >
                    Join the Waitlist
                  </button>
                </form>
              </div>
            </div>

            {/* Social */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>Social</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "https://linkedin.com/company/runpayway", label: "LinkedIn" },
                  { href: "https://x.com/runpayway", label: "X" },
                  { href: "https://instagram.com/runpayway", label: "Instagram" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: "rgba(14,26,43,0.50)", lineHeight: 1.4, transition: "color 160ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.50)"; }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Divider */}
          <div style={{ height: 1, width: "100%", background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

          {/* Legal strip */}
          <div style={{ fontSize: 11, color: "rgba(14,26,43,0.35)", lineHeight: 1.8, textAlign: "center" }}>
            &copy; 2026 RunPayway™. All rights reserved. RunPayway™ is a product of PeopleStar Enterprises, LLC. Orange County, California, USA. Structural Stability Model RP-1.0
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner — GDPR compliance */}
      <CookieConsent />
    </div>
  );
}
