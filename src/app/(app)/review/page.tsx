"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";
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
// BRAND — Refined Institutional Design System
// ============================================================
const B = {
  navy: "#0F172A",      // Slate 900 — cooler, more modern anchor
  ink: "#1E293B",       // Slate 800 — secondary text
  sand: "#F8FAFC",      // Slate 50 — clean cool background
  bone: "#F1F5F9",      // Slate 100 — card backgrounds
  white: "#FFFFFF",
  stone: "#E2E8F0",     // Slate 200 — borders
  taupe: "#94A3B8",     // Slate 400 — labels and metadata
  muted: "#64748B",     // Slate 500 — body text
  purple: "#4B3FAE",    // Brand accent — kept
  teal: "#0F766E",      // Teal 700 — positive/support signal
  // Band colors
  bandLimited: "#DC2626",    // Red 600
  bandDeveloping: "#D97706", // Amber 600
  bandEstablished: "#2563EB",// Blue 600
  bandHigh: "#16A34A",       // Green 600
};

// ============================================================
// SPACING + TYPOGRAPHY TOKENS
// ============================================================
const R = {
  pagePad: 52,
  headerMb: 20,
  sectionGap: 20,
  labelMb: 8,
  paraMb: 10,
  itemGap: 10,
  dividerMy: 20,
  footerMt: 20,
};

const T = {
  score: { fontSize: 90, fontWeight: 600, lineHeight: 1 },
  pageTitle: { fontSize: 27, fontWeight: 600, lineHeight: 1.2, color: "#0E1A2B" },
  classification: { fontSize: 19, fontWeight: 500, lineHeight: 1.3 },
  overline: { fontSize: 10.5, fontWeight: 500, lineHeight: 1.3, letterSpacing: "0.14em", textTransform: "uppercase" as const },
  sectionLabel: { fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 },
  cardHeading: { fontSize: 14, fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: 11.5, fontWeight: 400, lineHeight: 1.52 },
  small: { fontSize: 10.5, fontWeight: 400, lineHeight: 1.45 },
  meta: { fontSize: 10, fontWeight: 400, lineHeight: 1.4 },
  micro: { fontSize: 9.5, fontWeight: 500, lineHeight: 1.3 },
};

// ── PDF page dimensions ──
const PDF = {
  captureW: 816,
  scale: 2,
  pageW: 8.5,
  pageH: 11,
  margin: 0.72,
  footer: 0.68,
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

function ReportHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: R.headerMb, paddingBottom: 12, borderBottom: `1px solid ${B.stone}` }}>
      <Image src={logoImg} alt="RunPayway" width={120} height={14} style={{ height: "auto" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ ...T.meta, color: B.taupe }}>Income Stability Score™</div>
        <div style={{ ...T.meta, color: B.taupe }}>Model RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children }: { children: React.ReactNode }) {
  return <div style={{ ...T.overline, color: B.taupe, marginBottom: R.labelMb }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: B.stone, marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${B.stone}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.meta, color: B.taupe }}>{section} · Page {page}</span>
        <span style={{ ...T.meta, color: B.taupe }}>Model RP-2.0 · runpayway.com/methodology</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, explanation }: { label: string; value: React.ReactNode; explanation: string }) {
  return (
    <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 22px" }}>
      <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: B.navy, marginBottom: 8 }}>{value}</div>
      <div style={{ ...T.small, color: B.muted, lineHeight: 1.55 }}>{explanation}</div>
    </div>
  );
}

function DiagnosisBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: B.white, border: `1px solid ${B.stone}`, borderTop: `2px solid ${B.purple}`, borderRadius: 2, padding: "20px 24px" }}>
      {children}
    </div>
  );
}

