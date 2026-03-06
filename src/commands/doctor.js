import { RULES } from '../rules/index.js';
import { pathExists } from '../lib/files.js';

export function runDoctor() {
  const checks = [
    { label: 'docs directory present', ok: pathExists('docs') },
    { label: 'src/features directory present', ok: pathExists('src/features') },
    { label: 'demo scenario map present', ok: pathExists('.playbook/demo-scenarios.md') },
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
