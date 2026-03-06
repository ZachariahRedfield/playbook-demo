import { readFile, writeFile } from '../lib/files.js';

const CHECKLIST_PATH = 'docs/PLAYBOOK_CHECKLIST.md';

export const PB003_CHECKLIST_DRIFT = {
  id: 'PB003',
  title: 'Checklist drift: verify step is missing',
  severity: 'medium',
  check: () => {
    const text = readFile(CHECKLIST_PATH);
    return text.includes('## Verify') && text.includes('npx playbook verify');
  },
  explain: 'The checklist must include Verify to complete the detect → explain → fix → verify cycle.',
  fix: () => {
    const text = readFile(CHECKLIST_PATH);
    if (!text.includes('## Verify')) {
      writeFile(CHECKLIST_PATH, `${text.trimEnd()}\n\n## Verify\n- [ ] Run \`npx playbook verify\`\n`);
    }
  }
};
