/**
 * POST /api/platform/v1/governance/retire
 * Retire policy (ACTIVE → RETIRED)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  governanceService,
  GovernanceContext,
  GovernanceRole,
  InvalidStateTransitionError,
  UnauthorizedGovernanceActionError,
} from "../../../../../../lib/phase6";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { policy_id, version, actor_id, role } = body;
    if (!policy_id || version === undefined || !actor_id || !role) {
      return NextResponse.json(
        {
          status: "error",
          error: "ValidationError",
          message: "Missing required fields: policy_id, version, actor_id, role",
        },
        { status: 400 },
      );
    }

    const context: GovernanceContext = {
      actor_id,
      role: role as GovernanceRole,
      timestamp: new Date(),
    };

    const result = await governanceService.retire(policy_id, version, context);

    return NextResponse.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof InvalidStateTransitionError) {
      return NextResponse.json(
        {
          status: "error",
          error: "InvalidStateTransitionError",
          message: error.message,
        },
        { status: 400 },
      );
    }

    if (error instanceof UnauthorizedGovernanceActionError) {
      return NextResponse.json(
        {
          status: "error",
          error: "UnauthorizedGovernanceActionError",
          message: error.message,
        },
        { status: 401 },
      );
    }

    if (error instanceof Error && error.message.includes("Policy version not found")) {
      return NextResponse.json(
        {
          status: "error",
          error: "NotFound",
          message: error.message,
        },
        { status: 404 },
      );
    }

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
