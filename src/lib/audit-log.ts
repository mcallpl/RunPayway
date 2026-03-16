// RUNPAYWAY™ — Structured Audit Logger
// JSON Lines audit logging for compliance and observability

import { appendFileSync } from "fs";
import { join } from "path";

export interface AuditEvent {
  action:
    | "record_created"
    | "record_accessed"
    | "record_verified"
    | "record_superseded"
    | "privacy_request"
    | "data_export";
  record_id?: string;
  ip?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const AUDIT_LOG_PATH =
  process.env.RUNPAYWAY_AUDIT_LOG_PATH ||
  join(process.cwd(), "data", "audit.jsonl");

const isProduction = process.env.NODE_ENV === "production";

/**
 * Write a structured audit log entry.
 *
 * In production: appends a JSON line to the configured audit log file.
 * In development: writes structured JSON to console.
 */
export function auditLog(event: AuditEvent): void {
  const entry = {
    action: event.action,
    timestamp: event.timestamp,
    ...(event.record_id && { record_id: event.record_id }),
    ...(event.ip && { ip: event.ip }),
    ...(event.metadata && { metadata: event.metadata }),
  };

  if (isProduction) {
    try {
      appendFileSync(AUDIT_LOG_PATH, JSON.stringify(entry) + "\n", "utf8");
    } catch {
      // If file write fails (e.g., read-only filesystem), fall back to console
      console.error("[audit-log] Failed to write to file, logging to console");
      console.log(JSON.stringify(entry));
    }
  } else {
    console.log("[audit]", JSON.stringify(entry, null, 2));
  }
}

/**
 * Extract client IP from a Request object (works with Next.js middleware headers).
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
