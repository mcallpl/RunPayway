"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MarketingHeader() {
  const pathname = usePathname();

  const navItems = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Verification Environments", href: "/verification-environments" },
    { label: "Learn", href: "/learn" },
    { label: "Methodology", href: "/methodology" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        height: "104px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "48px",
        paddingRight: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "80px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="/rplogo.png"
            alt="RunPayway™"
            style={{
              height: "64px",
              width: "auto",
            }}
          />
        </Link>

        {/* Center Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "48px",
            alignItems: "center",
            flex: 1,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontFamily: "Inter, -apple-system, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.03em",
                color: pathname === item.href ? "#4B3FAE" : "#0E1A2B",
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#4B3FAE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  pathname === item.href ? "#4B3FAE" : "#0E1A2B";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <Link
          href="/begin"
          style={{
            height: "60px",
            paddingLeft: "32px",
            paddingRight: "32px",
            backgroundColor: "#0E1A2B",
            color: "#FFFFFF",
            fontFamily: "Inter, -apple-system, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            border: "1px solid #0E1A2B",
            borderRadius: "2px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "auto",
            textDecoration: "none",
            transition: "background-color 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#4B3FAE";
            e.currentTarget.style.borderColor = "#4B3FAE";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0E1A2B";
            e.currentTarget.style.borderColor = "#0E1A2B";
          }}
        >
          Check My Income Stability
          <span style={{ fontSize: "14px" }}>→</span>
        </Link>
      </div>
    </header>
  );
}
