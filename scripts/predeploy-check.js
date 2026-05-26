#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(msg) {
  console.log(msg);
}

function logSuccess(msg) {
  console.log(`  ✓ ${msg}`);
}

function logError(msg) {
  console.log(`  ✗ ${msg}`);
}

function checkBuild() {
  log('\n→ Checking build...');
  const buildDir = path.join(__dirname, '..', '.next');
  if (fs.existsSync(buildDir)) {
    logSuccess('Build directory exists');
    return true;
  } else {
    logError('Build directory missing. Run: npm run build');
    return false;
  }
}

function checkPackageFiles() {
  log('\n→ Checking package files...');
  const required = ['package.json', 'package-lock.json', 'tsconfig.json'];
  const projectRoot = path.join(__dirname, '..');
  const missing = required.filter((f) => !fs.existsSync(path.join(projectRoot, f)));

  if (missing.length === 0) {
    logSuccess('All package files present');
    return true;
  } else {
    logError(`Missing: ${missing.join(', ')}`);
    return false;
  }
}

function checkRootScripts() {
  log('\n→ Checking for temporary files in root...');
  const projectRoot = path.join(__dirname, '..');
  const tempFiles = fs
    .readdirSync(projectRoot)
    .filter(
      (f) =>
        (f.startsWith('test-') || f.startsWith('check-') || f.startsWith('verify-')) &&
        f.endsWith('.js')
    );

  if (tempFiles.length === 0) {
    logSuccess('No temporary scripts in root');
    return true;
  } else {
    logError(`Temporary scripts found: ${tempFiles.join(', ')}`);
    return false;
  }
}

function checkGitStatus() {
  log('\n→ Checking git status...');
  try {
    const output = execSync('git status --short', { encoding: 'utf-8' });
    const lines = output.trim().split('\n').filter((l) => l.length > 0);

    if (lines.length === 0) {
      logSuccess('Working tree clean');
      return true;
    } else {
      log('\n  Modified files:');
      lines.forEach((line) => log(`    ${line}`));
      return true; // Don't fail, just inform
    }
  } catch (err) {
    logError(`Git check failed: ${err.message}`);
    return false;
  }
}

function main() {
  log('\n' + '='.repeat(60));
  log('PREDEPLOY CHECK');
  log('='.repeat(60));

  const checks = [
    checkBuild(),
    checkPackageFiles(),
    checkRootScripts(),
    checkGitStatus(),
  ];

  log('\n' + '='.repeat(60));
  const allPass = checks.every((c) => c);
  const status = allPass ? '✓ READY FOR DEPLOYMENT' : '✗ FIX ISSUES BEFORE DEPLOYING';
  log(`Status: ${status}`);
  log('='.repeat(60) + '\n');

  process.exit(allPass ? 0 : 1);
}

main();
