"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

/* ================================================================ */
/* UTILITIES                                                         */
/* ================================================================ */

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

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
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean) => m ? 24 : 48;


/* ================================================================ */
/* FAQ DATA                                                          */
/* ================================================================ */

interface FaqItem {
  id: string;
  category: string;
  categoryLabel: string;
  question: string;
  answer: string;
  keywords: string[];
}

const FAQ_DATA: FaqItem[] = [
  // --- Income Stability Score ---
  { id: "score-measure", category: "score", categoryLabel: "Income Stability Score\u2122", question: "What does the Income Stability Score\u2122 measure?", answer: "It measures how your income is built\u2014and how it holds under change. The score reflects structure, stability, and continuity. Not income size.", keywords: ["score meaning", "what is score", "income stability", "structure", "rating", "number"] },
  { id: "score-factors", category: "score", categoryLabel: "Income Stability Score\u2122", question: "What factors influence the score?", answer: "The score is determined by six structural dimensions:\n\n\u2022 Recurring Income\n\u2022 Source Reliance\n\u2022 Number of Sources\n\u2022 Income Locked In\n\u2022 Month-to-Month Steadiness\n\u2022 Income Without You\n\nEach dimension is scored independently, then combined into your final result.", keywords: ["factors", "dimensions", "what affects score", "how calculated", "six areas"] },
  { id: "score-good", category: "score", categoryLabel: "Income Stability Score\u2122", question: "What does a good score look like?", answer: "A good score reflects a stable income structure\u2014one that can absorb disruptions and adapt.\n\n0\u201329: Limited Stability\u2014one disruption could impact income significantly.\n30\u201349: Developing Stability\u2014income is not yet protected.\n50\u201374: Established Stability\u2014can handle most disruptions.\n75\u2013100: High Stability\u2014holds up even under sustained pressure.", keywords: ["good score", "high score", "best score", "what is good", "range", "bands"] },
  { id: "score-predict", category: "score", categoryLabel: "Income Stability Score\u2122", question: "Does the score predict future income?", answer: "No. It evaluates how your income is structured\u2014not what will happen.", keywords: ["predict", "future", "forecast", "guarantee"] },

  // --- Assessment ---
  { id: "assess-time", category: "assessment", categoryLabel: "Assessment", question: "How long does the assessment take?", answer: "Under 2 minutes.", keywords: ["how long", "time", "duration", "minutes"] },
  { id: "assess-info", category: "assessment", categoryLabel: "Assessment", question: "What information is required?", answer: "You describe how your income works: sources, concentration, variability, and continuity. No financial documents are required.", keywords: ["what info", "required", "documents", "bank", "information needed"] },
  { id: "assess-retake", category: "assessment", categoryLabel: "Assessment", question: "Can I retake the assessment?", answer: "Yes. Each assessment reflects the inputs at that time.", keywords: ["retake", "again", "redo", "repeat"] },

  // --- Report ---
  { id: "report-included", category: "report", categoryLabel: "Assessment Report", question: "What is included in the report?", answer: "Score and stability classification, structural breakdown, biggest risk, stress testing, and action plan. Each section is generated from your inputs.", keywords: ["report contents", "what is included", "report sections", "what do I get"] },
  { id: "report-calculated", category: "report", categoryLabel: "Assessment Report", question: "How is the score calculated?", answer: "Using consistent rules defined in a fixed scoring system. The same inputs always produce the same score.", keywords: ["how calculated", "calculation", "formula", "method", "consistent"] },

  // --- Dashboard ---
  { id: "cc-what", category: "command-center", categoryLabel: "Dashboard", question: "What is the Dashboard?", answer: "A structured interface for applying your results.", keywords: ["command center", "dashboard", "what is it"] },
  { id: "cc-playbook", category: "command-center", categoryLabel: "Dashboard", question: "What is the Negotiation Playbook?", answer: "Scripts based on your income structure to reduce dependency and improve stability.", keywords: ["negotiation", "playbook", "scripts", "what to say"] },
  { id: "cc-thisweek", category: "command-center", categoryLabel: "Dashboard", question: "What is the \u2018This Week\u2019 briefing?", answer: "A short set of actions based on your highest-impact change.", keywords: ["this week", "briefing", "weekly", "actions"] },
  { id: "cc-roadmap", category: "command-center", categoryLabel: "Dashboard", question: "How are roadmap milestones personalized?", answer: "They are generated directly from your inputs\u2014not templates.", keywords: ["roadmap", "milestones", "personalized", "12 week"] },
  { id: "cc-pressuremap", category: "command-center", categoryLabel: "Dashboard", question: "What is PressureMap\u2122?", answer: "A structured view of where your income is most exposed.", keywords: ["pressuremap", "pressure", "exposure", "risk map"] },

  // --- Privacy ---
  { id: "privacy-data", category: "privacy", categoryLabel: "Privacy and Data", question: "How is my data handled?", answer: "Your inputs are used only to generate your score and report.", keywords: ["data", "privacy", "how used", "what happens to data"] },
  { id: "privacy-shared", category: "privacy", categoryLabel: "Privacy and Data", question: "Is my information shared?", answer: "No. RunPayway\u2122 does not sell or share your data.", keywords: ["shared", "sold", "third party", "sell data"] },

  // --- Pricing ---
  { id: "pricing-diff", category: "pricing", categoryLabel: "Pricing", question: "What is the difference between the free assessment and the $69 full report?", answer: "The free assessment gives you your score, stability class, constraint breakdown, 12-week plan, industry comparison, and dashboard access. The $69 full report adds lifetime dashboard access, email delivery, PressureMap\u2122 narrative, action scripts, and the scenario simulator.", keywords: ["free vs paid", "difference", "what do I get", "pricing", "cost", "stability class"] },
  { id: "pricing-account", category: "pricing", categoryLabel: "Pricing", question: "Do I need an account?", answer: "Not for the free assessment or the $69 full report\u2014those work without an account. The $149/year Monitoring plan requires a sign-in so your three annual assessments can be tracked and compared over time.", keywords: ["account", "sign up", "registration", "login", "sign in", "monitoring"] },

  // --- Enterprise ---
  { id: "ent-multiple", category: "enterprise", categoryLabel: "Enterprise", question: "Can RunPayway\u2122 assess multiple income profiles?", answer: "Yes. The system can evaluate multiple individuals using the same model.", keywords: ["multiple", "team", "bulk", "organization"] },
  { id: "ent-volume", category: "enterprise", categoryLabel: "Enterprise", question: "Does RunPayway\u2122 offer volume access?", answer: "Yes. Structured access can be provided for teams and organizations.", keywords: ["volume", "enterprise", "team access", "organization"] },
  { id: "ent-share", category: "enterprise", categoryLabel: "Enterprise", question: "Can assessment records be shared?", answer: "Yes. Reports can be shared at the discretion of the individual.", keywords: ["share", "send", "export", "advisor"] },
  { id: "ent-integrate", category: "enterprise", categoryLabel: "Enterprise", question: "Can we integrate RunPayway\u2122 into workflows?", answer: "Integration options can be discussed for enterprise use.", keywords: ["integrate", "api", "workflow", "embed"] },

  // --- Compliance ---
  { id: "comp-soc2", category: "compliance", categoryLabel: "Compliance", question: "Is RunPayway SOC 2 compliant?", answer: "RunPayway\u2122 security controls are designed around SOC 2 Type II Trust Services Criteria — security, availability, processing integrity, confidentiality, and privacy. Formal certification is on our roadmap. Enterprise customers may request security documentation through our contact form.", keywords: ["soc 2", "soc2", "compliance", "security", "certified", "audit", "trust services"] },
  { id: "comp-iso27001", category: "compliance", categoryLabel: "Compliance", question: "Does RunPayway align with ISO 27001?", answer: "RunPayway\u2122 security practices are informed by the ISO 27001 framework, including risk assessment, access control, and continuous improvement. Formal certification is part of our compliance roadmap.", keywords: ["iso 27001", "iso", "information security", "isms", "framework"] },
  { id: "comp-gdpr", category: "compliance", categoryLabel: "Compliance", question: "Is RunPayway GDPR ready?", answer: "RunPayway\u2122 is designed with GDPR principles in mind. We publish a Data Processing Agreement, identify legal bases for processing, support data subject rights (access, rectification, erasure, portability, restriction, objection), implement Standard Contractual Clauses for international transfers, and maintain a 72-hour breach notification commitment.", keywords: ["gdpr", "european", "data protection", "dpa", "eu", "eea"] },
  { id: "comp-ccpa", category: "compliance", categoryLabel: "Compliance", question: "Does RunPayway comply with CCPA/CPRA?", answer: "RunPayway\u2122 supports California privacy rights as outlined in our Privacy Policy. We do not sell personal information, do not share data for cross-context behavioral advertising, and provide mechanisms for access, deletion, correction, and opt-out requests.", keywords: ["ccpa", "cpra", "california", "privacy rights"] },
  { id: "comp-dpa", category: "compliance", categoryLabel: "Compliance", question: "Does RunPayway\u2122 offer a Data Processing Agreement?", answer: "Yes. A standard Data Processing Agreement is published on our website and available at /data-processing-agreement. Enterprise customers requiring custom DPA terms may contact us through the contact form.", keywords: ["dpa", "data processing", "agreement", "contract", "enterprise"] },

  // --- Licensing ---
  { id: "lic-score", category: "licensing", categoryLabel: "Licensing", question: "Can the score be licensed?", answer: "Yes. Licensing options are available for organizations.", keywords: ["license", "licensing", "use score"] },
  { id: "lic-api", category: "licensing", categoryLabel: "Licensing", question: "How does licensing differ from API access?", answer: "Licensing defines usage rights. API access enables system integration.", keywords: ["license vs api", "api", "difference", "access"] },
  { id: "lic-whitelabel", category: "licensing", categoryLabel: "Licensing", question: "Is white-label reporting available?", answer: "Options may be available depending on use case.", keywords: ["white label", "whitelabel", "branded", "custom"] },
  { id: "lic-enterprise", category: "licensing", categoryLabel: "Licensing", question: "What does an enterprise license include?", answer: "Enterprise licensing governs authorized use cases, volume limits, data handling obligations, attribution requirements, and compliance with applicable data protection regulations. Terms are defined per agreement.", keywords: ["enterprise license", "what includes", "terms", "commercial"] },
  { id: "lic-compliance", category: "licensing", categoryLabel: "Licensing", question: "Does the license require compliance with data protection laws?", answer: "Yes. Enterprise licensees are expected to comply with applicable data protection regulations, including GDPR and CCPA/CPRA, when processing data obtained through the RunPayway\u2122 platform.", keywords: ["compliance", "data protection", "gdpr", "ccpa", "licensee", "obligations"] },
];

