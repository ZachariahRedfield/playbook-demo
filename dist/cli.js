#!/usr/bin/env node

import fs from 'node:fs';

const [, , command] = process.argv;
const ARCHITECTURE_DOC_PATH = 'docs/ARCHITECTURE.md';

function architectureHasFeature(featureName) {
  const architectureDoc = readFile(ARCHITECTURE_DOC_PATH);
  const featurePattern = new RegExp(`^\\s*-\\s+${escapeRegExp(featureName)}\\s*$`, 'm');
  return featurePattern.test(architectureDoc);
}

function addArchitectureFeature(featureName) {
  const architectureDoc = readFile(ARCHITECTURE_DOC_PATH);
  if (architectureHasFeature(featureName)) {
    return;
  }

  const featurePattern = /^## Features\s*\n([\s\S]*?)(?:\n##\s|$)/m;
  const featureMatch = architectureDoc.match(featurePattern);

  if (featureMatch) {
    const sectionContent = featureMatch[1];
    const bulletPattern = new RegExp(`^\\s*-\\s+${escapeRegExp(featureName)}\\s*$`, 'm');
    if (bulletPattern.test(sectionContent)) {
      return;
    }

    const sectionStart = featureMatch.index;
    const sectionText = featureMatch[0];
    const sectionEnd = sectionStart + sectionText.length;
    const beforeSection = architectureDoc.slice(0, sectionEnd).replace(/\s*$/, '');
    const afterSection = architectureDoc.slice(sectionEnd);
    const updatedDoc = `${beforeSection}\n- ${featureName}\n${afterSection}`;
    writeFile(ARCHITECTURE_DOC_PATH, updatedDoc);
    return;
  }

  const separator = architectureDoc.endsWith('\n') ? '' : '\n';
  const updatedDoc = `${architectureDoc}${separator}\n## Features\n\n- workouts\n- ${featureName}\n`;
  writeFile(ARCHITECTURE_DOC_PATH, updatedDoc);
}

const RULES = [
  {
    id: 'PB001',
    title: 'Documentation drift in architecture docs',
    severity: 'medium',
    check: () => architectureHasFeature('users'),
    explain:
      'ARCHITECTURE.md should mention the users feature so docs match the current repository structure.',
    fix: () => addArchitectureFeature('users')
  },
  {
    id: 'PB002',
    title: 'Missing changelog entry for users feature',
    severity: 'low',
    check: () => {
      const text = readFile('docs/CHANGELOG.md');
      return text.includes('Added user profile retrieval service');
    },
    explain:
      'CHANGELOG.md should include a note for the users feature so recent changes are traceable.',
    fix: () => {
      const path = 'docs/CHANGELOG.md';
      const text = readFile(path);
      if (!text.includes('Added user profile retrieval service')) {
        writeFile(path, `${text}\n- Added user profile retrieval service.\n`);
      }
    }
  },
  {
    id: 'PB003',
    title: 'Checklist drift: verify step is missing',
    severity: 'medium',
    check: () => {
      const text = readFile('docs/PLAYBOOK_CHECKLIST.md');
      return text.includes('## Verify') && text.includes('npx playbook verify');
    },
    explain:
      'The checklist must include the verify phase to complete the detect → explain → fix → verify cycle.',
    fix: () => {
      const path = 'docs/PLAYBOOK_CHECKLIST.md';
      const text = readFile(path);
      if (!text.includes('## Verify')) {
        writeFile(path, `${text}\n\n## Verify\n- [ ] Run \`npx playbook verify\`\n`);
      }
    }
  },
  {
    id: 'PB004',
    title: 'Structural inconsistency in workout type naming',
    severity: 'medium',
    check: () => {
      const text = readFile('src/features/workouts/workout-types.ts');
      return text.includes('export type WorkoutPlan');
    },
    explain:
      'In this demo, workout services use WorkoutPlan as the canonical exported domain type. Consistent type naming keeps feature contracts predictable.',
    fix: () => {
      const typePath = 'src/features/workouts/workout-types.ts';
      const servicePath = 'src/features/workouts/workout-service.ts';
      writeFile(typePath, readFile(typePath).replace('export type Workout = {', 'export type WorkoutPlan = {'));
      writeFile(servicePath, readFile(servicePath).replaceAll('Workout', 'WorkoutPlan'));
    }
  },
  {
    id: 'PB005',
    title: 'Missing expected notes artifact marker',
    severity: 'low',
    check: () => {
      const text = readFile('docs/PLAYBOOK_NOTES.md');
      return text.includes('Last Verified:');
    },
    explain:
      'PLAYBOOK_NOTES.md should include a Last Verified marker so maintenance state is explicit.',
    fix: () => {
      const path = 'docs/PLAYBOOK_NOTES.md';
      const text = readFile(path);
      if (!text.includes('Last Verified:')) {
        writeFile(path, `${text}\n\nLast Verified: pending playbook verify\n`);
      }
    }
  }
];

