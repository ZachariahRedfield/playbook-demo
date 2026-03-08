import { execSync } from 'node:child_process';
import fs from 'node:fs';

const roadmap = JSON.parse(fs.readFileSync(new URL('../docs/roadmap/ROADMAP.json', import.meta.url), 'utf8'));
const featureIds = roadmap.features.map((feature) => feature.feature_id);

const ciText = [process.env.PR_TITLE, process.env.PR_BODY, process.env.GITHUB_HEAD_REF].filter(Boolean).join('\n');
const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
const textToValidate = `${ciText}\n${commitMessage}`;

const referencedIds = featureIds.filter((featureId) => textToValidate.includes(featureId));

if (referencedIds.length === 0) {
  if (process.env.CI === 'true') {
    throw new Error(
      `Delivery metadata must reference at least one roadmap feature_id. Expected one of: ${featureIds.join(', ')}`
    );
  }

  console.log('Delivery validation skipped strict enforcement outside CI (no feature_id found).');
  process.exit(0);
}

console.log(`Delivery validation passed. Referenced feature(s): ${referencedIds.join(', ')}`);
