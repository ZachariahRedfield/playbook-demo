import { collectFindings } from '../engine/collect-findings.js';
import { printNextSteps } from '../lib/output.js';

export function runFix() {
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
