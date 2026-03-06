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

test('fresh demo verify reports exactly 5 findings', () => {
  const root = copyDemoFixture();
  const result = runCli(root, 'verify');

  assert.equal(result.status, 1, 'verify should fail on fresh demo');
  assert.match(result.stderr, /Verification failed\. Remaining issues: 5/);
  assert.equal((result.stderr.match(/- \[PB\d{3}\]/g) ?? []).length, 5);
});

test('analyze output is structurally distinct from verify output', () => {
  const root = copyDemoFixture();
  const analyzeResult = runCli(root, 'analyze');
  const verifyResult = runCli(root, 'verify');

  assert.equal(analyzeResult.status, 0);
  assert.equal(verifyResult.status, 1);

  assert.match(analyzeResult.stdout, /Playbook Repository Analysis/);
  assert.match(analyzeResult.stdout, /Repository profile/);
  assert.doesNotMatch(analyzeResult.stdout, /Remaining issues:/);

  assert.match(verifyResult.stderr, /Verification failed\. Remaining issues:/);
  assert.doesNotMatch(verifyResult.stderr, /Repository profile/);
});

test('verify fails before apply and passes after apply', () => {
  const root = copyDemoFixture();

  const verifyBeforeApply = runCli(root, 'verify');
  assert.equal(verifyBeforeApply.status, 1, 'verify should fail before apply on fresh demo state');
  assert.match(verifyBeforeApply.stderr, /Verification failed\. Remaining issues: 5/);

  const planResult = runCli(root, 'plan');
  assert.equal(planResult.status, 0, 'plan should run successfully');
  assert.match(planResult.stdout, /Playbook Remediation Plan/);

  const applyResult = runCli(root, 'apply');
  assert.equal(applyResult.status, 0, 'apply should run successfully');
  assert.match(applyResult.stdout, /Applied 5 safe remediation\(s\)\./);

  const verifyAfterApply = runCli(root, 'verify');
  assert.equal(verifyAfterApply.status, 0, 'verify should pass after apply');
  assert.match(verifyAfterApply.stdout, /Verification passed\./);
});
