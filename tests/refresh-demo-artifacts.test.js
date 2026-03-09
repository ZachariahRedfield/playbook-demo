import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const ALLOWED_CHANGED_PATHS = ['.playbook/demo-artifacts', '.playbook/repo-index.json', 'docs/ARCHITECTURE_DIAGRAMS.md'];

function copyRefreshFixture() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'playbook-demo-refresh-'));
  for (const entry of ['src', 'docs', '.playbook', 'scripts', 'dist']) {
    fs.cpSync(path.join(process.cwd(), entry), path.join(tempRoot, entry), { recursive: true });
  }
  return tempRoot;
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function listFilesRecursively(rootDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      files.push(normalizePath(path.relative(rootDir, absolutePath)));
    }
  }

  walk(rootDir);
  return files;
}

function snapshotFileHashes(rootDir) {
  const hashes = new Map();
  for (const filePath of listFilesRecursively(rootDir)) {
    const content = fs.readFileSync(path.join(rootDir, filePath));
    hashes.set(filePath, createHash('sha256').update(content).digest('hex'));
  }
  return hashes;
}

function diffFileHashes(before, after) {
  const changed = new Set();
  const files = new Set([...before.keys(), ...after.keys()]);

  for (const filePath of files) {
    if (before.get(filePath) !== after.get(filePath)) {
      changed.add(filePath);
    }
  }

  return [...changed].sort();
}

test('refresh script honors PLAYBOOK_CLI_PATH override and only updates allowed outputs', () => {
  const fixtureRoot = copyRefreshFixture();
  const markerPath = path.join(os.tmpdir(), `playbook-refresh-wrapper-${process.pid}-${Date.now()}.txt`);
  const wrapperPath = path.join(fixtureRoot, 'wrapper-cli.js');

  fs.writeFileSync(
    wrapperPath,
    `import fs from 'node:fs';\nimport { spawnSync } from 'node:child_process';\nfs.appendFileSync(${JSON.stringify(markerPath)}, 'wrapper-invoked\\n');\nconst result = spawnSync('node', [${JSON.stringify(path.join(fixtureRoot, 'dist/cli.js'))}, ...process.argv.slice(2)], { stdio: 'inherit' });\nprocess.exit(result.status ?? 1);\n`
  );

  const before = snapshotFileHashes(fixtureRoot);
  const result = spawnSync('node', ['scripts/refresh-demo-artifacts.mjs'], {
    cwd: fixtureRoot,
    encoding: 'utf8',
    env: { ...process.env, PLAYBOOK_CLI_PATH: wrapperPath }
  });
  const after = snapshotFileHashes(fixtureRoot);

  assert.equal(result.status, 0, `refresh failed:\n${result.stdout}\n${result.stderr}`);
  assert.equal(fs.readFileSync(markerPath, 'utf8').includes('wrapper-invoked'), true, 'wrapper should be invoked');

  const changedFiles = diffFileHashes(before, after).filter((filePath) => filePath !== 'wrapper-cli.js');
  for (const changedPath of changedFiles) {
    const allowed = ALLOWED_CHANGED_PATHS.some((allowedPath) => {
      const normalizedAllowed = normalizePath(allowedPath);
      return changedPath === normalizedAllowed || changedPath.startsWith(`${normalizedAllowed}/`);
    });

    assert.equal(allowed, true, `unexpected changed path: ${changedPath}`);
  }
});
