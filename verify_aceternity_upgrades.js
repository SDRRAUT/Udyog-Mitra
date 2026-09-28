const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'screenshots', 'aceternity');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const artifactDir = 'C:\\Users\\rauts\\.gemini\\antigravity-ide\\brain\\22c96e59-58b9-469b-afab-14d14c61500f';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Testing Home Page (Landing with AnimatedTooltip and CardSpotlight)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '01_home_landing_desktop.png'), fullPage: false });

  console.log('Setting auth state for protected routes...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('udyog-marg-auth', JSON.stringify({
      state: {
        user: {
          id: 'usr-entrepreneur-1',
          name: 'Rahul Patil',
          role: 'ENTREPRENEUR',
          email: 'entrepreneur.demo@mahsetu.in',
        },
        accessToken: 'demo-token-2026',
        isAuthenticated: true,
      },
      version: 0,
    }));
  });

  console.log('Testing Officer Queue (with Aceternity AnimatedTabs filter pill)...');
  await page.goto('http://localhost:3000/officer', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '02_officer_animated_tabs.png'), fullPage: false });

  // Test clicking tabs on Officer queue
  const atRiskTab = page.locator('button:has-text("At Risk")');
  if (await atRiskTab.isVisible()) {
    await atRiskTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '03_officer_at_risk_active.png'), fullPage: false });
  }

  console.log('Testing Application Detail Page (with AnimatedTabs, CardSpotlight, and TracingTimeline)...');
  await page.goto('http://localhost:3000/entrepreneur/application/app-2026-0042', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '04_app_detail_overview.png'), fullPage: false });

  // Switch to Timeline Tab to verify TracingTimeline
  const timelineTab = page.locator('button:has-text("Statutory Event Timeline")');
  if (await timelineTab.isVisible()) {
    await timelineTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '05_app_detail_tracing_timeline.png'), fullPage: false });
  }

  console.log('Testing Admin Command Center (with StatCards spotlight and Escalation Register)...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '06_admin_command_center.png'), fullPage: false });

  console.log('Testing Citizen Dashboard (with StatCards spotlight & parallel tracks)...');
  await page.goto('http://localhost:3000/entrepreneur', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '07_entrepreneur_dashboard.png'), fullPage: false });

  console.log('Testing Approval Roadmap Checklist (with AnimatedTabs & Benchmark Spotlight)...');
  await page.goto('http://localhost:3000/entrepreneur/checklist', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '08_checklist_roadmap.png'), fullPage: false });

  // Switch to Dependency Graph
  const graphTab = page.locator('button:has-text("Dependency Graph")');
  if (await graphTab.isVisible()) {
    await graphTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '09_checklist_graph_view.png'), fullPage: false });
  }

  console.log('Testing Onboarding Wizard (with architectural DotPattern modal background)...');
  await page.goto('http://localhost:3000/entrepreneur/onboarding', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '10_onboarding_dot_pattern.png'), fullPage: false });

  // Mobile testing
  console.log('Testing Mobile Viewport (390px)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await mobilePage.evaluate(() => {
    localStorage.setItem('udyog-marg-auth', JSON.stringify({
      state: {
        user: {
          id: 'usr-entrepreneur-1',
          name: 'Rahul Patil',
          role: 'ENTREPRENEUR',
          email: 'entrepreneur.demo@mahsetu.in',
        },
        accessToken: 'demo-token-2026',
        isAuthenticated: true,
      },
      version: 0,
    }));
  });

  await mobilePage.goto('http://localhost:3000/entrepreneur/application/app-2026-0042', { waitUntil: 'networkidle' });
  const mobTimelineTab = mobilePage.locator('button:has-text("Statutory Event Timeline")');
  if (await mobTimelineTab.isVisible()) {
    await mobTimelineTab.click();
    await mobilePage.waitForTimeout(600);
  }
  await mobilePage.screenshot({ path: path.join(outDir, '11_mobile_tracing_timeline.png'), fullPage: false });

  await mobilePage.goto('http://localhost:3000/officer', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(outDir, '12_mobile_officer_queue.png'), fullPage: false });

  await browser.close();

  // Copy screenshots to artifacts directory for markdown embedding
  const artifactScreenshotsDir = path.join(artifactDir, 'screenshots');
  if (!fs.existsSync(artifactScreenshotsDir)) {
    fs.mkdirSync(artifactScreenshotsDir, { recursive: true });
  }

  const files = fs.readdirSync(outDir);
  for (const f of files) {
    fs.copyFileSync(path.join(outDir, f), path.join(artifactScreenshotsDir, f));
  }

  console.log('Playwright audit completed successfully! Captured ' + files.length + ' screenshots.');
  console.log('Console Errors caught: ' + consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  }
}

run().catch((e) => {
  console.error('Playwright verification failed:', e);
  process.exit(1);
});
