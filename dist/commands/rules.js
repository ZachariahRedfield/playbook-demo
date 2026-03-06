import { RULES } from '../rules/index.js';

export function runRules({ json = false } = {}) {
  if (json) {
    console.log(
      JSON.stringify(
        RULES.map((rule) => ({
          id: rule.id,
          title: rule.title,
          severity: rule.severity,
          explain: rule.explain
        })),
        null,
        2
      )
    );
    return;
  }

  console.log('Playbook Rules\n');
  RULES.forEach((rule) => {
    console.log(`- [${rule.id}] ${rule.title}`);
  });
}
