#!/usr/bin/env node

import { runAnalyze } from './commands/analyze.js';
import { runApply } from './commands/apply.js';
import { runDiagram } from './commands/diagram.js';
import { runDoctor } from './commands/doctor.js';
import { runPlan } from './commands/plan.js';
import { runRules } from './commands/rules.js';
import { runVerify } from './commands/verify.js';
import { printUsage } from './lib/output.js';

const [, , command] = process.argv;

switch (command) {
  case 'analyze':
    runAnalyze();
    break;
  case 'plan':
    runPlan();
    break;
  case 'apply':
    runApply();
    break;
  case 'verify':
    runVerify();
    break;
  case 'doctor':
    runDoctor();
    break;
  case 'diagram':
    runDiagram();
    break;
  case 'rules':
    runRules();
    break;
  // Legacy aliases kept for backward compatibility with older demos.
  case 'status':
    runVerify();
    break;
  case 'explain':
    runPlan();
    break;
  case 'fix':
    runApply();
    break;
  default:
    printUsage();
    process.exit(command ? 1 : 0);
}
