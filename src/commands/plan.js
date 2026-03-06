import { collectFindings } from '../engine/collect-findings.js';
import { printNextSteps } from '../lib/output.js';

export function runPlan() {
  const findings = collectFindings();
  if (findings.length === 0) {
    console.log('Plan is empty. No remediations needed.');
    return;
  }

  console.log('Playbook Remediation Plan\n');
  findings.forEach((finding, index) => {
    console.log(`${index + 1}. [${finding.id}] ${finding.title}`);
    console.log(`   Why: ${finding.explain}`);
  });

  printNextSteps([
    { title: 'Apply safe fixes from this plan', command: 'npx playbook apply' },
    { title: 'Re-run verification', command: 'npx playbook verify' }
  ]);
}
