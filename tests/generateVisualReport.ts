// import fs from 'fs-extra';
// import path from 'path';

// const rootDir = path.resolve('screenshots/actual');
// const outputHtml = path.resolve('report/visual-report.html');

// async function generateReport() {
//   const report: string[] = [];

//   report.push(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <title>Visual Screenshot Report</title>
//       <style>
//         body { font-family: sans-serif; padding: 20px; }
//         h2 { margin-top: 40px; }
//         img { border: 1px solid #ccc; margin: 5px; max-width: 300px; }
//         .group { margin-bottom: 30px; }
//       </style>
//     </head>
//     <body>
//       <h1>📸 Visual Regression Screenshot Report</h1>
//   `);

//   const browsers = await fs.readdir(rootDir);

//   for (const browser of browsers) {
//     const browserPath = path.join(rootDir, browser);
//     const breakpoints = await fs.readdir(browserPath);

//     for (const bp of breakpoints) {
//       const files = await fs.readdir(path.join(browserPath, bp));

//       report.push(`<div class="group"><h2>${browser.toUpperCase()} – ${bp}</h2>`);

//       for (const file of files) {
//         const relPath = path.relative(path.dirname(outputHtml), path.join(browserPath, bp, file)).replace(/\\/g, '/');
//         report.push(`
//           <div>
//             <p><strong>${file}</strong></p>
//             <a href="${relPath}" target="_blank">
//               <img src="${relPath}" alt="${file}" />
//             </a>
//           </div>
//         `);
//       }

//       report.push(`</div>`);
//     }
//   }

//   report.push('</body></html>');

//   await fs.ensureDir(path.dirname(outputHtml));
//   await fs.writeFile(outputHtml, report.join('\n'));

//   console.log(`✅ Visual report generated: ${outputHtml}`);
// }

// generateReport().catch(err => {
//   console.error('❌ Failed to generate report:', err);
// });
