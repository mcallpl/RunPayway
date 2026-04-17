"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  panelFill: "#F8F6F1",
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  risk: "#C74634",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const sans = '"Inter", system-ui, -apple-system, sans-serif';

const OUTCOMES = [
  {
    num: "01",
    title: "Know whether income is structurally stable — not just what it was.",
    body: "Tax returns show what a borrower earned last year. RunPayway™ shows whether the structure behind that income is likely to continue — how concentrated it is, how much is contracted forward, and how exposed it is to a single disruption.",
  },
  {
    num: "02",
    title: "Identify concentration risk that standard documentation doesn't capture.",
    body: "A self-employed borrower with one client on project-based work looks identical on paper to one with six retainer clients and nine months contracted forward. Same income. Completely different structural risk. RunPayway scores the difference.",
  },
  {
    num: "03",
    title: "Add a standardized income stability score to every non-W2 file.",
    body: "Generated from standardized inputs. Auditable. Reproducible. The same borrower profile always produces the same score — no judgment, no subjectivity. Attach it to any file in under two minutes.",
  },
  {
    num: "04",
    title: "Borrowers complete it themselves. You get the score.",
    body: "You send a link. The borrower completes the assessment — no financial accounts, no documents, under two minutes. You receive their Income Stability Score, stability band, and top structural risk. Nothing added to your workflow.",
  },
  {
    num: "05",
    title: "Differentiate your review process for self-employed income.",
    body: "Commission earners, contractors, gig workers, and self-employed borrowers need more than a tax return. Now they have a structural score — and you have a consistent, defensible framework for evaluating it.",
  },
];

const WORKFLOW = [
  { num: "1", title: "You send the link", desc: "Share runpayway.com/begin with your borrower before or during the application process." },
  { num: "2", title: "They complete the assessment", desc: "Under two minutes. No financial accounts. No documents. Answers about income structure, not income amount." },
  { num: "3", title: "You receive the score", desc: "Income Stability Score (0–100), stability band, and top structural risk. Ready to attach to the file." },
];

const BORROWER_TYPES = [
  { label: "Self-employed", sub: "Consultants, business owners, freelancers" },
  { label: "Commission-based", sub: "Sales, real estate, insurance agents" },
  { label: "Contract workers", sub: "Contractors, gig economy, project-based" },
  { label: "Multi-income earners", sub: "Hybrid earners with variable sources" },
];

