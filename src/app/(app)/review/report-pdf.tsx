/* ================================================================== */
/*  report-pdf.tsx — Fixed 4-page print document                      */
/*  jsPDF absolute coordinates, measured text, hard overflow failure   */
/*  RunPayway(TM) Income Stability Report · Model RP-2.0              */
/* ================================================================== */

export interface ReportPDFData {
  assessmentTitle: string;
  issuedDate: string;
  formalDate: string;
  finalScore: number;
  stabilityBand: string;
  bandColor: string;
  tier: string;
  coverBandDesc: string;
  accessCode: string;
  diagnosticSentence: string;
  plainEnglish: string;
  whyNotHigher?: string;
  dominantConstraintText: string;
  whatToChangeFirst: string;
  whatThatWouldDo: string;
  nextBandName: string | null;
  distanceToNext: number;
  bandDistance: string;
  bandDistanceText: string;
  score: number;
  pressureMap?: {
    operatingStructure: string;
    incomeModel: string;
    industry: string;
    pressure: string;
    tailwind: string;
    leverageMove: string;
  };
  killerLine: string;
  activeIncome: number;
  semiPersistentIncome: number;
  persistentIncome: number;
  riskScenarioScore: number;
  riskScenarioDrop: number;
  continuityDisplay: string;
  continuityText: string;
  riskSeverityText: string;
  rankedFactors: Array<{
    role: string; label: string; level: string;
    normalizedValue: number; explanation: string;
    roleColor: string; levelColor: string;
  }>;
  strongestSupports: string[];
  strongestSuppressors: string[];
  fragilityDiagnostic: string;
  scenarios: Array<{
    title: string; originalScore: number; scenarioScore: number;
    scoreDrop: number; narrative?: string; bandShift?: boolean;
    originalBand?: string; scenarioBand?: string;
  }>;
  fragilityLabel: string;
  fragilityText: string;
  fragilityColor: string;
  failureMode?: string;
  patternToWatch?: { pattern: string; consequence: string; reframe?: string };
  actionCategories: Array<{
    tag: string; tagColor: string; title: string;
    how: string; scoreChange: string;
  }>;
  combinedLift?: {
    projectedScore: number; lift: number;
    bandShift?: string; explanation?: string;
  };
  tradeoff?: {
    actionLabel: string; upside: string;
    downside: string; recommendation: string;
  };
  avoidActions: string[];
  roadmap: Array<{
    week: string; action: string;
    detail: string; target?: string;
  }>;
  reassessDate: string;
  reassessDaysLeft: number;
  reassessTiming: string;
  triggers: string[];
}

/* ================================================================== */
/*  CONSTANTS                                                          */
/* ================================================================== */

import type { jsPDF } from "jspdf";

const W = 612;
const ML = 48;
const CW = 516;
const Y0 = 72;
const YL = 700;
const YF = 756;
const CX = W / 2; // center x

/* ================================================================== */
/*  SANITIZE                                                           */
/* ================================================================== */

