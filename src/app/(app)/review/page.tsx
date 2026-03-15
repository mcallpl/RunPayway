"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  structural_improvement_path_text: string;
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

function indicatorStrengthSummary(r: AssessmentRecord): string {
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
  if (strong >= 4) return "strength in many areas";
  if (strong >= 2) return "some areas of strength";
  if (moderate >= 3) return "moderate results in several areas";
  return "early-stage results with limited income that continues on its own";
}

function activeIncomeDependence(r: AssessmentRecord): string {
  if (r.active_income_level >= 75) return "income from active work";
  if (r.active_income_level >= 50) return "a mix of active and partly recurring income";
  return "a mix of active, partly recurring, and ongoing income";
}

function percentileExplanation(r: AssessmentRecord): string {
  const p = r.peer_stability_percentile;
  const label = r.peer_stability_percentile_label;
  const name = subjectName(r);
  if (p >= 75) return `A score at the ${label} percentile means ${name} is more stable than most income systems in the ${r.industry_sector} sector.`;
  if (p >= 50) return `A score at the ${label} percentile means ${name} is about as stable as the average income system in the ${r.industry_sector} sector.`;
  return `A score at the ${label} percentile means ${name} is less stable than most income systems in the ${r.industry_sector} sector.`;
}

function getIndustryBenchmark(finalScore: number) {
  const avgScore = 48;
  const top20Range = 65;
  const distance = Math.max(0, top20Range - finalScore);
  return { avgScore, top20Range, distance };
}

const RISK_EXPOSURE: Record<string, { mechanism: string; impact: string }> = {
  "Income Continuity Without Active Labor": {
    mechanism: "Income depends on ongoing work. If work stops, income stops too.",
    impact: "A health issue, break, or slowdown could mean no income during that time.",
  },
  "Recurring Revenue Base": {
    mechanism: "Most income comes from one-time payments rather than repeating revenue.",
    impact: "Stability depends on always finding new clients or deals.",
  },
  "Forward Revenue Visibility": {
    mechanism: "Very little income is already scheduled or committed for future months.",
    impact: "Income may drop if there are gaps between jobs or clients.",
  },
  "Income Concentration": {
    mechanism: "Most income comes from one or very few sources.",
    impact: "Losing a main source could cause a big drop in income.",
  },
  "Income Source Count": {
    mechanism: "Income comes from very few independent sources.",
    impact: "Losing any one source could seriously affect total income.",
  },
  "Earnings Variability": {
    mechanism: "Monthly income changes a lot from month to month.",
    impact: "It is harder to plan or meet regular financial obligations.",
  },
};

// Identify key positive/negative factors for Page 1
function getKeyFactors(r: AssessmentRecord): { positive: string[]; risks: string[] } {
  // For inverted indicators (variability, labor dependence, concentration),
  // "low/very low" is GOOD and "high/very high" is BAD.
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
      // Inverted: low = positive, high = risk
      if (isLow) positive.push(f.label);
      else if (isHigh) risks.push(f.label);
    } else {
      // Normal: high = positive, low = risk
      if (isHigh) positive.push(f.label);
      else if (isLow) risks.push(f.label);
    }
  }
  // If not enough, add moderate ones
  if (positive.length < 2) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && positive.length < 2) positive.push(f.label);
    }
  }
  if (risks.length < 2) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !positive.includes(f.label) && risks.length < 2) risks.push(f.label);
    }
  }
  return { positive: positive.slice(0, 3), risks: risks.slice(0, 3) };
}

// ============================================================
// REPORT SPACING TOKENS — purposeful, enterprise-grade
// ============================================================
/* Report spacing — tuned for 750px capture → letter-size PDF */
const R = {
  pagePad:    32,    /* page container padding */
  headerMb:   20,    /* header → first content */
  sectionGap: 16,    /* between major sections */
  labelMb:    8,     /* label → content below */
  paraMb:     8,     /* between paragraphs */
  itemGap:    6,     /* between list/grid items */
  dividerMy:  14,    /* divider vertical margin */
  footerMt:   16,    /* above page footer */
};

