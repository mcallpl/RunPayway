"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

const STORAGE_KEY = "rp_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Only show if consent hasn't been given
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        setVisible(true);
      }
    } catch {
      // localStorage may be unavailable (e.g., private browsing)
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Silently fail if localStorage is unavailable
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#1C1635",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "20px 24px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        boxShadow: "0 -4px 24px rgba(14,26,43,0.25)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.6,
          maxWidth: 600,
          textAlign: "center",
        }}
      >
        {t.cookie.mainText}
        {expanded && (
          <span style={{ display: "block", marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            <strong style={{ color: "rgba(255,255,255,0.70)" }}>{t.cookie.whatWeStore}</strong> {t.cookie.whatWeStoreDetail}
            <br /><br />
            <strong style={{ color: "rgba(255,255,255,0.70)" }}>{t.cookie.whatWeDontDo}</strong> {t.cookie.whatWeDontDoDetail}
          </span>
        )}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleAccept}
          style={{
            height: 40,
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 8,
            background: "#4B3FAE",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "background 180ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3D33A0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#4B3FAE";
          }}
        >
          {t.cookie.accept}
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            height: 40,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 8,
            background: "transparent",
            color: "rgba(255,255,255,0.60)",
            fontSize: 14,
            fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 180ms ease, color 180ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
            e.currentTarget.style.color = "rgba(255,255,255,0.85)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "rgba(255,255,255,0.60)";
          }}
        >
          {expanded ? t.cookie.less : t.cookie.learnMore}
        </button>
      </div>
    </div>
  );
}
