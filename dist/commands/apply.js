import { collectFindings } from '../engine/collect-findings.js';
import { printNextSteps } from '../lib/output.js';

export function runApply() {
  const findings = collectFindings();
  if (findings.length === 0) {
    console.log('No changes applied. Repository is already clean.');
    return;
  }

  findings.forEach((finding) => finding.fix());
  console.log(`Applied ${findings.length} safe remediation(s).`);

  printNextSteps([
    { title: 'Verify repository health', command: 'npx playbook verify' },
    { title: 'Inspect architecture shape', command: 'npx playbook analyze' }
  ]);
}
