"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../public/runpayway-logo-blue.png";
import CookieConsent from "@/components/CookieConsent";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/lib/i18n";
import { WORKER_URL } from "@/lib/config";
import type { LangCode } from "@/lib/i18n";
import { trackPageView } from "@/lib/analytics";
import { C } from "@/lib/design-tokens";
import EmailCapture from "@/components/EmailCapture";

/* ------------------------------------------------------------------ */
/*  Global animation styles (injected once)                             */
/* ------------------------------------------------------------------ */

const HEADER_STYLES = `
@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes dropdownOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-6px) scale(0.97); }
}
@keyframes mobileSlideIn {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes mobileFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.header-nav-link {
  position: relative;
}
.header-nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 1.5px;
  background: #4B3FAE;
  border-radius: 1px;
  transition: width 280ms cubic-bezier(0.22, 1, 0.36, 1), left 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.header-nav-link:hover::after {
  width: 100%;
  left: 0;
}
.dropdown-panel {
  transform-origin: top center;
}
.dropdown-panel[data-state="entering"],
.dropdown-panel[data-state="open"] {
  animation: dropdownIn 240ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.dropdown-panel[data-state="exiting"] {
  animation: dropdownOut 180ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
.dropdown-item {
  transition: background 200ms cubic-bezier(0.22, 1, 0.36, 1), color 200ms cubic-bezier(0.22, 1, 0.36, 1), padding-left 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.dropdown-item:hover {
  background: rgba(75, 63, 174, 0.04);
  color: #0E1A2B;
  padding-left: 24px;
}
.mobile-overlay {
  animation: mobileSlideIn 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.mobile-nav-item {
  animation: mobileFadeIn 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
`;

/* ------------------------------------------------------------------ */
/*  Animated dropdown hook                                              */
/* ------------------------------------------------------------------ */

function useAnimatedDropdown(delay = 120) {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<"closed" | "entering" | "open" | "exiting">("closed");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (state === "open" || state === "entering") return;
    setVisible(true);
    setState("entering");
    openTimer.current = setTimeout(() => setState("open"), 240);
  }, [state]);

  const close = useCallback(() => {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
    if (state === "closed" || state === "exiting") return;
    setState("exiting");
    closeTimer.current = setTimeout(() => { setVisible(false); setState("closed"); }, 180);
  }, [state]);

  const toggle = useCallback(() => {
    if (state === "open" || state === "entering") close();
    else open();
  }, [state, open, close]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (openTimer.current) clearTimeout(openTimer.current);
    };
  }, []);

  return { visible, state, open, close, toggle };
}

/* ------------------------------------------------------------------ */
/*  Language selector                                                   */
/* ------------------------------------------------------------------ */

const LANGUAGES = [
  { code: "en" as LangCode, label: "English", flag: "🇺🇸" },
];

