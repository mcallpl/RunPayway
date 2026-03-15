import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../public/runpayway-logo.png";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#F7F6F3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(14,26,43,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src={logoImg}
              alt="RunPayway"
              width={150}
              height={18}
              style={{ height: "auto" }}
            />
          </Link>
          <div style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.04em" }}>
            Model RP-1.0
          </div>
        </div>
      </header>
      <main style={{ flex: 1, maxWidth: 860, width: "100%", margin: "0 auto", padding: "32px 24px 48px" }}>
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
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
            RunPayway™ Income Stability Assessment
          </span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
            Structural Stability Model RP-1.0
          </span>
        </div>
      </footer>
    </div>
  );
}
