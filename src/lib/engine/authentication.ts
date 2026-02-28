import { createHash } from "crypto";
import { MODEL, VERSION } from "./constants";

export function generateAuthenticationCode(
  referenceId: string,
  timestamp: string,
  finalScore: number
): string {
  const input = `${referenceId}${timestamp}${finalScore}${MODEL}${VERSION}`;
  const hash = createHash("sha256").update(input).digest("hex");
  const truncated = hash.substring(0, 16).toUpperCase();
  return `${truncated.slice(0, 4)}-${truncated.slice(4, 8)}-${truncated.slice(8, 12)}-${truncated.slice(12, 16)}`;
}
