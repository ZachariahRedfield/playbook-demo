import { RULES } from '../rules/index.js';

export function collectFindings() {
  return RULES.filter((rule) => !rule.check());
}
