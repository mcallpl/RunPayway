export default function DashboardLoading() {
  return (
    <div style={{
      maxWidth: 680,
      margin: "0 auto",
      paddingTop: 80,
    }}>
      {/* Loading card */}
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        border: "1px solid #EAEAEA",
        padding: 56,
        textAlign: "center",
      }}>
        {/* Specimen label */}
        <div style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "rgba(14,26,43,0.38)",
          marginBottom: 32,
        }}>
          Dashboard
        </div>

        {/* Animated ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "3px solid #EAEAEA",
            borderTopColor: "#1F6D7A",
            animation: "cc-spin 1s linear infinite",
          }} />
        </div>

        {/* Status text */}
        <div style={{
          fontSize: 18,
          fontWeight: 500,
          color: "#1C1635",
          marginBottom: 8,
          lineHeight: 1.4,
        }}>
          Loading Dashboard
        </div>

        <div style={{
          fontSize: 14,
          fontWeight: 400,
          color: "rgba(14,26,43,0.45)",
          lineHeight: 1.5,
        }}>
          Preparing structural analysis &bull; Model RP-2.0
        </div>

        {/* Skeleton blocks */}
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 12, borderRadius: 6, backgroundColor: "rgba(14,26,43,0.04)", width: "100%" }} />
          <div style={{ height: 12, borderRadius: 6, backgroundColor: "rgba(14,26,43,0.04)", width: "85%" }} />
          <div style={{ height: 12, borderRadius: 6, backgroundColor: "rgba(14,26,43,0.04)", width: "70%" }} />
        </div>
      </div>

      {/* Trust line */}
      <p style={{
        fontSize: 13,
        fontWeight: 400,
        color: "rgba(14,26,43,0.35)",
        textAlign: "center",
        marginTop: 24,
        lineHeight: 1.5,
      }}>
        Private by default &bull; No external data access &bull; Version-locked scoring
      </p>

      {/* Spin animation */}
      <style>{`
        @keyframes cc-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
