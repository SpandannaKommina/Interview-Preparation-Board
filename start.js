const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('       INTERVIEW PREPARATION BOARD - FULL-STACK PLATFORM       ');
console.log('================================================================');
console.log('Starting Backend Server on http://localhost:5000...');
console.log('Starting Vite Frontend on http://localhost:3000...');

const serverProc = spawn('node', ['src/index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

const clientProc = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '3000'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

function handleExit() {
  console.log('\nShutting down processes...');
  try { serverProc.kill(); } catch (e) {}
  try { clientProc.kill(); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
