import { NextRequest, NextResponse } from "next/server";

/* ================================================================== */
/*  BADGE SVG API — /api/badge/[code]                                  */
/*  Returns a premium pill-shaped SVG verification badge.              */
/*  Self-contained: no external fonts, system-safe typography.         */
/* ================================================================== */

const BAND_COLORS: Record<string, string> = {
  "High Stability": "#1F6D7A",
  "Established Stability": "#2B5EA7",
  "Developing Stability": "#D0A23A",
  "Limited Stability": "#C74634",
};

function lookupRecord(code: string): { band: string; score: number } | null {
  // In a production system this would query a database.
  // For now, the code is a base64-encoded JSON payload (same format as access codes).
  try {
    const d = JSON.parse(atob(code.replace(/^RP-/, "")));
    if (typeof d.o === "number" && typeof d.b === "string") {
      return { score: d.o, band: d.b };
    }
  } catch {
    // not a valid encoded payload
  }
  return null;
}

function buildBadgeSvg(band: string): string {
  const color = BAND_COLORS[band] || "#5E6873";
  const labelWidth = 130;
  const bandText = band.replace(" Stability", "");
  const bandWidth = bandText.length * 8 + 24;
  const totalWidth = labelWidth + bandWidth;
  const height = 30;
  const r = 5;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="RunPayway Verified — ${band}">
  <title>RunPayway Verified — ${band}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2540"/>
      <stop offset="100%" stop-color="#0E1A2B"/>
    </linearGradient>
  </defs>
  <rect width="${labelWidth}" height="${height}" rx="${r}" ry="${r}" fill="url(#bg)"/>
  <rect x="${labelWidth}" width="${bandWidth}" height="${height}" rx="0" ry="0" fill="${color}"/>
  <rect x="${totalWidth - r}" width="${r}" height="${height}" fill="${color}"/>
  <rect x="${totalWidth - r}" y="0" width="${r}" height="${height}" rx="${r}" ry="${r}" fill="${color}"/>
  <rect x="${labelWidth - 1}" width="2" height="${height}" fill="${color}" opacity="0.3"/>
  <text x="${labelWidth / 2}" y="${height / 2 + 1}" fill="#F4F1EA" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="600" text-anchor="middle" dominant-baseline="central" letter-spacing="0.02em">RunPayway™ Verified</text>
  <text x="${labelWidth + bandWidth / 2}" y="${height / 2 + 1}" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700" text-anchor="middle" dominant-baseline="central">${bandText}</text>
</svg>`;
}

function build404Svg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="30" role="img" aria-label="Badge not found">
  <title>Badge not found</title>
  <rect width="200" height="30" rx="5" ry="5" fill="#5E6873"/>
  <text x="100" y="16" fill="#F4F1EA" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="600" text-anchor="middle" dominant-baseline="central">RunPayway™ — Not Found</text>
</svg>`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const record = lookupRecord(code);

  if (!record) {
    return new NextResponse(build404Svg(), {
      status: 404,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  return new NextResponse(buildBadgeSvg(record.band), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
