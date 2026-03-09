import { createRepoIndex } from './index.js';
import { readFile, pathExists } from '../lib/files.js';
import { RULES } from '../rules/index.js';

function explainArchitecture(repoIndex) {
  return {
    target: 'architecture',
    summary: 'The demo repository is organized around feature modules under src/features and process docs under docs/.',
    framework: repoIndex.framework,
    language: repoIndex.language,
    architecture: repoIndex.architecture,
    modules: repoIndex.modules.map((module) => module.name),
    docs: repoIndex.docs
  };
}

function explainRule(ruleId) {
  const rule = RULES.find((candidate) => candidate.id.toLowerCase() === ruleId.toLowerCase());
  if (!rule) {
    return null;
  }

  return {
    target: rule.id,
    kind: 'rule',
    title: rule.title,
    severity: rule.severity,
    explain: rule.explain
  };
}

function explainModule(moduleName, repoIndex) {
  const module = repoIndex.modules.find((candidate) => candidate.name.toLowerCase() === moduleName.toLowerCase());
  if (!module) {
    return null;
  }

  return {
    target: module.name,
    kind: 'module',
    path: module.path,
    files: module.files
  };
}

function loadRepoIndex() {
  if (!pathExists('.playbook/repo-index.json')) {
    return createRepoIndex();
  }

  return JSON.parse(readFile('.playbook/repo-index.json'));
}

export function runExplain({ target, json = false } = {}) {
  if (!target) {
    console.error('Usage: playbook explain <architecture|RULE_ID|module-name> [--json]');
    process.exit(1);
  }

  const repoIndex = loadRepoIndex();
  const loweredTarget = target.toLowerCase();
  const payload =
    loweredTarget === 'architecture'
      ? explainArchitecture(repoIndex)
      : explainRule(target) ?? explainModule(target, repoIndex);

  if (!payload) {
    console.error(`No explanation target found for "${target}".`);
    process.exit(1);
  }

  if (json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log('Playbook Explanation\n');
  console.log(JSON.stringify(payload, null, 2));
}
