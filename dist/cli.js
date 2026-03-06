#!/usr/bin/env node

import { runAnalyze } from './commands/analyze.js';
import { runExplain } from './commands/explain.js';
import { runFix } from './commands/fix.js';
import { runStatus } from './commands/status.js';
import { runVerify } from './commands/verify.js';
import { printUsage } from './lib/output.js';

const [, , command] = process.argv;

switch (command) {
  case 'status':
    runStatus();
    break;
  case 'analyze':
    runAnalyze();
    break;
  case 'explain':
    runExplain();
    break;
  case 'fix':
    runFix();
    break;
  case 'verify':
    runVerify();
    break;
  default:
    printUsage();
    process.exit(command ? 1 : 0);
}
