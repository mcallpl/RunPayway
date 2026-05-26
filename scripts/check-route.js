#!/usr/bin/env node

const puppeteer = require('puppeteer');

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

async function checkRoute(route) {
  if (!route) {
    console.error('Usage: node scripts/check-route.js <route>');
    console.error('Example: node scripts/check-route.js /how-it-works');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    const port = await detectPort();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    const url = `http://localhost:${port}${route}`;
    console.log(`\n→ Checking: ${url}`);

    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });

    const statusCode = response.status();
    const pageTitle = await page.title();
    const hasContent = await page.evaluate(() => document.body.innerText.length > 100);

    console.log(`  Status: ${statusCode}`);
    console.log(`  Title: ${pageTitle}`);
    console.log(`  Content: ${hasContent ? '✓' : '✗'}`);

    const checks = {
      statusOk: statusCode >= 200 && statusCode < 300,
      hasTitle: pageTitle.length > 0,
      hasContent,
    };

    const allPass = Object.values(checks).every((v) => v);

    if (allPass) {
      console.log(`\n✓ Route is accessible\n`);
      await browser.close();
      process.exit(0);
    } else {
      console.log(`\n✗ Route check failed\n`);
      await browser.close();
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n✗ Error: ${err.message}\n`);
    await browser.close();
    process.exit(1);
  }
}

checkRoute(process.argv[2]);
