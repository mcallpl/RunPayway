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

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "#E5E7EB", backgroundColor: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Links + Social */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-8">
            {/* Navigation links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2.5">
              {[
                { href: "/pricing", label: "Income Stability Score™" },
                { href: "#", label: "Sample Report" },
                { href: "/pricing", label: "Pricing" },
                { href: "#", label: "Model Governance" },
                { href: "/methodology", label: "Methodology" },
                { href: "#", label: "About" },
                { href: "#", label: "Contact" },
                { href: "#", label: "Terms" },
                { href: "#", label: "Privacy" },
                { href: "#", label: "Disclaimer" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] hover:opacity-70 transition-opacity"
                  style={{ color: link.href === "#" ? "#9CA3AF" : "#6B7280" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social icons — far right */}
            <div className="flex items-start gap-5 shrink-0">
              <a href="https://linkedin.com/company/runpayway" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://x.com/runpayway" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: "#E5E7EB" }}>
            {/* Attribution */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px]" style={{ color: "#9CA3AF" }}>
                &copy; 2026 RunPayway™. All rights reserved.
              </span>
              <span className="text-[11px]" style={{ color: "#9CA3AF" }}>
                RunPayway™ is a product of PeopleStar Enterprises, LLC.
              </span>
              <span className="text-[11px]" style={{ color: "#9CA3AF" }}>
                Orange County, California, USA
              </span>
              <span className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
                Structural Stability Model RP-1.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
