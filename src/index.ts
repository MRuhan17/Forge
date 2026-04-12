#!/usr/bin/env node
import { Command } from 'commander';
import React from 'react';
import { render } from 'ink';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import App from './App';
import { initDb, getDb } from './db/database';
import { startServer } from './api/server';

const program = new Command();

program
  .name('forge')
  .description('Forge - Developer CLI & TUI Platform')
  .version('1.0.0');

program.hook('preAction', () => {
  try {
    initDb();
  } catch (err: any) {
    console.error('Fatal error initializing database: ', err.message);
    process.exit(1);
  }
});

const startEngine = () => {
  const isWin = os.platform() === 'win32';
  const engineName = isWin ? 'forge-engine.exe' : 'forge-engine';
  
  // Requirement: use process.execPath for sidecar binary path
  const enginePath = path.join(
    path.dirname(process.execPath),
    engineName
  );

  console.log('Starting Forge Engine...');
  const child = spawn(enginePath, [], {
    detached: true,
    stdio: 'ignore'
  });

  child.on('error', () => {
    console.warn('Warning: Forge Engine binary not found or failed to start. Background tasks disabled.');
  });

  child.unref();
};

const startServerWithRetry = async (port: number) => {
  try {
    await startServer(port);
    console.log(`API Ready on port ${port}`);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} busy, retrying on ${port + 1}...`);
      await startServerWithRetry(port + 1);
    } else {
      console.error('Fatal: API server failed to start:', err.message);
      process.exit(1);
    }
  }
};

program
  .command('ui')
  .description('Launch the standard Terminal UI dashboard')
  .action(async () => {
    startEngine();
    console.log('Launching UI...');
    await startServerWithRetry(3001);
    render(React.createElement(App));
  });

program
  .command('projects')
  .description('List all projects (CLI mode)')
  .action(() => {
    const db = getDb();
    const projects = db.prepare('SELECT * FROM projects').all();
    console.log('Projects:');
    console.table(projects);
  });

if (process.argv.length === 2) {
  process.argv.push('ui');
}

program.parse(process.argv);
