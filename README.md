# Playbook Demo Repository

A deliberately small repository with **intentional, safe findings** so you can experience the full Playbook discipline in under 30 seconds.

## First-Run Workflow (recommended)

Run these commands in order:

```bash
npm install
npx playbook status
npx playbook explain
npx playbook fix
npx playbook verify
```

CI-style check before fixes (expected to fail in the initial state):

```bash
npx playbook verify --ci
```

## Expected Initial State

On a fresh clone, the demo should report exactly **5 findings**. This is intentional and part of the guided-imperfection narrative.

- `[PB001]` Documentation drift in architecture docs
- `[PB002]` Missing changelog entry for users feature
- `[PB003]` Checklist drift: verify step is missing
- `[PB004]` Structural inconsistency in workout type naming
- `[PB005]` Missing expected notes artifact marker

After `npx playbook fix`, `npx playbook verify` should pass.

## What This Demonstrates

- **status**: detect repository discipline gaps quickly
- **explain**: understand why each finding matters
- **fix**: apply safe, scoped remediations
- **verify**: confirm the repo is healthy end-to-end

Optional deeper exploration:

```bash
npx playbook rules --explain
npx playbook analyze
```

## Demo Narrative (30 seconds)

1. `status` reports repository health and surfaces the 5 expected findings.
2. `explain` clarifies each finding's purpose in team workflow discipline.
3. `fix` applies only small, safe updates to docs and source naming.
4. `verify` confirms the discipline loop is complete.

See `.playbook/demo-scenarios.md` for a finding-by-finding scenario map.