function LanguageSelector({ mobile }: { mobile: boolean }) {
  const { lang, setLang } = useLanguage();
  const dropdown = useAnimatedDropdown();

  const current = LANGUAGES.find((l) => l.code === lang)!;

  const handleSelect = (code: LangCode) => {
    const language = LANGUAGES.find((l) => l.code === code);
    if (language && (language as { disabled?: boolean }).disabled) return;
    setLang(code);
    dropdown.close();
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => !mobile && dropdown.open()}
      onMouseLeave={() => !mobile && dropdown.close()}
    >
      <button
        onClick={() => dropdown.toggle()}
        aria-label={`Language: ${current.label}`}
        aria-expanded={dropdown.visible}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "8px 12px",
          minHeight: 44,
          borderRadius: 8,
          border: "1px solid rgba(14,26,43,0.08)",
          background: dropdown.visible ? "rgba(14,26,43,0.03)" : "transparent",
          cursor: "pointer",
          fontSize: mobile ? 18 : 16,
          lineHeight: 1,
          transition: "background 240ms cubic-bezier(0.22, 1, 0.36, 1), border-color 240ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: dropdown.visible ? "0 0 0 3px rgba(75,63,174,0.08)" : "0 0 0 0px transparent",
        }}
      >
        <span role="img" aria-hidden="true">{current.flag}</span>
        <svg
          width="8" height="5" viewBox="0 0 8 5" fill="none"
          style={{
            transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            transform: dropdown.visible ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.4,
          }}
        >
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {dropdown.visible && (
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
            className="dropdown-panel"
            data-state={dropdown.state}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid rgba(14,26,43,0.08)",
              boxShadow: "0 12px 40px rgba(14,26,43,0.12), 0 4px 12px rgba(14,26,43,0.06)",
              padding: "6px 0",
              minWidth: 160,
              overflow: "hidden",
            }}
          >
            {LANGUAGES.map((l, i) => {
              const isDisabled = (l as { disabled?: boolean }).disabled;
              return (
              <button
                key={l.code}
                className="dropdown-item"
                onClick={() => handleSelect(l.code)}
                disabled={isDisabled}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "12px 16px",
                  minHeight: 44,
                  border: "none",
                  background: l.code === lang ? "rgba(75,63,174,0.06)" : "transparent",
                  cursor: isDisabled ? "default" : "pointer",
                  fontSize: 14,
                  fontWeight: l.code === lang ? 600 : 500,
                  color: isDisabled ? "rgba(14,26,43,0.30)" : l.code === lang ? "#4B3FAE" : "rgba(14,26,43,0.70)",
                  textAlign: "left",
                  animationDelay: `${i * 30}ms`,
                  opacity: isDisabled ? 0.7 : 1,
                }}
              >
                <span role="img" aria-hidden="true" style={{ fontSize: 16, transition: "transform 200ms ease" }}>{l.flag}</span>
                <span>{l.label}</span>
                {l.code === lang && !isDisabled && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "auto" }}>
                    <path d="M3 7.5L5.5 10L11 4" stroke="#4B3FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* Runtime mobile detection — bypasses CSS entirely */
function useMobile(breakpoint = 960) {
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
  const [scrolled, setScrolled] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const mobile = useMobile();
  const { t } = useLanguage();
  const moreDropdown = useAnimatedDropdown();

  // Track page views
  useEffect(() => { trackPageView(); }, []);

  const submitWaitlist = async () => {
    if (!waitlistEmail || !waitlistEmail.includes("@")) return;
    try {
      await fetch(`${WORKER_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Enterprise Waitlist", email: waitlistEmail.trim(), subject: "enterprise", message: "Enterprise waitlist signup from footer." }),
      });
    } catch { /* silent */ }
    setWaitlistEmail("");
    setWaitlistDone(true);
  };

  const NAV_LINKS = [
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/plans", label: "Plans" },
    { href: "/industries", label: "Industries" },
    { href: "/learn", label: "Learn" },
  ];

  const MORE_LINKS: { href: string; label: string }[] = [];

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAFA", overflowX: "hidden" }}>
      {/* Skip to main content — WCAG 2.4.1 */}
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden", zIndex: 9999, padding: "12px 24px", backgroundColor: "#0E1A2B", color: "#F4F1EA", fontSize: 14, fontWeight: 600, textDecoration: "none", borderRadius: 8 }}
        onFocus={e => { e.currentTarget.style.position = "fixed"; e.currentTarget.style.left = "16px"; e.currentTarget.style.top = "16px"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; }}
        onBlur={e => { e.currentTarget.style.position = "absolute"; e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; }}>
        Skip to main content
      </a>

      {/* Injected animation styles */}
      <style dangerouslySetInnerHTML={{ __html: HEADER_STYLES }} />

      {/* Header — Institutional Navigation */}
      <header
        className="sticky top-0"
        style={{
          zIndex: 1000,
          background: scrolled ? "rgba(245,244,241,0.97)" : "#F5F4F1",
          borderBottom: scrolled ? "1px solid rgba(14,26,43,0.06)" : "1px solid rgba(14,26,43,0.08)",
          transition: "background 360ms cubic-bezier(0.22, 1, 0.36, 1), border-color 360ms cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: scrolled ? "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)" : "none",
        }}
      >
        <div
          className="mx-auto flex items-center"
          style={{
            maxWidth: 1200,
            height: mobile ? 60 : 80,
            paddingLeft: mobile ? 16 : 40,
            paddingRight: mobile ? 16 : 40,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              transition: "opacity 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <Image
              src={logoBlue}
              alt="RunPayway™"
              width={mobile ? 140 : 190}
              height={mobile ? 19 : 21}
              priority
              style={{ height: "auto" }}
            />
          </Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Desktop nav + CTA */}
          {!mobile && (
            <>
              <nav style={{ display: "flex", gap: 28, alignItems: "center", flexShrink: 0, whiteSpace: "nowrap" }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="header-nav-link"
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "rgba(14,26,43,0.60)",
                      transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                      paddingBottom: 2,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.60)"; }}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* More dropdown — only rendered when links exist */}
                {MORE_LINKS.length > 0 && (
                  <div
                    style={{ position: "relative" }}
                    onMouseEnter={() => moreDropdown.open()}
                    onMouseLeave={() => moreDropdown.close()}
                  >
                    <button
                      className="header-nav-link"
                      aria-label="More navigation options"
                      aria-expanded={moreDropdown.visible}
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: moreDropdown.visible ? "#0E1A2B" : "rgba(14,26,43,0.65)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: 0,
                        paddingBottom: 2,
                        transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {t.nav.more}
                      <svg
                        width="10" height="6" viewBox="0 0 10 6" fill="none"
                        style={{
                          transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                          transform: moreDropdown.visible ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {moreDropdown.visible && (
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
                          className="dropdown-panel"
                          data-state={moreDropdown.state}
                          style={{
                            background: "#ffffff",
                            borderRadius: 14,
                            border: "1px solid rgba(14,26,43,0.08)",
                            boxShadow: "0 16px 48px rgba(14,26,43,0.12), 0 4px 12px rgba(14,26,43,0.06)",
                            padding: "6px 0",
                            minWidth: 210,
                            overflow: "hidden",
                          }}
                        >
                          {MORE_LINKS.map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              className="dropdown-item"
                              onClick={() => moreDropdown.close()}
                              style={{
                                display: "block",
                                padding: "11px 20px",
                                fontSize: 14,
                                fontWeight: 500,
                                color: "rgba(14,26,43,0.70)",
                              }}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </nav>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginLeft: 28, flexShrink: 0 }}>
                <LanguageSelector mobile={false} />
                <Link
                  href="/sign-in"
                  className="header-nav-link"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "rgba(14,26,43,0.60)",
                    transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                    paddingBottom: 2,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.60)"; }}
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard/login"
                  className="header-nav-link"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "rgba(14,26,43,0.60)",
                    transition: "color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                    paddingBottom: 2,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.60)"; }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/begin"
                  className="cta-tick inline-flex items-center justify-center font-semibold whitespace-nowrap"
                  style={{
                    height: 42,
                    paddingLeft: 22,
                    paddingRight: 22,
                    borderRadius: 9,
                    background: "#4B3FAE",
                    color: "#ffffff",
                    fontSize: 16,
                    letterSpacing: "-0.01em",
                    border: "1px solid rgba(75,63,174,0.90)",
                    boxShadow: "0 4px 12px rgba(75,63,174,0.18), 0 1px 3px rgba(75,63,174,0.10)",
                    transition: "background 280ms cubic-bezier(0.22, 1, 0.36, 1), transform 280ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3D33A0";
                    e.currentTarget.style.transform = "translateY(-1.5px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(75,63,174,0.28), 0 2px 6px rgba(75,63,174,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#4B3FAE";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(75,63,174,0.18), 0 1px 3px rgba(75,63,174,0.10)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "translateY(0.5px)";
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(75,63,174,0.14)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateY(-1.5px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(75,63,174,0.28), 0 2px 6px rgba(75,63,174,0.12)";
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
                width: 48,
                height: 48,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 26,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: "#0E1A2B",
                  transition: "transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: menuOpen ? "rotate(45deg) translateY(5.5px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 26,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: "#0E1A2B",
                  marginTop: 6,
                  transition: "opacity 280ms cubic-bezier(0.22, 1, 0.36, 1), transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 26,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: "#0E1A2B",
                  marginTop: 6,
                  transition: "transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: menuOpen ? "rotate(-45deg) translateY(-5.5px)" : "none",
                }}
              />
            </button>
          )}
        </div>

        {/* Mobile menu panel — full screen overlay */}
        {mobile && menuOpen && (
          <div
            className="mobile-overlay"
            role="dialog"
            aria-label="Navigation menu"
            style={{
              position: "fixed",
              top: mobile ? 60 : 80,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              zIndex: 999,
              padding: "32px 16px",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              color: "#0E1A2B",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[...NAV_LINKS, ...MORE_LINKS].map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="mobile-nav-item"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#0E1A2B",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(14,26,43,0.06)",
                    display: "flex",
                    alignItems: "center",
                    animationDelay: `${i * 40}ms`,
                    transition: "color 200ms ease, padding-left 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  onTouchStart={(e) => { e.currentTarget.style.paddingLeft = "8px"; e.currentTarget.style.color = "#4B3FAE"; }}
                  onTouchEnd={(e) => { e.currentTarget.style.paddingLeft = "0px"; e.currentTarget.style.color = "#0E1A2B"; }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mobile-nav-item" style={{ marginTop: 20, animationDelay: `${NAV_LINKS.length * 40}ms` }}>
              <Link
                href="/dashboard/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 48,
                  borderRadius: 12,
                  border: "1px solid rgba(14,26,43,0.10)",
                  background: "transparent",
                  color: "#0E1A2B",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Dashboard
              </Link>
            </div>
            <div className="mobile-nav-item" style={{ marginTop: 10, animationDelay: `${(NAV_LINKS.length + 1) * 40}ms` }}>
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 48,
                  borderRadius: 12,
                  border: "1px solid rgba(14,26,43,0.10)",
                  background: "transparent",
                  color: "#0E1A2B",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            </div>
            <div className="mobile-nav-item" style={{ marginTop: 10, animationDelay: `${(NAV_LINKS.length + 2) * 40}ms` }}>
              <Link
                href="/begin"
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
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  border: "1px solid rgba(75,63,174,0.90)",
                  boxShadow: "0 6px 14px rgba(75,63,174,0.20)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <span className="tick tick-white" />
                <span className="cta-label">{t.nav.getMyScoreFull}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <ScrollToTop />
      {/* Content */}
      <main id="main-content" className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        id="footer"
        style={{
          background: "#F5F4F1",
          borderTop: "1px solid rgba(14,26,43,0.06)",
          scrollMarginTop: 80,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 1200,
            padding: mobile ? "40px 24px 40px" : "64px 48px 48px",
          }}
        >
          {/* Brand */}
          <div style={{ marginBottom: mobile ? 36 : 48, textAlign: "center" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <Image
                src={logoBlue}
                alt="RunPayway™"
                width={mobile ? 130 : 160}
                height={mobile ? 15 : 19}
                style={{ height: "auto" }}
              />
            </Link>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#1F6D7A", marginTop: 8 }}>
              {t.footer.incomeStabilityScore}
            </div>
          </div>

          {/* 3-column nav grid */}
          <nav
            aria-label="Footer navigation"
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: mobile ? "36px 32px" : "0 64px",
              maxWidth: 720,
              margin: "0 auto",
              marginBottom: mobile ? 40 : 52,
            }}
          >
            {/* Product */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>{t.footer.product}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { href: "/how-it-works", label: t.nav.howItWorks },
                  { href: "/plans", label: "Plans" },
                  { href: "/learn", label: "Learn" },
                  { href: "/sample-report", label: t.nav.sampleReport },
                  { href: "/methodology", label: "Methodology" },
                  { href: "/advisors", label: "For Advisors" },
                  { href: "/organizations", label: "For Organizations" },
                  { href: "/industries", label: "Industries" },
                ].map((link) => (
                  <Link key={link.label} href={link.href}
                    style={{ fontSize: 14, color: "rgba(14,26,43,0.55)", lineHeight: 1.4, transition: "color 160ms ease, font-weight 160ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; e.currentTarget.style.fontWeight = "600"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.55)"; e.currentTarget.style.fontWeight = "400"; }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>{t.footer.company}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { href: "/about", label: t.nav.about },
                  { href: "/blog", label: "Blog" },
                  { href: "/faq", label: t.nav.faq },
                  { href: "/coming-soon", label: "What\u2019s New" },
                  { href: "/contact", label: t.nav.contact },
                ].map((link) => (
                  <Link key={link.label} href={link.href}
                    style={{ fontSize: 14, color: "rgba(14,26,43,0.55)", lineHeight: 1.4, transition: "color 160ms ease, font-weight 160ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; e.currentTarget.style.fontWeight = "600"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.55)"; e.currentTarget.style.fontWeight = "400"; }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B", letterSpacing: "0.02em", marginBottom: 16 }}>Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { href: "/privacy-policy", label: t.footer.privacyPolicy },
                  { href: "/terms-of-use", label: t.footer.termsOfUse },
                  { href: "/accessibility", label: t.footer.accessibility },
                  { href: "/security-practices", label: t.footer.securityPractices },
                ].map((link) => (
                  <Link key={link.label} href={link.href}
                    style={{ fontSize: 14, color: "rgba(14,26,43,0.55)", lineHeight: 1.4, transition: "color 160ms ease, font-weight 160ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#0E1A2B"; e.currentTarget.style.fontWeight = "600"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(14,26,43,0.55)"; e.currentTarget.style.fontWeight = "400"; }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Divider */}
          <div style={{ height: 1, width: "100%", background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

          {/* Legal strip */}
          <div style={{ fontSize: 14, color: "rgba(14,26,43,0.45)", lineHeight: 1.8, textAlign: "center" }}>
            {t.footer.legal}
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner — GDPR compliance */}
      <CookieConsent />
      {/* Accessibility Widget — WCAG 2.1 AA */}
      <AccessibilityWidget />
    </div>
  );
}
