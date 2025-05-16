import { test, expect } from '@playwright/test';
import { breakpoints } from '../utils/breakpoints';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as dotenv from 'dotenv';

// 🔧 Choose 'dev.env' (with login) or 'public.env' (no login)
const ENV_FILE = 'public.env';

dotenv.config({ path: path.resolve(__dirname, `../env/${ENV_FILE}`) });

const LOGIN_URL = process.env.LOGIN_URL;
const LOGIN_USERNAME = process.env.LOGIN_USERNAME;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
const PUBLISH_URL = process.env.PUBLISH_URL;
const COMPONENT_SELECTOR = process.env.COMPONENT_SELECTOR;

if (!PUBLISH_URL || !COMPONENT_SELECTOR) {
  throw new Error('❌ Missing required PUBLISH_URL or COMPONENT_SELECTOR in .env file');
}

test.beforeAll(async () => {
  const screenshotDir = path.resolve('component-actual');
  await fs.ensureDir(screenshotDir);
  await fs.emptyDir(screenshotDir);
  console.log(`📂 Screenshot directory cleaned: ${screenshotDir}`);
});

for (const [breakpointName, viewport] of Object.entries(breakpoints)) {
  test.describe(`${breakpointName} - Component Screenshot`, () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      test(`${browserType} - ${breakpointName}`, async ({ browser }, testInfo) => {
        const resolution = `${viewport.width}x${viewport.height}`;
        const testTitle = testInfo.title.replace(/\s+/g, '_');
        const fileName = `${testTitle}__${resolution}.png`;

        const screenshotPath = path.resolve('component-actual', browserType, breakpointName, fileName);
        const styleInfoPath = screenshotPath.replace('.png', '.json');
        const errorScreenshotPath = screenshotPath.replace('.png', '_error.png');

        const context = await browser.newContext({ viewport });
        const page = await context.newPage();

        try {
          // 🔐 Login if provided
          if (LOGIN_URL && LOGIN_USERNAME && LOGIN_PASSWORD) {
            console.log(`🔐 Logging in via ${LOGIN_URL}`);
            await page.goto(LOGIN_URL, { waitUntil: 'networkidle' });
            await page.fill('input[name="j_username"]', LOGIN_USERNAME);
            await page.fill('input[name="j_password"]', LOGIN_PASSWORD);
            await Promise.all([
              page.waitForNavigation({ waitUntil: 'networkidle' }),
              page.click('button[type="submit"]'),
            ]);
            console.log('✅ Login successful');
          }

          // 🧭 Navigate to publish page
          await page.goto(PUBLISH_URL, { waitUntil: 'networkidle' });
          console.log(`🌐 Navigated to ${PUBLISH_URL}`);

          // 🎯 Prepare and style component
          const styleInfo = await page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (!el) return null;

            // Visualize layout
            el.style.outline = '2px dashed red';
            el.style.backgroundColor = 'rgba(255, 0, 0, 0.03)';

            const computed = window.getComputedStyle(el);
            return {
              paddingTop: computed.paddingTop,
              paddingRight: computed.paddingRight,
              paddingBottom: computed.paddingBottom,
              paddingLeft: computed.paddingLeft,
              marginTop: computed.marginTop,
              marginRight: computed.marginRight,
              marginBottom: computed.marginBottom,
              marginLeft: computed.marginLeft,
              fontSize: computed.fontSize,
              fontWeight: computed.fontWeight,
              lineHeight: computed.lineHeight,
              display: computed.display,
              width: computed.width,
              height: computed.height
            };
          }, COMPONENT_SELECTOR);

          if (!styleInfo) {
            throw new Error(`❌ Could not find component with selector: ${COMPONENT_SELECTOR}`);
          }

          console.log(`📐 Extracted styles:`, styleInfo);

          // Save styles as JSON
          await fs.outputJson(styleInfoPath, styleInfo);

          // Capture screenshot
          const component = page.locator(COMPONENT_SELECTOR);
          await expect(component).toBeVisible({ timeout: 10000 });

          await fs.ensureDir(path.dirname(screenshotPath));
          await component.screenshot({ path: screenshotPath });

          console.log(`📸 Screenshot saved: ${screenshotPath}`);
          console.log(`📝 Style JSON saved: ${styleInfoPath}`);

          // Attach both to test report
          await testInfo.attach('Component Screenshot', {
            body: await fs.readFile(screenshotPath),
            contentType: 'image/png',
          });

          await testInfo.attach('Component Styles (JSON)', {
            body: Buffer.from(JSON.stringify(styleInfo, null, 2), 'utf-8'),
            contentType: 'application/json',
          });

        } catch (err) {
          console.error(`❌ Error during validation. Saving full-page screenshot...`);
          await fs.ensureDir(path.dirname(errorScreenshotPath));
          await page.screenshot({ path: errorScreenshotPath, fullPage: true });
          console.error(err);
        } finally {
          await context.close();
        }
      });
    }
  });
}
