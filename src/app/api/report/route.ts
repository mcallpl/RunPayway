import { NextResponse } from "next/server";
import { getRecordByReference } from "@/lib/engine/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const referenceId = searchParams.get("id");

  if (!referenceId) {
    return NextResponse.json(
      { error: "Missing reference ID." },
      { status: 400 }
    );
  }

  const record = getRecordByReference(referenceId);
  if (!record) {
    return NextResponse.json(
      { error: "Record not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ engineOutput: record.engineOutput });
}
