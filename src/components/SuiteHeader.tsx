"use client";

import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../public/runpayway-logo-blue.png";
import CommandPalette from "./CommandPalette";

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  muted: "rgba(14,26,43,0.50)",
  border: "rgba(14,26,43,0.08)",
};

export default function SuiteHeader({ current }: { current: "suite" | "pressuremap" | "simulator" | "dashboard" }) {
  return (
    <header style={{
      borderBottom: `1px solid ${C.border}`,
      backgroundColor: "rgba(247,246,243,0.97)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        height: 64,
        padding: "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {/* Left: Logo + Page label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image src={logoBlue} alt="RunPayway" width={140} height={16} style={{ height: "auto" }} />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: C.border }} />
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase" as const,
            color: C.purple,
          }}>
            DASHBOARD
          </span>
        </div>

        {/* Right: Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 600, color: C.purple, textDecoration: "none", borderBottom: `2px solid ${C.purple}`, paddingBottom: 2 }}>
            Dashboard
          </Link>
          <button
            onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", metaKey: true }); window.dispatchEvent(e); }}
            style={{ padding: "4px 10px", borderRadius: 5, border: `1px solid ${C.border}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <kbd style={{ fontSize: 10, color: C.muted }}>&#8984;K</kbd>
          </button>
        </nav>
      </div>
      <CommandPalette />
    </header>
  );
}
