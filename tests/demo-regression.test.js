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

test('fresh demo verify passes once managed docs are present', () => {
  const root = copyDemoFixture();
  const result = runCli(root, 'verify');

  assert.equal(result.status, 0, 'verify should pass on fresh demo');
  assert.match(result.stdout, /Verification passed\. Repository health is good\./);
  assert.equal((result.stderr.match(/- \[PB\d{3}\]/g) ?? []).length, 0);
});

test('analyze output is structurally distinct from verify output', () => {
  const root = copyDemoFixture();
  const analyzeResult = runCli(root, 'analyze');
  const verifyResult = runCli(root, 'verify');

  assert.equal(analyzeResult.status, 0);
  assert.equal(verifyResult.status, 0);

  assert.match(analyzeResult.stdout, /Playbook Repository Analysis/);
  assert.match(analyzeResult.stdout, /Repository profile/);
  assert.doesNotMatch(analyzeResult.stdout, /Verification passed\./);

  assert.match(verifyResult.stdout, /Verification passed\. Repository health is good\./);
  assert.doesNotMatch(verifyResult.stdout, /Repository profile/);
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

test('apply is a no-op after verify already passes on fresh demo', () => {
  const root = copyDemoFixture();

  const verifyBeforeApply = runCli(root, 'verify');
  assert.equal(verifyBeforeApply.status, 0, 'verify should pass before apply on fresh demo state');
  assert.match(verifyBeforeApply.stdout, /Verification passed\. Repository health is good\./);

  const planResult = runCli(root, 'plan');
  assert.equal(planResult.status, 0, 'plan should run successfully');
  assert.match(planResult.stdout, /Plan is empty\. No remediations needed\./);

  const applyResult = runCli(root, 'apply');
  assert.equal(applyResult.status, 0, 'apply should run successfully');
  assert.match(applyResult.stdout, /No changes applied\. Repository is already clean\./);

  const verifyAfterApply = runCli(root, 'verify');
  assert.equal(verifyAfterApply.status, 0, 'verify should continue to pass after apply');
  assert.match(verifyAfterApply.stdout, /Verification passed\./);
});
