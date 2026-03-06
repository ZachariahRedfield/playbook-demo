# Playbook Demo Scenarios

Scenario 1 — Documentation Drift

`docs/ARCHITECTURE.md` is slightly out of sync with `src/features` and omits the users feature.

Commands demonstrated:

- `npx playbook status`
- `npx playbook explain`
- `npx playbook fix`
- `npx playbook verify`

Scenario 2 — Missing Changelog Entry

`docs/CHANGELOG.md` does not include a note for the user profile service.

Commands demonstrated:

- `npx playbook status`
- `npx playbook explain`
- `npx playbook fix`
- `npx playbook verify`

Scenario 3 — Checklist Drift

`docs/PLAYBOOK_CHECKLIST.md` is missing the Verify section.

Commands demonstrated:

- `npx playbook status`
- `npx playbook explain`
- `npx playbook fix`
- `npx playbook verify`

Scenario 4 — Structural Inconsistency

`src/features/workouts/workout-types.ts` exports `Workout` instead of the expected `WorkoutPlan` type.

Commands demonstrated:

- `npx playbook status`
- `npx playbook explain`
- `npx playbook fix`
- `npx playbook verify`

Scenario 5 — Missing Expected Artifact

`docs/PLAYBOOK_NOTES.md` is missing a `Last Verified:` marker.

Commands demonstrated:

- `npx playbook status`
- `npx playbook explain`
- `npx playbook fix`
- `npx playbook verify`
