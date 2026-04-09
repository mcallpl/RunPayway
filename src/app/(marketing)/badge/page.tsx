"use client";

import { useState, useEffect, useRef } from "react";

/* ================================================================ */
/* UTILITIES                                                         */
/* ================================================================ */

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    };
}

/* ================================================================ */
/* DESIGN SYSTEM                                                     */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
  sandBorder: "rgba(255,255,255,0.08)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const sans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const innerW = 1120;
const sectionPx = (m: boolean) => m ? 24 : 48;

const BASE_URL = "https://peoplestar.com/RunPayway";

/* ================================================================ */
/* SAMPLE BADGE BANDS                                                */
/* ================================================================ */

const BANDS = [
  { label: "High Stability", short: "High", color: "#1F6D7A" },
  { label: "Established Stability", short: "Established", color: "#2B5EA7" },
  { label: "Developing Stability", short: "Developing", color: "#D0A23A" },
  { label: "Limited Stability", short: "Limited", color: "#C74634" },
];

/* ================================================================ */
/* PAGE                                                              */
/* ================================================================ */

export default function BadgePage() {
  const m = useMobile();
  const fadeIn = useFadeIn();
  const heroAnim = useInView();
  const previewAnim = useInView();
  const embedAnim = useInView();
  const useCasesAnim = useInView();

  const [accessCode, setAccessCode] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedBand, setSelectedBand] = useState(0);

  // Try to load access code from session
  useEffect(() => {
    try {
      const rec = JSON.parse(sessionStorage.getItem("rp_record") || "{}");
      if (rec.record_id) {
        setAccessCode(rec.record_id.slice(0, 8).toUpperCase());
      }
    } catch { /* */ }
  }, []);

  const currentBand = BANDS[selectedBand];
  const badgeUrl = accessCode ? `${BASE_URL}/api/badge/${encodeURIComponent(accessCode)}` : `${BASE_URL}/api/badge/DEMO`;
  const verifyUrl = accessCode ? `${BASE_URL}/verify?code=${encodeURIComponent(accessCode)}` : `${BASE_URL}/verify`;

  const embedHtml = `<a href="${verifyUrl}" target="_blank" rel="noopener">\n  <img src="${badgeUrl}" alt="RunPayway Verified — ${currentBand.label}" height="30" />\n</a>`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div style={{ background: C.white, fontFamily: sans }}>
      <title>Verification Badge | RunPayway™</title>

      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section style={{ position: "relative", overflow: "hidden", background: C.navy, paddingTop: m ? 80 : 100, paddingBottom: m ? 64 : 80 }}>
        {/* Grain */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.15, mixBlendMode: "soft-light" as const, pointerEvents: "none" as const,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }} />

        <div ref={heroAnim.ref} style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", paddingLeft: sectionPx(m), paddingRight: sectionPx(m), textAlign: "center" as const, ...fadeIn(heroAnim.visible) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: `1px solid ${C.sandBorder}`, background: "rgba(255,255,255,0.06)", marginBottom: 28 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sandMuted, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Verification Badge
            </span>
          </div>

          <h1 style={{ fontSize: m ? 30 : 44, fontWeight: 600, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 20 }}>
            Display Your Verified Score
          </h1>

          <p style={{ fontSize: m ? 15 : 18, color: C.sandMuted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
            Embed a verifiable badge on your website, email signature, or professional profile. Each badge links directly to your authenticated assessment record.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Badge Preview                                               */}
      {/* ============================================================ */}
      <section style={{ paddingTop: m ? 56 : 80, paddingBottom: m ? 48 : 64, background: C.sand }}>
        <div ref={previewAnim.ref} style={{ maxWidth: innerW, margin: "0 auto", paddingLeft: sectionPx(m), paddingRight: sectionPx(m), ...fadeIn(previewAnim.visible) }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 16, textTransform: "uppercase" as const }}>
            Badge Preview
          </div>

          <div style={{ background: C.white, borderRadius: 16, border: `1px solid rgba(14,26,43,0.08)`, padding: m ? 24 : 40, boxShadow: "0 8px 32px rgba(14,26,43,0.06)" }}>
            {/* Band selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" as const }}>
              {BANDS.map((band, i) => (
                <button
                  key={band.label}
                  onClick={() => setSelectedBand(i)}
                  style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: selectedBand === i ? `2px solid ${band.color}` : "1px solid rgba(14,26,43,0.08)",
                    background: selectedBand === i ? `${band.color}10` : "transparent",
                    color: selectedBand === i ? band.color : C.textMuted,
                    cursor: "pointer", fontFamily: sans, transition: "all 150ms",
                  }}
                >
                  {band.short}
                </button>
              ))}
            </div>

            {/* Badge display area */}
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 20, padding: "32px 0" }}>
              {/* Inline SVG preview */}
              <div style={{ background: "#F8F6F1", borderRadius: 12, padding: "32px 48px", border: "1px dashed rgba(14,26,43,0.10)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width={130 + currentBand.short.length * 8 + 24} height="30" role="img">
                  <defs>
                    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1a2540"/>
                      <stop offset="100%" stopColor="#0E1A2B"/>
                    </linearGradient>
                  </defs>
                  <rect width="130" height="30" rx="5" ry="5" fill="url(#bg)"/>
                  <rect x="130" width={currentBand.short.length * 8 + 24} height="30" fill={currentBand.color}/>
                  <rect x={130 + currentBand.short.length * 8 + 24 - 5} y="0" width="5" height="30" rx="5" ry="5" fill={currentBand.color}/>
                  <text x="65" y="16" fill="#F4F1EA" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="central" letterSpacing="0.02em">RunPayway™ Verified</text>
                  <text x={130 + (currentBand.short.length * 8 + 24) / 2} y="16" fill="#FFFFFF" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" dominantBaseline="central">{currentBand.short}</text>
                </svg>
              </div>

              <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center" as const }}>
                Actual badge renders from the API at the URL below.
              </p>
            </div>

            {/* Badge URL */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.navy, textTransform: "uppercase" as const, marginBottom: 8 }}>
                Direct Image URL
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(14,26,43,0.08)", background: "#F8F6F1", fontFamily: mono, fontSize: 12, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                  {badgeUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(badgeUrl, "url")}
                  style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: C.navy, color: C.sandText, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const, fontFamily: sans }}
                >
                  {copied === "url" ? "Copied" : "Copy URL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Embed Code                                                  */}
      {/* ============================================================ */}
      <section style={{ paddingTop: m ? 48 : 64, paddingBottom: m ? 48 : 64, background: C.white }}>
        <div ref={embedAnim.ref} style={{ maxWidth: innerW, margin: "0 auto", paddingLeft: sectionPx(m), paddingRight: sectionPx(m), ...fadeIn(embedAnim.visible) }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.purple, marginBottom: 16, textTransform: "uppercase" as const }}>
            Embed Code
          </div>

          <h2 style={{ fontSize: m ? 22 : 32, fontWeight: 600, color: C.navy, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 12 }}>
            Add to your site in seconds
          </h2>
          <p style={{ fontSize: m ? 15 : 17, color: C.textSecondary, lineHeight: 1.6, marginBottom: 28, maxWidth: 560 }}>
            Copy the HTML below and paste it into your website, portfolio, or email template. The badge auto-updates if your score changes.
          </p>

          <div style={{ background: "#F8F6F1", borderRadius: 12, border: "1px solid rgba(14,26,43,0.08)", overflow: "hidden" }}>
            {/* Code block */}
            <div style={{ padding: m ? 16 : 24 }}>
              <pre style={{ margin: 0, fontFamily: mono, fontSize: 13, color: C.navy, lineHeight: 1.7, whiteSpace: "pre-wrap" as const, wordBreak: "break-all" as const }}>
                {embedHtml}
              </pre>
            </div>
            {/* Copy bar */}
            <div style={{ borderTop: "1px solid rgba(14,26,43,0.06)", padding: "12px 24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => copyToClipboard(embedHtml, "embed")}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: C.navy, color: C.sandText, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: sans }}
              >
                {copied === "embed" ? "Copied to clipboard" : "Copy Embed Code"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Use Cases                                                   */}
      {/* ============================================================ */}
      <section style={{ paddingTop: m ? 48 : 64, paddingBottom: m ? 72 : 96, background: C.sand }}>
        <div ref={useCasesAnim.ref} style={{ maxWidth: innerW, margin: "0 auto", paddingLeft: sectionPx(m), paddingRight: sectionPx(m), ...fadeIn(useCasesAnim.visible) }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 16, textTransform: "uppercase" as const }}>
            Where to Use It
          </div>

          <h2 style={{ fontSize: m ? 22 : 32, fontWeight: 600, color: C.navy, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 36 }}>
            Professional placement options
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                title: "Website Footer",
                description: "Place the badge in your business website footer alongside other trust signals. Visitors can click through to verify your income stability rating independently.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="8" y1="18" x2="16" y2="18" />
                  </svg>
                ),
              },
              {
                title: "Email Signature",
                description: "Add the badge image to your email signature. Recipients see your verified stability rating in every correspondence, reinforcing professional credibility.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="22,4 12,13 2,4" />
                  </svg>
                ),
              },
              {
                title: "LinkedIn Profile",
                description: "Include the verification link or badge image in your LinkedIn summary or featured section. Particularly effective for consulting and advisory professionals.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} style={{ background: C.white, borderRadius: 16, border: "1px solid rgba(14,26,43,0.08)", padding: m ? 24 : 28, boxShadow: "0 4px 16px rgba(14,26,43,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(31,109,122,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65, margin: 0 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Footer note                                                 */}
      {/* ============================================================ */}
      <section style={{ paddingTop: 32, paddingBottom: 48, background: C.sand }}>
        <div style={{ maxWidth: innerW, margin: "0 auto", paddingLeft: sectionPx(m), paddingRight: sectionPx(m), textAlign: "center" as const }}>
          <p style={{ fontSize: 12, color: C.textMuted, letterSpacing: "0.02em" }}>
            Badges are served as SVG images with no external dependencies. Cache-optimized for fast loading.
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, opacity: 0.6, marginTop: 8, letterSpacing: "0.04em" }}>
            RunPayway™ Income Stability Assessment — Model RP-2.0
          </p>
        </div>
      </section>
    </div>
  );
}
