import { readFile, writeFile } from '../lib/files.js';

const CHANGELOG_PATH = 'docs/CHANGELOG.md';
const CHANGELOG_ENTRY = '- Added user profile retrieval service.';

export const PB002_MISSING_CHANGELOG_ENTRY = {
  id: 'PB002',
  title: 'Missing changelog entry for users feature',
  severity: 'low',
  check: () => {
    const text = readFile(CHANGELOG_PATH);
    return text.includes('Added user profile retrieval service');
  },
  explain: 'CHANGELOG.md should include a users feature note so recent changes are traceable.',
  fix: () => {
    const text = readFile(CHANGELOG_PATH);
    if (!text.includes('Added user profile retrieval service')) {
      writeFile(CHANGELOG_PATH, `${text.trimEnd()}\n${CHANGELOG_ENTRY}\n`);
    }
  }
};
