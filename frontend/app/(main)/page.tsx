"use client";

import DisclosureSection from "@/components/landing/DisclosureSection";

/**
 * Brand Palette (LOCKED)
 * Structural Navy: #0E1A2B
 * Diagnostic Purple: #4B3FAE
 * Structural Teal: #1F6D7A
 * Warm Sand: #F4F1EA
 */

const CHECKOUT_URL = "https://peoplestar.com/RunPayway/api/create_checkout.php";

async function handleCheckout() {
  try {
    const response = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    if (data.success && data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("Unable to start checkout. Please try again.");
    }
  } catch {
    alert("Unable to connect. Please try again.");
  }
}

/* ─── Art Rhythm: Thin Divider ──────────────────────────────────────── */
function Divider({ teal = false }: { teal?: boolean }) {
  return (
    <div
      className="mx-auto"
      style={{
        width: "64px",
        height: "1px",
        backgroundColor: teal
          ? "rgba(31,109,122,0.18)"
          : "rgba(14,26,43,0.08)",
      }}
    />
  );
}

/* ─── Art Rhythm: Vertical Anchor Line (right side) ─────────────────── */
function AnchorLine() {
  return (
    <div
      className="absolute right-[10%] top-0 bottom-0 hidden lg:block"
      style={{
        width: "1px",
        backgroundColor: "rgba(14,26,43,0.08)",
      }}
    />
  );
}

/* ─── Art Rhythm: Ghost Grid Overlay ────────────────────────────────── */
function GhostGrid() {
  return (
    <div
      className="absolute inset-0 hidden lg:block pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(14,26,43,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,26,43,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    />
  );
}

