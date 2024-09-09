#!/usr/bin/env node

const { program } = require('commander');
const { init, scan } = require('./commands');

program
  .command('init')
  .description('Initialize DocAI in your project')
  .action(init);

program
  .command('scan')
  .description('Scan the codebase and update documentation')
  .action(scan);

program.parse(process.argv);