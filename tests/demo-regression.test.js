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

function runCli(root, ...args) {
  const result = spawnSync('node', ['src/cli.js', ...args], {
    cwd: root,
    encoding: 'utf8'
  });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

test('fresh demo verify reports the intentionally imperfect baseline', () => {
  const root = copyDemoFixture();
  const result = runCli(root, 'verify');

  assert.equal(result.status, 1, 'verify should fail on the fresh demo baseline');
  assert.match(result.stderr, /Verification failed\. Remaining issues: 4/);
  assert.equal((result.stderr.match(/- \[PB\d{3}\]/g) ?? []).length, 4);
  assert.match(result.stderr, /\[PB002\]/);
  assert.match(result.stderr, /\[PB003\]/);
  assert.match(result.stderr, /\[PB004\]/);
  assert.match(result.stderr, /\[PB005\]/);
});

test('fresh demo verify --json reports the same four baseline findings', () => {
  const root = copyDemoFixture();
  const result = runCli(root, 'verify', '--json');

  assert.equal(result.status, 1, 'verify --json should fail on the fresh demo baseline');

  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, false);
  assert.deepEqual(
    payload.findings.map((finding) => finding.id),
    ['PB002', 'PB003', 'PB004', 'PB005']
  );
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

  assert.match(verifyResult.stderr, /Verification failed\. Remaining issues: 4/);
  assert.doesNotMatch(verifyResult.stderr, /Repository profile/);
});

test('index writes main-compatible schemaVersion 1.0 repo index with expected modules', () => {
  const root = copyDemoFixture();
  const indexResult = runCli(root, 'index');

  assert.equal(indexResult.status, 0, 'index should run successfully');

  const repoIndexPath = path.join(root, '.playbook/repo-index.json');
  const repoIndex = JSON.parse(fs.readFileSync(repoIndexPath, 'utf8'));

  assert.equal(repoIndex.schemaVersion, '1.0');
  assert.equal(typeof repoIndex.framework, 'string');
  assert.equal(typeof repoIndex.language, 'string');
  assert.equal(typeof repoIndex.architecture, 'object');
  assert.equal(Array.isArray(repoIndex.modules), true);
  assert.equal(typeof repoIndex.database, 'object');
  assert.equal(Array.isArray(repoIndex.rules), true);
  assert.deepEqual(
    repoIndex.modules.map((module) => module.name),
    ['users', 'workouts']
  );
});

test('fresh demo requires apply before verify passes', () => {
  const root = copyDemoFixture();

  const verifyBeforeApply = runCli(root, 'verify');
  assert.equal(verifyBeforeApply.status, 1, 'verify should fail before apply on fresh demo state');
  assert.match(verifyBeforeApply.stderr, /Verification failed\. Remaining issues: 4/);

  const planResult = runCli(root, 'plan');
  assert.equal(planResult.status, 0, 'plan should run successfully');
  assert.match(planResult.stdout, /Playbook Remediation Plan/);
  assert.match(planResult.stdout, /\[PB002\]/);
  assert.match(planResult.stdout, /\[PB003\]/);
  assert.match(planResult.stdout, /\[PB004\]/);
  assert.match(planResult.stdout, /\[PB005\]/);

  const applyResult = runCli(root, 'apply');
  assert.equal(applyResult.status, 0, 'apply should run successfully');
  assert.match(applyResult.stdout, /Applied 4 safe remediation\(s\)\./);

  const verifyAfterApply = runCli(root, 'verify');
  assert.equal(verifyAfterApply.status, 0, 'verify should pass after apply');
  assert.match(verifyAfterApply.stdout, /Verification passed\./);
});
