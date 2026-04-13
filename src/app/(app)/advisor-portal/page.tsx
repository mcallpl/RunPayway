"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { C, mono, sans } from "@/lib/design-tokens";

/* ── Advisor Header ──────────────────────────────────────── */
function AdvisorHeader({ mobile: m }: { mobile: boolean }) {
  return (
    <header style={{
      borderBottom: `1px solid ${C.border}`,
      backgroundColor: "rgba(247,246,243,0.97)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        height: m ? 56 : 64,
        padding: m ? "0 16px" : "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: m ? 10 : 16, minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image src={logoBlue} alt="RunPayway" width={m ? 100 : 140} height={16} style={{ height: "auto" }} />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: C.border }} />
          <span style={{
            fontSize: 13, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase" as const, color: C.purple,
          }}>
            ADVISOR PORTAL
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: m ? 12 : 20 }}>
          <Link href="/advisor-portal/dashboard" style={{
            fontSize: m ? 13 : 14, fontWeight: 600, color: C.purple,
            textDecoration: "none", minHeight: 44,
            display: "inline-flex", alignItems: "center",
          }}>
            Open Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AdvisorPortalPage() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const valueItems = [
    "Run Income Stability Score\u2122 assessments during client meetings",
    "See book-level analytics \u2014 average score, risk distribution, opportunities",
    "Get conversation starters before every meeting",
    "Track client progress across reassessments",
    "Identify which clients need attention this quarter",
    "Volume pricing available \u00b7 No subscription \u00b7 No minimum",
  ];

  const pad = mobile ? "28px" : "48px";
  const cardBase: React.CSSProperties = {
    backgroundColor: C.white,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(14,26,43,0.06)",
    border: `1px solid ${C.border}`,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans }}>
      <AdvisorHeader mobile={mobile} />

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "48px 28px 32px" : "72px 48px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.purple, marginBottom: 16, fontFamily: sans }}>
          ADVISOR PORTAL
        </div>
        <h1 style={{ fontSize: mobile ? 32 : 48, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
          Income intelligence across your entire book.
        </h1>
        <p style={{ fontSize: mobile ? 17 : 20, lineHeight: 1.5, color: C.textSecondary, maxWidth: 640, margin: "0 auto 36px", fontFamily: sans }}>
          Run assessments for your clients. See their scores, risks, and opportunities &mdash; all in one place.
        </p>
        <Link href="/advisor-portal/dashboard" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "16px 36px", fontSize: 17, fontWeight: 600, fontFamily: sans,
          color: C.white, backgroundColor: C.purple, borderRadius: 12,
          textDecoration: "none", boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
        }}>
          Open Dashboard &rarr;
        </Link>
      </section>

      {/* Value prop */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: mobile ? `0 ${pad} 64px` : `0 ${pad} 96px` }}>
        <div style={{ ...cardBase, padding: mobile ? "32px 28px" : "44px" }}>
          <h2 style={{ fontSize: mobile ? 24 : 28, fontWeight: 700, color: C.navy, margin: "0 0 12px", fontFamily: sans }}>
            What advisors get
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.textSecondary, margin: "0 0 28px", fontFamily: sans }}>
            RunPayway&#8482; Advisor Access lets you run Income Stability Score&#8482; assessments for your clients, view their results, and use the data in your planning conversations.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {valueItems.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, fontSize: 15, lineHeight: 1.5, color: C.textPrimary, fontFamily: sans }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="9" cy="9" r="9" fill="rgba(31,109,122,0.10)" />
                  <path d="M5.5 9.5l2 2 5-5" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Request access CTA */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 16, color: C.textSecondary, margin: "0 0 12px", fontFamily: sans }}>
            Interested in advisor access?
          </p>
          <Link href="/contact" style={{
            fontSize: 15, fontWeight: 600, color: C.purple, textDecoration: "none", fontFamily: sans,
            borderBottom: `1px solid rgba(75,63,174,0.3)`, paddingBottom: 2,
          }}>
            Contact us to get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "16px 20px 48px" }}>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0, fontFamily: mono }}>
          RunPayway&#8482; Advisor Portal &middot; Model RP-2.0
        </p>
      </footer>
    </div>
  );
}