const CATEGORIES = [
  { key: "score", label: "Income Stability Score\u2122" },
  { key: "assessment", label: "Assessment" },
  { key: "report", label: "Report" },
  { key: "command-center", label: "Dashboard" },
  { key: "privacy", label: "Privacy" },
  { key: "pricing", label: "Pricing" },
  { key: "enterprise", label: "Enterprise" },
  { key: "compliance", label: "Compliance" },
  { key: "licensing", label: "Licensing" },
];

const SYNONYMS: Record<string, string[]> = {
  score: ["rating", "number", "result"],
  income: ["earnings", "revenue", "money"],
  stability: ["reliability", "consistency"],
  structure: ["setup", "composition", "build"],
  report: ["document", "pdf", "output"],
  assessment: ["test", "quiz", "evaluation"],
  privacy: ["data", "security", "information"],
  cost: ["price", "pricing", "fee", "charge"],
  compliance: ["certification", "certified", "audit", "regulation", "soc", "iso", "gdpr", "ccpa"],
};


/* ================================================================ */
/* SEARCH ENGINE                                                     */
/* ================================================================ */

function expandQuery(query: string): string {
  let expanded = query.toLowerCase();
  for (const [canonical, syns] of Object.entries(SYNONYMS)) {
    for (const syn of syns) {
      if (expanded.includes(syn)) {
        expanded += ` ${canonical}`;
      }
    }
  }
  return expanded;
}


