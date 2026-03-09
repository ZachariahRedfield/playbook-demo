import { mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const ARTIFACT_DIR = path.join(ROOT, '.playbook/demo-artifacts');
const DEFAULT_CLI_PATH = path.join(ROOT, 'dist/cli.js');
const ALLOWED_COPYBACK_PATHS = ['.playbook/demo-artifacts', '.playbook/repo-index.json', 'docs/ARCHITECTURE_DIAGRAMS.md'];
const CLI_PATH = resolveCliPath();

function main() {
  mkdirSync(ARTIFACT_DIR, { recursive: true });

  const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'playbook-demo-artifacts-'));
  const fixturePaths = [
    'src',
    'tests',
    'docs',
    '.playbook',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'README.md'
  ];

  try {
    for (const fixturePath of fixturePaths) {
      const sourcePath = path.join(ROOT, fixturePath);
      if (!existsSync(sourcePath)) {
        continue;
      }
      cpSync(sourcePath, path.join(tempRoot, fixturePath), { recursive: true });
    }

    runAndWrite(tempRoot, ['index', '--json'], '.playbook/demo-artifacts/index.json');
    runAndWrite(tempRoot, ['rules', '--json'], '.playbook/demo-artifacts/rules.json');
    runAndWrite(tempRoot, ['explain', 'architecture', '--json'], '.playbook/demo-artifacts/explain-architecture.json');
    runAndWrite(tempRoot, ['explain', 'PB001', '--json'], '.playbook/demo-artifacts/explain-rule.json');
    runAndWrite(tempRoot, ['explain', 'workouts', '--json'], '.playbook/demo-artifacts/explain-module.json');

    runAndWrite(tempRoot, ['verify', '--json'], '.playbook/demo-artifacts/verify-before.json', [1]);
    runAndWrite(tempRoot, ['plan', '--json'], '.playbook/demo-artifacts/plan.json');
    runAndWrite(tempRoot, ['apply', '--json'], '.playbook/demo-artifacts/apply.json');
    runAndWrite(tempRoot, ['verify', '--json'], '.playbook/demo-artifacts/verify-after.json');

    run(tempRoot, ['diagram', '--repo', '.', '--out', 'docs/ARCHITECTURE_DIAGRAMS.md']);
    copyBackFromTemp(tempRoot, 'docs/ARCHITECTURE_DIAGRAMS.md');

    runAndWrite(tempRoot, ['doctor'], '.playbook/demo-artifacts/doctor.txt');

    // Keep an indexed snapshot in the repository root for explain module happy path.
    copyBackFromTemp(tempRoot, '.playbook/repo-index.json');

    console.log(`Refreshed demo artifacts in ${ARTIFACT_DIR}`);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function runAndWrite(cwd, args, outputPath, allowedExitCodes = [0]) {
  const output = run(cwd, args, allowedExitCodes);
  const tempOutputPath = path.join(cwd, outputPath);
  mkdirSync(path.dirname(tempOutputPath), { recursive: true });
  writeFileSync(tempOutputPath, output || '\n');
  copyBackFromTemp(cwd, outputPath);
}

function copyBackFromTemp(tempRoot, relativePath) {
  assertAllowedCopybackPath(relativePath);
  const sourcePath = path.join(tempRoot, relativePath);
  const destinationPath = path.join(ROOT, relativePath);
  mkdirSync(path.dirname(destinationPath), { recursive: true });
  writeFileSync(destinationPath, readFileSync(sourcePath, 'utf8'));
}

function assertAllowedCopybackPath(relativePath) {
  const normalizedPath = normalizePath(relativePath);
  const isAllowed = ALLOWED_COPYBACK_PATHS.some((allowedPath) => {
    const normalizedAllowed = normalizePath(allowedPath);
    return normalizedPath === normalizedAllowed || normalizedPath.startsWith(`${normalizedAllowed}/`);
  });

  if (!isAllowed) {
    throw new Error(
      `Refusing to copy back disallowed path: ${relativePath}. Allowed paths: ${ALLOWED_COPYBACK_PATHS.join(', ')}`
    );
  }
}

function resolveCliPath() {
  const requestedPath = process.env.PLAYBOOK_CLI_PATH;
  const candidatePath = requestedPath ? path.resolve(ROOT, requestedPath) : DEFAULT_CLI_PATH;

  if (!existsSync(candidatePath)) {
    throw new Error(
      `Playbook CLI entrypoint not found at ${candidatePath}. Set PLAYBOOK_CLI_PATH to a valid Node JS entrypoint or build dist/cli.js.`
    );
  }

  const stats = statSync(candidatePath);
  if (!stats.isFile()) {
    throw new Error(`Playbook CLI entrypoint is not a file: ${candidatePath}`);
  }

  return candidatePath;
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function run(cwd, args, allowedExitCodes = [0]) {
  const result = spawnSync('node', [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8'
  });

  const output = `${result.stdout}${result.stderr}`;
  const status = result.status ?? 1;

  if (!allowedExitCodes.includes(status)) {
    throw new Error(`Command failed: playbook ${args.join(' ')}\n${output}`);
  }

  return output;
}

main();
