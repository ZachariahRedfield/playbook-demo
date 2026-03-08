#!/usr/bin/env node

import { printUsage } from './lib/output.js';
import { listCommands, resolveCommandRunner } from './engine/command-registry.js';

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

const aliases = {
  status: 'verify',
  fix: 'apply'
};

const resolvedCommand = aliases[command] ?? command;
const runner = resolveCommandRunner(resolvedCommand);

if (!runner) {
  printUsage(listCommands());
  process.exit(command ? 1 : 0);
}

runner(options);
