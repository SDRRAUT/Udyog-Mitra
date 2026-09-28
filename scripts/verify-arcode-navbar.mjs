import { chromium } from 'playwright';

async function testNavbar() {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/arcode_navbar_desktop.png' });

  // Mobile
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'screenshots/arcode_navbar_mobile.png' });

  // Mobile Open Menu
  const toggleBtn = mobilePage.locator('button[aria-label="Toggle menu"]');
  if (await toggleBtn.count() > 0) {
    await toggleBtn.click();
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: 'screenshots/arcode_navbar_mobile_open.png' });
  }

  await browser.close();
  console.log('Arcode navbar screenshots captured successfully!');
}

testNavbar().catch(console.error);
