#!/usr/bin/env node

/**
 * Development Server with Autonomous Validation
 *
 * Starts both:
 * 1. Next.js dev server (with network monitoring)
 * 2. File watcher (with automatic validations)
 *
 * This is your new `npm run dev` - it does everything automatically!
 */

const { spawn } = require('child_process');
const path = require('path');

console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  🚀 Starting Self-Healing Development Environment                            ║
║                                                                               ║
║  ✅ Network monitoring - automatic in browser                                ║
║  ✅ File watcher - validates changes automatically                           ║
║  ✅ Schema validator - runs when migrations change                           ║
║  ✅ API checker - validates routes when they change                          ║
║  ✅ Component checker - validates React best practices                       ║
║  ✅ Next.js error detection - catches hydration & DOM issues                 ║
║                                                                               ║
║  You code, we validate! 🎯                                                   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);

// Start Next.js dev server
console.log('🚀 Starting Next.js dev server...\n');
const nextDev = spawn('npm', ['run', 'dev:next'], {
  stdio: 'inherit',
  shell: true,
});

// Give Next.js a moment to start, then start watcher
setTimeout(() => {
  console.log('\n🔍 Starting file watcher...\n');
  const watcher = spawn('node', ['scripts/dev-watcher.js'], {
    stdio: 'inherit',
    shell: true,
  });

  watcher.on('error', (err) => {
    console.error('❌ File watcher error:', err);
  });

  watcher.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`\n⚠️  File watcher exited with code ${code}`);
    }
  });
}, 2000);

nextDev.on('error', (err) => {
  console.error('❌ Next.js dev server error:', err);
  process.exit(1);
});

nextDev.on('exit', (code) => {
  console.log('\n🛑 Next.js dev server stopped');
  process.exit(code || 0);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down development environment...\n');
  nextDev.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down development environment...\n');
  nextDev.kill('SIGTERM');
  process.exit(0);
});
