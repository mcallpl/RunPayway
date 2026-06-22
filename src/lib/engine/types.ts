// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Storage Types

export interface StructuralAssessmentRecord {
  record_id: string;
  subject_identifier?: string;
  authorization_code: string;
  model_version: string;
  assessment_date_utc: string;
  issued_timestamp_utc?: string;
  final_score: number;
  stability_band: string;
  input_checksum?: string;
  registry_status?: "Active" | "Superseded" | "Archived";
  _v2?: {
    normalized_inputs?: Record<string, any>;
    quality?: Record<string, any>;
  };
}

export interface StorageBackend {
  saveRecord(record: StructuralAssessmentRecord): Promise<void>;
  getRecord(recordId: string): Promise<StructuralAssessmentRecord | null>;
  findByInputChecksum(
    checksum: string,
    modelVersion: string,
  ): Promise<StructuralAssessmentRecord | null>;
  verifyRecord(
    recordId: string,
    authorizationCode: string,
  ): Promise<StructuralAssessmentRecord | null>;
  supersedePriorRecords(
    subjectIdentifier: string,
    excludeRecordId: string,
  ): Promise<void>;
}
