"use client";

import { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  sand: "#F5F2EC",
  offWhite: "#FAFAF8",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  gradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1A7A6D 100%)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1A7A6D",
};

const STRIPE_SINGLE = "https://buy.stripe.com/7sY8wHeNid726Bs8YV2Nq04";
const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`;

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */
const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover)").matches;

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

function useAnimatedCounter(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const animated = useRef(false);
  useEffect(() => {
    if (!active || animated.current) return;
    animated.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

/* ------------------------------------------------------------------ */
/*  Shared card wrapper                                                */
/* ------------------------------------------------------------------ */
function ReportCard({
  children,
  visible,
  delay = 0,
  mobile,
  maxHeight,
}: {
  children: React.ReactNode;
  visible: boolean;
  delay?: number;
  mobile: boolean;
  maxHeight?: number;
}) {
  return (
    <div
      style={{
        maxWidth: 620,
        backgroundColor: "#ffffff",
        border: "1px solid rgba(14,26,43,0.06)",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(14,26,43,0.05), 0 1px 4px rgba(14,26,43,0.03)",
        padding: mobile ? 24 : 32,
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.4s ease-out ${visible ? 0 : delay}ms`,
        maxHeight: maxHeight || undefined,
      }}
    >
      {/* Gradient accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.purple}, ${B.teal})` }} />
      {children}
      {/* Bottom fade overlay — creates "peek" effect */}
      {maxHeight && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, transparent 0%, #F8F6F2 100%)", pointerEvents: "none" }} />
      )}
    </div>
  );
}


function CardFooter({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 28,
        paddingTop: 16,
        borderTop: "1px solid rgba(14,26,43,0.06)",
      }}
    >
      <span style={{ fontSize: 11, color: B.light, fontWeight: 500 }}>
        {left}
      </span>
      <span style={{ fontSize: 11, color: B.light, fontWeight: 500 }}>
        {right}
      </span>
    </div>
  );
}

/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const animatedScore = useAnimatedCounter(78, visible, 1800);

  return (
    <section
      ref={ref}
      aria-label="Sample Report Hero"
      style={{
        background: B.navy,
        position: "relative",
        overflow: "hidden",
        minHeight: mobile ? "70vh" : "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{FONT_IMPORT}</style>
      {/* Atmospheric glows */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: mobile ? 500 : 900, height: mobile ? 500 : 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,122,109,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: `0 ${mobile ? 28 : 48}px`, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "opacity 1s ease-out, transform 1s ease-out" }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 4, background: "rgba(75,63,174,0.15)", border: "1px solid rgba(75,63,174,0.25)", marginBottom: 32 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.45)" }}>Sample Report &#183; Consulting Profile</span>
          </div>

          {/* Animated score */}
          <div style={{ fontSize: mobile ? 72 : 96, fontWeight: 600, color: "#F4F1EA", lineHeight: 1, marginBottom: 8, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
            {animatedScore}
          </div>
          <div style={{ fontSize: 14, color: "rgba(244,241,234,0.35)", marginBottom: 32 }}>out of 100 &middot; High Stability</div>

          <h1 style={{ fontSize: mobile ? 28 : 42, fontFamily: DISPLAY_FONT, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.08, letterSpacing: "-0.025em", marginBottom: 16 }}>
            This is what your report looks like.
          </h1>
          <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 40px" }}>
            Six pages. Interactive simulator. Ready-to-send scripts. Every number is yours.
          </p>

          {/* Scroll indicator */}
          <div style={{ width: 1, height: 48, background: "linear-gradient(180deg, rgba(244,241,234,0.20) 0%, transparent 100%)", margin: "0 auto", opacity: visible ? 1 : 0, transition: "opacity 1.5s ease-out 800ms" }} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PAGE 1: YOUR SCORE — FULL REVEAL                                    */
/* ================================================================== */
function Page1Preview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  return (
    <div ref={ref}>
      <PagePreview
        pageNum="1" title="Your Score" question="Where do I stand?"
        description="Your exact number, your stability band, what it means for your daily life with your actual data points, and the single most important thing to fix — with projected score gain."
        bullets={["Your 0–100 Income Stability Score\u2122 with band classification", "Plain-English consequence framing with your actual numbers", "The One Thing That Matters Most — your highest-leverage fix"]}
        alignRight={true} visible={visible} mobile={mobile}
        cardContent={<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8, paddingBottom: 10, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: B.navy }}>RUNPAYWAY&trade;</span>
            <span style={{ fontSize: 10, color: B.light }}>Model RP-2.0</span>
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 6 }}>YOUR INCOME STABILITY REPORT</div>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 12 }}>Your Score</h3>
          <div style={{ fontSize: 48, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 6 }}>78</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: B.bandHigh }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: B.bandHigh }}>High Stability</span>
          </div>
          <div style={{ display: "flex", gap: 2, height: 6, marginBottom: 12 }}>
            {[{ w: 30 }, { w: 20 }, { w: 25 }, { w: 25 }].map((seg, i) => (
              <div key={i} style={{ width: `${seg.w}%`, backgroundColor: [B.bandLimited, B.bandDeveloping, B.bandEstablished, B.bandHigh][i], borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: i === 3 ? 1 : 0.25 }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: B.muted, lineHeight: 1.5, margin: 0 }}>The income structure is strong, with substantial protection already in place.</p>
        </>}
      />
    </div>
  );
}

