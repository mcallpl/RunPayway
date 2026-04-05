"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../public/runpayway-logo-blue.png";
import CommandPalette from "./CommandPalette";

const C = {
  navy: "#1C1635",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  muted: "rgba(14,26,43,0.50)",
  border: "rgba(14,26,43,0.08)",
};

export default function SuiteHeader({ current }: { current: "suite" | "pressuremap" | "simulator" | "dashboard" | "access-code" }) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => { const c = () => setMobile(window.innerWidth <= 640); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

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
        height: mobile ? 56 : 64,
        padding: mobile ? "0 16px" : "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {/* Left: Logo + Page label */}
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16, minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image src={logoBlue} alt="RunPayway" width={mobile ? 100 : 140} height={16} style={{ height: "auto" }} />
          </Link>
          {!mobile && (
            <>
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
            </>
          )}
        </div>

        {/* Right: Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: mobile ? 12 : 20 }}>
          {([
            { href: "/dashboard", label: "Simulator", key: "dashboard" },
            { href: "/access-code", label: "Access Code", key: "access-code" },
          ] as const).map(link => {
            const isActive = current === link.key;
            return (
              <Link key={link.key} href={link.href} style={{
                fontSize: mobile ? 13 : 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? C.purple : C.muted,
                textDecoration: "none",
                borderBottom: isActive ? `2px solid ${C.purple}` : "2px solid transparent",
                paddingBottom: 2,
                transition: "color 150ms, border-color 150ms",
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
              }}>
                {link.label}
              </Link>
            );
          })}
          {!mobile && (
            <button
              onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", metaKey: true }); window.dispatchEvent(e); }}
              style={{ padding: "8px 12px", borderRadius: 5, border: `1px solid ${C.border}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, minHeight: 44, minWidth: 44 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <kbd style={{ fontSize: 10, color: C.muted }}>&#8984;K</kbd>
            </button>
          )}
        </nav>
      </div>
      <CommandPalette />
    </header>
  );
}
