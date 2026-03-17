"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../public/runpayway-logo.png";
import CookieConsent from "@/components/CookieConsent";
import { useLanguage } from "@/lib/i18n";
import type { LangCode } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Language selector                                                   */
/* ------------------------------------------------------------------ */

const LANGUAGES = [
  { code: "en" as LangCode, label: "English", flag: "🇺🇸" },
  { code: "es" as LangCode, label: "Español", flag: "🇪🇸" },
  { code: "pt" as LangCode, label: "Português", flag: "🇧🇷" },
];

function LanguageSelector({ mobile }: { mobile: boolean }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  const handleSelect = (code: LangCode) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => !mobile && setOpen(true)}
      onMouseLeave={() => !mobile && setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Language: ${current.label}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 8px",
          borderRadius: 6,
          border: "1px solid rgba(14,26,43,0.08)",
          background: open ? "rgba(14,26,43,0.03)" : "transparent",
          cursor: "pointer",
          fontSize: mobile ? 18 : 16,
          lineHeight: 1,
          transition: "background 160ms ease, border-color 160ms ease",
        }}
      >
        <span role="img" aria-hidden="true">{current.flag}</span>
        <svg
          width="8" height="5" viewBox="0 0 8 5" fill="none"
          style={{
            transition: "transform 200ms ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.4,
          }}
        >
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: -4,
            right: 0,
            paddingTop: 36,
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 10,
              border: "1px solid rgba(14,26,43,0.08)",
              boxShadow: "0 8px 24px rgba(14,26,43,0.10), 0 2px 6px rgba(14,26,43,0.04)",
              padding: "6px 0",
              minWidth: 150,
            }}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "9px 16px",
                  border: "none",
                  background: l.code === lang ? "rgba(75,63,174,0.06)" : "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: l.code === lang ? 600 : 500,
                  color: l.code === lang ? "#4B3FAE" : "rgba(14,26,43,0.70)",
                  transition: "background 120ms ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (l.code !== lang) e.currentTarget.style.background = "rgba(14,26,43,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = l.code === lang ? "rgba(75,63,174,0.06)" : "transparent";
                }}
              >
                <span role="img" aria-hidden="true" style={{ fontSize: 16 }}>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobile = useMobile();
  const { t } = useLanguage();

  const NAV_LINKS = [
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/pricing", label: t.nav.pricing },
  ];

  const MORE_LINKS = [
    { href: "/sample-report", label: t.nav.sampleReport },
    { href: "/methodology", label: t.nav.methodology },
    { href: "/verify", label: t.nav.verifyAScore },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
    { href: "/contact", label: t.nav.contact },
    { href: "#footer", label: t.nav.more },
  ];

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
                    {t.nav.more}
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
                <LanguageSelector mobile={false} />
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
                  {t.nav.signIn}
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
                  <span className="cta-label">{t.nav.getMyScore}</span>
                  <span className="cta-arrow cta-arrow-white" />
                </Link>
              </div>
            </>
          )}

          {/* Mobile: flag + hamburger */}
          {mobile && (
            <LanguageSelector mobile={true} />
          )}
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
              overflowY: "auto",
              color: "#0E1A2B",
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
                <span className="cta-label">{t.nav.getMyScoreFull}</span>
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
              {t.footer.incomeStabilityScore}
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
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>{t.footer.product}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "/", label: t.footer.home },
                  { href: "/how-it-works", label: t.nav.howItWorks },
                  { href: "/sample-report", label: t.nav.sampleReport },
                  { href: "/methodology", label: t.nav.methodology },
                  { href: "/verify", label: t.nav.verifyAScore },
                  { href: "/pricing", label: t.nav.pricing },
                  { href: "/faq", label: t.nav.faq },
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
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>{t.footer.company}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "/about", label: t.nav.about },
                  { href: "/contact", label: t.nav.contact },
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
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>{t.footer.governance}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "/privacy-policy", label: t.footer.privacyPolicy },
                  { href: "/terms-of-use", label: t.footer.termsOfUse },
                  { href: "/accessibility", label: t.footer.accessibility },
                  { href: "/acceptable-use-policy", label: t.footer.acceptableUsePolicy },
                  { href: "/security-practices", label: t.footer.securityPractices },
                  { href: "/model-version-policy", label: t.footer.modelVersionPolicy },
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
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>{t.footer.enterprise}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(14,26,43,0.50)", lineHeight: 1.4 }}>
                  {t.footer.forOrganizations}
                </span>
                <form
                  onSubmit={(e) => { e.preventDefault(); }}
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <input
                    type="email"
                    placeholder={t.footer.workEmail}
                    aria-label={t.footer.workEmail}
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
                    {t.footer.joinWaitlist}
                  </button>
                </form>
              </div>
            </div>

            {/* Social */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>{t.footer.social}</div>
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
            {t.footer.legal}
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner — GDPR compliance */}
      <CookieConsent />
    </div>
  );
}
