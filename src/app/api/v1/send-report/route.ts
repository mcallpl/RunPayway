// RUNPAYWAY™ — POST /api/v1/send-report
// Send the Income Stability Assessment report via email (Resend)

import { NextRequest, NextResponse } from "next/server";
import { sendReportEmail, type ReportEmailData } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      "recipientEmail",
      "finalScore",
      "stabilityBand",
      "recordId",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Basic email format check
    const email = body.recipientEmail as string;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const data: ReportEmailData = {
      recipientEmail: email,
      assessmentTitle: body.assessmentTitle || "",
      finalScore: body.finalScore,
      stabilityBand: body.stabilityBand,
      recordId: body.recordId,
      modelVersion: body.modelVersion || "RP-2.0",
      issuedTimestamp: body.issuedTimestamp || new Date().toISOString(),
      industrySector: body.industrySector || "",
      classification: body.classification || "",
      primaryConstraintLabel: body.primaryConstraintLabel || "",
      bandInterpretationText: body.bandInterpretationText || "",
      peerPercentileLabel: body.peerPercentileLabel || "",
      riskScenarioDrop: body.riskScenarioDrop || 0,
      planKey: body.planKey || undefined,
    };

    const result = await sendReportEmail(data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report sent successfully",
      emailId: result.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
