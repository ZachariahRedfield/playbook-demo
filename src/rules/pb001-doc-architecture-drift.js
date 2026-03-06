import { readFile, writeFile } from '../lib/files.js';

const ARCHITECTURE_DOC_PATH = 'docs/ARCHITECTURE.md';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function architectureHasFeature(featureName) {
  const architectureDoc = readFile(ARCHITECTURE_DOC_PATH);
  const featurePattern = new RegExp(`^\\s*-\\s+${escapeRegExp(featureName)}\\s*$`, 'm');
  return featurePattern.test(architectureDoc);
}

function addArchitectureFeature(featureName) {
  const architectureDoc = readFile(ARCHITECTURE_DOC_PATH);
  if (architectureHasFeature(featureName)) {
    return;
  }

  const featurePattern = /^## Features\s*\n([\s\S]*?)(?:\n##\s|$)/m;
  const featureMatch = architectureDoc.match(featurePattern);

  if (featureMatch) {
    const sectionText = featureMatch[0];
    const sectionStart = featureMatch.index;
    const sectionEnd = sectionStart + sectionText.length;
    const beforeSection = architectureDoc.slice(0, sectionEnd).replace(/\s*$/, '');
    const afterSection = architectureDoc.slice(sectionEnd);
    writeFile(ARCHITECTURE_DOC_PATH, `${beforeSection}\n- ${featureName}\n${afterSection}`);
    return;
  }

  const separator = architectureDoc.endsWith('\n') ? '' : '\n';
  writeFile(ARCHITECTURE_DOC_PATH, `${architectureDoc}${separator}\n## Features\n\n- workouts\n- ${featureName}\n`);
}

export const PB001_DOC_ARCHITECTURE_DRIFT = {
  id: 'PB001',
  title: 'Documentation drift in architecture docs',
  severity: 'medium',
  check: () => architectureHasFeature('users'),
  explain:
    'ARCHITECTURE.md should list both workouts and users in its Features section so docs match the current repository structure.',
  fix: () => addArchitectureFeature('users')
};