/* ================================================================== */
/* PAGES 2-5: EDITORIAL LAYOUT WITH TRUNCATED PREVIEWS                 */
/* ================================================================== */
function PagePreview({ pageNum, title, question, description, bullets, cardContent, alignRight, visible, mobile, dark }: {
  pageNum: string; title: string; question: string; description: string; bullets: string[]; cardContent: React.ReactNode; alignRight: boolean; visible: boolean; mobile: boolean; dark?: boolean;
}) {
  const textColor = dark ? "#F4F1EA" : B.navy;
  const mutedColor = dark ? "rgba(244,241,234,0.65)" : "rgba(14,26,43,0.55)";
  const bulletColor = dark ? "rgba(244,241,234,0.50)" : "rgba(14,26,43,0.50)";
  const dotColor = dark ? B.teal : B.teal;
  const labelColor = dark ? "rgba(244,241,234,0.50)" : B.teal;

  const content = (
    <div style={{ flex: 1, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: mobile ? 36 : 48, fontFamily: DISPLAY_FONT, fontWeight: 400, color: dark ? "rgba(244,241,234,0.15)" : "rgba(14,26,43,0.06)", lineHeight: 1 }}>{pageNum}</span>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: labelColor }}>PAGE {pageNum}</span>
      </div>
      <div style={{ fontSize: 15, color: mutedColor, fontStyle: "italic", marginBottom: 14, lineHeight: 1.5 }}>{question}</div>
      <h3 style={{ fontSize: mobile ? 26 : 34, fontFamily: DISPLAY_FONT, fontWeight: 400, color: textColor, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 18 }}>{title}</h3>
      <p style={{ fontSize: 15, color: mutedColor, lineHeight: 1.7, marginBottom: 28 }}>{description}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bullets.map((b) => (
          <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dotColor, marginTop: 7, flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: bulletColor, lineHeight: 1.6 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const card = (
    <div style={{ flex: 1, maxWidth: mobile ? undefined : 400 }}>
      <ReportCard visible={visible} mobile={mobile} delay={200} maxHeight={340}>
        {cardContent}
      </ReportCard>
    </div>
  );

  const bg = dark ? B.navy : undefined;
  const sectionBgs = ["#F8F6F2", "#FFFFFF", "#F8F6F2", "#FFFFFF", "#F8F6F2"];
  const sectionBg = bg || sectionBgs[parseInt(pageNum) - 1] || "#F8F6F2";

  return (
    <section style={{ backgroundColor: sectionBg, paddingTop: mobile ? 56 : 96, paddingBottom: mobile ? 56 : 96, paddingLeft: mobile ? 28 : 48, paddingRight: mobile ? 28 : 48 }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", display: mobile ? "block" : "flex", alignItems: "center", gap: 64 }}>
        {mobile || !alignRight ? <>{content}<div style={{ height: mobile ? 36 : 0 }} />{card}</> : <>{card}<div style={{ width: 64 }} />{content}</>}
      </div>
    </section>
  );
}

function Page2Preview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  return (
    <div ref={ref}>
      <PagePreview
        pageNum="2" title="How Your Income Is Built" question="How is my income structured?"
        description="Your income composition (active vs. recurring vs. passive), stress test impact, continuity window, and how you compare to actual industry peers."
        bullets={["Income structure bar: what percentage requires your daily work", "Stress test: exact score drop if your biggest source disappears", "Peer comparison: your score vs. actual industry averages with outlier dimensions"]}
        alignRight={false} visible={visible} mobile={mobile}
        cardContent={<>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 8, marginTop: 8 }}>How Your Income Is Built</h3>
          <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 8, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "26%", backgroundColor: B.navy }} />
            <div style={{ width: "22%", backgroundColor: B.light }} />
            <div style={{ width: "52%", backgroundColor: B.teal }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 10, color: B.navy }}>Active 26%</span>
            <span style={{ fontSize: 10, color: B.light }}>Repeatable 22%</span>
            <span style={{ fontSize: 10, color: B.teal }}>Passive 52%</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 4 }}>WHAT IS WORKING</div>
              <p style={{ fontSize: 10, color: B.muted, margin: 0, lineHeight: 1.5 }}>Strong recurring base. Focus: refinement.</p>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 4 }}>BIGGEST WEAKNESS</div>
              <p style={{ fontSize: 10, color: B.muted, margin: 0, lineHeight: 1.5 }}>Source concentration still too high.</p>
            </div>
          </div>
        </>}
      />
    </div>
  );
}

