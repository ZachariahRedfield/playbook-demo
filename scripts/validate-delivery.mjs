import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function readRoadmapFeatureIds() {
  const roadmap = JSON.parse(fs.readFileSync(new URL('../docs/roadmap/ROADMAP.json', import.meta.url), 'utf8'));
  return roadmap.features.map((feature) => feature.feature_id);
}

function collectDeliveryMetadata(env, commitMessage) {
  const ciText = [env.PR_TITLE, env.PR_BODY, env.GITHUB_HEAD_REF].filter(Boolean).join('\n');
  return `${ciText}\n${commitMessage}`;
}

function resolveReferencedFeatureIds(featureIds, textToValidate) {
  return featureIds.filter((featureId) => textToValidate.includes(featureId));
}

function validateDeliveryMetadata({ featureIds, textToValidate, isCi }) {
  const referencedIds = resolveReferencedFeatureIds(featureIds, textToValidate);

  if (referencedIds.length === 0) {
    if (isCi) {
      throw new Error(
        `Delivery metadata must reference at least one roadmap feature_id. Expected one of: ${featureIds.join(', ')}`
      );
    }

    return {
      ok: true,
      strictEnforced: false,
      message: 'Delivery validation skipped strict enforcement outside CI (no feature_id found).',
      referencedIds
    };
  }

  return {
    ok: true,
    strictEnforced: true,
    message: `Delivery validation passed. Referenced feature(s): ${referencedIds.join(', ')}`,
    referencedIds
  };
}

function main() {
  const featureIds = readRoadmapFeatureIds();
  const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  const textToValidate = collectDeliveryMetadata(process.env, commitMessage);

  const result = validateDeliveryMetadata({
    featureIds,
    textToValidate,
    isCi: process.env.CI === 'true'
  });

  console.log(result.message);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

export { readRoadmapFeatureIds, collectDeliveryMetadata, resolveReferencedFeatureIds, validateDeliveryMetadata };
