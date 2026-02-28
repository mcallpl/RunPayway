import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { SubmissionRecord } from "./types";

const DATA_DIR = join(process.cwd(), "data");
const RECORDS_FILE = join(DATA_DIR, "records.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readRecords(): SubmissionRecord[] {
  ensureDataDir();
  if (!existsSync(RECORDS_FILE)) {
    return [];
  }
  const raw = readFileSync(RECORDS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeRecords(records: SubmissionRecord[]): void {
  ensureDataDir();
  writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), "utf-8");
}

export function saveRecord(record: SubmissionRecord): void {
  const records = readRecords();
  records.push(record);
  writeRecords(records);
}

export function getRecordByReference(referenceId: string): SubmissionRecord | null {
  const records = readRecords();
  return records.find((r) => r.referenceId === referenceId) ?? null;
}

export function getRecordsByEmail(email: string): SubmissionRecord[] {
  const records = readRecords();
  return records.filter((r) => r.setup.email === email);
}