function S(t: string): string {
  return (t || "")
    .replace(/\u2192|\u2190/g, " to ")
    .replace(/\u2191/g, " up").replace(/\u2193/g, " down")
    .replace(/\u2014/g, " - ").replace(/\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2122/g, "(TM)").replace(/\u00B7/g, " - ")
    .replace(/\u2022/g, "-").replace(/&#8482;/g, "(TM)")
    .replace(/&amp;/g, "&").replace(/&middot;/g, " - ");
}

/* ================================================================== */
/*  FONT LOADING                                                       */
/* ================================================================== */

let fontsLoaded = false;

async function loadFonts(doc: jsPDF) {
  const fonts = [
    { file: "Inter-Regular.ttf", name: "Inter", style: "normal" },
    { file: "Inter-Medium.ttf", name: "InterM", style: "normal" },
    { file: "Inter-SemiBold.ttf", name: "InterSB", style: "normal" },
    { file: "Inter-Bold.ttf", name: "InterB", style: "normal" },
  ];
  try {
    for (const f of fonts) {
      let r: Response;
      try { r = await fetch(`/RunPayway/fonts/${f.file}`); if (!r.ok) throw 0; }
      catch { r = await fetch(`/fonts/${f.file}`); }
      const b = new Uint8Array(await r.arrayBuffer());
      let s = ""; for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
      doc.addFileToVFS(f.file, btoa(s));
      doc.addFont(f.file, f.name, f.style);
    }
    fontsLoaded = true;
  } catch (e) {
    console.error("Font loading failed, using Helvetica fallback:", e);
    fontsLoaded = false;
  }
}

/** Safe font setter — falls back to Helvetica if Inter not loaded */
function sf(doc: jsPDF, font: string) {
  if (fontsLoaded) {
    doc.setFont(font, "normal");
  } else {
    const style = font === "InterB" || font === "InterSB" ? "bold" : "normal";
    doc.setFont("helvetica", style);
  }
}

/* ================================================================== */
/*  HELPERS: truncate, cleanTitle, cleanConstraint                     */
/* ================================================================== */

/** Truncate at last word boundary before maxChars */
function truncate(text: string, maxChars: number): string {
  const clean = S(text);
  if (clean.length <= maxChars) return clean;
  const cut = clean.substring(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > maxChars * 0.6 ? cut.substring(0, lastSpace) : cut) + "...";
}

/** Map backend scenario titles to plain English */
function cleanTitle(title: string): string {
  const map: Record<string, string> = {
    "Active Labor Interrupted": "You are unable to work for an extended period",
    "Platform Dependency Shock": "A major income source changes terms or access",
    "Forward Commitments Delayed": "Expected income arrives later than planned",
    "Client Concentration Loss": "Your largest client stops paying",
    "Market Contraction": "Demand in your industry drops significantly",
    "High Volatility Month": "You have a slow month with no backup revenue",
    "Key Client Loss": "You lose a key client or contract",
    "Revenue Model Disruption": "Your primary income model stops working",
    "Seasonal Revenue Gap": "Seasonal slowdown cuts your income",
    "Pricing Pressure": "What you can charge drops due to market pressure",
    "Recurring Stream Degrades": "A repeating income stream weakens or stops",
    "Referral Pipeline Dries": "New business or referrals dry up",
    "Contract Non Renewal": "A major contract is not renewed",
    "Scope Reduction": "A client cuts the scope of your work",
    "Regulatory Disruption": "A regulatory change affects how you earn",
  };
  // Check exact match first
  if (map[title]) return map[title];
  // Check partial match
  for (const [key, val] of Object.entries(map)) {
    if (title.toLowerCase().includes(key.toLowerCase().split(" ")[0])) return val;
  }
  // Clean up camelCase/snake_case
  return title.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
}

/** Clean raw constraint field names into readable text */
function cleanConstraint(text: string): string {
  return text
    .replace(/-?\d+\s*labor[_\s]dependence[_\s]?%?/gi, "Reduce labor dependence by 15 percentage points")
    .replace(/-?\d+\s*income[_\s]persistence[_\s]?%?/gi, "Increase recurring income by 15 percentage points")
    .replace(/-?\d+\s*largest[_\s]source[_\s]?%?/gi, "Reduce largest source concentration")
    .replace(/-?\d+\s*forward[_\s]secured[_\s]?%?/gi, "Increase forward visibility")
    .replace(/labor_dependence_pct/gi, "labor dependence")
    .replace(/income_persistence_pct/gi, "recurring income")
    .replace(/largest_source_pct/gi, "largest source share")
    .replace(/forward_secured_pct/gi, "forward visibility")
    .replace(/source_diversity_count/gi, "number of income sources");
}

/* ================================================================== */
/*  PRIMITIVES                                                         */
/* ================================================================== */

/** Measure wrapped text height in pt */
function mh(doc: jsPDF, text: string, w: number, sz: number, font = "Inter", lh = 1.45): number {
  sf(doc, font); doc.setFontSize(sz);
  return doc.splitTextToSize(S(text), w).length * sz * lh;
}

/** Draw wrapped text, return NEXT y. maxLines caps rendered lines. */
function dt(doc: jsPDF, text: string, x: number, y: number, w: number, sz: number,
  opts?: { font?: string; color?: string; lh?: number; align?: "left"|"center"|"right"; maxLines?: number }): number {
  const font = opts?.font || "Inter";
  const color = opts?.color || "#0E1A2B";
  const lh = opts?.lh || 1.45;
  sf(doc, font); doc.setFontSize(sz); doc.setTextColor(color);
  let lines: string[] = doc.splitTextToSize(S(text), w);
  if (opts?.maxLines && lines.length > opts.maxLines) {
    lines = lines.slice(0, opts.maxLines);
    const last = lines[lines.length - 1];
    if (last && !last.endsWith("...")) {
      lines[lines.length - 1] = last.replace(/\s+\S*$/, "") + "...";
    }
  }
  const sp = sz * lh;
  for (let i = 0; i < lines.length; i++) {
    const ly = y + i * sp;
    const ax = opts?.align === "center" ? x + w / 2 : opts?.align === "right" ? x + w : x;
    doc.text(lines[i], ax, ly, opts?.align ? { align: opts.align } : undefined);
  }
  return y + lines.length * sp;
}

/** Draw filled rounded rect card */
function card(doc: jsPDF, x: number, y: number, w: number, h: number,
  leftColor?: string, leftW = 2.5) {
  doc.setFillColor("#F8F6F1");
  doc.roundedRect(x, y, w, h, 3, 3, "F");
  doc.setDrawColor("#E8E5DE"); doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 3, 3, "S");
  if (leftColor) { doc.setFillColor(leftColor); doc.rect(x, y + 2, leftW, h - 4, "F"); }
}

