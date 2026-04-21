import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { INDUSTRY_PAGES, getIndustryBySlug } from "@/lib/industry-pages";
import EmailCapture from "@/components/EmailCapture";

const OTHER_COUNT = 6; // how many "other industries" to show at the bottom

export function generateStaticParams() {
  return INDUSTRY_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndustryBySlug(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDesc,
  };
}

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

const HOW_IT_WORKS = [
  {
    num: "1",
    title: "Six structural factors. No documents.",
    desc: "Each factor maps a dimension of how your income is built — not how much you make. No financial accounts, no login required.",
  },
  {
    num: "2",
    title: "Your score is calculated instantly",
    desc: "A 0–100 Income Stability Score™, your stability band, and your top structural risk — generated the moment you finish.",
  },
  {
    num: "3",
    title: "You receive your full report",
    desc: "Score breakdown, constraint analysis, 12-week action plan, and how your income compares to others in your field.",
  },
];

const WHAT_YOU_RECEIVE = [
  "Income Stability Score™ (0–100)",
  "Stability band and what it means for your situation",
  "Top structural constraint identified",
  "How you compare to others in your income type",
  "A 12-week action plan — specific to your structure",
  "Scripts and talking points for advisor conversations",
];

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getIndustryBySlug(slug);
  if (!page) notFound();

  const scoreColorA = page.proofA.score < 45 ? C.risk : C.teal;
  const scoreColorB = page.proofB.score >= 60 ? C.teal : C.purple;

  // Rotate "other industries" by current page's position so each page shows a different set
  const currentIndex = INDUSTRY_PAGES.findIndex((p) => p.slug === slug);
  const rotated = [
    ...INDUSTRY_PAGES.slice(currentIndex + 1),
    ...INDUSTRY_PAGES.slice(0, currentIndex),
  ];
  const others = rotated.slice(0, OTHER_COUNT);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.white, fontFamily: sans }}>
      <style>{`
        .ind-pad { padding-left: 48px; padding-right: 48px; }
        .ind-h1 { font-size: 52px; }
        .ind-hero-sub { font-size: 22px; }
        .ind-proof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .ind-outcomes-grid { display: grid; gap: 0; }
        .ind-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .ind-receive-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .ind-others-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .ind-proof-mobile-gap { margin-bottom: 0; }
        .ind-other-card:hover { border-color: rgba(31,109,122,0.25) !important; background-color: rgba(31,109,122,0.03) !important; }
        .ind-breadcrumb-link:hover { color: #1F6D7A !important; }
        @media (max-width: 768px) {
          .ind-pad { padding-left: 28px; padding-right: 28px; }
          .ind-h1 { font-size: 30px; }
          .ind-hero-sub { font-size: 17px; }
          .ind-proof-grid { display: block; }
          .ind-proof-mobile-gap { margin-bottom: 16px; }
          .ind-steps-grid { display: block; }
          .ind-receive-grid { display: block; }
          .ind-others-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .ind-others-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div
        className="ind-pad"
        style={{
          backgroundColor: C.panelFill,
          borderBottom: `1px solid ${C.borderSoft}`,
          padding: "12px 48px",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Link
            href="/industries"
            className="ind-breadcrumb-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: C.textMuted,
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            All industries
          </Link>
          <span style={{ fontSize: 13, color: C.borderSoft, margin: "0 8px" }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{page.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.navy,
          paddingTop: 96,
          paddingBottom: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
          }}
        />
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 16px",
              borderRadius: 100,
              backgroundColor: "rgba(31,109,122,0.15)",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: C.teal,
              }}
            >
              {page.badge}
            </span>
          </div>

          {/* Constraint as H1 */}
          <h1
            className="ind-h1"
            style={{
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: C.sandText,
              marginBottom: 24,
            }}
          >
            {page.constraint}
          </h1>

          {/* Because */}
          <p
            className="ind-hero-sub"
            style={{
              fontWeight: 400,
              lineHeight: 1.55,
              color: C.sandMuted,
              maxWidth: 620,
              margin: "0 auto 40px",
            }}
          >
            {page.because}
          </p>

          <Link
            href="/begin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 56,
              padding: "0 40px",
              borderRadius: 14,
              backgroundColor: C.teal,
              color: C.white,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(31,109,122,0.30)",
            }}
          >
            Get My Stability Class — Free &rarr;
          </Link>
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "rgba(244,241,234,0.40)",
              letterSpacing: "0.01em",
            }}
          >
            Full report &mdash; $69 &middot; Results in under two minutes &middot; No documents required
          </div>
        </div>
      </section>

      {/* ── Proof Comparison ── */}
      <section
        className="ind-pad"
        style={{ backgroundColor: C.panelFill, paddingTop: 80, paddingBottom: 80 }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            SAME INCOME. DIFFERENT STRUCTURE.
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: C.navy,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            The number on your tax return doesn&rsquo;t tell the whole story.
          </h2>

          <div className="ind-proof-grid">
            {/* Proof A */}
            <div
              className="ind-proof-mobile-gap"
              style={{
                backgroundColor: C.white,
                borderRadius: 16,
                padding: 32,
                border: "1px solid rgba(14,26,43,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  color: C.risk,
                  marginBottom: 12,
                }}
              >
                PROFILE A
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.navy,
                  marginBottom: 8,
                  fontFamily: mono,
                }}
              >
                {page.proofA.income}
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: C.textSecondary,
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {page.proofA.desc}
              </p>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: "rgba(199,70,52,0.06)",
                  border: "1px solid rgba(199,70,52,0.14)",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: scoreColorA }}
                >
                  Income Stability Score™: {page.proofA.score}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMuted,
                    marginTop: 3,
                  }}
                >
                  {page.proofA.band}
                </div>
              </div>
            </div>

            {/* Proof B */}
            <div
              style={{
                backgroundColor: C.white,
                borderRadius: 16,
                padding: 32,
                border: "1px solid rgba(14,26,43,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  color: C.teal,
                  marginBottom: 12,
                }}
              >
                PROFILE B
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.navy,
                  marginBottom: 8,
                  fontFamily: mono,
                }}
              >
                {page.proofB.income}
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: C.textSecondary,
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {page.proofB.desc}
              </p>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: "rgba(31,109,122,0.06)",
                  border: "1px solid rgba(31,109,122,0.14)",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: scoreColorB }}
                >
                  Income Stability Score™: {page.proofB.score}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMuted,
                    marginTop: 3,
                  }}
                >
                  {page.proofB.band}
                </div>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.textMuted,
              textAlign: "center",
              marginTop: 24,
            }}
          >
            Same industry. Same general income level. Completely different structural
            risk.
          </p>
        </div>
      </section>

      {/* ── What Your Score Changes ── */}
      <section
        className="ind-pad"
        style={{ backgroundColor: C.white, paddingTop: 96, paddingBottom: 96 }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.purple,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            WHAT YOUR SCORE CHANGES
          </div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: C.navy,
              textAlign: "center",
              marginBottom: 56,
            }}
          >
            {page.knowHeading}
          </h2>

          <div className="ind-outcomes-grid" style={{ listStyle: "none" }}>
            {page.outcomes.map((outcome, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 24,
                  padding: "28px 0",
                  borderBottom:
                    i < page.outcomes.length - 1
                      ? `1px solid ${C.borderSoft}`
                      : "none",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: C.navy,
                    color: C.sandText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: mono,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.textPrimary,
                      lineHeight: 1.35,
                      marginBottom: 6,
                    }}
                  >
                    {outcome.title}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: C.textSecondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {outcome.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before Your Assessment ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.panelFill,
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            BEFORE YOUR ASSESSMENT
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: C.navy,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Three things worth knowing before you start.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: C.textSecondary,
              textAlign: "center",
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            No documents required. Having these in mind makes your assessment more precise.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {page.prep.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  backgroundColor: C.white,
                  borderRadius: 12,
                  padding: "20px 24px",
                  border: "1px solid rgba(31,109,122,0.12)",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "rgba(31,109,122,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: C.teal,
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: C.textPrimary,
                    lineHeight: 1.55,
                    margin: 0,
                    paddingTop: 3,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className="ind-pad"
        style={{ backgroundColor: C.white, paddingTop: 96, paddingBottom: 96 }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            HOW IT WORKS
          </div>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: C.navy,
              textAlign: "center",
              marginBottom: 56,
            }}
          >
            Under two minutes. No documents.
          </h2>

          <div className="ind-steps-grid">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.num}
                style={{
                  backgroundColor: C.panelFill,
                  borderRadius: 16,
                  padding: 32,
                  marginBottom: 0,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: C.navy,
                    color: C.sandText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: mono,
                    marginBottom: 20,
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.textPrimary,
                    lineHeight: 1.3,
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: C.textSecondary,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Receive ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.navy,
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            WHAT YOU RECEIVE
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: C.sandText,
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Your full report. Delivered the moment you finish.
          </h2>

          <div className="ind-receive-grid">
            {WHAT_YOU_RECEIVE.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "16px 20px",
                  borderRadius: 12,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: 12,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C.teal}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 2 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontSize: 14,
                    color: C.sandMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Report Link ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.navy,
          paddingTop: 0,
          paddingBottom: 32,
          textAlign: "center",
        }}
      >
        <Link
          href="/sample-report"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(244,241,234,0.45)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(244,241,234,0.15)",
            paddingBottom: 2,
          }}
        >
          Not sure what you&rsquo;re getting? See a sample report &rarr;
        </Link>
      </section>

      {/* ── FAQ ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.white,
          paddingTop: 88,
          paddingBottom: 88,
          borderTop: `1px solid ${C.borderSoft}`,
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            COMMON QUESTIONS
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: C.navy,
              textAlign: "center",
              marginBottom: 52,
            }}
          >
            What people ask before they start.
          </h2>

          {[
            {
              q: `Is RunPayway™ relevant to ${page.name.split(" /")[0].toLowerCase()} income specifically?`,
              a: page.because,
            },
            {
              q: "How long does the assessment take?",
              a: "Under two minutes. The assessment evaluates six structural factors about how your income is built — not how much you make. No documents, no financial accounts, no login required.",
            },
            {
              q: "What does the full report cost?",
              a: "$69. You receive your Income Stability Score™ (0–100), your stability band, your top structural constraint, how you compare to others in your income type, a 12-week action plan specific to your structure, and scripts for advisor and lender conversations.",
            },
            {
              q: "How is this different from a credit score?",
              a: "A credit score measures whether you repay what you've borrowed. RunPayway™ measures whether your income is likely to continue — the structure behind the number, not the number itself. Credit scores don't capture concentration risk, contracted forward income, or whether your income resets to zero each month.",
            },
            {
              q: "Do I need to prepare anything before I start?",
              a: "No documents required. If you have a rough sense of what percentage of your income comes from your top client or source, and whether any of your income is contracted forward, you have everything you need. The assessment asks — you answer.",
            },
          ].map((faq, i, arr) => (
            <div
              key={i}
              style={{
                paddingTop: 28,
                paddingBottom: 28,
                borderBottom: i < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.35,
                  marginBottom: 10,
                }}
              >
                {faq.q}
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: C.textSecondary,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Professional Handoff ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.panelFill,
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: C.textSecondary,
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            {page.professionalLabel}
          </p>
          <Link
            href={page.professionalHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: C.teal,
              textDecoration: "none",
              borderBottom: `1px solid rgba(31,109,122,0.30)`,
              paddingBottom: 2,
            }}
          >
            See RunPayway™ for professionals &rarr;
          </Link>
        </div>
      </section>

      {/* ── Email Capture ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.navy,
          paddingTop: 72,
          paddingBottom: 72,
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              marginBottom: 16,
            }}
          >
            NOT READY YET?
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: C.sandText,
              marginBottom: 12,
            }}
          >
            Get the {page.name.split(" /")[0]} income stability guide — free.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: C.sandMuted,
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            A short brief on how {page.name.split(" /")[0].toLowerCase()} income is typically scored, what the structural patterns are, and what separates stable earners from fragile ones.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <EmailCapture variant="inline" source={`industry-${page.slug}`} />
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(244,241,234,0.28)",
              marginTop: 14,
            }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ── Other Industries ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.white,
          paddingTop: 72,
          paddingBottom: 72,
          borderTop: `1px solid ${C.borderSoft}`,
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
              flexWrap: "wrap" as const,
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: C.teal,
                  marginBottom: 6,
                }}
              >
                OTHER INDUSTRIES
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.navy,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Every income type has a different risk profile.
              </h2>
            </div>
            <Link
              href="/industries"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.teal,
                textDecoration: "none",
                borderBottom: "1px solid rgba(31,109,122,0.25)",
                paddingBottom: 2,
                whiteSpace: "nowrap" as const,
              }}
            >
              See all 19 industries &rarr;
            </Link>
          </div>

          <div className="ind-others-grid">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/industries/${other.slug}`}
                className="ind-other-card"
                style={{
                  display: "block",
                  padding: "18px 20px",
                  borderRadius: 12,
                  border: `1px solid ${C.borderSoft}`,
                  textDecoration: "none",
                  backgroundColor: C.panelFill,
                  transition: "border-color 180ms ease, background-color 180ms ease",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.09em",
                    color: C.teal,
                    marginBottom: 6,
                  }}
                >
                  {other.badge}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.textPrimary,
                    lineHeight: 1.25,
                    marginBottom: 4,
                  }}
                >
                  {other.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMuted,
                    lineHeight: 1.45,
                  }}
                >
                  {other.constraint}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.navy,
          paddingTop: 96,
          paddingBottom: 96,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
          }}
        />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              marginBottom: 20,
            }}
          >
            {page.badge}
          </div>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: C.sandText,
              marginBottom: 20,
            }}
          >
            Find out where your income actually stands.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: C.sandMuted,
              lineHeight: 1.55,
              marginBottom: 40,
              maxWidth: 480,
              margin: "0 auto 40px",
            }}
          >
            Six structural factors. Under two minutes. Your Income Stability Score™, top
            constraint, and full report — ready instantly.
          </p>
          <Link
            href="/begin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 60,
              padding: "0 48px",
              borderRadius: 14,
              backgroundColor: C.teal,
              color: C.white,
              fontSize: 17,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(31,109,122,0.35)",
            }}
          >
            Get My Stability Class — Free &rarr;
          </Link>
          <div
            style={{
              marginTop: 20,
              fontSize: 13,
              color: C.sandMuted,
            }}
          >
            No documents. No account required. Results in under two minutes.
          </div>
        </div>
      </section>
    </div>
  );
}
