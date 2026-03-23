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
/*  Design tokens — strict scale                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  border: "rgba(14,26,43,0.10)",
  borderLight: "rgba(14,26,43,0.06)",
  gradient:
    "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
  cream: "#F4F1EA",
};

// 7-step type scale: 11 · 13 · 15 · 17 · 24 · 36 · 48
const F = {
  label: { fontSize: 11, fontWeight: 700 as const, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  small: { fontSize: 13, lineHeight: 1.55 },
  body: { fontSize: 15, lineHeight: 1.65 },
  lead: { fontSize: 17, lineHeight: 1.65 },
  h3: { fontSize: 18, fontWeight: 600 as const, lineHeight: 1.25 },
  h2: { fontSize: 36, fontWeight: 400 as const, letterSpacing: "-0.02em", lineHeight: 1.12 },
  h1: { fontSize: 48, fontWeight: 400 as const, letterSpacing: "-0.03em", lineHeight: 1.12 },
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

// Spacing: consistent 24px base, sections 120px desktop / 80px mobile
const SP = {
  section: { desktop: 120, mobile: 80 },
  sectionSm: { desktop: 96, mobile: 64 },
  maxW: 1060,
  pad: { desktop: 48, mobile: 24 },
  cardPad: { desktop: "36px 32px", mobile: "28px 24px" },
  cardRadius: 12,
  gap: 24,
};

/* ------------------------------------------------------------------ */
/*  NotifyForm                                                         */
/* ------------------------------------------------------------------ */

