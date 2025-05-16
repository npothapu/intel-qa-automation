import { test, expect } from '@playwright/test';
import { breakpoints } from '../utils/breakpoints';
import { captureFullScreenshot } from '../utils/screenshotHelper';
import * as path from 'path';
import * as fs from 'fs-extra';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import * as dotenv from 'dotenv';
import AdmZip from 'adm-zip';

dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });

const urlToTest = process.env.BASE_URL;

if (!urlToTest) {
  throw new Error('❌ BASE_URL is missing in your .env file');
}

type SummaryEntry = {
  test: string;
  resolution: string;
  browser: string;
  result: string;
  diffPixels: number;
  breakpoint: string;
};

const summary: SummaryEntry[] = [];

// 🧹 Clean directories before test execution
test.beforeAll(async () => {
  const foldersToClean = [
    path.resolve('screenshots/actual'),
    path.resolve('screenshots/diff'),
    path.resolve('report'),
  ];

  for (const folder of foldersToClean) {
    if (await fs.pathExists(folder)) {
      await fs.emptyDir(folder);
      console.log(`🧹 Cleared: ${folder}`);
    } else {
      await fs.ensureDir(folder);
    }
  }
});

for (const [breakpointName, viewport] of Object.entries(breakpoints)) {
  test.describe(`${breakpointName} viewport`, () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      test(`${browserType} - ${breakpointName}`, async ({ browser }, testInfo) => {
        const resolution = `${viewport.width}x${viewport.height}`;
        const testTitle = testInfo.title.replace(/\s+/g, '_');
        const screenshotFileName = `${testTitle}__${resolution}.png`;

        const actualPath = path.resolve('screenshots/actual', browserType, breakpointName, screenshotFileName);
        const baselinePath = path.resolve('screenshots/baseline', browserType, breakpointName, screenshotFileName);
        const diffPath = path.resolve('screenshots/diff', browserType, breakpointName, screenshotFileName);

        await fs.ensureDir(path.dirname(actualPath));
        await fs.ensureDir(path.dirname(baselinePath));
        await fs.ensureDir(path.dirname(diffPath));

        await captureFullScreenshot(browser, browserType, urlToTest, viewport, actualPath);

        if (!fs.existsSync(baselinePath)) {
          await fs.copy(actualPath, baselinePath);
          console.warn(`ℹ️ Created baseline from actual: ${baselinePath}`);
        }

        const baseline = PNG.sync.read(await fs.readFile(baselinePath));
        const actual = PNG.sync.read(await fs.readFile(actualPath));
        const { width, height } = actual;
        const diff = new PNG({ width, height });

        const diffPixels = pixelmatch(baseline.data, actual.data, diff.data, width, height, { threshold: 0.1 });
        await fs.writeFile(diffPath, PNG.sync.write(diff));

        await testInfo.attach('Baseline Image', {
          body: await fs.readFile(baselinePath),
          contentType: 'image/png',
        });
        await testInfo.attach('Actual Image', {
          body: await fs.readFile(actualPath),
          contentType: 'image/png',
        });
        await testInfo.attach('Diff Image', {
          body: await fs.readFile(diffPath),
          contentType: 'image/png',
        });

        summary.push({
          test: testTitle,
          resolution,
          browser: browserType,
          result: diffPixels === 0 ? '✅ Pass' : '❌ Fail',
          diffPixels,
          breakpoint: breakpointName,
        });

        if (diffPixels > 0) {
          testInfo.annotations.push({
            type: 'warning',
            description: `🟡 Visual mismatch: ${diffPixels} pixels differ.`,
          });
        }
      });
    }
  });
}

// 📄 Generate embedded HTML + 📦 ZIP
test.afterAll(async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFolder = path.resolve('report');
  const reportHtmlPath = path.join(reportFolder, `visual-report-${timestamp}.html`);
  const zipPath = path.join(reportFolder, `visual-report-${timestamp}.zip`);

  await fs.ensureDir(reportFolder);

  const rows = await Promise.all(summary.map(async (entry) => {
    const fileName = `${entry.test}__${entry.resolution}.png`;
    const getBase64 = async (type: string) => {
      const imagePath = path.resolve('screenshots', type, entry.browser, entry.breakpoint, fileName);
      const buffer = await fs.readFile(imagePath);
      return `data:image/png;base64,${buffer.toString('base64')}`;
    };

    const baselineImg = await getBase64('baseline');
    const actualImg = await getBase64('actual');
    const diffImg = await getBase64('diff');

    return `
      <tr>
        <td>${entry.test}</td>
        <td>${entry.resolution}</td>
        <td>${entry.browser}</td>
        <td>${entry.result}</td>
        <td>${entry.diffPixels}</td>
        <td><img src="${baselineImg}" width="200"/></td>
        <td><img src="${actualImg}" width="200"/></td>
        <td><img src="${diffImg}" width="200"/></td>
      </tr>`;
  }));

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Visual Regression Report</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f5f5f5; }
        img { border: 1px solid #aaa; }
      </style>
    </head>
    <body>
      <h2>📊 Visual Regression Summary Report</h2>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Resolution</th>
            <th>Browser</th>
            <th>Result</th>
            <th>Pixel Diff</th>
            <th>Baseline</th>
            <th>Actual</th>
            <th>Diff</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join('\n')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  await fs.writeFile(reportHtmlPath, html);
  console.log(`✅ HTML report generated: ${reportHtmlPath}`);

  const zip = new AdmZip();
  zip.addLocalFile(reportHtmlPath);
  zip.writeZip(zipPath);
  console.log(`📦 Zipped report ready to attach to JIRA: ${zipPath}`);
});
