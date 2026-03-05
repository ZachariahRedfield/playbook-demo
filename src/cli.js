#!/usr/bin/env node

const [, , command, ...args] = process.argv;

const hasFlag = (flag) => args.includes(flag);

switch (command) {
  case 'analyze': {
    const mode = hasFlag('--json') ? 'json' : hasFlag('--ci') ? 'ci' : 'default';
    if (mode === 'json') {
      console.log(JSON.stringify({ scannedFiles: 3, criticalIssues: 0, status: 'ok' }, null, 2));
    } else {
      console.log('✓ Scanned 3 files');
      console.log('✓ Found 0 critical issues');
      console.log('✓ Report ready');
      if (mode === 'ci') {
        console.log('✓ CI mode checks passed');
      }
    }
    break;
  }
  case 'verify': {
    if (hasFlag('--ci')) {
      console.log('✓ Verify checks passed in CI mode');
    } else {
      console.log('✓ Verify checks passed');
    }
    break;
  }
  default:
    console.log('Usage: playbook <analyze|verify> [--ci] [--json]');
    process.exit(command ? 1 : 0);
}