function NotifyForm({ mobile }: { mobile: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const existing = JSON.parse(localStorage.getItem("rp_notify_signups") || "[]");
      existing.push({ name, email, product, question, timestamp: new Date().toISOString() });
      localStorage.setItem("rp_notify_signups", JSON.stringify(existing));
    } catch { /* ignore */ }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: mobile ? "36px 24px" : "48px 36px", backgroundColor: B.sand, borderRadius: SP.cardRadius, border: `1px solid ${B.borderLight}` }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>&#10003;</div>
        <div style={{ ...F.h3, color: B.navy, marginBottom: 8 }}>Thank you{name ? `, ${name}` : ""}</div>
        <p style={{ ...F.body, color: B.muted, margin: 0 }}>
          We will reach out to <strong>{email}</strong> with updates{product ? ` on ${product}` : ""}.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: mobile ? 48 : 44,
    padding: "0 16px",
    borderRadius: 10,
    border: `1px solid ${B.border}`,
    background: "#FFFFFF",
    ...F.body,
    color: B.navy,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 180ms ease, box-shadow 180ms ease",
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = B.purple;
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,63,174,0.08)";
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = B.border;
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
      <input type="email" placeholder="Your email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
      <select
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        style={{ ...inputStyle, color: product ? B.navy : B.light, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%230E1A2B' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
        onFocus={focusHandler}
        onBlur={blurHandler}
      >
        <option value="">Which product are you interested in?</option>
        <option value="Annual Monitoring">Annual Income Monitoring</option>
        <option value="Advisor License">Advisor / API License</option>
        <option value="Enterprise">Enterprise / Platform Integration</option>
        <option value="Languages">New Language Support</option>
        <option value="All">All of the above</option>
      </select>
      <textarea
        placeholder="Any questions about a coming soon product?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
        style={{ ...inputStyle, height: "auto", padding: "14px 16px", resize: "vertical" as const, fontFamily: "inherit" }}
        onFocus={focusHandler}
        onBlur={blurHandler}
      />
      <button
        type="submit"
        style={{ height: mobile ? 52 : 48, borderRadius: 10, background: B.navy, color: "#ffffff", ...F.body, fontWeight: 600, border: "none", cursor: "pointer", letterSpacing: "0.01em", transition: "background 200ms ease, transform 200ms ease", marginTop: 4 }}
        onMouseEnter={(e) => { e.currentTarget.style.background = B.purple; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = B.navy; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        Submit
      </button>
      <p style={{ ...F.small, color: B.light, textAlign: "center", margin: 0 }}>No spam. We will only reach out with product updates.</p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ComingSoonPage() {
  const hero = useInView();
  const products = useInView();
  const languages = useInView();
  const notify = useInView();
  const mobile = useMobile();

  const pad = mobile ? SP.pad.mobile : SP.pad.desktop;

  const upcomingProducts = [
    {
      name: "Annual Income Monitoring",
      description: "Quarterly reassessments with score tracking over time. See how structural changes move your score. Includes a personal dashboard, email alerts when it is time to reassess, and full trend history.",
      features: ["Initial assessment + quarterly reassessments", "Score trend tracking across assessments", "Personal monitoring dashboard", "Email alerts at reassessment milestones", "All Model RP-2.0 updates included"],
      color: B.purple,
    },
    {
      name: "Advisor / API License",
      description: "Run income stability assessments for your clients. Designed for financial advisors, lenders, accountants, and platforms that need to evaluate income structure at scale.",
      features: ["Unlimited client assessments", "White-label report generation", "API access for platform integration", "Bulk pricing for high volume", "Dedicated support and onboarding"],
      color: B.teal,
    },
    {
      name: "Enterprise / Platform Integration",
      description: "Embed the Income Stability Score directly into your platform. Built for payroll companies, gig platforms, lending institutions, and HR technology providers.",
      features: ["Full API with webhooks", "Custom scoring parameters", "Multi-tenant architecture", "SLA-backed uptime guarantee", "Dedicated integration engineering"],
      color: B.navy,
    },
  ];

  const upcomingLanguages = [
    { name: "English", flag: "\u{1F1FA}\u{1F1F8}", status: "Available now", active: true },
    { name: "Espa\u00f1ol", flag: "\u{1F1EA}\u{1F1F8}", status: "Q3 2026", active: false },
    { name: "Portugu\u00eas", flag: "\u{1F1E7}\u{1F1F7}", status: "Q4 2026", active: false },
    { name: "\u0939\u093F\u0928\u094D\u0926\u0940", flag: "\u{1F1EE}\u{1F1F3}", status: "Q4 2026", active: false },
    { name: "Fran\u00e7ais", flag: "\u{1F1EB}\u{1F1F7}", status: "2027", active: false },
    { name: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}", status: "2027", active: false },
    { name: "\u65E5\u672C\u8A9E", flag: "\u{1F1EF}\u{1F1F5}", status: "2027", active: false },
    { name: "\u4E2D\u6587", flag: "\u{1F1E8}\u{1F1F3}", status: "2027", active: false },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>

      {/* ══ Hero ══ */}
      <section ref={hero.ref} style={{ position: "relative", background: B.gradient, paddingTop: mobile ? 100 : 140, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: mobile ? 400 : 700, height: mobile ? 400 : 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px`, textAlign: "center", opacity: hero.visible ? 1 : 0, transform: hero.visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease-out, transform 0.7s ease-out" }}>
          <div style={{ ...F.label, color: B.teal, marginBottom: 24 }}>Coming Soon</div>
          <h1 style={{ ...F.h1, fontSize: mobile ? 32 : F.h1.fontSize, fontFamily: DISPLAY_FONT, color: B.cream, marginBottom: 20 }}>
            What we are building next
          </h1>
          <p style={{ ...F.lead, color: "rgba(244,241,234,0.75)", maxWidth: 560, margin: "0 auto" }}>
            New products, new languages, and new ways to understand your income stability.
          </p>
        </div>
      </section>

      {/* ══ Products ══ */}
      <section ref={products.ref} style={{ backgroundColor: "#FFFFFF", paddingTop: mobile ? SP.section.mobile : SP.section.desktop, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop }}>
        <div style={{ maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
          <div style={{ textAlign: "center", marginBottom: 56, opacity: products.visible ? 1 : 0, transform: products.visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}>
            <h2 style={{ ...F.h2, fontSize: mobile ? 28 : F.h2.fontSize, fontFamily: DISPLAY_FONT, color: B.navy, marginBottom: 16 }}>Upcoming products</h2>
            <p style={{ ...F.body, color: B.muted, maxWidth: 520, margin: "0 auto" }}>
              The Income Stability Score is expanding beyond single assessments.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: SP.gap }}>
            {upcomingProducts.map((product, i) => (
              <ProductCard key={product.name} product={product} visible={products.visible} mobile={mobile} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ Languages ══ */}
      <section ref={languages.ref} style={{ backgroundColor: B.sand, paddingTop: mobile ? SP.section.mobile : SP.section.desktop, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop }}>
        <div style={{ maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
          <div style={{ textAlign: "center", marginBottom: 56, opacity: languages.visible ? 1 : 0, transform: languages.visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}>
            <h2 style={{ ...F.h2, fontSize: mobile ? 28 : F.h2.fontSize, fontFamily: DISPLAY_FONT, color: B.navy, marginBottom: 16 }}>Language support</h2>
            <p style={{ ...F.body, color: B.muted, maxWidth: 520, margin: "0 auto" }}>
              The Income Stability Score will be available in multiple languages.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, maxWidth: 720, margin: "0 auto" }}>
            {upcomingLanguages.map((lang, i) => (
              <div
                key={lang.name}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: `1px solid ${lang.active ? B.teal : B.borderLight}`,
                  padding: "24px 20px",
                  textAlign: "center",
                  opacity: languages.visible ? 1 : 0,
                  transform: languages.visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.4s ease-out ${i * 60}ms, transform 0.4s ease-out ${i * 60}ms, box-shadow 200ms ease, border-color 200ms ease`,
                  cursor: "default",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{lang.flag}</div>
                <div style={{ ...F.body, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{lang.name}</div>
                <div style={{ ...F.label, fontSize: 10, color: lang.active ? B.teal : B.light }}>{lang.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Notify / Capture ══ */}
      <section ref={notify.ref} style={{ backgroundColor: "#FFFFFF", paddingTop: mobile ? SP.section.mobile : SP.section.desktop, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: `0 ${pad}px` }}>
          <div
            style={{
              backgroundColor: B.sand,
              borderRadius: SP.cardRadius,
              border: `1px solid ${B.borderLight}`,
              padding: mobile ? "36px 28px" : "48px 40px",
              opacity: notify.visible ? 1 : 0,
              transform: notify.visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ ...F.h2, fontSize: mobile ? 24 : 28, fontFamily: DISPLAY_FONT, color: B.navy, marginBottom: 12 }}>
                Have questions? Want updates?
              </h2>
              <p style={{ ...F.body, color: B.muted, margin: 0 }}>
                Ask about any upcoming product or leave your email to be notified when we launch.
              </p>
            </div>
            <NotifyForm mobile={mobile} />
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ backgroundColor: B.sand, paddingTop: mobile ? SP.sectionSm.mobile : SP.sectionSm.desktop, paddingBottom: mobile ? SP.sectionSm.mobile : SP.sectionSm.desktop, textAlign: "center" }}>
        <div style={{ maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
          <h2 style={{ ...F.h2, fontSize: mobile ? 24 : 32, fontFamily: DISPLAY_FONT, color: B.navy, marginBottom: 16 }}>Available right now</h2>
          <p style={{ ...F.body, color: B.muted, maxWidth: 480, margin: "0 auto 36px" }}>
            Get your Income Stability Score today — free. Upgrade to the full 5-page report for $99.
          </p>
          <a
            href="/diagnostic-portal"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 52, padding: "0 36px", borderRadius: SP.cardRadius, background: B.navy, color: "#ffffff", ...F.body, fontWeight: 600, textDecoration: "none", letterSpacing: "0.01em", transition: "background 200ms ease, transform 200ms ease, box-shadow 200ms ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = B.purple; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,63,174,0.20)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = B.navy; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Get My Free Score
          </a>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductCard — with hover state                                     */
/* ------------------------------------------------------------------ */

function ProductCard({ product, visible, mobile, delay }: {
  product: { name: string; description: string; features: string[]; color: string };
  visible: boolean;
  mobile: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: SP.cardRadius,
        border: `1px solid ${B.borderLight}`,
        padding: mobile ? SP.cardPad.mobile : SP.cardPad.desktop,
        boxShadow: hovered ? "0 12px 32px rgba(14,26,43,0.08)" : "0 4px 16px rgba(14,26,43,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? hovered ? "translateY(-4px)" : "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms, box-shadow 260ms ease`,
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      <div style={{ ...F.label, color: product.color, marginBottom: 20 }}>Coming Soon</div>
      <div style={{ ...F.h3, color: B.navy, marginBottom: 16 }}>{product.name}</div>
      <p style={{ ...F.body, color: B.muted, marginBottom: 28, flex: 1 }}>{product.description}</p>
      <div style={{ height: 1, background: B.borderLight, marginBottom: 24 }} />
      {product.features.map((f) => (
        <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: product.color, flexShrink: 0, marginTop: 7 }} />
          <span style={{ ...F.small, color: B.muted }}>{f}</span>
        </div>
      ))}
    </div>
  );
}
