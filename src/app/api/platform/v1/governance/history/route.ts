/**
 * GET /api/platform/v1/governance/history?policy_id=...
 * Get governance history (all versions)
 */

import { NextRequest, NextResponse } from "next/server";
import { governanceService } from "../../../../../../lib/phase6";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policy_id = searchParams.get("policy_id");

    if (!policy_id) {
      return NextResponse.json(
        {
          status: "error",
          error: "ValidationError",
          message: "Missing required query parameter: policy_id",
        },
        { status: 400 },
      );
    }

    const result = await governanceService.getHistory(policy_id);

    return NextResponse.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: "InternalServerError",
        message: "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
