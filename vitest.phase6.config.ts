import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // globalSetup runs BEFORE any test files are loaded
    // This is where we initialize the test database
    globalSetup: ['./tests/phase6/global-setup.ts'],
    // Only run tests matching this pattern
    include: ['tests/phase6/**/*.test.ts'],
    // Environment variables set for this test run
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
    },
  },
});
