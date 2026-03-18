import { mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { regenerateManagedDocs, REQUIRED_DOC_ANCHORS, REQUIRED_MANAGED_DOCS } from '../src/lib/demo-governance.js';

const ROOT = process.cwd();
const ARTIFACT_DIR = path.join(ROOT, '.playbook/demo-artifacts');
const DEFAULT_CLI_PATH = path.join(ROOT, 'dist/cli.js');
const ALLOWED_COPYBACK_PATHS = [
  '.playbook/demo-artifacts',
  '.playbook/repo-index.json',
  'docs/ARCHITECTURE_DIAGRAMS.md',
  'docs/ARCHITECTURE.md',
  ...REQUIRED_MANAGED_DOCS,
  ...Object.keys(REQUIRED_DOC_ANCHORS)
];
const CLI_PATH = resolveCliPath();

function main() {
  const dryRun = process.argv.includes('--dry-run');
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

    regenerateManagedDocs(tempRoot);

    run(tempRoot, ['diagram', '--repo', '.', '--out', 'docs/ARCHITECTURE_DIAGRAMS.md']);
    runAndWrite(tempRoot, ['doctor'], '.playbook/demo-artifacts/doctor.txt');

    if (!dryRun) {
      copyBackFromTemp(tempRoot, 'docs/ARCHITECTURE_DIAGRAMS.md');
      for (const managedDocPath of ['docs/ARCHITECTURE.md', ...REQUIRED_MANAGED_DOCS, ...Object.keys(REQUIRED_DOC_ANCHORS)]) {
        copyBackFromTemp(tempRoot, managedDocPath);
      }

      // Keep an indexed snapshot in the repository root for explain module happy path.
      copyBackFromTemp(tempRoot, '.playbook/repo-index.json');
    }

    console.log(`${dryRun ? 'Validated' : 'Refreshed'} demo artifacts in ${ARTIFACT_DIR}`);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function runAndWrite(cwd, args, outputPath, allowedExitCodes = [0]) {
  const output = run(cwd, args, { allowedExitCodes });
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

function parseJsonOutput(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function formatOutputSnippet(output, maxLength = 400) {
  if (!output) {
    return '<empty>';
  }

  const normalized = output.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}...`;
}

function isJsonCommand(args) {
  return args.includes('--json');
}

function run(cwd, args, options = {}) {
  const { allowedExitCodes = [0], cliPath = CLI_PATH, spawn = spawnSync } = options;
  const result = spawn('node', [cliPath, ...args], {
    cwd,
    encoding: 'utf8'
  });

  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  const output = `${stdout}${stderr}`;
  const status = result.status ?? 1;
  const command = `playbook ${args.join(' ')}`;

  let parsedJson = null;
  if (isJsonCommand(args)) {
    parsedJson = parseJsonOutput(stdout);
    if (!parsedJson) {
      throw new Error(
        `Command failed: ${command}
Expected machine-readable JSON output on stdout when --json is requested.
stdout snippet: ${formatOutputSnippet(stdout)}`
      );
    }

    if (status !== 0 && allowedExitCodes.includes(status)) {
      return output;
    }

    const hasStructuredStatus =
      Object.prototype.hasOwnProperty.call(parsedJson, 'ok') ||
      Object.prototype.hasOwnProperty.call(parsedJson, 'exitCode');

    if (!hasStructuredStatus && status === 0) {
      return output;
    }

    const normalizedExitCode = parsedJson.exitCode ?? status;
    const normalizedOk = parsedJson.ok ?? normalizedExitCode === 0;
    const isJsonSuccess = status === 0 && normalizedOk === true && normalizedExitCode === 0;
    if (isJsonSuccess) {
      return output;
    }

    throw new Error(
      `Command failed: ${command}
process exit code: ${status}
stdout:
${stdout}
stderr:
${stderr}
parsed JSON:
${JSON.stringify(parsedJson, null, 2)}`
    );
  }


  if (!allowedExitCodes.includes(status)) {
    throw new Error(`Command failed: ${command}\nprocess exit code: ${status}\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }

  return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

export { run, parseJsonOutput, isJsonCommand, formatOutputSnippet };
