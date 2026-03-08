import { printNextSteps } from '../lib/output.js';
import { createRepositoryProfile } from '../engine/repository-profile.js';

export function runAnalyze() {
  const profile = createRepositoryProfile();

  console.log('Playbook Repository Analysis');
  console.log('Focus: repository structure and demo shape.\n');

  console.log(`Features detected: ${profile.featureFolders.length > 0 ? profile.featureFolders.join(', ') : 'none'}`);
  console.log(`Docs detected: ${profile.docFiles.length > 0 ? profile.docFiles.join(', ') : 'none'}`);
  console.log(`Demo scenarios present: ${profile.scenariosPresent ? 'yes' : 'no'}`);
  console.log(`Guided findings configured: ${profile.rulesConfigured}`);
  console.log(`Demo commands available: ${profile.commands.join(' → ')}`);

  console.log('\nRepository profile');
  console.log('──────────────────');
  console.log(`- Purpose: ${profile.purpose}`);
  console.log(`- Command model: index/explain for intelligence, verify/plan/apply for remediation`);
  console.log(`- Docs-to-code alignment target: docs should describe src/features shape`);

  printNextSteps([
    { title: 'Evaluate current findings', command: 'npx playbook verify' },
    { title: 'Inspect planned remediations', command: 'npx playbook plan' }
  ]);
}
