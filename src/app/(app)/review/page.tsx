"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/lib/monitoring";
import { useLanguage } from "@/lib/i18n";

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
  constraint_guidance_payload: string;
  structural_improvement_path_text: string;
  action_plan_payload: string;
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;
  projected_final_score: number;
  projected_stability_band: string;
  registry_visibility: string;
}

// ============================================================
// BRAND
// ============================================================
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

// ============================================================
// HELPERS
// ============================================================

function subjectName(r: AssessmentRecord): string {
  return r.assessment_title || "this income system";
}

function subjectPossessive(r: AssessmentRecord): string {
  const name = subjectName(r);
  if (name === "this income system") return "this income system\u2019s";
  return name.endsWith("s") ? `${name}\u2019` : `${name}\u2019s`;
}

function indicatorStrengthSummary(r: AssessmentRecord, rt: typeof import("@/lib/i18n/en").en.report): string {
  const labels = [
    r.income_persistence_label,
    r.income_source_diversity_label,
    r.forward_revenue_visibility_label,
    r.income_variability_label,
    r.active_labor_dependence_label,
    r.exposure_concentration_label,
  ];
  const strong = labels.filter((l) => /high|very high/i.test(l)).length;
  const moderate = labels.filter((l) => /moderate/i.test(l)).length;
  if (strong >= 4) return rt.strengthMany;
  if (strong >= 2) return rt.strengthSome;
  if (moderate >= 3) return rt.moderateResults;
  return rt.earlyStage;
}

function activeIncomeDependence(r: AssessmentRecord, rt: typeof import("@/lib/i18n/en").en.report): string {
  if (r.active_income_level >= 75) return rt.activeWork;
  if (r.active_income_level >= 50) return rt.mixActiveRecurring;
  return rt.mixAll;
}

function percentileExplanation(r: AssessmentRecord, rt: typeof import("@/lib/i18n/en").en.report): string {
  const p = r.peer_stability_percentile;
  const label = r.peer_stability_percentile_label;
  const name = subjectName(r);
  if (p >= 75) return `${name} ${rt.percentileAbove} ${r.industry_sector}.`;
  if (p >= 50) return `${name} ${rt.percentileAverage} ${r.industry_sector}.`;
  return `${name} ${rt.percentileBelow} ${r.industry_sector}.`;
}

function getIndustryBenchmark(finalScore: number, sectorAvg?: number, sectorTop20?: number) {
  const avgScore = sectorAvg ?? 48;
  const top20Range = sectorTop20 ?? 65;
  const distance = Math.max(0, top20Range - finalScore);
  return { avgScore, top20Range, distance };
}

function getRiskExposure(rt: typeof import("@/lib/i18n/en").en.report): Record<string, { mechanism: string; impact: string }> {
  return {
    "Income Continuity Without Active Labor": { mechanism: rt.riskContinuityMech, impact: rt.riskContinuityImpact },
    "Recurring Revenue Base": { mechanism: rt.riskRecurringMech, impact: rt.riskRecurringImpact },
    "Forward Revenue Visibility": { mechanism: rt.riskVisibilityMech, impact: rt.riskVisibilityImpact },
    "Income Concentration": { mechanism: rt.riskConcentrationMech, impact: rt.riskConcentrationImpact },
    "Income Source Count": { mechanism: rt.riskSourceCountMech, impact: rt.riskSourceCountImpact },
    "Earnings Variability": { mechanism: rt.riskVariabilityMech, impact: rt.riskVariabilityImpact },
  };
}

