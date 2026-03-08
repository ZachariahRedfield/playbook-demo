import fs from 'node:fs';

const roadmapPath = new URL('../docs/roadmap/ROADMAP.json', import.meta.url);
const raw = fs.readFileSync(roadmapPath, 'utf8');
const roadmap = JSON.parse(raw);

if (roadmap.schemaVersion !== '1.0') {
  throw new Error('ROADMAP schemaVersion must be 1.0');
}

if (!Array.isArray(roadmap.features) || roadmap.features.length === 0) {
  throw new Error('ROADMAP must contain at least one feature entry.');
}

const requiredKeys = [
  'feature_id',
  'version',
  'title',
  'goal',
  'commands',
  'contracts',
  'tests',
  'docs',
  'dependencies',
  'verification_commands',
  'status'
];

const seenIds = new Set();

for (const feature of roadmap.features) {
  for (const key of requiredKeys) {
    if (!(key in feature)) {
      throw new Error(`Feature ${feature.feature_id ?? '<unknown>'} missing required key: ${key}`);
    }
  }

  if (seenIds.has(feature.feature_id)) {
    throw new Error(`Duplicate feature_id found: ${feature.feature_id}`);
  }
  seenIds.add(feature.feature_id);

  if (!Array.isArray(feature.verification_commands) || feature.verification_commands.length === 0) {
    throw new Error(`Feature ${feature.feature_id} must include verification_commands.`);
  }

  if (!['planned', 'in_progress', 'completed'].includes(feature.status)) {
    throw new Error(`Feature ${feature.feature_id} has unsupported status: ${feature.status}`);
  }
}

console.log(`Validated roadmap: ${roadmap.features.length} feature entries.`);
