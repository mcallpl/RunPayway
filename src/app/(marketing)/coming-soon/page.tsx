"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { C, mono, sans } from "@/lib/design-tokens";

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
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
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
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const gradient = "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1F6D7A 100%)";

/* ------------------------------------------------------------------ */
/*  NotifyForm                                                         */
/* ------------------------------------------------------------------ */

function NotifyForm({ mobile }: { mobile: boolean }) {
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const existing = JSON.parse(localStorage.getItem("rp_notify_signups") || "[]");
      existing.push({ email, product, timestamp: new Date().toISOString() });
      localStorage.setItem("rp_notify_signups", JSON.stringify(existing));
    } catch { /* ignore */ }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 8 }}>You are on the list.</div>
        <p style={{ fontSize: 14, color: C.sandMuted, margin: 0 }}>
          We will reach out to <strong style={{ color: C.sandText }}>{email}</strong> when it is ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12 }}>
      <input
        type="email" required placeholder="Your email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ flex: 1, height: 48, padding: "0 16px", borderRadius: 8, border: `1px solid ${C.sandBorder}`, background: "rgba(255,255,255,0.04)", color: C.sandText, fontSize: 15, outline: "none", boxSizing: "border-box" }}
      />
      <select
        value={product} onChange={(e) => setProduct(e.target.value)}
        style={{ height: 48, padding: "0 16px", borderRadius: 8, border: `1px solid ${C.sandBorder}`, background: "rgba(255,255,255,0.04)", color: product ? C.sandText : C.sandLight, fontSize: 14, outline: "none", appearance: "none", minWidth: mobile ? undefined : 200 }}
      >
        <option value="">I am interested in...</option>
        <option value="Advisor License">Advisor / API License</option>
        <option value="Enterprise">Enterprise Integration</option>
        <option value="All">Everything</option>
      </select>
      <button type="submit" style={{ height: 48, padding: "0 28px", borderRadius: 8, background: `linear-gradient(135deg, ${C.sand} 0%, #E8E5DD 100%)`, color: C.navy, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
        Notify Me
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ComingSoonPage() {
  const hero = useInView();
  const products = useInView();
  const cta = useInView();
  const mobile = useMobile();
  const pad = mobile ? 28 : 56;

  const upcoming = [
    {
      label: "ADVISOR",
      name: "Advisor & API License",
      oneLiner: "Run assessments for your clients. At scale.",
      details: ["Unlimited client assessments", "White-label report generation", "API access for platform integration", "Dedicated onboarding"],
      color: C.teal,
    },
    {
      label: "ENTERPRISE",
      name: "Platform Integration",
      oneLiner: "Embed the score directly into your product.",
      details: ["Full API with webhooks", "Multi-tenant architecture", "Custom scoring parameters", "SLA-backed uptime"],
      color: C.navy,
    },
  ];

  return (
    <div style={{ fontFamily: sans }}>
      {/* ══ HERO — Full-screen dark, Apple keynote feel ══ */}
      <section ref={hero.ref} style={{ position: "relative", background: C.navy, minHeight: mobile ? "85vh" : "90vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* Atmospheric glows */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: mobile ? 500 : 1000, height: mobile ? 500 : 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: `0 ${pad}px`, textAlign: "center" }}>
          <div style={{
            opacity: hero.visible ? 1 : 0,
            transform: hero.visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
          }}>
            <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 4, background: "rgba(75,63,174,0.15)", border: "1px solid rgba(75,63,174,0.25)", marginBottom: 32 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.sandLight }}>What&#8217;s Next</span>
            </div>

            <h1 style={{ fontSize: mobile ? 36 : 64, fontFamily: sans, fontWeight: 600, color: C.sandText, lineHeight: 1.06, letterSpacing: "-0.03em", marginBottom: 24 }}>
              The score was<br />just the beginning.
            </h1>

            <p style={{ fontSize: mobile ? 16 : 19, color: C.sandLight, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 48px" }}>
              Advisor tools. Enterprise integration. We are building the infrastructure for income stability.
            </p>

            {/* Scroll indicator */}
            <div style={{ opacity: hero.visible ? 1 : 0, transition: "opacity 1.5s ease-out 800ms" }}>
              <div style={{ width: 1, height: 48, background: `linear-gradient(180deg, ${C.sandLight} 0%, transparent 100%)`, margin: "0 auto" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS — Minimal, one at a time ══ */}
      <section ref={products.ref} style={{ background: C.sand, paddingTop: mobile ? 72 : 120, paddingBottom: mobile ? 72 : 120, paddingLeft: pad, paddingRight: pad }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {upcoming.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: mobile ? "block" : "flex",
                gap: 48,
                alignItems: "flex-start",
                paddingTop: i === 0 ? 0 : mobile ? 48 : 64,
                paddingBottom: i === upcoming.length - 1 ? 0 : mobile ? 48 : 64,
                borderBottom: i < upcoming.length - 1 ? `1px solid ${C.border}` : "none",
                opacity: products.visible ? 1 : 0,
                transform: products.visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms ease-out ${200 + i * 150}ms, transform 600ms ease-out ${200 + i * 150}ms`,
              }}
            >
              {/* Left: name + description */}
              <div style={{ flex: 3, marginBottom: mobile ? 24 : 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: p.color, marginBottom: 12 }}>{p.label}</div>
                <h3 style={{ fontSize: mobile ? 24 : 30, fontFamily: sans, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12 }}>{p.name}</h3>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>{p.oneLiner}</p>
              </div>

              {/* Right: feature list */}
              <div style={{ flex: 2 }}>
                {p.details.map((d) => (
                  <div key={d} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: p.color, flexShrink: 0, marginTop: 8 }} />
                    <span style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ LANGUAGE LAUNCH TIMELINE ══ */}
      <section style={{ background: C.white, paddingTop: mobile ? 72 : 120, paddingBottom: mobile ? 72 : 120, paddingLeft: pad, paddingRight: pad }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: mobile ? 40 : 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 12 }}>Global Rollout</div>
            <h2 style={{ fontSize: mobile ? 26 : 38, fontFamily: sans, fontWeight: 600, color: C.navy, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 12 }}>
              Language launch timeline
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
              The full assessment, report, and simulator — localized for each market.
            </p>
          </div>

          {[
            { flag: "\uD83C\uDDFA\uD83C\uDDF8", language: "English", market: "United States", date: "Live now", color: C.teal, live: true },
            { flag: "\uD83C\uDDEA\uD83C\uDDF8", language: "Espa\u00f1ol", market: "Spain & Latin America", date: "Q3 2026", color: C.purple, live: false },
            { flag: "\uD83C\uDDE7\uD83C\uDDF7", language: "Portugu\u00eas", market: "Brazil", date: "Q4 2026", color: C.purple, live: false },
            { flag: "\uD83C\uDDEE\uD83C\uDDF3", language: "\u0939\u093F\u0928\u094D\u0926\u0940", market: "India", date: "Q4 2026", color: C.purple, live: false },
          ].map((lang, i) => (
            <div
              key={lang.language}
              style={{
                display: "flex",
                alignItems: "center",
                gap: mobile ? 16 : 24,
                padding: mobile ? "20px 16px" : "24px 28px",
                borderRadius: 12,
                backgroundColor: lang.live ? "rgba(31,109,122,0.04)" : C.sand,
                border: lang.live ? "1px solid rgba(31,109,122,0.15)" : `1px solid ${C.border}`,
                marginBottom: i < 3 ? 12 : 0,
              }}
            >
              {/* Flag */}
              <span style={{ fontSize: mobile ? 28 : 36, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>

              {/* Language + market */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, color: C.navy, lineHeight: 1.3 }}>{lang.language}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{lang.market}</div>
              </div>

              {/* Date badge */}
              <div style={{
                fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
                color: lang.live ? C.teal : C.purple,
                backgroundColor: lang.live ? "rgba(31,109,122,0.10)" : "rgba(75,63,174,0.08)",
                borderRadius: 20, padding: "6px 14px", whiteSpace: "nowrap" as const, flexShrink: 0,
              }}>
                {lang.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NOTIFY — Dark, singular, confident ══ */}
      <section style={{ background: gradient, paddingTop: mobile ? 72 : 120, paddingBottom: mobile ? 72 : 120, paddingLeft: pad, paddingRight: pad }}>
        <div ref={cta.ref} style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", opacity: cta.visible ? 1 : 0, transform: cta.visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 700ms ease-out, transform 700ms ease-out" }}>
          <h2 style={{ fontSize: mobile ? 28 : 42, fontFamily: sans, fontWeight: 600, color: C.sandText, letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 16 }}>
            Be first to know.
          </h2>
          <p style={{ fontSize: mobile ? 15 : 16, color: C.sandLight, lineHeight: 1.6, maxWidth: 420, margin: "0 auto 40px" }}>
            Leave your email. We will reach out when your product is ready. No spam. No newsletters. Just the launch.
          </p>
          <NotifyForm mobile={mobile} />
        </div>
      </section>

      {/* ══ AVAILABLE NOW — Bridge to action ══ */}
      <section style={{ background: C.sand, paddingTop: mobile ? 48 : 64, paddingBottom: mobile ? 48 : 64, paddingLeft: pad, paddingRight: pad, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: C.light, marginBottom: 16 }}>The Income Stability Score&#8482; is available right now.</p>
          <Link href="/pricing" style={{ fontSize: 15, fontWeight: 600, color: C.purple, textDecoration: "underline", textUnderlineOffset: 4 }}>
            Get your free score &#8594;
          </Link>
        </div>
      </section>
    </div>
  );
}
