import { RULES } from '../rules/index.js';
import { listDirectories, listMarkdownBasenames, pathExists } from '../lib/files.js';
import { printNextSteps } from '../lib/output.js';

export function runAnalyze() {
  const featureFolders = listDirectories('src/features');
  const docFiles = listMarkdownBasenames('docs');
  const scenariosPresent = pathExists('.playbook/demo-scenarios.md');
  const commands = ['status', 'analyze', 'explain', 'fix', 'verify'];

  console.log('Playbook Repository Analysis');
  console.log('Focus: repository structure and demo shape.\n');

  console.log(`Features detected: ${featureFolders.length > 0 ? featureFolders.join(', ') : 'none'}`);
  console.log(`Docs detected: ${docFiles.length > 0 ? docFiles.join(', ') : 'none'}`);
  console.log(`Demo scenarios present: ${scenariosPresent ? 'yes' : 'no'}`);
  console.log(`Guided findings configured: ${RULES.length}`);
  console.log(`Demo commands available: ${commands.join(' → ')}`);

  console.log('\nRepository profile');
  console.log('──────────────────');
  console.log(`- Purpose: intentionally imperfect demo repo with deterministic fixes`);
  console.log(`- Command model: status/explain/fix/verify for discipline, analyze for structure`);
  console.log(`- Docs-to-code alignment target: docs should describe src/features shape`);

  printNextSteps([
    { title: 'Evaluate current findings', command: 'npx playbook status' },
    { title: 'Inspect why findings matter', command: 'npx playbook explain' }
  ]);
}
