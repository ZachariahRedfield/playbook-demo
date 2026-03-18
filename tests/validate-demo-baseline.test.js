import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('validate-demo-baseline script enforces fail-first then apply-pass contract', () => {
  const result = spawnSync('node', ['scripts/validate-demo-baseline.mjs'], {
    encoding: 'utf8',
    cwd: process.cwd()
  });

  assert.equal(result.status, 0, `script failed:\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  assert.match(result.stdout, /Demo baseline validation passed/);
});
