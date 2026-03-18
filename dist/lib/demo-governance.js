import fs from 'node:fs';
import path from 'node:path';

export const REQUIRED_DOC_ANCHORS = {
  'AGENTS.md': ['managed-docs-anchor'],
  'docs/archive/README.md': ['archive-anchor'],
  'docs/commands/README.md': ['commands-anchor'],
  'docs/CONSUMER_INTEGRATION_CONTRACT.md': ['consumer-integration-anchor'],
  'docs/index.md': ['docs-index-anchor'],
  'docs/PLAYBOOK_BUSINESS_STRATEGY.md': ['business-strategy-anchor'],
  'docs/roadmap/IMPROVEMENTS_BACKLOG.md': ['improvements-backlog-anchor'],
  'docs/roadmap/README.md': ['roadmap-readme-anchor'],
  'packages/cli/README.md': ['cli-readme-anchor']
};

export const REQUIRED_MANAGED_DOCS = ['docs/contracts/command-truth.json'];

export function createCommandTruth() {
  return {
    schemaVersion: '1.0',
    generatedBy: 'scripts/refresh-demo-artifacts.mjs',
    commands: [
      'analyze',
      'index',
      'explain',
      'rules',
      'verify',
      'plan',
      'apply',
      'diagram',
      'doctor'
    ]
  };
}

export function regenerateManagedDocs(rootDir = process.cwd()) {
  writeManagedFile(rootDir, 'docs/contracts/command-truth.json', `${JSON.stringify(createCommandTruth(), null, 2)}\n`);
  writeManagedFile(
    rootDir,
    'AGENTS.md',
    '# Demo Agent Guidance\n\n## managed-docs-anchor\nManaged docs and compliance anchors are regenerated before `playbook doctor` runs in refresh flows.\n'
  );
  writeManagedFile(rootDir, 'docs/archive/README.md', '# Archive\n\n## archive-anchor\nArchived references for the demo live here.\n');
  writeManagedFile(
    rootDir,
    'docs/commands/README.md',
    '# Commands\n\n## commands-anchor\nUse the scoped package form `npx @fawxzzy/playbook <command>` in active docs.\n'
  );
  writeManagedFile(
    rootDir,
    'docs/CONSUMER_INTEGRATION_CONTRACT.md',
    '# Consumer Integration Contract\n\n## consumer-integration-anchor\nConsumers interact with the published Playbook package contract.\n'
  );
  writeManagedFile(rootDir, 'docs/index.md', '# Documentation Index\n\n## docs-index-anchor\nThis index points to active demo governance documents.\n');
  writeManagedFile(
    rootDir,
    'docs/PLAYBOOK_BUSINESS_STRATEGY.md',
    '# Playbook Business Strategy\n\n## business-strategy-anchor\nThe demo emphasizes deterministic regeneration before validation.\n'
  );
  writeManagedFile(
    rootDir,
    'docs/roadmap/IMPROVEMENTS_BACKLOG.md',
    '# Improvements Backlog\n\n## improvements-backlog-anchor\nTrack follow-on hardening items for demo refresh reliability here.\n'
  );
  writeManagedFile(rootDir, 'docs/roadmap/README.md', '# Roadmap\n\n## roadmap-readme-anchor\nRoadmap entries map features to verification commands.\n');
  writeManagedFile(
    rootDir,
    'packages/cli/README.md',
    '# CLI Package\n\n## cli-readme-anchor\nMaintainers can inject a built CLI into the demo refresh pipeline.\n'
  );
  rewriteArchitectureDoc(rootDir);
}

export function collectDoctorChecks(rootDir = process.cwd()) {
  const checks = [
    { label: 'docs directory present', ok: exists(rootDir, 'docs') },
    { label: 'src/features directory present', ok: exists(rootDir, 'src/features') },
    { label: 'demo scenario map present', ok: exists(rootDir, '.playbook/demo-scenarios.md') },
    { label: 'managed command truth present', ok: exists(rootDir, 'docs/contracts/command-truth.json') }
  ];

  for (const [relativePath, anchors] of Object.entries(REQUIRED_DOC_ANCHORS)) {
    const absolutePath = path.join(rootDir, relativePath);
    const text = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
    const hasAnchors = anchors.every((anchor) => text.includes(anchor));
    checks.push({ label: `${relativePath} contains required anchors`, ok: hasAnchors });
  }

  const architectureDoc = read(rootDir, 'docs/ARCHITECTURE.md');
  checks.push({
    label: 'active docs avoid unscoped npx playbook examples',
    ok: !/npx playbook\b/.test(architectureDoc)
  });

  const commandTruthOk = validateCommandTruth(rootDir);
  checks.push({ label: 'command truth contract is valid JSON', ok: commandTruthOk });
  return checks;
}

function validateCommandTruth(rootDir) {
  try {
    const parsed = JSON.parse(read(rootDir, 'docs/contracts/command-truth.json'));
    return parsed.schemaVersion === '1.0' && Array.isArray(parsed.commands) && parsed.commands.includes('doctor');
  } catch {
    return false;
  }
}

function rewriteArchitectureDoc(rootDir) {
  const architecturePath = path.join(rootDir, 'docs/ARCHITECTURE.md');
  let text = fs.existsSync(architecturePath) ? fs.readFileSync(architecturePath, 'utf8') : '# Architecture\n\n';
  text = text.replace(/npx playbook apply/g, 'npx @fawxzzy/playbook apply');
  if (!text.includes('Sequence deterministic regeneration before deterministic validation.')) {
    text = `${text.trimEnd()}\n\n## Demo refresh governance\n\n- Failure Mode: Refresh pipelines must not require generated compliance artifacts to already be valid before the generation step that restores them.\n- Pattern: Sequence deterministic regeneration before deterministic validation.\n- Rule: Keep \`doctor\` strict, but place it after artifact regeneration in refresh/build pipelines.\n`;
  }
  writeManagedFile(rootDir, 'docs/ARCHITECTURE.md', text.endsWith('\n') ? text : `${text}\n`);
}

function writeManagedFile(rootDir, relativePath, contents) {
  const destination = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
}

function exists(rootDir, relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function read(rootDir, relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}
