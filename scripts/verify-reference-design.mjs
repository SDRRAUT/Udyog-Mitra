import { chromium } from 'playwright';

async function verifyDesign() {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop 1440x900
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Capture viewport and full page
  await page.screenshot({ path: 'screenshots/reference_design_desktop_hero.png' });
  await page.screenshot({ path: 'screenshots/reference_design_desktop_full.png', fullPage: true });

  // Mobile 390x844
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'screenshots/reference_design_mobile_hero.png' });
  await mobilePage.screenshot({ path: 'screenshots/reference_design_mobile_full.png', fullPage: true });

  console.log('Console Errors:', consoleErrors.length === 0 ? 'None!' : consoleErrors);
  console.log('Screenshots saved successfully!');

  await browser.close();
}

verifyDesign().catch(console.error);
