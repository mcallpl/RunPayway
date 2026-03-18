// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — JSON File Storage Backend
//
// Fixes:
//   - Persistent storage: uses RUNPAYWAY_DATA_DIR or cwd/data (not /tmp)
//   - File locking: acquires exclusive lock before read-modify-write cycles

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { StructuralAssessmentRecord, StorageBackend } from "./types";
import { acquireFileLock, releaseFileLock } from "../file-lock";

const DATA_DIR = process.env.RUNPAYWAY_DATA_DIR || join(process.cwd(), "data");
const RECORDS_FILE = join(DATA_DIR, "records.json");
const LOCK_FILE = join(DATA_DIR, "records.lock");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readRecords(): StructuralAssessmentRecord[] {
  ensureDataDir();
  if (!existsSync(RECORDS_FILE)) {
    return [];
  }
  const raw = readFileSync(RECORDS_FILE, "utf8");
  return JSON.parse(raw) as StructuralAssessmentRecord[];
}

function writeRecords(records: StructuralAssessmentRecord[]): void {
  ensureDataDir();
  writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), "utf8");
}

export class JsonStorageBackend implements StorageBackend {
  async saveRecord(record: StructuralAssessmentRecord): Promise<void> {
    await acquireFileLock(LOCK_FILE);
    try {
      const records = readRecords();
      records.push(record);
      writeRecords(records);
    } finally {
      releaseFileLock(LOCK_FILE);
    }
  }

  async getRecord(
    recordId: string,
  ): Promise<StructuralAssessmentRecord | null> {
    // Read-only — no lock needed
    const records = readRecords();
    return records.find((r) => r.record_id === recordId) ?? null;
  }

  async findByInputChecksum(
    checksum: string,
    modelVersion: string,
  ): Promise<StructuralAssessmentRecord | null> {
    const records = readRecords();
    return (
      records.find(
        (r) =>
          r.input_checksum === checksum &&
          r.model_version === modelVersion &&
          r.registry_status === "Active",
      ) ?? null
    );
  }

  async verifyRecord(
    recordId: string,
    authorizationCode: string,
  ): Promise<StructuralAssessmentRecord | null> {
    const records = readRecords();
    return (
      records.find(
        (r) =>
          r.record_id === recordId &&
          r.authorization_code === authorizationCode,
      ) ?? null
    );
  }

  async supersedePriorRecords(
    subjectIdentifier: string,
    excludeRecordId: string,
  ): Promise<void> {
    await acquireFileLock(LOCK_FILE);
    try {
      const records = readRecords();
      let changed = false;
      for (const record of records) {
        if (
          record.subject_identifier === subjectIdentifier &&
          record.record_id !== excludeRecordId &&
          record.registry_status === "Active"
        ) {
          record.registry_status = "Superseded";
          changed = true;
        }
      }
      if (changed) {
        writeRecords(records);
      }
    } finally {
      releaseFileLock(LOCK_FILE);
    }
  }
}
