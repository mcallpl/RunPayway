"use client";

import { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#F4F1EA",
  offWhite: "#FFFFFF",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  border: "rgba(14,26,43,0.12)",
  gradient:
    "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const STRIPE_SINGLE = "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02";
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

  return (
    <section
      ref={ref}
      aria-label="Sample Report Hero"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? 80 : 100,
        paddingBottom: mobile ? 60 : 72,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 800,
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
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(244,241,234,0.50)",
              marginBottom: 16,
            }}
          >
            Preview
          </div>
          <h1
            style={{
              fontSize: mobile ? 28 : 38,
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Sample Assessment Report
          </h1>
          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(244,241,234,0.60)",
              lineHeight: 1.65,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            A sample Income Stability Score&#8482; report for a professional services profile scoring 78 out of 100. Your report will be personalized to your name, industry, and income structure.
          </p>
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
        pageNum="1" title="Your Score" question="What is my score?"
        description="The first page delivers your result immediately — your score, your stability band, where you land relative to peers, and the single most important thing holding the structure back."
        bullets={["Your 0–100 Income Stability Score with band classification", "A plain-English summary calibrated to your score severity", "Four structural metrics: continuity, stress test, main constraint, and overall durability"]}
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
function PagePreview({ pageNum, title, question, description, bullets, cardContent, alignRight, visible, mobile }: {
  pageNum: string; title: string; question: string; description: string; bullets: string[]; cardContent: React.ReactNode; alignRight: boolean; visible: boolean; mobile: boolean;
}) {
  const content = (
    <div style={{ flex: 1, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: B.teal, marginBottom: 12 }}>PAGE {pageNum}</div>
      <div style={{ fontSize: 15, color: B.muted, fontStyle: "italic", marginBottom: 14, lineHeight: 1.5 }}>{question}</div>
      <h3 style={{ fontSize: mobile ? 26 : 34, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 18 }}>{title}</h3>
      <p style={{ fontSize: 15, color: "rgba(14,26,43,0.55)", lineHeight: 1.7, marginBottom: 28 }}>{description}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bullets.map((b) => (
          <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, marginTop: 7, flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "rgba(14,26,43,0.50)", lineHeight: 1.6 }}>{b}</span>
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

  return (
    <section style={{ backgroundColor: "#F8F6F2", paddingTop: mobile ? 48 : 80, paddingBottom: mobile ? 48 : 80, paddingLeft: mobile ? 20 : 48, paddingRight: mobile ? 20 : 48 }}>
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
        pageNum="2" title="What This Score Means" question="What does it mean?"
        description="This page translates your score into plain English. You will see what is already working, what is still vulnerable, and a clear bottom-line interpretation."
        bullets={["What parts of your income structure are already supporting stability", "Where the structure is still exposed to disruption", "A plain-English interpretation you can understand immediately"]}
        alignRight={false} visible={visible} mobile={mobile}
        cardContent={<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8, paddingBottom: 10, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: B.navy }}>RUNPAYWAY&trade;</span>
            <span style={{ fontSize: 10, color: B.light }}>Model RP-2.0</span>
          </div>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 8 }}>What This Score Means</h3>
          <p style={{ fontSize: 11, color: B.muted, lineHeight: 1.6, marginBottom: 16 }}>Sample Professional Services scored 78 out of 100. This is a strong score. The structure already has substantial protection.</p>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 8 }}>WHAT IS ALREADY WORKING</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: B.navy, marginBottom: 4 }}>The structure is already strong</div>
          <p style={{ fontSize: 11, color: B.muted, margin: 0, lineHeight: 1.5 }}>Protection is already substantial. The focus is refinement rather than repair.</p>
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
        pageNum="3" title="Your Biggest Risks" question="What could hurt it?"
        description="This page shows what would happen if conditions changed — like losing your biggest client or being unable to work. Real scenarios, real consequences."
        bullets={["What would happen if your largest income source disappeared", "How long your income would continue if you stopped working", "How your structure compares to others in your industry"]}
        alignRight={true} visible={visible} mobile={mobile}
        cardContent={<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8, paddingBottom: 10, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: B.navy }}>RUNPAYWAY&trade;</span>
            <span style={{ fontSize: 10, color: B.light }}>Model RP-2.0</span>
          </div>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 8 }}>Your Biggest Risks</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, backgroundColor: B.sand, borderRadius: 4, padding: "10px 12px" }}>
              <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 4 }}>IF LARGEST SOURCE DISAPPEARED</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>78 <span style={{ color: B.light, fontWeight: 400 }}>&rarr;</span> <span style={{ color: B.bandLimited }}>56</span></div>
            </div>
            <div style={{ flex: 1, backgroundColor: B.sand, borderRadius: 4, padding: "10px 12px" }}>
              <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: B.teal, marginBottom: 4 }}>INCOME CONTINUITY</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: B.navy }}>8.2 months</div>
            </div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 8 }}>WHAT COULD HURT YOUR SCORE MOST</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: B.navy }}>You are unable to work for an extended period</div>
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
        pageNum="4" title="How to Raise Your Score" question="How can I improve it?"
        description="This page shows the specific changes that would raise your score the most, with projected point gains and clear priority actions."
        bullets={["The top 3 changes ranked by impact on your score", "Projected score improvement for each change", "Four prioritized action steps tailored to your structure"]}
        alignRight={false} visible={visible} mobile={mobile}
        cardContent={<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8, paddingBottom: 10, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: B.navy }}>RUNPAYWAY&trade;</span>
            <span style={{ fontSize: 10, color: B.light }}>Model RP-2.0</span>
          </div>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 12 }}>How to Raise Your Score</h3>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>IF YOU MADE THESE CHANGES</div>
          {[{ n: "1", t: "Secure more income ahead of time", pts: "+8" }, { n: "2", t: "Reduce reliance on largest source", pts: "+5" }, { n: "3", t: "Build more repeatable income", pts: "+3" }].map((r) => (
            <div key={r.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(14,26,43,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: B.purple }}>{r.n}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: B.navy }}>{r.t}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: B.teal }}>{r.pts}</span>
            </div>
          ))}
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
        pageNum="5" title="What to Do Next" question="What should I do next?"
        description="This page gives you a practical action plan — what to do first, what not to prioritize yet, a 90-day checklist, and when to reassess."
        bullets={["Five prioritized next steps based on your dominant weakness", "A 90-day action checklist with specific structural changes", "When to reassess and how you compare to your peer benchmark"]}
        alignRight={true} visible={visible} mobile={mobile}
        cardContent={<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8, paddingBottom: 10, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: B.navy }}>RUNPAYWAY&trade;</span>
            <span style={{ fontSize: 10, color: B.light }}>Model RP-2.0</span>
          </div>
          <h3 style={{ fontSize: 18, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 12 }}>What to Do Next</h3>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.navy, marginBottom: 6 }}>What to do next</div>
              {["Lock in committed income", "Reduce largest source reliance", "Build repeatable income"].map((item, i) => (
                <div key={i} style={{ fontSize: 10, color: B.navy, display: "flex", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: B.purple, fontWeight: 600 }}>{i + 1}.</span>{item}
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.navy, marginBottom: 6 }}>What not to prioritize</div>
              {["Working more without structure", "Temporary spikes"].map((item) => (
                <div key={item} style={{ fontSize: 10, color: B.muted, display: "flex", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: B.light }}>&mdash;</span>{item}
                </div>
              ))}
            </div>
          </div>
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
          <h2
            className="text-[28px] md:text-[40px]"
            style={{
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Get your Income Stability Score&#8482;
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(244,241,234,0.60)",
              lineHeight: 1.65,
              marginBottom: 32,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Under two minutes. Five-page diagnostic report. Instant delivery.
          </p>
          <a
            href={STRIPE_SINGLE}
            target="_blank"
            rel="noopener noreferrer"
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
            Get My Income Stability Score&#8482;
          </a>
          <div
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "rgba(244,241,234,0.40)",
              letterSpacing: "0.02em",
            }}
          >
            Model RP-2.0 &#183; Under 2 minutes &#183; Private by default
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SampleReportPage() {
  return (
    <div style={{ backgroundColor: "#F8F6F2" }}>
      <Hero />
      <Page1Preview />
      <Page2Preview />
      <Page3Preview />
      <Page4Preview />
      <Page5Preview />
      <CtaSection />
    </div>
  );
}
