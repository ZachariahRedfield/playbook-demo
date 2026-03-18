# Playbook Demo Scenarios

This repository intentionally starts with 4 active findings (`PB002`, `PB003`, `PB004`, and `PB005`) so users can experience the discipline flow:

`verify` → `plan` → `apply` → `verify`

A first `verify` is expected to fail before fixes are applied, and `verify --json` should return `ok: false` with those same four finding IDs.

`analyze` is intentionally separate from that flow: it reports repository structure, while `verify` reports rule discipline health.

## Finding Map

### PB001 — Documentation drift in architecture docs

- **Scenario:** `docs/ARCHITECTURE.md` has a `## Features` section but omits `users` even though `src/features/users` exists.
- **Purpose:** Demonstrates that architecture docs should reflect real repository structure.
- **Why high-signal:** Missing feature documentation creates onboarding and ownership confusion.
- **Current baseline note:** This rule remains part of the guided demo and can still be reproduced in targeted fixtures, but managed-doc regeneration now keeps PB001 satisfied in the checked-in baseline so fresh walkthroughs begin with PB002–PB005.

### PB002 — Missing changelog entry for users feature

- **Scenario:** `docs/CHANGELOG.md` has no entry for user profile retrieval support.
- **Purpose:** Demonstrates release-traceability discipline.
- **Why high-signal:** If features are not logged, teams lose deployment context quickly.

### PB003 — Checklist drift: apply step is missing

- **Scenario:** `docs/PLAYBOOK_CHECKLIST.md` stops at Plan and omits Apply.
- **Purpose:** Reinforces the full quality loop as process, not just detection.
- **Why high-signal:** A missing apply step blocks closure of deterministic remediation.

### PB004 — Structural inconsistency in workout type naming

- **Scenario:** `src/features/workouts/workout-types.ts` exports `Workout` while this demo's naming convention expects `WorkoutPlan` for feature domain types consumed by services.
- **Purpose:** Demonstrates a concrete structural convention that keeps feature APIs predictable.
- **Why high-signal:** Inconsistent type names increase cognitive load and make rule-based maintenance harder.

### PB005 — Missing expected notes artifact marker

- **Scenario:** `docs/PLAYBOOK_NOTES.md` lacks a `Last Verified:` marker.
- **Purpose:** Demonstrates lightweight operational metadata in project notes.
- **Why high-signal:** Without a verification marker, note freshness is ambiguous.

## Command Sequence Used in Every Guided Run

1. `npx playbook analyze`
2. `npx playbook verify`
3. `npx playbook plan`
4. `npx playbook apply`
5. `npx playbook verify`

## Maintainer Alignment Note

When Playbook command terminology or product framing changes in the main project, revalidate this demo's `README`, this scenario map, and command wording in CLI output so structure (`analyze`) versus discipline (`verify`) stays explicit and consistent.
