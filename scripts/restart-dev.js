import { exec } from 'child_process';
import { rmSync } from 'fs';

console.log('Killing existing Vite processes...');
exec('pkill -f "vite"', (err) => {
  if (err && err.code !== 1) {
    console.log('No processes to kill');
  }
  
  try {
    console.log('Cleaning Vite cache...');
    rmSync('node_modules/.vite', { recursive: true, force: true });
  } catch (e) {
    console.log('Cache already clean');
  }
  
  console.log('Starting dev server...');
  exec('pnpm dev', (err, stdout, stderr) => {
    if (err) console.error(err);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  });
});
