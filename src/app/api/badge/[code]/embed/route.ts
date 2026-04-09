import { NextRequest, NextResponse } from "next/server";

/* ================================================================== */
/*  EMBED CODE ENDPOINT — /api/badge/[code]/embed                      */
/*  Returns HTML embed snippet for the verification badge.             */
/* ================================================================== */

const BASE_URL = "https://peoplestar.com/RunPayway";

function lookupBand(code: string): string | null {
  try {
    const d = JSON.parse(atob(code.replace(/^RP-/, "")));
    if (typeof d.b === "string") return d.b;
  } catch {
    // invalid
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const band = lookupBand(code);

  if (!band) {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }

  const badgeUrl = `${BASE_URL}/api/badge/${encodeURIComponent(code)}`;
  const verifyUrl = `${BASE_URL}/verify?code=${encodeURIComponent(code)}`;
  const altText = `RunPayway Verified — ${band}`;

  const html = `<a href="${verifyUrl}" target="_blank" rel="noopener">\n  <img src="${badgeUrl}" alt="${altText}" height="30" />\n</a>`;

  return NextResponse.json({
    html,
    badge_url: badgeUrl,
    verify_url: verifyUrl,
    band,
  }, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
