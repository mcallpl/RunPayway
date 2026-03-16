/* ------------------------------------------------------------------ */
/*  Annual Monitoring — access code system (localStorage only)         */
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

/* ---- helpers ---- */

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

/* ---- public API ---- */

/** Generate a code in the format RP-XXXX-XXXX */
export function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let block1 = "";
  let block2 = "";
  for (let i = 0; i < 4; i++) {
    block1 += chars[Math.floor(Math.random() * chars.length)];
    block2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RP-${block1}-${block2}`;
}

/** Create a new monitoring session and persist it */
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

/** Look up a session by access code */
export function getSessionByCode(code: string): MonitoringSession | null {
  const sessions = readSessions();
  return sessions.find((s) => s.access_code === code) ?? null;
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

/** Use one assessment — returns false if none remaining or expired */
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
