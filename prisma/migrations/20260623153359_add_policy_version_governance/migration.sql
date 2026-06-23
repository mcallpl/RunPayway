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
CREATE INDEX "policy_version_governance_policy_id_idx" ON "policy_version_governance"("policy_id");

-- CreateIndex
CREATE INDEX "policy_version_governance_current_state_idx" ON "policy_version_governance"("current_state");

-- CreateIndex
CREATE INDEX "policy_version_governance_state_changed_at_idx" ON "policy_version_governance"("state_changed_at");

-- CreateIndex
CREATE INDEX "policy_version_governance_policy_id_current_state_idx" ON "policy_version_governance"("policy_id", "current_state");

