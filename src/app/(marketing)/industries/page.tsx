import type { Metadata } from "next";
import Link from "next/link";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

export const metadata: Metadata = {
  title: "Income Stability Scores by Industry — RunPayway™",
  description:
    "Every industry has a different income risk profile. Find yours — see the structural constraints, proof comparisons, and what your score changes for your specific income type.",
};

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
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
};

const sans = '"Inter", system-ui, -apple-system, sans-serif';

export default function IndustriesIndexPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.white, fontFamily: sans }}>
      <style>{`
        .ind-index-pad { padding-left: 48px; padding-right: 48px; }
        .ind-index-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .ind-card:hover {
          box-shadow: 0 8px 32px rgba(14,26,43,0.10);
          transform: translateY(-2px);
          border-color: rgba(31,109,122,0.20) !important;
        }
        .ind-card { transition: box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease; }
        .ind-card:hover .ind-card-arrow { opacity: 1; transform: translateX(3px); }
        @media (max-width: 900px) {
          .ind-index-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .ind-index-pad { padding-left: 24px; padding-right: 24px; }
          .ind-index-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <section
        className="ind-index-pad"
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
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
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
                letterSpacing: "0.06em",
                color: C.teal,
              }}
            >
              INCOME STABILITY BY INDUSTRY
            </span>
          </div>
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
            Every industry has a different income risk profile.
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: C.sandMuted,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            The same income amount can be highly stable or structurally fragile
            depending on how it&rsquo;s built. Find your industry to see what
            your specific risk profile looks like.
          </p>
          <Link
            href="/begin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              padding: "0 36px",
              borderRadius: 12,
              backgroundColor: C.teal,
              color: C.white,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(31,109,122,0.30)",
            }}
          >
            Get My Score &rarr;
          </Link>
        </div>
      </section>

      {/* Industry grid */}
      <section
        className="ind-index-pad"
        style={{
          backgroundColor: C.white,
          paddingTop: 80,
          paddingBottom: 96,
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="ind-index-grid">
            {INDUSTRY_PAGES.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="ind-card"
                style={{
                  display: "block",
                  backgroundColor: C.panelFill,
                  borderRadius: 16,
                  padding: "28px 28px 24px",
                  border: "1px solid rgba(14,26,43,0.06)",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                {/* Badge */}
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    color: C.teal,
                    marginBottom: 12,
                  }}
                >
                  {industry.badge}
                </div>

                {/* Name */}
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.textPrimary,
                    lineHeight: 1.2,
                    marginBottom: 8,
                  }}
                >
                  {industry.name}
                </div>

                {/* Constraint */}
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.textMuted,
                    lineHeight: 1.5,
                    marginBottom: 20,
                  }}
                >
                  {industry.constraint}
                </div>

                {/* Proof score range */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#C74634",
                      backgroundColor: "rgba(199,70,52,0.07)",
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}
                  >
                    Score: {industry.proofA.score}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textMuted,
                    }}
                  >
                    vs
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.teal,
                      backgroundColor: "rgba(31,109,122,0.07)",
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}
                  >
                    Score: {industry.proofB.score}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textMuted,
                      marginLeft: 2,
                    }}
                  >
                    same income
                  </div>
                </div>

                {/* Footer row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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

      {/* Bottom CTA */}
      <section
        className="ind-index-pad"
        style={{
          backgroundColor: C.navy,
          paddingTop: 80,
          paddingBottom: 80,
          position: "relative",
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
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 34px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: C.sandText,
              marginBottom: 16,
            }}
          >
            Don&rsquo;t know your industry?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.sandMuted,
              lineHeight: 1.55,
              marginBottom: 36,
            }}
          >
            The assessment asks directly. Answer six questions about how your
            income is structured. You&rsquo;ll get your score, stability band,
            and full report in under two minutes.
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
            Get My Score &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
