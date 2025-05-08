"use strict";
// import fs from 'fs-extra';
// import path from 'path';
// import pixelmatch from 'pixelmatch';
// import { PNG } from 'pngjs';
// const browsers = ['chromium', 'firefox', 'webkit'];
// const breakpoints = ['desktop', 'tablet', 'mobile'];
// const pageName = 'home'; // Or dynamically read based on test file structure
// const baselineDir = 'screenshots/baseline';
// const actualDir = 'screenshots/actual';
// const diffDir = 'screenshots/diff';
// async function compareScreenshots() {
//   let totalDiffs = 0;
//   for (const browser of browsers) {
//     for (const bp of breakpoints) {
//       const baselinePath = path.resolve(baselineDir, browser, bp, `${pageName}.png`);
//       const actualPath = path.resolve(actualDir, browser, bp, `${pageName}.png`);
//       const diffPath = path.resolve(diffDir, browser, bp, `${pageName}.png`);
//       if (!(await fs.pathExists(baselinePath)) || !(await fs.pathExists(actualPath))) {
//         console.warn(`Skipping ${browser} / ${bp} – missing baseline or actual image.`);
//         continue;
//       }
//       await fs.ensureDir(path.dirname(diffPath));
//       const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
//       const actualImg = PNG.sync.read(fs.readFileSync(actualPath));
//       const { width, height } = baselineImg;
//       const diff = new PNG({ width, height });
//       const mismatch = pixelmatch(
//         baselineImg.data,
//         actualImg.data,
//         diff.data,
//         width,
//         height,
//         { threshold: 0.1 }
//       );
//       fs.writeFileSync(diffPath, PNG.sync.write(diff));
//       if (mismatch > 0) {
//         totalDiffs++;
//         console.log(`🔴 Diff found: ${browser}/${bp}/${pageName}.png → ${mismatch} pixels differ`);
//       } else {
//         console.log(`✅ No visual diff: ${browser}/${bp}/${pageName}.png`);
//         await fs.remove(diffPath); // Clean up if no diff
//       }
//     }
//   }
//   console.log(`\n🧾 Visual comparison complete. Total differences: ${totalDiffs}`);
// }
// compareScreenshots().catch(err => {
//   console.error('Error comparing screenshots:', err);
//   process.exit(1);
// });