// Rank all 6 factors from strongest to weakest (labels only — no raw values exposed)
function getRankedFactors(r: AssessmentRecord): { label: string; level: string }[] {
  const LEVEL_ORDER: Record<string, number> = { "Very High": 5, "High": 4, "Moderate": 3, "Low": 2, "Very Low": 1 };
  const factors = [
    { label: "Income Persistence", level: r.income_persistence_label, inverted: false },
    { label: "Income Source Diversity", level: r.income_source_diversity_label, inverted: false },
    { label: "Forward Revenue Visibility", level: r.forward_revenue_visibility_label, inverted: false },
    { label: "Monthly Income Consistency", level: r.income_variability_label, inverted: true },
    { label: "Active Labor Independence", level: r.active_labor_dependence_label, inverted: true },
    { label: "Source Diversification", level: r.exposure_concentration_label, inverted: true },
  ];
  return factors
    .map((f) => {
      const raw = LEVEL_ORDER[f.level] || 3;
      const strength = f.inverted ? 6 - raw : raw;
      const displayLevel = f.inverted
        ? (raw <= 2 ? "Strong" : raw === 3 ? "Moderate" : "Weak")
        : (raw >= 4 ? "Strong" : raw === 3 ? "Moderate" : "Weak");
      return { label: f.label, level: displayLevel, _strength: strength };
    })
    .sort((a, b) => b._strength - a._strength)
    .map(({ label, level }) => ({ label, level }));
}

// Identify key positive/negative factors for Page 1
function getKeyFactors(r: AssessmentRecord): { positive: string[]; risks: string[] } {
  const factors = [
    { label: "Income Persistence", value: r.income_persistence_label, inverted: false },
    { label: "Income Source Diversity", value: r.income_source_diversity_label, inverted: false },
    { label: "Forward Revenue Visibility", value: r.forward_revenue_visibility_label, inverted: false },
    { label: "Monthly Income Variability", value: r.income_variability_label, inverted: true },
    { label: "Active Labor Independence", value: r.active_labor_dependence_label, inverted: true },
    { label: "Source Concentration", value: r.exposure_concentration_label, inverted: true },
  ];
  const positive: string[] = [];
  const risks: string[] = [];
  for (const f of factors) {
    const isHigh = /high|very high/i.test(f.value);
    const isLow = /low|very low/i.test(f.value);
    if (f.inverted) {
      if (isLow) positive.push(f.label);
      else if (isHigh) risks.push(f.label);
    } else {
      if (isHigh) positive.push(f.label);
      else if (isLow) risks.push(f.label);
    }
  }
  // Backfill with moderates — ensure at least 3 in each column
  const used = new Set([...positive, ...risks]);
  if (positive.length < 3) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !used.has(f.label) && positive.length < 3) {
        positive.push(f.label);
        used.add(f.label);
      }
    }
  }
  if (risks.length < 3) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !used.has(f.label) && risks.length < 3) {
        risks.push(f.label);
        used.add(f.label);
      }
    }
  }
  return { positive: positive.slice(0, 3), risks: risks.slice(0, 3) };
}

// ============================================================
// REPORT SPACING TOKENS — purposeful, enterprise-grade
// ============================================================
const R = {
  pagePad:    40,
  headerMb:   24,
  sectionGap: 20,
  labelMb:    10,
  paraMb:     10,
  itemGap:    8,
  dividerMy:  18,
  footerMt:   20,
};