function Page3Preview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  return (
    <div ref={ref}>
      <PagePreview
        pageNum="3" title="Your Biggest Risks" question="What could go wrong?"
        description="The scenarios that would hurt you most — ranked by severity with exact score drops. Plus predictive warnings about mistakes you are likely to make next."
        bullets={["Top 3 stress scenarios ranked by severity with score-drop projections", "Predictive warnings: what people in your position typically do wrong next", "Urgency framing with your actual runway and stress test numbers"]}
        alignRight={true} visible={visible} mobile={mobile} dark
        cardContent={<>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 12, marginTop: 8 }}>Your Biggest Risks</h3>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>WHAT COULD HURT YOUR SCORE MOST</div>
          {[{ sev: "HIGH", t: "You are unable to work for an extended period", drop: "78/100 → 56/100" }, { sev: "MODERATE", t: "Your largest client leaves", drop: "78/100 → 62/100" }, { sev: "LOW", t: "A seasonal slowdown reduces income", drop: "78/100 → 72/100" }].map((r) => (
            <div key={r.t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(14,26,43,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: r.sev === "HIGH" ? B.bandLimited : r.sev === "MODERATE" ? B.bandDeveloping : B.muted, minWidth: 52 }}>{r.sev}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: B.navy }}>{r.t}</span>
              </div>
              <span style={{ fontSize: 10, color: B.muted }}>{r.drop}</span>
            </div>
          ))}
        </>}
      />
    </div>
  );
}

