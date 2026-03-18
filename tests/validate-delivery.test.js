import test from 'node:test';
import assert from 'node:assert/strict';

import { collectDeliveryMetadata, validateDeliveryMetadata } from '../scripts/validate-delivery.mjs';

const FEATURE_IDS = [
  'PB-V03-INDEX-001',
  'PB-V04-PLAN-APPLY-001',
  'PB-V05-PACKAGE-BOUNDARIES-001',
  'PB-V1-DEMO-REFRESH-001'
];

test('validateDeliveryMetadata passes in CI when approved feature_id is referenced', () => {
  const textToValidate = collectDeliveryMetadata(
    { PR_TITLE: 'Fix refresh PB-V1-DEMO-REFRESH-001', PR_BODY: '', GITHUB_HEAD_REF: '' },
    'minor commit message'
  );

  const result = validateDeliveryMetadata({ featureIds: FEATURE_IDS, textToValidate, isCi: true });

  assert.equal(result.strictEnforced, true);
  assert.deepEqual(result.referencedIds, ['PB-V1-DEMO-REFRESH-001']);
  assert.match(result.message, /Delivery validation passed/);
});

test('validateDeliveryMetadata fails in CI with deterministic message when no feature_id is referenced', () => {
  const textToValidate = collectDeliveryMetadata(
    { PR_TITLE: 'Fix refresh linkage', PR_BODY: 'No roadmap id', GITHUB_HEAD_REF: 'codex/demo-refresh-fix' },
    'commit without linkage'
  );

  assert.throws(
    () => validateDeliveryMetadata({ featureIds: FEATURE_IDS, textToValidate, isCi: true }),
    /Delivery metadata must reference at least one roadmap feature_id/
  );
});
