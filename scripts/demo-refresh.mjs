import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const featureId = readOption('--feature-id');

if (featureId && featureId !== 'PB-V1-DEMO-REFRESH-001') {
  console.error(`Unsupported feature id: ${featureId}`);
  process.exit(1);
}

runStep('npm', ['run', 'build']);
runStep('node', ['scripts/refresh-demo-artifacts.mjs', ...(dryRun ? ['--dry-run'] : [])]);

function readOption(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}

function runStep(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { stdio: 'inherit', env: process.env, encoding: 'utf8' });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}
