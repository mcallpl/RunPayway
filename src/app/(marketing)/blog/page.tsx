"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
};

const sectionPx = (m: boolean) => m ? 24 : 48;
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';


/* ================================================================ */
/* ARTICLE DATA                                                      */
/* ================================================================ */

const ARTICLES = [
  {
    slug: "post-tax-season-income-review",
    title: "Post-Tax-Season Income Review: 5 Stability Gaps Most Owners Overlook",
    excerpt: "Your tax return shows what you made. It doesn't tell you if your income is stable. Here are the 5 gaps keeping you fragile—and what to do about them.",
    category: "STRATEGY",
    readTime: "12 min read",
    date: "April 21, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "the-income-stability-gap",
    title: "The Income Stability Gap: What Your Accountant, Advisor, and Bank All Miss",
    excerpt: "Three professionals look at your money. None of them measure the one thing that determines whether your income survives next quarter.",
    category: "INSIGHT",
    readTime: "8 min read",
    date: "April 12, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "what-is-income-stability",
    title: "What Is Income Stability \u2014 And Why Nobody Measures It",
    excerpt: "Credit scores measure borrowing. Income verification measures amounts. Nobody measures how income is built. That gap has consequences.",
    category: "FUNDAMENTALS",
    readTime: "7 min read",
    date: "April 8, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "hidden-risk-in-commission-income",
    title: "The Hidden Structural Risk in Commission-Based Income",
    excerpt: "Commission earners often appear successful on paper while operating one of the most fragile income structures in the modern economy.",
    category: "ANALYSIS",
    readTime: "8 min read",
    date: "April 3, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "recurring-revenue-for-service-businesses",
    title: "Why Recurring Revenue Changes Everything for Service Businesses",
    excerpt: "The single most impactful structural change a service business can make is converting project-based work to recurring arrangements.",
    category: "STRATEGY",
    readTime: "7 min read",
    date: "April 1, 2026",
    author: "RunPayway Research",
  },
];


/* ================================================================ */
/* HERO                                                              */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 148, paddingBottom: m ? 56 : 80, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: mono, fontSize: m ? 11 : 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          RESEARCH &amp; INSIGHTS
        </div>
        <h1 style={{ fontSize: m ? 30 : 56, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 20, ...fadeIn(visible, 50) }}>
          The Structural Income Brief
        </h1>
        <p style={{ fontSize: m ? 17 : 20, fontWeight: 400, lineHeight: 1.55, color: C.textSecondary, maxWidth: 620, margin: "0 auto", ...fadeIn(visible, 100) }}>
          Data-driven analysis of income stability patterns, structural risk, and what defines resilient income.
        </p>
      </div>
    </header>
  );
}


/* ================================================================ */
/* ARTICLE CARD                                                      */
/* ================================================================ */

function ArticleCard({ article, index }: { article: typeof ARTICLES[number]; index: number }) {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref} style={{ ...fadeIn(visible, index * 80) }}>
      <Link
        href={`/blog/${article.slug}`}
        style={{ textDecoration: "none", display: "block" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <article style={{
          backgroundColor: C.white,
          border: `1px solid ${hovered ? "rgba(14,26,43,0.12)" : "rgba(14,26,43,0.06)"}`,
          borderRadius: 16,
          padding: m ? 24 : 32,
          transition: "border-color 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1), transform 280ms cubic-bezier(0.22,1,0.36,1)",
          boxShadow: hovered ? "0 12px 32px rgba(14,26,43,0.08)" : "0 4px 16px rgba(14,26,43,0.03)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          cursor: "pointer",
        }}>
          {/* Category tag */}
          <div style={{
            fontFamily: mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: C.teal,
            marginBottom: 16,
          }}>
            {article.category}
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: m ? 20 : 22,
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            color: C.navy,
            marginBottom: 12,
          }}>
            {article.title}
          </h2>

          {/* Excerpt */}
          <p style={{
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.6,
            color: C.textSecondary,
            marginBottom: 20,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}>
            {article.excerpt}
          </p>

          {/* Meta row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 500, color: C.textMuted }}>{article.readTime}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: C.textMuted, flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 500, color: C.textMuted }}>{article.date}</span>
            </div>
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: hovered ? C.purple : C.teal,
              transition: "color 280ms cubic-bezier(0.22,1,0.36,1)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              Read
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)", transform: hovered ? "translateX(3px)" : "translateX(0)" }}>
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}


/* ================================================================ */
/* ARTICLES GRID                                                     */
/* ================================================================ */

function ArticlesGrid() {
  const m = useMobile();

  return (
    <section style={{ backgroundColor: C.white, paddingTop: m ? 48 : 72, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: m ? "1fr" : "1fr 1fr",
        gap: m ? 20 : 28,
      }}>
        {ARTICLES.map((article, i) => (
          <ArticleCard key={article.slug} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}


/* ================================================================ */
/* CTA                                                               */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 80 : 120, paddingBottom: m ? 80 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 12, ...fadeIn(visible) }}>
          Income has a structure.
        </p>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 32, ...fadeIn(visible, 60) }}>
          See how yours behaves&mdash;{m ? " " : <br />}and decide what to do next.
        </h2>
        <div style={{ display: "flex", flexDirection: m ? "column" : "row", alignItems: "center", gap: m ? 12 : 16, justifyContent: "center", ...fadeIn(visible, 160) }}>
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
          <a href="https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.navy, color: C.white,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.12)",
            border: `1px solid ${C.navy}`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
            Get Your Full Report — $69
          </a>
        </div>
        <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 20, textAlign: "center" }}>
          Free analysis under 2 minutes | Paid report includes roadmap & scripts
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function BlogPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 8 }}>
          <Link href="/learn" style={{ fontSize: 14, fontWeight: 600, color: "#1F6D7A", textDecoration: "none" }}>
            Looking for in-depth guides? Visit the Learn Center →
          </Link>
        </div>
        <ArticlesGrid />
        <FinalCta />
      </main>
    </div>
  );
}