function SimpleTermsBox({ title, copy, takeaway }: { title: string; copy: string; takeaway: string }) {
  return (
    <div style={{ backgroundColor: B.sand, borderTop: `1px solid ${B.stone}`, borderBottom: `1px solid ${B.stone}`, padding: "16px 20px", marginTop: 16, marginBottom: 16 }}>
      <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>{title}</div>
      <p style={{ ...T.body, color: B.navy, margin: "0 0 10px", maxWidth: 520, lineHeight: 1.55 }}>{copy}</p>
      <p style={{ ...T.small, color: B.muted, margin: 0, fontStyle: "italic" }}>{takeaway}</p>
    </div>
  );
}

function ReportPage({ children, noPad }: { record: AssessmentRecord; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div className="report-page" style={{
      width: PDF.captureW,
      maxWidth: "100%",
      backgroundColor: B.sand,
      border: "none",
      borderRadius: 0,
      padding: noPad ? 0 : R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "visible",
    }}>
      {children}
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
      ? `https://peoplestar.com/RunPayway/verify?id=${recordId}&auth=${authCode}`
      : `https://peoplestar.com/RunPayway/verify?id=${recordId}`;
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
    keywords: "income stability, assessment, RunPayway, income analysis",
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
    score >= 75 ? "high" : score >= 50 ? "established" : score >= 30 ? "developing" : "limited";

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

  // ── Band color helper ──
  const bandColor = tier === "high" ? B.bandHigh : tier === "established" ? B.bandEstablished : tier === "developing" ? B.bandDeveloping : B.bandLimited;

  // ── Indicator helpers ──
  function indicatorLevel(label: string, inverted: boolean): { display: string; color: string } {
    const isHigh = /high|very high/i.test(label);
    const isLow = /low|very low/i.test(label);
    if (inverted) {
      if (isHigh) return { display: "High", color: B.bandLimited };
      if (isLow) return { display: "Low", color: B.teal };
      return { display: "Moderate", color: B.ink };
    }
    if (isHigh) return { display: "High", color: B.teal };
    if (isLow) return { display: "Low", color: B.bandLimited };
    return { display: "Moderate", color: B.ink };
  }

  return (
    <ReportErrorBoundary>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, maxWidth: PDF.captureW, margin: "0 auto", padding: "0 0 40px" }}>

      {/* ================================================================
          PAGE 1 — EXECUTIVE DIAGNOSTIC
          ================================================================ */}
      {/* ---- PAGE 1 — EXECUTIVE DIAGNOSTIC ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <Overline>YOUR INCOME STABILITY REPORT</Overline>
        <h1 style={{ ...T.pageTitle, marginBottom: 28 }}>Your Score</h1>

        <div style={{ marginBottom: 24 }}>
          <div style={{ ...T.score, color: B.navy }}>{record.final_score}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>{record.stability_band}</div>
          </div>
          {record.peer_stability_percentile_label && (
            <div style={{ ...T.small, color: B.muted, marginTop: 6 }}>
              {record.peer_stability_percentile_label} percentile among {(record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} professionals
            </div>
          )}
        </div>

        <DiagnosisBlock>
          <p style={{ ...T.body, color: B.navy, fontWeight: 500, margin: "0 0 6px" }}>
            Your income is working, but it is not yet well protected.
          </p>
          <p style={{ ...T.body, color: B.muted, margin: 0, maxWidth: 540 }}>
            You scored {record.final_score} out of 100. Too much of your income still depends on ongoing work, and not enough is already lined up ahead of time. That makes it easier to disrupt than it needs to be.
          </p>
        </DiagnosisBlock>

        <SimpleTermsBox
          title="What this means"
          copy="Your income is real, but if work slows or a key source weakens, there is not enough built-in protection to keep things stable."
          takeaway="Bottom line: Your income works, but it is still too exposed."
        />

        {/* Classification Scale */}
        <div style={{ marginTop: 8, marginBottom: 20 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>INCOME STABILITY CLASSIFICATION SCALE</div>
          <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 10 }}>
            {[
              { w: 30, color: B.bandLimited },
              { w: 20, color: B.bandDeveloping },
              { w: 25, color: B.bandEstablished },
              { w: 25, color: B.bandHigh },
            ].map((seg, i) => (
              <div key={i} style={{ width: `${seg.w}%`, backgroundColor: seg.color, borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: (tier === "limited" && i === 0) || (tier === "developing" && i === 1) || (tier === "established" && i === 2) || (tier === "high" && i === 3) ? 1 : 0.25 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {[
              { range: "0–29", label: "Limited Stability", color: B.bandLimited, tier: "limited" as const },
              { range: "30–49", label: "Developing Stability", color: B.bandDeveloping, tier: "developing" as const },
              { range: "50–74", label: "Established Stability", color: B.bandEstablished, tier: "established" as const },
              { range: "75–100", label: "High Stability", color: B.bandHigh, tier: "high" as const },
            ].map((band) => (
              <div key={band.range} style={{ flex: 1, opacity: tier === band.tier ? 1 : 0.5 }}>
                <div style={{ ...T.micro, color: band.color, fontWeight: tier === band.tier ? 700 : 500 }}>{band.range}</div>
                <div style={{ ...T.meta, color: tier === band.tier ? B.navy : B.taupe, fontWeight: tier === band.tier ? 600 : 400 }}>{band.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <MetricCard label="Income Continuity" value={`${record.income_continuity_pct}%`} explanation="Portion of income likely to continue for a short period if active work stopped today." />
          <MetricCard label="Largest Source Stress Test" value={<>{record.final_score} <span style={{ color: B.taupe, fontWeight: 400 }}>→</span> {Math.max(0, record.risk_scenario_score)}</>} explanation="If your largest income source disappeared, your score would likely fall to this level." />
          <MetricCard label="Main Constraint" value="Too Little Income Secured Ahead" explanation="Not enough of your upcoming income is already committed before the month begins." />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          {[["Industry", record.industry_sector], ["Date Issued", issuedDate], ["Record ID", record.record_id.slice(0, 8)]].map(([l, v]) => (
            <div key={l}>
              <div style={{ ...T.meta, color: B.taupe }}>{l}</div>
              <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{v}</div>
            </div>
          ))}
        </div>

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score™ is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>

        <PageFooter section="Your Score" page={1} />
      </ReportPage>


      {/* ---- PAGE 2 — STRUCTURAL BREAKDOWN ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>Why This Score</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 520 }}>
          This page breaks down the main reasons behind your score. The question is not whether you earn income. The question is how well that income holds up when something changes.
        </p>

        <div style={{ display: "flex", gap: 20 }}>
          {/* Left: Sub-score modules */}
          <div style={{ flex: 2 }}>
            <Overline>WHAT DRIVES YOUR SCORE</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Continuity", level: indicatorLevel(record.income_persistence_label, false), pct: record.persistent_income_level + record.semi_persistent_income_level, desc: "How long income can keep coming in if you stop working for a period of time." },
                { label: "Income Secured Ahead", level: indicatorLevel(record.forward_revenue_visibility_label, false), pct: Math.min(record.forward_revenue_visibility_label === "High" || record.forward_revenue_visibility_label === "Very High" ? 70 : record.forward_revenue_visibility_label === "Moderate" ? 45 : 18, 100), desc: "How much upcoming income is already committed before the next month begins." },
                { label: "Source Diversification", level: indicatorLevel(record.income_source_diversity_label, false), pct: record.income_source_diversity_label === "High" || record.income_source_diversity_label === "Very High" ? 65 : record.income_source_diversity_label === "Moderate" ? 50 : 25, desc: "How many meaningful income sources support the structure and how much it depends on one of them." },
                { label: "Dependence on Your Active Work", level: indicatorLevel(record.active_labor_dependence_label, true), pct: record.active_income_level, desc: "How much income still depends on you continuing to work directly." },
                { label: "Dependence on One Source", level: indicatorLevel(record.exposure_concentration_label, true), pct: record.exposure_concentration_label === "High" || record.exposure_concentration_label === "Very High" ? 82 : record.exposure_concentration_label === "Moderate" ? 50 : 25, desc: "How much damage would be done if your largest income source weakened or disappeared." },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ ...T.sectionLabel, color: B.navy }}>{s.label}</span>
                    <span style={{ ...T.small, fontWeight: 600, color: s.level.color }}>{s.level.display}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, backgroundColor: B.stone, marginBottom: 4 }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${s.pct}%`, backgroundColor: B.navy }} />
                  </div>
                  <div style={{ ...T.meta, color: B.muted }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Reason Codes */}
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 22px" }}>
            <Overline>KEY FINDINGS</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { code: "R-12", title: "Low Forward-Secured Income", text: "Not enough future income is already lined up before the month begins." },
                { code: "R-07", title: "High Source Dependence", text: "The structure depends too much on the largest income source." },
                { code: "R-03", title: "Short Continuity Window", text: "Income does not continue long enough without active work." },
                { code: "R-01", title: "Work-Led Structure", text: "Too much income still depends on your direct effort." },
              ].map((rc) => (
                <div key={rc.code} style={{ borderBottom: `1px solid ${B.stone}`, paddingBottom: 8 }}>
                  <div style={{ ...T.micro, color: B.purple }}>{rc.code} | {rc.title}</div>
                  <div style={{ ...T.meta, color: B.muted, marginTop: 2 }}>{rc.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom cards */}
        <div style={{ display: "flex", gap: 14, marginTop: 20, marginBottom: 16 }}>
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "18px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>WHAT IS HELPING THE SCORE</div>
            {["Income exists across more than one stream", "Month-to-month consistency is not fully unstable", "Some income persistence is already present", "The structure is not starting from zero"].map((b) => (
              <div key={b} style={{ ...T.meta, color: B.ink, display: "flex", gap: 6, marginBottom: 3 }}><span style={{ color: B.taupe }}>—</span>{b}</div>
            ))}
          </div>
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "18px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>WHAT IS HOLDING THE SCORE DOWN</div>
            {["Too little income is secured before the month begins", "Too much income depends on ongoing active work", "The largest source carries too much weight", "Continuity beyond a short period remains weak"].map((b) => (
              <div key={b} style={{ ...T.meta, color: B.ink, display: "flex", gap: 6, marginBottom: 3 }}><span style={{ color: B.taupe }}>—</span>{b}</div>
            ))}
          </div>
        </div>

        {/* Simple definitions */}
        <div style={{ backgroundColor: B.sand, borderTop: `1px solid ${B.stone}`, borderBottom: `1px solid ${B.stone}`, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>KEY TERMS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              ["Income secured ahead", "money already lined up before the month begins"],
              ["Continuity", "how long income keeps coming in if you stop working"],
              ["Dependence on one source", "how much you rely on one main source of income"],
              ["Recurring income", "income that repeats"],
              ["Built-in income", "income that can continue with less day-to-day work"],
            ].map(([term, def]) => (
              <div key={term} style={{ ...T.small, color: B.navy }}>
                <span style={{ fontWeight: 500 }}>{term}</span>
                <span style={{ color: B.muted }}> = {def}</span>
              </div>
            ))}
          </div>
          <p style={{ ...T.small, color: B.muted, margin: "10px 0 0", fontStyle: "italic" }}>
            Bottom line: Not enough income is lined up ahead, and too much depends on ongoing work.
          </p>
        </div>

        <DiagnosisBlock>
          <p style={{ ...T.small, color: B.navy, fontWeight: 500, margin: "0 0 4px" }}>What would help most:</p>
          <p style={{ ...T.small, color: B.muted, margin: 0 }}>
            {`The fastest improvement would come from securing more income ahead. An increase of 15 percentage points in income secured ahead is projected to raise the score from ${record.final_score} to ${Math.min(100, record.final_score + 5)}.`}
          </p>
        </DiagnosisBlock>

        <PageFooter section="Why This Score" page={2} />
      </ReportPage>


      {/* ---- PAGE 3 — RISK EXPOSURE ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>What Could Go Wrong</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 520 }}>
          This page shows where your income is most vulnerable. It does not predict the future — it shows what would weaken first if something changes.
        </p>

        {/* Two large cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 3, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 24px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>LARGEST SOURCE STRESS TEST</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.navy }}>{record.final_score}</span>
              <span style={{ fontSize: 16, color: B.taupe }}>→</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}</span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              This is a stress test, not a prediction. It shows that the current structure would weaken meaningfully if the largest income source were lost.
            </p>
          </div>
          <div style={{ flex: 2, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 24px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>CONTINUITY WINDOW</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
              Estimated: {record.income_continuity_months} month{record.income_continuity_months !== 1 ? "s" : ""}
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              Based on the current structure, only a limited share of income appears likely to continue if active work stops.
            </p>
          </div>
        </div>

        {/* Income Structure Mix */}
        <Overline>INCOME STRUCTURE MIX</Overline>
        <div style={{ display: "flex", gap: 2, height: 10, marginBottom: 12, marginTop: 6 }}>
          <div style={{ width: `${record.active_income_level}%`, backgroundColor: B.navy, borderRadius: 1 }} />
          <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: B.taupe, borderRadius: 1 }} />
          <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: B.teal, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          {[
            { label: "Active Income", pct: record.active_income_level, color: B.ink, desc: "Income that depends on direct personal effort" },
            { label: "Recurring Income", pct: record.semi_persistent_income_level, color: B.bandEstablished, desc: "Income that repeats for a period of time" },
            { label: "Built-In Income", pct: record.persistent_income_level, color: B.teal, desc: "Income that continues with limited ongoing effort" },
          ].map((seg) => (
            <div key={seg.label} style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1, backgroundColor: seg.color }} />
                <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{seg.label} — {seg.pct}%</span>
              </div>
              <div style={{ ...T.meta, color: B.muted }}>{seg.desc}</div>
            </div>
          ))}
        </div>

        <SimpleTermsBox
          title="What this means"
          copy="If work slows or a major source weakens, your income may drop faster than it should. A stronger setup would hold up better."
          takeaway="Bottom line: Your income is still too easy to disrupt."
        />

        {/* Three interpretation cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          {[
            { title: "What weakens first", copy: "Not your current income — but the lack of income already lined up to carry you through a disruption." },
            { title: "The hidden risk", copy: "You can earn well and still be fragile. Your income is productive, but it does not yet absorb disruption well." },
            { title: "Where you stand now", copy: "You can produce income, but if work stops or a major source weakens, stability drops quickly." },
          ].map((card) => (
            <div key={card.title} style={{ flex: 1, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "18px 20px" }}>
              <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>{card.title}</div>
              <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{card.copy}</p>
            </div>
          ))}
        </div>

        <DiagnosisBlock>
          <p style={{ ...T.small, color: B.navy, fontWeight: 500, margin: "0 0 4px" }}>The key risk:</p>
          <p style={{ ...T.small, color: B.muted, margin: 0 }}>
            Your income still loses strength too easily when something changes.
          </p>
        </DiagnosisBlock>

        <PageFooter section="What Could Go Wrong" page={3} />
      </ReportPage>


      {/* ---- PAGE 4 — UPGRADE PATH ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>How to Improve</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 540 }}>
          The fastest way to raise your score is not to work more. It is to change how your income is set up — more income lined up ahead, less dependence on one source, and more income that keeps going without daily effort.
        </p>

        {/* Band cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${bandColor}`, borderRadius: 2, padding: "16px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>CURRENT BAND</div>
            <div style={{ ...T.cardHeading, color: bandColor }}>{record.stability_band} | {record.final_score}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>The structure works, but it is not yet strong enough to absorb disruption well.</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${tier === "high" ? B.bandHigh : tier === "established" ? B.bandHigh : tier === "developing" ? B.bandEstablished : B.bandDeveloping}`, borderRadius: 2, padding: "16px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>NEXT TARGET BAND</div>
            <div style={{ ...T.cardHeading, color: B.navy }}>{record.final_score < 30 ? "Developing Stability | 30+" : record.final_score < 50 ? "Established Stability | 50+" : record.final_score < 75 ? "High Stability | 75+" : "Maintain Current"}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>{record.final_score < 75 ? "The next target is a structure with more income secured ahead, less source dependence, and stronger continuity." : "The priority is maintaining and protecting this position."}</p>
          </div>
        </div>

        {/* What the next state looks like */}
        <div style={{ backgroundColor: B.white, border: `1px solid ${B.stone}`, borderTop: `2px solid ${B.purple}`, borderRadius: 2, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What a stronger structure usually looks like</div>
          {[
            "More income is already committed before the month begins",
            "No single source carries outsized structural weight",
            "A modest recurring layer is present and dependable",
            "Continuity extends beyond a short interruption window",
            "The structure relies less exclusively on direct personal output",
          ].map((b) => (
            <div key={b} style={{ ...T.body, color: B.muted, display: "flex", gap: 8, marginBottom: 4 }}><span style={{ color: B.stone }}>—</span>{b}</div>
          ))}
        </div>

        <SimpleTermsBox
          title="What this means"
          copy="Line up more income before the month starts. Depend less on your biggest source. Build more income that keeps going even when you are not working."
          takeaway="Bottom line: Secure more income ahead and reduce how much depends on one source."
        />

        {/* Action cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {[
            { rank: "Priority 1", title: "Increase Income Secured Ahead", copy: "Create more income that is already committed before the month begins. Examples include retainers, multi-month agreements, advance bookings, pre-sold packages, or recurring contracts." },
            { rank: "Priority 2", title: "Reduce Dependence on the Largest Source", copy: "Reduce how much the structure depends on the largest source by strengthening one or more dependable secondary sources." },
            { rank: "Priority 3", title: "Convert One-Time Work into Ongoing Revenue", copy: "Shift part of one-time work into income that repeats or renews where the business model allows." },
            { rank: "Priority 4", title: "Extend How Long Income Continues", copy: "Build more income that can continue for a period of time even when daily work slows or stops." },
          ].map((action) => (
            <div key={action.rank} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ ...T.micro, color: B.purple, minWidth: 60, paddingTop: 2 }}>{action.rank}</div>
              <div>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 3 }}>{action.title}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{action.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <DiagnosisBlock>
          <p style={{ ...T.small, color: B.navy, fontWeight: 500, margin: "0 0 4px" }}>Your fastest improvement:</p>
          <p style={{ ...T.small, color: B.muted, margin: 0 }}>
            Lining up more income ahead of time is the single clearest way to raise your score.
          </p>
        </DiagnosisBlock>

        <PageFooter section="How to Improve" page={4} />
      </ReportPage>


      {/* ---- PAGE 5 — DECISION SUMMARY ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 16 }}>What to Do Next</h1>

        <DiagnosisBlock>
          <p style={{ ...T.body, color: B.navy, fontWeight: 500, margin: "0 0 8px" }}>The main takeaway:</p>
          <p style={{ ...T.body, color: B.muted, margin: 0, maxWidth: 540, lineHeight: 1.6 }}>
            You do not need to earn more first. You need to change how your income is set up. The income is there, but not enough of it is lined up ahead to keep things stable when something changes.
          </p>
        </DiagnosisBlock>

        <SimpleTermsBox
          title="What this means"
          copy="Working harder will not fix this. The goal is to set up your income so it holds up better — even when work slows or something changes."
          takeaway="Bottom line: Strengthen the setup, not just the output."
        />

        {/* Two columns: What to do / What not to */}
        <div style={{ display: "flex", gap: 24, marginTop: 24, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What to do next</div>
            {[
              "Secure at least one multi-month or forward-committed revenue arrangement",
              "Reduce dependence on the single largest source",
              "Convert part of active-work income into repeatable income",
              "Build a longer continuity window before reassessment",
              "Reassess only after real structural change is in place",
            ].map((item, i) => (
              <div key={i} style={{ ...T.small, color: B.ink, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.purple, fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>{item}
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What not to prioritize yet</div>
            {[
              "Working more without improving the structure underneath it",
              "Short bursts of output that do not improve durability",
              "Temporary spikes that disappear when work stops",
              "Metrics that do not improve continuity or income secured ahead",
            ].map((item) => (
              <div key={item} style={{ ...T.small, color: B.muted, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.stone }}>—</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <Overline>90-DAY STRUCTURAL CHECKLIST</Overline>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
          {[
            "Create one offer, agreement, or revenue stream that secures income ahead for more than one month.",
            "Identify the largest source and reduce how much the structure depends on it.",
            "Add one recurring, retained, or repeatable income component.",
            "Improve visibility into next month's income before the month begins.",
            "Reassess only after the structural changes are active, not just planned.",
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${B.stone}`, flexShrink: 0, marginTop: 2 }} />
              <span style={{ ...T.small, color: B.ink }}>{row}</span>
            </div>
          ))}
        </div>

        {/* Bottom cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "18px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>RECOMMENDED REASSESSMENT DATE</div>
            <div style={{ ...T.cardHeading, color: B.navy, marginBottom: 6 }}>{reassessDate}</div>
            <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>Retake the assessment after real structural improvement, not after a short-term earnings spike.</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "18px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 4 }}>VERIFICATION</div>
            <div style={{ ...T.meta, color: B.ink, display: "flex", flexDirection: "column", gap: 2 }}>
              <div>Record ID: <span style={{ fontFamily: "monospace", fontSize: 9 }}>{record.record_id.slice(0, 8)}</span></div>
              <div>Registry Status: Private Record</div>
              <div>Model: {record.model_version || "RP-2.0"}</div>
              <div>Verification: peoplestar.com/RunPayway/verify</div>
            </div>
          </div>
        </div>

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score™ is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes. This report reflects a present-state structural interpretation under the RunPayway framework.
        </p>

        <PageFooter section="What to Do Next" page={5} />
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
              const url = `https://peoplestar.com/RunPayway/verify?id=${record.record_id}&auth=${record.authorization_code}`;
              navigator.clipboard.writeText(url).then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 3000);
              });
            }}
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: linkCopied ? B.purple : B.navy, borderRadius: 12, border: `1px solid ${linkCopied ? B.purple : B.stone}`, cursor: "pointer", backgroundColor: linkCopied ? "rgba(31,109,122,0.06)" : "#ffffff", transition: "all 180ms ease" }}>
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
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: B.navy, borderRadius: 12, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: "#ffffff", transition: "all 180ms ease" }}>
            Add Reassessment to Calendar
          </button>
        </div>

        {downloadError && (
          <div style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>PDF download failed: {downloadError}. Try refreshing the page.</p>
          </div>
        )}

        {/* Share Report Summary */}
        <div style={{ padding: "8px 12px", borderRadius: 12, border: `1px solid ${B.stone}`, backgroundColor: B.bone }}>
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
              style={{ flex: 1, padding: "8px 12px", fontSize: 13, borderRadius: 12, border: `1px solid ${B.stone}`, outline: "none", color: B.navy }}
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
              style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#ffffff", borderRadius: 12, border: "none", cursor: advisorSent ? "default" : "pointer", backgroundColor: advisorSent ? B.purple : B.purple, opacity: advisorSending || (!advisorEmail.includes("@")) ? 0.6 : 1, transition: "all 180ms ease", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(75,63,174,0.20)" }}>
              {advisorSent ? "Sent" : advisorSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        {/* Email delivery status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {emailStatus === "sending" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.taupe, animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 13, color: B.muted }}>Sending report to your email...</span>
            </>
          )}
          {emailStatus === "sent" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.purple }} />
              <span style={{ fontSize: 13, color: B.purple, fontWeight: 500 }}>Report sent to your email</span>
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
