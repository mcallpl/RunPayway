-- Phase 5b: Policy Registry Persistence
-- Create policy_versions immutable versioned table
CREATE TABLE "policy_versions" (
  "policy_id" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "source_definition" TEXT NOT NULL,
  "compiled_hash" TEXT NOT NULL,
  "effective_date" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" TEXT,

  PRIMARY KEY ("policy_id", "version")
);

-- Create indexes for performance
CREATE INDEX "policy_versions_created_at_idx" ON "policy_versions"("created_at");
CREATE INDEX "policy_versions_version_idx" ON "policy_versions"("version");
