import test from 'node:test';
import assert from 'node:assert/strict';

import { run } from '../scripts/refresh-demo-artifacts.mjs';

function createSpawnResult({ status = 0, stdout = '', stderr = '' } = {}) {
  return () => ({ status, stdout, stderr });
}

test('verify JSON success with warning findings passes', () => {
  const stdout = JSON.stringify({
    ok: true,
    exitCode: 0,
    summary: 'Verification passed.',
    findings: [{ severity: 'warning', ruleId: 'PB001', message: 'Advisory warning' }]
  });

  const output = run(process.cwd(), ['verify', '--json'], {
    spawn: createSpawnResult({ status: 0, stdout })
  });

  assert.equal(output, stdout);
});

test('verify JSON success with empty findings passes', () => {
  const stdout = JSON.stringify({ ok: true, exitCode: 0, summary: 'Verification passed.', findings: [] });

  const output = run(process.cwd(), ['verify', '--json'], {
    spawn: createSpawnResult({ status: 0, stdout })
  });

  assert.equal(output, stdout);
});

test('JSON output with ok false fails', () => {
  const stdout = JSON.stringify({ ok: false, exitCode: 1, summary: 'Verification failed.' });

  assert.throws(
    () =>
      run(process.cwd(), ['verify', '--json'], {
        spawn: createSpawnResult({ status: 0, stdout })
      }),
    /parsed JSON/
  );
});

test('non-zero process exit code fails when not explicitly allowed', () => {
  const stdout = JSON.stringify({ ok: true, exitCode: 0, summary: 'Verification passed.' });

  assert.throws(
    () =>
      run(process.cwd(), ['verify', '--json'], {
        spawn: createSpawnResult({ status: 2, stdout, stderr: 'fatal error' })
      }),
    /process exit code: 2/
  );
});

test('malformed JSON fails with deterministic message', () => {
  assert.throws(
    () =>
      run(process.cwd(), ['verify', '--json'], {
        spawn: createSpawnResult({ status: 0, stdout: 'not-json' })
      }),
    /Expected machine-readable JSON output on stdout when --json is requested/,
  );
});
