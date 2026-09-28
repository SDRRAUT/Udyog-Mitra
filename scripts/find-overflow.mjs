import { chromium } from 'playwright';

async function findOverflow(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const overflows = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const results = [];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 2) {
        results.push({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          textSnippet: el.innerText ? el.innerText.slice(0, 40) : '',
        });
      }
    }
    return results.slice(0, 10);
  });

  console.log(`\n🔎 Overflowing elements on ${url} (viewport: 390px):`);
  console.dir(overflows, { depth: null });
  await browser.close();
}

async function run() {
  await findOverflow('http://localhost:3000/');
  await findOverflow('http://localhost:3000/entrepreneur/checklist');
}

run();
