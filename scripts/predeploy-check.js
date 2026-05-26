const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(cmd, description) {
  console.log(`\n→ ${description}`);
  try {
    const output = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`  ✓ ${description}`);
    return { success: true, output };
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    return { success: false, output: err.message };
  }
}

function checkPackageFiles() {
  console.log('\n→ Checking package files...');
  const requiredFiles = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
  ];

  const missing = [];
  requiredFiles.forEach((file) => {
    if (!fs.existsSync(path.join(__dirname, '..', file))) {
      missing.push(file);
    }
  });

  if (missing.length === 0) {
    console.log(`  ✓ All required package files present`);
    return true;
  } else {
    console.error(`  ✗ Missing files: ${missing.join(', ')}`);
    return false;
  }
}

function verifyBuild() {
  console.log('\n→ Verifying Next.js build...');
  const buildDir = path.join(__dirname, '..', '.next');
  if (fs.existsSync(buildDir)) {
    console.log(`  ✓ Build directory exists`);
    return true;
  } else {
    console.error(`  ✗ Build directory not found. Run: npm run build`);
    return false;
  }
}

async function predeploy() {
  console.log('='.repeat(60));
  console.log('PREDEPLOY CHECK');
  console.log('='.repeat(60));

  const checks = [
    () => checkPackageFiles(),
    () => runCommand('npm run build', 'Building project').success,
    () => verifyBuild(),
  ];

  const results = checks.map((check) => {
    try {
      return check();
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      return false;
    }
  });

  console.log('\n' + '='.repeat(60));
  const allPassed = results.every((r) => r === true);
  const status = allPassed ? 'READY FOR DEPLOYMENT' : 'DEPLOYMENT BLOCKED';
  console.log(`Status: ${status}`);
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

predeploy();
