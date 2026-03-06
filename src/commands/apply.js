import { collectFindings } from '../engine/collect-findings.js';
import { printNextSteps } from '../lib/output.js';

export function runApply({ json = false } = {}) {
  const findings = collectFindings();

  if (json) {
    const applied = findings.map((finding) => ({
      id: finding.id,
      title: finding.title
    }));

    findings.forEach((finding) => finding.fix());

    console.log(
      JSON.stringify(
        {
          appliedCount: applied.length,
          applied
        },
        null,
        2
      )
    );
    return;
  }

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
