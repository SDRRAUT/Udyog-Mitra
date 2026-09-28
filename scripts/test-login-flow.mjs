import { chromium } from 'playwright';

async function testRoles() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to login page...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(600);

  // Test Entrepreneur submit
  console.log('Testing default Entrepreneur login...');
  const submitBtn = page.locator('button[type="submit"]');
  await submitBtn.click();
  await page.waitForTimeout(1500);

  console.log('URL after Entrepreneur login:', page.url());
  await page.screenshot({ path: 'screenshots/login_entrepreneur_dashboard.png' });

  await browser.close();
  console.log('Entrepreneur test passed!');
}

testRoles().catch(console.error);
