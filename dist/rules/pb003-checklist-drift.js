import { readFile, writeFile } from '../lib/files.js';

const CHECKLIST_PATH = 'docs/PLAYBOOK_CHECKLIST.md';

export const PB003_CHECKLIST_DRIFT = {
  id: 'PB003',
  title: 'Checklist drift: apply step is missing',
  severity: 'medium',
  check: () => {
    const text = readFile(CHECKLIST_PATH);
    return text.includes('## Apply') && text.includes('npx playbook apply');
  },
  explain: 'The checklist must include Apply to complete the verify → plan → apply remediation loop.',
  fix: () => {
    const text = readFile(CHECKLIST_PATH);
    if (!text.includes('## Apply')) {
      writeFile(CHECKLIST_PATH, `${text.trimEnd()}\n\n## Apply\n- [ ] Run \`npx playbook apply\`\n`);
    }
  }
};
