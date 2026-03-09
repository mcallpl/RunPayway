// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — JSON File Storage Backend

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { StructuralAssessmentRecord, StorageBackend } from "./types";

const DATA_DIR =
  process.env.NODE_ENV === "production"
    ? join("/tmp", "runpayway-data")
    : join(process.cwd(), "data");
const RECORDS_FILE = join(DATA_DIR, "records.json");

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
    const records = readRecords();
    records.push(record);
    writeRecords(records);
  }

  async getRecord(
    recordId: string
  ): Promise<StructuralAssessmentRecord | null> {
    const records = readRecords();
    return records.find((r) => r.record_id === recordId) ?? null;
  }

  async findByInputChecksum(
    checksum: string,
    modelVersion: string
  ): Promise<StructuralAssessmentRecord | null> {
    const records = readRecords();
    return (
      records.find(
        (r) =>
          r.input_checksum === checksum &&
          r.model_version === modelVersion &&
          r.registry_status === "Active"
      ) ?? null
    );
  }

  async verifyRecord(
    recordId: string,
    authorizationCode: string
  ): Promise<StructuralAssessmentRecord | null> {
    const records = readRecords();
    return (
      records.find(
        (r) =>
          r.record_id === recordId &&
          r.authorization_code === authorizationCode
      ) ?? null
    );
  }

  async supersedePriorRecords(
    subjectIdentifier: string,
    excludeRecordId: string
  ): Promise<void> {
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
  }
}
