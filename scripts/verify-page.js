const puppeteer = require('puppeteer');

const CHECKS = {
  '/how-it-works': {
    copy: [
      'How structural verification works',
      'FIXED METHODOLOGY',
      'WHAT THE FRAMEWORK EVALUATES',
      'Similar income does not always',
      'Verify the structural stability'
    ],
    nav: ['How It Works', 'Use Cases', 'Verification Environments', 'Learn', 'Methodology'],
    hasHeader: true,
    hasFooter: true,
  }
};

async function verifyPage(route) {
  const config = CHECKS[route];
  if (!config) {
    console.error(`No config for route: ${route}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  try {
    const url = `http://localhost:3000${route}`;
    console.log(`Verifying: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle2' });

    const results = {
      route,
      passed: [],
      failed: [],
    };

    // Check header
    if (config.hasHeader) {
      const hasHeader = await page.evaluate(() => !!document.querySelector('header'));
      if (hasHeader) {
        results.passed.push('✓ Header present');
      } else {
        results.failed.push('✗ Header missing');
      }
    }

    // Check footer
    if (config.hasFooter) {
      const hasFooter = await page.evaluate(() => !!document.querySelector('footer'));
      if (hasFooter) {
        results.passed.push('✓ Footer present');
      } else {
        results.failed.push('✗ Footer missing');
      }
    }

    // Check copy
    for (const text of config.copy) {
      const found = await page.evaluate((t) => document.body.innerText.includes(t), text);
      if (found) {
        results.passed.push(`✓ Copy: "${text.substring(0, 40)}..."`);
      } else {
        results.failed.push(`✗ Copy missing: "${text}"`);
      }
    }

    // Check nav links
    if (config.nav) {
      const navText = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('nav a')).map((a) => a.textContent.trim());
      });
      for (const navItem of config.nav) {
        if (navText.includes(navItem)) {
          results.passed.push(`✓ Nav: ${navItem}`);
        } else {
          results.failed.push(`✗ Nav missing: ${navItem}`);
        }
      }
    }

    // Report results
    console.log('\n' + '='.repeat(60));
    results.passed.forEach((msg) => console.log(msg));
    results.failed.forEach((msg) => console.log(msg));
    console.log('='.repeat(60));

    const status = results.failed.length === 0 ? 'PASS' : 'FAIL';
    console.log(`\nStatus: ${status} (${results.passed.length} passed, ${results.failed.length} failed)\n`);

    await browser.close();
    process.exit(results.failed.length === 0 ? 0 : 1);
  } catch (err) {
    console.error('Verification failed:', err.message);
    await browser.close();
    process.exit(1);
  }
}

verifyPage(process.argv[2] || '/how-it-works');
