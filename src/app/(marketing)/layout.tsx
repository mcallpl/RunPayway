"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../public/runpayway-logo.png";

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
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sample-report", label: "Sample Report" },
  { href: "/methodology", label: "Methodology" },
  { href: "/verify", label: "Verify a Score" },
  { href: "/about", label: "About" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
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
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
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
              <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: 15,
                      color: "rgba(14,26,43,0.80)",
                      transition: "color 160ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.80)"; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div style={{ display: "flex", alignItems: "center", gap: 24, marginLeft: 32 }}>
                <Link
                  href="/sign-in"
                  style={{
                    fontSize: 15,
                    color: "rgba(14,26,43,0.80)",
                    transition: "color 160ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.80)"; }}
                >
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center font-semibold whitespace-nowrap"
                  style={{
                    height: 40,
                    paddingLeft: 18,
                    paddingRight: 18,
                    borderRadius: 10,
                    background: "#4B3FAE",
                    color: "#ffffff",
                    fontSize: 14,
                    letterSpacing: "-0.01em",
                    border: "1px solid rgba(75,63,174,0.90)",
                    boxShadow: "0 6px 14px rgba(75,63,174,0.20)",
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
                  Get My Income Stability Score™
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
              {[...NAV_LINKS, { href: "/sign-in", label: "Sign In" }].map((link) => (
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
                }}
              >
                Get My Income Stability Score™
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(14,26,43,0.08)",
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 1200,
            padding: mobile ? "36px 20px 28px" : "48px 24px 36px",
          }}
        >
          {/* Brand */}
          <div style={{ marginBottom: mobile ? 24 : 32 }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <Image
                src={logoImg}
                alt="RunPayway"
                width={mobile ? 130 : 160}
                height={mobile ? 15 : 19}
                style={{ height: "auto" }}
              />
            </Link>
            <div style={{ fontSize: 14, color: "rgba(14,26,43,0.45)", marginTop: 4 }}>
              Income Stability Score™
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" style={{ marginBottom: 24 }}>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: mobile ? "repeat(2, auto)" : "repeat(4, auto)",
                gap: mobile ? "14px 28px" : 28,
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              {[
                { href: "/", label: "Home" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/sample-report", label: "Sample Report" },
                { href: "/methodology", label: "Methodology" },
                { href: "/verify", label: "Verify a Score" },
                { href: "/pricing", label: "Pricing" },
                { href: "/faq", label: "FAQ" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "rgba(14,26,43,0.70)",
                      transition: "color 160ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.70)"; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA */}
          <div style={{ marginBottom: 28 }}>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                height: 44,
                paddingLeft: 22,
                paddingRight: 22,
                borderRadius: 10,
                background: "#4B3FAE",
                color: "#ffffff",
                fontSize: 14,
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
            >
              Assess Your Income Structure
            </Link>
          </div>

          {/* Legal + Social */}
          <div
            style={{
              display: "flex",
              flexDirection: mobile ? "column" : "row",
              alignItems: mobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: mobile ? 16 : undefined,
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {[
                { href: "/contact", label: "Contact" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-use", label: "Terms of Use" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: 13,
                    color: "rgba(14,26,43,0.45)",
                    transition: "color 160ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.70)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.45)"; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {[
                { href: "https://linkedin.com/company/runpayway", label: "LinkedIn", ariaLabel: "RunPayway on LinkedIn" },
                { href: "https://x.com/runpayway", label: "X", ariaLabel: "RunPayway on X" },
                { href: "https://instagram.com/runpayway", label: "Instagram", ariaLabel: "RunPayway on Instagram" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  style={{
                    fontSize: 13,
                    color: "rgba(14,26,43,0.45)",
                    transition: "color 160ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.70)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.45)"; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, width: "100%", background: "rgba(14,26,43,0.06)", marginBottom: 28 }} />

          {/* Enterprise waitlist */}
          <div
            style={{
              padding: mobile ? "24px 20px" : "28px 32px",
              borderRadius: 14,
              background: "rgba(75,63,174,0.04)",
              border: "1px solid rgba(75,63,174,0.08)",
              marginBottom: 28,
              maxWidth: 480,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4B3FAE", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
              RunPayway™ for Organizations
            </div>
            <p style={{ fontSize: 14, color: "rgba(14,26,43,0.60)", lineHeight: 1.65, marginBottom: 14 }}>
              Enterprise assessments and team-level income stability analysis.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); }}
              style={{ display: "flex", gap: 8, flexDirection: mobile ? "column" : "row" }}
            >
              <input
                type="email"
                placeholder="Work email"
                aria-label="Work email for enterprise waitlist"
                style={{
                  flex: 1,
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(14,26,43,0.10)",
                  background: "#ffffff",
                  fontSize: 13,
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
                  height: 40,
                  paddingLeft: 18,
                  paddingRight: 18,
                  borderRadius: 8,
                  background: "#4B3FAE",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap" as const,
                  transition: "background 180ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#3D33A0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#4B3FAE"; }}
              >
                Join the Waitlist →
              </button>
            </form>
          </div>

          {/* Divider */}
          <div style={{ height: 1, width: "100%", background: "rgba(14,26,43,0.06)", marginBottom: 24 }} />

          {/* Legal */}
          <div style={{ maxWidth: 520 }}>
            <p style={{ fontSize: 12, color: "rgba(14,26,43,0.40)", lineHeight: 1.7, marginBottom: 4 }}>
              &copy; 2026 RunPayway™. All rights reserved.
            </p>
            <p style={{ fontSize: 12, color: "rgba(14,26,43,0.40)", lineHeight: 1.7, marginBottom: 4 }}>
              RunPayway™ is a product of PeopleStar Enterprises, LLC.
            </p>
            <p style={{ fontSize: 12, color: "rgba(14,26,43,0.40)", lineHeight: 1.7, marginBottom: 4 }}>
              Orange County, California, USA
            </p>
            <p style={{ fontSize: 12, color: "rgba(14,26,43,0.40)", lineHeight: 1.7 }}>
              Structural Stability Model RP-1.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
