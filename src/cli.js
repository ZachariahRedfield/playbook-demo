#!/usr/bin/env node

import fs from 'node:fs';

const [, , command] = process.argv;

const RULES = [
  {
    id: 'PB001',
    title: 'Documentation drift in architecture docs',
    severity: 'medium',
    check: () => {
      const text = readFile('docs/ARCHITECTURE.md');
      return text.includes('src/features/users');
    },
    explain:
      'ARCHITECTURE.md should mention the users feature so docs match the current repository structure.',
    fix: () => {
      const path = 'docs/ARCHITECTURE.md';
      const text = readFile(path);
      if (!text.includes('src/features/users')) {
        const updated = text.replace(
          '- `src/features/workouts/*` contains workout domain logic.\n',
          '- `src/features/workouts/*` contains workout domain logic.\n- `src/features/users/*` contains user profile domain logic.\n'
        );
        writeFile(path, updated);
      }
    }
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

function collectFindings() {
  return RULES.filter((rule) => !rule.check());
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
    console.log('\nRecommended next commands:');
    console.log('  npx playbook explain');
    console.log('  npx playbook fix');
    console.log('  npx playbook verify');
  } else {
    console.log('\nNo issues found. Repository health is strong.');
    console.log('Recommended next command: npx playbook verify');
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
}

function runFix() {
  const findings = collectFindings();
  if (findings.length === 0) {
    console.log('No fixes needed.');
    return;
  }

  findings.forEach((finding) => finding.fix());
  console.log(`Applied ${findings.length} safe fix(es).`);
  console.log('Next command: npx playbook verify');
}

function runVerify() {
  const findings = collectFindings();
  if (findings.length > 0) {
    console.error(`Verification failed. Remaining issues: ${findings.length}`);
    process.exit(1);
  }

  console.log('Verification passed. Repository health is good.');
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
