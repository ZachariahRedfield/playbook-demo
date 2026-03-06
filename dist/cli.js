#!/usr/bin/env node

import { runAnalyze } from './commands/analyze.js';
import { runApply } from './commands/apply.js';
import { runDiagram } from './commands/diagram.js';
import { runDoctor } from './commands/doctor.js';
import { runExplain } from './commands/explain.js';
import { runIndex } from './commands/index.js';
import { runPlan } from './commands/plan.js';
import { runRules } from './commands/rules.js';
import { runVerify } from './commands/verify.js';
import { printUsage } from './lib/output.js';

const [, , command, ...rest] = process.argv;
const flags = new Set(rest.filter((arg) => arg.startsWith('--')));
const positional = rest.filter((arg) => !arg.startsWith('--'));

function getOption(flagName) {
  const flagIndex = rest.indexOf(flagName);
  if (flagIndex === -1) {
    return undefined;
  }

  return rest[flagIndex + 1];
}

const options = {
  json: flags.has('--json'),
  repo: getOption('--repo') ?? '.',
  out: getOption('--out'),
  target: positional[0]
};

switch (command) {
  case 'analyze':
    runAnalyze();
    break;
  case 'index':
    runIndex({ json: options.json });
    break;
  case 'explain':
    runExplain({ target: options.target, json: options.json });
    break;
  case 'plan':
    runPlan({ json: options.json });
    break;
  case 'apply':
    runApply({ json: options.json });
    break;
  case 'verify':
    runVerify({ json: options.json });
    break;
  case 'doctor':
    runDoctor();
    break;
  case 'diagram':
    runDiagram({ repo: options.repo, out: options.out, json: options.json });
    break;
  case 'rules':
    runRules({ json: options.json });
    break;
  // Legacy aliases kept for backward compatibility with older demos.
  case 'status':
    runVerify({ json: options.json });
    break;
  case 'fix':
    runApply({ json: options.json });
    break;
  default:
    printUsage();
    process.exit(command ? 1 : 0);
}
