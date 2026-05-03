"use client";

import CookieConsent from "@/components/CookieConsent";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import ScrollToTop from "@/components/ScrollToTop";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => { trackPageView(); }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF", overflowX: "hidden" }}>
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden", zIndex: 9999, padding: "12px 24px", backgroundColor: "#0E1A2B", color: "#FFFFFF", fontSize: 14, fontWeight: 600, textDecoration: "none", borderRadius: 8 }}
        onFocus={e => { e.currentTarget.style.position = "fixed"; e.currentTarget.style.left = "16px"; e.currentTarget.style.top = "16px"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; }}
        onBlur={e => { e.currentTarget.style.position = "absolute"; e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; }}>
        Skip to main content
      </a>

      <ScrollToTop />
      <main id="main-content" className="flex-1">{children}</main>

      <CookieConsent />
      <AccessibilityWidget />
    </div>
  );
}
/* Force rebuild */
