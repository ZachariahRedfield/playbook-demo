import { collectFindings } from '../engine/collect-findings.js';
import { printNextSteps } from '../lib/output.js';

export function runVerify() {
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
