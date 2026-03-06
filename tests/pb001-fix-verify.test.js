import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function writeTempFile(root, relativePath, contents) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function copyCliSource(tempRoot) {
  const sourceRoot = path.join(process.cwd(), 'src');
  const destinationRoot = path.join(tempRoot, 'src');
  fs.cpSync(sourceRoot, destinationRoot, { recursive: true });
}

function runCli(root, command) {
  const result = spawnSync('node', ['src/cli.js', command], {
    cwd: root,
    encoding: 'utf8'
  });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

test('PB001 fix and verify share the same architecture feature detection', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-pb001-'));
  copyCliSource(tempRoot);

  writeTempFile(
    tempRoot,
    'docs/ARCHITECTURE.md',
    '# Architecture\n\n## Features\n\n- workouts\n\n## Source layout\n\n- `src/features/workouts/*` contains workout domain logic.\n- `src/features/users/*` contains user profile logic.\n'
  );

  writeTempFile(tempRoot, 'docs/CHANGELOG.md', '- Added user profile retrieval service\n');
  writeTempFile(tempRoot, 'docs/PLAYBOOK_CHECKLIST.md', '## Plan\n- [ ] Run `npx playbook plan`\n');
  writeTempFile(tempRoot, 'docs/PLAYBOOK_NOTES.md', 'Last Verified: yesterday\n');
  writeTempFile(tempRoot, 'src/features/workouts/workout-types.ts', 'export type WorkoutPlan = { id: string };\n');
  writeTempFile(tempRoot, 'src/features/workouts/workout-service.ts', 'export function list(): WorkoutPlan[] { return []; }\n');

  const verifyOutputBeforeApply = runCli(tempRoot, 'verify');
  assert.equal(verifyOutputBeforeApply.status, 1, 'verify should fail before apply');
  assert.match(verifyOutputBeforeApply.stderr, /\[PB001\]/, 'verify should report PB001 before apply');

  const applyOutput = runCli(tempRoot, 'apply');
  assert.equal(applyOutput.status, 0, 'apply should succeed');

  const architectureDoc = fs.readFileSync(path.join(tempRoot, 'docs/ARCHITECTURE.md'), 'utf8');
  assert.match(architectureDoc, /^## Features\n\n- workouts\n- users\n/m, 'fix should add users to features section');

  const verifyOutputAfterApply = runCli(tempRoot, 'verify');
  assert.equal(verifyOutputAfterApply.status, 0, 'verify should pass after apply');
  assert.match(verifyOutputAfterApply.stdout, /Verification passed\./, 'verify should pass after apply');
});

test('analyze reports repository profile instead of verification findings list', () => {
  const output = runCli(process.cwd(), 'analyze');

  assert.equal(output.status, 0, 'analyze should succeed');
  assert.match(output.stdout, /Playbook Repository Analysis/);
  assert.match(output.stdout, /Features detected:/);
  assert.match(output.stdout, /Repository profile/);
  assert.doesNotMatch(output.stdout, /Remaining issues:/, 'analyze should differ from verify output');
});
