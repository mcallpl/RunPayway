"use client";

import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../public/logo.png";
import ScrollToTop from "@/components/ScrollToTop";
import AccessibilityWidget from "@/components/AccessibilityWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#F7F6F3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />
      <main style={{ flex: 1, maxWidth: 860, width: "100%", margin: "0 auto", padding: "24px 16px 48px" }}>
        {children}
      </main>
      <footer
        style={{
          borderTop: "1px solid rgba(14,26,43,0.06)",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src={logoBlue}
              alt="RunPayway™"
              width={120}
              height={14}
              style={{ height: "auto" }}
            />
          </Link>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
            Model RP-2.0
          </span>
        </div>
      </footer>
      <AccessibilityWidget />
    </div>
  );
}
