import { RULES } from '../rules/index.js';
import { collectDoctorChecks } from '../lib/demo-governance.js';

export function runDoctor() {
  const checks = [
    ...collectDoctorChecks(),
    { label: 'rules loaded', ok: RULES.length > 0 }
  ];

  console.log('Playbook Doctor\n');
  checks.forEach((check) => {
    console.log(`${check.ok ? '✅' : '❌'} ${check.label}`);
  });

  if (checks.some((check) => !check.ok)) {
    process.exit(1);
  }
}
