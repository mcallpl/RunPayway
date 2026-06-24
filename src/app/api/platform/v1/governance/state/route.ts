/**
 * GET /api/platform/v1/governance/state?policy_id=...&version=...
 * Get current governance state
 */

import { NextRequest, NextResponse } from "next/server";
import { governanceService } from "../../../../../../lib/phase6";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policy_id = searchParams.get("policy_id");
    const version_str = searchParams.get("version");

    if (!policy_id || !version_str) {
      return NextResponse.json(
        {
          status: "error",
          error: "ValidationError",
          message: "Missing required query parameters: policy_id, version",
        },
        { status: 400 },
      );
    }

    const version = parseInt(version_str, 10);
    if (isNaN(version)) {
      return NextResponse.json(
        {
          status: "error",
          error: "ValidationError",
          message: "Invalid version: must be an integer",
        },
        { status: 400 },
      );
    }

    const result = await governanceService.getState(policy_id, version);

    if (!result) {
      return NextResponse.json(
        {
          status: "error",
          error: "NotFound",
          message: `Policy version not found: ${policy_id} v${version}`,
        },
        { status: 404 },
      );
    }

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
