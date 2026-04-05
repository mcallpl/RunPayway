import Link from "next/link";

const C = { navy: "#1C1635", purple: "#4B3FAE", teal: "#1F6D7A" };

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      fontFamily: "'Inter', system-ui, sans-serif",
      backgroundColor: "#FAFAFA",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 64, fontWeight: 300, fontFamily: '"SF Mono", "Fira Code", monospace', color: C.navy, lineHeight: 1, marginBottom: 16 }}>
        404
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: C.navy, marginBottom: 12 }}>
        Page not found
      </h1>
      <p style={{ fontSize: 16, color: "rgba(14,26,43,0.62)", lineHeight: 1.6, maxWidth: 400, marginBottom: 32 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, justifyContent: "center" }}>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 48, padding: "0 28px", borderRadius: 10,
          backgroundColor: C.navy, color: "#F4F1EA",
          fontSize: 15, fontWeight: 600, textDecoration: "none",
        }}>
          Go Home
        </Link>
        <Link href="/pricing" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 48, padding: "0 28px", borderRadius: 10,
          backgroundColor: "transparent", color: C.navy,
          border: `1px solid rgba(14,26,43,0.12)`,
          fontSize: 15, fontWeight: 600, textDecoration: "none",
        }}>
          View Pricing
        </Link>
      </div>
      <p style={{ fontSize: 13, color: "rgba(14,26,43,0.40)", marginTop: 48 }}>
        RunPayway&#8482; &middot; Model RP-2.0
      </p>
    </div>
  );
}
