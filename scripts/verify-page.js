#!/usr/bin/env node

const puppeteer = require('puppeteer');

const ROUTE_CHECKS = {
  '/how-it-works': {
    essentialCopy: [
      'How structural verification works',
      'FIXED METHODOLOGY',
      'WHAT THE FRAMEWORK EVALUATES',
    ],
  },
  '/': {
    essentialCopy: [
      'RunPayway',
      'Income Stability',
    ],
  },
};

async function detectPort() {
  const http = require('http');
  for (let port of [3000, 3001, 3002]) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (res) => {
          resolve(port);
        });
        req.on('error', reject);
        req.setTimeout(500);
      });
      return port;
    } catch {
      continue;
    }
  }
  return 3000; // fallback
}

async function verifyPage(route) {
  if (!route) {
    console.error('Usage: node scripts/verify-page.js <route>');
    console.error('Example: node scripts/verify-page.js /how-it-works');
    process.exit(1);
  }

  const config = ROUTE_CHECKS[route] || {
    essentialCopy: [],
  };

  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    const port = await detectPort();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    const url = `http://localhost:${port}${route}`;
    console.log(`\n→ Verifying: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });

    const checks = {
      passed: [],
      failed: [],
    };

    // Check header
    const hasHeader = await page.evaluate(() => !!document.querySelector('header'));
    if (hasHeader) {
      checks.passed.push('✓ Header present');
    } else {
      checks.failed.push('✗ Header missing');
    }

    // Check footer
    const hasFooter = await page.evaluate(() => !!document.querySelector('footer'));
    if (hasFooter) {
      checks.passed.push('✓ Footer present');
    } else {
      checks.failed.push('✗ Footer missing');
    }

    // Check navigation links
    const navLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('nav a')).map((a) => a.textContent.trim());
    });
    if (navLinks.length > 0) {
      checks.passed.push(`✓ Nav links present (${navLinks.length} found)`);
    } else {
      checks.failed.push('✗ Nav links missing');
    }

    // Check essential copy
    const pageText = await page.evaluate(() => document.body.innerText);
    for (const copy of config.essentialCopy) {
      if (pageText.includes(copy)) {
        checks.passed.push(`✓ Content: "${copy.substring(0, 35)}..."`);
      } else {
        checks.failed.push(`✗ Missing: "${copy}"`);
      }
    }

    // Report
    console.log('');
    checks.passed.forEach((m) => console.log(m));
    checks.failed.forEach((m) => console.log(m));

    const status = checks.failed.length === 0 ? '✓ PASS' : '✗ FAIL';
    console.log(`\n${status} (${checks.passed.length}/${checks.passed.length + checks.failed.length})\n`);

    await browser.close();
    process.exit(checks.failed.length === 0 ? 0 : 1);
  } catch (err) {
    console.error(`\n✗ Verification failed: ${err.message}\n`);
    await browser.close();
    process.exit(1);
  }
}

verifyPage(process.argv[2]);