/* Report typography — strict hierarchy, no Tailwind text-* classes */
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
  return (
    <div style={{ marginBottom: R.headerMb }}>
      <div style={{ height: 3, borderRadius: "6px 6px 0 0", overflow: "hidden", background: B.gradient, margin: `-${R.pagePad}px -${R.pagePad}px 0` }} />
      <div style={{ paddingTop: 12, paddingBottom: 10, borderBottom: `1px solid ${B.sandDk}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...T.label, color: B.navy }}>RUNPAYWAY™</span>
            <span style={{ ...T.caption, color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
          </div>
          <div style={{ ...T.caption, color: B.light }}>
            {record.record_id.slice(0, 8)}… · {record.assessment_date_utc}
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

function ReportPage({ record, children }: { record: AssessmentRecord; children: React.ReactNode }) {
  return (
    <div className="report-page" style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: 8, padding: R.pagePad }}>
      <ReportHeader record={record} />
      {children}
    </div>
  );
}

// ============================================================
// PDF DOWNLOAD
// ============================================================

async function downloadPDF(recordId: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const pages = document.querySelectorAll(".report-page");
  if (!pages.length) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  const pageWidth = 8.5;
  const pageHeight = 11;
  const margin = 0.35;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  // Fixed capture width for consistent rendering
  const captureWidth = 750;

  // Exactly 3 report pages → exactly 3 PDF pages. One-to-one.
  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;

    // Save original styles
    const origWidth = el.style.width;
    const origMinHeight = el.style.minHeight;
    const origMaxWidth = el.style.maxWidth;
    const origBoxSizing = el.style.boxSizing;
    const origHeight = el.style.height;
    const origOverflow = el.style.overflow;

    // Set fixed width, let height be natural
    el.style.width = `${captureWidth}px`;
    el.style.maxWidth = `${captureWidth}px`;
    el.style.boxSizing = "border-box";
    el.style.height = "auto";
    el.style.minHeight = "0";
    el.style.overflow = "visible";

    // Let the browser reflow, then measure actual height
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
    el.style.minHeight = origMinHeight;
    el.style.maxWidth = origMaxWidth;
    el.style.boxSizing = origBoxSizing;
    el.style.height = origHeight;
    el.style.overflow = origOverflow;

    // Place each report page on exactly one PDF page — scale to fit
    if (i > 0) pdf.addPage();
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;

    // If content is taller than page, scale down to fit
    const scale = imgHeight > contentHeight ? contentHeight / imgHeight : 1;
    const finalWidth = imgWidth * scale;
    const finalHeight = imgHeight * scale;

    // Center on page
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

  const shortId = recordId.slice(0, 8);
  pdf.save(`RunPayway-Income-Stability-Report-${shortId}.pdf`);
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    setRecord(JSON.parse(stored));
  }, [router]);

  if (!record) return null;

  const evolutionSteps: string[] = JSON.parse(record.evolution_path_steps_payload);
  const sectorMechanisms: string[] = JSON.parse(record.sector_mechanisms_payload);
  const riskData = RISK_EXPOSURE[record.primary_constraint_label] || RISK_EXPOSURE["Forward Revenue Visibility"];
  const subject = subjectName(record);
  const possessive = subjectPossessive(record);
  const keyFactors = getKeyFactors(record);
  const bench = getIndustryBenchmark(record.final_score);

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadPDF(record.record_id); } finally { setDownloading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="no-print">
        <h1 style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>Income Stability Assessment</h1>
        <p style={{ fontSize: 14, color: B.muted, marginTop: 4 }}>Model RP-1.0 | Version 1.0</p>
      </div>

      {/* ==================== PAGE 1 — Executive Assessment ==================== */}
      <ReportPage record={record}>
        {/* Executive summary */}
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_1_key_insight_text}
        </p>

        {/* Score presentation */}
        <div style={{ marginBottom: R.sectionGap }}>
          <Label>Income Stability Score™</Label>
          <div style={{ ...T.score, color: B.navy }}>
            {record.final_score}
          </div>
          <div style={{ ...T.band, color: B.teal, marginTop: 6 }}>
            {record.stability_band}
          </div>

          {/* Metadata */}
          <div style={{ ...T.caption, color: B.light, marginTop: R.paraMb, display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
            <span>Assessment ID: {record.record_id.slice(0, 8)}…</span>
            <span>Generated: {record.assessment_date_utc}</span>
            <span>Model: RP-1.0</span>
          </div>
        </div>

        {/* Spectrum bar */}
        <div style={{ marginBottom: R.sectionGap }}>
          <div style={{ position: "relative", marginBottom: R.itemGap }}>
            <div style={{ height: 8, borderRadius: 99, background: B.gradient }} />
            {[40, 60, 80].map((pos) => (
              <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: "Limited", range: "0\u201339" },
              { label: "Developing", range: "40\u201359" },
              { label: "Established", range: "60\u201379" },
              { label: "High", range: "80\u2013100" },
            ].map((b) => (
              <div key={b.label} style={{ textAlign: "center" }}>
                <div style={{ ...T.micro, color: b.label + " Stability" === record.stability_band ? B.navy : B.light }}>{b.label}</div>
                <div style={{ fontSize: 8, fontWeight: 400, color: B.light }}>{b.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Percentile */}
        {record.peer_stability_percentile_label && (
          <div style={{ marginBottom: R.sectionGap }}>
            <p style={{ ...T.body, color: B.muted }}>
              <span style={{ fontWeight: 500, color: B.navy }}>{record.peer_stability_percentile_label} percentile</span>{" "}within {record.industry_sector}
            </p>
            <p style={{ ...T.small, color: B.muted, marginTop: 6 }}>
              {percentileExplanation(record)}
            </p>
          </div>
        )}

        <SectionDivider />

        {/* Profile */}
        <Label>Profile</Label>
        <dl style={{ ...T.body, display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${R.itemGap}px 24px` }}>
          {record.assessment_title && (
            <div style={{ gridColumn: "1 / -1" }}>
              <dt style={{ display: "inline", color: B.light }}>Assessment Title: </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{record.assessment_title}</dd>
            </div>
          )}
          {[
            ["Classification", record.classification],
            ["Structure", record.operating_structure],
            ["Income Model", record.primary_income_model],
            ["Revenue", record.revenue_structure],
            ["Sector", record.industry_sector],
          ].map(([l, v]) => (
            <div key={l}>
              <dt style={{ display: "inline", color: B.light }}>{l}: </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        <SectionDivider />

        {/* Key Structural Factors */}
        <Label>Key Structural Factors Affecting Your Score</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.sectionGap, marginTop: R.paraMb }}>
          <div>
            <div style={{ ...T.label, color: B.teal, marginBottom: R.labelMb }}>
              Positive Factors
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.positive.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.teal }} />
                  {f}
                </li>
              ))}
              {keyFactors.positive.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>No strong positive factors identified</li>
              )}
            </ul>
          </div>
          <div>
            <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
              Structural Risks
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.risks.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.light }} />
                  {f}
                </li>
              ))}
              {keyFactors.risks.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>No significant structural risks identified</li>
              )}
            </ul>
          </div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 2 — Structural Analysis ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          Structural Analysis
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_2_key_insight_text}
        </p>

        {/* Income Structure Map */}
        <Label>Income Structure Map</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {possessive} income comes from three types of sources.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: R.paraMb }}>
          {[
            { label: "Active Income", value: record.active_income_level, color: B.muted },
            { label: "Semi-Persistent", value: record.semi_persistent_income_level, color: B.teal },
            { label: "Persistent", value: record.persistent_income_level, color: B.navy },
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
        <Label>Structural Indicators</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.itemGap }}>
          {[
            ["Income That Continues", record.income_persistence_label],
            ["Number of Income Sources", record.income_source_diversity_label],
            ["Income Already Scheduled", record.forward_revenue_visibility_label],
            ["Monthly Income Variability", record.income_variability_label],
            ["Dependence on Personal Work", record.active_labor_dependence_label],
            ["Dependence on One Source", record.exposure_concentration_label],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", borderRadius: 6, backgroundColor: B.sand, padding: "8px 12px" }}>
              <span style={{ ...T.caption, color: B.muted }}>{l}</span>
              <span style={{ ...T.caption, fontWeight: 500, color: B.navy }}>{v}</span>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* System Diagnosis */}
        <Label>System Diagnosis</Label>
        <div style={{ ...T.body, color: B.muted, display: "flex", flexDirection: "column", gap: R.paraMb }}>
          <p>
            {subject} operates mainly as a <strong style={{ color: B.navy }}>{record.labor_asset_position_label}</strong> income
            system in the <strong style={{ color: B.navy }}>{record.industry_sector}</strong> sector.
          </p>
          <p>
            Income mainly comes from {activeIncomeDependence(record)}.
            The system shows {indicatorStrengthSummary(record)}.
          </p>
          <p>
            Because <strong style={{ color: B.navy }}>{record.primary_constraint_label}</strong> is limited,
            stability depends on continuing to generate new work.
          </p>
        </div>

        <SectionDivider />

        {/* Industry Benchmark */}
        <Label>Industry Stability Benchmark</Label>
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${B.sandDk}` }}>
          {[
            [`Average ${record.industry_sector} Stability Score`, String(bench.avgScore)],
            ["Top 20% Stability Range", `${bench.top20Range}+`],
            ["Your Score", String(record.final_score)],
            ["Distance From Top Stability Tier", `${bench.distance} points`],
          ].map(([label, value], i) => (
            <div key={label} style={{ ...T.small, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: i % 2 === 0 ? B.sand : "white", padding: "8px 14px" }}>
              <span style={{ color: B.muted }}>{label}</span>
              <span style={{ fontWeight: 600, color: i === 2 ? B.purple : B.navy }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Drivers */}
        <div style={{ marginTop: R.sectionGap }}>
          <Label>Drivers Supporting Stability</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: R.itemGap }}>
            {[record.driver_1_label, record.driver_2_label, record.driver_3_label].map((d) => (
              <span key={d} style={{ ...T.caption, fontWeight: 500, borderRadius: 6, backgroundColor: B.sand, color: B.navy, padding: "4px 10px" }}>{d}</span>
            ))}
          </div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 3 — Improvement Path & Governance ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          Improvement Path &amp; Governance
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_3_key_insight_text}
        </p>

        {/* Primary Constraint */}
        <Label>Primary Structural Constraint</Label>
        <div style={{ ...T.body, fontWeight: 500, color: B.navy, marginBottom: R.itemGap }}>{record.primary_constraint_label}</div>
        <div style={{ ...T.small, color: B.muted, display: "flex", flexDirection: "column", gap: R.itemGap }}>
          <p>{riskData.mechanism}</p>
          <p>{riskData.impact}</p>
        </div>

        <SectionDivider />

        {/* Improvement Opportunities */}
        <Label>Improvement Opportunities</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {record.structural_improvement_path_text}
        </p>

        {/* Sector evolution */}
        <div style={{ marginTop: R.sectionGap }}>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            Sector Evolution Path
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: R.itemGap }}>
            {evolutionSteps.map((step, i) => {
              const idx = evolutionSteps.length > 1 ? Math.round((record.current_evolution_stage_position / 100) * (evolutionSteps.length - 1)) : 0;
              const active = i === idx;
              const past = i < idx;
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
            Current Stage: <strong style={{ color: B.navy }}>{record.current_evolution_stage_label}</strong>
          </div>
        </div>

        {/* Sector mechanisms */}
        <div style={{ marginTop: R.sectionGap }}>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            Sector Stability Mechanisms
          </div>
          <ul style={{ ...T.small, color: B.muted, listStyleType: "disc", listStylePosition: "inside", display: "flex", flexDirection: "column", gap: 4 }}>
            {sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>

        <SectionDivider />

        {/* Methodology */}
        <Label>Methodology</Label>
        <p style={{ ...T.caption, color: B.muted }}>
          The Income Stability Score™ evaluates the structural stability of income at a specific point in time.
          Six structural factors are assessed under Model RP-1.0 using fixed, deterministic scoring criteria.
          The model does not evaluate investment performance, creditworthiness, or future financial outcomes.
        </p>

        <SectionDivider />

        {/* Disclosure */}
        <Label>Disclosure</Label>
        <p style={{ ...T.caption, color: B.light }}>
          This report is created by a fixed classification model. It is not financial advice.
          The Income Stability Score is not a credit score, not a measure of net worth,
          and not a prediction of future income.
        </p>

        <SectionDivider />

        {/* Official Record */}
        <Label>Official Classification Record</Label>
        <dl style={{ ...T.small, display: "flex", flexDirection: "column", gap: R.itemGap, marginTop: R.paraMb }}>
          {[
            ["Record ID", record.record_id],
            ["Model", record.model_version],
            ["Date", record.assessment_date_utc],
            ["Score", `${record.final_score} — ${record.stability_band}`],
            ["Auth Code", record.authorization_code],
            ["Registry", record.registry_visibility === "public" ? "Publicly Listed" : "Private Record"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex" }}>
              <dt style={{ width: 80, flexShrink: 0, color: B.light }}>{l}</dt>
              <dd style={{ ...T.caption, fontFamily: "monospace", wordBreak: "break-all", color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* Verification */}
        <p style={{ ...T.caption, color: B.muted, marginTop: R.sectionGap }}>
          Verify this report at <span style={{ fontWeight: 500, color: B.navy }}>RunPayway.com/verify</span> using the Record ID and Authorization Code.
        </p>

        {/* Model reference */}
        <div style={{ textAlign: "center", marginTop: R.footerMt, paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}` }}>
          <div style={{ ...T.caption, color: B.light }}>RunPayway Structural Stability Model RP-1.0</div>
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
          {downloading ? "Generating PDF..." : "Download Report"}
        </button>
        <p style={{ ...T.body, color: B.light }}>A copy of this report will be sent to your email.</p>
      </div>

      <div className="print-footer hidden print:block">RunPayway™ Income Stability Assessment — Model RP-1.0 | Version 1.0</div>
    </div>
  );
}
