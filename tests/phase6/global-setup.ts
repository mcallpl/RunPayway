import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const testDbPath = path.join(process.cwd(), 'prisma', 'test.db');

/**
 * Global setup: Runs BEFORE any test files are loaded
 * - Ensures DATABASE_URL is set (via vitest.phase6.config.ts env)
 * - Deletes stale test.db if exists
 * - Applies all Prisma migrations to initialize schema
 * - Verifies test.db is ready
 *
 * This function is invoked by Vitest before test discovery.
 * If it throws, all tests are skipped.
 */
export async function setup(): Promise<void> {
  console.log('🧪 Phase 6 Global Setup: Initializing test database...\n');

  // Set DATABASE_URL for test environment (used by globalSetup and test modules)
  // This ensures Prisma will use test.db instead of dev.db
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'file:./test.db';

  const dbUrl = process.env.DATABASE_URL;
  console.log(`  ✓ DATABASE_URL set: ${dbUrl}`);

  // Step 1: Delete stale test.db if it exists
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
      console.log(`  ✓ Deleted stale test.db`);
    } catch (error) {
      throw new Error(`Failed to delete test.db: ${error}`);
    }
  }

  // Step 2: Run Prisma migrations to initialize schema
  console.log(`  → Running Prisma migrations to initialize test.db...`);
  try {
    execSync('prisma migrate deploy', {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log(`  ✓ Migrations applied successfully`);
  } catch (error) {
    console.error(`  ✗ Migration failed:`, error);
    throw error;
  }

  // Step 3: Verify test.db was created
  if (!fs.existsSync(testDbPath)) {
    throw new Error(
      `test.db was not created by migrations. Setup failed.`
    );
  }
  const stats = fs.statSync(testDbPath);
  console.log(`  ✓ test.db created and ready (${stats.size} bytes)`);

  console.log('\n✅ Test database setup complete. Running tests...\n');
}

/**
 * Global teardown: Runs AFTER all tests complete
 * - Optionally clean up test.db to save disk space
 * - For development: leave test.db so it can be inspected if needed
 * - For CI: delete it
 */
export async function teardown(): Promise<void> {
  console.log('\n🧹 Phase 6 Global Teardown: Cleaning up test database...');

  // Only delete test.db in CI environments (to save space)
  // In local development, leave it for inspection
  if (process.env.CI === 'true') {
    if (fs.existsSync(testDbPath)) {
      try {
        fs.unlinkSync(testDbPath);
        console.log(`  ✓ Deleted test.db (CI environment)`);
      } catch (error) {
        console.warn(`  ⚠ Failed to delete test.db:`, error);
      }
    }
  } else {
    console.log(`  ℹ Keeping test.db for local inspection (CI=false)`);
    console.log(`  📍 Test database at: ${testDbPath}`);
  }
}
