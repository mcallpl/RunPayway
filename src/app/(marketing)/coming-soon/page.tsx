"use client";

import { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  border: "rgba(14,26,43,0.12)",
  gradient:
    "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
  cream: "#F4F1EA",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ComingSoonPage() {
  const hero = useInView();
  const products = useInView();
  const languages = useInView();
  const mobile = useMobile();

  const pad = mobile ? 24 : 48;
  const maxW = 1060;

  const upcomingProducts = [
    {
      name: "Annual Income Monitoring",
      price: "Coming Soon",
      description: "Quarterly reassessments with score tracking over time. See how structural changes move your score. Includes a personal dashboard, email alerts when it is time to reassess, and full trend history.",
      features: [
        "Initial assessment + quarterly reassessments",
        "Score trend tracking across assessments",
        "Personal monitoring dashboard",
        "Email alerts at reassessment milestones",
        "All Model RP-2.0 updates included",
      ],
      color: B.purple,
    },
    {
      name: "Advisor / API License",
      price: "Coming Soon",
      description: "Run income stability assessments for your clients. Designed for financial advisors, lenders, accountants, and platforms that need to evaluate income structure at scale.",
      features: [
        "Unlimited client assessments",
        "White-label report generation",
        "API access for platform integration",
        "Bulk pricing for high volume",
        "Dedicated support and onboarding",
      ],
      color: B.teal,
    },
    {
      name: "Enterprise / Platform Integration",
      price: "Coming Soon",
      description: "Embed the Income Stability Score directly into your platform. Built for payroll companies, gig platforms, lending institutions, and HR technology providers.",
      features: [
        "Full API with webhooks",
        "Custom scoring parameters",
        "Multi-tenant architecture",
        "SLA-backed uptime guarantee",
        "Dedicated integration engineering",
      ],
      color: B.navy,
    },
  ];

  const upcomingLanguages = [
    { name: "English", flag: "\u{1F1FA}\u{1F1F8}", status: "Available now" },
    { name: "Espa\u00f1ol (Spanish)", flag: "\u{1F1EA}\u{1F1F8}", status: "Q3 2026" },
    { name: "Portugu\u00eas (Portuguese)", flag: "\u{1F1E7}\u{1F1F7}", status: "Q4 2026" },
    { name: "\u0939\u093F\u0928\u094D\u0926\u0940 (Hindi)", flag: "\u{1F1EE}\u{1F1F3}", status: "Q4 2026" },
    { name: "Fran\u00e7ais (French)", flag: "\u{1F1EB}\u{1F1F7}", status: "2027" },
    { name: "Deutsch (German)", flag: "\u{1F1E9}\u{1F1EA}", status: "2027" },
    { name: "\u65E5\u672C\u8A9E (Japanese)", flag: "\u{1F1EF}\u{1F1F5}", status: "2027" },
    { name: "\u4E2D\u6587 (Chinese)", flag: "\u{1F1E8}\u{1F1F3}", status: "2027" },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>

      {/* Hero */}
      <section
        ref={hero.ref}
        style={{
          position: "relative",
          background: B.gradient,
          paddingTop: mobile ? 100 : 140,
          paddingBottom: mobile ? 64 : 96,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: mobile ? 400 : 700,
            height: mobile ? 400 : 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(75,63,174,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: maxW,
            margin: "0 auto",
            padding: `0 ${pad}px`,
            textAlign: "center",
            opacity: hero.visible ? 1 : 0,
            transform: hero.visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "0.12em",
              color: B.teal,
              marginBottom: 24,
            }}
          >
            Coming Soon
          </div>
          <h1
            style={{
              fontSize: mobile ? 32 : 48,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              color: B.cream,
              marginBottom: 20,
            }}
          >
            What we are building next
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "rgba(244,241,234,0.75)",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            New products, new languages, and new ways to understand your income stability. Here is what is on the way.
          </p>
        </div>
      </section>

      {/* Upcoming Products */}
      <section
        ref={products.ref}
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: mobile ? 80 : 120,
          paddingBottom: mobile ? 80 : 120,
        }}
      >
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 48,
              opacity: products.visible ? 1 : 0,
              transform: products.visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <h2
              style={{
                fontSize: mobile ? 28 : 40,
                fontFamily: DISPLAY_FONT,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.12,
                color: B.navy,
                marginBottom: 12,
              }}
            >
              Upcoming products
            </h2>
            <p style={{ fontSize: 16, color: B.muted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
              The Income Stability Score is expanding beyond single assessments.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {upcomingProducts.map((product, i) => (
              <div
                key={product.name}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 12,
                  border: "1px solid rgba(14,26,43,0.06)",
                  padding: mobile ? "32px 28px" : "36px",
                  boxShadow: "0 4px 16px rgba(14,26,43,0.04)",
                  opacity: products.visible ? 1 : 0,
                  transform: products.visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease-out ${i * 100}ms, transform 0.5s ease-out ${i * 100}ms`,
                  display: "flex",
                  flexDirection: "column" as const,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.10em",
                    color: product.color,
                    marginBottom: 16,
                  }}
                >
                  Coming Soon
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
                  {product.name}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: B.purple, marginBottom: 16 }}>
                  {product.price}
                </div>
                <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.65, marginBottom: 24, flex: 1 }}>
                  {product.description}
                </p>
                <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />
                {product.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        backgroundColor: product.color,
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    <span style={{ fontSize: 13, color: B.muted, lineHeight: 1.55 }}>{f}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section
        ref={languages.ref}
        style={{
          backgroundColor: B.sand,
          paddingTop: mobile ? 80 : 120,
          paddingBottom: mobile ? 80 : 120,
        }}
      >
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 48,
              opacity: languages.visible ? 1 : 0,
              transform: languages.visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <h2
              style={{
                fontSize: mobile ? 28 : 40,
                fontFamily: DISPLAY_FONT,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.12,
                color: B.navy,
                marginBottom: 12,
              }}
            >
              Language support
            </h2>
            <p style={{ fontSize: 16, color: B.muted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
              The Income Stability Score will be available in multiple languages.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: 16,
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            {upcomingLanguages.map((lang, i) => (
              <div
                key={lang.name}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: "1px solid rgba(14,26,43,0.06)",
                  padding: "20px 16px",
                  textAlign: "center",
                  opacity: languages.visible ? 1 : 0,
                  transform: languages.visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.4s ease-out ${i * 60}ms, transform 0.4s ease-out ${i * 60}ms`,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{lang.flag}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
                  {lang.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: lang.status === "Available now" ? B.teal : B.light,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                  }}
                >
                  {lang.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: mobile ? 64 : 96,
          paddingBottom: mobile ? 64 : 96,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
          <h2
            style={{
              fontSize: mobile ? 24 : 32,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: B.navy,
              marginBottom: 16,
            }}
          >
            Available right now
          </h2>
          <p style={{ fontSize: 16, color: B.muted, lineHeight: 1.65, maxWidth: 480, margin: "0 auto 32px" }}>
            Get your Income Stability Score today with a full 5-page assessment report.
          </p>
          <a
            href="/pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              padding: "0 36px",
              borderRadius: 12,
              background: B.navy,
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "background 200ms ease",
            }}
          >
            Get My Score — $59
          </a>
        </div>
      </section>
    </>
  );
}
