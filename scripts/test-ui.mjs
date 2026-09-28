import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('./screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const ROUTES = [
  { name: 'landing', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'onboarding', path: '/entrepreneur/onboarding' },
  { name: 'checklist', path: '/entrepreneur/checklist' },
  { name: 'caf_new', path: '/applications/new' },
  { name: 'officer_queue', path: '/officer' },
  { name: 'admin_command', path: '/admin' },
  { name: 'design_system', path: '/design-system' },
  { name: 'schemes', path: '/entrepreneur/schemes' },
  { name: 'compliance', path: '/entrepreneur/compliance' },
  { name: 'grievance', path: '/entrepreneur/grievance' },
  { name: 'chat', path: '/entrepreneur/chat' },
  { name: 'track', path: '/track' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

async function run() {
  console.log(`🚀 Starting Playwright UI Suite against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    totalRoutes: ROUTES.length,
    passed: 0,
    failed: 0,
    errors: [],
    overflows: [],
    pageResults: [],
  };

  for (const route of ROUTES) {
    const fullUrl = `${BASE_URL}${route.path}`;
    const pageErrors = [];
    const consoleErrors = [];

    const onPageError = (err) => pageErrors.push(err.message || String(err));
    const onConsole = (msg) => {
      if (msg.type() === 'error') {
        // filter out benign hydration or favicon errors if any
        consoleErrors.push(msg.text());
      }
    };

    page.on('pageerror', onPageError);
    page.on('console', onConsole);

    try {
      console.log(`\n🔍 Inspecting [${route.name}] (${route.path})...`);
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = response ? response.status() : 0;
      await page.waitForTimeout(1000); // allow hydration & micro-animations

      // Check for horizontal overflow on desktop & mobile
      for (const vp of [VIEWPORTS[0], VIEWPORTS[3]]) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(300);

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        const hasOverflow = scrollWidth > clientWidth + 2;

        if (hasOverflow) {
          console.warn(`  ⚠️ Overflow detected on [${route.name}] at ${vp.name} (${clientWidth}px < ${scrollWidth}px)`);
          results.overflows.push({
            route: route.path,
            viewport: vp.name,
            clientWidth,
            scrollWidth,
          });
        }
      }

      // Take desktop screenshot
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(300);
      const screenshotPath = path.join(SCREENSHOT_DIR, `${route.name}_desktop.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      const isOk = status === 200 && pageErrors.length === 0;
      if (isOk) {
        results.passed++;
        console.log(`  ✅ Passed HTTP 200 (${pageErrors.length} runtime errs, ${consoleErrors.length} console errs)`);
      } else {
        results.failed++;
        console.error(`  ❌ Failed HTTP ${status} (Runtime Errors: ${pageErrors.length})`);
      }

      results.pageResults.push({
        name: route.name,
        path: route.path,
        status,
        pageErrors,
        consoleErrors,
        screenshot: screenshotPath,
      });

    } catch (err) {
      results.failed++;
      console.error(`  ❌ Navigation Error:`, err.message);
      results.errors.push({ route: route.path, error: err.message });
    } finally {
      page.off('pageerror', onPageError);
      page.off('console', onConsole);
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`📊 Playwright Run Completed: ${results.passed}/${results.totalRoutes} Passed`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Overflow Warnings: ${results.overflows.length}`);
  console.log('========================================\n');

  fs.writeFileSync('./playwright-report.json', JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error('Fatal error running playwright test:', err);
  process.exit(1);
});