/** Draw page footer */
function footer(doc: jsPDF, section: string, page: number) {
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, 740, ML + CW, 740);
  sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#6B6155");
  doc.text(S(`Confidential - ${section}`), ML, YF);
  doc.text(`Page ${page} of 4`, CX, YF, { align: "center" });
  doc.text("support@runpayway.com", ML + CW, YF, { align: "right" });
}

/** Draw interior page header */
function header(doc: jsPDF) {
  sf(doc, "InterB"); doc.setFontSize(8); doc.setTextColor("#0E1A2B");
  doc.text("RUNPAYWAY(TM)", ML, 40);
  sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#6B6155");
  doc.text("Income Stability Score  -  Model RP-2.0", ML + CW, 40, { align: "right" });
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, 50, ML + CW, 50);
}

/** Overline label */
function label(doc: jsPDF, text: string, x: number, y: number, color = "#6B6155") {
  sf(doc, "InterB"); doc.setFontSize(8);
  doc.setTextColor(color); doc.text(S(text), x, y);
}

/** Overflow check — logs warning but does not throw */
function check(y: number, h: number, tag: string) {
  if (y + h > YL) {
    console.warn(`PDF layout warning: ${tag} may overflow (y=${Math.round(y)}, h=${Math.round(h)}, limit=${YL})`);
  }
}

function fits(y: number, h: number): boolean {
  return y + h <= YL;
}

/* ================================================================== */
/*  PAGE 1 — COVER                                                     */
/* ================================================================== */

function page1(doc: jsPDF, d: ReportPDFData) {
  let y = 150;

  // Logo
  sf(doc, "InterB"); doc.setFontSize(11); doc.setTextColor("#0E1A2B");
  doc.text("RUNPAYWAY(TM)", CX, y, { align: "center", charSpace: 2 });

  // Divider
  y += 16;
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(CX - 90, y, CX + 90, y);

  // Title
  y += 32;
  sf(doc, "InterB"); doc.setFontSize(28); doc.setTextColor("#0E1A2B");
  doc.text("Income Stability Report", CX, y, { align: "center" });

  // Subtitle
  y += 16;
  sf(doc, "Inter"); doc.setFontSize(10.5); doc.setTextColor("#535D6B");
  doc.text("A structural assessment of income resilience", CX, y, { align: "center" });

  // Name
  y += 32;
  sf(doc, "InterM"); doc.setFontSize(18); doc.setTextColor("#0E1A2B");
  doc.text(S(d.assessmentTitle), CX, y, { align: "center" });

  // Date
  y += 16;
  sf(doc, "Inter"); doc.setFontSize(9.5); doc.setTextColor("#6B6155");
  doc.text(S(d.formalDate), CX, y, { align: "center" });

  // Score
  y += 32;
  sf(doc, "InterB"); doc.setFontSize(46); doc.setTextColor("#0E1A2B");
  doc.text(String(d.finalScore), CX, y, { align: "center" });
  // /100
  sf(doc, "InterB"); doc.setFontSize(46);
  const sw = doc.getTextWidth(String(d.finalScore));
  sf(doc, "Inter"); doc.setFontSize(16); doc.setTextColor("#6B6155");
  doc.text("/100", CX + sw / 2 + 4, y);

  // Band
  y += 24;
  doc.setFillColor(d.bandColor);
  doc.rect(CX - 48, y - 6, 5, 5, "F");
  sf(doc, "InterSB"); doc.setFontSize(14); doc.setTextColor(d.bandColor);
  doc.text(S(d.stabilityBand), CX - 38, y);

  // Band desc
  y += 16;
  const bdH = mh(doc, d.coverBandDesc, 320, 10.5);
  dt(doc, d.coverBandDesc, CX - 160, y, 320, 10.5, { color: "#535D6B", align: "center" });
  y += bdH;

  // Model line
  y += 24;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#6B6155");
  doc.text("Built from fixed structural questions under Model RP-2.0.", CX, y, { align: "center" });

  // Simulator access
  y += 24;
  label(doc, "STABILITY SIMULATOR(TM) ACCESS", CX - 80, y, "#0E1A2B");
  y += 12;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
  doc.text("Use this code at runpayway.com/simulator", CX, y, { align: "center" });

  y += 12;
  doc.setFont("Courier", "normal"); doc.setFontSize(7);
  const codeLines: string[] = doc.splitTextToSize(S(d.accessCode), 400);
  const codeH = codeLines.length * 10 + 12;
  card(doc, CX - 210, y, 420, codeH);
  doc.setFont("Courier", "normal"); doc.setFontSize(7); doc.setTextColor("#0E1A2B");
  for (let i = 0; i < codeLines.length; i++) {
    doc.text(codeLines[i], CX - 200, y + 10 + i * 10);
  }
  y += codeH + 16;

  // Model + pages
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#6B6155");
  doc.text("Model RP-2.0 - 4 Pages", CX, y, { align: "center" });

  footer(doc, "Cover", 1);
}