function Page4Preview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  return (
    <div ref={ref}>
      <PagePreview
        pageNum="4" title="Your Income Deep Dive" question="How deep does it go?"
        description="Six dimensions scored, fragility classified, cross-factor effects explained, surprising insights surfaced, and your income system mapped visually."
        bullets={["Six structural indicators — each scored out of 100 with a progress bar", "Surprising insights: non-obvious findings from your data", "Income system map: sources, recurring/forward/passive strength bars, risk flags"]}
        alignRight={false} visible={visible} mobile={mobile}
        cardContent={<>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 12, marginTop: 8 }}>Your Income Deep Dive</h3>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>STRUCTURAL INDICATORS</div>
          {[{ label: "Income Persistence", pct: 82, color: B.teal }, { label: "Source Independence", pct: 55, color: B.light }, { label: "Forward Visibility", pct: 71, color: B.teal }].map((ind) => (
            <div key={ind.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: B.navy }}>{ind.label}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: ind.pct >= 60 ? B.teal : B.bandDeveloping }}>{ind.pct}/100</span>
              </div>
              <div style={{ height: 4, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${ind.pct}%`, backgroundColor: ind.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1, backgroundColor: B.sand, borderRadius: 4, padding: "8px 10px" }}>
              <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 2 }}>FRAGILITY</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.teal }}>Supported</div>
            </div>
            <div style={{ flex: 1, backgroundColor: B.sand, borderRadius: 4, padding: "8px 10px" }}>
              <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 2 }}>CONFIDENCE</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.teal }}>High</div>
            </div>
          </div>
        </>}
      />
    </div>
  );
}

function Page5Preview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  return (
    <div ref={ref}>
      <PagePreview
        pageNum="5" title="Your Action Plan" question="What do I do about it?"
        description="Prioritized actions with specific timeframes and targets, tradeoff analysis showing the real cost of each move, ready-to-use scripts, and your reassessment date."
        bullets={["Lift scenarios: exactly how many points each change is worth", "Action plan with timelines, numeric targets, and tradeoff warnings", "Ready-to-use scripts: retainer pitch, client outreach, pricing restructure"]}
        alignRight={true} visible={visible} mobile={mobile}
        cardContent={<>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 12, marginTop: 8 }}>Your Action Plan</h3>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>IF YOU MADE THESE CHANGES</div>
          {[{ n: "1", t: "Secure more income ahead of time", pts: "+8 pts → 86" }, { n: "2", t: "Reduce reliance on largest source", pts: "+5 pts → 83" }, { n: "3", t: "Build more repeatable income", pts: "+3 pts → 81" }].map((r) => (
            <div key={r.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(14,26,43,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: B.purple }}>{r.n}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: B.navy }}>{r.t}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: B.teal }}>{r.pts}</span>
            </div>
          ))}
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginTop: 12, marginBottom: 6 }}>SHARE WITH YOUR ADVISOR</div>
          <p style={{ fontSize: 10, color: B.muted, margin: 0, lineHeight: 1.5 }}>Talking points, questions, and red flags — ready to share.</p>
        </>}
      />
    </div>
  );
}

/* ================================================================== */
/* CTA                                                                 */
/* ================================================================== */
function CtaSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      aria-label="Call to Action"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? 72 : 96,
        paddingBottom: mobile ? 72 : 96,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 700,
          height: 700,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 640,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? 24 : 48,
          paddingRight: mobile ? 24 : 48,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h2 style={{ fontSize: mobile ? 28 : 42, color: "#F4F1EA", fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 16 }}>
            See your own numbers.
          </h2>
          <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
            This was a sample. Your report uses your real data, your industry, and your income structure. Full refund if it does not reveal something new.
          </p>
          <a
            href="/pricing"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: mobile ? 48 : 56,
              paddingLeft: 36,
              paddingRight: 36,
              borderRadius: 12,
              backgroundColor: "#F4F1EA",
              color: B.navy,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
              textDecoration: "none",
              boxShadow: hovered
                ? "0 8px 28px rgba(0,0,0,0.20)"
                : "0 4px 16px rgba(0,0,0,0.12)",
              transform: hovered ? "translateY(-1px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
            }}
          >
            Get My Free Score
          </a>
          <div
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "rgba(244,241,234,0.40)",
              letterSpacing: "0.02em",
            }}
          >
            Free to start &#183; Under 2 minutes &#183; No bank connection
          </div>
        </div>
      </div>
    </section>
  );
}

function BridgeLine() {
  const mobile = useMobile();
  return (
    <section style={{ backgroundColor: B.sand, paddingTop: mobile ? 32 : 48, paddingBottom: mobile ? 32 : 48, paddingLeft: mobile ? 28 : 48, paddingRight: mobile ? 28 : 48, borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}` }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: mobile ? "block" : "flex", justifyContent: "center", gap: 32, textAlign: "center" }}>
        {["6 pages of analysis", "Interactive simulator", "5 structural sliders", "Scripts you can send"].map((t) => (
          <span key={t} style={{ fontSize: 13, fontWeight: 600, color: B.muted, letterSpacing: "-0.01em" }}>{t}</span>
        ))}
      </div>
    </section>
  );
}

