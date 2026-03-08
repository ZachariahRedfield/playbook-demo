import { RULES } from '../rules/index.js';
import { listDirectories, listMarkdownBasenames, pathExists } from '../lib/files.js';
import { listCommands } from './command-registry.js';

export function createRepositoryProfile() {
  const featureFolders = listDirectories('src/features');
  const docFiles = listMarkdownBasenames('docs');

  return {
    purpose: 'intentionally imperfect demo repo with deterministic fixes',
    featureFolders,
    docFiles,
    scenariosPresent: pathExists('.playbook/demo-scenarios.md'),
    rulesConfigured: RULES.length,
    commands: listCommands().map((entry) => entry.command)
  };
}
