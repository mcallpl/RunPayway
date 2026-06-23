-- DropIndex
DROP INDEX "policy_versions_version_idx";

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "policy_id" TEXT NOT NULL,
    "policy_version" TEXT NOT NULL,
    "policy_hash" TEXT NOT NULL,
    "cohort_key" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "policies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cohort_policy_bindings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "cohort_key" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cohort_policy_bindings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cohort_policy_bindings_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evaluation_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "cohort_key" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "input_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evaluation_requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "evaluation_requests_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evaluation_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evaluation_request_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "compliance_classification" TEXT NOT NULL,
    "violation_score" INTEGER NOT NULL,
    "reason_codes" TEXT NOT NULL,
    "rule_results" TEXT NOT NULL,
    "result_hash" TEXT NOT NULL,
    "evaluator_version" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evaluation_results_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "evaluation_results_evaluation_request_id_fkey" FOREIGN KEY ("evaluation_request_id") REFERENCES "evaluation_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "audit_id" TEXT NOT NULL,
    "evaluation_request_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "input_hash" TEXT NOT NULL,
    "policy_hash" TEXT NOT NULL,
    "result_hash" TEXT NOT NULL,
    "evaluator_version" TEXT NOT NULL,
    "replayable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_records_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "audit_records_evaluation_request_id_fkey" FOREIGN KEY ("evaluation_request_id") REFERENCES "evaluation_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "policy_version_governance" (
    "policy_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "current_state" TEXT NOT NULL DEFAULT 'DRAFT',
    "previous_state" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state_changed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_actor_id" TEXT,
    "last_action" TEXT,
    "transition_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "last_modified_by" TEXT,

    PRIMARY KEY ("policy_id", "version")
);

-- CreateIndex
CREATE UNIQUE INDEX "policies_policy_id_key" ON "policies"("policy_id");

-- CreateIndex
CREATE UNIQUE INDEX "policies_policy_id_policy_version_key" ON "policies"("policy_id", "policy_version");

-- CreateIndex
CREATE UNIQUE INDEX "cohort_policy_bindings_organization_id_cohort_key_key" ON "cohort_policy_bindings"("organization_id", "cohort_key");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_results_evaluation_request_id_key" ON "evaluation_results"("evaluation_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_records_audit_id_key" ON "audit_records"("audit_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_records_evaluation_request_id_key" ON "audit_records"("evaluation_request_id");

-- CreateIndex
CREATE INDEX "policy_version_governance_policy_id_idx" ON "policy_version_governance"("policy_id");

-- CreateIndex
CREATE INDEX "policy_version_governance_current_state_idx" ON "policy_version_governance"("current_state");

-- CreateIndex
CREATE INDEX "policy_version_governance_state_changed_at_idx" ON "policy_version_governance"("state_changed_at");

-- CreateIndex
CREATE INDEX "policy_version_governance_policy_id_current_state_idx" ON "policy_version_governance"("policy_id", "current_state");

-- RedefineIndex
DROP INDEX "sqlite_autoindex_audit_events_3";
CREATE UNIQUE INDEX "audit_events_audit_hash_key" ON "audit_events"("audit_hash");

-- RedefineIndex
DROP INDEX "sqlite_autoindex_audit_events_2";
CREATE UNIQUE INDEX "audit_events_sequence_number_key" ON "audit_events"("sequence_number");
