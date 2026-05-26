const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:3000/how-it-works', { waitUntil: 'networkidle2' });

  const hasHeader = await page.evaluate(() => {
    return document.querySelector('header') !== null;
  });

  const navText = await page.evaluate(() => {
    const nav = Array.from(document.querySelectorAll('nav a')).map(a => a.textContent);
    return nav;
  });

  console.log('Header present:', hasHeader);
  console.log('Nav items:', navText);

  await page.screenshot({ path: '/tmp/with-header.png' });
  console.log('Screenshot saved');
  await browser.close();
})();