/* ================================================================== */
/*  PAGE 2 — SCORE & DIAGNOSIS                                        */
/* ================================================================== */

function page2(doc: jsPDF, d: ReportPDFData) {
  header(doc);
  let y = Y0;

  // Overline
  sf(doc, "InterB"); doc.setFontSize(8); doc.setTextColor("#1F6D7A");
  doc.text("INCOME STABILITY ASSESSMENT", CX, y, { align: "center", charSpace: 1.5 });

  // Name — y+20 not y+16
  y += 20;
  sf(doc, "InterB"); doc.setFontSize(16); doc.setTextColor("#0E1A2B");
  doc.text(S(d.assessmentTitle), CX, y, { align: "center" });

  // Date — y+16 not y+14
  y += 16;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#6B6155");
  doc.text(S(`${d.formalDate} - Model RP-2.0`), CX, y, { align: "center" });

  // Score — y+28 not y+24, 42pt not 46pt
  y += 28;
  sf(doc, "InterB"); doc.setFontSize(42); doc.setTextColor("#0E1A2B");
  doc.text(String(d.finalScore), CX, y, { align: "center" });
  // /100 — 14pt not 16pt
  sf(doc, "InterB"); doc.setFontSize(42);
  const sw2 = doc.getTextWidth(String(d.finalScore));
  y += 8;
  sf(doc, "Inter"); doc.setFontSize(14); doc.setTextColor("#6B6155");
  doc.text("/100", CX + sw2 / 2 + 4, y);

  // Band — 12pt not 14pt
  y += 16;
  doc.setFillColor(d.bandColor); doc.rect(CX - 48, y - 6, 5, 5, "F");
  sf(doc, "InterSB"); doc.setFontSize(12); doc.setTextColor(d.bandColor);
  doc.text(S(d.stabilityBand), CX - 38, y);

  // Points to next — 9pt muted centered
  if (d.nextBandName) {
    y += 12;
    sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
    doc.text(S(`${d.distanceToNext} points from ${d.nextBandName} Stability`), CX, y, { align: "center" });
  }

  // Gap before diagnostic card — y+24
  y += 24;

  // Diagnostic card
  const diagH = mh(doc, d.diagnosticSentence, CW - 28, 11, "InterM") + 16;
  check(y, diagH, "P2-diag");
  card(doc, ML, y, CW, diagH, "#0E1A2B");
  dt(doc, d.diagnosticSentence, ML + 14, y + 12, CW - 28, 11, { font: "InterM" });
  y += diagH + 12;

  // Plain English card — cap at 6 lines
  const peH = Math.min(mh(doc, d.plainEnglish, CW - 28, 10.5), 6 * 10.5 * 1.45) + 24;
  check(y, peH, "P2-pe");
  card(doc, ML, y, CW, peH);
  label(doc, "IN PLAIN ENGLISH", ML + 10, y + 12);
  dt(doc, d.plainEnglish, ML + 10, y + 24, CW - 28, 10.5, { maxLines: 6 });
  y += peH + 12;

  // Constraint card — use cleanConstraint for text, truncate for columns
  const ctH = 72;
  check(y, ctH, "P2-constraint");
  card(doc, ML, y, CW, ctH, "#4B3FAE");
  label(doc, "PRIMARY STRUCTURAL CONSTRAINT", ML + 10, y + 12, "#4B3FAE");
  dt(doc, cleanConstraint(d.dominantConstraintText), ML + 10, y + 24, CW - 28, 10.5);

  // Two columns inside constraint card
  const colW = (CW - 36) / 2;
  sf(doc, "InterSB"); doc.setFontSize(8.5); doc.setTextColor("#6B6155");
  doc.text("Highest-leverage change", ML + 10, y + 44);
  doc.text("Projected effect", ML + 10 + colW + 16, y + 44);
  sf(doc, "Inter"); doc.setFontSize(10); doc.setTextColor("#0E1A2B");
  doc.text(truncate(d.whatToChangeFirst, 60), ML + 10, y + 56);
  doc.text(truncate(d.whatThatWouldDo, 40), ML + 10 + colW + 16, y + 56);
  y += ctH + 12;

  // Distance card
  if (d.nextBandName) {
    const distH = 52;
    check(y, distH, "P2-dist");
    card(doc, ML, y, CW, distH);
    label(doc, "DISTANCE TO STRONGER STABILITY", ML + 10, y + 12, "#1F6D7A");
    sf(doc, "InterB"); doc.setFontSize(20); doc.setTextColor("#0E1A2B");
    doc.text(String(d.distanceToNext), ML + 10, y + 32);
    const nw = doc.getTextWidth(String(d.distanceToNext));
    sf(doc, "Inter"); doc.setFontSize(10.5); doc.setTextColor("#0E1A2B");
    doc.text(S(` points to ${d.nextBandName} Stability`), ML + 10 + nw, y + 32);
    // Bar
    const bw = CW - 20;
    const fill = Math.min(1, d.score / 100);
    doc.setFillColor(d.bandColor); doc.roundedRect(ML + 10, y + 40, bw * fill, 4, 2, 2, "F");
    doc.setFillColor("#E2E0DB"); doc.roundedRect(ML + 10 + bw * fill, y + 40, bw * (1 - fill), 4, 2, 2, "F");
    y += distH;
  }

  footer(doc, "Score & Diagnosis", 2);
}

