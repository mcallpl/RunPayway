-- Create evaluations table (Phase 5a: Core Evaluation Persistence)
CREATE TABLE "evaluations" (
  "evaluation_id" TEXT NOT NULL PRIMARY KEY,
  "subject_id" TEXT NOT NULL,
  "cohort_key" TEXT NOT NULL,
  "policy_id" TEXT NOT NULL,
  "policy_version" INTEGER NOT NULL,
  "policy_hash" TEXT NOT NULL,
  "evaluation_timestamp" DATETIME NOT NULL,
  "payload_hash" TEXT NOT NULL,
  "result_hash" TEXT NOT NULL,
  "classification" TEXT NOT NULL,
  "violation_score" INTEGER NOT NULL DEFAULT 0,
  "triggered_reason_codes" TEXT NOT NULL DEFAULT '[]',
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for query performance
CREATE INDEX "evaluations_subject_id_idx" ON "evaluations"("subject_id");
CREATE INDEX "evaluations_cohort_key_idx" ON "evaluations"("cohort_key");
CREATE INDEX "evaluations_evaluation_timestamp_idx" ON "evaluations"("evaluation_timestamp");
CREATE INDEX "evaluations_created_at_idx" ON "evaluations"("created_at");
CREATE INDEX "evaluations_result_hash_idx" ON "evaluations"("result_hash");

-- Add immutability enforcement via trigger (SQLite doesn't support UPDATE prevention via trigger easily,
-- so we'll enforce at application level in EvaluationRepository)
