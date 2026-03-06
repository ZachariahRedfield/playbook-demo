import path from 'node:path';
import { listDirectories, listFiles, writeJsonFile } from '../lib/files.js';

export function createRepoIndex() {
  const features = listDirectories('src/features');
  const modules = features.map((feature) => {
    const moduleRoot = path.join('src/features', feature);
    return {
      name: feature,
      path: moduleRoot,
      files: listFiles(moduleRoot)
    };
  });

  return {
    generatedAt: 'deterministic-demo',
    modules,
    docs: listFiles('docs').filter((file) => file.endsWith('.md')).sort()
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
