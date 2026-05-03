"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const C = {
  navy: "#0E1A2B",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  textSecondary: "#6B7280",
  divider: "#E5E7EB",
};

const sections = [
  {
    title: "INDIVIDUALS",
    links: [
      { label: "Get My Stability Class", href: "/free-score/" },
      { label: "Full Report ($69)", href: "/verify/" },
      { label: "How It Works", href: "/how-it-works/" },
      { label: "What Your Score Means", href: "/learn/" },
    ],
  },
  {
    title: "PROFESSIONALS",
    links: [
      { label: "For Advisors", href: "/advisors/" },
      { label: "For Organizations", href: "/organizations/" },
      { label: "Use Cases", href: "/industries/" },
      { label: "Industries", href: "/industries/" },
    ],
  },
  {
    title: "SYSTEM",
    links: [
      { label: "Methodology", href: "/methodology/" },
      { label: "Model Integrity", href: "/model-integrity/" },
      { label: "Learn", href: "/learn/" },
      { label: "Definitions", href: "/definitions/" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];

function AccordionItem({ title, links, isOpen, onToggle }: { title: string; links: Array<{ label: string; href: string }>; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.divider}` }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "16px 24px",
          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontSize: 15,
          fontWeight: 600,
          color: C.navy,
        }}
      >
        {title}
        <span style={{ fontSize: 18 }}>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div style={{ padding: "0 24px 16px", backgroundColor: "#F8F6F1" }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{ display: "block", padding: "12px 0", fontSize: 15, color: C.textSecondary, textDecoration: "none", transition: "color 200ms" }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Footer() {
  const [mobile, setMobile] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer style={{ backgroundColor: C.sand, borderTop: `1px solid ${C.divider}` }}>
      {/* CTA BLOCK */}
      <section style={{ padding: mobile ? "64px 24px" : "96px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: mobile ? 28 : 32, fontWeight: 600, color: C.navy, marginBottom: 16, letterSpacing: "-0.03em" }}>
            Verification precedes commitment.
          </h2>

          <p style={{ fontSize: mobile ? 15 : 16, fontWeight: 400, color: C.textSecondary, marginBottom: 32, lineHeight: 1.6 }}>
            See how your income holds before your next decision.
          </p>

          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Start Verification →
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24, fontSize: 13, color: C.textSecondary, flexWrap: "wrap" }}>
            <span>Under 2 minutes</span>
            <span>·</span>
            <span>No documents</span>
            <span>·</span>
            <span>Private</span>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ height: 1, backgroundColor: C.divider, margin: "40px 0" }} />

      {/* NAVIGATION */}
      {mobile ? (
        /* MOBILE: ACCORDION */
        <section style={{ padding: "0 0 40px" }}>
          {sections.map((section, i) => (
            <AccordionItem
              key={section.title}
              title={section.title}
              links={section.links}
              isOpen={openAccordion === i}
              onToggle={() => setOpenAccordion(openAccordion === i ? null : i)}
            />
          ))}
        </section>
      ) : (
        /* DESKTOP: 4 COLUMNS */
        <section style={{ padding: "0 40px 64px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48 }}>
              {sections.map((section) => (
                <div key={section.title}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.navy, letterSpacing: "0.08em", marginBottom: 16, margin: "0 0 16px" }}>
                    {section.title}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {section.links.map((link) => (
                      <Link key={link.href} href={link.href} style={{ fontSize: 15, color: C.textSecondary, textDecoration: "none", transition: "color 200ms" }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LEGAL ROW */}
      <section style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${C.divider}` }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", fontSize: 13, color: C.textSecondary }}>
          <Link href="/privacy-policy/" style={{ textDecoration: "none", color: C.textSecondary }}>
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/terms-of-use/" style={{ textDecoration: "none", color: C.textSecondary }}>
            Terms of Use
          </Link>
          <span>·</span>
          <Link href="/security-practices/" style={{ textDecoration: "none", color: C.textSecondary }}>
            Security Practices
          </Link>
          <span>·</span>
          <Link href="/accessibility/" style={{ textDecoration: "none", color: C.textSecondary }}>
            Accessibility (WCAG 2.1 AA)
          </Link>
        </div>
      </section>

      {/* AUTHORITY BLOCK */}
      <section style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ backgroundColor: C.white, padding: 20, borderRadius: 8, border: `1px solid ${C.divider}`, textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
              RunPayway™ — Income Stability Score™
            </p>
            <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 4 }}>
              Structural Stability Model RP-2.0
            </p>
            <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>
              Same inputs produce the same result.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL LINE */}
      <section style={{ padding: "24px", textAlign: "center", backgroundColor: "#F8F6F1", borderTop: `1px solid ${C.divider}` }}>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>
          © 2026 RunPayway™ · PeopleStar Enterprises, LLC · Orange County, CA, USA
        </p>
      </section>
    </footer>
  );
}
