// import { test } from '@playwright/test';
// import * as dotenv from 'dotenv';
// import * as path from 'path';
// import { validateComputedStyles } from '../utils/validateStyles';

// // Load the correct env file
// dotenv.config({ path: path.resolve(__dirname, '../env/dev.env') });

// // Read from environment
// const urlToTest = process.env.AEMCOMPONENT_URL;

// if (!urlToTest) {
//   throw new Error('❌ AEMCOMPONENT_URL is missing in your .env file');
// }

// test('Validate Hero Banner component styles', async ({ page }) => {
//   await page.goto(urlToTest);

//   const selector = '.hero-banner';
//   await validateComputedStyles(page, selector, {
//     'font-size': '32px',
//     'color': 'rgb(0, 0, 0)',
//     'margin-top': '48px',
//     'padding': '16px',
//     'font-weight': '700',
//   });
// });
