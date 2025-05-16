import { test, expect } from '@playwright/test';
import { breakpoints } from '../utils/breakpoints';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });

// Load from environment
const LOGIN_URL = process.env.LOGIN_URL;
const PUBLISH_URL = process.env.PUBLISH_URL;
const LOGIN_USERNAME = process.env.LOGIN_USERNAME;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
const COMPONENT_SELECTOR = process.env.COMPONENT_SELECTOR;

// Validate all required environment variables
if (!LOGIN_URL || !PUBLISH_URL || !LOGIN_USERNAME || !LOGIN_PASSWORD || !COMPONENT_SELECTOR) {
  throw new Error('❌ Missing one or more required environment variables in .env file');
}

// Clean screenshots only once before all tests
test.beforeAll(async () => {
  const screenshotDir = path.resolve('component-actual');
  await fs.ensureDir(screenshotDir);
  await fs.emptyDir(screenshotDir);
  console.log(`📂 Screenshot directory cleaned: ${screenshotDir}`);
});

// Run test per breakpoint and browser
for (const [breakpointName, viewport] of Object.entries(breakpoints)) {
  test.describe(`${breakpointName} - Component Screenshot with Login`, () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      test(`${browserType} - ${breakpointName}`, async ({ browser }, testInfo) => {
        const resolution = `${viewport.width}x${viewport.height}`;
        const testTitle = testInfo.title.replace(/\s+/g, '_');
        const fileName = `${testTitle}__${resolution}.png`;
        const screenshotPath = path.resolve('component-actual', browserType, breakpointName, fileName);

        const context = await browser.newContext({ viewport });
        const page = await context.newPage();

        // 🔐 Step 1: Login
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle' });
        await page.fill('input[name="j_username"]', LOGIN_USERNAME);
        await page.fill('input[name="j_password"]', LOGIN_PASSWORD);
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.click('button[type="submit"]'),
        ]);

        // 🧭 Step 2: Go to the publish page
        await page.goto(PUBLISH_URL, { waitUntil: 'networkidle' });

        // 🎯 Step 3: Locate and screenshot the component
        const component = page.locator(COMPONENT_SELECTOR);
        await expect(component).toBeVisible({ timeout: 10000 });

        await fs.ensureDir(path.dirname(screenshotPath));
        await component.screenshot({ path: screenshotPath });

        console.log(`✅ Screenshot saved: ${screenshotPath}`);
        await context.close();

        // 📎 Attach image to test result
        await testInfo.attach('Component Screenshot', {
          body: await fs.readFile(screenshotPath),
          contentType: 'image/png',
        });
      });
    }
  });
}
