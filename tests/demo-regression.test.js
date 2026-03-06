import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function copyDemoFixture() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-demo-'));
  for (const entry of ['src', 'docs', '.playbook']) {
    fs.cpSync(path.join(process.cwd(), entry), path.join(tempRoot, entry), { recursive: true });
  }
  return tempRoot;
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

test('fresh demo status reports exactly 5 findings', () => {
  const root = copyDemoFixture();
  const result = runCli(root, 'status');

  assert.equal(result.status, 0, 'status should succeed on fresh demo');
  assert.match(result.stdout, /Detected issues: 5/);
  assert.equal((result.stdout.match(/- \[PB\d{3}\]/g) ?? []).length, 5);
});

test('analyze output is structurally distinct from status output', () => {
  const root = copyDemoFixture();
  const analyzeResult = runCli(root, 'analyze');
  const statusResult = runCli(root, 'status');

  assert.equal(analyzeResult.status, 0);
  assert.equal(statusResult.status, 0);

  assert.match(analyzeResult.stdout, /Playbook Repository Analysis/);
  assert.match(analyzeResult.stdout, /Repository profile/);
  assert.doesNotMatch(analyzeResult.stdout, /Detected issues:/);

  assert.match(statusResult.stdout, /Playbook Repository Status/);
  assert.match(statusResult.stdout, /Detected issues:/);
  assert.doesNotMatch(statusResult.stdout, /Repository profile/);
});

test('verify fails before fix and passes after fix', () => {
  const root = copyDemoFixture();

  const verifyBeforeFix = runCli(root, 'verify');
  assert.equal(verifyBeforeFix.status, 1, 'verify should fail before fix on fresh demo state');
  assert.match(verifyBeforeFix.stderr, /Verification failed\. Remaining issues: 5/);

  const fixResult = runCli(root, 'fix');
  assert.equal(fixResult.status, 0, 'fix should run successfully');
  assert.match(fixResult.stdout, /Applied 5 safe fix\(es\)\./);

  const verifyAfterFix = runCli(root, 'verify');
  assert.equal(verifyAfterFix.status, 0, 'verify should pass after fix');
  assert.match(verifyAfterFix.stdout, /Verification passed\./);
});
