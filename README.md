# Playbook Demo Repository

A deliberately small repository with **intentional, safe findings** so you can experience the full Playbook discipline in under 30 seconds.

## 30-Second Guided Workflow

Run these commands in order:

```bash
npm install
npx playbook status
npx playbook explain
npx playbook fix
npx playbook verify
```

> The first `verify` before `fix` is expected to fail in this demo.

## Supported Demo Commands

- `npx playbook status` — issue-oriented health summary and active findings.
- `npx playbook analyze` — structure-oriented repository profile (features, docs, scenarios, command flow).
- `npx playbook explain` — why each active finding matters.
- `npx playbook fix` — apply safe remediations for active findings.
- `npx playbook verify` — exit nonzero while findings remain; pass when clean.

## Expected Initial State

On a fresh clone, the demo reports exactly **5 findings**. This is intentional and part of the guided-imperfection narrative.

- `[PB001]` Documentation drift in architecture docs
- `[PB002]` Missing changelog entry for users feature
- `[PB003]` Checklist drift: verify step is missing
- `[PB004]` Structural inconsistency in workout type naming
- `[PB005]` Missing expected notes artifact marker

After `npx playbook fix`, `npx playbook verify` should pass.

## Why `analyze` and `status` are different

- `analyze` answers: **what shape is this repository?**
- `status` answers: **what discipline rules are currently failing?**

Keeping these concepts separate mirrors Playbook's product architecture: structure understanding is distinct from rule verification.

## Demo Narrative

1. `status` reports repository health and surfaces the 5 expected findings.
2. `explain` clarifies each finding's purpose in team workflow discipline.
3. `fix` applies only small, safe updates to docs and source naming.
4. `verify` confirms the discipline loop is complete.

See `.playbook/demo-scenarios.md` for a finding-by-finding scenario map.
