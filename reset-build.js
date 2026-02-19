import fs from 'fs';
import path from 'path';

const dirs = [
  'node_modules',
  'dist',
  '.vite',
  '.cache'
];

console.log('[v0] Starting build cleanup...');

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`[v0] Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

console.log('[v0] Build cleanup complete!');
