import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('1. Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });

  // Wait a short moment for socket to establish
  await page.waitForTimeout(2000);

  // Check the Live indicator
  const liveText = await page.textContent('body');
  const hasLiveIndicator = await page.locator('text=Live').count();
  const hasReconnecting = await page.locator('text=Reconnecting').count();

  console.log(`Live indicator count: ${hasLiveIndicator}`);
  console.log(`Reconnecting count: ${hasReconnecting}`);

  await page.screenshot({ path: 'screenshots/verify_home_live.png' });

  // Now let's test switching persona to Entrepreneur
  console.log('2. Testing Demo Persona Switch to Entrepreneur ...');
  const demoBtn = page.locator('button:has-text("Demo Persona")');
  if (await demoBtn.count() > 0) {
    await demoBtn.click();
    await page.waitForTimeout(500);
    const entrepreneurBtn = page.locator('button:has-text("Entrepreneur")').first();
    if (await entrepreneurBtn.count() > 0) {
      await entrepreneurBtn.click();
      await page.waitForTimeout(2500);
      console.log('Current URL after persona switch:', page.url());
      const postSwitchLive = await page.locator('text=Live').count();
      const postSwitchReconn = await page.locator('text=Reconnecting').count();
      console.log(`Post-switch Live count: ${postSwitchLive}, Reconnecting count: ${postSwitchReconn}`);
      await page.screenshot({ path: 'screenshots/verify_entrepreneur_live.png' });
    }
  }

  // Now navigate to Department Queue
  console.log('3. Navigating to /department/queue ...');
  await page.goto('http://localhost:3000/department/queue', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  const deptLive = await page.locator('text=Live').count();
  const deptReconn = await page.locator('text=Reconnecting').count();
  console.log(`Dept Queue - Live count: ${deptLive}, Reconnecting count: ${deptReconn}`);
  await page.screenshot({ path: 'screenshots/verify_dept_live.png' });

  // Now navigate to Admin Command Center
  console.log('4. Navigating to /admin ...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  const adminLive = await page.locator('text=Live').count();
  const adminReconn = await page.locator('text=Reconnecting').count();
  console.log(`Admin Command Center - Live count: ${adminLive}, Reconnecting count: ${adminReconn}`);
  await page.screenshot({ path: 'screenshots/verify_admin_live.png' });

  console.log('\n--- Console Errors Recorded ---');
  console.log(consoleErrors.length === 0 ? 'None!' : consoleErrors.join('\n'));

  await browser.close();
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
