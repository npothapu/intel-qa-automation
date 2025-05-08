import { Browser, Page, BrowserContext } from '@playwright/test';
import fs from 'fs-extra';
import path from 'path';

/**
 * Captures a full-page screenshot across all browsers.
 * Chromium uses custom scrollHeight resizing for reliable full capture.
 */
export async function captureFullScreenshot(
  browser: Browser,
  browserName: string,
  url: string,
  viewport: { width: number; height: number },
  screenshotPath: string
) {
  if (browserName === 'chromium') {
    // Open initial page to calculate scroll height
    const tmpContext = await browser.newContext({ viewport });
    const tmpPage = await tmpContext.newPage();
    await tmpPage.goto(url, { waitUntil: 'networkidle' });

    const scrollHeight = await tmpPage.evaluate(() => document.body.scrollHeight);
    await tmpContext.close();

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: scrollHeight },
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    await fs.ensureDir(path.dirname(screenshotPath));
    await page.screenshot({ path: screenshotPath });

    await context.close();
  } else {
    // For Firefox and WebKit: use fullPage true
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await fs.ensureDir(path.dirname(screenshotPath));
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await context.close();
  }
}