function SimulatorPreview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  return (
    <section ref={ref} style={{ background: B.navy, paddingTop: mobile ? 72 : 96, paddingBottom: mobile ? 72 : 96, paddingLeft: mobile ? 28 : 48, paddingRight: mobile ? 28 : 48 }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", display: mobile ? "block" : "flex", alignItems: "center", gap: 64 }}>
        <div style={{ flex: 1, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 14 }}>INCLUDED WITH YOUR REPORT</div>
          <h3 style={{ fontSize: mobile ? 26 : 34, fontFamily: DISPLAY_FONT, fontWeight: 400, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 18 }}>What happens if things change?</h3>
          <p style={{ fontSize: 15, color: "rgba(244,241,234,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
            This user&#8217;s top client is 40% of revenue. If that client left, their score drops from 78 to 61. The simulator showed them exactly what to fix — and how many points each change is worth.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["What if you lost your biggest client? See the exact score drop.",
              "What if you converted to retainers? See the score jump instantly.",
              "What if you couldn\u2019t work for 90 days? See how long your income lasts.",
              "The tool calculates the fastest path to your next stability band.",
            ].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, marginTop: 7, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.6 }}>{b}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 20, fontStyle: "italic" }}>
            Loads automatically with your data. Accessible through the QR code on your report.
          </p>
        </div>
        <div style={{ flex: 1, maxWidth: mobile ? undefined : 400, marginTop: mobile ? 36 : 0 }}>
          <ReportCard visible={visible} mobile={mobile} delay={200} maxHeight={320}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 10, marginTop: 8 }}>SCORE SIMULATOR</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 9, fontWeight: 600, color: B.light, marginBottom: 4 }}>CURRENT</div><div style={{ fontSize: 22, fontWeight: 600, color: B.navy }}>78</div><div style={{ fontSize: 9, color: B.light }}>High Stability</div></div>
              <div style={{ display: "flex", alignItems: "center", color: B.light }}>→</div>
              <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 9, fontWeight: 600, color: B.light, marginBottom: 4 }}>SIMULATED</div><div style={{ fontSize: 22, fontWeight: 600, color: B.bandLimited }}>61</div><div style={{ fontSize: 9, color: B.light }}>Established</div></div>
              <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 9, fontWeight: 600, color: B.light, marginBottom: 4 }}>IMPACT</div><div style={{ fontSize: 22, fontWeight: 600, color: B.bandLimited }}>-17</div></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginBottom: 12 }}>
              {["Add client", "Retainer", "Lose top", "Passive", "Forward", "90-day"].map((p, i) => (
                <span key={p} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, border: `1px solid ${i === 2 ? B.purple : "rgba(14,26,43,0.10)"}`, backgroundColor: i === 2 ? "rgba(75,63,174,0.06)" : "#fff", color: i === 2 ? B.purple : B.navy, fontWeight: i === 2 ? 600 : 400 }}>{p}</span>
              ))}
            </div>
            <div style={{ backgroundColor: "rgba(75,63,174,0.04)", borderRadius: 4, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: B.purple, marginBottom: 2 }}>Lose your top client</div>
              <div style={{ fontSize: 9, color: B.muted }}>Score drops 17 points. Band shifts to Established.</div>
            </div>
          </ReportCard>
        </div>
      </div>
    </section>
  );
}

function Page6Preview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  return (
    <div ref={ref}>
      <PagePreview
        pageNum="6" title="Strategy and Next Steps" question="What are the tradeoffs?"
        description="Every recommended action comes with an honest cost-benefit analysis. Plus reassessment triggers, verification, and ready-to-use scripts you can copy and send."
        bullets={["Tradeoff analysis: the upside, the cost, and the net recommendation for each move", "Ready-to-use scripts: retainer pitch, client outreach, pricing restructure — personalized to your data", "Reassessment date, verification stamp, and record ID for sharing with advisors or lenders"]}
        alignRight={false} visible={visible} mobile={mobile}
        cardContent={<>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 12, marginTop: 8 }}>Strategy and Next Steps</h3>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 10 }}>TRADEOFFS TO UNDERSTAND</div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Reduce client concentration</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 8, fontWeight: 600, color: B.teal }}>UPSIDE</div><div style={{ fontSize: 9, color: B.muted }}>Removes single point of failure</div></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 8, fontWeight: 600, color: B.bandDeveloping }}>COST</div><div style={{ fontSize: 9, color: B.muted }}>Short-term income volatility</div></div>
            </div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginTop: 12, marginBottom: 6 }}>READY-TO-USE SCRIPTS</div>
          <div style={{ fontSize: 10, color: B.muted, lineHeight: 1.5 }}>Retainer pitch &#183; Client outreach &#183; Pricing restructure</div>
        </>}
      />
    </div>
  );
}

export default function SampleReportPage() {
  return (
    <div style={{ backgroundColor: "#F8F6F2" }}>
      <Hero />
      <BridgeLine />
      <Page1Preview />
      <SimulatorPreview />
      <Page2Preview />
      <Page3Preview />
      <Page4Preview />
      <Page5Preview />
      <Page6Preview />
      <CtaSection />
    </div>
  );
}
