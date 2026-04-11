/* ------------------------------------------------------------------ */
/*  Stability Monitoring — access code system                          */
/*  Server-first with localStorage fallback for static deployments     */
/* ------------------------------------------------------------------ */

import { WORKER_URL } from "@/lib/config";

export interface MonitoringSession {
  access_code: string;
  email: string;
  pin: string;
  plan: "annual_monitoring";
  assessments_total: 3;
  assessments_used: number;
  created_at: string;
  expires_at: string;
  assessment_records: string[];
}

const STORAGE_KEY = "rp_monitoring_sessions";

/* ---- PIN hashing (Web Crypto API — browser safe) ---- */

async function hashPin(pin: string): Promise<string> {
  if (typeof window === "undefined") return pin;
  const encoded = new TextEncoder().encode(pin + "rp-salt-2026");
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

function hashPinSync(pin: string): string {
  // Simple sync hash for non-async contexts — XOR-based, not cryptographic
  // Used only as fallback; prefer hashPin() when async is available
  let h = 0x9e3779b9;
  for (let i = 0; i < pin.length; i++) { h = ((h << 5) - h + pin.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(16).padStart(8, "0");
}

/* ---- localStorage helpers (fallback) ---- */

function readSessions(): MonitoringSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: MonitoringSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/* ---- client-only API (fallback for static deployments) ---- */

/** Generate a code in the format RP-XXXX-XXXX */
export function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let block1 = "";
  let block2 = "";
  for (let i = 0; i < 4; i++) {
    block1 += chars[Math.floor(Math.random() * chars.length)];
    block2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RP-${block1}-${block2}`;
}

/** Create a new monitoring session (localStorage only) — PIN should be pre-hashed or will be hashed sync */
export function createMonitoringSession(email: string, pin = "0000", pinAlreadyHashed = false): MonitoringSession {
  const now = new Date();
  const expires = new Date(now);
  expires.setFullYear(expires.getFullYear() + 1);

  const session: MonitoringSession = {
    access_code: generateAccessCode(),
    email,
    pin: pinAlreadyHashed ? pin : hashPinSync(pin),
    plan: "annual_monitoring",
    assessments_total: 3,
    assessments_used: 0,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
    assessment_records: [],
  };

  const sessions = readSessions();
  sessions.push(session);
  writeSessions(sessions);
  return session;
}

/** Look up a session by access code (localStorage) */
export function getSessionByCode(code: string): MonitoringSession | null {
  const sessions = readSessions();
  return sessions.find((s) => s.access_code === code) ?? null;
}

/** Look up a session by email (localStorage) */
export function getSessionByEmail(email: string): MonitoringSession | null {
  const sessions = readSessions();
  const normalized = email.trim().toLowerCase();
  return sessions.find((s) => s.email.toLowerCase() === normalized) ?? null;
}

/** Check if a session has expired */
export function isExpired(session: MonitoringSession): boolean {
  return new Date() > new Date(session.expires_at);
}

/** Return assessments remaining (0 if expired) */
export function getRemaining(code: string): number {
  const session = getSessionByCode(code);
  if (!session || isExpired(session)) return 0;
  return session.assessments_total - session.assessments_used;
}

/** Use one assessment (localStorage only) */
export function useAssessment(code: string, recordId: string): boolean {
  const sessions = readSessions();
  const idx = sessions.findIndex((s) => s.access_code === code);
  if (idx === -1) return false;

  const session = sessions[idx];
  if (isExpired(session)) return false;
  if (session.assessments_used >= session.assessments_total) return false;

  session.assessments_used += 1;
  session.assessment_records.push(recordId);
  sessions[idx] = session;
  writeSessions(sessions);
  return true;
}

/* ---- server-backed API (primary — falls back to localStorage) ---- */

/** Create monitoring session via server, fallback to localStorage */
export async function createMonitoringSessionServer(
  email: string,
  paymentToken?: string,
  paymentPayload?: Record<string, string>,
  pin = "0000",
): Promise<MonitoringSession> {
  try {
    const body: Record<string, unknown> = { action: "create", email };
    if (paymentToken && paymentPayload) {
      body.token = paymentToken;
      body.payload = paymentPayload;
    }
    const res = await fetch("/api/v1/monitoring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Server error");
    const data = await res.json();

    // Also store in localStorage for offline access
    const session: MonitoringSession = {
      access_code: data.access_code,
      email,
      pin,
      plan: "annual_monitoring",
      assessments_total: 3,
      assessments_used: data.assessments_used ?? 0,
      created_at: new Date().toISOString(),
      expires_at: data.expires_at,
      assessment_records: [],
    };
    const sessions = readSessions();
    sessions.push(session);
    writeSessions(sessions);
    return session;
  } catch {
    return createMonitoringSession(email, pin);
  }
}

/** Verify a PIN against the stored hash */
export async function verifyPin(email: string, pin: string): Promise<boolean> {
  const session = getSessionByEmail(email);
  if (!session) return false;
  // Try async hash first
  const hashed = await hashPin(pin);
  if (session.pin === hashed) return true;
  // Fallback: try sync hash (for sessions created before async hashing)
  if (session.pin === hashPinSync(pin)) return true;
  // Fallback: direct comparison (for sessions created before any hashing)
  if (session.pin === pin) return true;
  return false;
}

/** Reset PIN and send new one to email (forgot PIN flow) */
export async function resetPinAndSend(email: string): Promise<boolean> {
  const sessions = readSessions();
  const normalized = email.trim().toLowerCase();
  const idx = sessions.findIndex(s => s.email.toLowerCase() === normalized);
  if (idx === -1) return false;

  // Generate new random PIN
  const newPin = String(Math.floor(1000 + Math.random() * 9000));
  const hashed = await hashPin(newPin);

  // Update stored session with hashed PIN
  sessions[idx].pin = hashed;
  writeSessions(sessions);

  // Send new plaintext PIN to email
  try {
    await fetch(`${WORKER_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "PIN Reset",
        email: email.trim(),
        subject: "pin_reset",
        message: `Your new RunPayway Monitoring Portal PIN is: ${newPin}\n\nThis PIN has been reset. If you did not request this, please contact support.`,
      }),
    });
    return true;
  } catch {
    return false;
  }
}

/** Verify remaining assessments via server, fallback to localStorage */
export async function getRemainingServer(code: string): Promise<number> {
  try {
    const res = await fetch("/api/v1/monitoring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", access_code: code }),
    });
    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    return data.remaining ?? 0;
  } catch {
    return getRemaining(code);
  }
}

/** Use an assessment via server, fallback to localStorage */
export async function useAssessmentServer(code: string, recordId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/v1/monitoring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "use", access_code: code, record_id: recordId }),
    });
    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    if (data.success) {
      // Sync to localStorage
      useAssessment(code, recordId);
    }
    return data.success ?? false;
  } catch {
    return useAssessment(code, recordId);
  }
}
