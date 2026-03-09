import path from 'node:path';
import { listDirectories, listFiles, writeJsonFile } from '../lib/files.js';

function createModuleEntry(feature) {
  const moduleRoot = path.join('src/features', feature);
  return {
    id: feature,
    name: feature,
    kind: 'feature-module',
    path: moduleRoot,
    files: listFiles(moduleRoot)
  };
}

export function createRepoIndex() {
  const modules = listDirectories('src/features').map(createModuleEntry);
  const docs = listFiles('docs').filter((file) => file.endsWith('.md')).sort();

  return {
    schemaVersion: '1.0',
    generatedAt: 'deterministic-demo',
    repository: {
      root: '.',
      moduleRoot: 'src/features',
      docsRoot: 'docs'
    },
    modules,
    docs
  };
}

export function runIndex({ json = false } = {}) {
  const repoIndex = createRepoIndex();
  writeJsonFile('.playbook/repo-index.json', repoIndex);

  if (json) {
    console.log(JSON.stringify(repoIndex, null, 2));
    return;
  }

  console.log('Playbook index complete.');
  console.log(`Indexed modules: ${repoIndex.modules.length}`);
  console.log('Wrote .playbook/repo-index.json');
}
