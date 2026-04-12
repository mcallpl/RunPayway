"use client";

import { useState } from "react";
import { C, mono, sans, bandColor } from "@/lib/design-tokens";

/* ================================================================== */
/*  TYPES                                                              */
/* ================================================================== */

interface ShareableScoreCardProps {
  score: number;
  band: string;
  industry?: string;
  accessCode: string;
  name?: string;
  onClose?: () => void;
}

/* ================================================================== */
/*  CONSTANTS                                                          */
/* ================================================================== */

const BASE_URL = "https://peoplestar.com/RunPayway";

function bandColorFromLabel(band: string): string {
  const b = band.toLowerCase();
  if (b.includes("high")) return C.bandHigh;
  if (b.includes("established")) return C.bandEstablished;
  if (b.includes("developing")) return C.bandDeveloping;
  return C.bandLimited;
}

/* ================================================================== */
/*  SCORE RING (self-contained for the card)                           */
/* ================================================================== */

function CardScoreRing({ score, size = 120, stroke = 8 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = circ - (pct / 100) * circ;
  const color = bandColor(score);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(244,241,234,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.3, fontWeight: 200, fontFamily: mono, color: C.sandText, lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  COMPONENT                                                          */
/* ================================================================== */

export default function ShareableScoreCard({ score, band, industry, accessCode, name, onClose }: ShareableScoreCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const bColor = bandColorFromLabel(band);
  const verifyUrl = `${BASE_URL}/verify?code=${encodeURIComponent(accessCode)}`;

  const linkedInText = `My Income Stability Score is ${score}/100. I'm in the ${band} range. Measured by RunPayway™. ${verifyUrl}`;
  const xText = `My Income Stability Score is ${score}/100. I'm in the ${band} range. Measured by RunPayway™. ${verifyUrl}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}&summary=${encodeURIComponent(linkedInText)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    padding: "0 20px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: sans,
    cursor: "pointer",
    border: "none",
    transition: "opacity 150ms",
    letterSpacing: "-0.01em",
  };

  return (
    <div style={{ fontFamily: sans }}>
      {/* ── Score Card (screenshot-able) ── */}
      <div
        id="rp-shareable-card"
        style={{
          width: "100%",
          maxWidth: 600,
          aspectRatio: "1200 / 630",
          background: `linear-gradient(145deg, ${C.navy} 0%, #162236 50%, #0a1220 100%)`,
          borderRadius: 16,
          padding: "40px 44px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "soft-light", pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Subtle glow behind score ring */}
        <div style={{
          position: "absolute", top: "20%", left: "8%", width: 200, height: 200,
          background: `radial-gradient(circle, ${bColor}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Top section — header + score */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Model stamp */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(244,241,234,0.35)", textTransform: "uppercase" }}>
              Income Stability Assessment
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, fontFamily: mono, letterSpacing: "0.06em", color: "rgba(244,241,234,0.25)" }}>
              RP-2.0
            </div>
          </div>

          {/* Score + info row */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <CardScoreRing score={score} size={120} stroke={7} />
            <div style={{ flex: 1 }}>
              {name && (
                <div style={{ fontSize: 18, fontWeight: 600, color: C.sandText, marginBottom: 6, letterSpacing: "-0.02em" }}>
                  {name}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: bColor }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: bColor }}>{band}</span>
              </div>
              {industry && (
                <div style={{ fontSize: 13, color: "rgba(244,241,234,0.40)", letterSpacing: "0.02em" }}>
                  {industry}
                </div>
              )}
              <div style={{ fontSize: 32, fontWeight: 200, fontFamily: mono, color: C.sandText, letterSpacing: "-0.04em", marginTop: 4 }}>
                {score}<span style={{ fontSize: 16, color: "rgba(244,241,234,0.25)", marginLeft: 2 }}>/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — verification footer */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(244,241,234,0.30)", letterSpacing: "0.06em", marginBottom: 4 }}>
              VERIFIED BY RUNPAYWAY™
            </div>
            <div style={{ fontSize: 12, fontFamily: mono, color: "rgba(244,241,234,0.20)", letterSpacing: "0.02em" }}>
              {accessCode}
            </div>
          </div>
          <div style={{ fontSize: 10, color: "rgba(244,241,234,0.15)", letterSpacing: "0.08em" }}>
            peoplestar.com/RunPayway
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        {/* Copy Link */}
        <button
          onClick={() => copyToClipboard(verifyUrl, "link")}
          style={{ ...btnBase, backgroundColor: C.navy, color: C.sandText }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied === "link" ? "Copied" : "Copy Link"}
        </button>

        {/* Share on LinkedIn */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnBase, backgroundColor: "#0A66C2", color: "#FFFFFF", textDecoration: "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Share on LinkedIn
        </a>

        {/* Share on X */}
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnBase, backgroundColor: "#000000", color: "#FFFFFF", textDecoration: "none" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </a>
      </div>

      {/* Close button if modal */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            ...btnBase,
            width: "100%",
            marginTop: 12,
            backgroundColor: "transparent",
            color: C.textMuted,
            border: `1px solid ${C.borderSoft}`,
          }}
        >
          Close
        </button>
      )}
    </div>
  );
}
