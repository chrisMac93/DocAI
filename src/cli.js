#!/usr/bin/env node

const { program } = require('commander');
const { init, scan } = require('./commands');

// Define the 'init' command to initialize DocAI
program
  .command('init')
  .description('Initialize DocAI in your project')
  .action(init);

// Define the 'scan' command to scan the codebase and update documentation
program
  .command('scan')
  .description('Scan the codebase and update documentation')
  .action(scan);

// Parse the command-line arguments
program.parse(process.argv);