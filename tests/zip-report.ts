import * as path from 'path';
import * as fs from 'fs';
import archiver from 'archiver';

const outputPath = path.resolve(__dirname, '../playwright-report-aem.zip');
const reportDir = path.resolve(__dirname, '../playwright-report-aem');

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✅ Zipped report ready: ${outputPath} (${archive.pointer()} bytes)`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(reportDir, false);
archive.finalize();
