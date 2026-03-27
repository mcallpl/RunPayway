/* ------------------------------------------------------------------ */
/*  report-pdf.tsx — Vector PDF generation via @react-pdf/renderer    */
/*  RunPayway™ Income Stability Report (Cover + 4 content pages)      */
/* ------------------------------------------------------------------ */

import React from "react";

/* ------------------------------------------------------------------ */
/*  DATA INTERFACE                                                     */
/* ------------------------------------------------------------------ */

export interface ReportPDFData {
  // Cover
  assessmentTitle: string;
  issuedDate: string;
  formalDate: string;
  finalScore: number;
  stabilityBand: string;
  bandColor: string;
  tier: string;
  coverBandDesc: string;
  accessCode: string;

  // Page 1 — Score & Diagnosis
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

  // Page 2 — Income Structure
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
    role: string;
    label: string;
    level: string;
    normalizedValue: number;
    explanation: string;
    roleColor: string;
    levelColor: string;
  }>;
  strongestSupports: string[];
  strongestSuppressors: string[];

  // Page 3 — Fragility & Pressure Test
  fragilityDiagnostic: string;
  scenarios: Array<{
    title: string;
    originalScore: number;
    scenarioScore: number;
    scoreDrop: number;
    narrative?: string;
    bandShift?: boolean;
    originalBand?: string;
    scenarioBand?: string;
  }>;
  fragilityLabel: string;
  fragilityText: string;
  fragilityColor: string;
  failureMode?: string;
  patternToWatch?: { pattern: string; consequence: string; reframe?: string };

  // Page 4 — Action Plan
  actionCategories: Array<{
    tag: string;
    tagColor: string;
    title: string;
    how: string;
    scoreChange: string;
  }>;
  combinedLift?: {
    projectedScore: number;
    lift: number;
    bandShift?: string;
    explanation?: string;
  };
  tradeoff?: {
    actionLabel: string;
    upside: string;
    downside: string;
    recommendation: string;
  };
  avoidActions: string[];
  roadmap: Array<{
    week: string;
    action: string;
    detail: string;
    target?: string;
  }>;
  reassessDate: string;
  reassessDaysLeft: number;
  reassessTiming: string;
  triggers: string[];
}

/* ------------------------------------------------------------------ */
/*  COLORS                                                             */
/* ------------------------------------------------------------------ */

const C = {
  navy: "#0E1A2B",
  teal: "#1F6D7A",
  purple: "#4B3FAE",
  taupe: "#6B6155",
  muted: "#535D6B",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
  bone: "#F8F6F1",
  stone: "#E2E0DB",
} as const;

/* ------------------------------------------------------------------ */
/*  GENERATE PDF                                                       */
/* ------------------------------------------------------------------ */

