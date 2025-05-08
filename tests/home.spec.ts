import { test } from '@playwright/test';
import { breakpoints } from '@utils/breakpoints';

import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from env/dev.env
dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });

const BASE_URL = `${process.env.BASE_URL}`;

const pageName = 'home'; // Customize per spec or parameterize

for (const [label, viewport] of Object.entries(breakpoints)) {
  test(`${pageName} renders correctly at ${label}`, async ({ browserName, browser }) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    if (!BASE_URL) {
        throw new Error('Missing BASE_URL in environment variables.');
      }
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const screenshotPath = `screenshots/actual/${browserName}/${label}/${pageName}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await context.close();
  });
}
