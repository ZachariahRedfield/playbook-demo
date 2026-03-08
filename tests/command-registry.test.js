import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function runCli(args) {
  const result = spawnSync('node', ['src/cli.js', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

  return result;
}

test('unknown commands render deterministic registry-driven help', () => {
  const result = runCli(['unknown']);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /Commands \(deterministic order\):/);
  assert.match(result.stdout, /- analyze/);
  assert.match(result.stdout, /- verify/);
  assert.match(result.stdout, /- doctor/);
});
