"use client";

import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E5E7EB",
        paddingTop: "120px",
        paddingBottom: "80px",
        paddingLeft: "48px",
        paddingRight: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Footer Top */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "160px",
            marginBottom: "80px",
            alignItems: "flex-start",
          }}
        >
          {/* Logo & Tagline */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="/RunPayway_Logo.svg"
              alt="RunPayway™"
              style={{
                height: "40px",
                width: "auto",
                marginBottom: "16px",
              }}
            />
            <p
              style={{
                fontFamily: "Inter, -apple-system, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                margin: "0",
              }}
            >
              INCOME STABILITY VERIFICATION™
            </p>
          </div>

          {/* Links */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "80px",
            }}
          >
            {/* How It Works Section */}
            <div
              style={{
                paddingRight: "32px",
                borderRight: "1px solid #E5E7EB",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6B7280",
                  margin: "0 0 20px 0",
                }}
              >
                How It Works
              </p>
              <ul
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "14px",
                  lineHeight: "28px",
                  fontWeight: 400,
                  color: "#4B5563",
                  margin: "0",
                  paddingLeft: "0",
                  listStyle: "none",
                }}
              >
                <li>
                  <Link
                    href="/how-it-works"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/use-cases"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link
                    href="/verification-environments"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Verification Environments
                  </Link>
                </li>
              </ul>
            </div>

            {/* Learn Section */}
            <div
              style={{
                paddingLeft: "32px",
                paddingRight: "32px",
                borderRight: "1px solid #E5E7EB",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0E1A2B",
                  margin: "0 0 24px 0",
                }}
              >
                Learn
              </p>
              <ul
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "14px",
                  lineHeight: "28px",
                  fontWeight: 400,
                  color: "#4B5563",
                  margin: "0",
                  paddingLeft: "0",
                  listStyle: "none",
                }}
              >
                <li>
                  <Link
                    href="/learn"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Learn
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div
              style={{
                paddingLeft: "32px",
                paddingRight: "32px",
                borderRight: "1px solid #E5E7EB",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0E1A2B",
                  margin: "0 0 24px 0",
                }}
              >
                Legal
              </p>
              <ul
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "14px",
                  lineHeight: "28px",
                  fontWeight: 400,
                  color: "#4B5563",
                  margin: "0",
                  paddingLeft: "0",
                  listStyle: "none",
                }}
              >
                <li>
                  <Link
                    href="/privacy-request"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>

            {/* System Integrity Section */}
            <div style={{ paddingLeft: "32px" }}>
              <p
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0E1A2B",
                  margin: "0 0 24px 0",
                }}
              >
                System Integrity
              </p>
              <ul
                style={{
                  fontFamily: "Inter, -apple-system, sans-serif",
                  fontSize: "14px",
                  lineHeight: "28px",
                  fontWeight: 400,
                  color: "#4B5563",
                  margin: "0",
                  paddingLeft: "0",
                  listStyle: "none",
                }}
              >
                <li>
                  <Link
                    href="/methodology"
                    style={{
                      color: "#4B5563",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0E1A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#4B5563";
                    }}
                  >
                    Methodology
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            borderTop: "1px solid #E5E7EB",
            paddingTop: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            fontFamily: "Inter, -apple-system, sans-serif",
            color: "#9CA3AF",
          }}
        >
          <p style={{ margin: 0 }}>© 2026 RunPayway™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
