// RUNPAYWAY™ — GET /api/health
// Health check endpoint for monitoring and uptime checks

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    model: "RP-1.0",
    timestamp: new Date().toISOString(),
  });
}