export default function Home() {
  return (
    <main>
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — HERO (Warm Sand Background)
          Art: Vertical anchor line + ghost grid
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F4F1EA" }}
      >
        <AnchorLine />
        <GhostGrid />
        <div
          className="relative z-10 mx-auto"
          style={{
            maxWidth: "1100px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
            paddingTop: "clamp(80px, 12vw, 160px)",
            paddingBottom: "clamp(80px, 12vw, 160px)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 80px)",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#0E1A2B",
              letterSpacing: "-0.02em",
            }}
          >
            The Standard for Revenue Exposure.
          </h1>

          <p
            className="mt-8"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.72)",
              maxWidth: "640px",
            }}
          >
            RunPayway&#8482; issues a formal Payway Rating&#8482; identifying
            whether income runs on systems&mdash;or on direct involvement.
          </p>

          <p
            className="mt-5"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "rgba(14,26,43,0.52)",
              maxWidth: "560px",
            }}
          >
            Revenue can appear strong while remaining structurally exposed.
          </p>

          <div className="mt-10">
            <button
              type="button"
              onClick={handleCheckout}
              className="transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#0E1A2B",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
                padding: "18px 36px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Establish Your Payway Rating&#8482;
            </button>
            <p
              className="mt-3"
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "rgba(14,26,43,0.42)",
              }}
            >
              Version-controlled structural assessment.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — RECOGNITION
          Art: Centered horizontal divider below
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white" style={{ padding: "112px 0" }}>
        <div
          className="mx-auto text-center"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 600,
              lineHeight: 1.15,
              color: "#0E1A2B",
            }}
          >
            Revenue performance is measured.
            <br />
            Revenue exposure rarely is.
          </p>
          <p
            className="mt-6"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.62)",
            }}
          >
            Exposure is often invisible&mdash;until it becomes costly.
          </p>
          <div className="mt-12">
            <Divider />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — WHY NOW
          Art: Negative space emphasis (no motif)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white" style={{ padding: "112px 0" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            Revenue models are more dynamic than ever.
            <br />
            Continuity has become harder to see.
          </p>
          <p
            className="mt-6"
            style={{
              fontSize: "clamp(15px, 1.8vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(14,26,43,0.52)",
            }}
          >
            As systems scale and roles evolve, structural dependency becomes less
            visible&mdash;not less real.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — CATEGORY CLAIM
          Art: Teal accent rule above
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white" style={{ padding: "112px 0" }}>
        <div
          className="mx-auto text-center"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <Divider teal />
          <p
            className="mt-10"
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 600,
              lineHeight: 1.15,
              color: "#0E1A2B",
            }}
          >
            Revenue exposure has never had a formal standard.
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#0E1A2B",
            }}
          >
            Until now.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — PRESSURE CONDITIONS
          Art: Vertical anchor line
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F4F1EA", padding: "112px 0" }}
      >
        <AnchorLine />
        <div
          className="relative z-10 mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <div
            className="space-y-3"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(14,26,43,0.68)",
            }}
          >
            <p>Extended absence.</p>
            <p>Rapid growth.</p>
            <p>Client concentration shifts.</p>
            <p>Regulatory change.</p>
            <p>Delegation requirements.</p>
          </div>
          <p
            className="mt-8"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 600,
              lineHeight: 1.4,
              color: "#0E1A2B",
            }}
          >
            Dependency becomes visible under pressure.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — DEFINITION
          Art: Centered horizontal divider above
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white" style={{ padding: "112px 0" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <Divider />
          <p
            className="mt-10"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "rgba(14,26,43,0.42)",
            }}
          >
            Definition
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "clamp(24px, 3.5vw, 28px)",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#0E1A2B",
            }}
          >
            Revenue Exposure
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            The degree to which income continuity depends on direct involvement.
          </p>
          <p
            className="mt-3"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "rgba(14,26,43,0.48)",
            }}
          >
            Measured on a normalized 0&ndash;100 structural scale.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7 — MEASUREMENT FRAMEWORK
          Art: Ghost grid overlay
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-white"
        style={{ padding: "112px 0" }}
      >
        <GhostGrid />
        <div
          className="relative z-10 mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            Income structure is evaluated across three domains:
          </p>
          <div
            className="mt-6 space-y-2"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 600,
              color: "#0E1A2B",
            }}
          >
            <p>Core Revenue Flow</p>
            <p>Structural Modifiers</p>
            <p>Stability Layer</p>
          </div>
          <div
            className="mt-8 space-y-1"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "rgba(14,26,43,0.52)",
            }}
          >
            <p>All responses are required.</p>
            <p>Scoring is integer-weighted.</p>
            <p>Output is strictly normalized.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8 — THE RATING
          Art: Teal accent rule above
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="bg-white"
        style={{ padding: "112px 0" }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <Divider teal />
          <p
            className="mt-10"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            The Payway Rating&#8482; is a structural exposure score.
          </p>
          <div
            className="mt-4 space-y-1"
            style={{
              fontSize: "clamp(15px, 1.8vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(14,26,43,0.58)",
            }}
          >
            <p>Higher ratings indicate system-supported income.</p>
            <p>Lower ratings indicate presence-dependent income.</p>
          </div>
          <p
            className="mt-6"
            style={{
              fontSize: "clamp(15px, 1.8vw, 16px)",
              fontWeight: 600,
              color: "#0E1A2B",
            }}
          >
            It defines the current continuity condition.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9 — FIXED BANDS
          Art: Negative space emphasis
      ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: "#F4F1EA", padding: "112px 0" }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            Every score falls into a defined classification band.
          </p>
          <div
            className="mt-8 space-y-4"
            style={{
              fontSize: "clamp(15px, 1.8vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "rgba(14,26,43,0.68)",
            }}
          >
            <p>
              <span style={{ fontWeight: 600, color: "#0E1A2B" }}>
                80&ndash;100
              </span>{" "}
              &mdash; Structurally Supported
            </p>
            <p>
              <span style={{ fontWeight: 600, color: "#0E1A2B" }}>
                60&ndash;79
              </span>{" "}
              &mdash; Mixed Support
            </p>
            <p>
              <span style={{ fontWeight: 600, color: "#0E1A2B" }}>
                40&ndash;59
              </span>{" "}
              &mdash; Attention-Weighted
            </p>
            <p>
              <span style={{ fontWeight: 600, color: "#0E1A2B" }}>
                0&ndash;39
              </span>{" "}
              &mdash; Attention-Dependent
            </p>
          </div>
          <p
            className="mt-8"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "rgba(14,26,43,0.48)",
            }}
          >
            Band thresholds are fixed. Movement reflects structural change.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 10 — DELIVERABLE
          Art: Centered horizontal divider above
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white" style={{ padding: "112px 0" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <Divider />
          <p
            className="mt-10"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            Each assessment produces a dated structural report.
          </p>
          <p
            className="mt-3"
            style={{
              fontSize: "clamp(15px, 1.8vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.62)",
            }}
          >
            Includes:
          </p>
          <ul
            className="mt-4 space-y-2"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "rgba(14,26,43,0.58)",
              listStyle: "none",
              padding: 0,
            }}
          >
            <li>Payway Rating&#8482; (0&ndash;100)</li>
            <li>Dependency Classification</li>
            <li>Structural Composition Signal</li>
            <li>Pressure Sensitivity Index</li>
            <li>Model Version (RP-1.0)</li>
            <li>Unique Assessment ID</li>
          </ul>
          <p
            className="mt-8"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "rgba(14,26,43,0.48)",
            }}
          >
            Identical inputs under the same model version produce identical
            outputs.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 11 — CALIBRATION
          Art: Vertical anchor line
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-white"
        style={{ padding: "112px 0" }}
      >
        <AnchorLine />
        <div
          className="relative z-10 mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            Assessments are calibrated to:
          </p>
          <div
            className="mt-6 space-y-2"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 600,
              color: "#0E1A2B",
            }}
          >
            <p>Industry</p>
            <p>Revenue Model</p>
            <p>Role</p>
          </div>
          <div
            className="mt-8 space-y-1"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "rgba(14,26,43,0.52)",
            }}
          >
            <p>Calibration adjusts structural emphasis.</p>
            <p>It does not alter deterministic scoring logic.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 12 — MODEL INTEGRITY
          Art: Teal accent rule above
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white" style={{ padding: "112px 0" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <Divider teal />
          <div
            className="mt-10 space-y-1"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: "rgba(14,26,43,0.72)",
            }}
          >
            <p>One-time structural measurement.</p>
            <p>Version-controlled output.</p>
          </div>
          <p
            className="mt-6"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(14,26,43,0.52)",
            }}
          >
            The assessment does not provide financial, legal, or investment
            advice.
          </p>
          <p
            className="mt-2"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 600,
              color: "#0E1A2B",
            }}
          >
            It provides structural clarity.
          </p>
          <p
            className="mt-6"
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "rgba(14,26,43,0.38)",
            }}
          >
            Model Version: RP-1.0
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 13 — ACCESS (CTA)
          Art: Ghost grid overlay
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0E1A2B", padding: "112px 0" }}
      >
        <GhostGrid />
        <div
          className="relative z-10 mx-auto text-center"
          style={{
            maxWidth: "720px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 600,
              lineHeight: 1.15,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Access the Payway Rating&#8482;.
          </p>
          <p
            className="mt-5"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.58)",
            }}
          >
            $79&mdash;formal structural assessment.
          </p>
          <p
            className="mt-2"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.42)",
            }}
          >
            Instant digital report.
          </p>
          <div className="mt-10">
            <button
              type="button"
              onClick={handleCheckout}
              className="transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#0E1A2B",
                fontSize: "16px",
                fontWeight: 600,
                padding: "18px 36px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Establish Your Payway Rating&#8482;
            </button>
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <DisclosureSection />
    </main>
  );
}
