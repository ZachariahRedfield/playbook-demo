# Playbook Demo Repository

A deliberately small repository with **intentional, safe findings** so you can experience the full Playbook discipline quickly.

## 30-Second First Run

Run this exact sequence on a fresh clone:

```bash
npm install
npx playbook status
npx playbook verify
npx playbook explain
npx playbook fix
npx playbook verify
```

Expected behavior:
- The first `verify` fails (findings still exist).
- After `fix`, `verify` passes.

## What Playbook Looks Like

Before fix:

❌ PB001 Documentation drift  
❌ PB002 Missing changelog entry  
❌ PB003 Checklist drift  
❌ PB004 Structural naming issue  
❌ PB005 Missing notes marker

After fix:

✅ Repository discipline verified  

## Command Model (What each command means)

- `npx playbook analyze` — **repository shape**: features, docs, scenario presence, and guided command model.
- `npx playbook status` — **repository discipline**: active rule findings and health summary.
- `npx playbook verify` — **repository discipline gate**: fails with nonzero exit while findings remain; passes when clean.
- `npx playbook explain` — why each active finding matters.
- `npx playbook fix` — apply safe remediations for active findings.

In short:
- `analyze` = **what is here and how it is organized**
- `status` / `verify` = **what discipline rules are currently failing**

## Expected Initial State

On a fresh clone, the demo reports exactly **5 findings**:

- `[PB001]` Documentation drift in architecture docs
- `[PB002]` Missing changelog entry for users feature
- `[PB003]` Checklist drift: verify step is missing
- `[PB004]` Structural inconsistency in workout type naming
- `[PB005]` Missing expected notes artifact marker

These findings are intentional and power the guided demo narrative.

## Optional Exploration (after first run)

```bash
npx playbook analyze
npx playbook status
npx playbook explain
```

Use this pass to compare structure awareness (`analyze`) versus discipline enforcement (`status`/`verify`).

## Scenario Reference

See `.playbook/demo-scenarios.md` for a finding-by-finding scenario map and maintainer alignment note.
