"use client";

const C = {
  blue: "#2563EB",
  navy: "#0E2A7B",
  darkNavy: "#1B2B52",
  lightGray: "#F8FAFC",
  borderGray: "#E5E7EB",
  bodyGray: "#4B5563",
  white: "#FFFFFF",
};

export default function StructuralExposure() {
  return (
    <section style={{
      maxWidth: "1280px",
      margin: "0 auto",
      paddingTop: "96px",
      paddingBottom: "96px",
      paddingLeft: "48px",
      paddingRight: "48px",
      backgroundColor: C.white,
    }}>
      {/* Eyebrow */}
      <div style={{
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: C.blue,
        marginBottom: "28px",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}>
        Strong Income Can Still Fail Structurally.
      </div>

      {/* Top Content Row */}
      <div style={{
        display: "flex",
        gap: "48px",
        marginBottom: "56px",
        alignItems: "flex-start",
      }}>
        {/* Left Heading Block */}
        <div style={{ flex: "0 0 33.3%" }}>
          <h2 style={{
            fontFamily: "Instrument Serif, Georgia, serif",
            fontSize: "64px",
            fontWeight: 400,
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            color: C.navy,
            margin: 0,
            maxWidth: "420px",
          }}>
            Structural Exposure Appears Different Under Pressure.
          </h2>
        </div>

        {/* Paragraph Blocks with Dividers */}
        <div style={{
          flex: 1,
          display: "flex",
          gap: "48px",
          alignItems: "flex-start",
        }}>
          {/* Middle Paragraph Block */}
          <div style={{ flex: "0 0 auto", maxWidth: "320px" }}>
            <p style={{
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: 1.9,
              color: C.darkNavy,
              margin: 0,
            }}>
              RunPayway™ reveals hidden risks that traditional income metrics do not capture—before they impact your next financial decision.
            </p>
          </div>

          {/* Vertical Divider */}
          <div style={{
            flex: "0 0 1px",
            height: "82px",
            backgroundColor: C.borderGray,
          }} />

          {/* Right Paragraph Block */}
          <div style={{ flex: "0 0 auto", maxWidth: "300px" }}>
            <p style={{
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: 1.9,
              color: C.darkNavy,
              margin: 0,
            }}>
              Interpretation is framed using industry context. The evaluation itself remains fixed.
            </p>
          </div>

          {/* Vertical Divider */}
          <div style={{
            flex: "0 0 1px",
            height: "82px",
            backgroundColor: C.borderGray,
          }} />

          {/* Far Right Paragraph Block */}
          <div style={{ flex: "0 0 auto", maxWidth: "300px" }}>
            <p style={{
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: 1.9,
              color: C.darkNavy,
              margin: 0,
            }}>
              Designed for consultants, founders, operators, independent earners, and professionals with variable income profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Card Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
        marginBottom: "28px",
      }}>
        {/* Card 1 */}
        <Card
          icon={<BuildingIcon />}
          title="Before A Major Financial Decision"
          body="A strong income history does not always indicate structural resilience."
          bullets={["Concentration exposure", "Continuity weakness", "Variability risk"]}
        />

        {/* Card 2 */}
        <Card
          icon={<BriefcaseIcon />}
          title="Business & Career Decisions"
          body="Income transitions can amplify risks that are not visible in current results."
          bullets={["Dependence risk", "Forward visibility instability", "Revenue interruption exposure"]}
        />

        {/* Card 3 */}
        <Card
          icon={<ShieldIcon />}
          title="Household Financial Pressure"
          body="Unexpected disruption may expose gaps in income structure."
          bullets={["Insufficient diversification", "Continuity gaps", "Unstable revenue dependency"]}
        />
      </div>

      {/* Bottom Information Bar */}
      <div style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        backgroundColor: C.lightGray,
        borderRadius: "12px",
        padding: "22px 28px",
      }}>
        {/* Info Icon */}
        <div style={{
          width: "44px",
          height: "44px",
          minWidth: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${C.navy}`,
          borderRadius: "50%",
        }}>
          <span style={{
            fontFamily: "Inter, -apple-system, sans-serif",
            fontSize: "20px",
            fontWeight: 600,
            color: C.navy,
          }}>
            i
          </span>
        </div>

        {/* Info Text */}
        <p style={{
          fontFamily: "Inter, -apple-system, sans-serif",
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: 1.8,
          color: C.darkNavy,
          margin: 0,
        }}>
          Income alone does not determine stability. RunPayway™ analyzes the structure behind your income to reveal how it may perform in the future.
        </p>
      </div>
    </section>
  );
}

function Card({ icon, title, body, bullets }: {
  icon: React.ReactNode;
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <div style={{
      backgroundColor: C.white,
      border: `1px solid ${C.borderGray}`,
      borderRadius: "12px",
      padding: "32px",
      minHeight: "340px",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Icon */}
      <div style={{
        width: "52px",
        height: "52px",
        backgroundColor: C.lightGray,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
      }}>
        {icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "Inter, -apple-system, sans-serif",
        fontSize: "16px",
        fontWeight: 800,
        letterSpacing: "0.01em",
        textTransform: "uppercase",
        lineHeight: 1.5,
        color: C.navy,
        margin: 0,
        marginBottom: "24px",
      }}>
        {title}
      </h3>

      {/* Body */}
      <p style={{
        fontFamily: "Inter, -apple-system, sans-serif",
        fontSize: "16px",
        fontWeight: 500,
        lineHeight: 1.9,
        color: C.bodyGray,
        margin: 0,
        marginBottom: "28px",
        flex: 1,
      }}>
        {body}
      </p>

      {/* Subhead */}
      <h4 style={{
        fontFamily: "Inter, -apple-system, sans-serif",
        fontSize: "15px",
        fontWeight: 700,
        color: C.navy,
        margin: 0,
        marginBottom: "14px",
      }}>
        Hidden risks RunPayway™ identifies:
      </h4>

      {/* Bullet List */}
      <ul style={{
        margin: 0,
        padding: 0,
        listStyleType: "none",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}>
        {bullets.map((bullet, i) => (
          <li key={i} style={{
            fontFamily: "Inter, -apple-system, sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: 2,
            color: C.darkNavy,
            paddingLeft: "18px",
            position: "relative",
          }}>
            <span style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "6px",
              height: "6px",
              backgroundColor: C.navy,
              borderRadius: "50%",
            }} />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 21h14M8 5v16M11 5v16M14 5v16M17 5v16M5 10h4v4H5v-4M10 10h4v4h-4v-4M15 10h4v4h-4v-4M5 16h4v2H5v-2M10 16h4v2h-4v-2M15 16h4v2h-4v-2" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-4V3m0 4h6" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="7" width="14" height="12" rx="0" fill="none" stroke={C.navy} strokeWidth="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v6c0 5.5 4 10 8 11.5 4-1.5 8-6 8-11.5V6l-8-4z" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
