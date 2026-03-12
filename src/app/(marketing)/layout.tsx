"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/runpayway-logo.png";

const NAV_LINKS = [
  { href: "/pricing", label: "Score" },
  { href: "/pricing", label: "Pricing" },
  { href: "/methodology", label: "Methodology" },
  { href: "/verify", label: "Registry" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: "#E5E7EB", backgroundColor: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src={logo}
              alt="RunPayway™"
              height={24}
              unoptimized
              style={{ height: 24, width: "auto" }}
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="text-[13px] font-medium hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-[13px] font-medium cursor-default" style={{ color: "#6B7280" }}>
              Sign In
            </span>
            <Link
              href="/pricing"
              className="hidden sm:inline-flex text-[13px] font-medium px-4 py-2 rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#4B3FAE", color: "#ffffff" }}
            >
              Get Score
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-3" style={{ borderColor: "#E5E7EB", backgroundColor: "#ffffff" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-[14px] font-medium py-1.5"
                style={{ color: "#6B7280" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
              className="block text-center text-[13px] font-medium px-4 py-2.5 rounded transition-opacity hover:opacity-90 mt-2"
              style={{ backgroundColor: "#4B3FAE", color: "#ffffff" }}
            >
              Get Score
            </Link>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer — Institutional Platform Infrastructure */}
      <footer
        className="relative overflow-hidden"
        style={{ background: "#0E1A2B" }}
      >
        {/* Faint horizontal rule texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px)`,
            backgroundSize: "100% 80px",
          }}
        />

        <div
          className="relative mx-auto"
          style={{
            maxWidth: 1100,
            paddingTop: 96,
            paddingBottom: 72,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          {/* Primary 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ columnGap: 120 }}>
            {/* Left column — Brand */}
            <div>
              <div
                className="font-semibold"
                style={{
                  fontSize: 22,
                  letterSpacing: "-0.01em",
                  color: "#F4F1EA",
                  marginBottom: 16,
                }}
              >
                RunPayway
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "rgba(244,241,234,0.65)",
                  maxWidth: 260,
                }}
              >
                Income Stability Score™
              </div>
            </div>

            {/* Right column — Navigation + Social + Legal links */}
            <div className="mt-10 md:mt-0">
              {/* Navigation links */}
              <nav aria-label="Footer navigation">
                <ul className="list-none p-0 m-0" style={{ marginBottom: 28 }}>
                  {[
                    { href: "/", label: "Home" },
                    { href: "/methodology", label: "Methodology" },
                    { href: "/verify", label: "Registry" },
                    { href: "/#faq", label: "FAQ" },
                    { href: "#", label: "About" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="block transition-colors duration-160"
                        style={{
                          fontSize: 15,
                          lineHeight: 1.9,
                          color: "rgba(244,241,234,0.82)",
                          minHeight: 44,
                          display: "flex",
                          alignItems: "center",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#F4F1EA"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(244,241,234,0.82)"; }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Social links */}
              <div style={{ marginBottom: 28 }}>
                <div
                  className="font-medium uppercase"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    color: "#1F6D7A",
                    marginBottom: 10,
                  }}
                >
                  Social
                </div>
                <ul className="list-none p-0 m-0">
                  {[
                    { href: "https://linkedin.com/company/runpayway", label: "LinkedIn", ariaLabel: "RunPayway on LinkedIn" },
                    { href: "https://x.com/runpayway", label: "X", ariaLabel: "RunPayway on X" },
                    { href: "https://instagram.com/runpayway", label: "Instagram", ariaLabel: "RunPayway on Instagram" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.ariaLabel}
                        className="block transition-colors duration-160"
                        style={{
                          fontSize: 15,
                          lineHeight: 1.9,
                          color: "rgba(244,241,234,0.82)",
                          minHeight: 44,
                          display: "flex",
                          alignItems: "center",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#F4F1EA"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(244,241,234,0.82)"; }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact + Legal links */}
              <ul className="list-none p-0 m-0">
                {[
                  { href: "#", label: "Contact" },
                  { href: "#", label: "Privacy Policy" },
                  { href: "#", label: "Terms of Use" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block transition-colors duration-160"
                      style={{
                        fontSize: 15,
                        lineHeight: 1.9,
                        color: "rgba(244,241,234,0.82)",
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#F4F1EA"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(244,241,234,0.82)"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              width: "100%",
              background: "rgba(244,241,234,0.12)",
              marginTop: 48,
              marginBottom: 32,
            }}
          />

          {/* Legal block */}
          <div style={{ maxWidth: 520 }}>
            <p className="text-[13px] md:text-[13px]" style={{ color: "rgba(244,241,234,0.60)", lineHeight: 1.7, marginBottom: 6 }}>
              &copy; 2026 RunPayway™. All rights reserved.
            </p>
            <p className="text-[13px] md:text-[13px]" style={{ color: "rgba(244,241,234,0.60)", lineHeight: 1.7, marginBottom: 6 }}>
              RunPayway™ is a product of PeopleStar Enterprises, LLC.
            </p>
            <p className="text-[13px] md:text-[13px]" style={{ color: "rgba(244,241,234,0.60)", lineHeight: 1.7, marginBottom: 6 }}>
              Orange County, California, USA
            </p>
            <p className="text-[13px] md:text-[13px]" style={{ color: "rgba(244,241,234,0.60)", lineHeight: 1.7 }}>
              Structural Stability Model RP-1.0
            </p>
          </div>
        </div>

        {/* Mobile/tablet overrides */}
        <style>{`
          @media (max-width: 768px) {
            footer > div:last-of-type:not(style) {
              padding-top: 72px !important;
              padding-bottom: 56px !important;
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            footer .font-semibold[style*="fontSize: 22"] {
              font-size: 20px !important;
            }
            footer .text-\\[13px\\] {
              font-size: 12px !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            footer > div:last-of-type:not(style) {
              padding-left: 32px !important;
              padding-right: 32px !important;
            }
          }
        `}</style>
      </footer>
    </div>
  );
}