/* ================================================================ */
/* HERO                                                              */
/* ================================================================ */

function HeroSection({ searchValue, onSearch, inputRef }: { searchValue: string; onSearch: (v: string) => void; inputRef: React.RefObject<HTMLInputElement | null> }) {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 48 : 72, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          SUPPORT
        </div>
        <h1 style={{ fontSize: m ? 30 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary, maxWidth: 620, margin: "0 auto 16px", ...fadeIn(visible, 100) }}>
          Clear answers about the Income Stability Score™, how it&rsquo;s generated, and how it&rsquo;s used.
        </p>
        <p style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.navy, marginBottom: 0, ...fadeIn(visible, 140) }}>
          All answers reflect the system as it is defined&mdash;not interpreted.
        </p>
      </div>

      {/* Search bar */}
      <div style={{ maxWidth: 680, margin: "40px auto 0", ...fadeIn(visible, 180) }}>
        <div style={{ position: "relative" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search how the system works\u2026"
            style={{
              width: "100%", height: m ? 56 : 64,
              padding: "0 48px 0 52px",
              borderRadius: 16,
              border: `1px solid rgba(14,26,43,0.12)`,
              backgroundColor: C.white,
              fontSize: 16, fontWeight: 400, color: C.navy,
              outline: "none",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = C.teal; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
          />
          {!m && !searchValue && (
            <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 600, color: C.textMuted, padding: "4px 8px", borderRadius: 6, backgroundColor: "rgba(14,26,43,0.04)", pointerEvents: "none" }}>/</span>
          )}
          {searchValue && (
            <button onClick={() => onSearch("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textMuted, padding: 4 }}>&times;</button>
          )}
        </div>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SEARCH RESULTS VIEW                                               */
/* ================================================================ */

function SearchResults({ results, query }: { results: FaqItem[]; query: string }) {
  const m = useMobile();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: m ? "56px 20px" : "96px 48px" }}>
        <p style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 12 }}>No exact match.</p>
        <p style={{ fontSize: 16, color: C.textMuted }}>Try a different term.</p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, justifyContent: "center", marginTop: 24 }}>
          {["score", "assessment", "report", "privacy"].map(s => (
            <span key={s} style={{ fontSize: 13, fontWeight: 500, color: C.teal, padding: "6px 14px", borderRadius: 8, backgroundColor: "rgba(31,109,122,0.03)", border: "1px solid transparent", cursor: "default", transition: "background-color 150ms, border-color 150ms" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(31,109,122,0.08)"; e.currentTarget.style.borderColor = "rgba(31,109,122,0.20)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(31,109,122,0.03)"; e.currentTarget.style.borderColor = "transparent"; }}>{s}</span>
          ))}
        </div>
      </div>
    );
  }

  const top = results[0];
  const related = results.slice(1, 6);

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: m ? "40px 20px" : "64px 48px" }}>
      {/* Direct answer card */}
      <div style={{ padding: m ? 28 : 36, borderRadius: 16, backgroundColor: C.sand, border: `1px solid rgba(14,26,43,0.06)`, boxShadow: "0 2px 8px rgba(14,26,43,0.04)", marginBottom: 40 }}>
        <p style={{ fontSize: m ? 18 : 20, fontWeight: 600, color: C.navy, marginBottom: 16, lineHeight: 1.35 }}>{top.question}</p>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, color: C.textSecondary, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{top.answer}</p>
        <div style={{ display: "flex", alignItems: "center", marginTop: 20, paddingTop: 20, borderTop: `1px solid rgba(14,26,43,0.06)` }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.textMuted }}>{top.categoryLabel.toUpperCase()}</span>
        </div>
      </div>

      {/* Related questions */}
      {related.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 20 }}>RELATED</div>
          {related.map(item => (
            <div key={item.id} style={{ borderTop: `1px solid ${C.borderSoft}` }}>
              <button onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                style={{ width: "100%", padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy, lineHeight: 1.4, paddingRight: 24 }}>{item.question}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: "transform 200ms", transform: expanded === item.id ? "rotate(45deg)" : "rotate(0deg)" }}>
                  <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div style={{ maxHeight: expanded === item.id ? 300 : 0, overflow: "hidden", transition: "max-height 200ms ease" }}>
                <p style={{ fontSize: 16, fontWeight: 400, color: C.textSecondary, lineHeight: 1.65, margin: 0, paddingBottom: 24, whiteSpace: "pre-line" }}>{item.answer}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.borderSoft}` }} />
        </div>
      )}

      <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 48 }}>
        All answers reflect the system as defined — not interpreted.
      </p>
    </div>
  );
}


/* ================================================================ */
/* BROWSE VIEW (3-COLUMN DESKTOP)                                    */
/* ================================================================ */

function BrowseView({ activeCategory, setActiveCategory }: { activeCategory: string; setActiveCategory: (c: string) => void }) {
  const m = useMobile();
  const [expanded, setExpanded] = useState<string | null>(null);

  const categoryFaqs = FAQ_DATA.filter(f => f.category === activeCategory);
  const activeLabel = CATEGORIES.find(c => c.key === activeCategory)?.label || "";

  if (m) {
    return (
      <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 80 }}>
        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 28, paddingTop: 8, WebkitOverflowScrolling: "touch" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setExpanded(null); }}
              style={{
                padding: "10px 18px", borderRadius: 10, whiteSpace: "nowrap",
                fontSize: 14, fontWeight: activeCategory === cat.key ? 600 : 400,
                color: activeCategory === cat.key ? C.navy : C.textMuted,
                backgroundColor: activeCategory === cat.key ? C.white : "transparent",
                border: `1px solid ${activeCategory === cat.key ? C.borderSoft : "transparent"}`,
                cursor: "pointer",
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 24 }}>{activeLabel.toUpperCase()}</div>
        {categoryFaqs.map(item => (
          <div key={item.id} style={{ borderTop: `1px solid ${C.borderSoft}` }}>
            <button onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              style={{ width: "100%", padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: C.navy, lineHeight: 1.4, paddingRight: 16 }}>{item.question}</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: "transform 200ms", transform: expanded === item.id ? "rotate(45deg)" : "rotate(0deg)" }}>
                <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div style={{ maxHeight: expanded === item.id ? 400 : 0, overflow: "hidden", transition: "max-height 200ms ease" }}>
              <p style={{ fontSize: 16, fontWeight: 400, color: C.textSecondary, lineHeight: 1.65, margin: 0, paddingBottom: 24, whiteSpace: "pre-line" }}>{item.answer}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.borderSoft}` }} />
      </div>
    );
  }

  // Desktop 3-column
  return (
    <div style={{ maxWidth: innerW, margin: "0 auto", display: "grid", gridTemplateColumns: "260px 1fr 220px", gap: 56, paddingLeft: sectionPx(false), paddingRight: sectionPx(false), paddingTop: 64, paddingBottom: 120 }}>
      {/* Sidebar */}
      <nav style={{ position: "sticky", top: 100, alignSelf: "start" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 24 }}>BROWSE BY CATEGORIES</div>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.key;
          return (
            <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setExpanded(null); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "12px 20px", marginBottom: 2,
                fontSize: 15, fontWeight: isActive ? 600 : 400,
                color: isActive ? C.navy : C.textSecondary,
                backgroundColor: isActive ? "rgba(14,26,43,0.03)" : "transparent",
                borderLeft: isActive ? `2px solid ${C.teal}` : "2px solid transparent",
                border: "none", borderLeftStyle: "solid" as const, borderLeftWidth: 2,
                borderLeftColor: isActive ? C.teal : "transparent",
                cursor: "pointer", borderRadius: 0,
                transition: "background-color 150ms",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.02)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
              {cat.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 780 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 24 }}>{activeLabel.toUpperCase()}</div>

        {categoryFaqs.map(item => (
          <div key={item.id} id={item.id} style={{ borderTop: `1px solid ${C.borderSoft}` }}>
            <button onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              style={{ width: "100%", padding: "24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.navy, lineHeight: 1.4, paddingRight: 24 }}>{item.question}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: "transform 200ms", transform: expanded === item.id ? "rotate(45deg)" : "rotate(0deg)" }}>
                <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div style={{ maxHeight: expanded === item.id ? 500 : 0, overflow: "hidden", transition: "max-height 200ms ease" }}>
              <p style={{ fontSize: 17, fontWeight: 400, color: C.textSecondary, lineHeight: 1.65, margin: 0, paddingBottom: 32, whiteSpace: "pre-line" }}>{item.answer}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.borderSoft}` }} />
      </div>

      {/* TOC */}
      <nav style={{ position: "sticky", top: 100, alignSelf: "start" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 20 }}>ON THIS PAGE</div>
        {categoryFaqs.map(item => (
          <a key={item.id} href={`#${item.id}`}
            style={{
              display: "block", fontSize: 13, fontWeight: expanded === item.id ? 600 : 400,
              color: expanded === item.id ? C.navy : C.textMuted,
              textDecoration: "none", padding: "8px 0", lineHeight: 1.45,
              transition: "color 150ms",
            }}
            onClick={e => { e.preventDefault(); setExpanded(item.id); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
            <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.question}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}


/* ================================================================ */
/* FOOTER STRIP                                                      */
/* ================================================================ */

function FooterStrip() {
  const m = useMobile();
  return (
    <div style={{ backgroundColor: C.sand, padding: m ? "40px 20px" : "48px 48px", textAlign: "center" }}>
      <p style={{ fontSize: 13, fontWeight: 400, color: C.textMuted, margin: 0, letterSpacing: "0.02em" }}>
        Income Stability Score™ &bull; Powered by fixed scoring system RP-2.0
      </p>
    </div>
  );
}


/* ================================================================ */
/* FINAL CTA                                                         */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 32, ...fadeIn(visible) }}>
          See how your income is built.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Get My Stability Class — Free
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            Under 2 minutes | Instant result | Private by default
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("score");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Fuse.js search engine
  const fuse = useMemo(() => new Fuse(FAQ_DATA, {
    keys: [
      { name: "question", weight: 0.5 },
      { name: "answer", weight: 0.2 },
      { name: "keywords", weight: 0.3 },
    ],
    threshold: 0.4,
    includeScore: true,
  }), []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const expanded = expandQuery(query);
    return fuse.search(expanded).map(r => r.item);
  }, [query, fuse]);

  const isSearching = query.trim().length > 0;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main>
        <HeroSection searchValue={query} onSearch={setQuery} inputRef={inputRef} />

        <div style={{ backgroundColor: C.white, minHeight: 400 }}>
          {isSearching ? (
            <SearchResults results={searchResults} query={query} />
          ) : (
            <BrowseView activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          )}
        </div>

        <FooterStrip />
        <FinalCta />
      </main>
    </div>
  );
}
