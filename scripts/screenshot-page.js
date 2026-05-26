const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function screenshotPage(route) {
  if (!route) {
    console.error('Usage: node screenshot-page.js <route>');
    console.error('Example: node screenshot-page.js /how-it-works');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    const screenshotDir = '/tmp/runpayway-screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const url = `http://localhost:3000${route}`;
    const timestamp = new Date().toISOString().split('T')[0];
    const routeName = route.replace(/\//g, '-').substring(1);

    console.log(`Capturing screenshots for: ${url}`);

    // Desktop screenshot
    console.log('  → Desktop (1200x800)...');
    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1200, height: 800 });
    await desktopPage.goto(url, { waitUntil: 'networkidle2' });
    const desktopPath = path.join(screenshotDir, `${routeName}-desktop-${timestamp}.png`);
    await desktopPage.screenshot({ path: desktopPath, fullPage: true });
    console.log(`     Saved: ${desktopPath}`);
    await desktopPage.close();

    // Mobile screenshot
    console.log('  → Mobile (375x812)...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 812 });
    await mobilePage.goto(url, { waitUntil: 'networkidle2' });
    const mobilePath = path.join(screenshotDir, `${routeName}-mobile-${timestamp}.png`);
    await mobilePage.screenshot({ path: mobilePath, fullPage: true });
    console.log(`     Saved: ${mobilePath}`);
    await mobilePage.close();

    console.log('\n✓ Screenshots captured successfully\n');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Screenshot failed:', err.message);
    await browser.close();
    process.exit(1);
  }
}

screenshotPage(process.argv[2]);
