import { collectFindings } from '../engine/collect-findings.js';
import { printNextSteps } from '../lib/output.js';

export function runExplain() {
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