function readFile(path) {
  return fs.readFileSync(path, 'utf8');
}

function writeFile(path, contents) {
  fs.writeFileSync(path, contents);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectFindings() {
  return RULES.filter((rule) => !rule.check());
}

function printNextSteps(steps) {
  console.log('\nNext steps');
  console.log('────────────────');
  console.log('');

  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step.title}`);
    console.log(`   ${step.command}`);
    console.log('');
  });
}

function runStatus() {
  const findings = collectFindings();
  const health = findings.length === 0 ? 'healthy' : 'attention-needed';

  console.log('Playbook Repository Status');
  console.log('Note: this demo intentionally starts with a few findings.');
  console.log(`Health: ${health}`);
  console.log(`Detected issues: ${findings.length}`);
  console.log(`Rules evaluated: ${RULES.length}`);

  if (findings.length > 0) {
    console.log('\nFindings:');
    findings.forEach((finding) => {
      console.log(`- [${finding.id}] (${finding.severity}) ${finding.title}`);
    });

    printNextSteps([
      { title: 'Understand findings', command: 'npx playbook explain' },
      { title: 'Apply safe fixes', command: 'npx playbook fix' },
      { title: 'Verify repository health', command: 'npx playbook verify' }
    ]);
  } else {
    console.log('\nNo issues found. Repository health is strong.');
    printNextSteps([{ title: 'Verify repository health', command: 'npx playbook verify' }]);
  }
}

function runExplain() {
  const findings = collectFindings();
  if (findings.length === 0) {
    console.log('No issues to explain.');
    return;
  }

  console.log('Playbook Explanation\n');
  findings.forEach((finding) => {
    console.log(`[${finding.id}] ${finding.title}`);
    console.log(`Why this matters: ${finding.explain}`);
    console.log('');
  });

  printNextSteps([
    { title: 'Apply safe fixes', command: 'npx playbook fix' },
    { title: 'Verify repository health', command: 'npx playbook verify' }
  ]);
}

function runFix() {
  const findings = collectFindings();
  if (findings.length === 0) {
    console.log('No fixes needed.');
    return;
  }

  findings.forEach((finding) => finding.fix());
  console.log(`Applied ${findings.length} safe fix(es).`);

  printNextSteps([
    { title: 'Verify repository health', command: 'npx playbook verify' },
    { title: 'Review current status', command: 'npx playbook status' }
  ]);
}

function runVerify() {
  const findings = collectFindings();
  if (findings.length > 0) {
    console.error(`Verification failed. Remaining issues: ${findings.length}`);
    printNextSteps([
      { title: 'Inspect unresolved findings', command: 'npx playbook status' },
      { title: 'Understand each finding', command: 'npx playbook explain' },
      { title: 'Apply safe fixes', command: 'npx playbook fix' }
    ]);
    process.exit(1);
  }

  console.log('Verification passed. Repository health is good.');

  printNextSteps([{ title: 'Review current status', command: 'npx playbook status' }]);
}

switch (command) {
  case 'status':
    runStatus();
    break;
  case 'explain':
    runExplain();
    break;
  case 'fix':
    runFix();
    break;
  case 'verify':
    runVerify();
    break;
  case 'analyze':
    runStatus();
    break;
  default:
    console.log('Usage: playbook <status|explain|fix|verify|analyze>');
    process.exit(command ? 1 : 0);
}
