const { chromium } = require('playwright');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
    console.error(err.stack);
  });
  page.on('requestfailed', req => {
    console.log(`REQUEST FAILED: ${req.url()} (${req.failure().errorText})`);
  });
  
  console.log('Navigating to http://localhost:8081 ...');
  await page.goto('http://localhost:8081');
  
  console.log('Waiting for 8 seconds for compilation and execution...');
  await page.waitForTimeout(8000);
  
  const content = await page.content();
  console.log('Page Title:', await page.title());
  console.log('HTML length:', content.length);
  
  const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML);
  console.log('Root HTML:', rootHTML);
  
  await browser.close();
  console.log('Browser closed.');
}

run().catch(err => {
  console.error('Runner error:', err);
});
