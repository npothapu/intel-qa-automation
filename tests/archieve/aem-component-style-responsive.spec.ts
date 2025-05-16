// import { test, expect } from '@playwright/test';
// import * as fs from 'fs-extra';
// import * as path from 'path';
// import * as dotenv from 'dotenv';
// import { breakpoints } from '../utils/breakpoints';
// import { validateComputedStyles } from '../utils/validateStyles';

// dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });

// const urlToTest = process.env.AEMCOMPONENT_URL;
// if (!urlToTest) throw new Error('❌ AEMCOMPONENT_URL is missing in your .env file');

// const reportDir = path.resolve(__dirname, '../playwright-report-aem');
// const logsDir = path.join(reportDir, 'logs');
// const screenshotsDir = path.join(reportDir, 'screenshots');

// fs.ensureDirSync(logsDir);
// fs.ensureDirSync(screenshotsDir);

// for (const [label, viewport] of Object.entries(breakpoints)) {
//   test.describe(`${label} viewport`, () => {
//     test(`Hero Banner style validation - ${label}`, async ({ page, browserName }) => {
//       await page.setViewportSize(viewport);
//       await page.goto(urlToTest);

//       const selector = '.hero-banner';
//       const logFile = path.join(logsDir, `${label}.txt`);
//       const screenshotFile = path.join(screenshotsDir, `${label}.png`);

//       let status = '✅ PASS';

//       try {
//         await validateComputedStyles(page, selector, {
//           'font-size': '32px',
//           'color': 'rgb(0, 0, 0)',
//           'margin-top': '48px',
//         });
//       } catch (error) {
//         status = '❌ FAIL';
//         fs.writeFileSync(logFile, `Error at ${label} (${browserName}):\n${error}\n`);
//       }

//       await page.locator(selector).screenshot({ path: screenshotFile });

//       fs.appendFileSync(logFile, `${status} - ${label} - ${JSON.stringify(viewport)}\n`);
//     });
//   });
// }
