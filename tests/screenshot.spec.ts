import { test } from '@playwright/test';
import { breakpoints } from '@utils/breakpoints';
import { captureFullScreenshot } from '@utils/screenshotHelper';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });

const urlToTest = process.env.BASE_URL;

if (!urlToTest) {
  throw new Error('❌ BASE_URL is missing in your .env file');
}

for (const [breakpointName, viewport] of Object.entries(breakpoints)) {
  test.describe(`${breakpointName} viewport`, () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      test(`${browserType} - ${breakpointName}`, async ({ browser }, testInfo) => {
        const resolution = `${viewport.width}x${viewport.height}`;
        const testTitle = testInfo.title.replace(/\s+/g, '_'); // unique and clean

        const screenshotFileName = `${testTitle}__${resolution}.png`;

        const screenshotPath = path.resolve(
          'screenshots/actual',
          browserType,
          breakpointName,
          screenshotFileName
        );

        await captureFullScreenshot(browser, browserType, urlToTest, viewport, screenshotPath);
      });
    }
  });
}
