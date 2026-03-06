import { readFile, writeFile } from '../lib/files.js';

const NOTES_PATH = 'docs/PLAYBOOK_NOTES.md';

export const PB005_NOTES_MARKER = {
  id: 'PB005',
  title: 'Missing expected notes artifact marker',
  severity: 'low',
  check: () => readFile(NOTES_PATH).includes('Last Verified:'),
  explain: 'PLAYBOOK_NOTES.md should include a Last Verified marker so maintenance state is explicit.',
  fix: () => {
    const text = readFile(NOTES_PATH);
    if (!text.includes('Last Verified:')) {
      writeFile(NOTES_PATH, `${text.trimEnd()}\n\nLast Verified: pending playbook verify\n`);
    }
  }
};
