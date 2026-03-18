import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const EXPECTED_FINDING_IDS = ['PB002', 'PB003', 'PB004', 'PB005'];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function copyDemoFixture() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-demo-contract-'));
  for (const entry of ['src', 'dist', 'docs', '.playbook']) {
    fs.cpSync(path.join(ROOT, entry), path.join(tempRoot, entry), { recursive: true });
  }
  return tempRoot;
}

function runCli(root, ...args) {
  const result = spawnSync('node', ['dist/cli.js', ...args], {
    cwd: root,
    encoding: 'utf8'
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? ''
  };
}

function parseJson(commandResult, commandLabel) {
  try {
    return JSON.parse(commandResult.stdout);
  } catch (error) {
    throw new Error(`${commandLabel} did not return valid JSON on stdout.\nstdout:\n${commandResult.stdout}\nstderr:\n${commandResult.stderr}\n${error}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const root = copyDemoFixture();

  try {
    const verifyBefore = runCli(root, 'verify', '--json');
    const beforePayload = parseJson(verifyBefore, 'verify --json before apply');

    assert(verifyBefore.status !== 0, `Expected fresh verify --json to fail on the demo baseline, but exit code was ${verifyBefore.status}.`);
    assert(beforePayload.ok === false, `Expected fresh verify --json to report ok=false, got ${JSON.stringify(beforePayload)}.`);

    const findingIds = beforePayload.findings.map((finding) => finding.id);
    assert(
      JSON.stringify(findingIds) === JSON.stringify(EXPECTED_FINDING_IDS),
      `Expected fresh verify finding IDs ${EXPECTED_FINDING_IDS.join(', ')}, got ${findingIds.join(', ')}.`
    );

    const planResult = runCli(root, 'plan', '--json');
    const planPayload = parseJson(planResult, 'plan --json');
    assert(planResult.status === 0, `Expected plan --json to succeed, got exit code ${planResult.status}.\nstderr:\n${planResult.stderr}`);
    assert(planPayload.count === EXPECTED_FINDING_IDS.length, `Expected plan count ${EXPECTED_FINDING_IDS.length}, got ${planPayload.count}.`);

    const applyResult = runCli(root, 'apply', '--json');
    const applyPayload = parseJson(applyResult, 'apply --json');
    assert(applyResult.status === 0, `Expected apply --json to succeed, got exit code ${applyResult.status}.\nstderr:\n${applyResult.stderr}`);
    assert(applyPayload.appliedCount === EXPECTED_FINDING_IDS.length, `Expected apply count ${EXPECTED_FINDING_IDS.length}, got ${applyPayload.appliedCount}.`);

    const verifyAfter = runCli(root, 'verify', '--json');
    const afterPayload = parseJson(verifyAfter, 'verify --json after apply');
    assert(verifyAfter.status === 0, `Expected verify --json after apply to pass, got exit code ${verifyAfter.status}.\nstderr:\n${verifyAfter.stderr}`);
    assert(afterPayload.ok === true, `Expected verify --json after apply to report ok=true, got ${JSON.stringify(afterPayload)}.`);
    assert(Array.isArray(afterPayload.findings) && afterPayload.findings.length === 0, 'Expected no findings after apply.');

    console.log('Demo baseline validation passed: fresh verify fails with PB002-PB005, and post-apply verify passes.');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

main();
