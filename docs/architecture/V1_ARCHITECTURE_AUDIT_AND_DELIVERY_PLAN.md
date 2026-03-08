# Playbook v1 Architecture Audit and Deterministic Delivery Plan

## Implemented repository changes in this PR

### 1) Module boundary correction (CLI → engine registry)

- Added `src/engine/command-registry.js` as the canonical command inventory and execution registry.
- Refactored `src/cli.js` to resolve command handlers through the registry instead of a local switch.
- Added registry integrity checks to fail fast when command metadata, order, and runners drift.

### 2) Shared repository profile provider

- Added `src/engine/repository-profile.js` to centralize repository profile data used by `analyze`.
- Refactored `src/commands/analyze.js` to consume shared profile data from engine layer.

### 3) Documentation restructuring

- Introduced `docs/roadmap/ROADMAP.json` as machine-readable roadmap contract entries.
- Added `docs/contracts/COMMAND_CONTRACTS_V1.md` for stable command output expectations.
- Added `docs/contracts/ARTIFACT_EVOLUTION_POLICY.md` to enforce schema/version evolution discipline.

### 4) CI rule additions and deterministic governance

- Added `scripts/validate-roadmap.mjs` to validate roadmap schema and status integrity.
- Added `scripts/validate-delivery.mjs` to enforce roadmap feature linkage in commit messages.
- Updated CI to run deterministic governance checks on push and pull requests.

## Explicit file moves and follow-up moves

Completed now:
- New docs grouped under `docs/architecture/`, `docs/contracts/`, and `docs/roadmap/`.

Follow-up file moves (next PR):
- Move `docs/PLAYBOOK_PRODUCT_ROADMAP.md` → `docs/roadmap/PRODUCT_ROADMAP.md`.
- Move `docs/ARCHITECTURE.md` and `docs/ARCHITECTURE_DIAGRAMS.md` under `docs/architecture/`.
- Keep stubs at old paths for one release to preserve links.

## Suggested PR structure for delivery

1. **PR-1: Boundary and registry hardening**
   - Scope: `src/cli.js`, `src/engine/command-registry.js`, `src/engine/repository-profile.js`.
   - Acceptance: no command behavior drift; tests pass.

2. **PR-2: Contracts and docs governance**
   - Scope: `docs/contracts/*`, `docs/roadmap/ROADMAP.json`.
   - Acceptance: contracts and roadmap schema validate in CI.

3. **PR-3: Delivery-system CI gates**
   - Scope: `.github/workflows/playbook.yml`, `scripts/validate-roadmap.mjs`, `scripts/validate-delivery.mjs`.
   - Acceptance: PR fails when roadmap IDs are missing.

## Deterministic rules to enforce in v1

- One canonical command registry and thin CLI wrappers.
- Any JSON contract change requires docs + tests + roadmap linkage.
- PRs must reference a `feature_id` from `docs/roadmap/ROADMAP.json`.
