"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/methodology", label: "Methodology" },
  { href: "/verify", label: "Registry" },
  { href: "#", label: "About" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Header — Institutional Navigation */}
      <header
        className="sticky top-0 z-[1000]"
        style={{
          background: scrolled ? "rgba(255,255,255,0.96)" : "#ffffff",
          borderBottom: "1px solid rgba(14,26,43,0.08)",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
          transition: "background 200ms ease, backdrop-filter 200ms ease",
        }}
      >
        <div
          className="mx-auto flex items-center px-5 md:px-8 lg:px-10"
          style={{
            maxWidth: 1200,
            height: 72,
          }}
        >
          {/* 3-zone grid */}
          <div
            className="grid w-full items-center"
            style={{ gridTemplateColumns: "auto 1fr auto" }}
          >
            {/* Left — Brand */}
            <Link
              href="/"
              className="font-semibold transition-colors duration-150 focus:outline-none focus:ring-2"
              style={{
                fontSize: 20,
                letterSpacing: "-0.01em",
                color: "#0E1A2B",
                // @ts-expect-error focus ring
                "--tw-ring-color": "#1F6D7A",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#4B3FAE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
            >
              RunPayway
            </Link>

            {/* Center — Navigation (hidden on mobile) */}
            <nav className="hidden md:flex justify-center" style={{ gap: 32 }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-160 focus:outline-none focus:ring-2"
                  style={{
                    fontSize: 15,
                    color: "rgba(14,26,43,0.80)",
                    // @ts-expect-error focus ring
                    "--tw-ring-color": "#1F6D7A",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.80)"; }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right — Auth + CTA (hidden on mobile) */}
            <div className="hidden md:flex items-center" style={{ gap: 24 }}>
              <span
                className="cursor-default transition-colors duration-160"
                style={{
                  fontSize: 15,
                  color: "rgba(14,26,43,0.80)",
                }}
              >
                Sign In
              </span>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center font-semibold whitespace-nowrap
                           focus:outline-none focus:ring-2"
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
                  transition: "background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                  // @ts-expect-error focus ring
                  "--tw-ring-color": "#1F6D7A",
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.background = "#3D33A0";
                  t.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.background = "#4B3FAE";
                  t.style.transform = "translateY(0)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Get My Income Stability Score
              </Link>
            </div>

            {/* Mobile — hamburger toggle */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 ml-auto
                         focus:outline-none focus:ring-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                // @ts-expect-error focus ring
                "--tw-ring-color": "#1F6D7A",
              }}
            >
              <span
                className="block w-5 h-[1.5px] rounded transition-all duration-200"
                style={{
                  backgroundColor: "#0E1A2B",
                  transform: menuOpen ? "rotate(45deg) translateY(3px)" : "none",
                }}
              />
              <span
                className="block w-5 h-[1.5px] rounded mt-[5px] transition-all duration-200"
                style={{
                  backgroundColor: "#0E1A2B",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-[1.5px] rounded mt-[5px] transition-all duration-200"
                style={{
                  backgroundColor: "#0E1A2B",
                  transform: menuOpen ? "rotate(-45deg) translateY(-3px)" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div
            className="md:hidden"
            style={{
              background: "#ffffff",
              borderTop: "1px solid rgba(14,26,43,0.08)",
              padding: 24,
            }}
          >
            <nav className="flex flex-col" style={{ gap: 16 }}>
              {[...NAV_LINKS, { href: "#", label: "Sign In" }].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block transition-colors duration-160"
                  style={{
                    fontSize: 15,
                    color: "rgba(14,26,43,0.80)",
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center font-semibold mt-4 w-full"
              style={{
                height: 48,
                borderRadius: 10,
                background: "#4B3FAE",
                color: "#ffffff",
                fontSize: 14,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(75,63,174,0.90)",
                boxShadow: "0 6px 14px rgba(75,63,174,0.20)",
              }}
            >
              Get My Income Stability Score
            </Link>
          </div>
        )}
      </header>

      {/* Mobile header height override */}
      <style>{`
        @media (max-width: 768px) {
          header.sticky > div:first-child {
            height: 64px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          header.sticky > div:first-child {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
        }
      `}</style>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer — Institutional Platform Infrastructure */}
      <footer
        className="relative"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(14,26,43,0.08)",
        }}
      >
        <div
          className="relative mx-auto"
          style={{
            maxWidth: 1200,
            padding: "48px 24px 36px",
          }}
        >
          {/* Tier 1 — Brand */}
          <div style={{ marginBottom: 32 }}>
            <Link
              href="/"
              className="font-semibold transition-colors duration-150 focus:outline-none focus:ring-2"
              style={{
                fontSize: 20,
                letterSpacing: "-0.01em",
                color: "#0E1A2B",
                // @ts-expect-error focus ring
                "--tw-ring-color": "#1F6D7A",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#4B3FAE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
            >
              RunPayway
            </Link>
            <div
              style={{
                fontSize: 14,
                color: "rgba(14,26,43,0.45)",
                marginTop: 4,
              }}
            >
              Income Stability Score™
            </div>
          </div>

          {/* Tier 2 — Primary navigation */}
          <nav aria-label="Footer navigation" style={{ marginBottom: 24 }}>
            <ul
              className="footer-nav-grid list-none p-0 m-0"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, auto)",
                gap: 28,
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              {[
                { href: "/", label: "Home" },
                { href: "/methodology", label: "Methodology" },
                { href: "/verify", label: "Registry" },
                { href: "/pricing", label: "Pricing" },
                { href: "/#faq", label: "FAQ" },
                { href: "#", label: "About" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-160 focus:outline-none focus:ring-2"
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "rgba(14,26,43,0.70)",
                      // @ts-expect-error focus ring
                      "--tw-ring-color": "#1F6D7A",
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

          {/* Tier 3 — Legal nav + Social (secondary weight) */}
          <div
            className="footer-secondary-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            {/* Legal links */}
            <div className="flex items-center" style={{ gap: 24 }}>
              {[
                { href: "#", label: "Contact" },
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Terms of Use" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-160 focus:outline-none focus:ring-2"
                  style={{
                    fontSize: 13,
                    color: "rgba(14,26,43,0.45)",
                    // @ts-expect-error focus ring
                    "--tw-ring-color": "#1F6D7A",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.70)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.45)"; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center" style={{ gap: 18 }}>
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
                  className="transition-colors duration-160 focus:outline-none focus:ring-2"
                  style={{
                    fontSize: 13,
                    color: "rgba(14,26,43,0.45)",
                    // @ts-expect-error focus ring
                    "--tw-ring-color": "#1F6D7A",
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
          <div
            style={{
              height: 1,
              width: "100%",
              background: "rgba(14,26,43,0.06)",
              marginBottom: 24,
            }}
          />

          {/* Tier 4 — Legal block */}
          <div style={{ maxWidth: 520 }}>
            <p className="text-[12px]" style={{ color: "rgba(14,26,43,0.40)", lineHeight: 1.7, marginBottom: 4 }}>
              &copy; 2026 RunPayway™. All rights reserved.
            </p>
            <p className="text-[12px]" style={{ color: "rgba(14,26,43,0.40)", lineHeight: 1.7, marginBottom: 4 }}>
              RunPayway™ is a product of PeopleStar Enterprises, LLC.
            </p>
            <p className="text-[12px]" style={{ color: "rgba(14,26,43,0.40)", lineHeight: 1.7, marginBottom: 4 }}>
              Orange County, California, USA
            </p>
            <p className="text-[12px]" style={{ color: "rgba(14,26,43,0.40)", lineHeight: 1.7 }}>
              Structural Stability Model RP-1.0
            </p>
          </div>
        </div>

        {/* Mobile/tablet overrides */}
        <style>{`
          @media (max-width: 768px) {
            .footer-nav-grid {
              grid-template-columns: repeat(2, auto) !important;
              gap: 14px 28px !important;
            }
            .footer-secondary-row {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 16px !important;
            }
          }
        `}</style>
      </footer>
    </div>
  );
}
