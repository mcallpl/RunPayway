#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function log(msg) {
  console.log(msg);
}

function logSuccess(msg) {
  console.log(`  ✓ ${msg}`);
}

function main() {
  const projectRoot = path.join(__dirname, '..');

  log('\n→ Cleaning up temporary files...\n');

  // Remove temporary test scripts from root
  const tempFiles = fs
    .readdirSync(projectRoot)
    .filter(
      (f) =>
        (f.startsWith('test-') || f.startsWith('check-') || f.startsWith('verify-')) &&
        f.endsWith('.js')
    );

  if (tempFiles.length > 0) {
    tempFiles.forEach((f) => {
      const filePath = path.join(projectRoot, f);
      fs.unlinkSync(filePath);
      logSuccess(`Removed: ${f}`);
    });
  } else {
    logSuccess('No temporary files to clean');
  }

  // Note about /tmp screenshots
  log('\nNote: Screenshots are stored in /tmp/runpayway-screenshots/');
  log('      (Not in project root, safe to ignore)\n');

  process.exit(0);
}

main();