const T = {
  score:      { fontSize: 48, fontWeight: 700, lineHeight: 1 },
  pageTitle:  { fontSize: 14, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  band:       { fontSize: 15, fontWeight: 600, lineHeight: 1.3 },
  body:       { fontSize: 12, fontWeight: 400, lineHeight: 1.6 },
  small:      { fontSize: 11, fontWeight: 400, lineHeight: 1.5 },
  label:      { fontSize: 10, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  caption:    { fontSize: 10, fontWeight: 400, lineHeight: 1.5 },
  micro:      { fontSize: 9, fontWeight: 600, lineHeight: 1.3 },
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
            <img src="/runpayway-logo-full.png" alt="RunPayway" style={{ height: 16, width: "auto" }} />
            <span style={{ ...T.caption, color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
          </div>
          <div style={{ ...T.caption, color: B.light }}>
            {record.record_id.slice(0, 8)}… · {ts}
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
      backgroundColor: "#ffffff",
      border: "1px solid #E5E7EB",
      borderRadius: 8,
      padding: R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      minHeight: 600,
    }}>
      <ReportHeader record={record} />
      <div style={{ flex: 1 }}>{children}</div>
      <ConfidentialityFooter record={record} />
    </div>
  );
}

// ============================================================
// PDF DOWNLOAD — html2canvas capture + enterprise overlays
// ============================================================

async function downloadPDF(record: AssessmentRecord) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const pages = document.querySelectorAll(".report-page");
  if (!pages.length) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });

  // ── PDF setup ──
  pdf.setProperties({
    title: `Income Stability Assessment — ${record.assessment_title || "Report"}`,
    author: "RunPayway",
    subject: "Income Stability Score Report",
    keywords: "income stability, assessment, RunPayway, structural analysis",
    creator: `RunPayway Model ${record.model_version || "RP-1.0"}`,
  });

  const pageWidth = 8.5;
  const pageHeight = 11;
  const margin = 0.35;
  const footerReserve = 0.65;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin - footerReserve;
  const captureWidth = 750;

  // ── Capture each .report-page as an image and place it on a PDF page ──
  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;

    // Save original styles
    const origWidth = el.style.width;
    const origMaxWidth = el.style.maxWidth;
    const origBoxSizing = el.style.boxSizing;
    const origBorder = el.style.border;
    const origBorderRadius = el.style.borderRadius;

    // Set fixed width for consistent rendering
    el.style.width = `${captureWidth}px`;
    el.style.maxWidth = `${captureWidth}px`;
    el.style.boxSizing = "border-box";
    el.style.border = "none";
    el.style.borderRadius = "0";

    // Hide HTML footer — the PDF overlay renders its own
    const htmlFooter = el.querySelector(".report-page-footer") as HTMLElement | null;
    if (htmlFooter) htmlFooter.style.display = "none";

    // Let browser reflow, then measure
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const naturalHeight = el.scrollHeight;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: captureWidth,
      height: naturalHeight,
      windowWidth: captureWidth,
    });

    // Restore original styles
    el.style.width = origWidth;
    el.style.maxWidth = origMaxWidth;
    el.style.boxSizing = origBoxSizing;
    el.style.border = origBorder;
    el.style.borderRadius = origBorderRadius;
    if (htmlFooter) htmlFooter.style.display = "";

    // Place on PDF page
    if (i > 0) pdf.addPage();
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;

    // Scale down if taller than page
    const scale = imgHeight > contentHeight ? contentHeight / imgHeight : 1;
    const finalWidth = imgWidth * scale;
    const finalHeight = imgHeight * scale;

    const xOffset = margin + (contentWidth - finalWidth) / 2;
    const yOffset = margin;

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      xOffset,
      yOffset,
      finalWidth,
      finalHeight
    );
  }

  // ── Enterprise overlays: page numbers + confidentiality on every page ──
  const totalPages = pages.length;
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);

    // Confidentiality line
    pdf.setDrawColor(237, 233, 224);
    pdf.setLineWidth(0.004);
    pdf.line(margin, pageHeight - 0.55, pageWidth - margin, pageHeight - 0.55);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Confidential — Prepared for ${record.assessment_title || "Assessment Subject"}`, margin, pageHeight - 0.42);

    pdf.setFont("helvetica", "normal");
    pdf.text("support@runpayway.com", pageWidth - margin, pageHeight - 0.42, { align: "right" });

    // Page number
    pdf.setFontSize(7.5);
    pdf.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 0.28, { align: "center" });
  }

  // ── Save ──
  const shortId = record.record_id.slice(0, 8);
  pdf.save(`RunPayway-Income-Stability-Report-${shortId}.pdf`);

}


// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const rt = t.report;
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);
  const monitoringTracked = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    const parsed: AssessmentRecord = JSON.parse(stored);
    setRecord(parsed);

    // Persist record for Verify a Score lookup
    try {
      const records = JSON.parse(localStorage.getItem("rp_records") || "[]") as Array<Record<string, unknown>>;
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

    // Track monitoring assessment usage (once per load)
    if (!monitoringTracked.current) {
      monitoringTracked.current = true;
      try {
        const purchaseSession = sessionStorage.getItem("rp_purchase_session");
        if (purchaseSession) {
          const ps = JSON.parse(purchaseSession);
          if (ps.plan_key === "annual_monitoring" && ps.monitoring_access_code) {
            useAssessment(ps.monitoring_access_code, parsed.record_id);
          }
        }
      } catch { /* ignore */ }
    }
  }, [router]);

  if (!record) return null;

  const evolutionSteps: string[] = JSON.parse(record.evolution_path_steps_payload);
  const sectorMechanisms: string[] = JSON.parse(record.sector_mechanisms_payload);
  const RISK_EXPOSURE = getRiskExposure(rt);
  const riskData = RISK_EXPOSURE[record.primary_constraint_label] || RISK_EXPOSURE["Forward Revenue Visibility"];
  const subject = subjectName(record);
  const possessive = subjectPossessive(record);
  const keyFactors = getKeyFactors(record);
  const rankedFactors = getRankedFactors(record);
  const bench = getIndustryBenchmark(record.final_score, record.sector_avg_score, record.sector_top_20_threshold);
  const evoIdx = evolutionSteps.length > 1 ? Math.round((record.current_evolution_stage_position / 100) * (evolutionSteps.length - 1)) : 0;

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadPDF(record); } finally { setDownloading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="no-print">
        <h1 style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>{rt.title}</h1>
        <p style={{ fontSize: 14, color: B.muted, marginTop: 4 }}>{rt.modelVersion}</p>
      </div>

      {/* ==================== PAGE 1 — Executive Assessment ==================== */}
      <ReportPage record={record}>
        {/* Executive summary */}
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_1_key_insight_text}
        </p>

        {/* Score presentation */}
        <div style={{ marginBottom: R.sectionGap }}>
          <Label>{rt.scoreLabel}</Label>
          <div style={{ ...T.score, color: B.navy }}>
            {record.final_score}
          </div>
          <div style={{ ...T.band, color: B.teal, marginTop: 6 }}>
            {record.stability_band}
          </div>

          {/* Metadata */}
          <div style={{ ...T.caption, color: B.light, marginTop: R.paraMb, display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
            <span>{rt.assessmentId} {record.record_id.slice(0, 8)}…</span>
            <span>{rt.generated} {record.issued_timestamp_utc || record.assessment_date_utc}</span>
            <span>{rt.model}</span>
          </div>
        </div>

        {/* Spectrum bar */}
        <div style={{ marginBottom: R.sectionGap }}>
          <div style={{ position: "relative", marginBottom: R.itemGap }}>
            <div style={{ height: 8, borderRadius: 99, background: B.gradient }} />
            {/* Score position marker */}
            <div style={{
              position: "absolute",
              left: `${Math.min(Math.max(record.final_score, 0), 100)}%`,
              top: -3,
              width: 14,
              height: 14,
              borderRadius: 99,
              backgroundColor: "#ffffff",
              border: `2px solid ${B.navy}`,
              transform: "translateX(-50%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
            {[40, 60, 80].map((pos) => (
              <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: rt.limited, range: "0\u201339" },
              { label: rt.developing, range: "40\u201359" },
              { label: rt.established, range: "60\u201379" },
              { label: rt.high, range: "80\u2013100" },
            ].map((b) => {
              const isActive = b.label + " Stability" === record.stability_band;
              return (
                <div key={b.label} style={{ textAlign: "center", padding: "4px 2px 3px", borderRadius: 4, border: isActive ? `1.5px solid ${B.navy}` : "1.5px solid transparent", backgroundColor: isActive ? "rgba(14,26,43,0.03)" : "transparent" }}>
                  <div style={{ ...T.micro, fontWeight: isActive ? 700 : T.micro.fontWeight, color: isActive ? B.navy : B.light }}>{b.label}</div>
                  <div style={{ fontSize: 8, fontWeight: isActive ? 600 : 400, color: isActive ? B.navy : B.light }}>{b.range}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Percentile */}
        {record.peer_stability_percentile_label && (
          <div style={{ marginBottom: R.sectionGap }}>
            <p style={{ ...T.body, color: B.muted }}>
              <span style={{ fontWeight: 500, color: B.navy }}>{record.peer_stability_percentile_label} percentile</span>{" "}{rt.percentileWithin} {record.industry_sector}
            </p>
            <p style={{ ...T.small, color: B.muted, marginTop: 6 }}>
              {percentileExplanation(record, rt)}
            </p>
          </div>
        )}

        <SectionDivider />

        {/* Profile */}
        <Label>{rt.profile}</Label>
        <dl style={{ ...T.body, display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${R.itemGap}px 24px` }}>
          {record.assessment_title && (
            <div style={{ gridColumn: "1 / -1" }}>
              <dt style={{ display: "inline", color: B.light }}>{rt.assessmentTitle} </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{record.assessment_title}</dd>
            </div>
          )}
          {[
            [rt.classification, record.classification],
            [rt.structure, record.operating_structure],
            [rt.incomeModel, record.primary_income_model],
            [rt.revenue, record.revenue_structure],
            [rt.sector, record.industry_sector],
          ].map(([l, v]) => (
            <div key={l}>
              <dt style={{ display: "inline", color: B.light }}>{l}: </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        <SectionDivider />

        {/* Key Structural Factors */}
        <Label>{rt.keyFactors} — {subject}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.sectionGap, marginTop: R.paraMb }}>
          <div>
            <div style={{ ...T.label, color: B.teal, marginBottom: R.labelMb }}>
              {rt.positiveFactors}
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.positive.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.teal }} />
                  {f}
                </li>
              ))}
              {keyFactors.positive.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>{rt.noPositive}</li>
              )}
            </ul>
          </div>
          <div>
            <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
              {rt.structuralRisks}
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.risks.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.light }} />
                  {f}
                </li>
              ))}
              {keyFactors.risks.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>{rt.noRisks}</li>
              )}
            </ul>
          </div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 2 — Structural Analysis ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          {rt.structuralAnalysis}
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_2_key_insight_text}
        </p>

        {/* Income Structure Map — color-coded bars */}
        <Label>{rt.incomeStructureMap} — {subject}</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {possessive} {rt.incomeSources}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: R.paraMb }}>
          {[
            { label: rt.activeIncome, value: record.active_income_level, color: B.muted },
            { label: rt.semiPersistent, value: record.semi_persistent_income_level, color: B.teal },
            { label: rt.persistent, value: record.persistent_income_level, color: B.navy },
          ].map((bar) => (
            <div key={bar.label}>
              <div style={{ ...T.small, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: B.muted }}>{bar.label}</span>
                <span style={{ fontWeight: 500, color: B.navy }}>{bar.value}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, overflow: "hidden", backgroundColor: B.sand }}>
                <div style={{ height: "100%", borderRadius: 99, width: `${bar.value}%`, backgroundColor: bar.color }} />
              </div>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Structural Indicators */}
        <Label>{rt.structuralIndicators}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.itemGap }}>
          {[
            [rt.incomeThatContinues, record.income_persistence_label],
            [rt.numberOfSources, record.income_source_diversity_label],
            [rt.incomeScheduled, record.forward_revenue_visibility_label],
            [rt.monthlyVariability, record.income_variability_label],
            [rt.dependencePersonalWork, record.active_labor_dependence_label],
            [rt.dependenceOneSource, record.exposure_concentration_label],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", borderRadius: 6, backgroundColor: B.sand, padding: "8px 12px" }}>
              <span style={{ ...T.caption, color: B.muted }}>{l}</span>
              <span style={{ ...T.caption, fontWeight: 500, color: B.navy }}>{v}</span>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Structural Priority Map — ALL 6 factors */}
        <Label>{rt.priorityMap} — {subject}</Label>
        <p style={{ ...T.caption, color: B.muted, marginBottom: R.paraMb }}>
          {rt.factorsRanked} {possessive}.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {rankedFactors.map((f, i) => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 6, backgroundColor: i === 0 ? "rgba(31,109,122,0.06)" : i >= rankedFactors.length - 1 ? "rgba(14,26,43,0.03)" : "transparent", padding: "5px 10px" }}>
              <span style={{ ...T.caption, fontWeight: 600, color: i === 0 ? B.teal : i >= rankedFactors.length - 1 ? B.light : B.muted, minWidth: 14 }}>{i + 1}</span>
              <span style={{ ...T.small, color: B.navy, flex: 1 }}>{f.label}</span>
              <span style={{ ...T.caption, fontWeight: 500, color: f.level === "Strong" ? B.teal : f.level === "Weak" ? B.muted : B.light }}>{f.level}</span>
            </div>
          ))}
        </div>
      </ReportPage>

      {/* ==================== PAGE 3 — Diagnosis & Benchmarks ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          {rt.diagnosisBenchmarks}
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_4_key_insight_text}
        </p>

        {/* System Diagnosis */}
        <Label>{rt.systemDiagnosis} — {subject}</Label>
        <div style={{ ...T.body, color: B.muted, display: "flex", flexDirection: "column", gap: R.paraMb }}>
          <p>
            {subject} {rt.operatesAs} <strong style={{ color: B.navy }}>{record.labor_asset_position_label}</strong>{" "}
            {record.industry_sector}.
          </p>
          <p>
            {rt.incomeMainly} {activeIncomeDependence(record, rt)}.
            {rt.systemShows} {indicatorStrengthSummary(record, rt)}.
          </p>
          <p>
            <strong style={{ color: B.navy }}>{record.primary_constraint_label}</strong> {rt.becauseConstraint}
          </p>
        </div>

        <SectionDivider />

        {/* Industry Benchmark */}
        <Label>{record.industry_sector} {rt.stabilityBenchmark}</Label>
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${B.sandDk}` }}>
          {[
            [`${rt.avgScore} ${record.industry_sector}`, String(bench.avgScore)],
            [rt.top20, `${bench.top20Range}+`],
            [rt.yourScore, String(record.final_score)],
            [rt.distanceTop, `${bench.distance} ${rt.points}`],
          ].map(([label, value], i) => (
            <div key={label} style={{ ...T.small, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: i % 2 === 0 ? B.sand : "white", padding: "8px 14px" }}>
              <span style={{ color: B.muted }}>{label}</span>
              <span style={{ fontWeight: 600, color: i === 2 ? B.purple : B.navy }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Drivers */}
        <div style={{ marginTop: R.sectionGap }}>
          <Label>{rt.driversSupporting} {possessive}</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: R.itemGap }}>
            {[record.driver_1_label, record.driver_2_label, record.driver_3_label].map((d) => (
              <span key={d} style={{ ...T.caption, fontWeight: 500, borderRadius: 6, backgroundColor: B.sand, color: B.navy, padding: "4px 10px" }}>{d}</span>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Primary Constraint */}
        <Label>{rt.primaryConstraint} — {subject}</Label>
        <div style={{ ...T.body, fontWeight: 500, color: B.navy, marginBottom: R.itemGap }}>{record.primary_constraint_label}</div>
        <div style={{ ...T.small, color: B.muted, display: "flex", flexDirection: "column", gap: R.itemGap }}>
          <p>{riskData.mechanism}</p>
          <p>{riskData.impact}</p>
        </div>

        {/* Projected Score */}
        {record.projected_final_score && record.projected_final_score !== record.final_score && (
          <>
            <SectionDivider />
            <Label>{rt.projectedScore}</Label>
            <div style={{ ...T.body, display: "flex", gap: 32 }}>
              <span style={{ color: B.muted }}>{rt.current} <strong style={{ color: B.navy }}>{record.final_score}</strong></span>
              <span style={{ color: B.muted }}>{rt.projected} <strong style={{ color: B.teal }}>{record.projected_final_score} ({record.projected_stability_band})</strong></span>
            </div>
          </>
        )}
      </ReportPage>

      {/* ==================== PAGE 4 — Improvement Path ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          {rt.improvementPath}
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_6_key_insight_text}
        </p>

        {/* Improvement Opportunities */}
        <Label>{rt.improvementOpportunities} — {subject}</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {record.structural_improvement_path_text}
        </p>

        {/* 90-Day Action Plan */}
        {(() => {
          const actionPlan: string[] = JSON.parse(record.action_plan_payload || "[]");
          if (actionPlan.length === 0) return null;
          return (
            <div style={{ marginTop: R.sectionGap }}>
              <Label>{rt.actionPlan} — {subject}</Label>
              <p style={{ ...T.caption, color: B.muted, marginBottom: R.paraMb }}>
                {rt.actionPlanDesc} {subject}: {record.primary_constraint_label}
              </p>
              <ol style={{ ...T.small, color: B.navy, margin: 0, paddingLeft: 0, listStyleType: "none", display: "flex", flexDirection: "column", gap: R.itemGap }}>
                {actionPlan.map((action, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ ...T.small, fontWeight: 600, color: B.teal, flexShrink: 0, minWidth: 18 }}>{i + 1}.</span>
                    <span style={{ ...T.small, color: B.navy }}>{action}</span>
                  </li>
                ))}
              </ol>
              <p style={{ ...T.caption, color: B.light, marginTop: R.paraMb, fontStyle: "italic" }}>
                {rt.actionPlanDisclaimer} {record.industry_sector}. {record.primary_constraint_label}.
              </p>
            </div>
          );
        })()}

        <SectionDivider />

        {/* Sector evolution */}
        <div>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            {rt.evolutionPath}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: R.itemGap }}>
            {evolutionSteps.map((step, i) => {
              const active = i === evoIdx;
              const past = i < evoIdx;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: R.itemGap }}>
                  <span
                    style={{
                      ...T.caption, fontWeight: 500,
                      padding: "4px 10px", borderRadius: 4,
                      backgroundColor: active ? B.navy : past ? B.teal : B.sand,
                      color: active || past ? "#ffffff" : B.light,
                    }}
                  >
                    {step}
                  </span>
                  {i < evolutionSteps.length - 1 && <span style={{ ...T.caption, color: B.light }}>&rarr;</span>}
                </div>
              );
            })}
          </div>
          <div style={{ ...T.caption, color: B.muted, marginTop: R.paraMb }}>
            {rt.currentStage} <strong style={{ color: B.navy }}>{record.current_evolution_stage_label}</strong>
          </div>
        </div>

        {/* Sector mechanisms */}
        <div style={{ marginTop: R.sectionGap }}>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            {rt.stabilityMechanisms}
          </div>
          <ul style={{ ...T.small, color: B.muted, listStyleType: "disc", listStylePosition: "inside", display: "flex", flexDirection: "column", gap: 4 }}>
            {sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </ReportPage>

      {/* ==================== PAGE 5 — Governance & Official Record ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          {rt.governanceRecord}
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {rt.governanceIntro}
        </p>

        {/* Methodology */}
        <Label>{rt.methodologyLabel}</Label>
        <p style={{ ...T.caption, color: B.muted }}>
          {rt.methodologyText}
        </p>

        <SectionDivider />

        {/* Disclosure */}
        <Label>{rt.disclosure}</Label>
        <p style={{ ...T.caption, color: B.light }}>
          {rt.disclosureText}
        </p>

        <SectionDivider />

        {/* Official Record */}
        <Label>{rt.officialRecord}</Label>
        <dl style={{ ...T.small, display: "flex", flexDirection: "column", gap: R.itemGap, marginTop: R.paraMb }}>
          {[
            [rt.recordId, record.record_id],
            [rt.modelLabel, record.model_version || "RP-1.0 | Version 1.0"],
            [rt.date, record.issued_timestamp_utc || record.assessment_date_utc],
            [rt.score, `${record.final_score} — ${record.stability_band}`],
            [rt.authCode, record.authorization_code],
            [rt.registry, record.registry_visibility === "public" ? rt.publiclyListed : rt.privateRecord],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex" }}>
              <dt style={{ width: 80, flexShrink: 0, color: B.light }}>{l}</dt>
              <dd style={{ ...T.caption, fontFamily: "monospace", wordBreak: "break-all", color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* Verification */}
        <p style={{ ...T.caption, color: B.muted, marginTop: R.sectionGap }}>
          {rt.verifyAt} <span style={{ fontWeight: 500, color: B.navy }}>RunPayway™.com/verify</span>.
        </p>

        {/* Model reference */}
        <div style={{ textAlign: "center", marginTop: R.footerMt, paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}` }}>
          <div style={{ ...T.caption, color: B.light }}>{rt.modelReference}</div>
        </div>
      </ReportPage>

      {/* Download */}
      <div className="download-section no-print" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{ padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#ffffff", borderRadius: 6, border: "none", cursor: "pointer", backgroundColor: B.navy, opacity: downloading ? 0.6 : 1, transition: "background-color 180ms ease" }}
          onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.purple)}
          onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.navy)}>
          {downloading ? rt.generatingPdf : rt.downloadReport}
        </button>
        <p style={{ ...T.body, color: B.light }}>{rt.emailCopy}</p>
      </div>

      <div className="print-footer hidden print:block">RunPayway™ Income Stability Assessment — Model RP-1.0 | Version 1.0</div>
    </div>
  );
}
