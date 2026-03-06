import { collectFindings } from '../engine/collect-findings.js';
import { RULES } from '../rules/index.js';
import { printNextSteps } from '../lib/output.js';

export function runStatus() {
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
    return;
  }

  console.log('\nNo issues found. Repository health is strong.');
  printNextSteps([{ title: 'Verify repository health', command: 'npx playbook verify' }]);
}
