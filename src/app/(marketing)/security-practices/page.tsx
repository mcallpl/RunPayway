"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

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

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Section({
  number,
  title,
  children,
  mobile,
  visible,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  mobile: boolean;
  visible: boolean;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid rgba(14,26,43,0.06)",
        padding: mobile ? "28px 24px" : "36px 36px",
        boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 600ms ease, transform 600ms ease",
      }}
    >
      <h2
        style={{
          fontSize: mobile ? 17 : 19,
          fontWeight: 700,
          color: B.navy,
          letterSpacing: "-0.02em",
          marginBottom: 16,
          lineHeight: 1.3,
        }}
      >
        <span style={{ color: B.purple, marginRight: 8 }}>{number}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 12, ...style }}>
      {children}
    </p>
  );
}

function Bullet({ items }: { items: string[] }) {
  return (
    <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none" }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontSize: 15,
            color: B.muted,
            lineHeight: 1.75,
            paddingLeft: 20,
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", left: 0, color: B.purple, fontSize: 11, lineHeight: "26px" }}>●</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SecurityPracticesPage() {
  const mobile = useMobile();
  const heroAnim = useInView();

  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s4 = useInView();
  const s5 = useInView();
  const s6 = useInView();
  const s7 = useInView();
  const s8 = useInView();
  const s9 = useInView();
  const s10 = useInView();

  return (
    <div style={{ background: B.sand }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div
          ref={heroAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 820,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Governance
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Security Practices
          </h1>

          <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, marginBottom: 8 }}>
            RunPayway™ · Income Stability Score™
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)", marginBottom: 8 }}>
            Structural Stability Model RP-1.0 | Version 1.0
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            Effective Date: April 1, 2026
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Content                                                     */}
      {/* ============================================================ */}
      <section style={{ paddingTop: mobile ? 48 : 72, paddingBottom: mobile ? 64 : 96 }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            display: "flex",
            flexDirection: "column",
            gap: mobile ? 20 : 24,
          }}
        >
          {/* 1 */}
          <div ref={s1.ref}>
            <Section number="1." title="Purpose" mobile={mobile} visible={s1.visible}>
              <P>This Security Practices statement describes the general safeguards implemented to protect the integrity of the RunPayway™ platform and Income Stability Score™ records.</P>
              <P>This document provides a high-level overview of security practices and does not disclose detailed technical configurations.</P>
              <P style={{ marginBottom: 0 }}>This statement is informational in nature and does not constitute a guarantee of security.</P>
            </Section>
          </div>

          {/* 2 */}
          <div ref={s2.ref}>
            <Section number="2." title="Platform Architecture Controls" mobile={mobile} visible={s2.visible}>
              <P>RunPayway™ incorporates technical and administrative safeguards designed to support:</P>
              <Bullet items={[
                "deterministic scoring integrity",
                "snapshot immutability",
                "controlled access to platform records",
                "authenticated registry verification",
              ]} />
              <P style={{ marginBottom: 0 }}>Security controls are integrated into system design consistent with operational and platform requirements.</P>
            </Section>
          </div>

          {/* 3 */}
          <div ref={s3.ref}>
            <Section number="3." title="Data Protection Measures" mobile={mobile} visible={s3.visible}>
              <P>Security measures may include, but are not limited to:</P>
              <Bullet items={[
                "encrypted transmission of data using HTTPS",
                "role-based administrative access controls",
                "authentication safeguards for registry and snapshot retrieval",
                "structured logging of submission and verification events",
                "separation of scoring logic from client-facing interfaces",
              ]} />
              <P>Sensitive payment data is processed through Stripe, an external payment processor.</P>
              <P style={{ marginBottom: 0 }}>RunPayway™ does not receive or store full payment card numbers.</P>
            </Section>
          </div>

          {/* 4 */}
          <div ref={s4.ref}>
            <Section number="4." title="Access Controls" mobile={mobile} visible={s4.visible}>
              <P>Access to administrative systems is restricted to authorized personnel.</P>
              <P>Permissions are role-based and subject to periodic internal review.</P>
              <P style={{ marginBottom: 0 }}>Authentication safeguards are implemented to protect registry endpoints, account access, and scoring infrastructure.</P>
            </Section>
          </div>

          {/* 5 */}
          <div ref={s5.ref}>
            <Section number="5." title="Logging & Monitoring" mobile={mobile} visible={s5.visible}>
              <P>RunPayway™ maintains structured logging designed to support:</P>
              <Bullet items={[
                "system integrity monitoring",
                "abuse detection",
                "audit review",
                "dispute investigation",
              ]} />
              <P style={{ marginBottom: 0 }}>Logs are retained only as necessary to maintain operational integrity and audit traceability.</P>
            </Section>
          </div>

          {/* 6 */}
          <div ref={s6.ref}>
            <Section number="6." title="Third-Party Service Providers" mobile={mobile} visible={s6.visible}>
              <P>RunPayway™ utilizes third-party providers for infrastructure hosting and payment processing.</P>
              <P>These providers maintain their own security practices and compliance standards.</P>
              <P>RunPayway™ does not represent or warrant the security practices of third-party providers.</P>
              <P style={{ marginBottom: 0 }}>Users are subject to the terms and privacy policies of those providers where applicable.</P>
            </Section>
          </div>

          {/* 7 */}
          <div ref={s7.ref}>
            <Section number="7." title="Incident Evaluation & Response" mobile={mobile} visible={s7.visible}>
              <P>Security incidents are evaluated based on potential risk to platform integrity or personal information.</P>
              <P>If a confirmed incident affects personal information, RunPayway™ will take appropriate steps consistent with applicable law.</P>
              <P>Response actions may include:</P>
              <Bullet items={[
                "investigation",
                "containment",
                "remediation",
                "notification where legally required",
              ]} />
            </Section>
          </div>

          {/* 8 */}
          <div ref={s8.ref}>
            <Section number="8." title="Responsible Disclosure" mobile={mobile} visible={s8.visible}>
              <P>
                Individuals who believe they have identified a potential security vulnerability may submit a report through the{" "}
                <Link
                  href="/contact"
                  style={{
                    color: B.purple,
                    fontWeight: 600,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(75,63,174,0.30)",
                    transition: "border-color 180ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(75,63,174,0.30)"; }}
                >
                  RunPayway™ contact form
                </Link>{" "}
                available on the website.
              </P>
              <P style={{ marginBottom: 0 }}>RunPayway™ will review responsible disclosures and evaluate them in accordance with internal security procedures.</P>
            </Section>
          </div>

          {/* 9 */}
          <div ref={s9.ref}>
            <Section number="9." title="Limitations" mobile={mobile} visible={s9.visible}>
              <P>No system can be guaranteed to be completely secure.</P>
              <P>RunPayway™ does not warrant that unauthorized access will never occur.</P>
              <P style={{ marginBottom: 0 }}>Users are responsible for maintaining the confidentiality of their account credentials.</P>
            </Section>
          </div>

          {/* 10 */}
          <div ref={s10.ref}>
            <Section number="10." title="Continuous Review" mobile={mobile} visible={s10.visible}>
              <P>Security practices are periodically reviewed and may be updated as part of ongoing operational improvements.</P>
              <P style={{ marginBottom: 0 }}>Updates to security practices will not retroactively alter previously issued Income Stability Score™ snapshot records.</P>
            </Section>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Closing brand bar                                           */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 56 : 72,
          paddingBottom: mobile ? 56 : 72,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {[180, 320, 480].map((size, i) => (
          <div
            key={size}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 8 }}>
            RunPayway™
          </div>
          <div style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", marginBottom: 24 }}>
            Income Stability Score™
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
