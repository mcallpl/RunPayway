// RUNPAYWAY™ — Server-side monitoring session storage
// Persists monitoring sessions to JSON file with file locking

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { acquireFileLock, releaseFileLock } from "./file-lock";

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

const DATA_DIR = process.env.RUNPAYWAY_DATA_DIR || join(process.cwd(), "data");
const SESSIONS_FILE = join(DATA_DIR, "monitoring-sessions.json");
const LOCK_FILE = join(DATA_DIR, "monitoring-sessions.lock");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readSessions(): MonitoringSession[] {
  ensureDataDir();
  if (!existsSync(SESSIONS_FILE)) return [];
  const raw = readFileSync(SESSIONS_FILE, "utf8");
  return JSON.parse(raw) as MonitoringSession[];
}

function writeSessions(sessions: MonitoringSession[]): void {
  ensureDataDir();
  writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf8");
}

function isExpired(session: MonitoringSession): boolean {
  return new Date() > new Date(session.expires_at);
}

/** Generate access code in format RP-XXXX-XXXX */
function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let block1 = "", block2 = "";
  for (let i = 0; i < 4; i++) {
    block1 += chars[Math.floor(Math.random() * chars.length)];
    block2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RP-${block1}-${block2}`;
}

/** Create a new monitoring session (server-side, persistent) */
export async function createSession(email: string): Promise<MonitoringSession> {
  await acquireFileLock(LOCK_FILE);
  try {
    const sessions = readSessions();
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

    sessions.push(session);
    writeSessions(sessions);
    return session;
  } finally {
    releaseFileLock(LOCK_FILE);
  }
}

/** Verify a monitoring session by access code */
export async function verifySession(code: string): Promise<{
  valid: boolean;
  remaining: number;
  expired: boolean;
  session?: MonitoringSession;
}> {
  const sessions = readSessions();
  const session = sessions.find((s) => s.access_code === code);
  if (!session) return { valid: false, remaining: 0, expired: false };
  if (isExpired(session)) return { valid: true, remaining: 0, expired: true, session };
  const remaining = session.assessments_total - session.assessments_used;
  return { valid: true, remaining, expired: false, session };
}

/** Consume one assessment slot */
export async function useAssessment(code: string, recordId: string): Promise<boolean> {
  await acquireFileLock(LOCK_FILE);
  try {
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
  } finally {
    releaseFileLock(LOCK_FILE);
  }
}
