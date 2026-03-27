/* ------------------------------------------------------------------ */
/*  Stability Monitoring — access code system                          */
/*  Server-first with localStorage fallback for static deployments     */
/* ------------------------------------------------------------------ */

export interface MonitoringSession {
  access_code: string;
  email: string;
  plan: "annual_monitoring";
  assessments_total: 3;
  assessments_used: number;
  created_at: string;
  expires_at: string;
  assessment_records: string[];
}

const STORAGE_KEY = "rp_monitoring_sessions";

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

/** Create a new monitoring session (localStorage only) */
export function createMonitoringSession(email: string): MonitoringSession {
  const now = new Date();
  const expires = new Date(now);
  expires.setFullYear(expires.getFullYear() + 1);

  const session: MonitoringSession = {
    access_code: generateAccessCode(),
    email,
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
    return createMonitoringSession(email);
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
