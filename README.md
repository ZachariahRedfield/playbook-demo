# Playbook Demo Repository

A deliberately small repository with **intentional, safe findings** so you can experience the full Playbook workflow in under a minute.

## 30-Second First Run

Run this exact sequence on a fresh clone:

```bash
git clone https://github.com/ZachariahRedfield/playbook-demo
cd playbook-demo
npm install
npx playbook analyze
npx playbook verify
npx playbook plan
npx playbook apply
npx playbook verify
```

Expected behavior:
- The first `verify` fails (findings still exist).
- `plan` shows deterministic remediation steps.
- `apply` resolves the issues.
- The final `verify` passes.

## Expected Demo Lifecycle

Initial state
↓
`analyze` → architecture insights
`verify` → rule violations
`plan` → proposed remediation
`apply` → automatic remediation
`verify` → clean state

## What Playbook Looks Like

Before `apply`:

❌ PB001 Documentation drift  
❌ PB002 Missing changelog entry  
❌ PB003 Checklist drift  
❌ PB004 Structural naming issue  
❌ PB005 Missing notes marker

After `apply`:

✅ Repository discipline verified

## Command Model

Core guided flow:

- `npx playbook analyze` — structure-aware architecture signal.
- `npx playbook verify` — discipline gate; exits nonzero while findings exist.
- `npx playbook plan` — deterministic remediation plan for active findings.
- `npx playbook apply` — applies safe fixes for active findings.

Additional discovery commands:

- `npx playbook doctor` — verifies demo prerequisites are present.
- `npx playbook diagram` — prints a lightweight architecture tree.
- `npx playbook rules` — lists all active demo rules.

## Expected Initial State

On a fresh clone, the demo reports exactly **5 findings**:

- `[PB001]` Documentation drift in architecture docs
- `[PB002]` Missing changelog entry for users feature
- `[PB003]` Checklist drift: apply step is missing
- `[PB004]` Structural inconsistency in workout type naming
- `[PB005]` Missing expected notes artifact marker

These findings are intentional and power the guided demo narrative.

## Demo Repository Structure

This repository simulates a small product repository with:

- documentation
- feature changes
- governance checklists
- architecture notes

Playbook enforces discipline across these artifacts.

## Why the Demo Contains Findings

This repository intentionally contains a small number of realistic repository discipline issues.

These simulate common problems that appear as repositories evolve:

- documentation drift
- missing changelog entries
- checklist omissions
- naming inconsistencies
- missing governance artifacts

Playbook detects and safely remediates these issues.

## Maintainer Note

This repository must remain deterministic.

The initial state should always contain exactly five findings:

PB001
PB002
PB003
PB004
PB005

If command surface or rule behavior changes in Playbook, this demo must be updated so the guided run remains stable and educational.

## Scenario Reference

See `.playbook/demo-scenarios.md` for a finding-by-finding scenario map and maintainer alignment note.
