const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');

const landing = path.resolve(__dirname, '..');
const lms = process.env.LMS_PROJECT_DIR || 'H:\\Kish\\Project 5 Krish\\react-template-main';
const children = [];
let stopping = false;

function stop() {
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

async function start(name, directory, port) {
  const next = path.join(directory, 'node_modules/next/dist/bin/next');
  if (!fs.existsSync(next)) throw new Error(`${name} dependencies not found in ${directory}.`);
  try {
    await fetch(`http://localhost:${port}`, { redirect: 'manual', signal: AbortSignal.timeout(3000) });
    console.log(`${name} already running: http://localhost:${port}`);
    return;
  } catch {
    const env = { ...process.env, NODE_ENV: 'development' };
    delete env.NEXT_BUILD_DIR;
    const child = spawn(process.execPath, [next, 'dev', '--port', String(port)], {
      cwd: directory, env, stdio: 'inherit', windowsHide: true,
    });
    children.push(child);
    child.on('error', error => { console.error(`${name}: ${error.message}`); process.exitCode = 1; });
    child.on('exit', code => {
      if (!stopping) {
        console.error(`${name} stopped (exit ${code}). Run npm run dev:connected to restart.`);
        process.exitCode = code || 1;
      }
    });
  }
}

(async () => {
  await start('Landing page', landing, 3000);
  await start('LMS', lms, 3001);
  console.log('Login page: http://localhost:3000/#login');
  console.log('Keep this command running while using the local site.');
})().catch(error => { console.error(error.message); stop(); process.exitCode = 1; });