/* ================================================================== */
/*  PAGE 3 — PRESSUREMAP + INCOME STRUCTURE                            */
/* ================================================================== */

function page3(doc: jsPDF, d: ReportPDFData) {
  header(doc);
  let y = Y0;

  // PressureMap
  if (d.pressureMap) {
    label(doc, "PRESSUREMAP(TM)", ML, y, "#1F6D7A");
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#535D6B");
    doc.text(S(`${d.pressureMap.operatingStructure} - ${d.pressureMap.incomeModel} - ${d.pressureMap.industry}`), ML + 100, y);
    y += 16;

    // Truncate pressure map text to max 2 sentences each
    const trunc = (t: string) => { const s = t.split(/\.\s+/); return s.slice(0, 2).join(". ") + (s.length > 0 ? "." : ""); };

    label(doc, "WHAT IS MOST LIKELY TO DISRUPT STABILITY", ML, y, "#9B2C2C");
    y += 12;
    y = dt(doc, trunc(d.pressureMap.pressure), ML, y, CW, 9.5, { color: "#0E1A2B" });
    y += 12;

    label(doc, "WHAT IS WORKING IN YOUR FAVOR", ML, y, "#1F6D7A");
    y += 12;
    y = dt(doc, trunc(d.pressureMap.tailwind), ML, y, CW, 9.5, { color: "#0E1A2B" });
    y += 12;

    label(doc, "HIGHEST-LEVERAGE MOVE RIGHT NOW", ML, y, "#4B3FAE");
    y += 12;
    y = dt(doc, trunc(d.pressureMap.leverageMove), ML, y, CW, 9.5, { color: "#0E1A2B" });
    y += 8;

    sf(doc, "Inter"); doc.setFontSize(7.5); doc.setTextColor("#6B6155");
    doc.text("PressureMap reflects structural inputs only and is not financial advice.", ML, y);
    y += 12;

    // Divider
    doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
    doc.line(ML, y, ML + CW, y);
    y += 12;
  }

  // Killer line
  const klH = mh(doc, d.killerLine, CW - 28, 10.5, "InterM") + 16;
  check(y, klH, "P3-killer");
  card(doc, ML, y, CW, klH, "#0E1A2B");
  dt(doc, d.killerLine, ML + 14, y + 10, CW - 28, 10.5, { font: "InterM" });
  y += klH + 12;

  // Income heading
  sf(doc, "InterB"); doc.setFontSize(12.5); doc.setTextColor("#0E1A2B");
  doc.text("HOW YOUR INCOME BREAKS DOWN", ML, y);
  y += 16;

  // Bar
  const bh = 5;
  if (d.activeIncome > 0) { doc.setFillColor("#0E1A2B"); doc.rect(ML, y, CW * d.activeIncome / 100, bh, "F"); }
  if (d.semiPersistentIncome > 0) { doc.setFillColor("#6B6155"); doc.rect(ML + CW * d.activeIncome / 100, y, CW * d.semiPersistentIncome / 100, bh, "F"); }
  if (d.persistentIncome > 0) { doc.setFillColor("#1F6D7A"); doc.rect(ML + CW * (d.activeIncome + d.semiPersistentIncome) / 100, y, CW * d.persistentIncome / 100, bh, "F"); }
  y += bh + 8;

  // Legend
  const leg = [
    { c: "#0E1A2B", t: `${d.activeIncome}% - Active. Stops when work stops.` },
    { c: "#6B6155", t: `${d.semiPersistentIncome}% - Semi-persistent. Continues briefly.` },
    { c: "#1F6D7A", t: `${d.persistentIncome}% - Persistent. Continues without daily work.` },
  ];
  for (const l of leg) {
    doc.setFillColor(l.c); doc.rect(ML, y - 5, 7, 7, "F");
    sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#0E1A2B");
    doc.text(S(l.t), ML + 12, y); y += 12;
  }
  y += 4;

  // Two impact cards side by side — 52pt each
  const cw2 = (CW - 12) / 2;
  check(y, 52, "P3-impact");

  card(doc, ML, y, cw2, 52);
  label(doc, "IF BIGGEST SOURCE GOES AWAY", ML + 8, y + 12);
  sf(doc, "InterB"); doc.setFontSize(16); doc.setTextColor("#0E1A2B");
  doc.text(`${d.score} to ${d.riskScenarioScore}`, ML + 8, y + 30);
  sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#535D6B");
  doc.text(S(`-${d.riskScenarioDrop} points`), ML + 8, y + 42);

  const rx = ML + cw2 + 12;
  card(doc, rx, y, cw2, 52);
  label(doc, "IF YOU STOP WORKING ENTIRELY", rx + 8, y + 12);
  sf(doc, "InterB"); doc.setFontSize(16); doc.setTextColor("#0E1A2B");
  doc.text(S(d.continuityDisplay), rx + 8, y + 30);
  sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#535D6B");
  doc.text(truncate(d.continuityText, 50), rx + 8, y + 42);
  y += 52 + 12;

  // Divider
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y); y += 8;

  // Factor cards — max 2, 40pt each
  const factors = d.rankedFactors.slice(0, 2);
  for (const f of factors) {
    check(y, 40, "P3-factor");
    card(doc, ML, y, CW, 40, f.roleColor);
    sf(doc, "Inter"); doc.setFontSize(7.5); doc.setTextColor("#6B6155");
    doc.text(S(f.role), ML + 10, y + 10);
    sf(doc, "InterSB"); doc.setFontSize(10); doc.setTextColor("#0E1A2B");
    doc.text(S(f.label), ML + 10, y + 22);
    sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor(f.levelColor);
    doc.text(S(f.level), ML + CW - 10, y + 22, { align: "right" });
    // Bar
    doc.setFillColor(f.roleColor); doc.roundedRect(ML + 10, y + 28, (CW - 20) * f.normalizedValue, 3, 1, 1, "F");
    doc.setFillColor("#E2E0DB"); doc.roundedRect(ML + 10 + (CW - 20) * f.normalizedValue, y + 28, (CW - 20) * (1 - f.normalizedValue), 3, 1, 1, "F");
    y += 40 + 8;
  }

  // Working / Holding back — two columns — always render both cards
  if (y + 40 <= YL) {
    const colW2 = (CW - 12) / 2;

    // Left card: What's Working — always rendered
    card(doc, ML, y, colW2, 40);
    label(doc, "WHAT'S WORKING", ML + 8, y + 10, "#1F6D7A");
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#0E1A2B");
    if (d.strongestSupports.length > 0) {
      doc.text(truncate(d.strongestSupports[0] || "", 65), ML + 8, y + 24);
      if (d.strongestSupports[1]) doc.text(truncate(d.strongestSupports[1], 65), ML + 8, y + 34);
    } else {
      doc.text("No data", ML + 8, y + 24);
    }

    // Right card: What's Holding You Back — always rendered
    card(doc, ML + colW2 + 12, y, colW2, 40);
    label(doc, "WHAT'S HOLDING YOU BACK", ML + colW2 + 20, y + 10, "#9B2C2C");
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#0E1A2B");
    if (d.strongestSuppressors.length > 0) {
      doc.text(truncate(d.strongestSuppressors[0] || "", 65), ML + colW2 + 20, y + 24);
      if (d.strongestSuppressors[1]) doc.text(truncate(d.strongestSuppressors[1], 65), ML + colW2 + 20, y + 34);
    } else {
      doc.text("No data", ML + colW2 + 20, y + 24);
    }
  }

  footer(doc, "Income Structure", 3);
}

