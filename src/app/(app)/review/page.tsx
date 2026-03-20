"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentServer } from "@/lib/monitoring";

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ReportErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message || "Unknown error" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 40, textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0E1A2B", marginBottom: 12 }}>
            Something went wrong loading your report
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, maxWidth: 400 }}>
            Your assessment was saved. Please try refreshing the page. If the problem persists, contact support@runpayway.com.
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 24 }}>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#fff", backgroundColor: "#0E1A2B", border: "none", borderRadius: 10, cursor: "pointer" }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// SAFE JSON PARSE
// ============================================================
function safeJsonParse<T>(json: string | undefined | null, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (fallback !== null && typeof fallback === "object" && !Array.isArray(fallback) && (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

interface AssessmentRecord {
  record_id: string;
  authorization_code: string;
  model_version: string;
  assessment_date_utc: string;
  issued_timestamp_utc: string;
  final_score: number;
  stability_band: string;
  assessment_title: string;
  classification: string;
  operating_structure: string;
  primary_income_model: string;
  revenue_structure: string;
  industry_sector: string;
  band_interpretation_text: string;
  primary_constraint_label: string;
  primary_constraint_text: string;
  primary_constraint_key: string;
  driver_1_label: string;
  driver_1_text: string;
  driver_2_label: string;
  driver_2_text: string;
  driver_3_label: string;
  driver_3_text: string;
  structural_priority_label: string;
  structural_priority_text: string;
  page_1_key_insight_text: string;
  page_2_key_insight_text: string;
  page_3_key_insight_text: string;
  page_4_key_insight_text: string;
  page_5_key_insight_text: string;
  page_6_key_insight_text: string;
  labor_asset_position_label: string;
  labor_asset_framework_text: string;
  labor_asset_marker_position: number;
  active_income_level: number;
  semi_persistent_income_level: number;
  persistent_income_level: number;
  income_persistence_label: string;
  income_source_diversity_label: string;
  forward_revenue_visibility_label: string;
  income_variability_label: string;
  active_labor_dependence_label: string;
  exposure_concentration_label: string;
  stability_spectrum_position: number;
  peer_benchmark_group_label: string;
  peer_benchmark_text: string;
  peer_position_marker: number;
  evolution_path_title: string;
  evolution_path_steps_payload: string;
  current_evolution_stage_label: string;
  current_evolution_stage_position: number;
  sector_mechanisms_payload: string;
  sector_avg_score: number;
  sector_top_20_threshold: number;
  peer_band_distribution_payload: string;
  constraint_guidance_payload: string;
  structural_improvement_path_text: string;
  action_plan_payload: string;
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;
  projected_final_score: number;
  projected_stability_band: string;
  improvement_estimate_text: string;
  registry_visibility: string;
  income_continuity_pct: number;
  income_continuity_months: number;
  income_continuity_text: string;
  risk_scenario_score: number;
  risk_scenario_band: string;
  risk_scenario_drop: number;
  risk_scenario_text: string;
  advisor_discussion_guide_payload: string;
  product_recommendations_payload: string;
}

// ============================================================
// BRAND
// ============================================================
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

// ============================================================
// SPACING + TYPOGRAPHY TOKENS
// ============================================================
const R = {
  pagePad: 32,
  headerMb: 14,
  sectionGap: 12,
  labelMb: 6,
  paraMb: 8,
  itemGap: 5,
  dividerMy: 10,
  footerMt: 12,
};

const T = {
  score: { fontSize: 48, fontWeight: 700, lineHeight: 1 },
  pageTitle: { fontSize: 14, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  band: { fontSize: 15, fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: 12.5, fontWeight: 400, lineHeight: 1.6 },
  small: { fontSize: 11, fontWeight: 400, lineHeight: 1.5 },
  label: { fontSize: 10, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  caption: { fontSize: 10, fontWeight: 400, lineHeight: 1.5 },
  micro: { fontSize: 9, fontWeight: 600, lineHeight: 1.3 },
};

// ── PDF page dimensions ──
const PDF = {
  captureW: 800,
  scale: 2,
  pageW: 8.5,
  pageH: 11,
  margin: 0.4,
  footer: 0.5,
  get contentW() { return this.pageW - 2 * this.margin; },
  get contentH() { return this.pageH - this.margin - this.footer; },
  get canvasW() { return this.captureW * this.scale; },
  get pxPerInch() { return this.canvasW / this.contentW; },
  get sliceH() { return Math.floor(this.contentH * this.pxPerInch); },
  get previewH() { return Math.round(this.captureW * (this.pageH / this.pageW)); },
};

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

function ReportHeader({ record }: { record: AssessmentRecord }) {
  const ts = record.issued_timestamp_utc || record.assessment_date_utc;
  return (
    <div style={{ marginBottom: R.headerMb }}>
      <div style={{ height: 3, borderRadius: "6px 6px 0 0", overflow: "hidden", background: B.gradient, margin: `-${R.pagePad}px -${R.pagePad}px 0` }} />
      <div style={{ paddingTop: 12, paddingBottom: 10, borderBottom: `1px solid ${B.sandDk}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/RunPayway/runpayway-logo-full.png" alt="RunPayway" style={{ height: 22, width: "auto" }} />
            <span style={{ ...T.caption, color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
          </div>
          <div style={{ ...T.caption, color: B.light, textAlign: "right" }}>
            <div>{record.record_id.slice(0, 8)}… · {ts.split("T")[0]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>{children}</div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function ConfidentialityFooter({ record }: { record: AssessmentRecord }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ ...T.caption, color: B.light, fontStyle: "italic" }}>
        Confidential — Prepared for {record.assessment_title || "Assessment Subject"}
      </span>
      <span style={{ ...T.caption, color: B.light }}>
        RunPayway™ · support@runpayway.com
      </span>
    </div>
  );
}

function ReportPage({ record, children }: { record: AssessmentRecord; children: React.ReactNode }) {
  return (
    <div className="report-page" style={{
      width: PDF.captureW,
      maxWidth: "100%",
      backgroundColor: "#ffffff",
      border: "1px solid #E5E7EB",
      borderRadius: 10,
      padding: R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "visible",
      boxShadow: "0 8px 32px rgba(14,26,43,0.08), 0 2px 8px rgba(14,26,43,0.04)",
    }}>
      <ReportHeader record={record} />
      <div>{children}</div>
      <ConfidentialityFooter record={record} />
    </div>
  );
}

// ── QR Code component ──
function QRCodeImage({ recordId, authCode }: { recordId: string; authCode?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = authCode
      ? `https://runpayway.com/verify?id=${recordId}&auth=${authCode}`
      : `https://runpayway.com/verify?id=${recordId}`;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, url, {
        width: 72,
        margin: 0,
        color: { dark: "#0E1A2B", light: "#FFFFFF" },
      });
    }).catch(() => {});
  }, [recordId, authCode]);

  return <canvas ref={canvasRef} width={72} height={72} style={{ width: 72, height: 72, borderRadius: 4 }} />;
}

// ============================================================
// PDF DOWNLOAD
// ============================================================

function findSafeCutRow(
  canvas: HTMLCanvasElement,
  targetY: number,
  searchRange: number,
): number {
  const width = canvas.width;
  const minY = Math.max(0, targetY - searchRange);
  const maxY = targetY;
  const searchHeight = maxY - minY;
  if (searchHeight <= 0) return targetY;

  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, minY, width, searchHeight);
  const pixels = imageData.data;
  const sampleStep = Math.max(1, Math.floor(width / 80));
  const threshold = 4;

  for (let offset = 0; offset < searchHeight; offset++) {
    const localRow = searchHeight - 1 - offset;
    let nonWhiteCount = 0;
    const rowStart = localRow * width * 4;

    for (let x = 0; x < width; x += sampleStep) {
      const idx = rowStart + x * 4;
      if (pixels[idx] < 245 || pixels[idx + 1] < 245 || pixels[idx + 2] < 245) {
        nonWhiteCount++;
        if (nonWhiteCount > threshold) break;
      }
    }

    if (nonWhiteCount <= threshold) {
      return minY + localRow;
    }
  }

  return targetY;
}

async function downloadPDF(record: AssessmentRecord) {
  let html2canvas: typeof import("html2canvas").default;
  let jsPDF: typeof import("jspdf").jsPDF;

  try {
    html2canvas = (await import("html2canvas")).default;
    jsPDF = (await import("jspdf")).jsPDF;
  } catch {
    alert("PDF generation libraries failed to load. Please check your connection and try again.");
    return;
  }

  const pages = document.querySelectorAll(".report-page");
  if (!pages.length) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  pdf.setProperties({
    title: `Income Stability Assessment — ${record.assessment_title || "Report"}`,
    author: "RunPayway",
    subject: "Income Stability Score Report",
    keywords: "income stability, assessment, RunPayway, structural analysis",
    creator: `RunPayway Model ${record.model_version || "RP-1.0"}`,
  });

  const { captureW, scale: S, pageW: PW, pageH: PH, margin: M, footer: FT, contentW: CW, canvasW, pxPerInch, sliceH } = PDF;

  let pdfPageCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;

    const saved = {
      width: el.style.width,
      maxWidth: el.style.maxWidth,
      border: el.style.border,
      borderRadius: el.style.borderRadius,
      boxSizing: el.style.boxSizing,
      overflow: el.style.overflow,
    };
    el.style.width = `${captureW}px`;
    el.style.maxWidth = `${captureW}px`;
    el.style.boxSizing = "border-box";
    el.style.border = "none";
    el.style.borderRadius = "0";
    el.style.overflow = "visible";

    const htmlFooter = el.querySelector(".report-page-footer") as HTMLElement | null;
    if (htmlFooter) htmlFooter.style.display = "none";

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const canvas = await html2canvas(el, {
      scale: S,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: captureW,
      height: el.scrollHeight,
      windowWidth: captureW,
    });

    Object.assign(el.style, saved);
    if (htmlFooter) htmlFooter.style.display = "";

    const totalCanvasH = canvas.height;
    let currentY = 0;

    while (currentY < totalCanvasH) {
      if (pdfPageCount > 0) pdf.addPage();
      pdfPageCount++;

      let cutY: number;
      const idealCutY = currentY + sliceH;

      if (idealCutY >= totalCanvasH) {
        cutY = totalCanvasH;
      } else {
        cutY = findSafeCutRow(canvas, idealCutY, 200);
      }

      const srcH = Math.max(1, cutY - currentY);

      const strip = document.createElement("canvas");
      strip.width = canvasW;
      strip.height = srcH;
      const ctx = strip.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasW, srcH);
      ctx.drawImage(canvas, 0, currentY, canvasW, srcH, 0, 0, canvasW, srcH);

      const imgH = srcH / pxPerInch;
      pdf.addImage(strip.toDataURL("image/png"), "PNG", M, M, CW, imgH);

      currentY = cutY;
    }
  }

  for (let p = 1; p <= pdfPageCount; p++) {
    pdf.setPage(p);

    pdf.setDrawColor(220, 218, 212);
    pdf.setLineWidth(0.004);
    pdf.line(M, PH - FT + 0.05, PW - M, PH - FT + 0.05);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `Confidential — Prepared for ${record.assessment_title || "Assessment Subject"}`,
      M,
      PH - FT + 0.2,
    );

    pdf.setFont("helvetica", "normal");
    pdf.text("support@runpayway.com", PW - M, PH - FT + 0.2, { align: "right" });

    pdf.setFontSize(7.5);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Page ${p} of ${pdfPageCount}`, PW / 2, PH - FT + 0.35, { align: "center" });
  }

  const shortId = record.record_id.slice(0, 8);
  pdf.save(`RunPayway-Income-Stability-Report-${shortId}.pdf`);
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [linkCopied, setLinkCopied] = useState(false);
  const [advisorEmail, setAdvisorEmail] = useState("");
  const [advisorSending, setAdvisorSending] = useState(false);
  const [advisorSent, setAdvisorSent] = useState(false);
  const monitoringTracked = useRef(false);
  const emailSent = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }

    let parsed: AssessmentRecord;
    try {
      parsed = JSON.parse(stored);
    } catch {
      router.push("/diagnostic-portal");
      return;
    }

    if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") {
      router.push("/diagnostic-portal");
      return;
    }

    setRecord(parsed);

    try {
      const records = safeJsonParse<Array<Record<string, unknown>>>(localStorage.getItem("rp_records"), []);
      if (!records.some((r) => r.record_id === parsed.record_id)) {
        records.push({
          record_id: parsed.record_id,
          authorization_code: parsed.authorization_code,
          model_version: parsed.model_version,
          final_score: parsed.final_score,
          stability_band: parsed.stability_band,
          assessment_date_utc: parsed.assessment_date_utc,
          issued_timestamp_utc: parsed.issued_timestamp_utc,
        });
        localStorage.setItem("rp_records", JSON.stringify(records));
      }
    } catch { /* ignore */ }

    // Clean up localStorage session data now that the report is delivered
    try {
      localStorage.removeItem("rp_purchase_session");
      localStorage.removeItem("rp_profile");
    } catch { /* ignore */ }

    if (!monitoringTracked.current) {
      monitoringTracked.current = true;
      try {
        const purchaseSession = sessionStorage.getItem("rp_purchase_session");
        if (purchaseSession) {
          const ps = JSON.parse(purchaseSession);
          if (ps.plan_key === "annual_monitoring" && ps.monitoring_access_code) {
            void useAssessmentServer(ps.monitoring_access_code, parsed.record_id);
          }
        }
      } catch { /* ignore */ }
    }

    if (!emailSent.current) {
      emailSent.current = true;
      try {
        const purchaseRaw = sessionStorage.getItem("rp_purchase_session");
        const profileRaw = sessionStorage.getItem("rp_profile");
        const email =
          (purchaseRaw ? safeJsonParse<Record<string, string>>(purchaseRaw, {}).customer_email : null) ||
          (profileRaw ? safeJsonParse<Record<string, string>>(profileRaw, {}).recipient_email : null);
        if (email) {
          setEmailStatus("sending");
          fetch("/api/v1/send-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipientEmail: email,
              assessmentTitle: parsed.assessment_title,
              finalScore: parsed.final_score,
              stabilityBand: parsed.stability_band,
              recordId: parsed.record_id,
              modelVersion: parsed.model_version,
              issuedTimestamp: parsed.issued_timestamp_utc,
              industrySector: parsed.industry_sector,
              classification: parsed.classification,
              primaryConstraintLabel: parsed.primary_constraint_label,
              bandInterpretationText: parsed.band_interpretation_text,
              peerPercentileLabel: parsed.peer_stability_percentile_label,
            }),
          })
            .then((res) => res.ok ? setEmailStatus("sent") : setEmailStatus("error"))
            .catch(() => setEmailStatus("error"));
        }
      } catch { /* ignore email errors */ }
    }
  }, [router]);

  if (!record) return null;

  // ── Derived values ──
  const score = record.final_score;
  const tier: "limited" | "developing" | "established" | "high" =
    score >= 80 ? "high" : score >= 60 ? "established" : score >= 40 ? "developing" : "limited";

  const issuedDate = (record.issued_timestamp_utc || record.assessment_date_utc).split("T")[0];
  const reassessDate = (() => {
    const d = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
    d.setMonth(d.getMonth() + (tier === "limited" ? 2 : tier === "high" ? 6 : 3));
    return d.toISOString().split("T")[0];
  })();
  const actionPlan: string[] = safeJsonParse(record.action_plan_payload, []);
  const constraintGuidance: string[] = safeJsonParse(record.constraint_guidance_payload, []);
  const evolutionSteps: string[] = safeJsonParse(record.evolution_path_steps_payload, []);
  const advisorGuide: { talking_points: string[]; client_questions: string[]; red_flags: string[]; next_steps: string[] } = safeJsonParse(record.advisor_discussion_guide_payload, { talking_points: [], client_questions: [], red_flags: [], next_steps: [] });

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadPDF(record);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF generation failed";
      setDownloadError(msg);
    } finally {
      setDownloading(false);
    }
  };

  // ── Indicator helpers ──
  function indicatorLevel(label: string, inverted: boolean): { display: string; color: string } {
    const isHigh = /high|very high/i.test(label);
    const isLow = /low|very low/i.test(label);
    if (inverted) {
      if (isHigh) return { display: "High", color: "#DC2626" };
      if (isLow) return { display: "Low", color: B.teal };
      return { display: "Moderate", color: B.navy };
    }
    if (isHigh) return { display: "High", color: B.teal };
    if (isLow) return { display: "Low", color: "#DC2626" };
    return { display: "Moderate", color: B.navy };
  }

  return (
    <ReportErrorBoundary>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, maxWidth: PDF.captureW + 48, margin: "0 auto", padding: "0 0 40px" }}>

      {/* ================================================================
          PAGE 1 — YOUR SCORE
          ================================================================ */}
      <ReportPage record={record}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

          {/* Prepared for */}
          <div style={{ ...T.label, color: B.light, marginBottom: 4 }}>PREPARED FOR</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.navy, marginBottom: R.sectionGap }}>
            {record.assessment_title || "Assessment Subject"}
          </div>

          {/* Score */}
          <div style={{ fontSize: 56, fontWeight: 700, color: B.navy, lineHeight: 1, marginBottom: 6 }}>
            {record.final_score}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: B.teal, marginBottom: R.sectionGap }}>
            {record.stability_band}
          </div>

          {/* One-sentence meaning */}
          <p style={{ ...T.body, color: B.muted, maxWidth: 480, lineHeight: 1.6, marginBottom: R.sectionGap }}>
            {record.band_interpretation_text}
          </p>

          {/* Key facts */}
          <div style={{ ...T.label, color: B.light, marginBottom: R.labelMb }}>KEY FACTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%", marginBottom: R.sectionGap }}>
            <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ ...T.caption, color: B.light, marginBottom: 4 }}>Income Continuity</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: B.navy }}>{record.income_continuity_pct}%</div>
              <div style={{ ...T.micro, color: B.muted }}>
                {tier === "high" ? "continues reliably without active work" : tier === "established" ? "would continue without active work" : "would persist if active work stopped"}
              </div>
            </div>
            <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ ...T.caption, color: B.light, marginBottom: 4 }}>Largest Source Loss</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: B.navy }}>{record.final_score} → {Math.max(0, record.risk_scenario_score)}</div>
              <div style={{ ...T.micro, color: B.muted }}>
                {tier === "high" ? "resilience if largest source ends" : tier === "limited" ? "if the largest source ends" : "risk if the largest source ends"}
              </div>
            </div>
            <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ ...T.caption, color: B.light, marginBottom: 4 }}>Primary Constraint</div>
              <div style={{ ...T.small, fontWeight: 600, color: B.navy }}>{record.primary_constraint_label}</div>
            </div>
          </div>

          {/* Bottom meta */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, width: "100%", marginBottom: R.sectionGap }}>
            {[
              ["Industry", record.industry_sector],
              ["Issued", issuedDate],
              ["Record ID", record.record_id.slice(0, 8) + "…"],
            ].map(([label, value]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ ...T.caption, color: B.light, marginBottom: 2 }}>{label}</div>
                <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{value}</div>
              </div>
            ))}
          </div>

          <SectionDivider />

          <div style={{ ...T.micro, color: B.light, marginBottom: 8 }}>
            Verify at RunPayway.com/verify
          </div>

          <p style={{ ...T.caption, color: B.light, maxWidth: 480, lineHeight: 1.5, fontStyle: "italic", margin: 0 }}>
            Based on self-reported data. This report measures structural income stability under Model RP-1.0. It is not financial, legal, tax, insurance, or investment advice.
          </p>
        </div>
      </ReportPage>


      {/* ================================================================
          PAGE 2 — WHAT THIS SCORE MEANS
          ================================================================ */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          What This Score Means
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_2_key_insight_text || ({
            limited: "Your income structure currently depends heavily on active work. This breakdown shows what that means for stability and where the biggest opportunities are.",
            developing: "Your income has early structural elements in place. This breakdown shows what is contributing to stability and what needs to grow.",
            established: "Your income structure is moderately diversified. This breakdown shows what is working well and where to optimize further.",
            high: "Your income structure is highly resilient. This breakdown shows what is protecting your stability and what to monitor.",
          }[tier])}
        </p>

        {/* Top summary boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: R.sectionGap }}>
          <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "8px 12px" }}>
            <div style={{ ...T.micro, color: B.light }}>CURRENT PROFILE</div>
            <div style={{ ...T.body, fontWeight: 600, color: B.navy }}>{record.stability_band}</div>
          </div>
          <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "8px 12px" }}>
            <div style={{ ...T.micro, color: B.light }}>PRIMARY CONSTRAINT</div>
            <div style={{ ...T.body, fontWeight: 600, color: B.navy }}>{record.primary_constraint_label}</div>
          </div>
          <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "8px 12px" }}>
            <div style={{ ...T.micro, color: B.light }}>STRUCTURAL PRIORITY</div>
            <div style={{ ...T.body, fontWeight: 600, color: B.navy }}>{record.structural_priority_label}</div>
          </div>
          <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "8px 12px" }}>
            <div style={{ ...T.micro, color: B.light }}>LABOR-ASSET POSITION</div>
            <div style={{ ...T.body, fontWeight: 600, color: B.navy }}>{record.labor_asset_position_label}</div>
          </div>
        </div>

        {/* Meaning paragraph */}
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.band_interpretation_text}
        </p>

        {/* Continuity block */}
        <div style={{ borderRadius: 12, backgroundColor: B.sand, padding: "8px 12px", marginBottom: R.sectionGap }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: B.navy }}>{record.income_continuity_pct}%</span>
            <span style={{ ...T.small, color: B.muted }}>of current income continues without active work</span>
          </div>
          <div style={{ ...T.small, color: B.muted, marginBottom: 6 }}>
            Estimated continuity: {record.income_continuity_months} month{record.income_continuity_months !== 1 ? "s" : ""}
          </div>
          <p style={{ ...T.caption, color: B.muted, margin: 0 }}>
            {record.income_continuity_text || ({
              limited: "If active work stopped today, very little income would continue. This is the most important area to address.",
              developing: "If active work stopped today, a modest share of income would continue. Growing this share is key to reaching the next band.",
              established: "If active work stopped today, a meaningful share of income would continue. Expanding this further strengthens the foundation.",
              high: "If active work stopped today, the majority of income would continue. This reflects strong structural resilience.",
            }[tier])}
          </p>
        </div>

        {/* Stability band bar */}
        <div style={{ marginBottom: R.sectionGap }}>
          <div style={{ position: "relative", marginBottom: R.itemGap }}>
            <div style={{ height: 8, borderRadius: 99, background: B.gradient }} />
            <div style={{
              position: "absolute",
              left: `${Math.min(Math.max(record.final_score, 0), 100)}%`,
              top: -3,
              width: 14, height: 14, borderRadius: 99,
              backgroundColor: "#ffffff", border: `2px solid ${B.navy}`,
              transform: "translateX(-50%)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
            {[40, 60, 80].map((pos) => (
              <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: "Limited", range: "0–39" },
              { label: "Developing", range: "40–59" },
              { label: "Established", range: "60–79" },
              { label: "High", range: "80–100" },
            ].map((b) => {
              const isActive = b.label + " Stability" === record.stability_band;
              return (
                <div key={b.label} style={{ textAlign: "center", padding: "4px 2px 3px", borderRadius: 10, border: isActive ? `1.5px solid ${B.navy}` : "1.5px solid transparent", backgroundColor: isActive ? "rgba(14,26,43,0.03)" : "transparent" }}>
                  <div style={{ ...T.micro, fontWeight: isActive ? 700 : T.micro.fontWeight, color: isActive ? B.navy : B.light }}>{b.label}</div>
                  <div style={{ fontSize: 8, fontWeight: isActive ? 600 : 400, color: isActive ? B.navy : B.light }}>{b.range}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Percentile */}
        <div style={{ marginBottom: R.sectionGap }}>
          <div style={{ ...T.body, color: B.navy, fontWeight: 600, marginBottom: 4 }}>
            {record.peer_stability_percentile_label} percentile in {record.industry_sector}
          </div>
          <p style={{ ...T.caption, color: B.muted, margin: 0 }}>
            {({
              limited: `Significant development opportunity relative to other ${record.industry_sector} professionals.`,
              developing: `Below the median for ${record.industry_sector} — clear path to improvement.`,
              established: `Competitive position among ${record.industry_sector} professionals.`,
              high: `Top tier among ${record.industry_sector} professionals — exceptional structural strength.`,
            }[tier])}
          </p>
        </div>

        <SectionDivider />

        {/* Score drivers */}
        <div style={{ marginBottom: R.sectionGap }}>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>TOP SCORE DRIVERS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: record.driver_1_label, text: record.driver_1_text },
              { label: record.driver_2_label, text: record.driver_2_text },
              { label: record.driver_3_label, text: record.driver_3_text },
            ].map((d) => (
              <div key={d.label} style={{ borderRadius: 10, backgroundColor: B.sand, padding: "6px 10px" }}>
                <div style={{ ...T.small, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{d.label}</div>
                <div style={{ ...T.caption, color: B.muted }}>{d.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Structural priority */}
        <div style={{
          borderRadius: 12,
          background: "linear-gradient(135deg, rgba(14,26,43,0.03) 0%, rgba(31,109,122,0.04) 100%)",
          border: "1px solid rgba(31,109,122,0.10)",
          padding: "12px 16px",
        }}>
          <div style={{ ...T.caption, fontWeight: 600, color: B.teal, marginBottom: 4 }}>Structural Priority</div>
          <p style={{ ...T.small, color: B.navy, lineHeight: 1.55, margin: 0 }}>
            {record.structural_priority_text}
          </p>
        </div>
      </ReportPage>


      {/* ================================================================
          PAGE 3 — HOW YOUR INCOME IS BUILT
          ================================================================ */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          How Your Income Is Built
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_3_key_insight_text || ({
            limited: "This page shows why the income structure currently relies heavily on active work and which indicators need the most attention.",
            developing: "This page shows the structural composition emerging in your income model and which indicators are driving growth.",
            established: "This page shows how your diversified income composition contributes to stability and where further gains are available.",
            high: "This page shows the resilient structural composition protecting your income and which indicators to monitor.",
          }[tier])}
        </p>

        {/* Profile context */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: R.sectionGap }}>
          {[
            ["Classification", record.classification],
            ["Operating Structure", record.operating_structure],
            ["Income Model", record.primary_income_model],
          ].map(([label, value]) => (
            <div key={label} style={{ borderRadius: 10, backgroundColor: B.sand, padding: "6px 10px" }}>
              <div style={{ ...T.micro, color: B.light }}>{label.toUpperCase()}</div>
              <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Income mix — three bars */}
        <Label>INCOME MIX</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: R.paraMb, marginBottom: R.paraMb }}>
          {[
            { label: "Active Income", value: record.active_income_level, color: B.muted, desc: "Income that depends on ongoing personal work" },
            { label: "Semi-Persistent Income", value: record.semi_persistent_income_level, color: B.teal, desc: "Income that may continue for a period, but is not fully durable" },
            { label: "Persistent Income", value: record.persistent_income_level, color: B.navy, desc: "Income that continues with less ongoing effort" },
          ].map((bar) => (
            <div key={bar.label}>
              <div style={{ ...T.small, display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontWeight: 500, color: B.navy }}>{bar.label} — {bar.value}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, overflow: "hidden", backgroundColor: B.sand, marginBottom: 3 }}>
                <div style={{ height: "100%", borderRadius: 99, width: `${bar.value}%`, backgroundColor: bar.color }} />
              </div>
              <div style={{ ...T.caption, color: B.muted }}>{bar.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.sectionGap }}>
          {record.labor_asset_framework_text}
        </p>

        <SectionDivider />

        {/* Key indicators */}
        <Label>KEY INDICATORS</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: R.sectionGap }}>
          {[
            { label: "Income that continues", level: indicatorLevel(record.income_persistence_label, false), text: "Share of income that persists without active work." },
            { label: "Income sources", level: indicatorLevel(record.income_source_diversity_label, false), text: "Number and diversity of distinct income sources." },
            { label: "Income already scheduled", level: indicatorLevel(record.forward_revenue_visibility_label, false), text: "Revenue committed or contracted before the month begins." },
            { label: "Monthly consistency", level: indicatorLevel(record.income_variability_label, true), text: "How much income fluctuates from month to month." },
            { label: "Dependence on personal work", level: indicatorLevel(record.active_labor_dependence_label, true), text: "Share of income that requires ongoing personal effort." },
            { label: "Dependence on one source", level: indicatorLevel(record.exposure_concentration_label, true), text: "Concentration of income in the largest single source." },
          ].map((item) => (
            <div key={item.label} style={{ borderRadius: 10, backgroundColor: B.sand, padding: "6px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{item.label}</span>
                <span style={{ ...T.caption, fontWeight: 600, color: item.level.color }}>{item.level.display}</span>
              </div>
              <div style={{ ...T.caption, color: B.muted }}>{item.text}</div>
            </div>
          ))}
        </div>

        {/* Structural insight */}
        <div style={{ borderRadius: 10, backgroundColor: "rgba(14,26,43,0.03)", padding: "8px 12px" }}>
          <p style={{ ...T.small, fontWeight: 500, color: B.navy, margin: 0 }}>
            {({
              limited: "Most indicators above need attention. Improving any of them will produce significant score gains.",
              developing: "The indicators above are key leverage points. Improving any factor rated Low will move the score meaningfully higher.",
              established: "Most indicators are healthy. Focusing on any remaining Low or Moderate factors will push toward High Stability.",
              high: "These indicators reflect your structural strengths. Monitor any Moderate factors to maintain this position.",
            }[tier])}
          </p>
        </div>
      </ReportPage>


      {/* ================================================================
          PAGE 4 — WHAT IMPROVES THE SCORE
          ================================================================ */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          What Improves the Score
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_4_key_insight_text || ({
            limited: "Your income structure requires foundational changes. This page outlines what will produce the largest improvements.",
            developing: "Your income structure has started to build stability. This page shows what will accelerate progress to the next band.",
            established: "Your income structure is solid. This page shows fine-tuning opportunities to reach the top tier.",
            high: "Your income structure is strong. This page outlines how to maintain and protect your position.",
          }[tier])}
        </p>

        {/* Benchmark block */}
        <Label>BENCHMARK</Label>
        <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${B.sandDk}`, marginBottom: R.sectionGap }}>
          {[
            ["Your Score", String(record.final_score)],
            [`${record.industry_sector} Average`, String(record.sector_avg_score || 48)],
            [`Top 20% in ${record.industry_sector}`, `${record.sector_top_20_threshold || 65}+`],
          ].map(([label, value], i) => (
            <div key={label} style={{ ...T.small, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: i % 2 === 0 ? B.sand : "white", padding: "8px 14px" }}>
              <span style={{ color: B.muted }}>{label}</span>
              <span style={{ fontWeight: 600, color: i === 0 ? B.purple : B.navy }}>{value}</span>
            </div>
          ))}
        </div>
        <p style={{ ...T.caption, color: B.muted, marginBottom: R.sectionGap }}>
          {record.peer_benchmark_text || `Your current structure is ${record.final_score < (record.sector_avg_score || 48) ? "below" : "above"} the ${record.industry_sector} sector average.`}
        </p>

        {/* Largest Source Loss Scenario */}
        <div style={{
          borderRadius: 12,
          backgroundColor: "rgba(14,26,43,0.02)",
          border: "1px solid rgba(14,26,43,0.06)",
          padding: "8px 12px",
          marginBottom: R.sectionGap,
        }}>
          <div style={{ ...T.caption, fontWeight: 600, color: B.navy, marginBottom: 8 }}>Largest Source Loss Scenario</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: B.navy }}>{record.final_score}</span>
            <span style={{ ...T.body, color: B.light }}>→</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#DC2626" }}>{Math.max(0, record.risk_scenario_score)}</span>
          </div>
          <p style={{ ...T.caption, color: B.muted, margin: "6px 0 0" }}>
            Structural simulation: if the largest income source were removed, the score would fall to {Math.max(0, record.risk_scenario_score)}. This is not a prediction of whether this event will occur.
          </p>
        </div>

        {/* Primary constraint */}
        <div style={{
          borderRadius: 12,
          backgroundColor: "rgba(75,63,174,0.04)",
          border: "1px solid rgba(75,63,174,0.10)",
          padding: "8px 12px",
          marginBottom: R.sectionGap,
        }}>
          <div style={{ ...T.caption, fontWeight: 600, color: B.purple, marginBottom: 4 }}>
            {tier === "high" ? "Area to Monitor" : "Primary Constraint"}
          </div>
          <div style={{ ...T.body, fontWeight: 600, color: B.navy, marginBottom: 6 }}>{record.primary_constraint_label}</div>
          <p style={{ ...T.caption, color: B.muted, margin: 0 }}>
            {({
              limited: "Addressing this single area will produce the largest score improvement and is the highest-priority structural change.",
              developing: "Improving this area would have the largest impact on moving to the next stability band.",
              established: "Strengthening this area is the most direct path to reaching High Stability.",
              high: "This is the area most likely to affect your score if conditions change. Monitor it to maintain your position.",
            }[tier])}
          </p>
        </div>

        <SectionDivider />

        {/* Score improvement levers */}
        <Label>{({
          limited: "FOUNDATIONAL PRIORITIES",
          developing: "KEY IMPROVEMENT LEVERS",
          established: "OPTIMIZATION LEVERS",
          high: "STABILITY MAINTENANCE",
        }[tier])}</Label>
        <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap, margin: 0, padding: 0, listStyle: "none", marginBottom: R.sectionGap }}>
          {(constraintGuidance.length > 0 ? constraintGuidance : [
            "Increase recurring or retainer-based revenue",
            "Increase revenue already committed before the month begins",
            "Reduce dependence on the largest single source",
            "Increase income that continues without active delivery",
          ]).slice(0, 4).map((item, i) => (
            <li key={i} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: B.teal, flexShrink: 0 }}>—</span>{item}
            </li>
          ))}
        </ul>

        <SectionDivider />

        {/* 90-day actions */}
        <Label>{({
          limited: `FOUNDATIONAL ACTIONS — ${record.industry_sector.toUpperCase()} — NEXT 60 DAYS`,
          developing: `BUILD ACTIONS — ${record.industry_sector.toUpperCase()} — NEXT 90 DAYS`,
          established: `OPTIMIZATION ACTIONS — ${record.industry_sector.toUpperCase()} — NEXT 90 DAYS`,
          high: `MAINTENANCE ACTIONS — ${record.industry_sector.toUpperCase()} — NEXT 90 DAYS`,
        }[tier])}</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: R.itemGap, marginBottom: R.sectionGap }}>
          {(() => {
            const impactLabels = {
              limited: ["Critical", "Critical", "High impact", "High impact"],
              developing: ["High impact", "High impact", "Medium-high impact", "Medium impact"],
              established: ["Medium-high impact", "Medium impact", "Medium impact", "Moderate impact"],
              high: ["Maintenance", "Maintenance", "Monitor", "Monitor"],
            }[tier];
            const impactColors = {
              limited: [B.teal, B.teal, B.teal, B.teal],
              developing: [B.teal, B.teal, B.purple, B.light],
              established: [B.purple, B.navy, B.navy, B.light],
              high: [B.teal, B.teal, B.light, B.light],
            }[tier];
            const fallbacks = tier === "high"
              ? ["Protect existing source diversification", "Maintain recurring revenue layers", "Monitor concentration risk quarterly", "Review forward revenue commitments"]
              : tier === "established"
              ? ["Expand existing recurring revenue streams", "Optimize income source balance", "Increase advance revenue commitments", "Strengthen income persistence"]
              : ["Convert one-time work into monthly retainers", "Add support, maintenance, or renewal-based revenue", "Increase prepaid or pre-scheduled work", "Reduce dependence on the largest single source"];
            return [0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ ...T.small, fontWeight: 600, color: B.teal, flexShrink: 0, minWidth: 18 }}>{i + 1}.</span>
                <div style={{ flex: 1 }}>
                  <span style={{ ...T.small, color: B.navy }}>{actionPlan[i] || fallbacks[i]}</span>
                  <div style={{ ...T.micro, color: impactColors[i], fontWeight: 600, marginTop: 2 }}>{impactLabels[i]}</div>
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Tier-aware outlook */}
        {(() => {
          const score = record.final_score;
          if (score >= 80) {
            // HIGH STABILITY — maintain and protect
            return (
              <div style={{ borderRadius: 12, backgroundColor: "rgba(31,109,122,0.06)", border: `1px solid rgba(31,109,122,0.12)`, padding: "8px 12px", marginBottom: R.sectionGap }}>
                <div style={{ ...T.caption, fontWeight: 600, color: B.teal, marginBottom: 6 }}>Maintain &amp; Protect</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
                  Score: {score} — {record.stability_band}
                </div>
                <p style={{ ...T.caption, color: B.muted, lineHeight: 1.6, margin: 0 }}>
                  This income structure is in the top stability tier. The priority is protecting what&apos;s already working: maintain source diversification, preserve recurring revenue layers, and monitor for concentration risk. Reassess in 90 days to confirm structural durability.
                </p>
              </div>
            );
          } else if (score >= 60) {
            // ESTABLISHED — optimize to reach High
            return (
              <div style={{ borderRadius: 12, backgroundColor: B.sand, padding: "8px 12px", marginBottom: R.sectionGap }}>
                <div style={{ ...T.caption, fontWeight: 600, color: B.purple, marginBottom: 6 }}>Optimization Target</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
                  {score} → 80+ (High Stability)
                </div>
                <p style={{ ...T.caption, color: B.muted, lineHeight: 1.6, margin: 0 }}>
                  The foundation is strong. Reaching High Stability (80+) requires fine-tuning: deepening existing recurring revenue, reducing remaining concentration risk, and increasing the share of income that continues without active work.
                </p>
              </div>
            );
          } else if (score >= 40) {
            // DEVELOPING — build toward Established
            return (
              <div style={{ borderRadius: 12, backgroundColor: B.sand, padding: "8px 12px", marginBottom: R.sectionGap }}>
                <div style={{ ...T.caption, fontWeight: 600, color: B.purple, marginBottom: 6 }}>Next Band Target</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
                  {score} → 60+ (Established Stability)
                </div>
                <p style={{ ...T.caption, color: B.muted, lineHeight: 1.6, margin: 0 }}>
                  The income system has early structural elements in place. Reaching Established Stability (60+) requires adding at least one reliable recurring revenue source, reducing dependence on the single largest income stream, and increasing the share of income committed in advance.
                </p>
              </div>
            );
          } else {
            // LIMITED — foundational changes to reach Developing
            return (
              <div style={{ borderRadius: 12, backgroundColor: B.sand, padding: "8px 12px", marginBottom: R.sectionGap }}>
                <div style={{ ...T.caption, fontWeight: 600, color: B.navy, marginBottom: 6 }}>Foundational Target</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
                  {score} → 40+ (Developing Stability)
                </div>
                <p style={{ ...T.caption, color: B.muted, lineHeight: 1.6, margin: 0 }}>
                  This score reflects an income system that relies almost entirely on active work. Reaching Developing Stability (40+) requires foundational changes: converting any portion of income to a recurring or retainer model, adding a second independent income source, and securing even modest forward revenue commitments. These structural shifts typically produce the largest score improvements.
                </p>
              </div>
            );
          }
        })()}

        {/* Bottom line */}
        <div style={{ borderRadius: 10, backgroundColor: "rgba(14,26,43,0.03)", padding: "8px 12px" }}>
          <p style={{ ...T.small, fontWeight: 500, color: B.navy, margin: 0 }}>
            Actions are tailored to the {record.industry_sector} sector based on common structural patterns for this constraint profile.
          </p>
        </div>
      </ReportPage>


      {/* ================================================================
          PAGE 5 — YOUR SUMMARY
          ================================================================ */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          Your Summary
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_5_key_insight_text || ({
            limited: "Here is what your assessment reveals about structural vulnerabilities and what to address first.",
            developing: "Here is your current structural position and the clearest path forward.",
            established: "Here is your structural position and where refinement will have the most impact.",
            high: "Here is your assessment summary and how to maintain this level of stability.",
          }[tier])}
        </p>

        {/* Assessment title + score */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: R.sectionGap }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: B.navy }}>
              {record.assessment_title || "Income Stability Assessment"}
            </div>
            <div style={{ ...T.caption, color: B.light, marginTop: 2 }}>
              {record.industry_sector} · {issuedDate}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: B.navy, lineHeight: 1 }}>{record.final_score}</div>
            <div style={{ ...T.caption, fontWeight: 600, color: B.teal, marginTop: 4 }}>{record.stability_band}</div>
          </div>
        </div>

        {/* Key findings */}
        <div style={{ borderRadius: 12, backgroundColor: B.sand, padding: "8px 12px", marginBottom: R.sectionGap }}>
          <div style={{ ...T.micro, color: B.light, marginBottom: 8 }}>KEY FINDINGS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              `Income continuity: ${record.income_continuity_pct}% continues without active work for ${record.income_continuity_months} month${record.income_continuity_months !== 1 ? "s" : ""}`,
              `Largest source loss scenario: score drops from ${record.final_score} to ${Math.max(0, record.risk_scenario_score)}`,
              `Industry position: ${record.peer_stability_percentile_label} percentile in ${record.industry_sector}`,
              `Primary constraint: ${record.primary_constraint_label}`,
            ].map((f) => (
              <div key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: B.teal, flexShrink: 0 }}>—</span>{f}
              </div>
            ))}
          </div>
        </div>

        {/* Next step */}
        <div style={{
          borderRadius: 10,
          backgroundColor: "rgba(75,63,174,0.04)",
          border: "1px solid rgba(75,63,174,0.10)",
          padding: "8px 12px",
          marginBottom: R.sectionGap,
        }}>
          <div style={{ ...T.caption, fontWeight: 600, color: B.purple, marginBottom: 2 }}>Primary Constraint</div>
          <div style={{ ...T.small, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{record.primary_constraint_label}</div>
          <p style={{ ...T.caption, color: B.muted, margin: 0 }}>
            Improving this area would have the largest impact on the overall score.
          </p>
        </div>

        <SectionDivider />

        {/* Advisor discussion guide */}
        {advisorGuide.talking_points.length > 0 && (
          <div style={{ marginBottom: R.sectionGap }}>
              <Label>ADVISOR DISCUSSION GUIDE</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {advisorGuide.talking_points.slice(0, 2).map((point, i) => (
                  <div key={i} style={{ borderRadius: 10, backgroundColor: B.sand, padding: "6px 10px" }}>
                    <div style={{ ...T.caption, color: B.muted }}>{point}</div>
                  </div>
                ))}
                {advisorGuide.client_questions.length > 0 && (
                  <div style={{ borderRadius: 10, backgroundColor: B.sand, padding: "6px 10px" }}>
                    <div style={{ ...T.micro, color: B.light, marginBottom: 4 }}>QUESTIONS TO DISCUSS</div>
                    {advisorGuide.client_questions.slice(0, 2).map((q, i) => (
                      <div key={i} style={{ ...T.caption, color: B.navy, display: "flex", gap: 4, marginBottom: 2 }}>
                        <span style={{ color: B.teal, flexShrink: 0 }}>—</span>{q}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
        )}

        {/* Evolution path */}
        {evolutionSteps.length > 0 && record.evolution_path_title && (
            <div style={{ marginBottom: R.sectionGap }}>
              <Label>{record.evolution_path_title.toUpperCase()}</Label>
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {evolutionSteps.map((step, i) => {
                  const isCurrent = i === record.current_evolution_stage_position;
                  return (
                    <div key={i} style={{
                      flex: 1, borderRadius: 10, padding: "8px 10px", textAlign: "center",
                      backgroundColor: isCurrent ? B.purple : B.sand,
                      border: isCurrent ? `1.5px solid ${B.purple}` : "1.5px solid transparent",
                      boxShadow: isCurrent ? "0 4px 12px rgba(75,63,174,0.25)" : "none",
                    }}>
                      <div style={{ ...T.micro, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? "#ffffff" : B.light }}>{step}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ ...T.caption, color: B.muted }}>
                Current stage: <strong style={{ color: B.navy }}>{record.current_evolution_stage_label}</strong>
              </div>
            </div>
        )}

        <SectionDivider />

        {/* Reassessment */}
        <div style={{ marginBottom: R.sectionGap }}>
          <Label>REASSESSMENT</Label>
          <div style={{ ...T.small, color: B.navy, marginBottom: 4 }}>
            Recommended reassessment date: <strong>{reassessDate}</strong>
          </div>
          <p style={{ ...T.caption, color: B.muted, margin: 0 }}>
            {({
              limited: "Reassess in 60 days after implementing foundational changes like converting to retainers or adding a second income source. Foundational shifts typically produce the fastest score improvements.",
              developing: "A 90-day window allows time for structural changes to take effect. Reassess after adding or expanding retainers, recurring revenue, or forward commitments.",
              established: "A 90-day review tracks optimization progress. Reassess after refining revenue sources, increasing persistence, or expanding forward commitments.",
              high: "Review in 6 months to confirm structural durability. Reassess sooner only if a major income source changes or concentration risk shifts significantly.",
            }[tier])}
          </p>
        </div>

        <SectionDivider />

        {/* Official record */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: R.sectionGap }}>
          <div style={{ flex: 1 }}>
            <Label>OFFICIAL RECORD</Label>
            <dl style={{ ...T.caption, display: "flex", flexDirection: "column", gap: 4, margin: 0 }}>
              {[
                ["Record ID", record.record_id],
                ["Model", record.model_version || "RP-1.0"],
                ["Registry Status", record.registry_visibility === "public" ? "Publicly Listed" : "Private Record"],
                ["Auth Code", record.authorization_code],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex" }}>
                  <dt style={{ width: 90, flexShrink: 0, color: B.light, fontWeight: 500 }}>{l}</dt>
                  <dd style={{ fontFamily: "monospace", wordBreak: "break-all", color: B.navy, fontSize: 9 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <QRCodeImage recordId={record.record_id} authCode={record.authorization_code} />
            <div style={{ ...T.caption, color: B.light, marginTop: 4 }}>Verify at RunPayway.com/verify</div>
          </div>
        </div>

        {/* Disclosure */}
        <div style={{ ...T.caption, color: B.light, lineHeight: 1.55 }}>
          Based on self-reported data — results are only as accurate as the information provided. This report measures structural income stability under Model RP-1.0. It is not financial, legal, tax, insurance, or investment advice. It does not measure net worth, creditworthiness, or future financial performance. Risk scenarios are structural simulations, not predictions of future events.
        </div>
      </ReportPage>


      {/* ================================================================
          POST-REPORT ACTION PANEL — APP UI, NOT REPORT CONTENT
          ================================================================ */}
      <div className="download-section no-print" style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        {/* Primary actions — horizontal row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#ffffff", borderRadius: 12, border: "none", cursor: "pointer", backgroundColor: B.navy, opacity: downloading ? 0.6 : 1, transition: "background-color 180ms ease, transform 180ms ease", flex: 1, minWidth: 180, boxShadow: "0 4px 12px rgba(14,26,43,0.15)" }}
            onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.purple)}
            onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.navy)}>
            {downloading ? "Generating PDF…" : "Download Report"}
          </button>

          <button
            onClick={() => {
              const url = `https://runpayway.com/verify?id=${record.record_id}&auth=${record.authorization_code}`;
              navigator.clipboard.writeText(url).then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 3000);
              });
            }}
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: linkCopied ? B.teal : B.navy, borderRadius: 12, border: `1px solid ${linkCopied ? B.teal : B.sandDk}`, cursor: "pointer", backgroundColor: linkCopied ? "rgba(31,109,122,0.06)" : "#ffffff", transition: "all 180ms ease" }}>
            {linkCopied ? "Link Copied" : "Copy Verification Link"}
          </button>

          <button
            onClick={() => {
              const nextDate = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
              nextDate.setMonth(nextDate.getMonth() + (record.final_score < 40 ? 2 : record.final_score >= 80 ? 6 : 3));
              const dateStr = nextDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const endDate = new Date(nextDate.getTime() + 30 * 60000);
              const endStr = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("RunPayway™ Income Stability Reassessment")}&dates=${dateStr}/${endStr}&details=${encodeURIComponent(`Time to reassess your Income Stability Score™.\n\nPrevious score: ${record.final_score} (${record.stability_band})\nPrimary focus: ${record.primary_constraint_label}\n\nTake your assessment at https://runpayway.com/pricing`)}`;
              window.open(url, "_blank");
            }}
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: B.navy, borderRadius: 12, border: `1px solid ${B.sandDk}`, cursor: "pointer", backgroundColor: "#ffffff", transition: "all 180ms ease" }}>
            Add Reassessment to Calendar
          </button>
        </div>

        {downloadError && (
          <div style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>PDF download failed: {downloadError}. Try refreshing the page.</p>
          </div>
        )}

        {/* Share Report Summary */}
        <div style={{ padding: "8px 12px", borderRadius: 12, border: `1px solid ${B.sandDk}`, backgroundColor: B.sand }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Share Report Summary</div>
          <p style={{ fontSize: 12, color: B.muted, margin: "0 0 10px 0", lineHeight: 1.5 }}>
            Send the report summary and verification link to an advisor, planner, consultant, or reviewer.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              placeholder="Recipient's email address"
              value={advisorEmail}
              onChange={(e) => setAdvisorEmail(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", fontSize: 13, borderRadius: 12, border: `1px solid ${B.sandDk}`, outline: "none", color: B.navy }}
            />
            <button
              disabled={advisorSending || advisorSent || !advisorEmail.includes("@")}
              onClick={async () => {
                setAdvisorSending(true);
                try {
                  const res = await fetch("/api/v1/send-report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      recipientEmail: advisorEmail.trim(),
                      assessmentTitle: record.assessment_title,
                      finalScore: record.final_score,
                      stabilityBand: record.stability_band,
                      recordId: record.record_id,
                      modelVersion: record.model_version || "RP-1.0",
                      issuedTimestamp: record.issued_timestamp_utc || record.assessment_date_utc,
                      industrySector: record.industry_sector,
                      classification: record.classification,
                      primaryConstraintLabel: record.primary_constraint_label,
                      bandInterpretationText: record.band_interpretation_text,
                      peerPercentileLabel: record.peer_stability_percentile_label,
                    }),
                  });
                  if (res.ok) { setAdvisorSent(true); }
                } catch { /* silent */ }
                finally { setAdvisorSending(false); }
              }}
              style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#ffffff", borderRadius: 12, border: "none", cursor: advisorSent ? "default" : "pointer", backgroundColor: advisorSent ? B.teal : B.purple, opacity: advisorSending || (!advisorEmail.includes("@")) ? 0.6 : 1, transition: "all 180ms ease", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(75,63,174,0.20)" }}>
              {advisorSent ? "Sent" : advisorSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        {/* Email delivery status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {emailStatus === "sending" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.light, animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 13, color: B.muted }}>Sending report to your email...</span>
            </>
          )}
          {emailStatus === "sent" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.teal }} />
              <span style={{ fontSize: 13, color: B.teal, fontWeight: 500 }}>Report sent to your email</span>
            </>
          )}
          {emailStatus === "error" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.muted }} />
              <span style={{ fontSize: 13, color: B.muted }}>Email delivery unavailable — download PDF above</span>
            </>
          )}
        </div>

        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </div>

      {/* ── Print stylesheet + dark mode ── */}
      <style>{`
        @page {
          size: letter;
          margin: 0.5in;
        }
        @media print {
          .no-print, .download-section { display: none !important; }
          .report-page {
            break-inside: avoid;
            page-break-inside: avoid;
            page-break-after: always;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0.5in !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .report-page:last-child {
            page-break-after: auto;
          }
          body { background: white !important; }
        }
        @media (prefers-color-scheme: dark) {
          .report-page {
            background-color: #ffffff !important;
          }
        }
      `}</style>
    </div>
    </ReportErrorBoundary>
  );
}
