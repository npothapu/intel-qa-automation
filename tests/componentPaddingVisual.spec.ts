import { test, expect } from '@playwright/test';
import { breakpoints } from '../utils/breakpoints';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });

// 🔁 Update these environment variables in your `.env` file
const PAGE_URL = process.env.PAGE_URL;
const COMPONENT_SELECTOR = process.env.COMPONENT_SELECTOR;

if (!PAGE_URL || !COMPONENT_SELECTOR) {
  throw new Error('❌ Missing PAGE_URL or COMPONENT_SELECTOR in .env file');
}

test.beforeAll(async () => {
  const screenshotDir = path.resolve('component-actual');
  await fs.ensureDir(screenshotDir);
  await fs.emptyDir(screenshotDir);
  console.log(`📂 Cleaned screenshot folder: ${screenshotDir}`);
});

for (const [breakpointName, viewport] of Object.entries(breakpoints)) {
  test.describe(`${breakpointName} - Component Screenshot`, () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      test(`${browserType} - ${breakpointName}`, async ({ browser }, testInfo) => {
        const resolution = `${viewport.width}x${viewport.height}`;
        const testTitle = testInfo.title.replace(/\s+/g, '_');
        const fileName = `${testTitle}__${resolution}.png`;
        const screenshotPath = path.resolve('component-actual', browserType, breakpointName, fileName);

        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

        const component = page.locator(COMPONENT_SELECTOR);
        await expect(component).toBeVisible({ timeout: 10000 });

        await fs.ensureDir(path.dirname(screenshotPath));
        await component.screenshot({ path: screenshotPath });

        console.log(`✅ Screenshot saved: ${screenshotPath}`);
        await context.close();

        await testInfo.attach('Component Screenshot', {
          body: await fs.readFile(screenshotPath),
          contentType: 'image/png',
        });
      });
    }
  });
}