/* ================================================================== */
/*  PAGE 4 — FRAGILITY + ACTION PLAN                                   */
/*  Budget: 628pt. Every pt accounted for.                             */
/* ================================================================== */

function page4(doc: jsPDF, d: ReportPDFData) {
  header(doc);
  let y = Y0;

  // Fragility intro — 34pt
  sf(doc, "InterB"); doc.setFontSize(12.5); doc.setTextColor("#0E1A2B");
  doc.text("FRAGILITY & PRESSURE TEST", ML, y);
  y += 12;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
  doc.text(truncate(d.fragilityDiagnostic, 100), ML, y);
  y += 14;
  // If diagnostic is longer, add second line
  if (d.fragilityDiagnostic.length > 100) {
    const remaining = S(d.fragilityDiagnostic).substring(100);
    doc.text(truncate(remaining, 100), ML, y);
    y += 12;
  }

  // 3 disruption rows — ~120pt total (40pt each)
  label(doc, "RANKED BY DAMAGE", ML, y);
  y += 12;
  const scenarios = d.scenarios.slice(0, 3);
  const sBorders = ["#9B2C2C", "#92640A", "#E2E0DB"];
  for (let i = 0; i < scenarios.length; i++) {
    const sc = scenarios[i];
    check(y, 36, `P4-sc${i}`);
    card(doc, ML, y, CW, 36, sBorders[i]);
    sf(doc, "InterSB"); doc.setFontSize(9.5); doc.setTextColor("#0E1A2B");
    doc.text(truncate(cleanTitle(sc.title), 55), ML + 10, y + 14);
    sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
    doc.text(`${sc.originalScore} to ${sc.scenarioScore} (-${sc.scoreDrop})`, ML + CW - 10, y + 14, { align: "right" });
    if (sc.bandShift) {
      sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#9B2C2C");
      doc.text(S(`Drops to ${sc.scenarioBand}`), ML + CW - 10, y + 26, { align: "right" });
    }
    y += 36 + 6;
  }

  // Absorbency — 52pt — use truncate instead of substring
  check(y, 52, "P4-absorb");
  card(doc, ML, y, CW, 52);
  label(doc, "HOW MUCH CAN YOUR INCOME ABSORB?", ML + 10, y + 12);
  sf(doc, "InterSB"); doc.setFontSize(10); doc.setTextColor(d.fragilityColor);
  doc.text(truncate(d.fragilityLabel, 60), ML + 10, y + 26);
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
  doc.text(truncate(d.fragilityText, 80), ML + 10, y + 38);
  if (d.failureMode) doc.text(truncate(`Failure mode: ${d.failureMode}`, 70), ML + 10, y + 48);
  y += 52 + 8;

  // Divider
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y); y += 8;

  // Action plan header — 20pt
  label(doc, "ACTION PLAN", ML, y, "#1F6D7A");
  y += 12;

  // Action cards — max 2, ~36pt each = 72pt + gaps
  const actions = d.actionCategories.slice(0, 2);
  for (const a of actions) {
    check(y, 36, "P4-action");
    card(doc, ML, y, CW, 36);
    sf(doc, "InterB"); doc.setFontSize(7.5); doc.setTextColor(a.tagColor);
    doc.text(S(a.tag), ML + 10, y + 10);
    sf(doc, "InterSB"); doc.setFontSize(9.5); doc.setTextColor("#0E1A2B");
    doc.text(truncate(a.title, 60), ML + 10, y + 22);
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#1F6D7A");
    doc.text(S(a.scoreChange), ML + CW - 10, y + 22, { align: "right" });
    y += 36 + 6;
  }

  // Combined lift — single line
  if (d.combinedLift) {
    sf(doc, "InterSB"); doc.setFontSize(9); doc.setTextColor("#0E1A2B");
    const cText = `Combined effect: ${d.combinedLift.projectedScore} (+${d.combinedLift.lift} points)${d.combinedLift.bandShift ? ` - moves to ${d.combinedLift.bandShift}` : ""}`;
    doc.text(S(cText), ML, y);
    y += 12;
  }

  // Tradeoff — 70pt max — use truncate instead of substring
  if (d.tradeoff && y + 70 <= YL) {
    check(y, 70, "P4-trade");
    card(doc, ML, y, CW, 70);
    sf(doc, "InterSB"); doc.setFontSize(9); doc.setTextColor("#0E1A2B");
    doc.text(truncate(d.tradeoff.actionLabel, 50), ML + 10, y + 12);

    const tc = (CW - 36) / 2;
    label(doc, "UPSIDE", ML + 10, y + 24, "#1F6D7A");
    label(doc, "COST", ML + 10 + tc + 16, y + 24, "#92640A");
    sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#535D6B");
    doc.text(truncate(d.tradeoff.upside, 70), ML + 10, y + 36);
    doc.text(truncate(d.tradeoff.downside, 70), ML + 10 + tc + 16, y + 36);
    doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
    doc.line(ML + 10, y + 50, ML + CW - 10, y + 50);
    sf(doc, "InterSB"); doc.setFontSize(8.5); doc.setTextColor("#0E1A2B");
    doc.text(truncate(d.tradeoff.recommendation, 80), ML + 10, y + 60);
    y += 70 + 8;
  }

  // Roadmap — 4 rows, ~24pt each = 96pt — use truncate instead of substring
  if (d.roadmap.length > 0 && y + 96 <= YL) {
    label(doc, "WEEK-BY-WEEK ROADMAP", ML, y, "#4B3FAE");
    y += 12;
    for (const row of d.roadmap.slice(0, 4)) {
      sf(doc, "InterB"); doc.setFontSize(7.5); doc.setTextColor("#4B3FAE");
      doc.text(truncate(row.week, 12), ML, y);
      sf(doc, "InterSB"); doc.setFontSize(9); doc.setTextColor("#0E1A2B");
      doc.text(truncate(row.action, 50), ML + 60, y);
      sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#535D6B");
      doc.text(truncate(row.detail, 75), ML + 60, y + 10);
      y += 22;
    }
    y += 4;
  }

  // Retake — date and days on SEPARATE lines
  if (y + 36 <= YL) {
    label(doc, "WHEN TO RETAKE", ML, y);
    y += 12;
    sf(doc, "InterSB"); doc.setFontSize(9.5); doc.setTextColor("#0E1A2B");
    doc.text(S(d.reassessDate), ML, y);
    y += 12;
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#535D6B");
    doc.text(S(`${d.reassessDaysLeft} days from now - ${d.reassessTiming}`), ML, y);
    y += 16;
  }

  // Fine print — max 3 lines
  if (y + 24 <= YL) {
    const fp = "This report was generated by RunPayway(TM) Model RP-2.0. It reflects structural inputs only and does not constitute financial, legal, or investment advice. Scores are deterministic.";
    dt(doc, fp, ML, y, CW, 7.5, { color: "#6B6155", lh: 1.3 });
  }

  footer(doc, "Action Plan", 4);
}

/* ================================================================== */
/*  MAIN EXPORT                                                        */
/* ================================================================== */

export async function generateReportPDF(data: ReportPDFData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });

  await loadFonts(doc);

  page1(doc, data);
  doc.addPage(); page2(doc, data);
  doc.addPage(); page3(doc, data);
  doc.addPage(); page4(doc, data);

  // HARD VERIFICATION
  const n = doc.getNumberOfPages();
  if (n !== 4) throw new Error(`FATAL: PDF has ${n} pages, expected exactly 4`);

  return doc.output("blob");
}
