"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const SLIDE_INTERVAL = 7000;
const FADE_DURATION = 600;

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver for viewport detection
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, SLIDE_INTERVAL);
  }, []);

  useEffect(() => {
    if (!isHovered && isVisible) {
      startTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, isVisible, startTimer]);

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "https://peoplestar.com/RunPayway/api/create_checkout.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Unable to start checkout. Please try again.");
      }
    } catch {
      alert("Unable to connect. Please try again.");
    }
  };

  const bgZoom = !reducedMotion ? "scale-[1.02]" : "";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden md:min-h-screen"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Slide 1 Background ─────────────────────────────── */}
      <div
        className={`absolute inset-0 transition-opacity ease-out ${
          !reducedMotion ? "transition-transform" : ""
        }`}
        style={{
          opacity: activeSlide === 0 ? 1 : 0,
          transitionDuration: `${FADE_DURATION}ms`,
          backgroundColor: "#0B0F14",
          transform: activeSlide === 0 ? bgZoom : "scale(1)",
          transitionProperty: "opacity, transform",
          transitionTimingFunction: "ease-out",
        }}
      >
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      </div>

      {/* ── Slide 2 Background ─────────────────────────────── */}
      <div
        className={`absolute inset-0 transition-opacity ease-out ${
          !reducedMotion ? "transition-transform" : ""
        }`}
        style={{
          opacity: activeSlide === 1 ? 1 : 0,
          transitionDuration: `${FADE_DURATION}ms`,
          background: "linear-gradient(135deg, #141821 0%, #1E2430 100%)",
          transform: activeSlide === 1 ? bgZoom : "scale(1)",
          transitionProperty: "opacity, transform",
          transitionTimingFunction: "ease-out",
        }}
      />

      {/* ── Content ────────────────────────────────────────── */}
      <div
        className="relative z-10 mx-auto"
        style={{
          maxWidth: "1440px",
          paddingLeft: "clamp(16px, 3vw, 40px)",
          paddingRight: "clamp(16px, 3vw, 40px)",
          paddingTop: "clamp(96px, 12vw, 160px)",
          paddingBottom: "clamp(80px, 10vw, 120px)",
        }}
      >
        {/* ── Slide 1 Content ──────────────────────────────── */}
        <div
          className="transition-opacity ease-out"
          style={{
            opacity: activeSlide === 0 ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
            position: activeSlide === 0 ? "relative" : "absolute",
            visibility: activeSlide === 0 ? "visible" : "hidden",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <h1
            className="font-semibold leading-tight"
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              color: "rgba(255,255,255,0.96)",
              letterSpacing: "-0.02em",
            }}
          >
            Get your Payway Rating&#8482;.
          </h1>

          <p
            className="mt-6 leading-[1.6]"
            style={{
              fontSize: "clamp(16px, 2vw, 24px)",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "640px",
            }}
          >
            A formal structural score that measures revenue exposure.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleCheckout}
              className="font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#3F6F93",
                color: "#FFFFFF",
                fontSize: "17px",
                padding: "18px 34px",
                borderRadius: "6px",
              }}
            >
              See Your Payway Rating&#8482;
            </button>

            <p
              className="mt-3"
              style={{
                fontSize: "clamp(13px, 1.2vw, 14px)",
                color: "rgba(255,255,255,0.66)",
              }}
            >
              $79 one-time structural diagnostic. Immediate formal report.
            </p>
            <p
              className="mt-1"
              style={{
                fontSize: "clamp(11px, 1vw, 12px)",
                color: "rgba(255,255,255,0.52)",
              }}
            >
              Private. Not publicly indexed.
            </p>
          </div>
        </div>

        {/* ── Slide 2 Content ──────────────────────────────── */}
        <div
          className="transition-opacity ease-out"
          style={{
            opacity: activeSlide === 1 ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
            position: activeSlide === 1 ? "relative" : "absolute",
            visibility: activeSlide === 1 ? "visible" : "hidden",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <h1
            className="font-semibold leading-tight"
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              color: "rgba(255,255,255,0.96)",
              letterSpacing: "-0.02em",
            }}
          >
            The standard for revenue exposure.
          </h1>

          <div
            className="mt-6 space-y-2 leading-[1.6]"
            style={{
              fontSize: "clamp(16px, 2vw, 24px)",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "640px",
            }}
          >
            <p>Credit scores measure borrowing risk.</p>
            <p>Payway Scores measure structural risk.</p>
          </div>

          <div className="mt-8 text-center" style={{ maxWidth: "640px" }}>
            <button
              type="button"
              onClick={handleCheckout}
              className="font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.92)",
                fontSize: "17px",
                padding: "18px 34px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              See Your Payway Rating&#8482;
            </button>

            <p
              className="mt-3"
              style={{
                fontSize: "clamp(13px, 1.2vw, 14px)",
                color: "rgba(255,255,255,0.66)",
              }}
            >
              $79 one-time structural diagnostic. Immediate formal report.
            </p>
            <p
              className="mt-1"
              style={{
                fontSize: "clamp(11px, 1vw, 12px)",
                color: "rgba(255,255,255,0.52)",
              }}
            >
              Private. Not publicly indexed.
            </p>
          </div>
        </div>
      </div>

      {/* ── Slide Indicators ──────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => {
              setActiveSlide(i);
              startTimer();
            }}
            aria-label={`Slide ${i + 1}`}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                activeSlide === i
                  ? "rgba(255,255,255,0.92)"
                  : "rgba(255,255,255,0.30)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