export default function LendersPage() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pad = mobile ? 28 : 48;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.white, fontFamily: sans }}>

      {/* Hero */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 72 : 112, paddingBottom: mobile ? 64 : 96, paddingLeft: pad, paddingRight: pad, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 100, backgroundColor: "rgba(31,109,122,0.15)", marginBottom: 28 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: C.teal }}>FOR MORTGAGE LENDERS</span>
          </div>
          <h1 style={{ fontSize: mobile ? 32 : 52, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20 }}>
            The income behind{mobile ? " " : <br />}the application.
          </h1>
          <p style={{ fontSize: mobile ? 17 : 22, fontWeight: 400, lineHeight: 1.5, color: C.sandMuted, maxWidth: 600, margin: "0 auto 40px" }}>
            Tax returns show what a borrower earned. RunPayway™ shows whether they&rsquo;ll keep earning it &mdash; and how exposed that income is before you close.
          </p>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, justifyContent: "center", alignItems: "center" }}>
            <Link href="/advisor-portal" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 56, padding: "0 36px", borderRadius: 14,
              backgroundColor: C.teal, color: C.white,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(31,109,122,0.30)",
              width: mobile ? "100%" : "auto",
            }}>
              Start with a pilot &rarr;
            </Link>
            <Link href="/begin" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 56, padding: "0 28px", borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.06)", color: C.sandText,
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: 15, fontWeight: 500, textDecoration: "none",
              width: mobile ? "100%" : "auto",
            }}>
              Try it yourself first
            </Link>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section style={{ backgroundColor: C.panelFill, padding: mobile ? "64px 28px" : "96px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 16, textAlign: "center" }}>THE UNDERWRITING GAP</div>
          <h2 style={{ fontSize: mobile ? 26 : 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: C.navy, marginBottom: 20, textAlign: "center" }}>
            The hardest borrowers to underwrite aren&rsquo;t high-risk. They&rsquo;re underdocumented.
          </h2>
          <p style={{ fontSize: mobile ? 16 : 18, lineHeight: 1.65, color: C.textSecondary, marginBottom: 32, textAlign: "center" }}>
            Self-employed, commissioned, and contract borrowers represent the fastest-growing segment of loan applications. Standard documentation tells you income amount. It tells you nothing about whether that income is structurally likely to continue.
          </p>

          {/* Side-by-side comparison */}
          <div style={{ display: mobile ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 40 }}>
            <div style={{ backgroundColor: C.white, borderRadius: 16, padding: mobile ? 24 : 32, border: "1px solid rgba(14,26,43,0.06)", marginBottom: mobile ? 16 : 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: C.risk, marginBottom: 12 }}>BORROWER A</div>
              <div style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, marginBottom: 8, fontFamily: mono }}>$200K / year</div>
              <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>Self-employed consultant. One client. Project-based work. Nothing contracted beyond this engagement.</p>
              <div style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(199,70,52,0.06)", border: "1px solid rgba(199,70,52,0.12)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.risk }}>Income Stability Score: 28</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Limited Stability — one client away from zero</div>
              </div>
            </div>
            <div style={{ backgroundColor: C.white, borderRadius: 16, padding: mobile ? 24 : 32, border: "1px solid rgba(14,26,43,0.06)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 12 }}>BORROWER B</div>
              <div style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, marginBottom: 8, fontFamily: mono }}>$180K / year</div>
              <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>Six retainer clients. 60% of income recurring. Nine months contracted forward across three agreements.</p>
              <div style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(31,109,122,0.06)", border: "1px solid rgba(31,109,122,0.12)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.teal }}>Income Stability Score: 74</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Established Stability — structured for continuity</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, textAlign: "center", marginTop: 20 }}>
            Same DTI. Same approval process. Completely different structural risk. RunPayway scores the difference.
          </p>
        </div>
      </section>

      {/* What RunPayway adds */}
      <section style={{ backgroundColor: C.white, padding: mobile ? "64px 28px" : "96px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: mobile ? 40 : 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 16 }}>WHAT RUNPAYWAY ADDS</div>
            <h2 style={{ fontSize: mobile ? 26 : 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: C.navy }}>
              Five things your file gains.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const }}>
            {OUTCOMES.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: mobile ? 20 : 28, alignItems: "flex-start",
                padding: mobile ? "24px 0" : "32px 0",
                borderTop: "1px solid rgba(14,26,43,0.06)",
                borderBottom: i === OUTCOMES.length - 1 ? "1px solid rgba(14,26,43,0.06)" : "none",
              }}>
                <div style={{
                  width: mobile ? 36 : 44, height: mobile ? 36 : 44, borderRadius: 10, flexShrink: 0,
                  backgroundColor: C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: mobile ? 12 : 13, fontWeight: 700, color: C.white, fontFamily: mono,
                }}>
                  {item.num}
                </div>
                <div>
                  <p style={{ fontSize: mobile ? 16 : 18, fontWeight: 700, color: C.navy, lineHeight: 1.3, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: mobile ? 14 : 15, color: C.textSecondary, lineHeight: 1.65, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Borrower types */}
      <section style={{ backgroundColor: C.panelFill, padding: mobile ? "64px 28px" : "96px 48px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 16 }}>BUILT FOR</div>
          <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, letterSpacing: "-0.025em", color: C.navy, marginBottom: 40 }}>
            Every borrower whose income doesn&rsquo;t come from a paycheck.
          </h2>
          <div style={{ display: mobile ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {BORROWER_TYPES.map((bt, i) => (
              <div key={i} style={{ backgroundColor: C.white, borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(14,26,43,0.06)", textAlign: "left", marginBottom: mobile ? 12 : 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{bt.label}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{bt.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section style={{ backgroundColor: C.navy, padding: mobile ? "64px 28px" : "96px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: mobile ? 26 : 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: C.sandText, marginBottom: 12 }}>
            Nothing added to your workflow.
          </h2>
          <p style={{ fontSize: mobile ? 15 : 17, color: C.sandMuted, marginBottom: 56, maxWidth: 480, margin: "0 auto 56px" }}>
            You send a link. The borrower completes the assessment. You get the score.
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
            {WORKFLOW.map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 24, alignItems: "flex-start",
                padding: mobile ? "24px 0" : "28px 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: i === WORKFLOW.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                textAlign: "left",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  backgroundColor: "rgba(31,109,122,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: C.teal, fontFamily: mono,
                }}>
                  {step.num}
                </div>
                <div>
                  <p style={{ fontSize: mobile ? 16 : 18, fontWeight: 700, color: C.sandText, margin: "0 0 6px" }}>{step.title}</p>
                  <p style={{ fontSize: mobile ? 14 : 15, color: C.sandMuted, margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ backgroundColor: C.white, padding: mobile ? "72px 28px" : "112px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: mobile ? 28 : 40, fontWeight: 700, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Start with a single borrower.
          </h2>
          <p style={{ fontSize: mobile ? 16 : 18, color: C.textSecondary, lineHeight: 1.6, marginBottom: 36 }}>
            Run one assessment on your next self-employed applicant. See what standard documentation misses. No commitment required.
          </p>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, justifyContent: "center" }}>
            <Link href="/advisor-portal" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 56, padding: "0 36px", borderRadius: 14,
              backgroundColor: C.navy, color: C.white,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(14,26,43,0.15)",
              width: mobile ? "100%" : "auto",
            }}>
              See lender plans &rarr;
            </Link>
            <Link href="/begin" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 56, padding: "0 28px", borderRadius: 14,
              backgroundColor: "transparent", color: C.navy,
              border: `1px solid ${C.borderSoft}`,
              fontSize: 15, fontWeight: 500, textDecoration: "none",
              width: mobile ? "100%" : "auto",
            }}>
              Try it yourself first
            </Link>
          </div>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 20 }}>
            Questions? <Link href="/contact" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>Talk to us</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid rgba(14,26,43,0.08)`, padding: "24px 28px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/">
            <Image src={logoBlue} alt="RunPayway™" width={120} height={14} style={{ height: "auto" }} />
          </Link>
          <span style={{ fontSize: 12, color: C.textMuted }}>
            <Link href="/methodology" style={{ color: C.textMuted, textDecoration: "none" }}>Methodology</Link>
            {" · "}
            <Link href="/advisor-portal" style={{ color: C.textMuted, textDecoration: "none" }}>Advisor Portal</Link>
            {" · "}
            <Link href="/privacy-policy" style={{ color: C.textMuted, textDecoration: "none" }}>Privacy</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
