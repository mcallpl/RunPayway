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

      {/* HEADER REMOVED - Using header from page.tsx instead */}

      <ScrollToTop />
      {/* Content */}
      <main id="main-content" className="flex-1">{children}</main>

      {/* Cookie Consent Banner — GDPR compliance */}
      <CookieConsent />
      {/* Accessibility Widget — WCAG 2.1 AA */}
      <AccessibilityWidget />
    </div>
  );
}
/* Force rebuild */
