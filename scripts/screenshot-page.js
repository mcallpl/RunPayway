#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

async function screenshotPage(route) {
  if (!route) {
    console.error('Usage: node scripts/screenshot-page.js <route>');
    console.error('Example: node scripts/screenshot-page.js /how-it-works');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    const port = await detectPort();
    const screenshotDir = '/tmp/runpayway-screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const url = `http://localhost:${port}${route}`;
    const date = new Date().toISOString().split('T')[0];
    const routeName = route === '/' ? 'home' : route.replace(/\//g, '-').substring(1);

    console.log(`\n→ Capturing screenshots for: ${url}\n`);

    // Desktop
    console.log('  → Desktop (1200x800)');
    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1200, height: 800 });
    await desktopPage.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    const desktopPath = path.join(screenshotDir, `${routeName}-desktop-${date}.png`);
    await desktopPage.screenshot({ path: desktopPath, fullPage: true });
    console.log(`     Saved: ${desktopPath}`);
    await desktopPage.close();

    // Mobile
    console.log('  → Mobile (375x812)');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 812 });
    await mobilePage.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    const mobilePath = path.join(screenshotDir, `${routeName}-mobile-${date}.png`);
    await mobilePage.screenshot({ path: mobilePath, fullPage: true });
    console.log(`     Saved: ${mobilePath}`);
    await mobilePage.close();

    console.log('\n✓ Screenshots captured\n');

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error(`\n✗ Screenshot failed: ${err.message}\n`);
    await browser.close();
    process.exit(1);
  }
}

screenshotPage(process.argv[2]);
