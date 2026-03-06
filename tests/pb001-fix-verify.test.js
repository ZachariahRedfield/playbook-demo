import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

function writeTempFile(root, relativePath, contents) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function runCli(root, command) {
  return execFileSync('node', ['src/cli.js', command], {
    cwd: root,
    encoding: 'utf8'
  });
}

test('PB001 fix and verify share the same architecture feature detection', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-pb001-'));

  writeTempFile(
    tempRoot,
    'src/cli.js',
    fs.readFileSync(path.join(process.cwd(), 'src/cli.js'), 'utf8')
  );

  writeTempFile(
    tempRoot,
    'docs/ARCHITECTURE.md',
    '# Architecture\n\n## Source layout\n\n- `src/features/workouts/*` contains workout domain logic.\n'
  );

  writeTempFile(tempRoot, 'docs/CHANGELOG.md', '- Added user profile retrieval service\n');
  writeTempFile(tempRoot, 'docs/PLAYBOOK_CHECKLIST.md', '## Verify\n- [ ] Run `npx playbook verify`\n');
  writeTempFile(tempRoot, 'docs/PLAYBOOK_NOTES.md', 'Last Verified: yesterday\n');
  writeTempFile(tempRoot, 'src/features/workouts/workout-types.ts', 'export type WorkoutPlan = { id: string };\n');
  writeTempFile(tempRoot, 'src/features/workouts/workout-service.ts', 'export function list(): WorkoutPlan[] { return []; }\n');

  const statusOutput = runCli(tempRoot, 'status');
  assert.match(statusOutput, /\[PB001\]/, 'status should report PB001 before fix');

  runCli(tempRoot, 'fix');

  const architectureDoc = fs.readFileSync(path.join(tempRoot, 'docs/ARCHITECTURE.md'), 'utf8');
  assert.match(architectureDoc, /^## Features\n\n- workouts\n- users\n/m, 'fix should add canonical features section');

  const verifyOutput = runCli(tempRoot, 'verify');
  assert.match(verifyOutput, /Verification passed\./, 'verify should pass after fix');
});