export async function generateReportPDF(data: ReportPDFData): Promise<Blob> {
  const { Document, Page, View, Text, StyleSheet, pdf } = await import(
    "@react-pdf/renderer"
  );

  /* ---------------------------------------------------------------- */
  /*  STYLES                                                           */
  /* ---------------------------------------------------------------- */

  const s = StyleSheet.create({
    /* Page-level */
    page: {
      fontFamily: "Helvetica",
      fontSize: 10,
      color: C.navy,
      paddingLeft: 48,
      paddingRight: 48,
      paddingTop: 0,
      paddingBottom: 0,
      position: "relative" as const,
    },

    /* Header */
    headerRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingTop: 32,
    },
    headerLeft: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: C.navy,
      letterSpacing: 1.5,
    },
    headerRight: {
      fontSize: 9,
      fontFamily: "Helvetica",
      color: C.taupe,
    },
    headerLine: {
      height: 0.5,
      backgroundColor: C.stone,
      marginTop: 8,
    },

    /* Footer */
    footerWrap: {
      position: "absolute" as const,
      bottom: 36,
      left: 48,
      right: 48,
    },
    footerLine: {
      height: 0.5,
      backgroundColor: C.stone,
      marginBottom: 8,
    },
    footerRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
    },
    footerText: {
      fontSize: 9,
      fontFamily: "Helvetica",
      color: C.taupe,
    },

    /* Content area */
    content: {
      paddingTop: 72,
    },

    /* Utility */
    centered: { alignItems: "center" as const },
    row: { flexDirection: "row" as const },
    card: {
      backgroundColor: C.bone,
      padding: 14,
      borderRadius: 3,
    },
    overline: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1.5,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Helvetica-Bold",
      color: C.navy,
    },
    bodyText: {
      fontSize: 11.5,
      fontFamily: "Helvetica",
      color: C.navy,
      lineHeight: 1.6,
    },
    smallText: {
      fontSize: 9.5,
      fontFamily: "Helvetica",
      color: C.taupe,
    },
    mutedText: {
      fontSize: 9.5,
      fontFamily: "Helvetica",
      color: C.muted,
    },
    divider: {
      height: 0.5,
      backgroundColor: C.stone,
      marginTop: 16,
      marginBottom: 16,
    },
  });

  /* ---------------------------------------------------------------- */
  /*  SHARED COMPONENTS                                                */
  /* ---------------------------------------------------------------- */

  const Header = ({ section }: { section: string }) => (
    <View fixed>
      <View style={s.headerRow}>
        <Text style={s.headerLeft}>RUNPAYWAY™</Text>
        <Text style={s.headerRight}>
          Income Stability Score™ · Model RP-2.0
        </Text>
      </View>
      <View style={s.headerLine} />
    </View>
  );

  const Footer = ({
    section,
    pageNum,
  }: {
    section: string;
    pageNum: number;
  }) => (
    <View style={s.footerWrap} fixed>
      <View style={s.footerLine} />
      <View style={s.footerRow}>
        <Text style={s.footerText}>Confidential — {section}</Text>
        <Text style={s.footerText}>Page {pageNum} of 4</Text>
        <Text style={s.footerText}>support@runpayway.com</Text>
      </View>
    </View>
  );

  const ProgressBar = ({
    value,
    fillColor,
    height = 6,
  }: {
    value: number;
    fillColor: string;
    height?: number;
  }) => (
    <View
      style={{
        height,
        backgroundColor: C.stone,
        borderRadius: 3,
        flexDirection: "row" as const,
      }}
    >
      <View
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          backgroundColor: fillColor,
          borderRadius: 3,
        }}
      />
    </View>
  );

  const Dot = ({ color, size = 6 }: { color: string; size?: number }) => (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        marginRight: 8,
      }}
    />
  );

  /* ---------------------------------------------------------------- */
  /*  COVER PAGE (Page 0)                                              */
  /* ---------------------------------------------------------------- */

  const CoverPage = () => (
    <Page size="LETTER" style={s.page}>
      <View style={{ alignItems: "center" as const, paddingTop: 160 }}>
        {/* Logo */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Helvetica-Bold",
            color: C.navy,
            letterSpacing: 2,
          }}
        >
          RUNPAYWAY™
        </Text>

        {/* Separator */}
        <View
          style={{
            width: 200,
            height: 0.5,
            backgroundColor: C.stone,
            marginTop: 20,
          }}
        />

        {/* Title */}
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Helvetica-Bold",
            color: C.navy,
            marginTop: 40,
          }}
        >
          Income Stability Report
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Helvetica",
            color: C.muted,
            marginTop: 8,
          }}
        >
          A structural assessment of income resilience
        </Text>

        {/* Assessment title */}
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Helvetica-Bold",
            color: C.navy,
            marginTop: 32,
          }}
        >
          {data.assessmentTitle}
        </Text>

        {/* Date */}
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Helvetica",
            color: C.muted,
            marginTop: 16,
          }}
        >
          {data.formalDate}
        </Text>

        {/* Score */}
        <View
          style={{
            flexDirection: "row" as const,
            alignItems: "flex-end" as const,
            marginTop: 32,
          }}
        >
          <Text
            style={{
              fontSize: 56,
              fontFamily: "Helvetica-Bold",
              color: C.navy,
            }}
          >
            {data.finalScore}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Helvetica",
              color: C.taupe,
              marginBottom: 8,
              marginLeft: 4,
            }}
          >
            /100
          </Text>
        </View>

        {/* Band */}
        <View
          style={{
            flexDirection: "row" as const,
            alignItems: "center" as const,
            marginTop: 16,
          }}
        >
          <Dot color={data.bandColor} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Helvetica-Bold",
              color: data.bandColor,
            }}
          >
            {data.stabilityBand}
          </Text>
        </View>

        {/* Band description */}
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Helvetica",
            color: C.muted,
            maxWidth: 300,
            textAlign: "center" as const,
            marginTop: 12,
            lineHeight: 1.5,
          }}
        >
          {data.coverBandDesc}
        </Text>

        {/* Built from line */}
        <Text
          style={{
            fontSize: 9.5,
            fontFamily: "Helvetica",
            color: C.taupe,
            marginTop: 32,
          }}
        >
          Built from fixed structural questions under Model RP-2.0.
        </Text>

        {/* Simulator access section */}
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Helvetica-Bold",
            color: C.navy,
            letterSpacing: 1,
            marginTop: 24,
          }}
        >
          STABILITY SIMULATOR™ ACCESS
        </Text>

        <Text
          style={{
            fontSize: 9.5,
            fontFamily: "Helvetica",
            color: C.muted,
            marginTop: 12,
          }}
        >
          Enter this code at runpayway.com/simulator
        </Text>

        {/* Access code box */}
        <View
          style={{
            backgroundColor: C.bone,
            borderWidth: 0.5,
            borderColor: C.stone,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 3,
            marginTop: 16,
            maxWidth: 400,
          }}
        >
          <Text
            style={{
              fontSize: 8.5,
              fontFamily: "Helvetica",
              color: C.taupe,
              marginBottom: 4,
            }}
          >
            Access Code
          </Text>
          <Text
            style={{
              fontSize: 7.5,
              fontFamily: "Courier",
              color: C.navy,
            }}
          >
            {data.accessCode}
          </Text>
        </View>

        {/* Model note */}
        <Text
          style={{
            fontSize: 9.5,
            fontFamily: "Helvetica",
            color: C.taupe,
            marginTop: 32,
          }}
        >
          Model RP-2.0 · 4 Pages
        </Text>
      </View>

      {/* Footer */}
      <View style={s.footerWrap}>
        <View style={s.footerLine} />
        <View style={s.footerRow}>
          <Text style={s.footerText}>Confidential — Cover</Text>
          <Text style={s.footerText}> </Text>
          <Text style={s.footerText}>support@runpayway.com</Text>
        </View>
      </View>
    </Page>
  );

  /* ---------------------------------------------------------------- */
  /*  PAGE 1 — Score & Structural Diagnosis                            */
  /* ---------------------------------------------------------------- */

  const Page1 = () => (
    <Page size="LETTER" style={s.page}>
      <Header section="Score & Diagnosis" />
      <View style={{ paddingTop: 24 }}>
        {/* Overline */}
        <Text
          style={{
            ...s.overline,
            color: C.teal,
            textAlign: "center" as const,
          }}
        >
          INCOME STABILITY ASSESSMENT
        </Text>

        {/* Title */}
        <Text
          style={{
            fontSize: 22,
            fontFamily: "Helvetica-Bold",
            color: C.navy,
            textAlign: "center" as const,
            marginTop: 16,
          }}
        >
          {data.assessmentTitle}
        </Text>

        {/* Date + model */}
        <Text
          style={{
            ...s.smallText,
            textAlign: "center" as const,
            marginTop: 12,
          }}
        >
          {data.formalDate} · Model RP-2.0
        </Text>

        {/* Score */}
        <View
          style={{
            alignItems: "center" as const,
            marginTop: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row" as const,
              alignItems: "flex-end" as const,
            }}
          >
            <Text
              style={{
                fontSize: 56,
                fontFamily: "Helvetica-Bold",
                color: C.navy,
              }}
            >
              {data.score}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Helvetica",
                color: C.taupe,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              /100
            </Text>
          </View>

          {/* Band */}
          <View
            style={{
              flexDirection: "row" as const,
              alignItems: "center" as const,
              marginTop: 8,
            }}
          >
            <Dot color={data.bandColor} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Helvetica-Bold",
                color: data.bandColor,
              }}
            >
              {data.stabilityBand}
            </Text>
          </View>

          {/* Distance to next */}
          {data.nextBandName && (
            <Text
              style={{
                ...s.mutedText,
                marginTop: 8,
              }}
            >
              {data.distanceToNext} points from {data.nextBandName}
            </Text>
          )}
        </View>

        {/* Diagnostic card */}
        <View
          style={{
            backgroundColor: C.bone,
            borderLeftWidth: 2,
            borderLeftColor: C.navy,
            padding: 16,
            borderRadius: 3,
            marginTop: 24,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Helvetica-Bold",
              color: C.navy,
              lineHeight: 1.7,
            }}
          >
            {data.diagnosticSentence}
          </Text>
        </View>

        {/* Plain English card */}
        <View
          style={{
            ...s.card,
            marginTop: 16,
          }}
        >
          <Text style={{ ...s.overline, color: C.taupe, marginBottom: 8 }}>
            IN PLAIN ENGLISH
          </Text>
          <Text style={s.bodyText}>{data.plainEnglish}</Text>
          {data.whyNotHigher ? (
            <Text
              style={{
                ...s.bodyText,
                marginTop: 8,
                fontFamily: "Helvetica-Bold",
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Why not higher:{" "}
              </Text>
              <Text>{data.whyNotHigher}</Text>
            </Text>
          ) : null}
        </View>

        {/* Biggest Constraint card */}
        <View
          style={{
            ...s.card,
            borderLeftWidth: 3,
            borderLeftColor: C.purple,
            marginTop: 12,
          }}
        >
          <Text style={{ ...s.overline, color: C.purple, marginBottom: 8 }}>
            BIGGEST CONSTRAINT
          </Text>
          <Text style={s.bodyText}>{data.dominantConstraintText}</Text>
          <View
            style={{
              flexDirection: "row" as const,
              marginTop: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: C.taupe,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                WHAT TO CHANGE FIRST
              </Text>
              <Text style={{ fontSize: 10, color: C.navy, lineHeight: 1.5 }}>
                {data.whatToChangeFirst}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: C.taupe,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                WHAT THAT WOULD DO
              </Text>
              <Text style={{ fontSize: 10, color: C.navy, lineHeight: 1.5 }}>
                {data.whatThatWouldDo}
              </Text>
            </View>
          </View>
        </View>

        {/* How far from stronger stability */}
        {data.nextBandName && (
          <View
            style={{
              ...s.card,
              marginTop: 12,
            }}
          >
            <Text style={{ ...s.overline, color: C.teal, marginBottom: 8 }}>
              HOW FAR FROM STRONGER STABILITY
            </Text>
            <View
              style={{
                flexDirection: "row" as const,
                alignItems: "flex-end" as const,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: "Helvetica-Bold",
                  color: C.navy,
                }}
              >
                {data.distanceToNext}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Helvetica",
                  color: C.muted,
                  marginBottom: 4,
                  marginLeft: 8,
                }}
              >
                points to {data.nextBandName}
              </Text>
            </View>
            <ProgressBar value={data.score} fillColor={data.bandColor} />
            <Text style={{ ...s.mutedText, marginTop: 8 }}>
              {data.bandDistanceText}
            </Text>
          </View>
        )}

        {/* PressureMap */}
        {data.pressureMap && (
          <View
            style={{
              ...s.card,
              borderLeftWidth: 3,
              borderLeftColor: C.purple,
              marginTop: 16,
            }}
          >
            <Text style={{ ...s.overline, color: C.teal, marginBottom: 4 }}>
              PRESSUREMAP™
            </Text>
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Oblique",
                color: C.muted,
                marginBottom: 12,
              }}
            >
              {data.pressureMap.operatingStructure} ·{" "}
              {data.pressureMap.incomeModel} · {data.pressureMap.industry}
            </Text>

            {/* Pressure */}
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: C.bandLimited,
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              WHAT IS MOST LIKELY TO DISRUPT YOUR STABILITY
            </Text>
            <Text
              style={{ fontSize: 10, color: C.navy, lineHeight: 1.5, marginBottom: 12 }}
            >
              {data.pressureMap.pressure}
            </Text>

            {/* Tailwind */}
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: C.teal,
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              WHAT IS WORKING IN YOUR FAVOR
            </Text>
            <Text
              style={{ fontSize: 10, color: C.navy, lineHeight: 1.5, marginBottom: 12 }}
            >
              {data.pressureMap.tailwind}
            </Text>

            {/* Leverage */}
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: C.purple,
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              HIGHEST-LEVERAGE MOVE RIGHT NOW
            </Text>
            <Text style={{ fontSize: 10, color: C.navy, lineHeight: 1.5 }}>
              {data.pressureMap.leverageMove}
            </Text>

            {/* Disclaimer */}
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Oblique",
                color: C.taupe,
                marginTop: 12,
              }}
            >
              PressureMap reflects structural inputs only and is not
              financial advice.
            </Text>
          </View>
        )}
      </View>

      <Footer section="Score & Diagnosis" pageNum={1} />
    </Page>
  );

  /* ---------------------------------------------------------------- */
  /*  PAGE 2 — How Your Income Actually Works                          */
  /* ---------------------------------------------------------------- */

  const Page2 = () => {
    const totalIncome =
      data.activeIncome + data.semiPersistentIncome + data.persistentIncome;
    const activePct =
      totalIncome > 0 ? Math.round((data.activeIncome / totalIncome) * 100) : 0;
    const semiPct =
      totalIncome > 0
        ? Math.round((data.semiPersistentIncome / totalIncome) * 100)
        : 0;
    const persistPct =
      totalIncome > 0
        ? Math.round((data.persistentIncome / totalIncome) * 100)
        : 0;

    return (
      <Page size="LETTER" style={s.page}>
        <Header section="Income Structure" />
        <View style={{ paddingTop: 24 }}>
          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Helvetica-Bold",
              color: C.navy,
            }}
          >
            How Your Income Actually Works
          </Text>
          <Text style={{ ...s.mutedText, marginTop: 8 }}>
            A breakdown of income persistence, structural risk, and continuity
          </Text>

          {/* Killer line */}
          <View
            style={{
              backgroundColor: C.bone,
              borderLeftWidth: 2,
              borderLeftColor: C.navy,
              padding: 14,
              borderRadius: 3,
              marginTop: 16,
              alignItems: "center" as const,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Helvetica-Bold",
                color: C.navy,
                textAlign: "center" as const,
                lineHeight: 1.6,
              }}
            >
              {data.killerLine}
            </Text>
          </View>

          {/* Income Breakdown */}
          <Text style={{ ...s.sectionTitle, marginTop: 16 }}>
            How Your Income Breaks Down
          </Text>

          {/* Income bar */}
          <View
            style={{
              flexDirection: "row" as const,
              height: 6,
              borderRadius: 3,
              overflow: "hidden" as const,
              marginTop: 12,
            }}
          >
            {activePct > 0 && (
              <View
                style={{
                  width: `${activePct}%`,
                  backgroundColor: C.bandLimited,
                }}
              />
            )}
            {semiPct > 0 && (
              <View
                style={{
                  width: `${semiPct}%`,
                  backgroundColor: C.bandDeveloping,
                }}
              />
            )}
            {persistPct > 0 && (
              <View
                style={{
                  width: `${persistPct}%`,
                  backgroundColor: C.teal,
                }}
              />
            )}
          </View>

          {/* Legend */}
          <View style={{ marginTop: 12 }}>
            <View
              style={{
                flexDirection: "row" as const,
                alignItems: "center" as const,
                marginBottom: 4,
              }}
            >
              <Dot color={C.bandLimited} size={5} />
              <Text style={{ fontSize: 9.5, color: C.navy }}>
                {activePct}% — Active Income (stops when you stop)
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row" as const,
                alignItems: "center" as const,
                marginBottom: 4,
              }}
            >
              <Dot color={C.bandDeveloping} size={5} />
              <Text style={{ fontSize: 9.5, color: C.navy }}>
                {semiPct}% — Semi-Persistent (continues short-term)
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row" as const,
                alignItems: "center" as const,
              }}
            >
              <Dot color={C.teal} size={5} />
              <Text style={{ fontSize: 9.5, color: C.navy }}>
                {persistPct}% — Persistent (continues regardless)
              </Text>
            </View>
          </View>

          {/* Two risk cards side by side */}
          <View
            style={{
              flexDirection: "row" as const,
              marginTop: 16,
            }}
          >
            {/* Biggest source gone */}
            <View
              style={{
                flex: 1,
                backgroundColor: C.bone,
                padding: 12,
                borderRadius: 3,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: C.taupe,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                IF YOUR BIGGEST SOURCE GOES AWAY
              </Text>
              <View
                style={{
                  flexDirection: "row" as const,
                  alignItems: "flex-end" as const,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: "Helvetica-Bold",
                    color: C.navy,
                  }}
                >
                  {data.score}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: C.muted,
                    marginLeft: 4,
                    marginBottom: 2,
                  }}
                >
                  →
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: "Helvetica-Bold",
                    color: C.bandLimited,
                    marginLeft: 4,
                  }}
                >
                  {data.riskScenarioScore}
                </Text>
              </View>
              <Text style={{ fontSize: 9.5, color: C.muted, marginTop: 4 }}>
                {data.riskSeverityText}
              </Text>
            </View>

            {/* Stop working entirely */}
            <View
              style={{
                flex: 1,
                backgroundColor: C.bone,
                padding: 12,
                borderRadius: 3,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: C.taupe,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                IF YOU STOP WORKING ENTIRELY
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Helvetica-Bold",
                  color: C.navy,
                }}
              >
                {data.continuityDisplay}
              </Text>
              <Text style={{ fontSize: 9.5, color: C.muted, marginTop: 4 }}>
                {data.continuityText}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={s.divider} />

          {/* What The Structure Reveals */}
          <Text style={{ ...s.sectionTitle, marginBottom: 12 }}>
            What The Structure Reveals
          </Text>

          {data.rankedFactors.map((factor, i) => (
            <View
              key={i}
              style={{
                backgroundColor: C.bone,
                borderLeftWidth: 3,
                borderLeftColor: factor.roleColor,
                padding: 12,
                borderRadius: 3,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: factor.roleColor,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {factor.role.toUpperCase()}
              </Text>
              <View
                style={{
                  flexDirection: "row" as const,
                  justifyContent: "space-between" as const,
                  alignItems: "center" as const,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Helvetica-Bold",
                    color: C.navy,
                  }}
                >
                  {factor.label}
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: "Helvetica-Bold",
                    color: factor.levelColor,
                  }}
                >
                  {factor.level}
                </Text>
              </View>
              <ProgressBar
                value={factor.normalizedValue * 100}
                fillColor={factor.roleColor}
                height={4}
              />
              <Text
                style={{
                  fontSize: 9.5,
                  color: C.muted,
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {factor.explanation}
              </Text>
            </View>
          ))}

          {/* Working / Holding back */}
          <View
            style={{
              flexDirection: "row" as const,
              marginTop: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: C.teal,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                WHAT&apos;S WORKING
              </Text>
              {data.strongestSupports.map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row" as const,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 9.5, color: C.teal, marginRight: 4 }}>
                    +
                  </Text>
                  <Text style={{ fontSize: 9.5, color: C.navy, flex: 1 }}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: C.bandLimited,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                WHAT&apos;S HOLDING YOU BACK
              </Text>
              {data.strongestSuppressors.map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row" as const,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9.5,
                      color: C.bandLimited,
                      marginRight: 4,
                    }}
                  >
                    −
                  </Text>
                  <Text style={{ fontSize: 9.5, color: C.navy, flex: 1 }}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Footer section="Income Structure" pageNum={2} />
      </Page>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  PAGE 3 — Fragility & Pressure Test                               */
  /* ---------------------------------------------------------------- */

  const Page3 = () => (
    <Page size="LETTER" style={s.page}>
      <Header section="Fragility & Pressure Test" />
      <View style={{ paddingTop: 24 }}>
        {/* Title */}
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Helvetica-Bold",
            color: C.navy,
          }}
        >
          Fragility & Pressure Test
        </Text>
        <Text style={{ ...s.mutedText, marginTop: 8 }}>
          How your score responds to realistic disruptions
        </Text>

        {/* Diagnostic card */}
        <View
          style={{
            backgroundColor: C.bone,
            borderLeftWidth: 2,
            borderLeftColor: C.navy,
            padding: 14,
            borderRadius: 3,
            marginTop: 16,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Helvetica-Bold",
              color: C.navy,
              lineHeight: 1.6,
            }}
          >
            {data.fragilityDiagnostic}
          </Text>
        </View>

        {/* Scenarios */}
        <Text
          style={{
            ...s.sectionTitle,
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          Ranked By Damage
        </Text>

        {data.scenarios.map((scenario, i) => {
          const accentColors = [
            C.bandLimited,
            C.bandDeveloping,
            C.bandEstablished,
            C.muted,
            C.stone,
          ];
          const accent = accentColors[Math.min(i, accentColors.length - 1)];

          return (
            <View
              key={i}
              style={{
                backgroundColor: C.bone,
                borderLeftWidth: 3,
                borderLeftColor: accent,
                padding: 12,
                borderRadius: 3,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row" as const,
                  justifyContent: "space-between" as const,
                  alignItems: "center" as const,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Helvetica-Bold",
                    color: C.navy,
                    flex: 1,
                  }}
                >
                  {scenario.title}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Helvetica-Bold",
                    color: C.bandLimited,
                  }}
                >
                  {scenario.originalScore} → {scenario.scenarioScore} (−
                  {scenario.scoreDrop})
                </Text>
              </View>
              {scenario.narrative ? (
                <Text
                  style={{
                    fontSize: 9.5,
                    color: C.muted,
                    marginTop: 4,
                    lineHeight: 1.5,
                  }}
                >
                  {scenario.narrative}
                </Text>
              ) : null}
              {scenario.bandShift ? (
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: "Helvetica-Bold",
                    color: C.bandLimited,
                    marginTop: 4,
                  }}
                >
                  ⚠ Band shift: {scenario.originalBand} → {scenario.scenarioBand}
                </Text>
              ) : null}
            </View>
          );
        })}

        {/* Divider */}
        <View style={s.divider} />

        {/* How much can your income absorb */}
        <View
          style={{
            ...s.card,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
              color: C.taupe,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            HOW MUCH CAN YOUR INCOME ABSORB?
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Helvetica-Bold",
              color: data.fragilityColor,
              marginBottom: 8,
            }}
          >
            {data.fragilityLabel}
          </Text>
          <Text style={{ ...s.bodyText, marginBottom: 8 }}>
            {data.fragilityText}
          </Text>
          {data.failureMode ? (
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Helvetica-Oblique",
                color: C.muted,
              }}
            >
              Failure mode: {data.failureMode}
            </Text>
          ) : null}
        </View>

        {/* Pattern to Watch */}
        {data.patternToWatch && (
          <View
            style={{
              ...s.card,
              borderLeftWidth: 3,
              borderLeftColor: C.bandDeveloping,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: C.bandDeveloping,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              PATTERN TO WATCH
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                color: C.navy,
                marginBottom: 4,
              }}
            >
              {data.patternToWatch.pattern}
            </Text>
            <Text style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>
              {data.patternToWatch.consequence}
            </Text>
            {data.patternToWatch.reframe ? (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Oblique",
                  color: C.teal,
                  marginTop: 8,
                }}
              >
                Reframe: {data.patternToWatch.reframe}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      <Footer section="Fragility & Pressure Test" pageNum={3} />
    </Page>
  );

  /* ---------------------------------------------------------------- */
  /*  PAGE 4 — Action Plan                                             */
  /* ---------------------------------------------------------------- */

  const Page4 = () => (
    <Page size="LETTER" style={s.page}>
      <Header section="Action Plan" />
      <View style={{ paddingTop: 24 }}>
        {/* Title */}
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Helvetica-Bold",
            color: C.navy,
          }}
        >
          Action Plan
        </Text>
        <Text style={{ ...s.mutedText, marginTop: 8 }}>
          Prioritized changes ranked by impact on your stability score
        </Text>

        {/* Section: How To Decide What To Change */}
        <Text
          style={{
            ...s.sectionTitle,
            fontSize: 14,
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          How To Decide What To Change
        </Text>

        {data.actionCategories.map((action, i) => (
          <View
            key={i}
            style={{
              backgroundColor: C.bone,
              borderLeftWidth: 3,
              borderLeftColor: action.tagColor,
              padding: 12,
              borderRadius: 3,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: action.tagColor,
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              {action.tag.toUpperCase()}
            </Text>
            <View
              style={{
                flexDirection: "row" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Helvetica-Bold",
                  color: C.navy,
                  flex: 1,
                }}
              >
                {action.title}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: C.teal,
                }}
              >
                {action.scoreChange}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 9.5,
                color: C.muted,
                lineHeight: 1.5,
              }}
            >
              {action.how}
            </Text>
          </View>
        ))}

        {/* Combined lift */}
        {data.combinedLift && (
          <View
            style={{
              ...s.card,
              borderLeftWidth: 3,
              borderLeftColor: C.teal,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: C.teal,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              IF YOU DID BOTH
            </Text>
            <View
              style={{
                flexDirection: "row" as const,
                alignItems: "flex-end" as const,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: "Helvetica-Bold",
                  color: C.navy,
                }}
              >
                {data.combinedLift.projectedScore}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: C.teal,
                  marginBottom: 4,
                  marginLeft: 8,
                }}
              >
                +{data.combinedLift.lift} points
              </Text>
            </View>
            {data.combinedLift.bandShift ? (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: C.teal,
                  marginTop: 4,
                }}
              >
                Band shift → {data.combinedLift.bandShift}
              </Text>
            ) : null}
            {data.combinedLift.explanation ? (
              <Text
                style={{
                  fontSize: 9.5,
                  color: C.muted,
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {data.combinedLift.explanation}
              </Text>
            ) : null}
          </View>
        )}

        {/* Divider */}
        <View style={s.divider} />

        {/* Tradeoffs */}
        {data.tradeoff && (
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                ...s.sectionTitle,
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              Tradeoffs to Understand
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                color: C.navy,
                marginBottom: 8,
              }}
            >
              {data.tradeoff.actionLabel}
            </Text>
            <View style={{ flexDirection: "row" as const }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: "Helvetica-Bold",
                    color: C.teal,
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  UPSIDE
                </Text>
                <Text style={{ fontSize: 9.5, color: C.navy, lineHeight: 1.5 }}>
                  {data.tradeoff.upside}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: "Helvetica-Bold",
                    color: C.bandLimited,
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  COST
                </Text>
                <Text style={{ fontSize: 9.5, color: C.navy, lineHeight: 1.5 }}>
                  {data.tradeoff.downside}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Helvetica-Oblique",
                color: C.purple,
                marginTop: 8,
              }}
            >
              {data.tradeoff.recommendation}
            </Text>
          </View>
        )}

        {/* What to avoid */}
        {data.avoidActions.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
                color: C.bandLimited,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              WHAT TO AVOID
            </Text>
            {data.avoidActions.map((item, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row" as const,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 9.5,
                    color: C.bandLimited,
                    marginRight: 4,
                  }}
                >
                  ✕
                </Text>
                <Text style={{ fontSize: 9.5, color: C.navy, flex: 1 }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Divider */}
        <View style={s.divider} />

        {/* Week-by-Week Roadmap */}
        <Text
          style={{
            ...s.sectionTitle,
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          Week-by-Week Roadmap
        </Text>

        {data.roadmap.map((step, i) => (
          <View
            key={i}
            style={{
              backgroundColor: C.bone,
              padding: 12,
              borderRadius: 3,
              marginBottom: 8,
              flexDirection: "row" as const,
            }}
          >
            <View style={{ width: 60, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Helvetica-Bold",
                  color: C.teal,
                  letterSpacing: 1,
                }}
              >
                {step.week}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Helvetica-Bold",
                  color: C.navy,
                  marginBottom: 2,
                }}
              >
                {step.action}
              </Text>
              <Text
                style={{
                  fontSize: 9.5,
                  color: C.muted,
                  lineHeight: 1.5,
                }}
              >
                {step.detail}
              </Text>
              {step.target ? (
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: "Helvetica-Bold",
                    color: C.teal,
                    marginTop: 4,
                  }}
                >
                  Target: {step.target}
                </Text>
              ) : null}
            </View>
          </View>
        ))}

        {/* Divider */}
        <View style={s.divider} />

        {/* When to Retake */}
        <View
          style={{
            ...s.card,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
              color: C.teal,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            WHEN TO RETAKE
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Helvetica-Bold",
              color: C.navy,
              marginBottom: 4,
            }}
          >
            {data.reassessDate}
          </Text>
          <Text style={{ fontSize: 9.5, color: C.muted, marginBottom: 8 }}>
            {data.reassessDaysLeft} days from now · {data.reassessTiming}
          </Text>

          {data.triggers.length > 0 && (
            <View>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Helvetica-Bold",
                  color: C.taupe,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                OR RETAKE SOONER IF:
              </Text>
              {data.triggers.map((trigger, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row" as const,
                    marginBottom: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9.5,
                      color: C.bandDeveloping,
                      marginRight: 4,
                    }}
                  >
                    •
                  </Text>
                  <Text style={{ fontSize: 9.5, color: C.navy, flex: 1 }}>
                    {trigger}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Methodology footnote */}
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Helvetica-Oblique",
            color: C.taupe,
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          This report was generated by RunPayway™ Model RP-2.0. It reflects
          structural inputs only and does not constitute financial, legal, or
          investment advice. Scores are deterministic: the same answers always
          produce the same score. No external data is used.
        </Text>
      </View>

      <Footer section="Action Plan" pageNum={4} />
    </Page>
  );

  /* ---------------------------------------------------------------- */
  /*  ASSEMBLE DOCUMENT & RETURN BLOB                                  */
  /* ---------------------------------------------------------------- */

  const ReportDocument = () => (
    <Document
      title={`RunPayway Income Stability Report — ${data.assessmentTitle}`}
      author="RunPayway™"
      subject="Income Stability Score™ Assessment"
      creator="RunPayway Model RP-2.0"
    >
      <CoverPage />
      <Page1 />
      <Page2 />
      <Page3 />
      <Page4 />
    </Document>
  );

  const blob = await pdf(<ReportDocument />).toBlob();
  return blob;
}
