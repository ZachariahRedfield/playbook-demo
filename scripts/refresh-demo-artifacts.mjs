import { mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const ARTIFACT_DIR = path.join(ROOT, '.playbook/demo-artifacts');
const CLI_PATH = path.join(ROOT, 'dist/cli.js');

function main() {
  mkdirSync(ARTIFACT_DIR, { recursive: true });

  const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'playbook-demo-artifacts-'));
  const fixturePaths = ['src', 'docs', '.playbook'];

  try {
    for (const fixturePath of fixturePaths) {
      cpSync(path.join(ROOT, fixturePath), path.join(tempRoot, fixturePath), { recursive: true });
    }

    runAndWrite(tempRoot, ['index', '--json'], `${ARTIFACT_DIR}/index.json`);
    runAndWrite(tempRoot, ['rules', '--json'], `${ARTIFACT_DIR}/rules.json`);
    runAndWrite(tempRoot, ['explain', 'architecture', '--json'], `${ARTIFACT_DIR}/explain-architecture.json`);
    runAndWrite(tempRoot, ['explain', 'PB001', '--json'], `${ARTIFACT_DIR}/explain-rule.json`);
    runAndWrite(tempRoot, ['explain', 'workouts', '--json'], `${ARTIFACT_DIR}/explain-module.json`);

    runAndWrite(tempRoot, ['verify', '--json'], `${ARTIFACT_DIR}/verify-before.json`, [1]);
    runAndWrite(tempRoot, ['plan', '--json'], `${ARTIFACT_DIR}/plan.json`);
    runAndWrite(tempRoot, ['apply', '--json'], `${ARTIFACT_DIR}/apply.json`);
    runAndWrite(tempRoot, ['verify', '--json'], `${ARTIFACT_DIR}/verify-after.json`);

    run(tempRoot, ['diagram', '--repo', '.', '--out', 'docs/ARCHITECTURE_DIAGRAMS.md']);
    writeFileSync(path.join(ROOT, 'docs/ARCHITECTURE_DIAGRAMS.md'), readFileSync(path.join(tempRoot, 'docs/ARCHITECTURE_DIAGRAMS.md'), 'utf8'));

    runAndWrite(tempRoot, ['doctor'], `${ARTIFACT_DIR}/doctor.txt`);

    // Keep an indexed snapshot in the repository root for explain module happy path.
    writeFileSync(path.join(ROOT, '.playbook/repo-index.json'), readFileSync(path.join(tempRoot, '.playbook/repo-index.json'), 'utf8'));

    console.log(`Refreshed demo artifacts in ${ARTIFACT_DIR}`);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function runAndWrite(cwd, args, outputPath, allowedExitCodes = [0]) {
  const output = run(cwd, args, allowedExitCodes);
  writeFileSync(outputPath, output || '\n');
}

function run(cwd, args, allowedExitCodes = [0]) {
  const result = spawnSync('node', [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8'
  });

  const output = `${result.stdout}${result.stderr}`;
  const status = result.status ?? 1;

  if (!allowedExitCodes.includes(status)) {
    throw new Error(`Command failed: playbook ${args.join(' ')}\n${output}`);
  }

  return output;
}

main();
