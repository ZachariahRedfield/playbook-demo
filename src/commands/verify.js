import { collectFindings } from '../engine/collect-findings.js';
import { printNextSteps } from '../lib/output.js';

export function runVerify() {
  const findings = collectFindings();
  if (findings.length > 0) {
    console.error(`Verification failed. Remaining issues: ${findings.length}`);
    findings.forEach((finding) => {
      console.error(`- [${finding.id}] (${finding.severity}) ${finding.title}`);
    });
    printNextSteps([
      { title: 'Preview deterministic remediations', command: 'npx playbook plan' },
      { title: 'Apply safe fixes', command: 'npx playbook apply' },
      { title: 'Re-run verification', command: 'npx playbook verify' }
    ]);
    process.exit(1);
  }

  console.log('Verification passed. Repository health is good.');
  printNextSteps([{ title: 'Inspect architecture shape', command: 'npx playbook analyze' }]);
}
