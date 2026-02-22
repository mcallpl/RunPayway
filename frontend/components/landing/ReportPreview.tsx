"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

export default function ReportPreview() {
  const bands = [
    { label: "0-39", color: "bg-red-800", width: "w-[39%]" },
    { label: "40-59", color: "bg-amber-700", width: "w-[20%]" },
    { label: "60-79", color: "bg-sky-700", width: "w-[20%]" },
    { label: "80-100", color: "bg-emerald-700", width: "w-[21%]" },
  ];

  const { count, ref } = useCountUp(58);

  return (
    <section className="bg-white" style={{ paddingTop: "80px", paddingBottom: "96px" }}>
      <div className="max-w-lg mx-auto px-6">
        <ScrollReveal>
          {/* 3D iPad Device Frame */}
          <div
            className="relative mx-auto"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative bg-[#1a1a1a] rounded-[2rem] p-3 shadow-2xl transition-transform duration-700 hover:rotate-y-0"
              style={{
                transform: "rotateY(-4deg) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Device bezel reflection */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

              {/* Screen area */}
              <div ref={ref} className="relative bg-white rounded-[1.25rem] p-8 overflow-hidden">
                {/* Screen content */}
                <p className="text-xs text-gray-400 tracking-wide uppercase">
                  Assessment ID: RP-2026-0041-XC
                </p>

                <div className="mt-8 text-center">
                  <p className="text-6xl font-bold text-navy-900 leading-none tabular-nums">
                    {count}
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    Classification: Attention-Weighted
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex h-3 w-full overflow-hidden rounded-sm">
                    {bands.map((band) => (
                      <div
                        key={band.label}
                        className={`${band.color} ${band.width}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>0</span>
                    <span>40</span>
                    <span>60</span>
                    <span>80</span>
                    <span>100</span>
                  </div>

                  <div className="mt-6 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-navy-900 -mb-[1px] ml-[54%] -translate-x-1/2" />
                  </div>
                </div>

                <p className="mt-8 text-xs text-gray-400 text-center">
                  Calibrated to: Consulting Services
                </p>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center py-2">
                <div className="w-24 h-1 rounded-full bg-gray-600" />
              </div>
            </div>

            {/* Shadow beneath device */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/10 blur-xl rounded-full" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-4 text-sm text-gray-500 text-center leading-[1.6]">
            This is the exact report you receive. No upsells. No locked features.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
