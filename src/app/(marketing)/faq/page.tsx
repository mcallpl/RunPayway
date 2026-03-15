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

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

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
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "About the Income Stability Score™",
    items: [
      {
        q: "What does the Income Stability Score™ measure?",
        a: (
          <>
            <p>The Income Stability Score™ measures the structural stability of an income system.</p>
            <p>The score evaluates how income is generated, how diversified it is, how dependent it is on active labor, and how resilient the income structure is likely to be under disruption.</p>
            <p>Scores range from 0 to 100, with higher scores indicating stronger structural income stability.</p>
          </>
        ),
      },
      {
        q: "What factors influence the score?",
        a: (
          <>
            <p>The score is generated using six structural dimensions of income generation:</p>
            <ul>
              <li>recurring revenue base</li>
              <li>income concentration</li>
              <li>income source count</li>
              <li>forward revenue visibility</li>
              <li>earnings variability</li>
              <li>income continuity without active labor</li>
            </ul>
            <p>These dimensions describe the structural characteristics of how income is produced and sustained.</p>
          </>
        ),
      },
      {
        q: "What does a good score look like?",
        a: (
          <>
            <p>Higher scores indicate a more structurally stable income system.</p>
            <p>Scores are interpreted within four classification bands:</p>
            <div className="faq-table">
              <div className="faq-table-row faq-table-header">
                <span>Stability Band</span><span>Score Range</span>
              </div>
              <div className="faq-table-row"><span>Limited</span><span>0–39</span></div>
              <div className="faq-table-row"><span>Developing</span><span>40–59</span></div>
              <div className="faq-table-row"><span>Established</span><span>60–79</span></div>
              <div className="faq-table-row"><span>High</span><span>80–100</span></div>
            </div>
            <p>These bands provide context for interpreting the structural durability of the income system.</p>
          </>
        ),
      },
      {
        q: "Does the score predict future income?",
        a: (
          <>
            <p>No.</p>
            <p>The Income Stability Score™ is a structural classification, not a prediction.</p>
            <p>It evaluates the characteristics of income generation at the time of the assessment based on the information provided by the user.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "About the Assessment",
    items: [
      {
        q: "How long does the assessment take?",
        a: (
          <>
            <p>Most users complete the assessment in under two minutes.</p>
            <p>The diagnostic evaluates six structural factors describing how income is generated and sustained.</p>
          </>
        ),
      },
      {
        q: "What information is required?",
        a: (
          <>
            <p>The assessment asks questions about the structure of income generation, such as the number of income sources, the degree of recurring income, and how dependent income is on active work.</p>
            <p>The assessment does not require detailed financial records or documentation.</p>
          </>
        ),
      },
      {
        q: "Can I retake the assessment?",
        a: (
          <>
            <p>Yes.</p>
            <p>Each new assessment measures the structure of income at the time it is taken.</p>
            <p>Users who want to track how their income structure evolves over time can purchase additional assessments or use the Annual Monitoring plan.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "Assessment Reports",
    items: [
      {
        q: "What is included in the report?",
        a: (
          <>
            <p>Each completed assessment produces a structured report that includes:</p>
            <ul>
              <li>Income Stability Score™ (0–100)</li>
              <li>stability classification band</li>
              <li>structural drivers supporting stability</li>
              <li>structural constraints affecting stability</li>
              <li>industry percentile comparison</li>
              <li>structural improvement path</li>
              <li>official PDF assessment record</li>
            </ul>
            <p>The report provides a structured analysis of the stability characteristics of the income system.</p>
          </>
        ),
      },
      {
        q: "How is the score calculated?",
        a: (
          <>
            <p>Scores are generated using Structural Stability Model RP-1.0.</p>
            <p>The model applies deterministic scoring rules to the structural inputs provided in the assessment.</p>
            <p>Identical inputs under the same model version always produce identical results.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "Assessment Records and Verification",
    items: [
      {
        q: "How can a score be verified?",
        a: (
          <>
            <p>Each issued assessment receives a Record ID and Authorization Code.</p>
            <p>These identifiers allow the assessment record to be verified using the <Link href="/verify" style={{ color: B.purple, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(75,63,174,0.30)" }}>Verify a Score</Link> system.</p>
            <p>Verification confirms that the record was generated by the RunPayway™ model and that the assessment record has not been modified.</p>
          </>
        ),
      },
      {
        q: "Can an issued assessment be changed?",
        a: (
          <>
            <p>No.</p>
            <p>Assessment records are immutable once issued.</p>
            <p>Each record is stored as an append-only entry and cannot be modified, deleted, or regenerated after issuance.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "Privacy and Data Handling",
    items: [
      {
        q: "How is my data handled?",
        a: (
          <>
            <p>Assessment responses are used solely to generate the Income Stability Score™ and the associated diagnostic report.</p>
            <p>The platform uses encrypted transmission and secure processing systems.</p>
            <p>Assessment records are stored for verification purposes but are not publicly accessible.</p>
          </>
        ),
      },
      {
        q: "Is my information shared with third parties?",
        a: (
          <>
            <p>No.</p>
            <p>RunPayway™ does not sell or distribute assessment data.</p>
            <p>Information is used only for generating the diagnostic report and maintaining the verification system.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "Pricing and Plans",
    items: [
      {
        q: "What is the difference between Single Assessment and Annual Monitoring?",
        a: (
          <>
            <p>Single Assessment ($39) provides a one-time measurement of income stability.</p>
            <p>Annual Monitoring ($99) provides three assessments across one year, allowing users to track how their income structure evolves over time.</p>
          </>
        ),
      },
      {
        q: "Do I need an account?",
        a: (
          <>
            <p>Accounts are required only for Annual Monitoring subscribers, who use the RunPayway™ Monitoring Portal to access historical assessments.</p>
            <p>Single Assessment users receive their report immediately after completing the diagnostic.</p>
          </>
        ),
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Accordion item                                                     */
/* ------------------------------------------------------------------ */

function AccordionItem({
  question,
  children,
  isOpen,
  onToggle,
  mobile,
}: {
  question: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  mobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        border: `1px solid ${isOpen ? "rgba(75,63,174,0.18)" : "rgba(14,26,43,0.06)"}`,
        overflow: "hidden",
        transition: "border-color 220ms ease, box-shadow 220ms ease",
        boxShadow: isOpen ? "0 4px 16px rgba(75,63,174,0.06)" : "0 1px 4px rgba(14,26,43,0.03)",
      }}
    >
      <button
        onClick={onToggle}
        onMouseEnter={() => canHover() && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: mobile ? "16px 20px" : "20px 24px",
          background: hovered && !isOpen ? "rgba(14,26,43,0.015)" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 180ms ease",
        }}
      >
        <span
          style={{
            fontSize: mobile ? 15 : 16,
            fontWeight: 600,
            color: B.navy,
            lineHeight: 1.4,
            paddingRight: 16,
          }}
        >
          {question}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 220ms ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
            <path d="M1 1L6 6L11 1" stroke={isOpen ? B.purple : B.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: mobile ? "0 20px 20px" : "0 24px 24px",
          }}
        >
          <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 16 }} />
          <div className="faq-answer">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FaqPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ background: B.sand }}>
      {/* Scoped styles for FAQ answer content */}
      <style>{`
        .faq-answer p {
          font-size: 15px;
          color: ${B.muted};
          line-height: 1.75;
          margin-bottom: 10px;
        }
        .faq-answer p:last-child {
          margin-bottom: 0;
        }
        .faq-answer ul {
          padding: 0;
          margin: 0 0 10px;
          list-style: none;
        }
        .faq-answer ul li {
          font-size: 15px;
          color: ${B.muted};
          line-height: 1.75;
          padding-left: 20px;
          position: relative;
        }
        .faq-answer ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 11px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${B.purple};
        }
        .faq-table {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid ${B.sandDk};
          margin-bottom: 12px;
        }
        .faq-table-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 10px 18px;
          font-size: 14px;
        }
        .faq-table-row:nth-child(even) {
          background: ${B.sand};
        }
        .faq-table-row:nth-child(odd):not(.faq-table-header) {
          background: #FFFFFF;
        }
        .faq-table-header {
          background: ${B.navy} !important;
          color: rgba(255,255,255,0.70);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .faq-table-row span:first-child {
          font-weight: 600;
          color: ${B.navy};
        }
        .faq-table-header span:first-child,
        .faq-table-header span:last-child {
          color: rgba(255,255,255,0.70);
          font-weight: 600;
        }
        .faq-table-row:not(.faq-table-header) span:last-child {
          color: ${B.muted};
          text-align: right;
        }
        .faq-table-header span:last-child {
          text-align: right;
        }
      `}</style>

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
        {/* Grain overlay */}
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
              Support
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
            Frequently Asked Questions
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Common questions about the Income Stability Score™, the assessment process, and how assessment records are generated and verified.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ sections                                                */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 48 : 72,
          paddingBottom: mobile ? 64 : 96,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            display: "flex",
            flexDirection: "column",
            gap: mobile ? 40 : 56,
          }}
        >
          {FAQ_CATEGORIES.map((cat) => {
            const catAnim = useInView();
            return (
              <div key={cat.title} ref={catAnim.ref}>
                {/* Category header */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: B.purple,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                    opacity: catAnim.visible ? 1 : 0,
                    transform: catAnim.visible ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 600ms ease, transform 600ms ease",
                  }}
                >
                  {cat.title}
                </div>

                {/* Items */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    opacity: catAnim.visible ? 1 : 0,
                    transform: catAnim.visible ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 600ms ease 100ms, transform 600ms ease 100ms",
                  }}
                >
                  {cat.items.map((item, i) => {
                    const key = `${cat.title}-${i}`;
                    return (
                      <AccordionItem
                        key={key}
                        question={item.q}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggleItem(key)}
                        mobile={mobile}
                      >
                        {item.a}
                      </AccordionItem>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
