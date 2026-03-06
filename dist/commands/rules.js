import { RULES } from '../rules/index.js';

export function runRules() {
  console.log('Playbook Rules\n');
  RULES.forEach((rule) => {
    console.log(`- [${rule.id}] ${rule.title}`);
  });
}
