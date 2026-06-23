-- Phase 5C: Audit Ledger Persistence
-- Create audit_events immutable append-only table with deterministic sequence ordering and cryptographic chain integrity

CREATE TABLE "audit_events" (
  "audit_id" TEXT NOT NULL PRIMARY KEY,
  "sequence_number" INTEGER NOT NULL UNIQUE,
  "previous_hash" TEXT,
  "audit_hash" TEXT NOT NULL UNIQUE,

  "event_type" TEXT NOT NULL,
  "event_timestamp" DATETIME NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  "actor_id" TEXT,
  "subject_type" TEXT NOT NULL,
  "subject_id" TEXT NOT NULL,

  "evaluation_id" TEXT,
  "policy_id" TEXT,
  "policy_version" INTEGER,

  "details" TEXT NOT NULL
);

-- Create indexes for query performance and chain integrity
CREATE INDEX "audit_events_sequence_number_idx" ON "audit_events"("sequence_number");
CREATE INDEX "audit_events_event_type_idx" ON "audit_events"("event_type");
CREATE INDEX "audit_events_subject_type_subject_id_idx" ON "audit_events"("subject_type", "subject_id");
CREATE INDEX "audit_events_evaluation_id_idx" ON "audit_events"("evaluation_id");
CREATE INDEX "audit_events_policy_id_policy_version_idx" ON "audit_events"("policy_id", "policy_version");
CREATE INDEX "audit_events_actor_id_idx" ON "audit_events"("actor_id");
CREATE INDEX "audit_events_event_timestamp_idx" ON "audit_events"("event_timestamp");
CREATE INDEX "audit_events_created_at_idx" ON "audit_events"("created_at");
CREATE INDEX "audit_events_audit_hash_idx" ON "audit_events"("audit_hash");
