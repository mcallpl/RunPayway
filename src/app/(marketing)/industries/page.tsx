import type { Metadata } from "next";
import Link from "next/link";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";
import { C, sans, mono } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Income Stability by Industry — RunPayway™",
  description:
    "Income is built differently depending on how you earn. Find your industry to see the structural patterns, score range, and what RunPayway™ measures for your specific income type.",
};

export default function IndustriesIndexPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.white, fontFamily: sans }}>
      <style>{`
        .ind-pad { padding-left: 48px; padding-right: 48px; }
        .ind-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .ind-card {
          transition: box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease;
        }
        .ind-card:hover {
          box-shadow: 0 8px 32px rgba(14,26,43,0.10);
          transform: translateY(-2px);
          border-color: rgba(31,109,122,0.22) !important;
        }
        .ind-card:hover .ind-card-arrow {
          opacity: 1;
          transform: translateX(4px);
        }
        .ind-scroll-cta:hover {
          color: rgba(244,241,234,0.85) !important;
        }
        @media (max-width: 960px) {
          .ind-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .ind-pad { padding-left: 24px; padding-right: 24px; }
          .ind-grid { grid-template-columns: 1fr; }
        }
      `}</style>

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
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>

          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 16px",
              borderRadius: 100,
              backgroundColor: "rgba(31,109,122,0.15)",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: C.teal,
              }}
            >
              INCOME STABILITY BY INDUSTRY
            </span>
          </div>

          {/* H1 — specificity, not risk */}
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: C.sandText,
              marginBottom: 20,
            }}
          >
            Income is built differently in every industry. Find yours.
          </h1>

          {/* Sub — clarity framing */}
          <p
            style={{
              fontSize: "clamp(16px, 2.2vw, 19px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: C.sandMuted,
              maxWidth: 540,
              margin: "0 auto 36px",
            }}
          >
            How your income is structured depends entirely on how you earn.
            Select your industry to see the specific patterns, what the score
            range looks like, and what structural changes move the needle for
            someone who earns the way you do.
          </p>

          {/* Scroll CTA — discovery, not conversion */}
          <a
            href="#industries-grid"
            className="ind-scroll-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
              color: C.sandMuted,
              textDecoration: "none",
              transition: "color 180ms ease",
            }}
          >
            Explore all industries
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── Industry grid ── */}
      <section
        id="industries-grid"
        className="ind-pad"
        style={{
          backgroundColor: C.white,
          paddingTop: 80,
          paddingBottom: 96,
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="ind-grid">
            {INDUSTRY_PAGES.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="ind-card"
                style={{
                  display: "block",
                  backgroundColor: C.panelFill,
                  borderRadius: 16,
                  padding: "28px 28px 22px",
                  border: `1px solid ${C.borderSoft}`,
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                {/* Eyebrow */}
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    color: C.teal,
                    marginBottom: 10,
                  }}
                >
                  {industry.badge}
                </div>

                {/* Industry name */}
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.textPrimary,
                    lineHeight: 1.2,
                    marginBottom: 20,
                  }}
                >
                  {industry.name}
                </div>

                {/* Score range — the proof, no words needed */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 22,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.risk,
                      backgroundColor: "rgba(199,70,52,0.07)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontFamily: mono,
                    }}
                  >
                    {industry.proofA.score}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
                    vs
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.teal,
                      backgroundColor: "rgba(31,109,122,0.07)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontFamily: mono,
                    }}
                  >
                    {industry.proofB.score}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
                    same income
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${C.borderSoft}`,
                    paddingTop: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.teal,
                    }}
                  >
                    See score profile
                  </span>
                  <span
                    className="ind-card-arrow"
                    style={{
                      fontSize: 14,
                      color: C.teal,
                      opacity: 0,
                      transform: "translateX(0)",
                      transition: "opacity 200ms ease, transform 200ms ease",
                    }}
                  >
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="ind-pad"
        style={{
          backgroundColor: C.navy,
          paddingTop: 80,
          paddingBottom: 80,
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
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: C.sandText,
              marginBottom: 14,
            }}
          >
            Ready to see your score?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.sandMuted,
              lineHeight: 1.6,
              marginBottom: 36,
            }}
          >
            The assessment evaluates six structural factors about how your income
            is built. Your score, stability band, and full report — delivered
            in under two minutes.
          </p>
          <Link
            href="/begin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 56,
              padding: "0 44px",
              borderRadius: 14,
              backgroundColor: C.teal,
              color: C.white,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(31,109,122,0.35)",
            }}
          >
            Get My Score — Free &rarr;
          </Link>
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "rgba(244,241,234,0.35)",
            }}
          >
            $69 &middot; No documents required &middot; Results instantly
          </div>
        </div>
      </section>
    </div>
  );
}
